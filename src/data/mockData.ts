import {
  MandiPriceItem,
  CropListing,
  BuyerOffer,
  DiseaseDetectionResult,
  GovernmentScheme,
  LearningVideo,
  AgriculturalShop,
  CommunityReport,
  SensorTelemetry,
  WeatherData
} from '@/types';

export const MANDI_PRICES: MandiPriceItem[] = [
  {
    id: 'm1',
    crop: 'Wheat (Sharbati)',
    cropHi: 'गेहूँ (शरबती)',
    variety: 'C-306 / Sharbati',
    mandi: 'Neemuch Mandi',
    state: 'Madhya Pradesh',
    pricePerQuintal: 2850,
    change: 35,
    unit: '₹/Quintal',
    date: 'Today',
    isLive: true,
  },
  {
    id: 'm2',
    crop: 'Basmati Paddy (1121)',
    cropHi: 'बासमती धान (1121)',
    variety: 'Pusa 1121 Super',
    mandi: 'Karnal Grain Market',
    state: 'Haryana',
    pricePerQuintal: 4320,
    change: -40,
    unit: '₹/Quintal',
    date: 'Today',
    isLive: true,
  },
  {
    id: 'm3',
    crop: 'Mustard Seed',
    cropHi: 'सरसों (राई)',
    variety: 'Pusa Bold / 42% Oil',
    mandi: 'Bharatpur Mandi',
    state: 'Rajasthan',
    pricePerQuintal: 5650,
    change: 85,
    unit: '₹/Quintal',
    date: 'Today',
    isLive: true,
  },
  {
    id: 'm4',
    crop: 'Soybean (Yellow)',
    cropHi: 'सोयाबीन (पीला)',
    variety: 'JS-9560',
    mandi: 'Indore Mandi',
    state: 'Madhya Pradesh',
    pricePerQuintal: 4680,
    change: 25,
    unit: '₹/Quintal',
    date: 'Today',
    isLive: true,
  },
  {
    id: 'm5',
    crop: 'Red Onion',
    cropHi: 'लाल प्याज',
    variety: 'Garwa Medium',
    mandi: 'Lasalgaon Mandi',
    state: 'Maharashtra',
    pricePerQuintal: 1850,
    change: -60,
    unit: '₹/Quintal',
    date: 'Today',
    isLive: true,
  },
  {
    id: 'm6',
    crop: 'Potato (Jyoti)',
    cropHi: 'आलू (कुफरी ज्योति)',
    variety: 'Kufri Jyoti Cold-Store',
    mandi: 'Agra Mandi',
    state: 'Uttar Pradesh',
    pricePerQuintal: 1420,
    change: 15,
    unit: '₹/Quintal',
    date: 'Today',
    isLive: true,
  },
  {
    id: 'm7',
    crop: 'Tomato (Hybrid)',
    cropHi: 'टमाटर (हाइब्रिड)',
    variety: 'Vaishali / Abhinav',
    mandi: 'Kolar APMC',
    state: 'Karnataka',
    pricePerQuintal: 1950,
    change: 110,
    unit: '₹/Quintal',
    date: 'Today',
    isLive: true,
  }
];

export const INITIAL_CROP_LISTINGS: CropListing[] = [
  {
    id: 'list-101',
    farmerId: 'farmer-1',
    farmerName: 'Baldev Singh Gill',
    farmerPhone: '+91 98765 43210',
    cropName: 'Sharbati Wheat',
    cropNameHi: 'शरबती गेहूँ',
    variety: 'MP Sharbati Premium',
    quantity: 120,
    unit: 'Quintals',
    harvestDate: 'Ready for Dispatch',
    district: 'Sehore',
    state: 'Madhya Pradesh',
    grade: 'Grade A (Premium)',
    askingPricePerUnit: 2900,
    pricingMode: 'Negotiable',
    minOrderQuantity: 20,
    deliveryOption: 'Buyer pickup from Farm Gate',
    description: 'Cleaned, moisture content under 11.5%, golden grain with high luster. Stored in moisture-proof gunny bags.',
    status: 'Active',
    createdAt: '2026-10-15'
  },
  {
    id: 'list-102',
    farmerId: 'farmer-2',
    farmerName: 'Rameshwar Patidar',
    farmerPhone: '+91 94250 11223',
    cropName: 'Yellow Mustard',
    cropNameHi: 'पीली सरसों',
    variety: 'Pusa Mustard 28',
    quantity: 80,
    unit: 'Quintals',
    harvestDate: 'Ready for Dispatch',
    district: 'Kota',
    state: 'Rajasthan',
    grade: 'Grade A (Premium)',
    askingPricePerUnit: 5750,
    pricingMode: 'Fixed',
    minOrderQuantity: 15,
    deliveryOption: 'Farmer will arrange',
    description: '43.2% tested oil content, machine cleaned, free of wild argemone seeds.',
    status: 'Active',
    createdAt: '2026-10-16'
  },
  {
    id: 'list-103',
    farmerId: 'farmer-3',
    farmerName: 'Gurpreet Sandhu',
    farmerPhone: '+91 98140 99887',
    cropName: 'Basmati Paddy 1121',
    cropNameHi: 'बासमती धान 1121',
    variety: 'Traditional Pusa 1121',
    quantity: 250,
    unit: 'Quintals',
    harvestDate: 'Ready for Dispatch',
    district: 'Karnal',
    state: 'Haryana',
    grade: 'Grade A (Premium)',
    askingPricePerUnit: 4400,
    pricingMode: 'Open for Bids',
    minOrderQuantity: 50,
    deliveryOption: 'Buyer pickup from Farm Gate',
    description: 'Aromatic extra long slender grain, zero chalkiness, harvested with combine equipped with SMS.',
    status: 'Active',
    createdAt: '2026-10-14'
  },
  {
    id: 'list-104',
    farmerId: 'farmer-4',
    farmerName: 'Suresh Patil',
    farmerPhone: '+91 98220 54321',
    cropName: 'Red Onion (Garwa)',
    cropNameHi: 'लाल प्याज (गरवा)',
    variety: 'Nashik Red Garwa',
    quantity: 180,
    unit: 'Quintals',
    harvestDate: 'Within 5 Days',
    district: 'Nashik',
    state: 'Maharashtra',
    grade: 'Grade B (Standard)',
    askingPricePerUnit: 1900,
    pricingMode: 'Negotiable',
    minOrderQuantity: 30,
    deliveryOption: 'Flexible',
    description: 'Medium size 45mm-55mm, cured under shed, excellent shelf life for inter-state transport.',
    status: 'Under Negotiation',
    createdAt: '2026-10-12'
  }
];

