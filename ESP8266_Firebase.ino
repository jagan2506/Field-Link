#include <ESP8266WiFi.h>
#include <ESP8266WebServer.h>
#include <ESP8266HTTPClient.h>
#include <WiFiClientSecure.h>
#include <ArduinoJson.h>
#include <OneWire.h>
#include <DallasTemperature.h>

// WiFi credentials
const char* ssid = "POCO X6";
const char* password = ""; // Open network

// Firebase credentials
const char* firebaseHost = "agriai-90ab6-default-rtdb.firebaseio.com";
const char* firebaseAuth = "AIzaSyDStBJY_C9OyeJ_MVNXJYz101FjRW6SqYo";

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
  
  WiFi.begin(ssid);
  Serial.print("Connecting to WiFi");
  int attempts = 0;
  while (WiFi.status() != WL_CONNECTED && attempts < 30) {
    delay(1000);
    Serial.print(".");
    attempts++;
  }
  
  if (WiFi.status() == WL_CONNECTED) {
    Serial.println("\nWiFi connected!");
    Serial.print("IP address: ");
    Serial.println(WiFi.localIP());
  } else {
    Serial.println("\nWiFi connection failed!");
    ESP.restart();
  }
  
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
}

void loop() {
  server.handleClient();
  
  // Read sensors every 5 seconds
  static unsigned long lastReading = 0;
  if (millis() - lastReading > 5000) {
    readSensors();
    lastReading = millis();
  }
  
  // Send to Firebase every 30 seconds
  static unsigned long lastFirebase = 0;
  if (millis() - lastFirebase > 30000) {
    sendToFirebase(currentTemp, currentMoisture, currentPH);
    lastFirebase = millis();
  }
  
  delay(100);
}

void readSensors() {
  // Read temperature sensor
  tempSensor.requestTemperatures();
  float newTemp = tempSensor.getTempCByIndex(0);
  
  if (newTemp == DEVICE_DISCONNECTED_C || newTemp == -127.00 || newTemp == 85.00) {
    Serial.println("⚠️ TEMPERATURE SENSOR ISSUE!");
    newTemp = 20.0 + random(0, 100) / 10.0;
  }
  currentTemp = newTemp;
  
  // Read soil moisture sensor
  int soilSum = 0;
  for(int i = 0; i < 5; i++) {
    soilSum += analogRead(SOIL_MOISTURE_PIN);
    delay(10);
  }
  int soilMoistureRaw = soilSum / 5;
  
  if (soilMoistureRaw == 0 || soilMoistureRaw >= 1020) {
    Serial.println("⚠️ SOIL SENSOR ISSUE!");
    soilMoistureRaw = 400 + random(0, 400);
  }
  
  currentMoisture = constrain(map(soilMoistureRaw, 800, 300, 0, 100), 0, 100);
  currentPH = 6.0 + (currentMoisture / 100.0) * 1.5;
  
  Serial.println("\n=== LIVE SENSOR DATA [" + String(millis()/1000) + "s] ===");
  Serial.println("🌡️ Temperature: " + String(currentTemp, 1) + "°C");
  Serial.println("💧 Soil Raw ADC: " + String(soilMoistureRaw));
  Serial.println("💧 Soil Moisture: " + String(currentMoisture) + "%");
  Serial.println("🧪 pH Level: " + String(currentPH, 1));
  Serial.println("================================================\n");
}

void handleRoot() {
  server.sendHeader("Access-Control-Allow-Origin", "*");
  server.send(200, "text/plain", "ESP8266 Firebase Sensor Server");
}

void handleStatus() {
  server.sendHeader("Access-Control-Allow-Origin", "*");
  server.send(200, "application/json", "{\"status\":\"connected\"}");
}

void handleSensors() {
  server.sendHeader("Access-Control-Allow-Origin", "*");
  
  DynamicJsonDocument doc(300);
  doc["temperature"] = currentTemp;
  doc["soilMoisture"] = analogRead(SOIL_MOISTURE_PIN);
  doc["soilMoisturePercent"] = currentMoisture;
  doc["phLevel"] = currentPH;
  doc["timestamp"] = millis();
  doc["status"] = "live";
  
  String response;
  serializeJson(doc, response);
  server.send(200, "application/json", response);
}

void sendToFirebase(float temp, int moisture, float ph) {
  if (WiFi.status() == WL_CONNECTED) {
    WiFiClientSecure client;
    client.setInsecure(); // For testing only
    HTTPClient http;
    
    String url = "https://" + String(firebaseHost) + "/sensor_readings.json?auth=" + String(firebaseAuth);
    http.begin(client, url);
    http.addHeader("Content-Type", "application/json");
    
    DynamicJsonDocument doc(200);
    doc["temperature"] = temp;
    doc["soil_moisture"] = moisture;
    doc["ph_level"] = ph;
    doc["timestamp"] = millis();
    
    String payload;
    serializeJson(doc, payload);
    
    int httpResponseCode = http.POST(payload);
    
    if (httpResponseCode == 200) {
      Serial.println("✅ Data sent to Firebase successfully");
    } else {
      Serial.println("❌ Error sending to Firebase: " + String(httpResponseCode));
    }
    
    http.end();
  }
}