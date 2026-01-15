import { Droplets, Sun, Leaf, Sprout } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { crops, Crop } from "@/data/crops";

function CropCard({ crop }: { crop: Crop }) {
  const waterColor = {
    Low: "bg-leaf-light text-leaf",
    Medium: "bg-water-light text-water",
    High: "bg-water text-primary-foreground",
  }[crop.waterRequirement];

  return (
    <Card variant="crop" className="h-full">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="text-5xl mb-2">{crop.icon}</div>
          <Badge className={waterColor}>
            <Droplets className="w-3 h-3 mr-1" />
            {crop.waterRequirement} Water
          </Badge>
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
  return (
    <div className="min-h-screen bg-gradient-earth py-8 lg:py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
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

        {/* Crop Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {crops.map((crop, index) => (
            <div 
              key={crop.id} 
              className="animate-fade-in-up"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <CropCard crop={crop} />
            </div>
          ))}
        </div>

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