export const INITIAL_BUYER_OFFERS: BuyerOffer[] = [
  {
    id: 'off-501',
    listingId: 'list-101',
    buyerId: 'buyer-99',
    buyerName: 'Amit Agrawal',
    buyerCompany: 'Malwa Agro Flour Mills Pvt Ltd',
    offeredPricePerUnit: 2840,
    quantityRequested: 100,
    status: 'Pending',
    note: 'We can collect directly from your farm in Sehore via 10-wheel truck. Payment within 24 hours of weighbridge receipt.',
    timestamp: '2 hours ago'
  },
  {
    id: 'off-502',
    listingId: 'list-104',
    buyerId: 'buyer-88',
    buyerName: 'Vijay Varma',
    buyerCompany: 'Kisan Fresh Logistics & Wholesale',
    offeredPricePerUnit: 1820,
    quantityRequested: 150,
    status: 'Countered',
    counterPricePerUnit: 1860,
    note: 'Farmer requested ₹1,860/Qtl for 150 Quintals bulk pickup.',
    timestamp: 'Yesterday'
  }
];

export const SAMPLE_DISEASE_CASES: DiseaseDetectionResult[] = [
  {
    id: 'dis-wheat-rust',
    crop: 'Wheat',
    cropHi: 'गेहूँ',
    diseaseName: 'Yellow Stripe Rust (Puccinia striiformis)',
    diseaseNameHi: 'पीला रतुआ (येलो रस्ट)',
    confidence: 96.4,
    severity: 'Severe',
    symptoms: [
      'Bright yellow powdery pustules arranged in parallel stripes on the leaf blade',
      'Premature chlorosis and drying of affected leaves',
      'Stunted growth and poor grain filling in late stages'
    ],
    symptomsHi: [
      'पत्तियों पर समानांतर कतारों में पीले रंग के पाउडर जैसे धब्बे',
      'प्रभावित पत्तियां पीली पड़कर समय से पहले सूख जाती हैं',
      'बालियों में दाने सिकुड़ना और पौधे का विकास रुकना'
    ],
    organicTreatment: [
      'Spray 5% Neem Seed Kernel Extract (NSKE) or Neem oil at 5ml/liter with soap solution as preventative',
      'Apply Trichoderma viride culture (2.5 kg/ha) mixed in well-rotted farmyard manure during soil prep',
      'Ensure proper crop aeration and avoid excessive dense sowing'
    ],
    organicTreatmentHi: [
      '5% नीम बीज का अर्क (NSKE) या नीम तेल 5 मिली/लीटर साबुन घोल के साथ छिड़कें',
      'गोबर की सड़ी खाद में ट्राइकोडर्मा विरिडी (2.5 किग्रा/हेक्टेयर) मिलाकर प्रयोग करें',
      'फसल में हवा का आवागमन बनाए रखें और अत्यधिक घनी बुवाई से बचें'
    ],
    chemicalTreatment: [
      'Foliar spray of Propiconazole 25% EC @ 1ml/liter water (500ml in 200L water per acre) at first sign',
      'Alternatively, Tebuconazole 25.9% EC @ 1.25ml/liter water',
      'Repeat spray after 12-15 days if cloudy humid weather persists'
    ],
    chemicalTreatmentHi: [
      'लक्षण दिखते ही प्रोपिकोनाजोल 25% EC (टिल्ट) @ 1 मिली प्रति लीटर पानी में घोलकर छिड़कें',
      'या टेबुकोनाजोल 25.9% EC @ 1.25 मिली/लीटर पानी का प्रयोग करें',
      'मौसम में बादल और नमी बने रहने पर 12-15 दिन बाद दोबारा छिड़काव करें'
    ],
    prevention: [
      'Sow rust-resistant varieties like DBW 187, DBW 222, or HD 3226',
      'Avoid high doses of nitrogenous fertilizers that promote lush susceptible foliage',
      'Monitor fields weekly during cool, moist morning hours'
    ],
    preventionHi: [
      'रोग प्रतिरोधी किस्में जैसे DBW 187 (करण वंदना), DBW 222 या HD 3226 की बुवाई करें',
      'अत्यधिक यूरिया के प्रयोग से बचें, संतुलित NPK और पोटाश का प्रयोग करें',
      'दिसंबर-फरवरी के दौरान सुबह के समय खेत का नियमित निरीक्षण करें'
    ],
    expertConsultRequired: true,
    disclaimer: 'Yellow rust can spread rapidly via airborne spores across neighboring districts. Immediately inform your local KVK or Agriculture Extension Officer if spread exceeds 5% foliage.',
    disclaimerHi: 'पीला रतुआ हवा के जरिए बहुत तेजी से फैलता है। यदि 5% से अधिक क्षेत्र में लक्षण दिखें तो तुरंत कृषि विज्ञान केंद्र (KVK) से संपर्क करें।'
  },
  {
    id: 'dis-potato-blight',
    crop: 'Potato',
    cropHi: 'आलू',
    diseaseName: 'Late Blight (Phytophthora infestans)',
    diseaseNameHi: 'आलू का पिछेता झुलसा (लेट ब्लाइट)',
    confidence: 94.8,
    severity: 'Severe',
    symptoms: [
      'Water-soaked dark brown to black irregular lesions starting at leaf margins and tips',
      'White cottony fungal growth on underside of leaves in humid mornings',
      'Rapid stem rotting and foul decaying odor in field'
    ],
    symptomsHi: [
      'पत्तियों के किनारों और सिरों पर पानी जैसे भीगे काले-भूरे अनियमित धब्बे',
      'सुबह की नमी में पत्ती की निचली सतह पर सफेद फफूंद दिखाई देना',
      'तने का तेजी से सड़ना और खेत में विशिष्ट सड़ांध भरी गंध'
    ],
    organicTreatment: [
      'Spray copper oxychloride (COC) combined with Bordeaux mixture (1%) preventive',
      'Apply bio-fungicide Pseudomonas fluorescens @ 5g/liter foliar spray',
      'Earthing up soil to create at least 10cm barrier over growing tubers'
    ],
    organicTreatmentHi: [
      'कॉपर ऑक्सीक्लोराइड (COC) या बोर्डो मिश्रण (1%) का निरोधात्मक छिड़काव करें',
      'स्यूडोमोनास फ्लोरेसेंस @ 5 ग्राम प्रति लीटर पानी का छिड़काव करें',
      'कंदों को ढकने के लिए पौधों पर कम से कम 10 सेमी तक मिट्टी अच्छी तरह चढ़ाएं'
    ],
    chemicalTreatment: [
      'Curative spray: Cymoxanil 8% + Mancozeb 64% WP (Curzate) @ 3g/liter water',
      'Or Dimethomorph 50% WP @ 1g/liter mixed with Mancozeb @ 2g/liter',
      'Ensure complete coverage of both upper and lower leaf surfaces'
    ],
    chemicalTreatmentHi: [
      'उपचारात्मक छिड़काव: साइमोक्सानिल 8% + मैंकोजेब 64% WP @ 3 ग्राम/लीटर पानी',
      'या डाइमेथोमॉर्फ 50% WP @ 1 ग्राम/लीटर के साथ मैंकोजेब 2 ग्राम/लीटर मिलाकर स्प्रे करें',
      'पत्तियों की ऊपरी व निचली दोनों सतहों को अच्छी तरह तर-बतर करें'
    ],
    prevention: [
      'Use certified disease-free seed tubers from trusted state seed corporations',
      'Destroy volunteer potato plants and nightshade weeds near field borders',
      'Avoid overhead sprinkler irrigation that keeps leaves wet for prolonged hours'
    ],
    preventionHi: [
      'प्रमाणित और रोगमुक्त बीज कंदों का ही प्रयोग करें',
      'खेत के आसपास उगे अनचाहे आलू और धतूरे जैसे खरपतवारों को नष्ट करें',
      'फव्वारा (स्प्रिंकलर) सिंचाई से बचें जिससे पत्तियां लंबे समय तक गीली न रहें'
    ],
    expertConsultRequired: false,
    disclaimer: 'Late blight thrives when temperature is 12-22°C with >90% humidity. Treat immediately upon first lesion detection.',
    disclaimerHi: 'जब तापमान 12-22°C और आर्द्रता 90% से अधिक हो तो यह रोग 48 घंटे में पूरी फसल चौपट कर सकता है।'
  },
  {
    id: 'dis-rice-blight',
    crop: 'Rice / Paddy',
    cropHi: 'धान (चावल)',
    diseaseName: 'Bacterial Leaf Blight (Xanthomonas oryzae)',
    diseaseNameHi: 'धान का जीवाणु झुलसा (बैक्टीरियल ब्लाइट)',
    confidence: 92.1,
    severity: 'Moderate',
    symptoms: [
      'Water-soaked lesions on leaf margins turning straw-yellow with wavy wavy edges',
      'Milky bacterial exudate droplets appearing on young lesions in morning dew',
      'Premature wilting resembling kresek phase in seedling stage'
    ],
    symptomsHi: [
      'पत्तियों के किनारों से शुरू होकर अंदर की ओर बढ़ती लहरदार पीली-सफेद धारियां',
      'सुबह की ओस में पत्तियों पर जीवाणु रस (बैक्टीरियल ऊज़) की नन्हीं बूंदें दिखना',
      'पौधों की पत्तियां ऊपर से नीचे सूखकर भूसे जैसी हो जाना'
    ],
    organicTreatment: [
      'Spray fresh cow dung filtrate (20%) mixed with Hing (Asafoetida @ 100g/acre)',
      'Foliar spray with Bacillus subtilis formulations @ 5ml/L',
      'Drain standing field water for 3 to 4 days to disrupt bacterial motility'
    ],
    organicTreatmentHi: [
      '20% ताजे गाय के गोबर का छाना हुआ घोल और 100 ग्राम हींग प्रति एकड़ छिड़कें',
      'बेसिलस सबटिलिस फॉर्मूलेशन @ 5 मिली/लीटर का छिड़काव करें',
      'खेत से 3-4 दिनों के लिए जमा पानी निकाल दें ताकि जीवाणु का फैलाव रुके'
    ],
    chemicalTreatment: [
      'Streptocycline (90:10 Streptomycin sulphate + Tetracycline) @ 6g + Copper Oxychloride @ 500g in 200L water per acre',
      'Repeat after 10 days if symptoms continue on new flag leaves'
    ],
    chemicalTreatmentHi: [
      'स्ट्रेप्टोसाइक्लिन (6 ग्राम) + कॉपर ऑक्सीक्लोराइड (500 ग्राम) को 200 लीटर पानी में मिलाकर प्रति एकड़ छिड़कें',
      'यदि नई पत्तियों पर लक्षण बने रहें तो 10 दिन बाद छिड़काव दोहराएं'
    ],
    prevention: [
      'Treat seeds with Streptocycline @ 0.5g/L water for 8 hours prior to nursery sowing',
      'Avoid high nitrogen top dressing during rainy humid periods',
      'Maintain field bunds clean of wild grass hosts'
    ],
    preventionHi: [
      'नर्सरी बुवाई से पहले बीजों को स्ट्रेप्टोसाइक्लिन (0.5 ग्राम/लीटर) के घोल में 8 घंटे भिगोएं',
      'बादल छाए रहने के दौरान अत्यधिक यूरिया डालने से बचें, पोटाश की मात्रा बढ़ाएं'
    ],
    expertConsultRequired: false,
    disclaimer: 'Do not spray during intense afternoon sun. Spray early morning or late afternoon with a fine mist nozzle.',
    disclaimerHi: 'तेज धूप में छिड़काव न करें। सुबह या शाम के समय बारीक नोजल वाले स्प्रेयर का उपयोग करें।'
  }
];

