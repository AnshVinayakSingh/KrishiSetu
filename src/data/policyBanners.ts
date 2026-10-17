// Government policy banners shown in the header queue (7 slides).
// To use real artwork: put files in /public/banners and set `image: '/banners/pmkisan.jpg'`.
export interface PolicyBanner {
  id: string;
  title: string;
  titleHi: string;
  tagline: string;
  taglineHi: string;
  from: string; // gradient start
  to: string;   // gradient end
  emoji: string;
  url: string;
  image?: string;
}

export const POLICY_BANNERS: PolicyBanner[] = [
  { id: 'pm-kisan', title: 'PM-KISAN', titleHi: 'पीएम-किसान', tagline: '₹6,000 per year direct income support', taglineHi: '₹6,000 प्रति वर्ष सीधी आर्थिक सहायता', from: '#14532D', to: '#228B52', emoji: '🌾', url: 'https://pmkisan.gov.in' },
  { id: 'pmfby', title: 'PM Fasal Bima Yojana', titleHi: 'पीएम फसल बीमा योजना', tagline: 'Crop insurance against flood, drought & pests', taglineHi: 'बाढ़, सूखा व कीट से फसल सुरक्षा', from: '#1E3A8A', to: '#2563EB', emoji: '🛡️', url: 'https://pmfby.gov.in' },
  { id: 'pmksy', title: 'PMKSY – Per Drop More Crop', titleHi: 'पीएमकेएसवाई – प्रति बूंद अधिक फसल', tagline: 'Up to 55% subsidy on drip & sprinkler', taglineHi: 'ड्रिप व स्प्रिंकलर पर 55% तक सब्सिडी', from: '#0E7490', to: '#06B6D4', emoji: '💧', url: 'https://pmksy.gov.in' },
  { id: 'kcc', title: 'Kisan Credit Card', titleHi: 'किसान क्रेडिट कार्ड', tagline: 'Low-interest farm loans up to ₹3 lakh', taglineHi: '₹3 लाख तक कम ब्याज पर कृषि ऋण', from: '#7C2D12', to: '#EA580C', emoji: '💳', url: 'https://myscheme.gov.in/schemes/kcc' },
  { id: 'pm-kusum', title: 'PM-KUSUM Solar Pumps', titleHi: 'पीएम-कुसुम सोलर पंप', tagline: 'Solar pumps with up to 60% subsidy', taglineHi: 'सोलर पंप पर 60% तक सब्सिडी', from: '#92400E', to: '#E9B949', emoji: '☀️', url: 'https://pmkusum.mnre.gov.in' },
  { id: 'soil-health', title: 'Soil Health Card', titleHi: 'मृदा स्वास्थ्य कार्ड', tagline: 'Free soil testing & fertiliser advice', taglineHi: 'मुफ़्त मिट्टी जांच व खाद सलाह', from: '#3F6212', to: '#86B96B', emoji: '🧪', url: 'https://soilhealth.dac.gov.in' },
  { id: 'enam', title: 'e-NAM Online Mandi', titleHi: 'ई-नाम ऑनलाइन मंडी', tagline: 'Sell your produce across India online', taglineHi: 'अपनी उपज देशभर में ऑनलाइन बेचें', from: '#581C87', to: '#9333EA', emoji: '📈', url: 'https://enam.gov.in' },
];
