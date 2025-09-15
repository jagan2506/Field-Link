export interface CropHealthData {
  status: 'Healthy' | 'Moderate' | 'Poor';
  ndvi: number;
  chlorophyllLevel: string;
  coverage: number;
}

export interface SensorData {
  temperature: number;
  soilMoisture: number;
  phLevel: number;
  cropHealth: CropHealthData;
  timestamp: Date;
}

export interface HistoricalData {
  temperature: number[];
  soilMoisture: number[];
  phLevel: number[];
}

export const generateMockData = (): SensorData => {
  // Generate realistic sensor data with some variability
  const temperature = Math.round((Math.random() * 20 + 15) * 10) / 10; // 15-35°C
  const soilMoisture = Math.round(Math.random() * 60 + 20); // 20-80%
  const phLevel = Math.round((Math.random() * 3 + 5.5) * 10) / 10; // 5.5-8.5

  // Generate NDVI based on conditions (better conditions = higher NDVI)
  let ndviBase = 0.7;
  if (temperature > 30 || temperature < 18) ndviBase -= 0.1;
  if (soilMoisture < 40) ndviBase -= 0.15;
  if (phLevel < 6 || phLevel > 7.5) ndviBase -= 0.05;
  
  const ndvi = Math.max(0.2, Math.round((ndviBase + (Math.random() * 0.2 - 0.1)) * 100) / 100);
  
  // Determine crop health status based on NDVI
  let status: 'Healthy' | 'Moderate' | 'Poor';
  if (ndvi >= 0.7) status = 'Healthy';
  else if (ndvi >= 0.5) status = 'Moderate';
  else status = 'Poor';

  // Generate chlorophyll level
  const chlorophyllLevels = ['High', 'Medium', 'Low'];
  const chlorophyllIndex = ndvi >= 0.7 ? 0 : ndvi >= 0.5 ? 1 : 2;
  
  return {
    temperature,
    soilMoisture,
    phLevel,
    cropHealth: {
      status,
      ndvi,
      chlorophyllLevel: chlorophyllLevels[chlorophyllIndex],
      coverage: Math.round(85 + (Math.random() * 10)) // 85-95% coverage
    },
    timestamp: new Date()
  };
};

export const generateHistoricalData = (timeRange: '24h' | '7d'): HistoricalData => {
  const dataPoints = timeRange === '24h' ? 24 : 7;
  
  const temperature: number[] = [];
  const soilMoisture: number[] = [];
  const phLevel: number[] = [];
  
  // Generate base values and add some trend
  let tempBase = 22;
  let moistureBase = 55;
  let phBase = 6.8;
  
  for (let i = 0; i < dataPoints; i++) {
    // Add some realistic variation and trends
    tempBase += (Math.random() - 0.5) * 2;
    moistureBase += (Math.random() - 0.6) * 3; // Slight downward trend for moisture
    phBase += (Math.random() - 0.5) * 0.1;
    
    // Keep values within realistic bounds
    tempBase = Math.max(15, Math.min(35, tempBase));
    moistureBase = Math.max(20, Math.min(80, moistureBase));
    phBase = Math.max(5.5, Math.min(8.0, phBase));
    
    temperature.push(Math.round(tempBase * 10) / 10);
    soilMoisture.push(Math.round(moistureBase));
    phLevel.push(Math.round(phBase * 10) / 10);
  }
  
  return { temperature, soilMoisture, phLevel };
};