export const GOVERNMENT_SCHEMES: GovernmentScheme[] = [
  {
    id: 'pm-kisan',
    name: 'PM-KISAN (Pradhan Mantri Kisan Samman Nidhi)',
    nameHi: 'पीएम-किसान (प्रधानमंत्री किसान सम्मान निधि)',
    tagline: 'Direct income support of ₹6,000 per year for all landholding farmer families.',
    taglineHi: 'सभी पात्र किसान परिवारों को प्रति वर्ष ₹6,000 की प्रत्यक्ष आर्थिक सहायता।',
    category: 'Financial Assistance',
    beneficiaries: 'All cultivable landholding farmer families across India',
    beneficiariesHi: 'भारत के सभी काश्तकार भूमिधारक किसान परिवार',
    benefitAmount: '₹6,000/year in 3 equal installments of ₹2,000 credited to bank accounts via DBT.',
    benefitAmountHi: '₹6,000 प्रति वर्ष (₹2,000 की तीन समान किस्तों में) सीधे बैंक खाते में।',
    eligibility: [
      'Farmer family possessing cultivable landholding registered in state revenue records',
      'Valid Aadhaar card linked with bank account (NPCI DBT enabled)',
      'Completed e-KYC on the PM-KISAN portal or via biometric CSC'
    ],
    eligibilityHi: [
      'राज्य राजस्व रिकॉर्ड में पंजीकृत कृषि योग्य भूमि का स्वामित्व',
      'बैंक खाते से लिंक आधार कार्ड (NPCI DBT सक्रिय होना अनिवार्य)',
      'पीएम-किसान पोर्टल या सीएससी केंद्र पर बायोमेट्रिक e-KYC पूर्ण होना'
    ],
    documentsRequired: [
      'Aadhaar Card',
      'Land Ownership Record (Khatauni / Khasra / Jamabandi)',
      'Active Bank Account Passbook with IFSC',
      'Mobile Number linked to Aadhaar'
    ],
    documentsRequiredHi: [
      'आधार कार्ड',
      'भूमि खतौनी / खसरा नकल / जमाबंदी',
      'बैंक पासबुक (IFSC कोड सहित)',
      'आधार से लिंक मोबाइल नंबर'
    ],
    officialPortalUrl: 'https://pmkisan.gov.in',
    helpline: '155261 / 011-24300606',
    status: 'Ongoing'
  },
  {
    id: 'pmfby',
    name: 'PMFBY (Pradhan Mantri Fasal Bima Yojana)',
    nameHi: 'प्रधानमंत्री फसल बीमा योजना (PMFBY)',
    tagline: 'Comprehensive crop insurance against natural calamities, pests & localized losses.',
    taglineHi: 'प्राकृतिक आपदाओं, कीट प्रकोप व बेमौसम बारिश से फसल बर्बादी पर संपूर्ण बीमा सुरक्षा।',
    category: 'Insurance',
    beneficiaries: 'All farmers (loanee and non-loanee) growing notified crops in notified areas',
    beneficiariesHi: 'अधिसूचित क्षेत्रों में अधिसूचित फसल उगाने वाले सभी ऋणी व गैर-ऋणी किसान',
    benefitAmount: 'Max premium payable by farmer: 2% for Kharif, 1.5% for Rabi, 5% for Commercial/Horticulture. Balance subsidized by Govt.',
    benefitAmountHi: 'किसान हेतु नाममात्र प्रीमियम: खरीफ 2%, रबी 1.5%, बागवानी/वाणिज्यिक 5%। शेष सब्सिडी सरकार देती है।',
    eligibility: [
      'Farmers possessing insurable interest in notified crop',
      'Sowing certificate / self-declaration of crop sown in current season',
      'Intimation of localized damage within 72 hours via Crop Insurance App or toll-free number'
    ],
    eligibilityHi: [
      'अधिसूचित क्षेत्र में अधिसूचित फसल की वास्तविक बुवाई का प्रमाण',
      'फसल क्षति होने पर 72 घंटे के भीतर टोल-फ्री नंबर या क्रॉप इंश्योरेंस ऐप पर सूचना दर्ज करना',
      'सक्रिय बचत बैंक खाता'
    ],
    documentsRequired: [
      'Land Record (RoR / Khasra-Khatauni)',
      'Sowing Certificate issued by Patwari / Sarpanch / Self-Declaration',
      'Aadhaar Card',
      'Bank Account Details / Cancelled Cheque'
    ],
    documentsRequiredHi: [
      'भूमि रिकॉर्ड (खसरा-खतौनी नकल)',
      'पटवारी/सरपंच द्वारा जारी बुवाई प्रमाण-पत्र या स्व-घोषणा',
      'आधार कार्ड',
      'बैंक पासबुक प्रति'
    ],
    officialPortalUrl: 'https://pmfby.gov.in',
    helpline: '14447 (National Toll Free)',
    status: 'Open for Applications'
  },
  {
    id: 'pmksy',
    name: 'PMKSY - Per Drop More Crop (Micro Irrigation)',
    nameHi: 'पीएमकेएसवाई - प्रति बूंद अधिक फसल (सूक्ष्म सिंचाई)',
    tagline: 'Up to 55% subsidy for Small & Marginal farmers for Drip & Sprinkler irrigation systems.',
    taglineHi: 'ड्रिप और स्प्रिंकलर सिंचाई सिस्टम लगाने पर छोटे व सीमांत किसानों को 55% तक सरकारी सब्सिडी।',
    category: 'Irrigation',
    beneficiaries: 'Farmers having cultivable land with an assured water source (borewell/well/canal)',
    beneficiariesHi: 'कृषि भूमि और सुनिश्चित जल स्रोत (बोरवेल/कुआं/नहर) वाले किसान',
    benefitAmount: '55% subsidy for Small/Marginal farmers, 45% for other farmers on micro-irrigation equipment costs.',
    benefitAmountHi: 'छोटे व सीमांत किसानों को 55% और अन्य किसानों को 45% तक उपकरण सब्सिडी।',
    eligibility: [
      'Ownership of land or registered lease agreement for at least 7 years',
      'Functional water source (tubewell, farm pond, open well) with pumping system',
      'Not availed micro-irrigation subsidy for the same survey number in the last 7 years'
    ],
    eligibilityHi: [
      'स्वयं की भूमि या न्यूनतम 7 वर्ष का पंजीकृत लीज अनुबंध',
      'खेत पर कार्यशील जल स्रोत (बोरवेल, फार्म पॉन्ड, कुआं) उपलब्ध होना',
      'पिछले 7 वर्षों में उसी खसरा नंबर पर ड्रिप सब्सिडी न ली हो'
    ],
    documentsRequired: [
      'Land Jamabandi / 7/12 extract',
      'Electricity connection bill or Solar pump proof',
      'Water source certificate',
      'Aadhaar Card & Bank Passbook',
      'Soil & Water testing report (where mandatory)'
    ],
    documentsRequiredHi: [
      'जमाबंदी / खतौनी / 7/12 नकल',
      'बिजली बिल या सोलर पंप रसीद',
      'आधार कार्ड एवं बैंक पासबुक',
      'जल स्रोत का प्रमाण'
    ],
    officialPortalUrl: 'https://pmksy.gov.in',
    helpline: '1800-180-1551',
    status: 'Ongoing'
  },
  {
    id: 'smam',
    name: 'SMAM (Sub-Mission on Agricultural Mechanization)',
    nameHi: 'कृषि यंत्रीकरण उप-मिशन (SMAM)',
    tagline: '40% to 50% subsidy on modern tractors, rotavators, laser levellers & harvesters.',
    taglineHi: 'ट्रैक्टर, रोटावेटर, लेजर लैंड लेवलर व सुपर सीडर जैसे कृषि यंत्रों पर 40% से 50% तक अनुदान।',
    category: 'Mechanization',
    beneficiaries: 'Individual farmers, Custom Hiring Centres, and FPOs',
    beneficiariesHi: 'व्यक्तिगत किसान, कस्टम हायरिंग केंद्र (CHC) और किसान उत्पादक संगठन (FPO)',
    benefitAmount: 'Direct financial subsidy up to ₹1.25 Lakh for machinery, up to ₹10 Lakh for Custom Hiring Centres.',
    benefitAmountHi: 'यंत्रों पर ₹1.25 लाख तक और कस्टम हायरिंग सेंटर स्थापित करने पर ₹10 लाख तक की सहायता।',
    eligibility: [
      'Farmer holding valid land in state records',
      'Registration on national mechanization portal (agrimachinery.nic.in)',
      'Quotation from registered manufacturer/dealer'
    ],
    eligibilityHi: [
      'कृषि भूमि का स्वामित्व',
      'पोर्टल (agrimachinery.nic.in) पर किसान पंजीकरण',
      'अधिकृत कृषि यंत्र डीलर का कोटेशन'
    ],
    documentsRequired: [
      'Aadhaar Card & Passport size photo',
      'Land Record (Khatauni)',
      'Bank passbook copy',
      'Caste certificate (for SC/ST priority)'
    ],
    documentsRequiredHi: [
      'आधार कार्ड व पासपोर्ट फोटो',
      'खसरा-खतौनी नकल',
      'बैंक पासबुक',
      'जाति प्रमाण पत्र (यदि लागू हो)'
    ],
    officialPortalUrl: 'https://agrimachinery.nic.in',
    helpline: '011-23382012',
    status: 'Open for Applications'
  },
  {
    id: 'kcc',
    name: 'Kisan Credit Card (KCC) Scheme',
    nameHi: 'किसान क्रेडिट कार्ड (KCC) योजना',
    tagline: 'Institutional crop loans at 4% effective interest with prompt repayment incentive.',
    taglineHi: 'समय पर भुगतान करने पर मात्र 4% प्रभावी ब्याज दर पर फसली ऋण एवं कार्यशील पूंजी।',
    category: 'Credit',
    beneficiaries: 'Farmers, tenant farmers, oral lessees, sharecroppers, animal husbandry & fisheries farmers',
    beneficiariesHi: 'व्यक्तिगत/संयुक्त किसान, बटाईदार, पशुपालक एवं मत्स्य पालक किसान',
    benefitAmount: 'Revolving credit limit up to ₹3 Lakh at concessional 4% interest per annum (with 3% subvention).',
    benefitAmountHi: '₹3 लाख तक का फसली ऋण 4% रियायती ब्याज दर पर (समय पर चुकाने पर 3% छूट सहित)।',
    eligibility: [
      'Age between 18 and 75 years',
      'Operational agricultural landholding or livestock proof',
      'Clear credit history with no existing willful defaults'
    ],
    eligibilityHi: [
      'आयु 18 से 75 वर्ष के मध्य',
      'कृषि भूमि या पशुधन का सत्यापन',
      'बैंक में पूर्व का डिफॉल्टर न होना'
    ],
    documentsRequired: [
      'Duly filled KCC application form',
      'Land revenue records attested by revenue officer',
      'Aadhaar Card & PAN Card',
      'Passport size photographs'
    ],
    documentsRequiredHi: [
      'केसीसी आवेदन पत्र',
      'सत्यापित खतौनी व भू-अभिलेख',
      'आधार व पैन कार्ड',
      'पासपोर्ट फोटो'
    ],
    officialPortalUrl: 'https://myscheme.gov.in/schemes/kcc',
    helpline: '1800-11-2211',
    status: 'Ongoing'
  }
];

