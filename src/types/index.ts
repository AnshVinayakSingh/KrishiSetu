export type Language = 'hi' | 'en';

export type UserRole = 'farmer' | 'buyer' | 'expert';

export interface UserProfile {
  id: string;
  name: string;
  phone: string;
  email: string;
  role: UserRole;
  state: string;
  district: string;
  village?: string;
  landholdingAcres?: number;
  primaryCrops?: string[];
  soilType?: string;
  irrigationType?: string;
}

export interface MandiPriceItem {
  id: string;
  crop: string;
  cropHi: string;
  variety: string;
  mandi: string;
  state: string;
  pricePerQuintal: number;
  change: number; // e.g., +45 or -20
  unit: string;
  date: string;
  isLive: boolean;
}

export interface CropListing {
  id: string;
  farmerId: string;
  farmerName: string;
  farmerPhone: string;
  cropName: string;
  cropNameHi: string;
  variety: string;
  quantity: number;
  unit: 'Quintals' | 'Kg' | 'Tons';
  harvestDate: string;
  district: string;
  state: string;
  grade: 'Grade A (Premium)' | 'Grade B (Standard)' | 'Grade C (Fair)';
  askingPricePerUnit: number;
  pricingMode: 'Fixed' | 'Negotiable' | 'Open for Bids';
  minOrderQuantity: number;
  deliveryOption: 'Farmer will arrange' | 'Buyer pickup from Farm Gate' | 'Flexible';
  description: string;
  status: 'Active' | 'Under Negotiation' | 'Sold';
  createdAt: string;
}

export interface BuyerOffer {
  id: string;
  listingId: string;
  buyerId: string;
  buyerName: string;
  buyerCompany?: string;
  offeredPricePerUnit: number;
  quantityRequested: number;
  status: 'Pending' | 'Accepted' | 'Countered' | 'Rejected' | 'Agreed';
  counterPricePerUnit?: number;
  note: string;
  timestamp: string;
}

export interface ChatMessage {
  id: string;
  sender: 'farmer' | 'buyer' | 'system';
  senderName: string;
  text: string;
  timestamp: string;
  offerUpdate?: {
    price: number;
    quantity: number;
    status: string;
  };
}

export interface WeatherData {
  location: string;
  state: string;
  temp: number;
  tempMin: number;
  tempMax: number;
  condition: string;
  conditionHi: string;
  humidity: number;
  windSpeed: number; // km/h
  rainProbability: number; // %
  rainfallMm: number;
  uvIndex: number;
  forecast: {
    day: string;
    dayHi: string;
    tempMax: number;
    tempMin: number;
    rainProb: number;
    condition: string;
    conditionHi: string;
  }[];
  agriculturalAlert?: {
    type: 'warning' | 'info' | 'caution';
    title: string;
    titleHi: string;
    message: string;
    messageHi: string;
    action: string;
    actionHi: string;
  };
  lastUpdated: string;
  dataSource: string;
}

export interface DiseaseDetectionResult {
  id: string;
  crop: string;
  cropHi: string;
  diseaseName: string;
  diseaseNameHi: string;
  confidence: number;
  severity: 'Mild' | 'Moderate' | 'Severe';
  symptoms: string[];
  symptomsHi: string[];
  organicTreatment: string[];
  organicTreatmentHi: string[];
  chemicalTreatment: string[];
  chemicalTreatmentHi: string[];
  prevention: string[];
  preventionHi: string[];
  expertConsultRequired: boolean;
  disclaimer: string;
  disclaimerHi: string;
}

export interface SimulatorInputs {
  crop: string;
  acres: number;
  currentHarvestDate: string;
  alternateHarvestDaysAhead: number;
  irrigationMethod: 'Flood' | 'Drip' | 'Sprinkler';
  chemicalFertilizerCost: number;
  organicCompostCost: number;
  currentMandiPrice: number;
  expectedPriceSurgePercent: number;
  rainForecastProbability: number;
}

