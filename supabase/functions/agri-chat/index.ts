import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

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

// Input validation constants
const MAX_MESSAGES = 50;
const MAX_MESSAGE_LENGTH = 4000;
const VALID_ROLES = ["user", "assistant"];

interface ChatMessage {
  role: string;
  content: string;
}

function validateMessages(messages: unknown): { valid: boolean; error?: string; messages?: ChatMessage[] } {
  // Check if messages exists and is an array
  if (!messages || !Array.isArray(messages)) {
    return { valid: false, error: "Messages must be an array" };
  }

  // Check message count
  if (messages.length === 0) {
    return { valid: false, error: "At least one message is required" };
  }

  if (messages.length > MAX_MESSAGES) {
    return { valid: false, error: `Maximum ${MAX_MESSAGES} messages allowed` };
  }

  // Validate each message
  const validatedMessages: ChatMessage[] = [];
  for (let i = 0; i < messages.length; i++) {
    const msg = messages[i];
    
    if (!msg || typeof msg !== "object") {
      return { valid: false, error: `Message ${i + 1} is invalid` };
    }

    const { role, content } = msg as { role?: unknown; content?: unknown };

    // Validate role
    if (!role || typeof role !== "string" || !VALID_ROLES.includes(role)) {
      return { valid: false, error: `Message ${i + 1} has invalid role` };
    }

    // Validate content
    if (!content || typeof content !== "string") {
      return { valid: false, error: `Message ${i + 1} has invalid content` };
    }

    // Check content length
    if (content.length === 0) {
      return { valid: false, error: `Message ${i + 1} content cannot be empty` };
    }

    if (content.length > MAX_MESSAGE_LENGTH) {
      return { valid: false, error: `Message ${i + 1} exceeds maximum length of ${MAX_MESSAGE_LENGTH} characters` };
    }

    // Sanitize content - trim whitespace
    validatedMessages.push({
      role: role,
      content: content.trim()
    });
  }

  return { valid: true, messages: validatedMessages };
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Validate JWT authentication
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return new Response(
        JSON.stringify({ error: "Authorization required" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Verify user authentication using Supabase client
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: authHeader } } }
    );

    const { data: { user }, error: userError } = await supabaseClient.auth.getUser();
    
    if (userError || !user) {
      return new Response(
        JSON.stringify({ error: "Invalid or expired authentication token" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // User is now authenticated - user.id contains the user ID

    // Parse and validate request body
    let requestBody: unknown;
    try {
      requestBody = await req.json();
    } catch {
      return new Response(
        JSON.stringify({ error: "Invalid JSON in request body" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const { messages: rawMessages } = requestBody as { messages?: unknown };
    
    // Validate messages
    const validation = validateMessages(rawMessages);
    if (!validation.valid) {
      return new Response(
        JSON.stringify({ error: validation.error }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const messages = validation.messages!;
    
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      console.error("LOVABLE_API_KEY is not configured");
      return new Response(
        JSON.stringify({ error: "AI service configuration error" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "openai/gpt-5",
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
      
      console.error("AI gateway error:", response.status);
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
      JSON.stringify({ error: "An unexpected error occurred. Please try again." }), 
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
