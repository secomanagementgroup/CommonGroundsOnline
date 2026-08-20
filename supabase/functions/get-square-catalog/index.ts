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
    image_id?: string;
  };
  image_data?: {
    url?: string;
  };
}

interface SquareCatalogResponse {
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

    const catalogResponse = await fetch(
      "https://connect.squareup.com/v2/catalog/list?types=ITEM,IMAGE",
      {
        method: "GET",
        headers: {
          "Square-Version": "2024-08-21",
          "Authorization": `Bearer ${config.access_token}`,
          "Content-Type": "application/json",
        },
      },
    );

    const catalogData: SquareCatalogResponse = await catalogResponse.json();

    if (!catalogResponse.ok) {
      console.error("Square catalog error:", JSON.stringify(catalogData));
      const errMsg = catalogData?.errors?.[0]?.detail || "Failed to fetch catalog.";
      return new Response(
        JSON.stringify({ error: errMsg }),
        { status: catalogResponse.status, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const objects = catalogData.objects || [];

    const imageMap = new Map<string, string>();
    for (const obj of objects) {
      if (obj.type === "IMAGE" && obj.image_data?.url) {
        imageMap.set(obj.id, obj.image_data.url);
      }
    }

    const items = objects.filter((o) => o.type === "ITEM" && o.item_data);

    const products = items.map((item) => {
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
    }).filter((p) => p.variations.length > 0);

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