export const LEARNING_RESOURCES: LearningVideo[] = [
  {
    id: 'vid-1',
    title: 'Complete Guide to Drip Irrigation Installation & Maintenance',
    titleHi: 'ड्रिप सिंचाई प्रणाली की स्थापना और रखरखाव की संपूर्ण विधि',
    category: 'Water Management',
    categoryHi: 'जल प्रबंधन',
    crop: 'Horticulture & Row Crops',
    durationMinutes: 14,
    language: 'Hindi',
    source: 'ICAR - Indian Agricultural Research Institute',
    youtubeId: 'dQw4w9WgXcQ', // Safe placeholder
    keyPoints: [
      'Layout planning: Main line, sub-main, and lateral pipe spacing',
      'Venturi injector setup for fertigation and acid treatment for dripper clogging',
      'How to save 45-60% water while increasing fertilizer absorption efficiency'
    ],
    keyPointsHi: [
      'पाइपलाइन लेआउट: मेन लाइन, सब-मेन और लेटरल ड्रिपर पाइप का सही फासला',
      'ड्रिपर में नमक जमने से रोकने के लिए एसिड ट्रीटमेंट और वेंचुरी फर्टिगेशन',
      '45-60% पानी की बचत के साथ खाद की उपलब्धता 90% तक बढ़ाना'
    ]
  },
  {
    id: 'vid-2',
    title: 'Preparation of Organic Jeevamrit & Neemastra Bio-Pesticide',
    titleHi: 'देसी जीवामृत और नीमास्त्र जैविक कीटनाशक बनाने की आसान विधि',
    category: 'Organic Farming',
    categoryHi: 'जैविक खेती',
    crop: 'All Crops',
    durationMinutes: 11,
    language: 'Hindi',
    source: 'National Centre for Organic and Natural Farming',
    youtubeId: 'dQw4w9WgXcQ',
    keyPoints: [
      'Ingredients: Fresh cow dung, cow urine, jaggery, gram flour, and virgin field soil',
      'Fermentation cycle: 48-72 hours in shade with clockwise stirring twice daily',
      'Effective control of sucking pests (aphids, thrips, whiteflies) without chemical residues'
    ],
    keyPointsHi: [
      'आवश्यक सामग्री: ताजा देसी गाय का गोबर, गोमूत्र, गुड़, बेसन और मेड़ की सजीव मिट्टी',
      'तैयारी: छायादार स्थान पर 48-72 घंटे तक घड़ी की सुई की दिशा में दिन में दो बार हिलाना',
      'माहू (एफिड), थ्रिप्स और सफेद मक्खी जैसे रस चूसक कीटों का सुरक्षित नियंत्रण'
    ]
  },
  {
    id: 'vid-3',
    title: 'Happy Seeder & Super Seeder: Wheat Sowing Without Stubble Burning',
    titleHi: 'हैप्पी सीडर व सुपर सीडर से बिना पराली जलाए गेहूँ की सीधी बुवाई',
    category: 'Crop Cultivation',
    categoryHi: 'फसल प्रबंधन',
    crop: 'Wheat',
    durationMinutes: 16,
    language: 'Both',
    source: 'Punjab Agricultural University (PAU Ludhiana)',
    youtubeId: 'dQw4w9WgXcQ',
    keyPoints: [
      'Direct wheat seeding into paddy residue without plowing',
      'Mulch layer conserves soil moisture and lowers soil temperature by 2-3°C during March heat waves',
      'Saves ₹2,500/acre in diesel and field preparation costs'
    ],
    keyPointsHi: [
      'धान की पराली जलाए बिना सीधे खेत में गेहूँ की बुवाई तकनीक',
      'पराली की गीली घास (मल्च) मिट्टी की नमी बचाती है और मार्च की गर्मी से दाने को बचाती है',
      'डीजल और जुताई के प्रति एकड़ लगभग ₹2,500 की सीधी बचत'
    ]
  },
  {
    id: 'vid-4',
    title: 'Scientific Soil Sampling Procedure for Soil Health Card',
    titleHi: 'मृदा स्वास्थ्य कार्ड के लिए खेत से वैज्ञानिक तरीके से मिट्टी का नमूना लेना',
    category: 'Soil Health',
    categoryHi: 'मृदा स्वास्थ्य',
    crop: 'Soil Science',
    durationMinutes: 9,
    language: 'English',
    source: 'ICAR - Central Soil Salinity Research Institute',
    youtubeId: 'dQw4w9WgXcQ',
    keyPoints: [
      'V-shaped cut method up to 15cm (plow layer depth) across 8-10 zigzag spots',
      'Quartering method for mixing and preparing a representative 500g sample',
      'How to avoid contamination from field bunds, compost heaps, and tree shades'
    ],
    keyPointsHi: [
      'खेत में 8-10 स्थानों पर अंग्रेजी के "V" आकार में 15 सेमी गहराई तक कट लगाकर मिट्टी एकत्र करना',
      'चौथाईकरण विधि से अच्छी तरह मिलाकर 500 ग्राम का अंतिम नमूना तैयार करना',
      'मेड़ों, खाद के ढेरों और पेड़ों की छाया वाली जगहों से नमूना न लेने की सावधानी'
    ]
  }
];

