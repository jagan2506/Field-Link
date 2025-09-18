# ESP8266 Upload Port Fix

## Problem: "Failed uploading: no upload port provided"

## Solution:

### Step 1: Connect ESP8266
- Connect ESP8266 to computer via USB cable
- Wait 10 seconds for drivers to install

### Step 2: Select COM Port
- Arduino IDE → Tools → Port
- Select available COM port (e.g., COM3, COM4, COM5)
- If no ports visible, check cable connection

### Step 3: Select Correct Board
- Tools → Board → ESP8266 Boards
- Select: "NodeMCU 1.0 (ESP-12E Module)"

### Step 4: Upload Settings
- Upload Speed: 115200
- CPU Frequency: 80 MHz
- Flash Size: 4MB (FS:2MB OTA:~1019KB)
- Debug Port: Disabled
- Debug Level: None
- IwIP Variant: v2 Lower Memory
- VTables: Flash
- Exceptions: Legacy
- Erase Flash: Only Sketch
- SSL Support: All SSL ciphers

### Step 5: Upload
- Press and hold FLASH button on ESP8266 (if available)
- Click Upload in Arduino IDE
- Release FLASH button when "Connecting..." appears

## If Still No COM Port:
1. Install CH340 or CP2102 USB drivers
2. Try different USB cable (data cable, not charging only)
3. Try different USB port
4. Restart Arduino IDE

## Memory Usage (Normal):
- RAM: 37% used ✅
- IRAM: 92% used ⚠️ (high but acceptable)
- Flash: 27% used ✅