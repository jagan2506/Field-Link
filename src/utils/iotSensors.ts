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

  constructor(esp32Ip: string = '192.168.1.100') {
    this.esp32Url = `http://${esp32Ip}`;
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
    if (!this.isConnected) {
      await this.connectToESP32();
    }

    try {
      const response = await fetch(`${this.esp32Url}/sensors`);
      const data = await response.json();
      
      return {
        temperature: parseFloat(data.temperature),
        soilMoisture: this.convertMoistureReading(data.soilMoisture),
        timestamp: new Date()
      };
    } catch (error) {
      console.error('ESP32 failed, trying Supabase:', error);
      return this.getFromSupabase();
    }
  }

  async getFromSupabase(): Promise<SensorReading | null> {
    try {
      const response = await fetch('https://gmlollhziblltvgxccfl.supabase.co/rest/v1/sensor_readings?select=*&order=timestamp.desc&limit=1', {
        headers: {
          'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdtbG9sbGh6aWJsbHR2Z3hjY2ZsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgxNzUwMTUsImV4cCI6MjA3Mzc1MTAxNX0.ObULZe5cgYMCy5DU5cw19G5qbum-HAyhKQ4lq-WwZJw',
          'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdtbG9sbGh6aWJsbHR2Z3hjY2ZsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgxNzUwMTUsImV4cCI6MjA3Mzc1MTAxNX0.ObULZe5cgYMCy5DU5cw19G5qbum-HAyhKQ4lq-WwZJw'
        }
      });
      
      const data = await response.json();
      if (data && data.length > 0) {
        const latest = data[0];
        return {
          temperature: latest.temperature,
          soilMoisture: latest.soil_moisture,
          timestamp: new Date(latest.timestamp)
        };
      }
      return null;
    } catch (error) {
      console.error('Supabase fetch failed:', error);
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