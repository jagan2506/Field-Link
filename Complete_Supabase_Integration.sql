-- COMPLETE SUPABASE SQL SETUP FOR AI AGRICULTURAL MONITORING

-- 1. Create all tables
CREATE TABLE sensor_readings (
  id BIGSERIAL PRIMARY KEY,
  temperature DECIMAL(5,2),
  soil_moisture INTEGER,
  ph_level DECIMAL(3,1),
  humidity DECIMAL(5,2),
  light_intensity INTEGER,
  timestamp TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE multispectral_analysis (
  id BIGSERIAL PRIMARY KEY,
  image_url TEXT,
  ndvi DECIMAL(6,4),
  ndre DECIMAL(6,4),
  gndvi DECIMAL(6,4),
  nir DECIMAL(6,4),
  red_band DECIMAL(6,4),
  green_band DECIMAL(6,4),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE pest_risk_analysis (
  id BIGSERIAL PRIMARY KEY,
  multispectral_id BIGINT REFERENCES multispectral_analysis(id),
  risk_level TEXT CHECK (risk_level IN ('Low', 'Medium', 'High', 'Critical')),
  pest_types JSONB,
  confidence DECIMAL(5,2),
  treatment_urgency TEXT CHECK (treatment_urgency IN ('Monitor', 'Soon', 'Immediate')),
  recommendations JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE crop_health_ai (
  id BIGSERIAL PRIMARY KEY,
  image_url TEXT,
  disease_detected BOOLEAN,
  disease_name TEXT,
  severity TEXT,
  confidence DECIMAL(5,2),
  health_status TEXT,
  remedies JSONB,
  ai_model_version TEXT DEFAULT 'v1.0',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE soil_condition_ai (
  id BIGSERIAL PRIMARY KEY,
  sensor_reading_id BIGINT REFERENCES sensor_readings(id),
  health_score INTEGER,
  nutrient_deficiency JSONB,
  moisture_stress BOOLEAN,
  ph_imbalance BOOLEAN,
  recommendations JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE ai_alerts (
  id BIGSERIAL PRIMARY KEY,
  alert_type TEXT,
  message TEXT,
  severity TEXT CHECK (severity IN ('info', 'warning', 'critical')),
  source_table TEXT,
  source_id BIGINT,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Enable Row Level Security (RLS)
ALTER TABLE sensor_readings ENABLE ROW LEVEL SECURITY;
ALTER TABLE multispectral_analysis ENABLE ROW LEVEL SECURITY;
ALTER TABLE pest_risk_analysis ENABLE ROW LEVEL SECURITY;
ALTER TABLE crop_health_ai ENABLE ROW LEVEL SECURITY;
ALTER TABLE soil_condition_ai ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_alerts ENABLE ROW LEVEL SECURITY;

-- 3. Create policies for public access
CREATE POLICY "Allow public read access" ON sensor_readings FOR SELECT USING (true);
CREATE POLICY "Allow public insert" ON sensor_readings FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public read access" ON multispectral_analysis FOR SELECT USING (true);
CREATE POLICY "Allow public insert" ON multispectral_analysis FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public read access" ON pest_risk_analysis FOR SELECT USING (true);
CREATE POLICY "Allow public insert" ON pest_risk_analysis FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public read access" ON crop_health_ai FOR SELECT USING (true);
CREATE POLICY "Allow public insert" ON crop_health_ai FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public read access" ON soil_condition_ai FOR SELECT USING (true);
CREATE POLICY "Allow public insert" ON soil_condition_ai FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public read access" ON ai_alerts FOR SELECT USING (true);
CREATE POLICY "Allow public insert" ON ai_alerts FOR INSERT WITH CHECK (true);

-- 4. Create indexes for better performance
CREATE INDEX idx_sensor_readings_timestamp ON sensor_readings(timestamp DESC);
CREATE INDEX idx_multispectral_created_at ON multispectral_analysis(created_at DESC);
CREATE INDEX idx_pest_risk_level ON pest_risk_analysis(risk_level);
CREATE INDEX idx_crop_health_disease ON crop_health_ai(disease_detected);
CREATE INDEX idx_ai_alerts_unread ON ai_alerts(is_read, created_at DESC);

-- 5. Sample data insertion
INSERT INTO sensor_readings (temperature, soil_moisture, ph_level, humidity, light_intensity) VALUES
(25.5, 65, 6.8, 70.2, 850),
(26.1, 62, 6.9, 68.5, 920),
(24.8, 68, 6.7, 72.1, 780);

INSERT INTO multispectral_analysis (image_url, ndvi, ndre, gndvi, nir, red_band, green_band) VALUES
('plant1.jpg', 0.7542, 0.6234, 0.8123, 0.8456, 0.3421, 0.4567),
('plant2.jpg', 0.6234, 0.5123, 0.7234, 0.7890, 0.4123, 0.5234);

INSERT INTO pest_risk_analysis (multispectral_id, risk_level, pest_types, confidence, treatment_urgency, recommendations) VALUES
(1, 'High', '["Aphids", "Spider Mites"]'::jsonb, 87.5, 'Soon', '["Apply targeted pesticide", "Increase monitoring"]'::jsonb),
(2, 'Medium', '["Fungal Diseases"]'::jsonb, 75.2, 'Monitor', '["Improve air circulation", "Reduce humidity"]'::jsonb);

-- 6. Essential queries for the application
-- Get latest comprehensive monitoring data
CREATE OR REPLACE VIEW monitoring_dashboard AS
SELECT 
  sr.id as sensor_id,
  sr.temperature,
  sr.soil_moisture,
  sr.ph_level,
  sr.timestamp,
  ma.ndvi,
  ma.ndre,
  ma.gndvi,
  pra.risk_level,
  pra.pest_types,
  pra.confidence as pest_confidence,
  cha.disease_detected,
  cha.disease_name,
  cha.severity,
  sca.health_score,
  sca.moisture_stress,
  sca.ph_imbalance
FROM sensor_readings sr
LEFT JOIN multispectral_analysis ma ON DATE(sr.timestamp) = DATE(ma.created_at)
LEFT JOIN pest_risk_analysis pra ON ma.id = pra.multispectral_id
LEFT JOIN crop_health_ai cha ON DATE(sr.timestamp) = DATE(cha.created_at)
LEFT JOIN soil_condition_ai sca ON sr.id = sca.sensor_reading_id
ORDER BY sr.timestamp DESC;

-- Function to get critical alerts
CREATE OR REPLACE FUNCTION get_critical_alerts()
RETURNS TABLE (
  alert_id BIGINT,
  alert_type TEXT,
  message TEXT,
  severity TEXT,
  created_at TIMESTAMPTZ
) AS $$
BEGIN
  RETURN QUERY
  SELECT id, ai_alerts.alert_type, ai_alerts.message, ai_alerts.severity, ai_alerts.created_at
  FROM ai_alerts
  WHERE is_read = false AND severity IN ('warning', 'critical')
  ORDER BY created_at DESC
  LIMIT 10;
END;
$$ LANGUAGE plpgsql;