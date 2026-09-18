export interface MedicineKnowledge {
  genericName: string;
  brandExamples: string[];
  category: string;
  simpleDescription: string;
  usedFor: string;
  howItWorks: string;
  commonAdvice: string;
  translations?: {
    mr?: {
      simpleDescription: string;
      usedFor: string;
      commonAdvice: string;
    };
    hi?: {
      simpleDescription: string;
      usedFor: string;
      commonAdvice: string;
    };
    ta?: {
      simpleDescription: string;
      usedFor: string;
      commonAdvice: string;
    };
  };
}

export const MEDICINE_KNOWLEDGE_BASE: MedicineKnowledge[] = [
  {
    genericName: 'Amlodipine',
    brandExamples: ['Amlong', 'Stamlo', 'Amlopin', 'Amlovas'],
    category: 'Blood Pressure / Heart Health',
    simpleDescription: 'A blood pressure lowering medicine (calcium channel blocker). It relaxes the muscular walls of your blood vessels.',
    usedFor: 'Keeps high blood pressure under control, prevents heart attacks, chest pain (angina), and protects against strokes and kidney damage.',
    howItWorks: 'Widens narrow blood vessels so your heart does not have to struggle or pump too hard to circulate blood.',
    commonAdvice: 'Take once daily at the same time, ideally morning after breakfast. Do not stop taking it suddenly even if you feel fine.',
    translations: {
      mr: {
        simpleDescription: 'रक्तदाब (बीपी) नियंत्रित ठेवणारे औषध. हे रक्तवाहिन्या मोकळ्या व शिथिल करते.',
        usedFor: 'उच्च रक्तदाब नियंत्रित करण्यासाठी, छातीतील दुखणे थांबवण्यासाठी आणि हृदयविकाराचा झटका व पक्षाघातापासून बचाव करण्यासाठी वापरले जाते.',
        commonAdvice: 'दररोज एकाच वेळी नाश्त्यानंतर घ्या. बरे वाटले तरी डॉक्टरांच्या सल्ल्याशिवाय बंद करू नका.'
      },
      hi: {
        simpleDescription: 'ब्लड प्रेशर (बीपी) को नियंत्रित करने की दवा। यह नसों को आराम देकर खून का बहाव आसान बनाती है।',
        usedFor: 'हाई ब्लड प्रेशर को कम रखने, दिल के दौरे और स्ट्रोक (लकवा) से बचाव के लिए उपयोग किया जाता है।',
        commonAdvice: 'रोजाना एक ही समय पर सुबह नाश्ते के बाद लें। खुद से यह दवा बंद न करें।'
      },
      ta: {
        simpleDescription: 'இரத்த அழுத்தத்தைக் கட்டுப்படுத்தும் மருந்து. இரத்தக் குழாய்களைத் தளர்த்தி சீராக்குகிறது.',
        usedFor: 'உயர் இரத்த அழுத்தத்தைக் கட்டுப்படுத்தவும், மாரடைப்பு மற்றும் பக்கவாதம் வராமல் தடுக்கவும் பயன்படுகிறது.',
        commonAdvice: 'தினமும் ஒரே நேரத்தில் காலை உணவுக்குப் பின் எடுத்துக் கொள்ளவும்.'
      }
    }
  },
  {
    genericName: 'Paracetamol',
    brandExamples: ['Crocin', 'Calpol', 'Dolo 650', 'PCM'],
    category: 'Fever & Pain Relief',
    simpleDescription: 'A safe, trusted medicine used to bring down high body temperature (fever) and soothe mild-to-moderate body pains.',
    usedFor: 'Relieves viral fever, headache, body aches, joint pain, toothache, and pain after injury or vaccination.',
    howItWorks: 'Blocks chemical pain signals sent to the brain and resets the brain’s internal thermostat to reduce fever.',
    commonAdvice: 'Take with a glass of water after meals. Keep at least 4 to 6 hours gap between doses. Do not exceed 4 tablets in a day.',
    translations: {
      mr: {
        simpleDescription: 'ताप कमी करणारे आणि अंगदुखी, डोकेदुखी थांबवणारे सुरक्षित औषध.',
        usedFor: 'ताप, डोकेदुखी, अंगदुखी, दातदुखी आणि अंग मोडून आल्यावर आराम मिळवण्यासाठी वापरले जाते.',
        commonAdvice: 'जेवणानंतर पाण्यासोबत घ्या. दोन गोळ्यांमध्ये ४ ते ६ तासांचे अंतर ठेवा. दिवसातून ४ पेक्षा जास्त गोळ्या घेऊ नका.'
      },
      hi: {
        simpleDescription: 'बुखार कम करने और बदन दर्द, सिरदर्द को शांत करने की सुरक्षित और असरदार दवा।',
        usedFor: 'वायरल बुखार, सिरदर्द, जोड़ों के दर्द, दांत दर्द और चोट के दर्द से राहत दिलाने के लिए इस्तेमाल होती है।',
        commonAdvice: 'खाना खाने के बाद एक गिलास पानी से लें। दो खुराक के बीच ४-६ घंटे का अंतर रखें।'
      },
      ta: {
        simpleDescription: 'காய்ச்சலைக் குறைக்கவும் உடல் வலியைப் போக்கவும் உதவும் பாதுகாப்பான மருந்து.',
        usedFor: 'காய்ச்சல், தலைவலி, உடல் வலி மற்றும் மூட்டு வலி நிவாரணத்திற்குப் பயன்படுகிறது.',
        commonAdvice: 'உணவுக்குப் பிறகு தண்ணீருடன் உட்கொள்ளவும்.'
      }
    }
  },
  {
    genericName: 'Iron & Folic Acid (IFA)',
    brandExamples: ['IFA Red Tablet', 'Autrin', 'Orofer', 'Ferrous Sulphate'],
    category: 'Anemia & Pregnancy Nutritional Support',
    simpleDescription: 'An essential blood-building nutritional supplement containing vital iron minerals and folic acid vitamins.',
    usedFor: 'Treats and prevents anemia (lack of blood), relieves chronic tiredness and weakness, and ensures healthy growth of unborn babies in pregnant mothers.',
    howItWorks: 'Provides raw materials required by bone marrow to manufacture red blood cells and oxygen-carrying hemoglobin.',
    commonAdvice: 'Take once daily after a full meal. Do not take with milk or tea as they reduce absorption. Stool turning dark green or black is completely normal and harmless.',
    translations: {
      mr: {
        simpleDescription: 'रक्त वाढवणारी लोह (आयर्न) आणि फॉलिक ॲसिडची पोषणयुक्त लाल गोळी.',
        usedFor: 'ॲनिमिया (रक्ताची कमतरता) दूर करण्यासाठी, अशक्तपणा घालवण्यासाठी आणि गरोदरपणात बाळाच्या निरोगी वाढीसाठी वापरली जाते.',
        commonAdvice: 'दुपारच्या जेवणानंतर पाण्यासोबत किंवा लिंबू पाण्यासोबत घ्या. चहा किंवा दुधासोबत घेऊ नका. विष्ठा काळी होणे स्वाभाविक आहे, घाबरू नका.'
      },
      hi: {
        simpleDescription: 'खून की कमी दूर करने वाली आयरन और फोलिक एसिड की लाल गोली।',
        usedFor: 'एनीमिया (खून की कमी) मिटाने, कमजोरी दूर करने और गर्भवती महिलाओं व उनके शिशु के स्वस्थ विकास के लिए उपयोग की जाती है।',
        commonAdvice: 'खाने के बाद पानी या नींबू पानी के साथ लें। चाय या दूध के साथ न लें। शौच का रंग काला होना सामान्य बात है।'
      },
      ta: {
        simpleDescription: 'இரத்த சோகையை நீக்கும் இரும்புச்சத்து மற்றும் ஃபோலிக் அமில மாத்திரை.',
        usedFor: 'இரத்த அளவை அதிகரிக்கவும், தாய் மற்றும் குழந்தையின் நலனை உறுதி செய்யவும் பயன்படுகிறது.',
        commonAdvice: 'சாப்பிட்ட பிறகு தண்ணீருடன் எடுத்துக்கொள்ளவும். பால் அல்லது தேநீருடன் உட்கொள்ள வேண்டாம்.'
      }
    }
  },
  {
    genericName: 'Calcium Carbonate',
    brandExamples: ['Shelcal', 'Gemcal', 'Calcium + Vit D3'],
    category: 'Bones & Joint Health',
    simpleDescription: 'A vital mineral supplement that nourishes and strengthens your bones, teeth, and muscles.',
    usedFor: 'Prevents bone thinning (osteoporosis), eases joint weakness in elderly, and supports developing bones during pregnancy and lactation.',
    howItWorks: 'Directly replenishes calcium reserves in skeletal bone matrix so bones stay dense, sturdy, and fracture-resistant.',
    commonAdvice: 'Take in the morning after breakfast. Keep at least 2 hours separation between Calcium and Iron tablets so both absorb fully.',
    translations: {
      mr: {
        simpleDescription: 'हाडे आणि दात बळकट करणारी कॅल्शियम आणि व्हिटॅमिन डी ची गोळी.',
        usedFor: 'हाडे ठिसूळ होणे रोखण्यासाठी, सांधेदुखी कमी करण्यासाठी आणि गरोदर महिला व वृद्ध व्यक्तींच्या हाडांच्या मजबुतीसाठी वापरली जाते.',
        commonAdvice: 'सकाळच्या नाश्त्यानंतर घ्या. आयर्नच्या गोळीसोबत एकाच वेळी घेऊ नका, दोघांमध्ये २ तासांचे अंतर ठेवा.'
      },
      hi: {
        simpleDescription: 'हड्डियों और जोड़ों को मजबूत बनाने वाली कैल्शियम और विटामिन डी की गोली।',
        usedFor: 'हड्डियों की कमजोरी, जोड़ों के दर्द से बचाव और गर्भावस्था व बुढ़ापे में हड्डियों को मजबूत रखने के लिए उपयोगी है।',
        commonAdvice: 'सुबह नाश्ते के बाद लें। आयरन की गोली और कैल्शियम की गोली के बीच कम से कम २ घंटे का अंतर रखें।'
      },
      ta: {
        simpleDescription: 'எலும்புகள் மற்றும் பற்களை வலுப்படுத்தும் கால்சியம் சத்து மாத்திரை.',
        usedFor: 'எலும்பு தேய்மானம், மூட்டு வலியைத் தடுத்து உடலை வலுவாக வைத்திருக்க உதவுகிறது.',
        commonAdvice: 'காலை உணவுக்குப் பின் உட்கொள்ளவும்.'
      }
    }
  },
  {
    genericName: 'Metformin',
    brandExamples: ['Glycomet', 'Obimet', 'Glucophage'],
    category: 'Diabetes / Blood Sugar Control',
    simpleDescription: 'A standard first-line medicine that helps regulate and lower excess glucose (sugar) circulating in your bloodstream.',
    usedFor: 'Manages Type-2 diabetes, prevents blood sugar spikes, and guards against diabetic complications in eyes, kidneys, and nerves.',
    howItWorks: 'Helps your body respond better to natural insulin and prevents your liver from releasing excess sugar into the blood.',
    commonAdvice: 'Always take with or immediately after meals to avoid any stomach discomfort or nausea. Drink plenty of water throughout the day.',
    translations: {
      mr: {
        simpleDescription: 'रक्तातील साखरेचे प्रमाण (डायबेटिस) नियंत्रित ठेवणारी मुख्य गोळी.',
        usedFor: 'मधुमेह नियंत्रित ठेवण्यासाठी, रक्तातील साखर वाढू न देण्यासाठी आणि डोळे, मूत्रपिंड सुरक्षित ठेवण्यासाठी वापरली जाते.',
        commonAdvice: 'नेहमी जेवणासोबत किंवा जेवणानंतर लगेच घ्या, जेणेकरून पोटात जळजळ किंवा मळमळ होणार नाही.'
      },
      hi: {
        simpleDescription: 'खून में शुगर (मधुमेह) के स्तर को सामान्य बनाए रखने वाली प्रमुख दवा।',
        usedFor: 'टाइप-2 डायबिटीज को नियंत्रित करने और शुगर से होने वाली आंखों, गुर्दों की खराबी से बचाने के लिए दी जाती है।',
        commonAdvice: 'हमेशा भोजन के साथ या भोजन के तुरंत बाद लें ताकि पेट खराब न हो।'
      },
      ta: {
        simpleDescription: 'இரத்த சர்க்கரை அளவைக் கட்டுப்படுத்தும் நீரிழிவு நோய் மாத்திரை.',
        usedFor: 'சர்க்கரை நோயைக் கட்டுக்குள் வைத்திருக்கவும் பக்கவிளைவுகளைத் தடுக்கவும் உதவுகிறது.',
        commonAdvice: 'உணவுடன் அல்லது உணவுக்குப் பிறகு உடனடியாக உட்கொள்ளவும்.'
      }
    }
  },
  {
    genericName: 'Amoxicillin',
    brandExamples: ['Mox', 'Novamox', 'Amoxil'],
    category: 'Antibiotics / Anti-bacterial',
    simpleDescription: 'A broad-spectrum antibiotic medicine that cures infections caused by harmful bacteria in your body.',
    usedFor: 'Treats chest and throat infections, tonsillitis, ear and sinus pain, skin wounds, and dental bacterial infections.',
    howItWorks: 'Breaks down the protective cell wall of invading bacteria, stopping their multiplication and destroying the infection.',
    commonAdvice: 'Complete the FULL prescribed course (e.g. 5 days) even if your symptoms improve after 2 days. Stopping early can cause the infection to bounce back stronger.',
    translations: {
      mr: {
        simpleDescription: 'जिवाणूंचा (बॅक्टेरिया) संसर्ग नष्ट करणारे अँटिबायोटिक औषध.',
        usedFor: 'घसा खवखवणे, छातीतील संसर्ग, कानदुखी, जखमेतील पू आणि दातांमधील जंतुसंसर्ग बरा करण्यासाठी वापरले जाते.',
        commonAdvice: 'डॉक्टरांनी सांगितलेले सर्व दिवस (उदा. ५ दिवस) गोळ्या पूर्ण करा. मध्येच गोळ्या थांबवल्यास आजार पुन्हा बळावू शकतो.'
      },
      hi: {
        simpleDescription: 'बैक्टीरियल संक्रमण (कीटाणुओं) को खत्म करने वाली असरदार एंटीबायोटिक दवा।',
        usedFor: 'गले की खराश, छाती का इन्फेक्शन, कान का दर्द, फोड़े-फुंसी और घाव के इन्फेक्शन को ठीक करने के लिए इस्तेमाल होती है।',
        commonAdvice: 'डॉक्टर द्वारा बताए गए पूरे दिन (जैसे ५ दिन) का कोर्स पूरा करें। बीच में दवा न छोड़ें।'
      },
      ta: {
        simpleDescription: 'பாக்டீரியா தொற்றுகளை குணப்படுத்தும் ஆன்டிபயாடிக் மருந்து.',
        usedFor: 'தொண்டை வலி, நெஞ்சு சளி, காது தொற்று மற்றும் காயங்களை குணப்படுத்த பயன்படுகிறது.',
        commonAdvice: 'மருத்துவர் கூறிய முழு நாட்களும் மாத்திரையை தவறாமல் எடுத்துக்கொள்ளவும்.'
      }
    }
  },
  {
    genericName: 'ORS Oral Rehydration Salts',
    brandExamples: ['ORS Sachet', 'Electral', 'W.H.O. ORS'],
    category: 'Hydration & Pediatric Essential Care',
    simpleDescription: 'A scientifically formulated balanced mixture of glucose sugars and vital body salts (electrolytes).',
    usedFor: 'Prevents and treats dangerous dehydration and weakness caused by loose motions (diarrhea), vomiting, or heat stroke.',
    howItWorks: 'Instantly recharges lost water and salts into intestinal cells, revitalizing energy and preventing weakness.',
    commonAdvice: 'Dissolve one full sachet in exactly 1 liter of clean drinking or boiled-and-cooled water. Stir well and sip frequently. Consume the prepared mixture within 24 hours.',
    translations: {
      mr: {
        simpleDescription: 'शरीरातील पाण्याचे आणि आवश्यक क्षारांचे प्रमाण पूर्ववत करणारे जीवनजल (ओआरएस).',
        usedFor: 'उलटी, जुलाब (हगवण), उन्हाचा त्रास यामुळे शरीरातील पाणी कमी होऊन येणारा अशक्तपणा दूर करण्यासाठी वापरले जाते.',
        commonAdvice: 'एक पाकीट १ लिटर स्वच्छ किंवा उकळून थंड केलेल्या पाण्यात पूर्ण विरघळवा. २४ तासांच्या आत थोडे-थोडे घोट घेत प्या.'
      },
      hi: {
        simpleDescription: 'शरीर में पानी और जरूरी लवणों की कमी पूरी करने वाला जीवनरक्षक घोल (ओआरएस)।',
        usedFor: 'दस्त (उल्टी-दस्त), हैजा और तेज गर्मी के कारण शरीर में होने वाले पानी के सूखेपन (डिहाइड्रेशन) को दूर करने के लिए दिया जाता है।',
        commonAdvice: 'पूरा एक पैकेट १ लीटर साफ या उबले हुए ठंडे पानी में घोलें। २४ घंटे के भीतर थोड़ा-थोड़ा करके पिएं।'
      },
      ta: {
        simpleDescription: 'உடலில் நீர் மற்றும் தாது உப்புகள் குறையாமல் காக்கும் ஓ.ஆர்.எஸ் கரைசல்.',
        usedFor: 'வயிற்றுப்போக்கு, வாந்தி மற்றும் நீர் இழப்பால் ஏற்படும் சோர்வை நீக்கப் பயன்படுகிறது.',
        commonAdvice: 'ஒரு பாக்கெட்டை ஒரு லிட்டர் தூய நீரில் கரைத்து 24 மணி நேரத்திற்குள் பருகவும்.'
      }
    }
  },
  {
    genericName: 'Cetirizine',
    brandExamples: ['Cetzine', 'Alerid', 'Zyrtec', 'Okacet'],
    category: 'Allergy & Cold Relief',
    simpleDescription: 'An anti-allergic antihistamine tablet that stops allergic reactions, watery eyes, and continuous sneezing.',
    usedFor: 'Relieves running nose, allergic rhinitis, continuous sneezing, skin itching, insect bites, and allergic rashes.',
    howItWorks: 'Blocks histamine, a natural chemical produced by your body that causes allergic swelling, redness, and itching.',
    commonAdvice: 'Best taken at night before sleeping as it may cause mild drowsiness. Avoid driving or operating heavy farm machinery after taking it.',
    translations: {
      mr: {
        simpleDescription: 'ऍलर्जी, शिंका आणि खाज थांबवणारी अँटी-ऍलर्जिक गोळी.',
        usedFor: 'वाहणारे नाक, सततच्या शिंका, धूळ किंवा थंडीमुळे होणारी ऍलर्जी, त्वचेवरची खाज व पुरळ थांबवण्यासाठी वापरली जाते.',
        commonAdvice: 'रात्री झोपताना घेणे अधिक उत्तम, कारण यामुळे थोडी गुंगी किंवा झोप येऊ शकते. गोळी घेतल्यावर वाहन चालवणे टाळा.'
      },
      hi: {
        simpleDescription: 'एलर्जी, सर्दी, छींकें और खुजली को रोकने वाली सुरक्षित दवा।',
        usedFor: 'बहती नाक, बार-बार छींक आना, मौसमी एलर्जी, त्वचा की खुजली और लाल चकत्तों को ठीक करने के लिए दी जाती है।',
        commonAdvice: 'रात को सोने से पहले लें क्योंकि इससे हल्की नींद आ सकती है। दवा लेने के बाद गाड़ी चलाने से बचें।'
      },
      ta: {
        simpleDescription: 'ஒவ்வாமை, தும்மல் மற்றும் அரிப்பை போக்கும் மாத்திரை.',
        usedFor: 'மூக்கொழுகுதல், தும்மல், தோல் அரிப்பு மற்றும் ஒவ்வாமைக்கு சிகிச்சையளிக்கப் பயன்படுகிறது.',
        commonAdvice: 'இரவு தூங்கும் முன் எடுத்துக்கொள்வது நல்லது.'
      }
    }
  },
  {
    genericName: 'Pantoprazole',
    brandExamples: ['Pan 40', 'Pantocid', 'Pantodac'],
    category: 'Gastro-Intestinal & Acid Protection',
    simpleDescription: 'A stomach acid reducer (proton pump inhibitor) that protects the stomach lining and stops acidity.',
    usedFor: 'Treats severe acidity, chest burning (heartburn), stomach gas, indigestion, and prevents ulcers when taking painkillers or antibiotics.',
    howItWorks: 'Turns down the acid pumps in your stomach lining so that stomach produces less harsh digestive acid.',
    commonAdvice: 'Take once daily in the morning on an empty stomach with a cup of warm water, at least 30 minutes before having tea or breakfast.',
    translations: {
      mr: {
        simpleDescription: 'पोटातील पित्त (ॲसिडिटी) आणि जळजळ कमी करणारी गोळी.',
        usedFor: 'छातीतील जळजळ, ॲसिडिटी, पोटात गॅस होणे आणि इतर औषधांमुळे पोट बिघडू नये यासाठी संरक्षणात्मक गोळी म्हणून वापरली जाते.',
        commonAdvice: 'सकाळी उठल्यावर काहीही खाण्यापूर्वी (उपाशीपोटी) कोमट पाण्यासोबत घ्या. त्यानंतर ३० मिनिटांनी चहा किंवा नाश्ता करा.'
      },
      hi: {
        simpleDescription: 'पेट में बनने वाले अत्यधिक तेजाब (एसिडिटी) और गैस को शांत करने वाली दवा।',
        usedFor: 'छाती में जलन (हार्टबर्न), खट्टी डकारें, पेट में भारीपन और अन्य तेज दवाओं से पेट की सुरक्षा के लिए दी जाती है।',
        commonAdvice: 'सुबह खाली पेट गुनगुने पानी के साथ लें। दवा लेने के आधे घंटे बाद ही चाय या नाश्ता करें।'
      },
      ta: {
        simpleDescription: 'வயிற்று எரிச்சல் மற்றும் அசிடிட்டியைக் குறைக்கும் மாத்திரை.',
        usedFor: 'நெஞ்செரிச்சல், வாயுத்தொல்லை மற்றும் வயிற்றுப் புண்களைக் குணப்படுத்த பயன்படுகிறது.',
        commonAdvice: 'காலை வெறும் வயிற்றில் உணவுக்கு 30 நிமிடங்களுக்கு முன் உட்கொள்ளவும்.'
      }
    }
  },
  {
    genericName: 'Azithromycin',
    brandExamples: ['Azee 500', 'Azithral', 'Zithromax'],
    category: 'Antibiotics / Respiratory Care',
    simpleDescription: 'A strong once-a-day antibacterial tablet that quickly clears deeper bacterial infections.',
    usedFor: 'Cures severe throat infection, tonsil swelling, bronchial chest infections, pneumonia, and ear infections.',
    howItWorks: 'Stops infectious bacteria from synthesizing essential proteins, starving the bacteria and killing them.',
    commonAdvice: 'Take once daily at the same time, either 1 hour before food or 2 hours after meals with water. Complete the full 3 or 5 day course.',
    translations: {
      mr: {
        simpleDescription: 'दिवसातून एकदा घ्यावयाचे शक्तिशाली अँटिबायोटिक औषध.',
        usedFor: 'घसा खवखवणे, टॉन्सिल्सची सूज, छातीतील कफ व जंतुसंसर्ग, न्यूमोनिया बरा करण्यासाठी वापरले जाते.',
        commonAdvice: 'दिवसातून एकदा एकाच वेळी घ्या. डॉक्टरांनी सांगितलेले ३ किंवा ५ दिवसांचा कोर्स न चुकता पूर्ण करा.'
      },
      hi: {
        simpleDescription: 'गले और छाती के गंभीर संक्रमण को तेजी से खत्म करने वाली एंटीबायोटिक दवा।',
        usedFor: 'गले में तेज दर्द, टॉन्सिल की सूजन, छाती में जकड़न और खांसी, फेफड़ों के इन्फेक्शन के इलाज में प्रयोग की जाती है।',
        commonAdvice: 'दिन में सिर्फ एक बार एक निश्चित समय पर लें। पूरे कोर्स (३ या ५ दिन) की सभी गोलियां खत्म करें।'
      },
      ta: {
        simpleDescription: 'தொண்டை மற்றும் நெஞ்சு தொற்றுக்களைக் குணப்படுத்தும் சக்திவாய்ந்த ஆன்டிபயாடிக்.',
        usedFor: 'கடுமையான தொண்டை வலி மற்றும் சுவாசப்பாதை தொற்றுகளுக்குப் பயன்படுகிறது.',
        commonAdvice: 'மருத்துவர் பரிந்துரைத்த நாட்களுக்கு தவறாமல் உட்கொள்ளவும்.'
      }
    }
  },
  {
    genericName: 'Salbutamol',
    brandExamples: ['Asthalin', 'Ventorlin', 'Salbutamol Inhaler'],
    category: 'Respiratory / Asthma Relief',
    simpleDescription: 'A fast-acting bronchodilator medicine that opens up tight chest airways during breathlessness.',
    usedFor: 'Relieves acute asthma attacks, breathing difficulty, chest wheezing (whistling breath), and seasonal dust allergies in lungs.',
    howItWorks: 'Relaxes constricted smooth muscles around your bronchial breathing tubes, allowing air to flow freely into lungs.',
    commonAdvice: 'Use the inhaler or take tablet as instructed by doctor when feeling breathless. Rinse mouth with clean water after each inhaler puff.',
    translations: {
      mr: {
        simpleDescription: 'दम लागणे थांबवणारे आणि श्वासनलिका मोकळ्या करणारे श्वसनविकाराचे औषध.',
        usedFor: 'दम्याचा झटका (अस्थमा), धाप लागणे, छातीत घरघर आवाज येणे आणि श्वास घेण्यास त्रास होत असताना तातडीने आराम देण्यासाठी वापरले जाते.',
        commonAdvice: 'धाप लागल्यावर डॉक्टरांच्या सल्ल्यानुसार लगेच वापरा. इनहेलर वापरल्यानंतर पाण्याने गुळण्या करा.'
      },
      hi: {
        simpleDescription: 'सांस फूलने से तुरंत राहत दिलाने और फेफड़ों की नलियों को खोलने वाली दवा।',
        usedFor: 'दमा (अस्थमा), सांस लेने में तकलीफ, छाती में सीटी जैसी आवाज आना और खांसी में सांस रुकने पर आराम देने के लिए उपयोगी है।',
        commonAdvice: 'सांस की तकलीफ होने पर इनहेलर या दवा का इस्तेमाल करें। इनहेलर के बाद सादे पानी से कुल्ला जरूर करें।'
      },
      ta: {
        simpleDescription: 'சுவாசக் குழாய்களை விரிவடையச் செய்து மூச்சுத்திணறலை நீக்கும் மருந்து.',
        usedFor: 'ஆஸ்துமா, மூச்சுத்திணறல் மற்றும் மூச்சு இரைப்புக்கு உடனடியாக நிவாரணம் அளிக்கிறது.',
        commonAdvice: 'மூச்சுத்திணறல் ஏற்படும் போது மருத்துவர் ஆலோசனைப்படி உட்கொள்ளவும்.'
      }
    }
  },
  {
    genericName: 'Vitamin B-Complex',
    brandExamples: ['Becosules', 'Cobadex', 'Neurobion'],
    category: 'Vitamins & Nerve Health',
    simpleDescription: 'A rejuvenating multivitamin capsule packed with B-group vitamins (B1, B6, B12, Niacinamide).',
    usedFor: 'Treats mouth ulcers, nerve numbness/tingling in hands and feet, generalized exhaustion, and poor appetite.',
    howItWorks: 'Aids cellular metabolism, repairs damaged nerve sheaths, and converts food efficiently into usable energy.',
    commonAdvice: 'Take once daily after lunch. Notice: urine will temporarily turn bright yellow; this is harmless excess vitamin being naturally cleared.',
    translations: {
      mr: {
        simpleDescription: 'ताकद आणि मज्जातंतूंच्या पोषणासाठी आवश्यक जीवनसत्त्वे (व्हिटॅमिन बी-कॉम्प्लेक्स) असणारी कॅप्सूल.',
        usedFor: 'तोंडात येणारे फोड (अल्सर), हात-पायांची मुंग्या येणे किंवा बधिरता, थकवा घालवण्यासाठी आणि भूक वाढवण्यासाठी दिली जाते.',
        commonAdvice: 'दुपारच्या जेवणानंतर १ गोळी घ्या. यामुळे लघवीचा रंग गडद पिवळा होऊ शकतो, हे अगदी सामान्य आहे.'
      },
      hi: {
        simpleDescription: 'शरीर को ताकत देने वाली और नसों को स्वस्थ रखने वाली विटामिन बी-कॉम्प्लेक्स की गोली।',
        usedFor: 'मुंह के छालों, हाथ-पैरों में झनझनाहट/सुन्नपन, कमजोरी और थकान मिटाने के लिए प्रयोग की जाती है।',
        commonAdvice: 'दोपहर के भोजन के बाद लें। पेशाब का रंग हल्का पीला हो सकता है, जो कि पूरी तरह सामान्य है।'
      },
      ta: {
        simpleDescription: 'நரம்பு பலவீனத்தை நீக்கி புத்துணர்ச்சி அளிக்கும் வைட்டமின் பி-காம்ப்ளக்ஸ்.',
        usedFor: 'வாய் புண்கள், சோர்வு மற்றும் கை, கால் மரத்துப்போதலை குணப்படுத்த பயன்படுகிறது.',
        commonAdvice: 'மதிய உணவுக்குப் பின் உட்கொள்ளவும்.'
      }
    }
  },
  {
    genericName: 'Albendazole',
    brandExamples: ['Zentel', 'Noworm', 'Bendex'],
    category: 'Deworming / Parasite Care',
    simpleDescription: 'A single-dose deworming medicine that cleanses the digestive gut of parasitic worms and eggs.',
    usedFor: 'Eliminates intestinal roundworms, hookworms, and pinworms that rob nutrients and cause anemia, tummy ache, and poor growth in children.',
    howItWorks: 'Deprives worms of glucose and cellular nutrition in the gut, causing them to detach and pass harmlessly out of the body.',
    commonAdvice: 'Chew the tablet thoroughly at bedtime before swallowing. Whole families in rural communities are recommended deworming every 6 months under National Deworming Day.',
    translations: {
      mr: {
        simpleDescription: 'पोटातील जंत (कृमी) नष्ट करणारी जंताची गोळी (डिवॉर्मिंग).',
        usedFor: 'पोटदुखी, मुलांमध्ये कुपोषण व रक्ताची कमतरता निर्माण करणाऱ्या पोटातील जंतांचा नायनाट करण्यासाठी वापरली जाते.',
        commonAdvice: 'रात्री झोपताना गोळी चावून खावी. वर्षातून दोनदा कुटुंबातील सर्वांनी ही गोळी घेणे आरोग्यदायी ठरते.'
      },
      hi: {
        simpleDescription: 'पेट के कीड़ों (कृमि) को जड़ से खत्म करने वाली दवा।',
        usedFor: 'पेट दर्द, बच्चों में भूख न लगना और खून की कमी करने वाले पेट के कीड़ों को मारने के लिए दी जाती है।',
        commonAdvice: 'रात को सोने से पहले गोली को अच्छी तरह चबाकर खाएं। ६ महीने में एक बार यह दवा जरूर लें।'
      },
      ta: {
        simpleDescription: 'வயிற்றுப் பூச்சிகளை அழிக்கும் மாத்திரை.',
        usedFor: 'வயிற்று வலி மற்றும் ஊட்டச்சத்துக் குறைபாட்டை உண்டாக்கும் குடல் புழுக்களை அழிக்கப் பயன்படுகிறது.',
        commonAdvice: 'இரவு தூங்கும் முன் நன்கு மென்று சாப்பிடவும்.'
      }
    }
  }
];

