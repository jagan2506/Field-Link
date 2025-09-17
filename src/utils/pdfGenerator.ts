import jsPDF from 'jspdf';
import { SensorData } from './mockData';
import { Translations } from './translations';

export const generatePDF = (sensorData: SensorData, t: Translations) => {
  const doc = new jsPDF();
  
  // Header
  doc.setFontSize(20);
  doc.text(t.appTitle, 20, 20);
  doc.setFontSize(12);
  doc.text(t.appSubtitle, 20, 30);
  
  // Current date
  doc.text(`${t.lastUpdated} ${new Date().toLocaleString()}`, 20, 40);
  
  // Sensor Data
  doc.setFontSize(16);
  doc.text(t.currentFieldConditions, 20, 60);
  
  doc.setFontSize(12);
  doc.text(`${t.temperature}: ${sensorData.temperature}°C`, 20, 75);
  doc.text(`${t.soilMoisture}: ${sensorData.soilMoisture}%`, 20, 85);
  doc.text(`${t.phLevel}: ${sensorData.phLevel}`, 20, 95);
  doc.text(`${t.cropHealth}: ${sensorData.cropHealth.status}`, 20, 105);
  doc.text(`NDVI: ${sensorData.cropHealth.ndvi}`, 20, 115);
  doc.text(`${t.chlorophyll}: ${sensorData.cropHealth.chlorophyllLevel}`, 20, 125);
  
  // Status indicators
  doc.setFontSize(14);
  doc.text('Status Analysis:', 20, 145);
  doc.setFontSize(10);
  
  const tempStatus = sensorData.temperature > 30 ? t.warning : sensorData.temperature < 15 ? t.alert : t.normal;
  const moistureStatus = sensorData.soilMoisture < 30 ? t.alert : sensorData.soilMoisture < 50 ? t.warning : t.normal;
  const phStatus = sensorData.phLevel < 6 || sensorData.phLevel > 7.5 ? t.warning : t.normal;
  
  doc.text(`${t.temperature}: ${tempStatus}`, 20, 155);
  doc.text(`${t.soilMoisture}: ${moistureStatus}`, 20, 165);
  doc.text(`${t.phLevel}: ${phStatus}`, 20, 175);
  
  // Save the PDF
  doc.save(`${t.appTitle.replace(' ', '_')}_Report_${new Date().toISOString().split('T')[0]}.pdf`);
};