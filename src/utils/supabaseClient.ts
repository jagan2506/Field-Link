import { createClient } from '@supabase/supabase-js';

// Supabase credentials from environment variables
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || 'https://gmlollhziblltvgxccfl.supabase.co';
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdtbG9sbGh6aWJsbHR2Z3hjY2ZsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgxNzUwMTUsImV4cCI6MjA3Mzc1MTAxNX0.ObULZe5cgYMCy5DU5cw19G5qbum-HAyhKQ4lq-WwZJw';

export const supabase = supabaseUrl.includes('your-project') ? null : createClient(supabaseUrl, supabaseKey);

// Test connection
export const testConnection = async () => {
  if (!supabase) return false;
  try {
    const { data, error } = await supabase.from('sensor_readings').select('count').limit(1);
    if (error) {
      console.error('❌ Supabase connection failed:', error);
      return false;
    }
    console.log('✅ Supabase connected successfully');
    return true;
  } catch (err) {
    console.error('❌ Supabase connection error:', err);
    return false;
  }
};

// Insert sensor data
export const insertSensorData = async (temperature: number, soilMoisture: number, phLevel: number) => {
  if (!supabase) return null;
  try {
    const { data, error } = await supabase
      .from('sensor_readings')
      .insert([{ temperature, soil_moisture: soilMoisture, ph_level: phLevel }])
      .select();
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error inserting sensor data:', error);
    return null;
  }
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

// Insert multispectral analysis
export const insertMultispectralAnalysis = async (imageUrl: string, multispectralData: any) => {
  const { data, error } = await supabase
    .from('multispectral_analysis')
    .insert([{
      image_url: imageUrl,
      ndvi: multispectralData.ndvi,
      ndre: multispectralData.ndre,
      gndvi: multispectralData.gndvi,
      nir: multispectralData.nir,
      red_band: multispectralData.red,
      green_band: multispectralData.green
    }])
    .select();
  
  if (error) console.error('Error inserting multispectral analysis:', error);
  return data?.[0];
};

// Insert pest risk analysis
export const insertPestRiskAnalysis = async (multispectralId: number, pestData: any) => {
  const { data, error } = await supabase
    .from('pest_risk_analysis')
    .insert([{
      multispectral_id: multispectralId,
      risk_level: pestData.riskLevel,
      pest_types: pestData.pestTypes,
      confidence: pestData.confidence,
      treatment_urgency: pestData.treatmentUrgency,
      recommendations: pestData.recommendations
    }]);
  
  if (error) console.error('Error inserting pest risk analysis:', error);
  return data;
};

// Insert AI crop health analysis
export const insertCropHealthAI = async (analysisData: any) => {
  const { data, error } = await supabase
    .from('crop_health_ai')
    .insert([{
      image_url: analysisData.imageUrl,
      disease_detected: analysisData.diseaseDetected,
      disease_name: analysisData.diseaseName,
      severity: analysisData.severity,
      confidence: analysisData.confidence,
      health_status: analysisData.healthStatus,
      remedies: analysisData.remedies
    }]);
  
  if (error) console.error('Error inserting crop health AI:', error);
  return data;
};

// Insert soil condition AI
export const insertSoilConditionAI = async (sensorId: number, soilData: any) => {
  const { data, error } = await supabase
    .from('soil_condition_ai')
    .insert([{
      sensor_reading_id: sensorId,
      health_score: soilData.healthScore,
      nutrient_deficiency: soilData.nutrientDeficiency,
      moisture_stress: soilData.moistureStress,
      ph_imbalance: soilData.phImbalance,
      recommendations: soilData.recommendations
    }]);
  
  if (error) console.error('Error inserting soil condition AI:', error);
  return data;
};

// Get comprehensive monitoring dashboard
export const getMonitoringDashboard = async () => {
  const { data, error } = await supabase
    .from('monitoring_dashboard')
    .select('*')
    .limit(10);
  
  if (error) console.error('Error fetching monitoring data:', error);
  return data;
};

// Get critical alerts
export const getCriticalAlerts = async () => {
  const { data, error } = await supabase.rpc('get_critical_alerts');
  if (error) console.error('Error fetching critical alerts:', error);
  return data;
};

// Complete analysis workflow
export const saveCompleteAnalysis = async (imageData: string, multispectralData: any, pestData: any, cropData: any, sensorData: any) => {
  if (!supabase) {
    console.warn('Supabase not configured, skipping database save');
    return false;
  }
  try {
    // 1. Save sensor data
    const { data: sensorRecord } = await supabase
      .from('sensor_readings')
      .insert([{
        temperature: sensorData.temperature,
        soil_moisture: sensorData.soilMoisture,
        ph_level: sensorData.phLevel,
        humidity: sensorData.humidity || 65,
        light_intensity: sensorData.lightIntensity || 800
      }])
      .select()
      .single();

    // 2. Save multispectral analysis
    const { data: multispectralRecord } = await supabase
      .from('multispectral_analysis')
      .insert([{
        image_url: imageData,
        ndvi: multispectralData.ndvi,
        ndre: multispectralData.ndre,
        gndvi: multispectralData.gndvi,
        nir: multispectralData.nir,
        red_band: multispectralData.red,
        green_band: multispectralData.green
      }])
      .select()
      .single();

    // 3. Save pest risk analysis
    await supabase
      .from('pest_risk_analysis')
      .insert([{
        multispectral_id: multispectralRecord.id,
        risk_level: pestData.riskLevel,
        pest_types: pestData.pestTypes,
        confidence: pestData.confidence,
        treatment_urgency: pestData.treatmentUrgency,
        recommendations: pestData.recommendations
      }]);

    // 4. Save crop health AI
    await supabase
      .from('crop_health_ai')
      .insert([{
        image_url: imageData,
        disease_detected: cropData.diseaseDetected,
        disease_name: cropData.diseaseName,
        severity: cropData.severity,
        confidence: cropData.confidence,
        health_status: cropData.healthStatus,
        remedies: cropData.remedies
      }]);

    // 5. Save soil condition AI
    if (sensorRecord?.id) {
      const soilAnalysis = {
        healthScore: 85,
        nutrientDeficiency: [],
        moistureStress: sensorData.soilMoisture < 30,
        phImbalance: sensorData.phLevel < 6.0 || sensorData.phLevel > 7.5,
        recommendations: ['Monitor soil conditions']
      };

      await supabase
        .from('soil_condition_ai')
        .insert([{
          sensor_reading_id: sensorRecord.id,
          health_score: soilAnalysis.healthScore,
          nutrient_deficiency: soilAnalysis.nutrientDeficiency,
          moisture_stress: soilAnalysis.moistureStress,
          ph_imbalance: soilAnalysis.phImbalance,
          recommendations: soilAnalysis.recommendations
        }]);
    }

    // 6. Create alert if critical
    if (pestData.riskLevel === 'Critical' || pestData.riskLevel === 'High') {
      await supabase
        .from('ai_alerts')
        .insert([{
          alert_type: 'pest_risk',
          message: `${pestData.riskLevel} pest risk detected: ${pestData.pestTypes.join(', ')}`,
          severity: pestData.riskLevel === 'Critical' ? 'critical' : 'warning',
          source_table: 'pest_risk_analysis',
          source_id: multispectralRecord.id
        }]);
    }

    console.log('✅ Complete analysis saved to Supabase');
    return true;
  } catch (error) {
    console.error('❌ Error saving complete analysis:', error);
    return false;
  }
};

// Insert AI alert
export const insertAIAlert = async (type: string, message: string, severity: string, sourceTable: string, sourceId: number) => {
  const { data, error } = await supabase
    .from('ai_alerts')
    .insert([{ alert_type: type, message, severity, source_table: sourceTable, source_id: sourceId }]);
  
  if (error) console.error('Error inserting AI alert:', error);
  return data;
};