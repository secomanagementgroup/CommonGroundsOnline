import { createClient } from "npm:@supabase/supabase-js@2.57.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface SquareObject {
  type: string;
  id: string;
  item_data?: {
    name: string;
    description?: string;
    image_id?: string;
    variations: SquareObject[];
  };
  item_variation_data?: {
    item_id: string;
    name: string;
    price_money?: { amount: number; currency: string };
  };
  image_data?: {
    url?: string;
  };
}

interface SquareListResponse {
  objects?: SquareObject[];
  errors?: { code: string; detail: string }[];
  cursor?: string;
}

interface SquareBatchResponse {
  objects?: SquareObject[];
  errors?: { code: string; detail: string }[];
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    const { data: config, error: configError } = await supabase
      .from("square_config")
      .select("access_token, location_id")
      .eq("id", 1)
      .maybeSingle();

    if (configError || !config) {
      return new Response(
        JSON.stringify({ error: "Square credentials not configured." }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const authHeaders = {
      "Square-Version": "2024-08-21",
      "Authorization": `Bearer ${config.access_token}`,
      "Content-Type": "application/json",
    };

    // Step 1: Fetch all ITEM objects (with pagination)
    const allItems: SquareObject[] = [];
    let cursor: string | undefined;
    do {
      const url = new URL("https://connect.squareup.com/v2/catalog/list");
      url.searchParams.set("types", "ITEM");
      if (cursor) url.searchParams.set("cursor", cursor);

      const resp = await fetch(url, { method: "GET", headers: authHeaders });
      const data: SquareListResponse = await resp.json();

      if (!resp.ok) {
        console.error("Square list error:", JSON.stringify(data));
        const errMsg = data?.errors?.[0]?.detail || "Failed to fetch catalog.";
        return new Response(
          JSON.stringify({ error: errMsg }),
          { status: resp.status, headers: { ...corsHeaders, "Content-Type": "application/json" } },
        );
      }

      allItems.push(...(data.objects || []));
      cursor = data.cursor;
    } while (cursor);

    // Step 2: Collect all image IDs from items
    const imageIds = allItems
      .map((item) => item.item_data?.image_id)
      .filter((id): id is string => Boolean(id));

    // Step 3: Batch-retrieve image objects to get reliable URLs
    const imageMap = new Map<string, string>();

    if (imageIds.length > 0) {
      // BatchRetrieveCatalogObjects accepts up to 1000 IDs at a time
      const chunks: string[][] = [];
      for (let i = 0; i < imageIds.length; i += 1000) {
        chunks.push(imageIds.slice(i, i + 1000));
      }

      for (const chunk of chunks) {
        const batchResp = await fetch(
          "https://connect.squareup.com/v2/catalog/batch-retrieve",
          {
            method: "POST",
            headers: authHeaders,
            body: JSON.stringify({
              object_ids: chunk,
              include_related_objects: false,
            }),
          },
        );

        const batchData: SquareBatchResponse = await batchResp.json();

        if (batchResp.ok && batchData.objects) {
          for (const obj of batchData.objects) {
            if (obj.type === "IMAGE" && obj.image_data?.url) {
              imageMap.set(obj.id, obj.image_data.url);
            }
          }
        } else if (!batchResp.ok) {
          console.error("Square batch-retrieve error:", JSON.stringify(batchData));
        }
      }
    }

    // Step 4: Map items to products
    const products = allItems
      .filter((o) => o.type === "ITEM" && o.item_data)
      .map((item) => {
        const data = item.item_data!;
        const variations = (data.variations || []).filter(
          (v) => v.type === "ITEM_VARIATION" && v.item_variation_data?.price_money,
        );

        return {
          squareItemId: item.id,
          name: data.name,
          description: data.description || "",
          image: data.image_id ? (imageMap.get(data.image_id) || "") : "",
          variations: variations.map((v) => {
            const varData = v.item_variation_data!;
            return {
              squareVariationId: v.id,
              name: varData.name,
              priceCents: varData.price_money!.amount,
            };
          }),
        };
      })
      .filter((p) => p.variations.length > 0);

    return new Response(
      JSON.stringify({ products, cachedAt: Date.now() }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (err) {
    console.error("Edge function error:", err);
    return new Response(
      JSON.stringify({ error: err instanceof Error ? err.message : "Internal server error." }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
