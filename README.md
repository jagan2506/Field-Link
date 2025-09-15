# Field Link - Smart Agriculture Monitoring System

[![Smart India Hackathon](https://img.shields.io/badge/Smart%20India%20Hackathon-2025-green.svg)](https://www.sih.gov.in/)
[![React](https://img.shields.io/badge/React-18.3.1-blue.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5.3-blue.svg)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-5.4.2-purple.svg)](https://vitejs.dev/)

An advanced agricultural intelligence system developed for Smart India Hackathon, empowering farmers with AI-driven insights and real-time field monitoring capabilities.

## 🌱 Overview

Field Link is a comprehensive smart agriculture monitoring platform that combines IoT sensors, multispectral imaging, and AI analysis to provide farmers with real-time insights into their crop health and field conditions. The system helps optimize farming practices, reduce resource waste, and maximize crop yields.

## ✨ Key Features

### 🔄 Real-time Monitoring
- **Live Sensor Data**: Temperature, soil moisture, pH levels, and crop health metrics
- **Automatic Updates**: Data refreshes every 30 seconds for real-time insights
- **Smart Alerts**: Automated notifications for critical conditions

### 📊 Advanced Analytics
- **Multispectral Crop Analysis**: RGB, NDVI, and False Color imaging
- **NDVI Index Calculation**: Vegetation health assessment
- **Chlorophyll Level Monitoring**: Plant nutrition status tracking
- **Historical Data Visualization**: Trend analysis and pattern recognition

### 🎯 Intelligent Alerts
- **Condition-based Warnings**: Temperature, moisture, and pH alerts
- **Crop Health Notifications**: Early detection of plant stress
- **Customizable Thresholds**: Personalized alert settings

### 📱 User Experience
- **Responsive Design**: Mobile-friendly interface
- **Interactive Charts**: Visual data representation
- **Export Capabilities**: Download reports and data
- **Intuitive Dashboard**: Easy-to-use farmer interface

## 🛠️ Technology Stack

- **Frontend**: React 18.3.1 with TypeScript
- **Styling**: Tailwind CSS 3.4.1
- **Icons**: Lucide React 0.344.0
- **Build Tool**: Vite 5.4.2
- **Backend Integration**: Supabase 2.57.4
- **Development**: ESLint, PostCSS, Autoprefixer

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd project
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open in browser**
   Navigate to `http://localhost:5173`

### Available Scripts

```bash
npm run dev      # Start development server with host access
npm run build    # Build for production
npm run lint     # Run ESLint
npm run preview  # Preview production build
```

## 📁 Project Structure

```
project/
├── src/
│   ├── components/          # React components
│   │   ├── AlertSection.tsx     # Alert management
│   │   ├── CropHealthPanel.tsx  # Crop analysis display
│   │   ├── DataCharts.tsx       # Data visualization
│   │   ├── Footer.tsx           # Footer component
│   │   ├── Header.tsx           # Header with branding
│   │   └── SensorCard.tsx       # Sensor data cards
│   ├── utils/
│   │   └── mockData.ts          # Mock data generation
│   ├── App.tsx                  # Main application
│   ├── main.tsx                 # Application entry point
│   └── index.css                # Global styles
├── public/                  # Static assets
├── package.json            # Dependencies and scripts
├── tailwind.config.js      # Tailwind configuration
├── vite.config.ts          # Vite configuration
└── tsconfig.json           # TypeScript configuration
```

## 🎯 Core Components

### SensorCard
Displays real-time sensor readings with status indicators:
- Temperature monitoring (15-35°C range)
- Soil moisture levels (20-80% range)
- pH level tracking (5.5-8.5 range)
- Crop health status assessment

### CropHealthPanel
Advanced crop analysis with:
- Multispectral image viewer (RGB, NDVI, False Color)
- NDVI index calculation and display
- Chlorophyll level assessment
- Coverage percentage analysis

### AlertSection
Intelligent alert system featuring:
- Condition-based warnings
- Priority-based alert categorization
- Real-time status updates

### DataCharts
Historical data visualization:
- Temperature trends
- Moisture level patterns
- pH level variations
- Interactive chart controls

## 🔧 Configuration

### Environment Setup
The application uses mock data by default. For production deployment:

1. Configure Supabase connection
2. Set up IoT sensor integration
3. Configure alert thresholds
4. Set up data persistence

### Customization
- Modify sensor thresholds in `mockData.ts`
- Adjust alert conditions in `AlertSection.tsx`
- Customize styling in `tailwind.config.js`

## 📊 Data Models

### SensorData Interface
```typescript
interface SensorData {
  temperature: number;
  soilMoisture: number;
  phLevel: number;
  cropHealth: CropHealthData;
  timestamp: Date;
}
```

### CropHealthData Interface
```typescript
interface CropHealthData {
  status: 'Healthy' | 'Moderate' | 'Poor';
  ndvi: number;
  chlorophyllLevel: string;
  coverage: number;
}
```

## 🌟 Smart India Hackathon Features

This project addresses key agricultural challenges:

- **Problem Statement**: Smart Agriculture Monitoring
- **Solution**: IoT + AI-driven crop monitoring system
- **Impact**: Improved crop yields, reduced resource waste
- **Innovation**: Real-time multispectral analysis
- **Scalability**: Modular design for various farm sizes

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📞 Support & Contact

- **Email**: support@fieldlink.agriculture
- **Phone**: +91 90424 36256
- **Location**: Rooted Harvest Hub, India

## 📄 License

This project is developed for Smart India Hackathon 2025. All rights reserved.

## 🙏 Acknowledgments

- Smart India Hackathon organizing committee
- Agricultural research community
- Open source contributors
- Farming community for valuable feedback

---

**Built with ❤️ for farmers and sustainable agriculture**