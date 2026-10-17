// Offline fallback: small keyword-based advice, used when Gemini is not configured or fails.
export interface LocalAdvice { answerEn: string; answerHi: string; suggestedActions: string[]; matched: boolean }

export function localAdvice(rawQuery: string, lang: 'hi' | 'en'): LocalAdvice {
  const query = rawQuery?.toLowerCase() || '';
  const body = { query: rawQuery };
  let answerEn = '';
  let answerHi = '';
  let suggestedActions: string[] = [];
  let matched = true;

  if (query.includes('पीली') || query.includes('yellow') || query.includes('leaf') || query.includes('पत्ती')) {
    answerEn = `Leaf yellowing in crops can arise from three primary causes:\n
1. **Nitrogen Deficiency:** Older bottom leaves turn uniformly pale green then yellow from the tip in a V-shape. Solution: Foliar spray of 1-2% urea solution or top-dress nitrogen before irrigation.\n
2. **Yellow Rust (Fungal):** Bright yellow powdery lines on leaves that smear on fingers. Solution: Spray Propiconazole 25% EC @ 1ml/L water immediately.\n
3. **Waterlogging / Poor Drainage:** Yellowing with drooping leaves due to root asphyxiation. Solution: Drain excess water and aerate soil.\n
*Actionable Step:* Inspect whether the powder wipes off on a white paper. If yes, it is fungal rust.`;

    answerHi = `फसल की पत्तियों का पीला पड़ना मुख्यतः तीन कारणों से होता है:\n
1. **नाइट्रोजन की कमी:** निचली पुरानी पत्तियां सिरे से अंदर की ओर 'V' आकार में पीली होती हैं। उपाय: 1-2% यूरिया के घोल का छिड़काव करें या सिंचाई से पहले यूरिया डालें।\n
2. **पीला रतुआ (फंगस):** पत्तियों पर पीले पाउडर की समानांतर धारियां जो उंगली लगाने पर हाथ में लग जाएं। उपाय: तुरंत प्रोपिकोनाजोल 25% EC (टिल्ट) @ 1 मिली/लीटर पानी में घोलकर छिड़कें।\n
3. **खेत में जलभराव:** जड़ों में हवा न मिलने से पौधा पीला पड़ता है। उपाय: खेत से तुरंत अतिरिक्त पानी की निकासी करें।\n
*सुझाव:* पहले उंगली से छूकर देखें, यदि पीला पाउडर लगता है तो यह रतुआ रोग है।`;

    suggestedActions = [
      lang === 'hi' ? 'रोग पहचान स्कैनर से पत्ती जांचें' : 'Scan Leaf with Disease Tool',
      lang === 'hi' ? 'KVK विशेषज्ञ से संपर्क करें' : 'Contact Local KVK Officer'
    ];
  } else if (query.includes('drip') || query.includes('ड्रिप') || query.includes('irrigation') || query.includes('सिंचाई')) {
    answerEn = `Drip Irrigation provides 45% to 60% water savings while boosting crop yields by 20-30% through direct root-zone delivery.\n
- **Subsidy Benefit:** Under the PMKSY 'Per Drop More Crop' scheme, small and marginal farmers get up to 55% subsidy, and other farmers get 45%.\n
- **Fertigation:** Soluble fertilizers can be mixed directly via Venturi injector, reducing fertilizer wastage by 35%.\n
- **Ideal Crops:** Cotton, sugarcane, vegetables (tomato, chilli), mustard, and fruit orchards.`;

    answerHi = `ड्रिप (टपक) सिंचाई से 45% से 60% पानी की बचत होती है और पैदावार में 20-30% की वृद्धि होती है:\n
- **सरकारी सब्सिडी:** पीएमकेएसवाई (प्रति बूंद अधिक फसल) योजना के तहत छोटे व सीमांत किसानों को 55% और अन्य किसानों को 45% तक सब्सिडी मिलती है।\n
- **फर्टिगेशन सुविधा:** वेंचुरी के माध्यम से घुलनशील खाद सीधे पौधे की जड़ में पहुंचती है, जिससे 35% खाद की बचत होती है।\n
- **उपयुक्त फसलें:** सब्जियां (टमाटर, मिर्च), कपास, गन्ना, बागवानी एवं सरसों।`;

    suggestedActions = [
      lang === 'hi' ? 'पीएमकेएसवाई योजना का विवरण देखें' : 'View PMKSY Scheme Details',
      lang === 'hi' ? 'व्हाट-इफ सिम्युलेटर में बचत देखें' : 'Simulate Savings in What-If'
    ];
  } else if (query.includes('rain') || query.includes('बारिश') || query.includes('मौसम') || query.includes('weather')) {
    answerEn = `Guidance for Approaching Rainfall:\n
1. **Postpone Chemical Spraying:** If rain is anticipated within 24-48 hours, avoid spraying pesticides or foliar fertilizers as they wash off into groundwater.\n
2. **Clear Drainage Channels:** Clear field bund openings and drainage furrows to prevent root stagnation.\n
3. **Protect Harvested Heaps:** Move harvested crops from threshing floors under plastic tarpaulins or elevated sheds.`;

    answerHi = `संभावित बारिश के दौरान महत्वपूर्ण सावधानियां:\n
1. **दवा छिड़काव स्थगित करें:** यदि अगले 24-48 घंटों में बारिश की संभावना है तो कीटनाशक या फोलियर स्प्रे न करें, दवा बह जाएगी।\n
2. **जल निकासी नाली साफ करें:** खेत की मेड़ों के निकास खोल दें ताकि जड़ों में पानी न भरे।\n
3. **कटी फसल की सुरक्षा:** खलिहान में रखी फसल को तुरंत तिरपाल से अच्छी तरह ढकें।`;

    suggestedActions = [
      lang === 'hi' ? 'मौसम पूर्वानुमान की जांच करें' : 'Check 7-Day Weather Forecast',
      lang === 'hi' ? 'सामुदायिक बारिश अपडेट देखें' : 'View Community Rain Reports'
    ];
  } else if (query.includes('pm-kisan') || query.includes('योजना') || query.includes('scheme') || query.includes('kisan')) {
    answerEn = `PM-KISAN Scheme Highlights:\n
- **Financial Support:** ₹6,000 per annum paid in 3 installments of ₹2,000 directly via Aadhaar-linked DBT.\n
- **Mandatory Requirements:** Land records (Khatauni), Aadhaar linked with bank account (NPCI active), and mandatory biometric or OTP-based e-KYC.\n
- **Helpline:** Dial 155261 or 011-24300606 for installment tracking.`;

    answerHi = `पीएम-किसान योजना की मुख्य बातें:\n
- **आर्थिक सहायता:** पात्र किसानों को प्रति वर्ष ₹6,000 (₹2,000 की 3 किस्तों में) सीधे बैंक खाते में।\n
- **अनिवार्य शर्तें:** राजस्व रिकॉर्ड में भूमि नाम होना, बैंक से आधार लिंक (NPCI एक्टिव) और e-KYC पूर्ण होना आवश्यक है।\n
- **हेल्पलाइन:** 155261 या 011-24300606 पर अपनी किस्त का स्टेटस चेक कर सकते हैं।`;

    suggestedActions = [
      lang === 'hi' ? 'सरकारी योजनाएं पेज देखें' : 'Explore Government Schemes',
      lang === 'hi' ? 'पात्रता कैलकुलेटर का उपयोग करें' : 'Check Eligibility Calculator'
    ];
  } else {
    matched = false;
    answerEn = 'Hello! The smart AI is not connected right now, so I can only answer a few basic topics: yellow leaves, drip irrigation, rain care and PM-KISAN. Please ask about one of these, or try again in a moment.';
    answerHi = 'नमस्ते! अभी स्मार्ट AI जुड़ा नहीं है, इसलिए मैं सिर्फ़ कुछ बुनियादी विषयों पर बता सकता हूँ: पीली पत्तियाँ, ड्रिप सिंचाई, बारिश में देखभाल और पीएम-किसान। इनमें से कुछ पूछें, या थोड़ी देर बाद फिर कोशिश करें।';
    suggestedActions = [];
  }

  return { answerEn, answerHi, suggestedActions, matched };
}
