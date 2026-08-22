import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders })
  }

  try {
    const RAZORPAY_KEY_ID = Deno.env.get("RAZORPAY_KEY_ID")
    const RAZORPAY_KEY_SECRET = Deno.env.get("RAZORPAY_KEY_SECRET")

    if (!RAZORPAY_KEY_ID || !RAZORPAY_KEY_SECRET) {
      throw new Error("Missing Razorpay API keys")
    }

    // Always 199 INR
    const amount = 19900 // Amount in paise (199 * 100)
    const currency = "INR"

    // Call Razorpay API to create order
    const auth = btoa(${RAZORPAY_KEY_ID}:)
    const response = await fetch("https://api.razorpay.com/v1/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Basic " + auth,
      },
      body: JSON.stringify({
        amount,
        currency,
        receipt: "receipt_" + Date.now(),
      }),
    })

    const orderData = await response.json()

    if (!response.ok) {
      throw new Error(orderData.error?.description || "Failed to create order")
    }

    return new Response(JSON.stringify(orderData), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 400,
    })
  }
})
