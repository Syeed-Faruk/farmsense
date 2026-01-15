import { useState, useMemo } from "react";
import { Calendar, Sprout, Search, Filter, Droplets, Sun, Snowflake, Leaf } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { crops, categories } from "@/data/crops";
import { cn } from "@/lib/utils";

// Planting calendar data - months when each crop can be planted
const plantingData: Record<string, { plantMonths: number[]; harvestMonths: number[] }> = {
  rice: { plantMonths: [5, 6, 7], harvestMonths: [10, 11] },
  wheat: { plantMonths: [10, 11], harvestMonths: [3, 4] },
  maize: { plantMonths: [5, 6, 1, 2], harvestMonths: [9, 10, 5, 6] },
  tomato: { plantMonths: [1, 2, 6, 7, 8], harvestMonths: [4, 5, 10, 11, 12] },
  potato: { plantMonths: [9, 10, 11], harvestMonths: [1, 2, 3] },
  cotton: { plantMonths: [3, 4, 5], harvestMonths: [10, 11, 12] },
  sugarcane: { plantMonths: [1, 2, 9, 10], harvestMonths: [11, 12, 1, 2, 3] },
  soybean: { plantMonths: [5, 6, 7], harvestMonths: [9, 10] },
  onion: { plantMonths: [10, 11, 12], harvestMonths: [3, 4, 5] },
  carrot: { plantMonths: [9, 10, 11], harvestMonths: [1, 2, 3] },
  cabbage: { plantMonths: [8, 9, 10], harvestMonths: [12, 1, 2] },
  chili: { plantMonths: [1, 2, 3, 6, 7], harvestMonths: [5, 6, 10, 11] },
  groundnut: { plantMonths: [5, 6, 7], harvestMonths: [9, 10] },
  sunflower: { plantMonths: [1, 2, 6, 7], harvestMonths: [4, 5, 10, 11] },
  mango: { plantMonths: [6, 7, 8], harvestMonths: [3, 4, 5, 6] },
  banana: { plantMonths: [2, 3, 6, 7], harvestMonths: [11, 12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10] },
  watermelon: { plantMonths: [1, 2, 3], harvestMonths: [4, 5, 6] },
  turmeric: { plantMonths: [4, 5, 6], harvestMonths: [1, 2, 3] },
  ginger: { plantMonths: [3, 4, 5], harvestMonths: [12, 1, 2] },
  lentils: { plantMonths: [10, 11], harvestMonths: [2, 3] },
  mustard: { plantMonths: [9, 10, 11], harvestMonths: [2, 3] },
  cucumber: { plantMonths: [1, 2, 3, 6, 7], harvestMonths: [3, 4, 5, 9, 10] },
  eggplant: { plantMonths: [2, 3, 6, 7, 8], harvestMonths: [5, 6, 10, 11, 12] },
  garlic: { plantMonths: [9, 10, 11], harvestMonths: [2, 3, 4] },
};

const months = [
  { name: "Jan", short: "J", index: 0 },
  { name: "Feb", short: "F", index: 1 },
  { name: "Mar", short: "M", index: 2 },
  { name: "Apr", short: "A", index: 3 },
  { name: "May", short: "M", index: 4 },
  { name: "Jun", short: "J", index: 5 },
  { name: "Jul", short: "J", index: 6 },
  { name: "Aug", short: "A", index: 7 },
  { name: "Sep", short: "S", index: 8 },
  { name: "Oct", short: "O", index: 9 },
  { name: "Nov", short: "N", index: 10 },
  { name: "Dec", short: "D", index: 11 },
];

const seasons = [
  { name: "Winter", months: [11, 0, 1], icon: Snowflake, color: "text-water" },
  { name: "Spring", months: [2, 3, 4], icon: Sprout, color: "text-leaf" },
  { name: "Summer", months: [5, 6, 7], icon: Sun, color: "text-sun" },
  { name: "Autumn", months: [8, 9, 10], icon: Leaf, color: "text-secondary" },
];

function getMonthType(cropId: string, monthIndex: number): "plant" | "harvest" | "both" | "none" {
  const data = plantingData[cropId];
  if (!data) return "none";
  
  const monthNum = monthIndex + 1;
  const isPlant = data.plantMonths.includes(monthNum);
  const isHarvest = data.harvestMonths.includes(monthNum);
  
  if (isPlant && isHarvest) return "both";
  if (isPlant) return "plant";
  if (isHarvest) return "harvest";
  return "none";
}