export const AGRICULTURAL_SHOPS: AgriculturalShop[] = [
  {
    id: 'shop-1',
    name: 'IFFCO Kisan Seva Kendra (Cooperative)',
    type: 'IFFCO Kendra',
    district: 'Sehore',
    state: 'Madhya Pradesh',
    distanceKm: 3.2,
    phone: '+91 7562 224411',
    verified: true,
    products: [
      { item: 'Neem Coated Urea (Subsidized)', brand: 'IFFCO', packSize: '45 Kg Bag', price: 266.50, unitPrice: '₹5.92/kg', inStock: true, govtSubsidized: true },
      { item: 'DAP (Di-Ammonium Phosphate 18:46:0)', brand: 'IFFCO', packSize: '50 Kg Bag', price: 1350.00, unitPrice: '₹27.00/kg', inStock: true, govtSubsidized: true },
      { item: 'Nano Urea Liquid (Liquid Fertilizer)', brand: 'IFFCO Nano', packSize: '500 ml Bottle', price: 225.00, unitPrice: '₹225/bottle', inStock: true, govtSubsidized: false },
      { item: 'NPK 12:32:16 Complex', brand: 'IFFCO', packSize: '50 Kg Bag', price: 1470.00, unitPrice: '₹29.40/kg', inStock: true, govtSubsidized: true },
      { item: 'Nano DAP Liquid', brand: 'IFFCO Nano', packSize: '500 ml Bottle', price: 600.00, unitPrice: '₹600/bottle', inStock: false, govtSubsidized: false }
    ]
  },
  {
    id: 'shop-2',
    name: 'Shree Balaji Krishi Seva Kendra',
    type: 'Private Dealer',
    district: 'Sehore',
    state: 'Madhya Pradesh',
    distanceKm: 4.8,
    phone: '+91 94251 77889',
    verified: true,
    products: [
      { item: 'Zinc Sulphate Heptahydrate 21%', brand: 'Tata Shriram', packSize: '5 Kg Bag', price: 420.00, unitPrice: '₹84.00/kg', inStock: true, govtSubsidized: false },
      { item: 'MOP (Muriate of Potash 0:0:60)', brand: 'IPL Potash', packSize: '50 Kg Bag', price: 1650.00, unitPrice: '₹33.00/kg', inStock: true, govtSubsidized: true },
      { item: 'Bio-Fungicide Trichoderma Viride', brand: 'Multiplex', packSize: '1 Kg Packet', price: 180.00, unitPrice: '₹180.00/kg', inStock: true, govtSubsidized: false },
      { item: 'Certified Wheat Seed DBW-187', brand: 'National Seeds Corp', packSize: '40 Kg Bag', price: 1520.00, unitPrice: '₹38.00/kg', inStock: true, govtSubsidized: true }
    ]
  },
  {
    id: 'shop-3',
    name: 'District Soil Testing & Diagnostic Laboratory',
    type: 'Soil Testing Lab',
    district: 'Sehore',
    state: 'Madhya Pradesh',
    distanceKm: 6.5,
    phone: '+91 7562 230015',
    verified: true,
    products: [
      { item: 'Complete 12-Parameter Soil Health Test', brand: 'Govt Authorized Lab', packSize: 'Single Sample', price: 50.00, unitPrice: '₹50/sample', inStock: true, govtSubsidized: true },
      { item: 'Irrigation Water Salinity & pH Test', brand: 'Govt Authorized Lab', packSize: '1 Liter Sample', price: 40.00, unitPrice: '₹40/sample', inStock: true, govtSubsidized: true }
    ]
  }
];

