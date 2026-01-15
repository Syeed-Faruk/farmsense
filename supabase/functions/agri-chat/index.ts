import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SYSTEM_PROMPT = `You are AgriWise, a friendly and knowledgeable AI agricultural assistant. Your role is to help farmers and agricultural enthusiasts with:

1. **Crop Selection**: Recommend suitable crops based on soil type, climate, and water availability
2. **Soil Management**: Provide guidance on soil health, fertilization, and amendments
3. **Water Management**: Advise on irrigation techniques, water conservation, and drought-resistant practices
4. **Pest Control**: Help identify and manage common pests using integrated pest management (IPM)
5. **Sustainable Practices**: Promote eco-friendly farming methods aligned with SDG 2 (Zero Hunger)
6. **Crop Rotation**: Explain benefits and suggest rotation schedules
7. **Seasonal Planning**: Guide on planting and harvesting timing

Guidelines for your responses:
- Keep answers clear, practical, and easy to understand
- Use bullet points and formatting for readability
- Provide actionable advice farmers can implement
- When discussing specific crops, mention: soil requirements, water needs, growing season, and sustainability tips
- Always be encouraging and supportive
- If asked about topics outside agriculture, politely redirect to farming-related topics
- Never make guarantees about yields or income - emphasize that outcomes depend on many factors
- Recommend consulting local agricultural extension services for region-specific advice

Remember: You are advisory, not prescriptive. Farmers make the final decisions.`;

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages } = await req.json();
    
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          ...messages,
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }), 
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI service quota exceeded. Please try again later." }), 
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      return new Response(
        JSON.stringify({ error: "Failed to get AI response. Please try again." }), 
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Return the stream directly
    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
    
  } catch (error) {
    console.error("Chat function error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error occurred" }), 
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