export interface SimulatorOutputs {
  scenarioA: {
    label: string;
    labelHi: string;
    cost: number;
    grossRevenue: number;
    netMargin: number;
    waterUsageLiters: number;
    laborDays: number;
    riskScore: 'Low' | 'Medium' | 'High';
  };
  scenarioB: {
    label: string;
    labelHi: string;
    cost: number;
    grossRevenue: number;
    netMargin: number;
    waterUsageLiters: number;
    laborDays: number;
    riskScore: 'Low' | 'Medium' | 'High';
  };
  deltaProfit: number;
  recommendation: string;
  recommendationHi: string;
  assumptions: string[];
  assumptionsHi: string[];
}

export interface SensorTelemetry {
  deviceId: string;
  fieldName: string;
  fieldNameHi: string;
  crop: string;
  soilMoisturePercent: number; // 0-100%
  soilTemperatureC: number;
  ambientTempC: number;
  ambientHumidityPercent: number;
  batteryLevelPercent: number;
  signalStrengthRssi: number;
  lastReadingTimestamp: string;
  status: 'Optimal' | 'Moisture Low' | 'Moisture High' | 'Sensor Offline';
  irrigationStatus: 'Not Required' | 'Irrigate Within 24h' | 'Postpone (Rain Anticipated)';
}

export interface GovernmentScheme {
  id: string;
  name: string;
  nameHi: string;
  tagline: string;
  taglineHi: string;
  category: 'Financial Assistance' | 'Insurance' | 'Irrigation' | 'Mechanization' | 'Credit' | 'Organic';
  beneficiaries: string;
  beneficiariesHi: string;
  benefitAmount: string;
  benefitAmountHi: string;
  eligibility: string[];
  eligibilityHi: string[];
  documentsRequired: string[];
  documentsRequiredHi: string[];
  officialPortalUrl: string;
  helpline: string;
  status: 'Open for Applications' | 'Ongoing' | 'Upcoming Cycle';
}

export interface LearningVideo {
  id: string;
  title: string;
  titleHi: string;
  category: string;
  categoryHi: string;
  crop: string;
  durationMinutes: number;
  language: 'Hindi' | 'English' | 'Both';
  source: string;
  youtubeId: string;
  keyPoints: string[];
  keyPointsHi: string[];
}

export interface AgriculturalShop {
  id: string;
  name: string;
  type: 'IFFCO Kendra' | 'Private Dealer' | 'Soil Testing Lab' | 'Custom Hiring Centre';
  district: string;
  state: string;
  distanceKm: number;
  phone: string;
  verified: boolean;
  products: {
    item: string;
    brand: string;
    packSize: string;
    price: number;
    unitPrice: string;
    inStock: boolean;
    govtSubsidized: boolean;
  }[];
}

export interface CommunityReport {
  id: string;
  authorName: string;
  authorDistrict: string;
  category: 'Pest Alert' | 'Weather & Rain' | 'Irrigation Canal' | 'Mandi Arrival' | 'Equipment Share';
  categoryHi: string;
  title: string;
  titleHi: string;
  description: string;
  descriptionHi: string;
  timestamp: string;
  upvotes: number;
  userVoted: 'up' | 'down' | null;
  verificationLevel: 'Farmer Community' | 'Agronomist Verified' | 'District Admin';
}

export interface WeatherDay {
  date: string; // YYYY-MM-DD
  tempMax: number;
  tempMin: number;
  rainProb: number | null;
  rainMm: number;
  condition: string;
  conditionHi: string;
  icon: 'sun' | 'cloud' | 'rain' | 'storm' | 'snow' | 'fog';
}

export interface WeatherApiResponse {
  source: 'live' | 'demo';
  current: {
    temp: number;
    humidity: number;
    wind: number;
    rainMm: number;
    condition: string;
    conditionHi: string;
    icon: WeatherDay['icon'];
  };
  past: WeatherDay[]; // previous 7 days
  today: WeatherDay;
  next: WeatherDay[]; // next 7 days
  updatedAt: string;
}

export interface MandiRow {
  id: string;
  crop: string;
  cropHi?: string;
  variety?: string;
  mandi: string;
  state: string;
  modal: number; // ₹/quintal
  min?: number;
  max?: number;
  change?: number;
  date: string;
}

export interface MandiApiResponse {
  source: 'live' | 'demo';
  rows: MandiRow[];
  updatedAt: string;
}
