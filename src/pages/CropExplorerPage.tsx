import { useState, useMemo } from "react";
import { Droplets, Sun, Leaf, Sprout, Search, Clock, Thermometer, Bug, Apple, Filter } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { crops, Crop, categories, waterLevels } from "@/data/crops";

function CropCard({ crop }: { crop: Crop }) {
  const waterColor = {
    Low: "bg-leaf-light text-leaf",
    Medium: "bg-water-light text-water",
    High: "bg-water text-primary-foreground",
  }[crop.waterRequirement];

  const categoryColor = {
    Cereal: "bg-wheat-light text-secondary",
    Vegetable: "bg-leaf-light text-leaf",
    Fruit: "bg-sun-light text-sun",
    Legume: "bg-soil-light text-soil",
    Fiber: "bg-muted text-muted-foreground",
    Spice: "bg-destructive/10 text-destructive",
    Oilseed: "bg-wheat-light text-secondary",
  }[crop.category];

  return (
    <Card variant="crop" className="h-full">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="text-5xl mb-2">{crop.icon}</div>
          <div className="flex flex-col gap-1 items-end">
            <Badge className={waterColor}>
              <Droplets className="w-3 h-3 mr-1" />
              {crop.waterRequirement}
            </Badge>
            <Badge variant="outline" className={categoryColor}>
              {crop.category}
            </Badge>
          </div>
        </div>
        <CardTitle className="text-2xl">{crop.name}</CardTitle>
        <CardDescription className="text-base">
          {crop.description}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Soil Type */}
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-soil-light flex items-center justify-center flex-shrink-0">
            <Sprout className="w-4 h-4 text-soil" />
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground">Soil Type</p>
            <p className="text-sm text-muted-foreground">{crop.soilType}</p>
          </div>
        </div>

        {/* Growing Season */}
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-wheat-light flex items-center justify-center flex-shrink-0">
            <Sun className="w-4 h-4 text-secondary" />
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground">Growing Season</p>
            <p className="text-sm text-muted-foreground">{crop.growingSeason}</p>
          </div>
        </div>

        {/* Harvest Time */}
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-water-light flex items-center justify-center flex-shrink-0">
            <Clock className="w-4 h-4 text-water" />
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground">Harvest Time</p>
            <p className="text-sm text-muted-foreground">{crop.harvestTime}</p>
          </div>
        </div>

        {/* Temperature */}
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-sun-light flex items-center justify-center flex-shrink-0">
            <Thermometer className="w-4 h-4 text-sun" />
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground">Optimal Temperature</p>
            <p className="text-sm text-muted-foreground">{crop.optimalTemperature}</p>
          </div>
        </div>

        {/* Common Pests */}
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-destructive/10 flex items-center justify-center flex-shrink-0">
            <Bug className="w-4 h-4 text-destructive" />
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground">Common Pests</p>
            <p className="text-sm text-muted-foreground">{crop.commonPests.join(", ")}</p>
          </div>
        </div>

        {/* Nutritional Value */}
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-leaf-light flex items-center justify-center flex-shrink-0">
            <Apple className="w-4 h-4 text-leaf" />
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground">Nutritional Value</p>
            <p className="text-sm text-muted-foreground">{crop.nutritionalValue}</p>
          </div>
        </div>

        {/* Sustainability Notes */}
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-leaf-light flex items-center justify-center flex-shrink-0">
            <Leaf className="w-4 h-4 text-leaf" />
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground">Sustainability Tips</p>
            <p className="text-sm text-muted-foreground">{crop.sustainabilityNotes}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function CropExplorerPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedWater, setSelectedWater] = useState<string | null>(null);

  const filteredCrops = useMemo(() => {
    return crops.filter((crop) => {
      const matchesSearch = 
        crop.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        crop.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        crop.soilType.toLowerCase().includes(searchQuery.toLowerCase()) ||
        crop.category.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesCategory = !selectedCategory || crop.category === selectedCategory;
      const matchesWater = !selectedWater || crop.waterRequirement === selectedWater;

      return matchesSearch && matchesCategory && matchesWater;
    });
  }, [searchQuery, selectedCategory, selectedWater]);

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedCategory(null);
    setSelectedWater(null);
  };

  const hasActiveFilters = searchQuery || selectedCategory || selectedWater;

  return (
    <div className="min-h-screen bg-gradient-earth py-8 lg:py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-8">
          <div className="inline-flex items-center gap-2 bg-leaf-light text-leaf px-4 py-2 rounded-full mb-4">
            <Sprout className="w-4 h-4" />
            <span className="text-sm font-semibold">Crop Knowledge Base</span>
          </div>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold text-foreground mb-4">
            Explore Crops
          </h1>
          <p className="text-muted-foreground text-lg">
            Learn about different crops, their requirements, and sustainable farming practices. 
            Use this knowledge to make informed decisions for your farm.
          </p>
        </div>

        {/* Search and Filters */}
        <div className="max-w-4xl mx-auto mb-8 space-y-4">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search crops by name, type, or soil..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 h-14 text-lg rounded-xl border-2 focus:border-primary"
            />
          </div>

          {/* Filter Buttons */}
          <div className="flex flex-wrap gap-2 items-center">
            <div className="flex items-center gap-2 mr-2">
              <Filter className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground font-medium">Filter:</span>
            </div>
            
            {/* Category Filters */}
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

            <span className="text-muted-foreground mx-2">|</span>

            {/* Water Requirement Filters */}
            {waterLevels.map((level) => (
              <Button
                key={level}
                variant={selectedWater === level ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedWater(selectedWater === level ? null : level)}
                className="rounded-full"
              >
                <Droplets className="w-3 h-3 mr-1" />
                {level}
              </Button>
            ))}

            {hasActiveFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearFilters}
                className="text-destructive hover:text-destructive"
              >
                Clear All
              </Button>
            )}
          </div>

          {/* Results Count */}
          <div className="text-sm text-muted-foreground">
            Showing {filteredCrops.length} of {crops.length} crops
          </div>
        </div>

        {/* Crop Grid */}
        {filteredCrops.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredCrops.map((crop, index) => (
              <div 
                key={crop.id} 
                className="animate-fade-in-up"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <CropCard crop={crop} />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-serif font-bold text-foreground mb-2">No crops found</h3>
            <p className="text-muted-foreground mb-4">
              Try adjusting your search or filters to find what you're looking for.
            </p>
            <Button onClick={clearFilters} variant="outline">
              Clear Filters
            </Button>
          </div>
        )}

        {/* Legend */}
        <Card variant="flat" className="mt-12 p-6 bg-card/50">
          <h3 className="font-serif font-bold text-lg mb-4">Water Requirement Legend</h3>
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-2">
              <Badge className="bg-leaf-light text-leaf">
                <Droplets className="w-3 h-3 mr-1" />
                Low
              </Badge>
              <span className="text-sm text-muted-foreground">Drought-tolerant crops</span>
            </div>
            <div className="flex items-center gap-2">
              <Badge className="bg-water-light text-water">
                <Droplets className="w-3 h-3 mr-1" />
                Medium
              </Badge>
              <span className="text-sm text-muted-foreground">Moderate irrigation needed</span>
            </div>
            <div className="flex items-center gap-2">
              <Badge className="bg-water text-primary-foreground">
                <Droplets className="w-3 h-3 mr-1" />
                High
              </Badge>
              <span className="text-sm text-muted-foreground">Regular irrigation required</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
