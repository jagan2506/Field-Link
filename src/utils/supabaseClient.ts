import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'YOUR_SUPABASE_URL';
const supabaseKey = 'YOUR_SUPABASE_ANON_KEY';

export const supabase = createClient(supabaseUrl, supabaseKey);

// Insert sensor data
export const insertSensorData = async (temperature: number, soilMoisture: number, phLevel: number) => {
  const { data, error } = await supabase
    .from('sensor_readings')
    .insert([{ temperature, soil_moisture: soilMoisture, ph_level: phLevel }]);
  
  if (error) console.error('Error inserting sensor data:', error);
  return data;
};

// Get latest sensor readings
export const getLatestSensorData = async () => {
  const { data, error } = await supabase
    .from('sensor_readings')
    .select('*')
    .order('timestamp', { ascending: false })
    .limit(1);
  
  if (error) console.error('Error fetching sensor data:', error);
  return data?.[0];
};

// Insert crop analysis
export const insertCropAnalysis = async (analysisData: any) => {
  const { data, error } = await supabase
    .from('crop_analysis')
    .insert([{
      disease_detected: analysisData.diseaseDetected,
      disease_name: analysisData.diseaseName,
      severity: analysisData.severity,
      confidence: analysisData.confidence,
      health_status: analysisData.healthStatus,
      remedies: analysisData.remedies
    }]);
  
  if (error) console.error('Error inserting crop analysis:', error);
  return data;
};

// Insert alert
export const insertAlert = async (type: string, message: string, severity: string) => {
  const { data, error } = await supabase
    .from('alerts')
    .insert([{ alert_type: type, message, severity }]);
  
  if (error) console.error('Error inserting alert:', error);
  return data;
};