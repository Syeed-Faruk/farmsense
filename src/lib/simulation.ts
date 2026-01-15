import { SoilType, WaterLevel } from "@/data/crops";

export interface StageResult {
  stage: string;
  growthCondition: "Poor" | "Moderate" | "Healthy";
  riskLevel: "Low" | "Medium" | "High";
  sustainabilityImpact: "Low" | "Medium" | "High";
  description: string;
  tips: string[];
}

export interface SimulationResult {
  cropId: string;
  cropName: string;
  soilType: SoilType;
  waterLevel: WaterLevel;
  stages: StageResult[];
  overallOutlook: string;
}

// Compatibility matrix for crops
const cropCompatibility: Record<string, { 
  idealSoil: SoilType[]; 
  idealWater: WaterLevel[];
  sensitivity: number; // 0-1, how sensitive to wrong conditions
}> = {
  rice: { idealSoil: ["Clay", "Loamy"], idealWater: ["High"], sensitivity: 0.8 },
  wheat: { idealSoil: ["Loamy"], idealWater: ["Medium"], sensitivity: 0.5 },
  maize: { idealSoil: ["Sandy", "Loamy"], idealWater: ["Medium"], sensitivity: 0.4 },
  tomato: { idealSoil: ["Sandy", "Loamy"], idealWater: ["Medium"], sensitivity: 0.6 },
  potato: { idealSoil: ["Sandy"], idealWater: ["Medium"], sensitivity: 0.5 },
  cotton: { idealSoil: ["Loamy", "Clay"], idealWater: ["Medium"], sensitivity: 0.5 },
  sugarcane: { idealSoil: ["Loamy"], idealWater: ["High"], sensitivity: 0.7 },
  soybean: { idealSoil: ["Loamy"], idealWater: ["Low", "Medium"], sensitivity: 0.3 },
};

function calculateScore(cropId: string, soil: SoilType, water: WaterLevel): number {
  const compat = cropCompatibility[cropId] || { idealSoil: ["Loamy"], idealWater: ["Medium"], sensitivity: 0.5 };
  
  let soilScore = compat.idealSoil.includes(soil) ? 1 : 0.4;
  let waterScore = compat.idealWater.includes(water) ? 1 : 0.5;
  
  // Water mismatch penalty
  const waterIndex = { Low: 0, Medium: 1, High: 2 };
  const idealWaterIndex = Math.max(...compat.idealWater.map(w => waterIndex[w]));
  const waterDiff = Math.abs(waterIndex[water] - idealWaterIndex);
  waterScore -= waterDiff * 0.2 * compat.sensitivity;
  
  return (soilScore * 0.5 + waterScore * 0.5);
}

function getCondition(score: number): "Poor" | "Moderate" | "Healthy" {
  if (score >= 0.75) return "Healthy";
  if (score >= 0.5) return "Moderate";
  return "Poor";
}

function getRisk(score: number): "Low" | "Medium" | "High" {
  if (score >= 0.75) return "Low";
  if (score >= 0.5) return "Medium";
  return "High";
}

function getSustainability(cropId: string, soil: SoilType, water: WaterLevel): "Low" | "Medium" | "High" {
  const compat = cropCompatibility[cropId];
  if (!compat) return "Medium";
  
  // High water crops in low water conditions = low sustainability
  if (compat.idealWater.includes("High") && water === "Low") return "Low";
  
  // Matching conditions = high sustainability
  if (compat.idealSoil.includes(soil) && compat.idealWater.includes(water)) return "High";
  
  return "Medium";
}

export function simulateCropOutcome(
  cropId: string,
  cropName: string,
  soil: SoilType,
  water: WaterLevel
): SimulationResult {
  const baseScore = calculateScore(cropId, soil, water);
  
  // Scores vary slightly by stage
  const earlyScore = baseScore * 0.9; // Early stage more vulnerable
  const midScore = baseScore;
  const harvestScore = baseScore * 1.05; // If survived, tends to stabilize

  const stages: StageResult[] = [
    {
      stage: "Early Growth Stage",
      growthCondition: getCondition(earlyScore),
      riskLevel: getRisk(earlyScore),
      sustainabilityImpact: getSustainability(cropId, soil, water),
      description: getEarlyDescription(cropName, earlyScore, soil, water),
      tips: getEarlyTips(cropId, earlyScore, soil, water),
    },
    {
      stage: "Mid-Growth Stage",
      growthCondition: getCondition(midScore),
      riskLevel: getRisk(midScore),
      sustainabilityImpact: getSustainability(cropId, soil, water),
      description: getMidDescription(cropName, midScore, soil, water),
      tips: getMidTips(cropId, midScore, soil, water),
    },
    {
      stage: "Harvest Stage",
      growthCondition: getCondition(harvestScore),
      riskLevel: getRisk(harvestScore),
      sustainabilityImpact: getSustainability(cropId, soil, water),
      description: getHarvestDescription(cropName, harvestScore, soil, water),
      tips: getHarvestTips(cropId, harvestScore),
    },
  ];

  return {
    cropId,
    cropName,
    soilType: soil,
    waterLevel: water,
    stages,
    overallOutlook: getOverallOutlook(baseScore, cropName),
  };
}

