export interface PlantData {
  name: string;
  cultivationDuration: string;
  seasons: string[];
  diseases: DiseaseData[];
}

export interface DiseaseData {
  name: string;
  symptoms: string[];
  remedies: string[];
  prevention: string[];
}

export interface WeatherData {
  rainProbability: number;
  temperature: number;
  humidity: number;
  windSpeed: number;
  recommendation: string;
}

export const plantsDatabase: PlantData[] = [
  {
    name: "Rice",
    cultivationDuration: "120-150 days",
    seasons: ["Kharif", "Rabi"],
    diseases: [
      {
        name: "Blast Disease",
        symptoms: ["Brown spots on leaves", "Neck rot", "Panicle blast"],
        remedies: ["Spray Tricyclazole 75% WP @ 0.6g/L", "Apply Carbendazim 50% WP @ 1g/L", "Use resistant varieties"],
        prevention: ["Avoid excess nitrogen", "Proper drainage", "Seed treatment with fungicide"]
      },
      {
        name: "Brown Spot",
        symptoms: ["Brown oval spots", "Seedling blight", "Grain discoloration"],
        remedies: ["Mancozeb 75% WP @ 2g/L", "Propiconazole 25% EC @ 1ml/L", "Copper oxychloride spray"],
        prevention: ["Balanced fertilization", "Avoid water stress", "Use certified seeds"]
      }
    ]
  },
  {
    name: "Wheat",
    cultivationDuration: "120-130 days",
    seasons: ["Rabi"],
    diseases: [
      {
        name: "Rust Disease",
        symptoms: ["Orange pustules on leaves", "Yellow streaks", "Reduced grain quality"],
        remedies: ["Propiconazole 25% EC @ 0.1%", "Tebuconazole 25.9% EC @ 0.1%", "Mancozeb 75% WP @ 0.25%"],
        prevention: ["Use resistant varieties", "Timely sowing", "Avoid late irrigation"]
      }
    ]
  },
  {
    name: "Tomato",
    cultivationDuration: "90-120 days",
    seasons: ["All seasons with protection"],
    diseases: [
      {
        name: "Late Blight",
        symptoms: ["Dark water-soaked spots", "White fungal growth", "Fruit rot"],
        remedies: ["Metalaxyl + Mancozeb @ 2g/L", "Copper hydroxide @ 2g/L", "Dimethomorph 50% WP @ 1g/L"],
        prevention: ["Avoid overhead irrigation", "Proper spacing", "Remove infected plants"]
      },
      {
        name: "Bacterial Wilt",
        symptoms: ["Sudden wilting", "Vascular browning", "Plant death"],
        remedies: ["Streptocyclin 500ppm spray", "Copper oxychloride @ 3g/L", "Soil drenching with Pseudomonas"],
        prevention: ["Crop rotation", "Soil solarization", "Use resistant varieties"]
      }
    ]
  },
  {
    name: "Cotton",
    cultivationDuration: "180-200 days",
    seasons: ["Kharif"],
    diseases: [
      {
        name: "Bollworm",
        symptoms: ["Holes in bolls", "Larval damage", "Reduced yield"],
        remedies: ["Bt spray @ 2g/L", "Spinosad 45% SC @ 0.3ml/L", "NPV @ 500 LE/ha"],
        prevention: ["Pheromone traps", "Intercropping with marigold", "Regular monitoring"]
      }
    ]
  },
  {
    name: "Sugarcane",
    cultivationDuration: "12-18 months",
    seasons: ["February-March, October-November"],
    diseases: [
      {
        name: "Red Rot",
        symptoms: ["Red discoloration of internodes", "Alcoholic smell", "Hollow stems"],
        remedies: ["Carbendazim 50% WP @ 2g/L", "Propiconazole 25% EC @ 1ml/L", "Hot water treatment of setts"],
        prevention: ["Use resistant varieties", "Proper drainage", "Avoid ratooning in infected fields"]
      }
    ]
  },
  {
    name: "Maize",
    cultivationDuration: "90-110 days",
    seasons: ["Kharif", "Rabi", "Summer"],
    diseases: [
      {
        name: "Turcicum Leaf Blight",
        symptoms: ["Elliptical lesions", "Tan colored spots", "Leaf death"],
        remedies: ["Mancozeb 75% WP @ 2.5g/L", "Carbendazim 50% WP @ 1g/L", "Propiconazole @ 0.1%"],
        prevention: ["Crop rotation", "Resistant varieties", "Balanced nutrition"]
      }
    ]
  },
  {
    name: "Potato",
    cultivationDuration: "90-120 days",
    seasons: ["Rabi"],
    diseases: [
      {
        name: "Late Blight",
        symptoms: ["Water-soaked lesions", "White sporulation", "Tuber rot"],
        remedies: ["Metalaxyl-M + Mancozeb @ 2g/L", "Cymoxanil + Mancozeb @ 2g/L", "Copper fungicides"],
        prevention: ["Avoid wet conditions", "Proper hilling", "Use certified seed tubers"]
      }
    ]
  },
  {
    name: "Onion",
    cultivationDuration: "120-150 days",
    seasons: ["Rabi", "Kharif"],
    diseases: [
      {
        name: "Purple Blotch",
        symptoms: ["Purple spots on leaves", "Concentric rings", "Tip burning"],
        remedies: ["Mancozeb 75% WP @ 2g/L", "Iprodione 50% WP @ 2g/L", "Copper oxychloride @ 3g/L"],
        prevention: ["Avoid overhead irrigation", "Proper spacing", "Crop rotation"]
      }
    ]
  },
  {
    name: "Chili",
    cultivationDuration: "120-150 days",
    seasons: ["Kharif", "Summer"],
    diseases: [
      {
        name: "Anthracnose",
        symptoms: ["Circular spots on fruits", "Sunken lesions", "Pink spore masses"],
        remedies: ["Carbendazim 50% WP @ 1g/L", "Mancozeb 75% WP @ 2g/L", "Copper fungicides @ 3g/L"],
        prevention: ["Avoid fruit contact with soil", "Proper drainage", "Harvest at right maturity"]
      }
    ]
  },
  {
    name: "Banana",
    cultivationDuration: "12-15 months",
    seasons: ["Year-round"],
    diseases: [
      {
        name: "Panama Disease",
        symptoms: ["Yellowing of leaves", "Wilting", "Vascular browning"],
        remedies: ["Carbendazim soil drench @ 2g/L", "Trichoderma application", "Pseudomonas treatment"],
        prevention: ["Use tissue culture plants", "Soil solarization", "Avoid waterlogging"]
      }
    ]
  }
];