/**
 * Intelligent matcher to find the best medicine knowledge entry from a name string
 * handles patterns like "Tab. Amlodipine 5mg", "Cap. Amoxicillin 500mg", "ORS Sachet", "PCM" etc.
 */
export function findMedicineKnowledge(queryName: string): MedicineKnowledge {
  const clean = queryName.toLowerCase().replace(/^(tab\.|cap\.|inj\.|syr\.|tab|cap|inj|syr)\s*/i, '').trim();

  // 1. Direct or partial match on genericName
  for (const item of MEDICINE_KNOWLEDGE_BASE) {
    const gen = item.genericName.toLowerCase();
    if (clean.includes(gen) || gen.includes(clean)) {
      return item;
    }
    // Also match keywords like "ifa", "ors", "calcium", "paracetamol", "amlo"
    if (clean.includes('ifa') && gen.includes('iron')) return item;
    if (clean.includes('ors') && gen.includes('ors')) return item;
    if (clean.includes('pcm') && gen.includes('paracetamol')) return item;
    if (clean.includes('amlo') && gen.includes('amlodipine')) return item;
    if (clean.includes('metfor') && gen.includes('metformin')) return item;
    if (clean.includes('amox') && gen.includes('amoxicillin')) return item;
    if (clean.includes('azith') && gen.includes('azithromycin')) return item;
    if (clean.includes('cetz') || clean.includes('cetir')) return item;
    if (clean.includes('panto') && gen.includes('pantoprazole')) return item;
    if (clean.includes('b-complex') || clean.includes('becos')) return item;
  }

  // 2. Brand examples match
  for (const item of MEDICINE_KNOWLEDGE_BASE) {
    for (const brand of item.brandExamples) {
      if (clean.includes(brand.toLowerCase())) {
        return item;
      }
    }
  }

  // 3. Fallback generic template for custom/other medicines
  return {
    genericName: queryName,
    brandExamples: [],
    category: 'Essential Prescription Medication',
    simpleDescription: `Prescribed therapeutic medicine (${queryName}) for your clinical condition.`,
    usedFor: 'Prescribed by your doctor to heal symptoms, resolve infection, or restore healthy body balance.',
    howItWorks: 'Acts on target body cells to bring symptom relief and accelerate clinical recovery.',
    commonAdvice: 'Take strictly according to prescribed schedule with water after meals. Do not alter dose without doctor advice.',
    translations: {
      mr: {
        simpleDescription: `तुमच्या आजारासाठी डॉक्टरांनी दिलेले औषध (${queryName}).`,
        usedFor: 'लक्षणे थांबवण्यासाठी, संसर्ग दूर करण्यासाठी आणि प्रकृती सुधारण्यासाठी डॉक्टरांनी हे औषध दिले आहे.',
        commonAdvice: 'औषध डॉक्टरांच्या सल्ल्यानुसार वेळेवर घ्या. जेवणानंतर स्वच्छ पाण्यासोबत घ्या.'
      },
      hi: {
        simpleDescription: `आपकी बीमारी के लिए डॉक्टर द्वारा निर्धारित दवा (${queryName})।`,
        usedFor: 'लक्षणों को ठीक करने, इन्फेक्शन मिटाने और स्वास्थ्य सुधारने के लिए दी गई है।',
        commonAdvice: 'डॉक्टर द्वारा बताए गए समय पर खाने के बाद पानी के साथ नियमित रूप से लें।'
      },
      ta: {
        simpleDescription: `உங்கள் உடல் நலத்திற்கு மருத்துவர் வழங்கிய மருந்து (${queryName}).`,
        usedFor: 'நோய் அறிகுறிகளை நீக்கி நலம்பெற இந்த மருந்து வழங்கப்பட்டுள்ளது.',
        commonAdvice: 'மருத்துவரின் அறிவுரைப்படி உணவுக்குப் பின் சரியான நேரத்தில் உட்கொள்ளவும்.'
      }
    }
  };
}