function getEarlyDescription(crop: string, score: number, soil: SoilType, water: WaterLevel): string {
  if (score >= 0.75) {
    return `${crop} seedlings are expected to establish well in ${soil.toLowerCase()} soil with ${water.toLowerCase()} water availability. Root development should progress steadily.`;
  }
  if (score >= 0.5) {
    return `${crop} may face some challenges during germination. The ${soil.toLowerCase()} soil and ${water.toLowerCase()} water conditions require monitoring.`;
  }
  return `${crop} seedlings may struggle in current conditions. Consider soil amendments or adjusting irrigation practices.`;
}

function getMidDescription(crop: string, score: number, soil: SoilType, water: WaterLevel): string {
  if (score >= 0.75) {
    return `${crop} is expected to show vigorous vegetative growth. Nutrient uptake should be optimal with current soil and water conditions.`;
  }
  if (score >= 0.5) {
    return `${crop} growth may be slower than optimal. Regular monitoring for stress signs is recommended.`;
  }
  return `${crop} may exhibit stunted growth. Consider interventions such as organic fertilizers or irrigation adjustments.`;
}

function getHarvestDescription(crop: string, score: number, soil: SoilType, water: WaterLevel): string {
  if (score >= 0.75) {
    return `${crop} is expected to reach maturity with favorable outcomes. Proper timing of harvest will be important.`;
  }
  if (score >= 0.5) {
    return `${crop} may reach harvest with moderate results. Some quality variations are possible.`;
  }
  return `${crop} harvest outcomes may be below expectations. Learning from this cycle can improve future seasons.`;
}

function getEarlyTips(cropId: string, score: number, soil: SoilType, water: WaterLevel): string[] {
  const tips: string[] = [];
  
  if (water === "Low") {
    tips.push("Consider mulching to retain soil moisture during early growth.");
  }
  if (soil === "Sandy") {
    tips.push("Sandy soil drains quickly - more frequent, lighter watering may help.");
  }
  if (soil === "Clay") {
    tips.push("Ensure good drainage to prevent waterlogging in clay soil.");
  }
  if (score < 0.5) {
    tips.push("Consider raised beds or soil amendments to improve growing conditions.");
  }
  
  tips.push("Monitor seedling emergence and thin if overcrowded.");
  
  return tips.slice(0, 3);
}

function getMidTips(cropId: string, score: number, soil: SoilType, water: WaterLevel): string[] {
  const tips: string[] = [];
  
  if (score >= 0.75) {
    tips.push("Continue current practices - conditions appear favorable.");
  }
  
  tips.push("Watch for common pest signs and use integrated pest management.");
  
  if (water === "High") {
    tips.push("Consider drip irrigation to optimize water use efficiency.");
  }
  
  if (score < 0.5) {
    tips.push("Apply organic compost to boost soil health.");
    tips.push("Consider companion planting to improve growing conditions.");
  }
  
  return tips.slice(0, 3);
}

function getHarvestTips(cropId: string, score: number): string[] {
  const tips: string[] = [];
  
  tips.push("Plan harvest timing based on crop maturity indicators.");
  
  if (score >= 0.75) {
    tips.push("Consider saving seeds from best-performing plants.");
  }
  
  tips.push("After harvest, incorporate crop residue to improve soil organic matter.");
  tips.push("Document outcomes to inform next season's planning.");
  
  return tips.slice(0, 3);
}

function getOverallOutlook(score: number, cropName: string): string {
  if (score >= 0.75) {
    return `Based on the simulation, ${cropName} is well-suited to the selected conditions. With proper care and favorable weather, outcomes are expected to be positive.`;
  }
  if (score >= 0.5) {
    return `${cropName} can be grown under these conditions with some adjustments. Pay attention to the tips provided and monitor crop health regularly.`;
  }
  return `The simulation suggests challenging conditions for ${cropName}. Consider alternative crops better suited to your land, or implement significant improvements to soil and irrigation.`;
}