function getCurrentMonth(): number {
  return new Date().getMonth();
}

export default function CalendarPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedMonth, setSelectedMonth] = useState<number | null>(getCurrentMonth());
  
  const filteredCrops = useMemo(() => {
    return crops.filter((crop) => {
      const matchesSearch = 
        crop.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        crop.category.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesCategory = !selectedCategory || crop.category === selectedCategory;
      
      // Filter by selected month - show crops that can be planted or harvested
      let matchesMonth = true;
      if (selectedMonth !== null) {
        const data = plantingData[crop.id];
        if (data) {
          const monthNum = selectedMonth + 1;
          matchesMonth = data.plantMonths.includes(monthNum) || data.harvestMonths.includes(monthNum);
        }
      }

      return matchesSearch && matchesCategory && matchesMonth;
    });
  }, [searchQuery, selectedCategory, selectedMonth]);

  const cropsToPlantThisMonth = useMemo(() => {
    const currentMonthNum = getCurrentMonth() + 1;
    return crops.filter((crop) => {
      const data = plantingData[crop.id];
      return data?.plantMonths.includes(currentMonthNum);
    });
  }, []);

  const cropsToHarvestThisMonth = useMemo(() => {
    const currentMonthNum = getCurrentMonth() + 1;
    return crops.filter((crop) => {
      const data = plantingData[crop.id];
      return data?.harvestMonths.includes(currentMonthNum);
    });
  }, []);

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedCategory(null);
    setSelectedMonth(null);
  };

  return (
    <div className="min-h-screen bg-gradient-earth py-8 lg:py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-8">
          <div className="inline-flex items-center gap-2 bg-secondary/20 text-secondary px-4 py-2 rounded-full mb-4">
            <Calendar className="w-4 h-4" />
            <span className="text-sm font-semibold">Seasonal Planting Guide</span>
          </div>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold text-foreground mb-4">
            Planting Calendar
          </h1>
          <p className="text-muted-foreground text-lg">
            Plan your farming activities with our seasonal calendar. Know the best times 
            to plant and harvest each crop for optimal results.
          </p>
        </div>

        {/* Current Month Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card className="border-leaf/30 bg-leaf-light/30">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-leaf">
                <Sprout className="w-5 h-5" />
                Plant This Month
              </CardTitle>
              <CardDescription>
                {months[getCurrentMonth()].name} - Best crops to plant now
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {cropsToPlantThisMonth.length > 0 ? (
                  cropsToPlantThisMonth.map((crop) => (
                    <Badge key={crop.id} variant="secondary" className="bg-leaf/10 text-leaf border-leaf/30">
                      {crop.icon} {crop.name}
                    </Badge>
                  ))
                ) : (
                  <span className="text-muted-foreground text-sm">No crops recommended for planting this month</span>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="border-secondary/30 bg-wheat-light/30">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-secondary">
                <Sun className="w-5 h-5" />
                Harvest This Month
              </CardTitle>
              <CardDescription>
                {months[getCurrentMonth()].name} - Crops ready for harvest
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {cropsToHarvestThisMonth.length > 0 ? (
                  cropsToHarvestThisMonth.map((crop) => (
                    <Badge key={crop.id} variant="secondary" className="bg-secondary/10 text-secondary border-secondary/30">
                      {crop.icon} {crop.name}
                    </Badge>
                  ))
                ) : (
                  <span className="text-muted-foreground text-sm">No crops ready for harvest this month</span>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Season Overview */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Season Overview</CardTitle>
            <CardDescription>Click on a month to filter crops</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-4 gap-4 mb-4">
              {seasons.map((season) => {
                const Icon = season.icon;
                return (
                  <div key={season.name} className="text-center">
                    <div className={cn("flex items-center justify-center gap-1 mb-2", season.color)}>
                      <Icon className="w-4 h-4" />
                      <span className="font-semibold text-sm">{season.name}</span>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="grid grid-cols-12 gap-1">
              {months.map((month) => {
                const isSelected = selectedMonth === month.index;
                const isCurrent = getCurrentMonth() === month.index;
                return (
                  <button
                    key={month.index}
                    onClick={() => setSelectedMonth(isSelected ? null : month.index)}
                    className={cn(
                      "p-2 rounded-lg text-center transition-all text-sm font-medium",
                      isSelected 
                        ? "bg-primary text-primary-foreground" 
                        : isCurrent
                        ? "bg-secondary/20 text-secondary ring-2 ring-secondary"
                        : "bg-muted hover:bg-muted/80"
                    )}
                  >
                    <span className="hidden sm:inline">{month.name}</span>
                    <span className="sm:hidden">{month.short}</span>
                  </button>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Search and Filters */}
        <div className="mb-6 space-y-4">
          <div className="relative max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search crops..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12"
            />
          </div>

          <div className="flex flex-wrap gap-2 items-center">
            <Filter className="w-4 h-4 text-muted-foreground" />
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(selectedCategory === category ? null : category)}
                className="rounded-full"
              >
                {category}
              </Button>
            ))}
            {(searchQuery || selectedCategory || selectedMonth !== null) && (
              <Button variant="ghost" size="sm" onClick={clearFilters} className="text-destructive">
                Clear All
              </Button>
            )}
          </div>

          <p className="text-sm text-muted-foreground">
            Showing {filteredCrops.length} of {crops.length} crops
            {selectedMonth !== null && ` for ${months[selectedMonth].name}`}
          </p>
        </div>

        {/* Calendar Grid */}
        <Card>
          <CardHeader>
            <CardTitle>Annual Planting Calendar</CardTitle>
            <CardDescription>
              <span className="inline-flex items-center gap-4 flex-wrap">
                <span className="inline-flex items-center gap-1">
                  <span className="w-3 h-3 rounded bg-leaf"></span> Planting
                </span>
                <span className="inline-flex items-center gap-1">
                  <span className="w-3 h-3 rounded bg-secondary"></span> Harvest
                </span>
                <span className="inline-flex items-center gap-1">
                  <span className="w-3 h-3 rounded bg-gradient-to-r from-leaf to-secondary"></span> Both
                </span>
              </span>
            </CardDescription>
          </CardHeader>
          <CardContent className="overflow-x-auto">
            <table className="w-full min-w-[700px]">
              <thead>
                <tr>
                  <th className="text-left p-2 font-semibold text-sm border-b">Crop</th>
                  {months.map((month) => (
                    <th 
                      key={month.index} 
                      className={cn(
                        "text-center p-2 font-semibold text-xs border-b",
                        getCurrentMonth() === month.index && "bg-secondary/10"
                      )}
                    >
                      {month.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredCrops.map((crop) => (
                  <tr key={crop.id} className="hover:bg-muted/50 transition-colors">
                    <td className="p-2 border-b">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">{crop.icon}</span>
                        <div>
                          <span className="font-medium text-sm">{crop.name}</span>
                          <Badge variant="outline" className="ml-2 text-xs">
                            {crop.category}
                          </Badge>
                        </div>
                      </div>
                    </td>
                    {months.map((month) => {
                      const type = getMonthType(crop.id, month.index);
                      return (
                        <td 
                          key={month.index} 
                          className={cn(
                            "text-center p-1 border-b",
                            getCurrentMonth() === month.index && "bg-secondary/5"
                          )}
                        >
                          {type === "plant" && (
                            <div className="w-6 h-6 mx-auto rounded bg-leaf/80 flex items-center justify-center" title="Plant">
                              <Sprout className="w-3 h-3 text-white" />
                            </div>
                          )}
                          {type === "harvest" && (
                            <div className="w-6 h-6 mx-auto rounded bg-secondary/80 flex items-center justify-center" title="Harvest">
                              <Sun className="w-3 h-3 text-white" />
                            </div>
                          )}
                          {type === "both" && (
                            <div className="w-6 h-6 mx-auto rounded bg-gradient-to-r from-leaf to-secondary flex items-center justify-center" title="Plant & Harvest">
                              <span className="text-white text-xs font-bold">★</span>
                            </div>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>

        {/* Tips Card */}
        <Card variant="flat" className="mt-8 bg-leaf-light/30 border-leaf/30">
          <CardContent className="py-6">
            <h3 className="font-serif font-bold text-lg mb-4 flex items-center gap-2">
              <Leaf className="w-5 h-5 text-leaf" />
              Planting Tips
            </h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• <strong>Prepare soil 2-3 weeks before planting</strong> - Add organic matter and ensure proper drainage</li>
              <li>• <strong>Consider local climate variations</strong> - These dates are general guidelines; adjust based on your region</li>
              <li>• <strong>Stagger plantings</strong> - Plant in batches every 2-3 weeks for continuous harvest</li>
              <li>• <strong>Check soil temperature</strong> - Many seeds require specific soil temperatures to germinate</li>
              <li>• <strong>Plan for crop rotation</strong> - Avoid planting the same family of crops in the same spot consecutively</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
