#include <WiFi.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>
#include <OneWire.h>
#include <DallasTemperature.h>

// WiFi credentials
const char* ssid = "YOUR_WIFI_SSID";
const char* password = "YOUR_WIFI_PASSWORD";

// Supabase credentials
const char* supabaseUrl = "https://gmlollhziblltvgxccfl.supabase.co";
const char* supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdtbG9sbGh6aWJsbHR2Z3hjY2ZsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgxNzUwMTUsImV4cCI6MjA3Mzc1MTAxNX0.ObULZe5cgYMCy5DU5cw19G5qbum-HAyhKQ4lq-WwZJw";

// Sensor pins
#define SOIL_MOISTURE_PIN A0
#define TEMP_SENSOR_PIN 4

OneWire oneWire(TEMP_SENSOR_PIN);
DallasTemperature tempSensor(&oneWire);

void setup() {
  Serial.begin(115200);
  tempSensor.begin();
  
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(1000);
    Serial.println("Connecting to WiFi...");
  }
  Serial.println("WiFi connected!");
}

void loop() {
  // Read sensors
  tempSensor.requestTemperatures();
  float temperature = tempSensor.getTempCByIndex(0);
  int soilMoistureRaw = analogRead(SOIL_MOISTURE_PIN);
  int soilMoisture = map(soilMoistureRaw, 3000, 1000, 0, 100); // Convert to percentage
  float phLevel = 6.8; // Mock pH value
  
  // Send to Supabase
  sendToSupabase(temperature, soilMoisture, phLevel);
  
  delay(30000); // Send every 30 seconds
}

void sendToSupabase(float temp, int moisture, float ph) {
  if (WiFi.status() == WL_CONNECTED) {
    HTTPClient http;
    http.begin(String(supabaseUrl) + "/rest/v1/sensor_readings");
    http.addHeader("Content-Type", "application/json");
    http.addHeader("apikey", supabaseKey);
    http.addHeader("Authorization", "Bearer " + String(supabaseKey));
    
    // Create JSON payload
    DynamicJsonDocument doc(200);
    doc["temperature"] = temp;
    doc["soil_moisture"] = moisture;
    doc["ph_level"] = ph;
    
    String payload;
    serializeJson(doc, payload);
    
    int httpResponseCode = http.POST(payload);
    
    if (httpResponseCode == 201) {
      Serial.println("✅ Data sent to Supabase successfully");
    } else {
      Serial.println("❌ Error sending to Supabase: " + String(httpResponseCode));
    }
    
    http.end();
  }
}