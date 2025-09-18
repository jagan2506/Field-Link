-- SUPABASE TABLES CREATION - Run in SQL Editor

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

-- Insert sample data
INSERT INTO sensor_readings (temperature, soil_moisture, ph_level, humidity, light_intensity) VALUES
(25.5, 65, 6.8, 70.2, 850),
(26.1, 62, 6.9, 68.5, 920),
(24.8, 68, 6.7, 72.1, 780);