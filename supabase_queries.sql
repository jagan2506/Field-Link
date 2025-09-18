-- Create sensor_readings table
CREATE TABLE sensor_readings (
  id BIGSERIAL PRIMARY KEY,
  temperature DECIMAL(5,2),
  soil_moisture INTEGER,
  ph_level DECIMAL(3,1),
  humidity DECIMAL(5,2),
  light_intensity INTEGER,
  timestamp TIMESTAMPTZ DEFAULT NOW()
);

-- Create multispectral_analysis table
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

-- Create pest_risk_analysis table
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

-- Create crop_health_ai table
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

-- Create soil_condition_ai table
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

-- Create ai_alerts table
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

-- Insert multispectral analysis
INSERT INTO multispectral_analysis (image_url, ndvi, ndre, gndvi, nir, red_band, green_band)
VALUES ('image1.jpg', 0.7542, 0.6234, 0.8123, 0.8456, 0.3421, 0.4567);

-- Insert pest risk analysis
INSERT INTO pest_risk_analysis (multispectral_id, risk_level, pest_types, confidence, treatment_urgency, recommendations)
VALUES (1, 'High', '["Aphids", "Spider Mites"]'::jsonb, 87.5, 'Soon', '["Apply targeted pesticide", "Increase monitoring"]'::jsonb);

-- Insert AI crop health analysis
INSERT INTO crop_health_ai (disease_detected, disease_name, severity, confidence, health_status, remedies)
VALUES (true, 'Leaf Spot', 'Moderate', 89.2, 'Poor', '["Mancozeb 75% WP @ 2g/L", "Remove affected leaves"]'::jsonb);

-- Insert soil condition AI analysis
INSERT INTO soil_condition_ai (sensor_reading_id, health_score, nutrient_deficiency, moisture_stress, ph_imbalance, recommendations)
VALUES (1, 75, '["Nitrogen", "Phosphorus"]'::jsonb, true, false, '["Increase irrigation", "Apply balanced fertilizer"]'::jsonb);

-- Get comprehensive monitoring data
SELECT 
  sr.temperature, sr.soil_moisture, sr.ph_level,
  ma.ndvi, ma.ndre, ma.gndvi,
  pra.risk_level, pra.pest_types, pra.confidence,
  cha.disease_detected, cha.disease_name, cha.severity
FROM sensor_readings sr
LEFT JOIN multispectral_analysis ma ON DATE(sr.timestamp) = DATE(ma.created_at)
LEFT JOIN pest_risk_analysis pra ON ma.id = pra.multispectral_id
LEFT JOIN crop_health_ai cha ON DATE(sr.timestamp) = DATE(cha.created_at)
ORDER BY sr.timestamp DESC
LIMIT 10;

-- Get critical pest risks
SELECT pra.*, ma.ndvi, ma.image_url
FROM pest_risk_analysis pra
JOIN multispectral_analysis ma ON pra.multispectral_id = ma.id
WHERE pra.risk_level IN ('High', 'Critical')
ORDER BY pra.created_at DESC;

-- Get soil health trends
SELECT 
  DATE(sca.created_at) as date,
  AVG(sca.health_score) as avg_health_score,
  COUNT(CASE WHEN sca.moisture_stress THEN 1 END) as moisture_stress_count,
  COUNT(CASE WHEN sca.ph_imbalance THEN 1 END) as ph_imbalance_count
FROM soil_condition_ai sca
GROUP BY DATE(sca.created_at)
ORDER BY date DESC
LIMIT 30;

-- Insert AI alert
INSERT INTO ai_alerts (alert_type, message, severity, source_table, source_id)
VALUES ('pest_risk', 'Critical pest risk detected: Aphids', 'critical', 'pest_risk_analysis', 1);

-- Get unread AI alerts
SELECT * FROM ai_alerts 
WHERE is_read = false 
ORDER BY created_at DESC;