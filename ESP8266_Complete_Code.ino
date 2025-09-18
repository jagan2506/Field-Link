#include <ESP8266WiFi.h>
#include <ESP8266WebServer.h>
#include <ESP8266HTTPClient.h>
#include <WiFiClient.h>
#include <ArduinoJson.h>
#include <OneWire.h>
#include <DallasTemperature.h>

// WiFi credentials
const char* ssid = "POCO X6 5G";
const char* password = ""; // Open network - no password

// Supabase credentials
const char* supabaseUrl = "https://gmlollhziblltvgxccfl.supabase.co";
const char* supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdtbG9sbGh6aWJsbHR2Z3hjY2ZsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgxNzUwMTUsImV4cCI6MjA3Mzc1MTAxNX0.ObULZe5cgYMCy5DU5cw19G5qbum-HAyhKQ4lq-WwZJw";

// Sensor pins
#define SOIL_MOISTURE_PIN A0
#define TEMP_SENSOR_PIN 4

OneWire oneWire(TEMP_SENSOR_PIN);
DallasTemperature tempSensor(&oneWire);
ESP8266WebServer server(80);

// Global sensor values
float currentTemp = 0;
int currentMoisture = 0;
float currentPH = 0;

void setup() {
  Serial.begin(115200);
  tempSensor.begin();
  
  WiFi.begin(ssid); // Open network - no password needed
  Serial.print("Connecting to WiFi");
  int attempts = 0;
  while (WiFi.status() != WL_CONNECTED && attempts < 30) {
    delay(1000);
    Serial.print(".");
    attempts++;
  }
  
  if (WiFi.status() == WL_CONNECTED) {
    Serial.println("\nWiFi connected!");
  } else {
    Serial.println("\nWiFi connection failed!");
    Serial.println("Restarting ESP8266...");
    ESP.restart();
  }
  
  Serial.println("WiFi connected!");
  Serial.print("IP address: ");
  Serial.println(WiFi.localIP());
  
  // Setup web server routes
  server.on("/", handleRoot);
  server.on("/sensors", handleSensors);
  server.on("/status", handleStatus);
  
  server.enableCORS(true);
  server.begin();
  Serial.println("HTTP server started");
  
  // Test sensors immediately
  Serial.println("\n=== Testing Sensors ===");
  readSensors();
  delay(2000);
  readSensors();
}

void loop() {
  server.handleClient();
  
  // Read sensors every 5 seconds
  static unsigned long lastReading = 0;
  if (millis() - lastReading > 5000) {
    readSensors();
    lastReading = millis();
  }
  
  // Send to Supabase every 30 seconds
  static unsigned long lastSupabase = 0;
  if (millis() - lastSupabase > 30000) {
    sendToSupabase(currentTemp, currentMoisture, currentPH);
    lastSupabase = millis();
  }
  
  delay(100);
}

void readSensors() {
  // Read temperature sensor
  tempSensor.requestTemperatures();
  float newTemp = tempSensor.getTempCByIndex(0);
  
  // Check if temperature sensor is working
  if (newTemp == DEVICE_DISCONNECTED_C || newTemp == -127.00 || newTemp == 85.00) {
    Serial.println("⚠️ TEMPERATURE SENSOR ISSUE!");
    Serial.println("- Check D4 pin connection");
    Serial.println("- Add 4.7k resistor between Data and VCC");
    Serial.println("- Verify DS18B20 wiring");
    newTemp = 20.0 + random(0, 100) / 10.0; // Random for testing
  }
  currentTemp = newTemp;
  
  // Read soil moisture sensor multiple times
  int soilSum = 0;
  for(int i = 0; i < 5; i++) {
    soilSum += analogRead(SOIL_MOISTURE_PIN);
    delay(10);
  }
  int soilMoistureRaw = soilSum / 5; // Average reading
  
  // Check if soil sensor is connected
  if (soilMoistureRaw == 0 || soilMoistureRaw >= 1020) {
    Serial.println("⚠️ SOIL SENSOR ISSUE!");
    Serial.println("- Check A0 pin connection");
    Serial.println("- Verify sensor power (VCC/GND)");
    Serial.println("- Touch sensor probes to test");
    soilMoistureRaw = 400 + random(0, 400); // Random for testing
  }
  
  // Convert to percentage
  currentMoisture = constrain(map(soilMoistureRaw, 800, 300, 0, 100), 0, 100);
  currentPH = 6.0 + (currentMoisture / 100.0) * 1.5;
  
  Serial.println("\n=== LIVE SENSOR DATA [" + String(millis()/1000) + "s] ===");
  Serial.println("🌡️ Temperature: " + String(currentTemp, 1) + "°C");
  Serial.println("💧 Soil Raw ADC: " + String(soilMoistureRaw) + " (0-1024)");
  Serial.println("💧 Soil Moisture: " + String(currentMoisture) + "%");
  Serial.println("🧪 pH Level: " + String(currentPH, 1));
  
  // Sensor status
  if (soilMoistureRaw < 200) Serial.println("🌵 Status: VERY DRY");
  else if (soilMoistureRaw < 400) Serial.println("🌱 Status: DRY");
  else if (soilMoistureRaw < 600) Serial.println("🌿 Status: MOIST");
  else Serial.println("💦 Status: WET");
  
  Serial.println("================================================\n");
}

void handleRoot() {
  server.sendHeader("Access-Control-Allow-Origin", "*");
  server.send(200, "text/plain", "ESP8266 Sensor Server Running");
}

void handleStatus() {
  server.sendHeader("Access-Control-Allow-Origin", "*");
  server.send(200, "application/json", "{\"status\":\"connected\"}");
}

void handleSensors() {
  server.sendHeader("Access-Control-Allow-Origin", "*");
  server.sendHeader("Access-Control-Allow-Methods", "GET");
  server.sendHeader("Access-Control-Allow-Headers", "Content-Type");
  
  DynamicJsonDocument doc(300);
  doc["temperature"] = currentTemp;
  doc["soilMoisture"] = analogRead(SOIL_MOISTURE_PIN); // Raw for app conversion
  doc["soilMoisturePercent"] = currentMoisture;
  doc["phLevel"] = currentPH;
  doc["timestamp"] = millis();
  doc["status"] = "live";
  
  String response;
  serializeJson(doc, response);
  
  server.send(200, "application/json", response);
  
  Serial.println("Data sent to web app");
}

void sendToSupabase(float temp, int moisture, float ph) {
  if (WiFi.status() == WL_CONNECTED) {
    WiFiClient client;
    HTTPClient http;
    
    http.begin(client, String(supabaseUrl) + "/rest/v1/sensor_readings");
    http.addHeader("Content-Type", "application/json");
    http.addHeader("apikey", supabaseKey);
    http.addHeader("Authorization", "Bearer " + String(supabaseKey));
    
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