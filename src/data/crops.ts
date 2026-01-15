export interface Crop {
  id: string;
  name: string;
  icon: string;
  soilType: string;
  waterRequirement: "Low" | "Medium" | "High";
  growingSeason: string;
  sustainabilityNotes: string;
  description: string;
}

export const crops: Crop[] = [
  {
    id: "rice",
    name: "Rice",
    icon: "🌾",
    soilType: "Clay or Loamy soil with good water retention",
    waterRequirement: "High",
    growingSeason: "Monsoon (June - November)",
    sustainabilityNotes: "Consider alternate wetting and drying techniques to reduce water usage by up to 30%.",
    description: "A staple food crop requiring warm, humid conditions and abundant water supply."
  },
  {
    id: "wheat",
    name: "Wheat",
    icon: "🌿",
    soilType: "Well-drained loamy soil",
    waterRequirement: "Medium",
    growingSeason: "Winter (November - April)",
    sustainabilityNotes: "Rotation with legumes improves soil nitrogen. Minimal tillage reduces erosion.",
    description: "A cool-season crop that thrives in temperate climates with moderate rainfall."
  },
  {
    id: "maize",
    name: "Maize (Corn)",
    icon: "🌽",
    soilType: "Sandy loam to loamy soil",
    waterRequirement: "Medium",
    growingSeason: "Kharif (June - October) or Rabi",
    sustainabilityNotes: "Excellent for crop rotation. Residue can be used as mulch or fodder.",
    description: "A versatile crop used for food, feed, and industrial purposes."
  },
  {
    id: "tomato",
    name: "Tomato",
    icon: "🍅",
    soilType: "Sandy loam with good drainage",
    waterRequirement: "Medium",
    growingSeason: "Year-round in suitable climates",
    sustainabilityNotes: "Drip irrigation significantly reduces water waste. Good for greenhouse farming.",
    description: "A warm-season vegetable requiring full sun and consistent moisture."
  },
  {
    id: "potato",
    name: "Potato",
    icon: "🥔",
    soilType: "Loose, well-drained sandy soil",
    waterRequirement: "Medium",
    growingSeason: "Cool months (October - March)",
    sustainabilityNotes: "Mulching helps retain moisture and suppress weeds naturally.",
    description: "A cool-weather crop that stores well and provides high yields."
  },
  {
    id: "cotton",
    name: "Cotton",
    icon: "☁️",
    soilType: "Black cotton soil or deep loamy",
    waterRequirement: "Medium",
    growingSeason: "Kharif (April - December)",
    sustainabilityNotes: "Organic cotton farming reduces pesticide use. Companion planting helps pest control.",
    description: "A major fiber crop requiring a long frost-free growing period."
  },
  {
    id: "sugarcane",
    name: "Sugarcane",
    icon: "🎋",
    soilType: "Deep, fertile loamy soil",
    waterRequirement: "High",
    growingSeason: "Year-round (12-18 month cycle)",
    sustainabilityNotes: "Drip irrigation can save 40% water. Bagasse can be used as biofuel.",
    description: "A tropical grass cultivated for sugar production and bioenergy."
  },
  {
    id: "soybean",
    name: "Soybean",
    icon: "🫘",
    soilType: "Well-drained loamy soil",
    waterRequirement: "Low",
    growingSeason: "Kharif (June - October)",
    sustainabilityNotes: "Fixes nitrogen in soil, reducing fertilizer needs. Excellent rotation crop.",
    description: "A protein-rich legume that enriches soil fertility naturally."
  }
];

export const soilTypes = ["Clay", "Sandy", "Loamy"] as const;
export const waterLevels = ["Low", "Medium", "High"] as const;
export type SoilType = typeof soilTypes[number];
export type WaterLevel = typeof waterLevels[number];
