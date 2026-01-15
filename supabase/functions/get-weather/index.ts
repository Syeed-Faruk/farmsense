import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface WeatherData {
  temperature: number;
  humidity: number;
  precipitation: number;
  windSpeed: number;
  weatherCode: number;
  condition: string;
  location: string;
  recommendations: string[];
}

function getWeatherCondition(code: number): string {
  if (code === 0) return "Clear sky";
  if (code <= 3) return "Partly cloudy";
  if (code <= 49) return "Foggy";
  if (code <= 59) return "Drizzle";
  if (code <= 69) return "Rain";
  if (code <= 79) return "Snow";
  if (code <= 84) return "Rain showers";
  if (code <= 86) return "Snow showers";
  if (code >= 95) return "Thunderstorm";
  return "Unknown";
}

function getRecommendations(
  temperature: number,
  humidity: number,
  precipitation: number,
  weatherCode: number
): string[] {
  const recommendations: string[] = [];

  // Temperature-based recommendations
  if (temperature > 35) {
    recommendations.push("🔥 High heat alert: Increase irrigation frequency and consider shade covers for sensitive crops.");
    recommendations.push("💧 Water crops early morning or late evening to reduce evaporation.");
  } else if (temperature > 30) {
    recommendations.push("☀️ Warm conditions: Monitor soil moisture closely and mulch to retain water.");
  } else if (temperature < 10) {
    recommendations.push("❄️ Cool conditions: Protect frost-sensitive crops with covers or move to greenhouses.");
    recommendations.push("🌱 Delay planting of warm-season crops until temperatures rise.");
  } else if (temperature >= 20 && temperature <= 28) {
    recommendations.push("✅ Optimal temperature range for most crops. Good conditions for planting and growth.");
  }

  // Humidity-based recommendations
  if (humidity > 80) {
    recommendations.push("💨 High humidity: Watch for fungal diseases. Ensure good air circulation around plants.");
  } else if (humidity < 30) {
    recommendations.push("🏜️ Low humidity: Increase watering frequency. Consider misting for moisture-loving crops.");
  }

  // Precipitation-based recommendations
  if (precipitation > 10) {
    recommendations.push("🌧️ Heavy rain expected: Ensure proper drainage to prevent waterlogging.");
    recommendations.push("⏸️ Delay fertilizer application until rain passes to prevent runoff.");
  } else if (precipitation > 0) {
    recommendations.push("🌦️ Light rain expected: Good natural irrigation. Reduce manual watering.");
  } else {
    recommendations.push("☀️ No rain expected: Check soil moisture and irrigate as needed.");
  }

  // Weather code specific recommendations
  if (weatherCode >= 95) {
    recommendations.push("⛈️ Thunderstorm alert: Secure loose equipment and delay outdoor farming activities.");
  }
  if (weatherCode >= 71 && weatherCode <= 79) {
    recommendations.push("🌨️ Snow conditions: Protect perennial crops and greenhouse structures.");
  }

  return recommendations.slice(0, 5);
}

serve(async (req) => {
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

    // User is now authenticated - proceed with weather fetch
    const { latitude, longitude, locationName } = await req.json();

    // Validate latitude and longitude types and ranges
    if (typeof latitude !== 'number' || isNaN(latitude) || latitude < -90 || latitude > 90) {
      return new Response(
        JSON.stringify({ error: "Invalid latitude. Must be a number between -90 and 90" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (typeof longitude !== 'number' || isNaN(longitude) || longitude < -180 || longitude > 180) {
      return new Response(
        JSON.stringify({ error: "Invalid longitude. Must be a number between -180 and 180" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Validate optional locationName if provided
    if (locationName !== undefined && typeof locationName !== 'string') {
      return new Response(
        JSON.stringify({ error: "Invalid locationName. Must be a string" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Sanitize locationName to prevent issues in response
    const sanitizedLocationName = locationName ? String(locationName).slice(0, 200) : "";

    // Fetch weather from Open-Meteo API (free, no API key needed)
    const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,precipitation,wind_speed_10m,weather_code&timezone=auto`;
    
    const response = await fetch(weatherUrl);
    
    if (!response.ok) {
      console.error("Weather API error:", response.status);
      return new Response(
        JSON.stringify({ error: "Failed to fetch weather data" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const data = await response.json();
    const current = data.current;

    const weatherData: WeatherData = {
      temperature: Math.round(current.temperature_2m),
      humidity: Math.round(current.relative_humidity_2m),
      precipitation: current.precipitation,
      windSpeed: Math.round(current.wind_speed_10m),
      weatherCode: current.weather_code,
      condition: getWeatherCondition(current.weather_code),
      location: sanitizedLocationName || `${latitude.toFixed(2)}°, ${longitude.toFixed(2)}°`,
      recommendations: getRecommendations(
        current.temperature_2m,
        current.relative_humidity_2m,
        current.precipitation,
        current.weather_code
      ),
    };

    return new Response(
      JSON.stringify(weatherData),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Weather function error:", error);
    return new Response(
      JSON.stringify({ error: "An unexpected error occurred" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
