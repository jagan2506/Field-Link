# How to Connect ESP32 to Your App

## Step 1: Find ESP32 IP Address
1. Upload ESP32 code to your board
2. Open Arduino IDE → Tools → Serial Monitor
3. Set baud rate to 115200
4. Press ESP32 reset button
5. Look for: "IP address: 192.168.1.XXX"
6. Write down this IP address

## Step 2: Connect in Web App
1. Open your React app in browser
2. Scroll down to the action buttons section
3. Look for button: "📡 Connect ESP32"
4. Click the "📡 Connect ESP32" button
5. Enter the IP address from Step 1 (e.g., 192.168.1.105)
6. Click OK

## Step 3: Verify Connection
- Status should change to: "ESP32 Connected - Live Data"
- Temperature and soil moisture will show real sensor values
- Data updates every 30 seconds automatically

## Troubleshooting
- If "ESP32 Not Found": Check IP address and WiFi connection
- If no data: Ensure ESP32 and computer are on same WiFi network
- If connection fails: Try accessing http://ESP32_IP in browser first

## Button Location
The "📡 Connect ESP32" button is located in the Action Buttons section, below the sensor cards and analysis panels.