export const getWeatherForecast = (): WeatherData => {
  const rainProb = Math.floor(Math.random() * 100);
  const temp = Math.floor(Math.random() * 15) + 20; // 20-35°C
  const humidity = Math.floor(Math.random() * 40) + 40; // 40-80%
  const wind = Math.floor(Math.random() * 10) + 5; // 5-15 km/h
  
  let recommendation = "";
  if (rainProb > 70) {
    recommendation = "High rain probability. Avoid spraying. Ensure proper drainage.";
  } else if (rainProb > 40) {
    recommendation = "Moderate rain chance. Plan indoor activities. Check irrigation needs.";
  } else {
    recommendation = "Low rain probability. Good for field operations and spraying.";
  }
  
  return {
    rainProbability: rainProb,
    temperature: temp,
    humidity: humidity,
    windSpeed: wind,
    recommendation: recommendation
  };
};

export const findPlantByName = (plantName: string): PlantData | undefined => {
  return plantsDatabase.find(plant => 
    plant.name.toLowerCase().includes(plantName.toLowerCase())
  );
};

export const findDiseaseRemedies = (diseaseName: string): DiseaseData[] => {
  const remedies: DiseaseData[] = [];
  plantsDatabase.forEach(plant => {
    plant.diseases.forEach(disease => {
      if (disease.name.toLowerCase().includes(diseaseName.toLowerCase())) {
        remedies.push(disease);
      }
    });
  });
  return remedies;
};