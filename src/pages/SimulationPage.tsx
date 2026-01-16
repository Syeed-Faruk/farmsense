import { useState, useEffect } from "react";
import { FlaskConical, Droplets, Mountain, RefreshCw, ChevronRight, AlertTriangle, CheckCircle2, AlertCircle, Leaf, Info, Cloud, Thermometer, Wind, MapPin, Loader2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { crops, soilTypes, waterLevels, SoilType, WaterLevel } from "@/data/crops";
import { simulateCropOutcome, SimulationResult, StageResult } from "@/lib/simulation";
import { useToast } from "@/hooks/use-toast";

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

const WEATHER_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/get-weather`;

function StageCard({ stage, index }: { stage: StageResult; index: number }) {
  const conditionColors = {
    Poor: { bg: "bg-destructive/10", text: "text-destructive", icon: AlertTriangle },
    Moderate: { bg: "bg-accent/20", text: "text-secondary", icon: AlertCircle },
    Healthy: { bg: "bg-leaf-light", text: "text-leaf", icon: CheckCircle2 },
  };

  const riskColors = {
    Low: "bg-leaf-light text-leaf",
    Medium: "bg-accent/30 text-secondary",
    High: "bg-destructive/10 text-destructive",
  };

  const sustainColors = {
    Low: "bg-destructive/10 text-destructive",
    Medium: "bg-accent/30 text-secondary",
    High: "bg-leaf-light text-leaf",
  };

  const config = conditionColors[stage.growthCondition];
  const Icon = config.icon;

  return (
    <Card 
      variant="gradient" 
      className="animate-fade-in-up"
      style={{ animationDelay: `${index * 150}ms` }}
    >
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <Badge variant="outline" className="text-sm">
            Stage {index + 1}
          </Badge>
          <div className={`w-10 h-10 rounded-full ${config.bg} flex items-center justify-center`}>
            <Icon className={`w-5 h-5 ${config.text}`} />
          </div>
        </div>
        <CardTitle className="text-lg">{stage.stage}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">{stage.description}</p>

        <div className="grid grid-cols-3 gap-2">
          <div className="text-center p-2 rounded-lg bg-muted/50">
            <p className="text-xs text-muted-foreground mb-1">Growth</p>
            <Badge className={config.bg + " " + config.text + " text-xs"}>
              {stage.growthCondition}
            </Badge>
          </div>
          <div className="text-center p-2 rounded-lg bg-muted/50">
            <p className="text-xs text-muted-foreground mb-1">Risk</p>
            <Badge className={riskColors[stage.riskLevel] + " text-xs"}>
              {stage.riskLevel}
            </Badge>
          </div>
          <div className="text-center p-2 rounded-lg bg-muted/50">
            <p className="text-xs text-muted-foreground mb-1">Sustainability</p>
            <Badge className={sustainColors[stage.sustainabilityImpact] + " text-xs"}>
              {stage.sustainabilityImpact}
            </Badge>
          </div>
        </div>

        <div className="space-y-2">
          <p className="text-xs font-semibold text-foreground flex items-center gap-1">
            <Leaf className="w-3 h-3" /> Tips for this stage:
          </p>
          <ul className="space-y-1">
            {stage.tips.map((tip, i) => (
              <li key={i} className="text-xs text-muted-foreground flex items-start gap-2">
                <ChevronRight className="w-3 h-3 mt-0.5 flex-shrink-0 text-primary" />
                {tip}
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}

function WeatherCard({ weather, isLoading, onRefresh }: { 
  weather: WeatherData | null; 
  isLoading: boolean;
  onRefresh: () => void;
}) {
  if (isLoading) {
    return (
      <Card className="border-water/30 bg-water-light/20">
        <CardContent className="py-8 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-water" />
          <span className="ml-3 text-muted-foreground">Fetching weather data...</span>
        </CardContent>
      </Card>
    );
  }

  if (!weather) {
    return (
      <Card className="border-muted">
        <CardContent className="py-6 text-center">
          <Cloud className="w-12 h-12 mx-auto text-muted-foreground mb-3" />
          <p className="text-muted-foreground mb-3">Enable location to get weather-based recommendations</p>
          <Button onClick={onRefresh} variant="outline" size="sm">
            <MapPin className="w-4 h-4 mr-2" />
            Get My Location
          </Button>
        </CardContent>
      </Card>
    );
  }

  const getWeatherIcon = (code: number) => {
    if (code === 0) return "☀️";
    if (code <= 3) return "⛅";
    if (code <= 49) return "🌫️";
    if (code <= 69) return "🌧️";
    if (code <= 79) return "🌨️";
    if (code <= 86) return "🌧️";
    if (code >= 95) return "⛈️";
    return "🌤️";
  };

  return (
    <Card className="border-water/30 bg-gradient-to-br from-water-light/30 to-card">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Cloud className="w-5 h-5 text-water" />
            Current Weather
          </CardTitle>
          <Button variant="ghost" size="icon" onClick={onRefresh} className="h-8 w-8">
            <RefreshCw className="w-4 h-4" />
          </Button>
        </div>
        <CardDescription className="flex items-center gap-1">
          <MapPin className="w-3 h-3" />
          {weather.location}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Weather Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="text-center p-3 bg-card rounded-lg border">
            <span className="text-3xl">{getWeatherIcon(weather.weatherCode)}</span>
            <p className="text-xs text-muted-foreground mt-1">{weather.condition}</p>
          </div>
          <div className="text-center p-3 bg-card rounded-lg border">
            <div className="flex items-center justify-center gap-1">
              <Thermometer className="w-4 h-4 text-destructive" />
              <span className="text-2xl font-bold">{weather.temperature}°C</span>
            </div>
            <p className="text-xs text-muted-foreground">Temperature</p>
          </div>
          <div className="text-center p-3 bg-card rounded-lg border">
            <div className="flex items-center justify-center gap-1">
              <Droplets className="w-4 h-4 text-water" />
              <span className="text-2xl font-bold">{weather.humidity}%</span>
            </div>
            <p className="text-xs text-muted-foreground">Humidity</p>
          </div>
          <div className="text-center p-3 bg-card rounded-lg border">
            <div className="flex items-center justify-center gap-1">
              <Wind className="w-4 h-4 text-muted-foreground" />
              <span className="text-2xl font-bold">{weather.windSpeed}</span>
              <span className="text-sm">km/h</span>
            </div>
            <p className="text-xs text-muted-foreground">Wind</p>
          </div>
        </div>

        {/* Recommendations */}
        <div className="space-y-2">
          <p className="text-sm font-semibold flex items-center gap-2">
            <Leaf className="w-4 h-4 text-leaf" />
            Weather-Based Recommendations
          </p>
          <ul className="space-y-2">
            {weather.recommendations.map((rec, i) => (
              <li key={i} className="text-sm text-muted-foreground flex items-start gap-2 p-2 bg-muted/30 rounded-lg">
                <ChevronRight className="w-4 h-4 mt-0.5 flex-shrink-0 text-primary" />
                {rec}
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}

export default function SimulationPage() {
  const [selectedCrop, setSelectedCrop] = useState<string>("");
  const [selectedSoil, setSelectedSoil] = useState<SoilType | "">("");
  const [selectedWater, setSelectedWater] = useState<WaterLevel | "">("");
  const [result, setResult] = useState<SimulationResult | null>(null);
  const [isSimulating, setIsSimulating] = useState(false);

  // Weather state
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [isLoadingWeather, setIsLoadingWeather] = useState(false);
  const { toast } = useToast();

  // What-if comparison state
  const [compareMode, setCompareMode] = useState(false);
  const [compareSoil, setCompareSoil] = useState<SoilType | "">("");
  const [compareWater, setCompareWater] = useState<WaterLevel | "">("");
  const [compareResult, setCompareResult] = useState<SimulationResult | null>(null);

  const fetchWeather = async () => {
    setIsLoadingWeather(true);
    
    try {
      // Get user's location
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: false,
          timeout: 10000,
          maximumAge: 300000, // Cache for 5 minutes
        });
      });

      const { latitude, longitude } = position.coords;

      // Get location name using reverse geocoding (optional)
      let locationName = "";
      try {
        const geoResponse = await fetch(
          `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
        );
        const geoData = await geoResponse.json();
        locationName = geoData.address?.city || geoData.address?.town || geoData.address?.village || "";
      } catch {
        // Ignore geocoding errors
      }

      // Fetch weather data
      const response = await fetch(WEATHER_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
        },
        body: JSON.stringify({ latitude, longitude, locationName }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch weather");
      }

      const data = await response.json();
      setWeather(data);
    } catch (error) {
      console.error("Weather fetch error:", error);
      if (error instanceof GeolocationPositionError) {
        toast({
          variant: "destructive",
          title: "Location access denied",
          description: "Please enable location access to get weather recommendations.",
        });
      } else {
        toast({
          variant: "destructive",
          title: "Weather unavailable",
          description: "Could not fetch weather data. Please try again.",
        });
      }
    } finally {
      setIsLoadingWeather(false);
    }
  };

  // Fetch weather on mount
  useEffect(() => {
    if ("geolocation" in navigator) {
      fetchWeather();
    }
  }, []);

  const handleSimulate = () => {
    if (!selectedCrop || !selectedSoil || !selectedWater) return;
    
    setIsSimulating(true);
    setCompareResult(null);
    setCompareMode(false);
    
    // Simulate a brief delay for effect
    setTimeout(() => {
      const crop = crops.find(c => c.id === selectedCrop);
      if (crop) {
        const simResult = simulateCropOutcome(
          selectedCrop,
          crop.name,
          selectedSoil as SoilType,
          selectedWater as WaterLevel
        );
        setResult(simResult);
      }
      setIsSimulating(false);
    }, 800);
  };

  const handleCompare = () => {
    if (!selectedCrop || !compareSoil || !compareWater) return;
    
    const crop = crops.find(c => c.id === selectedCrop);
    if (crop) {
      const simResult = simulateCropOutcome(
        selectedCrop,
        crop.name,
        compareSoil as SoilType,
        compareWater as WaterLevel
      );
      setCompareResult(simResult);
    }
  };

  const canSimulate = selectedCrop && selectedSoil && selectedWater;
  const canCompare = compareMode && compareSoil && compareWater;

  return (
    <div className="min-h-screen bg-gradient-earth py-8 lg:py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-8">
          <div className="inline-flex items-center gap-2 bg-accent/30 text-secondary px-4 py-2 rounded-full mb-4">
            <FlaskConical className="w-4 h-4" />
            <span className="text-sm font-semibold">Crop Outcome Simulator</span>
          </div>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold text-foreground mb-4">
            Simulate Crop Performance
          </h1>
          <p className="text-muted-foreground text-lg">
            See how different crops may perform under various soil and water conditions. 
            This is an advisory tool to help inform your decisions.
          </p>
        </div>

        {/* Weather Card */}
        <div className="max-w-4xl mx-auto mb-8">
          <WeatherCard 
            weather={weather} 
            isLoading={isLoadingWeather} 
            onRefresh={fetchWeather} 
          />
        </div>

        {/* Input Form */}
        <Card variant="simulation" className="max-w-2xl mx-auto mb-12">
          <CardHeader>
            <CardTitle>Configure Simulation</CardTitle>
            <CardDescription>
              Select a crop and specify your land conditions
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Crop Select */}
              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2">
                  <Leaf className="w-4 h-4 text-primary" />
                  Crop Type
                </label>
                <Select value={selectedCrop} onValueChange={setSelectedCrop}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select crop" />
                  </SelectTrigger>
                  <SelectContent>
                    {crops.map(crop => (
                      <SelectItem key={crop.id} value={crop.id}>
                        {crop.icon} {crop.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Soil Select */}
              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2">
                  <Mountain className="w-4 h-4 text-secondary" />
                  Soil Type
                </label>
                <Select value={selectedSoil} onValueChange={(v) => setSelectedSoil(v as SoilType)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select soil" />
                  </SelectTrigger>
                  <SelectContent>
                    {soilTypes.map(soil => (
                      <SelectItem key={soil} value={soil}>
                        {soil}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Water Select */}
              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2">
                  <Droplets className="w-4 h-4 text-water" />
                  Water Availability
                </label>
                <Select value={selectedWater} onValueChange={(v) => setSelectedWater(v as WaterLevel)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select level" />
                  </SelectTrigger>
                  <SelectContent>
                    {waterLevels.map(level => (
                      <SelectItem key={level} value={level}>
                        {level}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button 
              variant="hero" 
              size="lg" 
              className="w-full"
              onClick={handleSimulate}
              disabled={!canSimulate || isSimulating}
            >
              {isSimulating ? (
                <>
                  <RefreshCw className="w-5 h-5 animate-spin" />
                  Simulating...
                </>
              ) : (
                <>
                  <FlaskConical className="w-5 h-5" />
                  Simulate Outcome
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Results */}
        {result && (
          <div className="space-y-8">
            {/* Overview */}
            <Card variant="elevated" className="max-w-4xl mx-auto">
              <CardHeader>
                <div className="flex items-center gap-4">
                  <div className="text-4xl">
                    {crops.find(c => c.id === result.cropId)?.icon}
                  </div>
                  <div>
                    <CardTitle className="text-2xl">{result.cropName} Simulation Results</CardTitle>
                    <CardDescription className="mt-1">
                      Soil: {result.soilType} | Water: {result.waterLevel}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="p-4 bg-muted/50 rounded-lg">
                  <p className="text-foreground">{result.overallOutlook}</p>
                </div>
              </CardContent>
            </Card>

            {/* Stage Cards */}
            <div className="max-w-6xl mx-auto">
              <h2 className="text-2xl font-serif font-bold text-center mb-6">Growth Stage Analysis</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {result.stages.map((stage, index) => (
                  <StageCard key={stage.stage} stage={stage} index={index} />
                ))}
              </div>
            </div>

            {/* What-If Comparison */}
            <Card variant="flat" className="max-w-4xl mx-auto border-2 border-dashed border-primary/30">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <RefreshCw className="w-5 h-5" />
                      What-If Comparison
                    </CardTitle>
                    <CardDescription>
                      Change conditions to see how outcomes might differ
                    </CardDescription>
                  </div>
                  {!compareMode && (
                    <Button variant="outline" onClick={() => setCompareMode(true)}>
                      Enable Comparison
                    </Button>
                  )}
                </div>
              </CardHeader>
              
              {compareMode && (
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Alternative Soil</label>
                      <Select value={compareSoil} onValueChange={(v) => setCompareSoil(v as SoilType)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select soil" />
                        </SelectTrigger>
                        <SelectContent>
                          {soilTypes.map(soil => (
                            <SelectItem key={soil} value={soil}>
                              {soil}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">Alternative Water</label>
                      <Select value={compareWater} onValueChange={(v) => setCompareWater(v as WaterLevel)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select level" />
                        </SelectTrigger>
                        <SelectContent>
                          {waterLevels.map(level => (
                            <SelectItem key={level} value={level}>
                              {level}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex items-end">
                      <Button 
                        variant="secondary" 
                        onClick={handleCompare}
                        disabled={!canCompare}
                        className="w-full"
                      >
                        Compare
                      </Button>
                    </div>
                  </div>

                  {compareResult && (
                    <div className="mt-6 p-4 bg-muted/50 rounded-lg border">
                      <h4 className="font-semibold mb-2">
                        Comparison: {compareSoil} soil + {compareWater} water
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        {compareResult.overallOutlook}
                      </p>
                      <div className="mt-4 grid grid-cols-3 gap-2">
                        {compareResult.stages.map((stage, i) => (
                          <div key={i} className="text-center p-2 bg-card rounded">
                            <p className="text-xs text-muted-foreground">{stage.stage.split(' ')[0]}</p>
                            <Badge 
                              className={
                                stage.growthCondition === "Healthy" ? "bg-leaf-light text-leaf" :
                                stage.growthCondition === "Moderate" ? "bg-accent/30 text-secondary" :
                                "bg-destructive/10 text-destructive"
                              }
                            >
                              {stage.growthCondition}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              )}
            </Card>

            {/* Disclaimer */}
            <Card variant="flat" className="max-w-4xl mx-auto bg-accent/10 border-accent/30">
              <CardContent className="py-4">
                <div className="flex items-start gap-3">
                  <Info className="w-5 h-5 text-secondary flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-muted-foreground">
                    <strong className="text-foreground">Disclaimer:</strong> This simulation provides advisory estimates 
                    based on general agricultural knowledge. Actual outcomes depend on many factors including weather, 
                    specific soil composition, pest presence, and farming practices. Results are not guarantees. 
                    Final decisions remain with the farmer.
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