export const COMMUNITY_REPORTS: CommunityReport[] = [
  {
    id: 'rep-1',
    authorName: 'Harpreet Singh (Progressive Farmer)',
    authorDistrict: 'Ludhiana, Punjab',
    category: 'Pest Alert',
    categoryHi: 'कीट/रोग चेतावनी',
    title: 'Early signs of Yellow Rust spotted in late-sown HD-2967 fields',
    titleHi: 'पछेती बुवाई वाले HD-2967 खेतों में पीले रतुआ के शुरुआती लक्षण',
    description: 'Noticeable yellow powdery pustules observed on lower canopy leaves after 3 consecutive days of morning fog. Advise all neighboring farmers to inspect borders and keep Propiconazole ready.',
    descriptionHi: 'लगातार 3 दिन घने कोहरे के बाद निचली पत्तियों पर पीला पाउडर देखा गया। सभी किसान भाई खेत का मुआयना करें और दवा का छिड़काव तैयार रखें।',
    timestamp: '3 hours ago',
    upvotes: 42,
    userVoted: null,
    verificationLevel: 'Agronomist Verified'
  },
  {
    id: 'rep-2',
    authorName: 'Mukesh Sharma',
    authorDistrict: 'Kota, Rajasthan',
    category: 'Irrigation Canal',
    categoryHi: 'नहरी पानी रोस्टर',
    title: 'Chambal Left Main Canal water release schedule confirmed from 20th Oct',
    titleHi: 'चंबल बाईं मुख्य नहर में 20 अक्टूबर से पानी छोड़ने की तिथि तय',
    description: 'Irrigation department confirmed full gauge discharge for 12 days continuous rotation for Mustard initial watering. Clean your field water channels.',
    descriptionHi: 'सिंचाई विभाग ने सरसों की पलेवा/पहली सिंचाई हेतु 12 दिनों के लिए पूर्ण गेज से पानी छोड़ने की पुष्टि की है। अपनी खाळ (नालियों) की सफाई कर लें।',
    timestamp: 'Yesterday',
    upvotes: 68,
    userVoted: null,
    verificationLevel: 'District Admin'
  },
  {
    id: 'rep-3',
    authorName: 'Ramu Kaka (Mandi Commission Agent)',
    authorDistrict: 'Neemuch, Madhya Pradesh',
    category: 'Mandi Arrival',
    categoryHi: 'मंडी आवक सूचना',
    title: 'Sharbati Wheat arrivals peak at 18,000 bags with strong South India mill demand',
    titleHi: 'शरबती गेहूँ की 18,000 बोरी आवक, दक्षिण भारत की मिलों की जबरदस्त मांग',
    description: 'Premium bold Sharbati fetching above ₹2,850/Qtl. Good dry lots with moisture below 12% receiving immediate premium bids.',
    descriptionHi: 'उच्च गुणवत्ता शरबती ₹2,850 प्रति क्विंटल से ऊपर बिका। 12% से कम नमी वाले सूखे मालों पर तुरंत ऊंची बोलियां लग रही हैं।',
    timestamp: '2 days ago',
    upvotes: 35,
    userVoted: null,
    verificationLevel: 'Farmer Community'
  }
];

