# IoT Sensors → Supabase Integration

## Method 1: ESP32 Direct to Supabase

### Upload ESP32 Code:
1. Use `ESP32_Supabase_Direct.ino`
2. Change WiFi credentials
3. Upload to ESP32

### Features:
- ✅ Direct HTTP POST to Supabase
- ✅ Automatic 30-second intervals
- ✅ No intermediate server needed
- ✅ Real-time data storage

## Method 2: ESP32 → React App → Supabase

### Current Setup:
- ESP32 serves HTTP API
- React app fetches from ESP32
- React app saves to Supabase

## Method 3: Supabase Realtime (Advanced)

### Enable Realtime:
```sql
-- In Supabase SQL Editor
ALTER PUBLICATION supabase_realtime ADD TABLE sensor_readings;
```

### React Subscription:
```javascript
supabase
  .channel('sensor_data')
  .on('postgres_changes', 
    { event: 'INSERT', schema: 'public', table: 'sensor_readings' }, 
    payload => {
      console.log('New sensor data:', payload.new);
      setSensorData(payload.new);
    }
  )
  .subscribe();
```

## Data Flow Options:

### Option 1 (Direct):
```
ESP32 → WiFi → Supabase Database
```

### Option 2 (Current):
```
ESP32 → WiFi → React App → Supabase
```

### Option 3 (Realtime):
```
ESP32 → Supabase → Realtime → React App
```

## Quick Setup:
1. Upload `ESP32_Supabase_Direct.ino`
2. ESP32 automatically sends data every 30 seconds
3. React app reads latest data from Supabase
4. No configuration needed - works immediately!