import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3"
import { hmac } from "https://deno.land/x/hmac@v2.0.1/mod.ts"

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders })
  }

  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = await req.json()
    
    // Get user from auth header
    const authHeader = req.headers.get('Authorization')!
    const token = authHeader.replace('Bearer ', '')

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: authHeader } } }
    )
    
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser()
    if (userError || !user) throw new Error('Unauthorized')

    const secret = Deno.env.get("RAZORPAY_KEY_SECRET")
    if (!secret) throw new Error("Missing Razorpay API keys")

    // Verify signature
    const text = razorpay_order_id + "|" + razorpay_payment_id
    const generated_signature = hmac("sha256", secret, text, "utf8", "hex")

    if (generated_signature !== razorpay_signature) {
      throw new Error("Invalid signature")
    }

    // Initialize Supabase Admin client to bypass RLS
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Check if user already purchased
    const { data: existingPurchase } = await supabaseAdmin
      .from('user_purchases')
      .select('*')
      .eq('user_id', user.id)
      .single()
      
    if (existingPurchase && existingPurchase.status === 'successful') {
        return new Response(JSON.stringify({ success: true, message: "Already purchased" }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200,
        })
    }

    // Insert purchase record
    const { error: insertError } = await supabaseAdmin
      .from('user_purchases')
      .upsert({
        user_id: user.id,
        amount_inr: 199,
        razorpay_order_id,
        razorpay_payment_id,
        status: 'successful'
      }, { onConflict: 'user_id' })

    if (insertError) {
      throw insertError
    }

    return new Response(JSON.stringify({ success: true }), {
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
