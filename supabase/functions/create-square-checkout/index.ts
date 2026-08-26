import { createClient } from "npm:@supabase/supabase-js@2.57.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface CartItemInput {
  id: string;
  name: string;
  sizeLabel: string;
  flavor?: string;
  milk: string;
  quantity: number;
  priceCents: number;
  squareVariationId: string;
  squareItemId: string;
  squareModifierListId: string;
}

const MILK_MODIFIER_IDS: Record<string, string> = {
  oat: "QLEGJGITI3AFVT2N4XO5SIDO",
  whole: "RKV2VHMJEXJHZQQ67CIRECXA",
};

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

    const { orderId, items, customerName, customerPhone, notes, returnUrl } = await req.json() as {
      orderId: string;
      items: CartItemInput[];
      customerName: string | null;
      customerPhone: string | null;
      notes: string | null;
      returnUrl?: string;
    };

    if (!items || items.length === 0) {
      return new Response(
        JSON.stringify({ error: "No items in order." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const lineItems = items.map((item) => {
      const modifiers = [];
      const milkModId = MILK_MODIFIER_IDS[item.milk];
      if (milkModId) {
        modifiers.push({
          catalog_object_id: milkModId,
          quantity: "1",
        });
      }

      const name = item.flavor
        ? `${item.name} — ${item.flavor} (${item.sizeLabel})`
        : `${item.name} (${item.sizeLabel})`;

      return {
        quantity: String(item.quantity),
        catalog_object_id: item.squareVariationId,
        catalog_object_type: "ITEM_VARIATION",
        modifiers,
        note: `${name} · Milk: ${item.milk === "oat" ? "Oat" : "Whole Milk"}`,
      };
    });

    const orderNoteParts: string[] = [`Order ID: ${orderId}`];
    if (customerName) orderNoteParts.push(`Name: ${customerName}`);
    if (customerPhone) orderNoteParts.push(`Phone: ${customerPhone}`);
    if (notes) orderNoteParts.push(`Notes: ${notes}`);

    const baseUrl = returnUrl || `${new URL(req.url).origin}/`;
    const redirectUrl = `${baseUrl}${baseUrl.includes('?') ? '&' : '?'}order_id=${orderId}`;

    const squareResponse = await fetch(
      "https://connect.squareup.com/v2/online-checkout/payment-links",
      {
        method: "POST",
        headers: {
          "Square-Version": "2024-08-21",
          "Authorization": `Bearer ${config.access_token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          idempotency_key: orderId,
          order: {
            location_id: config.location_id,
            line_items: lineItems,
          },
          checkout_options: {
            redirect_url: redirectUrl,
            ask_for_shipping_address: false,
          },
          description: orderNoteParts.join(" · "),
        }),
      },
    );

    const squareData = await squareResponse.json();

    if (!squareResponse.ok) {
      console.error("Square error:", JSON.stringify(squareData));
      const errMsg = squareData?.errors?.[0]?.detail || "Square checkout creation failed.";
      return new Response(
        JSON.stringify({ error: errMsg }),
        { status: squareResponse.status, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    await supabase
      .from("orders")
      .update({ status: "checkout_started" })
      .eq("id", orderId);

    return new Response(
      JSON.stringify({ checkoutUrl: squareData.payment_link.url }),
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