export const INITIAL_SENSOR_TELEMETRY: SensorTelemetry = {
  deviceId: 'ESP32-SOIL-NODE-01',
  fieldName: 'Wheat Plot #1 (North Acre)',
  fieldNameHi: 'गेहूँ प्लॉट #1 (उत्तरी रकबा)',
  crop: 'Wheat (DBW-187)',
  soilMoisturePercent: 34, // Below 40% optimal threshold
  soilTemperatureC: 22.4,
  ambientTempC: 28.6,
  ambientHumidityPercent: 58,
  batteryLevelPercent: 88,
  signalStrengthRssi: -67,
  lastReadingTimestamp: 'Just now (Live IoT Stream)',
  status: 'Moisture Low',
  irrigationStatus: 'Irrigate Within 24h'
};

export const MOCK_WEATHER_DATA: WeatherData = {
  location: 'Sehore / Bhopal Ag-Zone',
  state: 'Madhya Pradesh',
  temp: 29.4,
  tempMin: 18.2,
  tempMax: 32.0,
  condition: 'Clear Sky & Moderate Sun',
  conditionHi: 'साफ आसमान और हल्की धूप',
  humidity: 52,
  windSpeed: 11,
  rainProbability: 10,
  rainfallMm: 0.0,
  uvIndex: 6,
  forecast: [
    { day: 'Today', dayHi: 'आज', tempMax: 32, tempMin: 18, rainProb: 10, condition: 'Sunny', conditionHi: 'धूप' },
    { day: 'Tomorrow', dayHi: 'कल', tempMax: 31, tempMin: 19, rainProb: 15, condition: 'Partly Cloudy', conditionHi: 'आंशिक बादल' },
    { day: 'Wed', dayHi: 'बुध', tempMax: 30, tempMin: 19, rainProb: 20, condition: 'Partly Cloudy', conditionHi: 'हल्के बादल' },
    { day: 'Thu', dayHi: 'गुरु', tempMax: 29, tempMin: 18, rainProb: 35, condition: 'Overcast', conditionHi: 'घने बादल' },
    { day: 'Fri', dayHi: 'शुक्र', tempMax: 27, tempMin: 17, rainProb: 65, condition: 'Scattered Showers', conditionHi: 'मध्यम वर्षा' },
    { day: 'Sat', dayHi: 'शनि', tempMax: 28, tempMin: 17, rainProb: 25, condition: 'Clearing Up', conditionHi: 'मौसम साफ' },
    { day: 'Sun', dayHi: 'रवि', tempMax: 31, tempMin: 18, rainProb: 10, condition: 'Sunny', conditionHi: 'धूप' }
  ],
  agriculturalAlert: {
    type: 'caution',
    title: 'Rain Window Approaching on Friday',
    titleHi: 'शुक्रवार को संभावित बारिश की चेतावनी',
    message: 'Scattered rainfall (12-18mm) predicted for Friday afternoon. Postpone foliar pesticide sprays and schedule harvesting accordingly.',
    messageHi: 'शुक्रवार दोपहर को 12-18 मिमी बारिश का अनुमान है। कीटनाशक छिड़काव रोकें और कटी हुई फसल को सुरक्षित स्थान पर रखें।',
    action: 'Postpone pesticide spraying & cover open threshing heaps.',
    actionHi: 'कीटनाशक छिड़काव स्थगित करें एवं खुली उपज को तिरपाल से ढकें।'
  },
  lastUpdated: '10 mins ago',
  dataSource: 'IMD / Agrometeorological Advisory Unit'
};
