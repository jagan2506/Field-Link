// IoT Sensor Integration with ESP32
export interface SensorReading {
  temperature: number;
  soilMoisture: number;
  timestamp: Date;
}

export class IoTSensorManager {
  private esp32Url: string;
  private isConnected: boolean = false;
  private connectionStatus: string = 'Disconnected';

  constructor(esp8266Ip: string = '192.168.1.100') {
    this.esp32Url = `http://${esp8266Ip}`;
  }

  getConnectionStatus(): string {
    return this.connectionStatus;
  }

  async connectToESP32(): Promise<boolean> {
    try {
      this.connectionStatus = 'Connecting...';
      const response = await fetch(`${this.esp32Url}/status`, { 
        method: 'GET',
        timeout: 5000 
      });
      
      if (response.ok) {
        this.isConnected = true;
        this.connectionStatus = 'Connected';
        console.log(`✅ ESP32 connected at ${this.esp32Url}`);
      } else {
        this.isConnected = false;
        this.connectionStatus = 'Connection Failed';
      }
      return this.isConnected;
    } catch (error) {
      console.error('❌ ESP32 connection failed:', error);
      this.isConnected = false;
      this.connectionStatus = 'Network Error';
      return false;
    }
  }

  async getSensorReadings(): Promise<SensorReading | null> {
    // Try ESP32 first
    try {
      const response = await fetch(`${this.esp32Url}/sensors`, { timeout: 5000 });
      const data = await response.json();
      
      if (data.status === 'live') {
        console.log('📡 ESP32 Live Data:', data);
        this.isConnected = true;
        return {
          temperature: parseFloat(data.temperature),
          soilMoisture: data.soilMoisturePercent || this.convertMoistureReading(data.soilMoisture),
          timestamp: new Date()
        };
      }
    } catch (error) {
      console.warn('ESP32 not available, trying Supabase fallback');
      this.isConnected = false;
    }
    
    // Fallback to Firebase
    return this.getFromFirebase();
  }

  async getFromFirebase(): Promise<SensorReading | null> {
    try {
      const response = await fetch('https://agriai-90ab6-default-rtdb.firebaseio.com/sensor_readings.json?orderBy="timestamp"&limitToLast=1');
      const data = await response.json();
      
      if (data) {
        const latestKey = Object.keys(data)[0];
        const latest = data[latestKey];
        return {
          temperature: latest.temperature,
          soilMoisture: latest.soil_moisture,
          timestamp: new Date(latest.timestamp)
        };
      }
      return null;
    } catch (error) {
      console.error('Firebase fetch failed:', error);
      return null;
    }
  }

  private convertMoistureReading(analogValue: number): number {
    // Convert analog reading (0-4095) to percentage (0-100%)
    // Dry soil = high value (~3000-4095), Wet soil = low value (~1000-2000)
    const dryValue = 3000;
    const wetValue = 1000;
    const percentage = Math.max(0, Math.min(100, 
      ((dryValue - analogValue) / (dryValue - wetValue)) * 100
    ));
    return Math.round(percentage);
  }

  setESP32IP(ip: string) {
    this.esp32Url = `http://${ip}`;
    this.isConnected = false;
  }
}