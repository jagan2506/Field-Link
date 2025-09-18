import { initializeApp } from 'firebase/app';
import { getDatabase, ref, push, get, query, orderByChild, limitToLast } from 'firebase/database';
import { getFirestore, collection, addDoc, getDocs, query as firestoreQuery, orderBy, limit } from 'firebase/firestore';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDStBJY_C9OyeJ_MVNXJYz101FjRW6SqYo",
  authDomain: "agriai-90ab6.firebaseapp.com",
  projectId: "agriai-90ab6",
  storageBucket: "agriai-90ab6.appspot.com",
  messagingSenderId: "123456789",
  appId: "agriai-90ab6",
  databaseURL: "https://agriai-90ab6-default-rtdb.firebaseio.com/"
}

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const rtdb = getDatabase(app);

// Test connection
export const testConnection = async () => {
  try {
    await getDocs(collection(db, 'sensor_readings'));
    console.log('✅ Firebase connected successfully');
    return true;
  } catch (error) {
    console.error('❌ Firebase connection failed:', error);
    return false;
  }
};

// Insert sensor data to Realtime Database
export const insertSensorData = async (temperature: number, soilMoisture: number, phLevel: number) => {
  try {
    const sensorRef = ref(rtdb, 'sensor_readings');
    const newData = {
      temperature,
      soil_moisture: soilMoisture,
      ph_level: phLevel,
      timestamp: Date.now()
    };
    await push(sensorRef, newData);
    console.log('✅ Sensor data saved to Firebase');
    return newData;
  } catch (error) {
    console.error('Error inserting sensor data:', error);
    return null;
  }
};

// Get latest sensor data from Realtime Database
export const getLatestSensorData = async () => {
  try {
    const sensorRef = ref(rtdb, 'sensor_readings');
    const q = query(sensorRef, orderByChild('timestamp'), limitToLast(1));
    const snapshot = await get(q);
    
    if (snapshot.exists()) {
      const data = snapshot.val();
      const latestKey = Object.keys(data)[0];
      return data[latestKey];
    }
    return null;
  } catch (error) {
    console.error('Error fetching sensor data:', error);
    return null;
  }
};

// Insert crop analysis
export const insertCropAnalysis = async (analysisData: any) => {
  try {
    const docRef = await addDoc(collection(db, 'crop_analysis'), {
      ...analysisData,
      created_at: new Date()
    });
    return docRef;
  } catch (error) {
    console.error('Error inserting crop analysis:', error);
    return null;
  }
};

// Get monitoring dashboard data from Realtime Database
export const getMonitoringDashboard = async () => {
  try {
    const sensorRef = ref(rtdb, 'sensor_readings');
    const q = query(sensorRef, orderByChild('timestamp'), limitToLast(10));
    const snapshot = await get(q);
    
    if (snapshot.exists()) {
      const data = snapshot.val();
      return Object.keys(data).map(key => ({ id: key, ...data[key] }));
    }
    return [];
  } catch (error) {
    console.error('Error fetching monitoring data:', error);
    return [];
  }
};