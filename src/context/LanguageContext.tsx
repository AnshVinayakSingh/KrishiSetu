'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Language } from '@/types';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations: Record<Language, Record<string, string>> = {
  en: {
    // Branding & Taglines
    appName: 'KrishiSetu',
    lpTitle: 'Your crop deserves its full price',
    lpSub: 'Prices, crop health, water and schemes for Indian farmers, in one simple place.',
    lpP1: 'Compare mandi and buyer prices after transport',
    lpP2: 'Check crop disease from a photo',
    lpP3: 'Find the government schemes you qualify for',
    lpArt: 'A bridge connecting a farm to the market',
    lpLogin: 'Log in',
    lpLogout: 'Log out',
    lpSignup: 'Sign up',
    lpFoot: 'Made for Indian farmers',
    lpWelcome: 'Welcome back',
    lpCreate: 'Create your account',
    lpName: 'Full name',
    lpPhone: 'Mobile number',
    lpPass: 'Password',
    lpRole: 'I am a',
    lpFarmer: 'Farmer',
    lpBuyer: 'Buyer',
    lpDoLogin: 'Log in',
    lpDoSignup: 'Create account',
    lpHave: 'Already have an account?',
    lpNew: 'New to KrishiSetu?',
    lpBack: 'Back to home',
    lpErrName: 'Enter your full name.',
    lpErrPhone: 'Enter a 10 digit mobile number.',
    lpErrPass: 'Password needs at least 6 characters.',
    lpErrExists: 'This number is already registered. Log in instead.',
    lpErrWrong: 'Mobile number or password is wrong.',
    lpOk: 'Done. Opening your dashboard.',
    brandTagline: 'Bridging Farmers to Smarter Agriculture',
    heroSubheadline: 'Empowering small and marginal farmers across India with AI crop disease diagnosis, transparent direct markets, smart irrigation, and verified agricultural guidance.',
    exploreCTA: 'Explore KrishiSetu',
    smartFarmingCTA: 'Smart Farming Dashboard',
    
    // Navigation
    navOverview: 'Home',
    navDashboard: 'Dashboard',
    navAssistant: 'AI Krishi Assistant',
    navDisease: 'Disease Detection',
    navSimulator: 'What-If Simulator',
    navWeather: 'Weather Advisory',
    navSatellite: 'Satellite & Irrigation',
    navMarketplace: 'Direct Marketplace',
    navProfitAdvisor: 'Smart Profit Advisor',
    navServices: 'Agri Shops & Inputs',
    navLearning: 'Learning Hub',
    navSchemes: 'Govt Schemes',
    navCommunity: 'Community Alerts',
    navSettings: 'Farm Settings',

    // Header & Ticker
    mandiTickerLabel: 'Agmarknet Mandi Benchmark Rates',
    demoNotice: 'Demo Prototype Mode — Verified Agmarknet Reference',
    languageToggle: 'हिंदी',
    switchLanguage: 'Switch to Hindi',
    selectLocation: 'Location',
    notifications: 'Notifications',
    profile: 'Profile',
    kisanCallCenter: 'Kisan Helpline',
    
    // Dashboard Stats & Cards
    myCrops: 'Active Crop Lots',
    activeOffers: 'Active Buyer Bids',
    irrigationStatus: 'Irrigation Advisory',
    weatherAlert: 'Weather Alert',
    todayTip: 'Daily Agronomy Tip',
    quickActions: 'Quick Actions',
    addNewCrop: 'List Crop for Sale',
    diagnosePlant: 'Scan Crop Disease',
    checkMandiPrices: 'Compare Market Rates',
    calculateProfit: 'Calculate Net Profit',
    viewSensorStatus: 'ESP32 Soil Sensor',

    // Marketplace
    marketplaceTitle: 'Direct Farmer–Buyer Marketplace',
    marketplaceSubtitle: 'Sell your produce directly to verified traders, food processors, and wholesalers without arbitrary deductions.',
    filterCrops: 'Filter by Crop',
    allCrops: 'All Crops',
    filterState: 'Filter by State/District',
    allDistricts: 'All Districts',
    gradeFilter: 'Quality Grade',
    searchPlaceholder: 'Search by crop, variety, or district...',
    createListingButton: 'Post New Crop Lot',
    askingPrice: 'Asking Price',
    quantityAvailable: 'Quantity Available',
    harvestDate: 'Availability Date',
    deliveryMode: 'Delivery Preference',
    makeOffer: 'Negotiate / Make Bid',
    offerSubmittedSuccess: 'Your offer has been submitted to the farmer!',
    counterOfferSent: 'Counter-offer sent successfully!',
    offerAccepted: 'Offer agreed! Contract & logistics generated.',
    offerRejected: 'Offer declined.',
    
    // AI Assistant
    assistantTitle: 'KrishiSetu AI Farmer Assistant',
    assistantSubtitle: 'Ask voice or text questions about crop symptoms, fertilizer dosing, irrigation timing, and official government assistance.',
    micListening: 'Listening to your voice...',
    micPrompt: 'Press to speak (Hindi/English)',
    stopSpeaking: 'Stop Audio',
    inputPlaceholder: 'Ask any farming question or describe crop symptoms...',
    send: 'Send',
    clearChat: 'Clear History',
    suggestedQueries: 'Recommended Questions:',
    
    // Disease Detection
    diseaseTitle: 'AI Crop Disease Detection',
    diseaseSubtitle: 'Upload a leaf photo to identify early symptoms of fungal, bacterial, or pest infestations with actionable treatment steps.',
    uploadImage: 'Upload Plant Photo',
    dragDropText: 'Drag & drop leaf photo here, or click to browse',
    takePhoto: 'Capture with Camera',
    sampleDiseases: 'Or test with common diseased sample leaves:',
    analyzingImage: 'Analyzing cellular patterns and lesion characteristics...',
    diagnosisResult: 'Diagnostic Assessment',
    confidenceLevel: 'Confidence Level',
    organicRemedy: 'Biological / Organic Remedy',
    chemicalRemedy: 'Recommended Treatment (Safe Dosage)',
    preventionTips: 'Preventive Measures for Next Cycle',

    // Simulator
    simulatorTitle: 'What-If Farming Decision Simulator',
    simulatorSubtitle: 'Model alternative harvesting, irrigation, and fertilization decisions before spending capital in the field.',
    acreage: 'Field Size (Acres)',
    scenarioOne: 'Current Practice (Harvest Now)',
    scenarioTwo: 'Proposed Action (Harvest in +15 Days)',
    netMargin: 'Estimated Net Margin',
    waterSaved: 'Water Conservation',
    laborRequirement: 'Labor Days',
    runSimulation: 'Calculate Scenario',
    resetSimulation: 'Reset Defaults',

    // Weather
    weatherTitle: 'Agricultural Weather & Advisory',
    weatherSubtitle: 'Precise 7-day micro-climate outlook customized for irrigation, pest spraying windows, and harvest protection.',
    temp: 'Temperature',
    humidity: 'Relative Humidity',
    wind: 'Wind Speed',
    rainProbability: 'Rainfall Probability',
    sprayWindow: 'Pesticide Spraying Conditions',
    suitable: 'Favorable for Spraying',
    unsuitable: 'Avoid Spraying (High Wind/Rain)',

    // Common UI
    loading: 'Loading...',
    success: 'Operation completed successfully',
    error: 'An error occurred. Please try again.',
    save: 'Save',
    cancel: 'Cancel',
    confirm: 'Confirm',
    viewDetails: 'View Details',
    contactFarmer: 'Contact Farmer',
    contactBuyer: 'Contact Buyer',
    allRightsReserved: 'All rights reserved.',
    copyrightYear: '2026 KrishiSetu Platform. Built with pride for Indian Agriculture.'
  },
  hi: {
    // Branding & Taglines
    appName: 'कृषिसेतु',
    lpTitle: 'आपकी फसल को पूरा दाम मिलना चाहिए',
    lpSub: 'भारतीय किसानों के लिए भाव, फसल की सेहत, पानी और योजनाएँ, एक आसान जगह पर।',
    lpP1: 'भाड़े के बाद मंडी और खरीदार के भाव की तुलना',
    lpP2: 'फोटो से फसल का रोग पहचानिए',
    lpP3: 'अपनी पात्र सरकारी योजनाएँ खोजिए',
    lpArt: 'खेत को बाज़ार से जोड़ता पुल',
    lpLogin: 'लॉग इन',
    lpLogout: 'लॉग आउट',
    lpSignup: 'साइन अप',
    lpFoot: 'भारतीय किसानों के लिए',
    lpWelcome: 'वापसी पर स्वागत है',
    lpCreate: 'अपना खाता बनाइए',
    lpName: 'पूरा नाम',
    lpPhone: 'मोबाइल नंबर',
    lpPass: 'पासवर्ड',
    lpRole: 'मैं हूँ',
    lpFarmer: 'किसान',
    lpBuyer: 'खरीदार',
    lpDoLogin: 'लॉग इन',
    lpDoSignup: 'खाता बनाइए',
    lpHave: 'पहले से खाता है?',
    lpNew: 'कृषिसेतु पर नए हैं?',
    lpBack: 'होम पर वापस जाएँ',
    lpErrName: 'अपना पूरा नाम भरिए।',
    lpErrPhone: '10 अंकों का मोबाइल नंबर भरिए।',
    lpErrPass: 'पासवर्ड कम से कम 6 अक्षर का हो।',
    lpErrExists: 'यह नंबर पहले से दर्ज है। लॉग इन कीजिए।',
    lpErrWrong: 'मोबाइल नंबर या पासवर्ड ग़लत है।',
    lpOk: 'हो गया। डैशबोर्ड खुल रहा है।',
    brandTagline: 'परंपरागत खेती से स्मार्ट खेती तक',
    heroSubheadline: 'भारत के छोटे और सीमांत किसान भाइयों के लिए AI फसल रोग पहचान, पारदर्शी सीधा बाजार, उपग्रह व स्मार्ट सिंचाई, और सत्यापित सरकारी मार्गदर्शन।',
    exploreCTA: 'कृषिसेतु देखें',
    smartFarmingCTA: 'स्मार्ट किसान डैशबोर्ड',

    // Navigation
    navOverview: 'होम',
    navDashboard: 'डैशबोर्ड',
    navAssistant: 'कृषि AI सहायक',
    navDisease: 'रोग पहचान',
    navSimulator: 'फार्मिंग सिम्युलेटर',
    navWeather: 'मौसम सलाह',
    navSatellite: 'उपग्रह व सिंचाई',
    navMarketplace: 'सीधा मंडी बाजार',
    navProfitAdvisor: 'मुनाफा सलाहकार',
    navServices: 'खाद-बीज दुकानें',
    navLearning: 'कृषि शिक्षा केंद्र',
    navSchemes: 'सरकारी योजनाएं',
    navCommunity: 'किसान चौपाल',
    navSettings: 'फार्म सेटिंग्स',

    // Header & Ticker
    mandiTickerLabel: 'एगमार्कनेट ताजा मंडी भाव',
    demoNotice: 'प्रोटोटाइप मोड — सत्यापित एगमार्कनेट संदर्भ भाव',
    languageToggle: 'English',
    switchLanguage: 'Switch to English',
    selectLocation: 'स्थान चुनें',
    notifications: 'सूचनाएं',
    profile: 'प्रोफाइल',
    kisanCallCenter: 'किसान हेल्पलाइन',

    // Dashboard Stats & Cards
    myCrops: 'बिक्री हेतु सक्रिय फसलें',
    activeOffers: 'व्यापारियों की बोलियां',
    irrigationStatus: 'सिंचाई आवश्यकता',
    weatherAlert: 'मौसम चेतावनी',
    todayTip: 'आज की कृषि सलाह',
    quickActions: 'त्वरित कार्य',
    addNewCrop: 'नई फसल लिस्ट करें',
    diagnosePlant: 'रोग की जांच करें',
    checkMandiPrices: 'मंडी भाव तुलना',
    calculateProfit: 'शुद्ध मुनाफा निकालें',
    viewSensorStatus: 'ESP32 मृदा सेंसर',

    // Marketplace
    marketplaceTitle: 'सीधा किसान–खरीदार बाजार',
    marketplaceSubtitle: 'बिना बिचौलियों के अपनी उपज सीधे थोक व्यापारियों, मिलों और प्रसंस्करण कंपनियों को सही मूल्य पर बेचें।',
    filterCrops: 'फसल अनुसार चुनें',
    allCrops: 'सभी फसलें',
    filterState: 'जिला / राज्य चुनें',
    allDistricts: 'सभी जिले',
    gradeFilter: 'गुणवत्ता ग्रेड',
    searchPlaceholder: 'फसल, किस्म या जिले के नाम से खोजें...',
    createListingButton: 'बिक्री हेतु फसल दर्ज करें',
    askingPrice: 'मांग मूल्य',
    quantityAvailable: 'उपलब्ध मात्रा',
    harvestDate: 'उपलब्धता दिनांक',
    deliveryMode: 'परिवहन व्यवस्था',
    makeOffer: 'मोलभाव / बोली लगाएं',
    offerSubmittedSuccess: 'आपकी बोली किसान को भेज दी गई है!',
    counterOfferSent: 'काउंटर-ऑफर सफलतापूर्वक प्रेषित!',
    offerAccepted: 'सौदा तय हुआ! परिवहन विवरण तैयार।',
    offerRejected: 'बोली अस्वीकार कर दी गई।',

    // AI Assistant
    assistantTitle: 'कृषिसेतु AI किसान सहायक',
    assistantSubtitle: 'फसल रोग, खाद की मात्रा, सिंचाई समय और सरकारी योजनाओं के बारे में बोलकर या लिखकर तुरंत समाधान पाएं।',
    micListening: 'आपकी बात सुन रहे हैं...',
    micPrompt: 'बोलने के लिए दबाएं (हिंदी/अंग्रेजी)',
    stopSpeaking: 'आवाज रोकें',
    inputPlaceholder: 'खेती से जुड़ा कोई भी सवाल पूछें या फसल के लक्षण बताएं...',
    send: 'भेजें',
    clearChat: 'इतिहास साफ करें',
    suggestedQueries: 'अक्सर पूछे जाने वाले सवाल:',

    // Disease Detection
    diseaseTitle: 'AI फसल रोग पहचान केंद्र',
    diseaseSubtitle: 'पत्ती की फोटो अपलोड करें और फंगल, जीवाणु या कीट प्रकोप की सटीक पहचान व देसी/जैविक उपचार तुरंत पाएं।',
    uploadImage: 'पौधे की फोटो अपलोड करें',
    dragDropText: 'पत्ती की फोटो यहाँ खींचें या ब्राउज़ करने के लिए क्लिक करें',
    takePhoto: 'कैमरे से फोटो लें',
    sampleDiseases: 'या आम रोगग्रस्त पत्ती नमूनों से जांचें:',
    analyzingImage: 'पत्ती के ऊतकों और धब्बों का गहन विश्लेषण जारी है...',
    diagnosisResult: 'रोग निदान परिणाम',
    confidenceLevel: 'सटीकता विश्वास स्तर',
    organicRemedy: 'जैविक व देसी रोकथाम (नीमास्त्र/जीवामृत)',
    chemicalRemedy: 'अनुशंसित रासायनिक उपचार (सुरक्षित मात्रा)',
    preventionTips: 'अगली फसल हेतु रोकथाम उपाय',

    // Simulator
    simulatorTitle: 'खेती निर्णय सिम्युलेटर (व्हाट-इफ)',
    simulatorSubtitle: 'खेत में लागत लगाने से पहले विभिन्न निर्णयों (जैसे आज कटाई बनाम 15 दिन बाद, ड्रिप बनाम पारंपरिक) का वित्तीय असर जांचें।',
    acreage: 'खेत का रकबा (एकड़)',
    scenarioOne: 'वर्तमान पद्धति (आज कटाई)',
    scenarioTwo: 'प्रस्तावित विकल्प (15 दिन बाद कटाई)',
    netMargin: 'अनुमानित शुद्ध बचत/मुनाफा',
    waterSaved: 'पानी की बचत',
    laborRequirement: 'मजदूरी दिवस',
    runSimulation: 'गणना करें',
    resetSimulation: 'डिफ़ॉल्ट सेट करें',

    // Weather
    weatherTitle: 'कृषि मौसम एवं सटीक सलाह',
    weatherSubtitle: 'सिंचाई, कीटनाशक छिड़काव और कटाई सुरक्षा के लिए विशेष 7-दिवसीय मौसम पूर्वानुमान।',
    temp: 'तापमान',
    humidity: 'आर्द्रता (नमी)',
    wind: 'हवा की गति',
    rainProbability: 'बारिश की संभावना',
    sprayWindow: 'दवा छिड़काव अनुकूलता',
    suitable: 'छिड़काव हेतु अनुकूल समय',
    unsuitable: 'छिड़काव टालें (तेज हवा/बारिश)',

    // Common UI
    loading: 'लोड हो रहा है...',
    success: 'कार्य सफलतापूर्वक पूरा हुआ',
    error: 'त्रुटि हुई। कृपया पुन: प्रयास करें।',
    save: 'सहेजें',
    cancel: 'रद्द करें',
    confirm: 'पुष्टि करें',
    viewDetails: 'विवरण देखें',
    contactFarmer: 'किसान से संपर्क करें',
    contactBuyer: 'खरीदार से संपर्क करें',
    allRightsReserved: 'सर्वाधिकार सुरक्षित।',
    copyrightYear: '2026 कृषिसेतु मंच। भारतीय कृषि के सम्मान में समर्पित।'
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>('en');

  useEffect(() => {
    const saved = localStorage.getItem('krishisetu_language');
    if (saved === 'hi' || saved === 'en') {
      setLanguageState(saved);
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('krishisetu_language', lang);
  };

  const t = (key: string): string => {
    return translations[language]?.[key] || translations['en']?.[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
