// ============================================================
// i18n - Multi-language Engine (English / Hindi / Gujarati)
// ============================================================
const TRANSLATIONS = {
  en: {
    hero_label:'ESTABLISHED 1995 · AHMEDABAD, INDIA',
    hero_title:'The Grand Mehta Palace',
    hero_subtitle:'Where every meal is a masterpiece and every stay is a memory',
    hero_cta1:'Explore System →',hero_cta2:'Discover More',
    about_label:'Our Story',about_title:'A Legacy of Luxury & Taste',
    about_desc1:'Founded in 1995 by visionary entrepreneur Arjun Mehta, The Grand Mehta Palace has stood as Ahmedabad\'s crown jewel of hospitality.',
    about_desc2:'Our philosophy: every guest deserves a royal experience. From hand-crafted interiors to a meticulously curated menu, every detail speaks excellence.',
    gallery_label:'Visual Journey',gallery_title:'Our Gallery',
    fac_title:'Our Facilities',fac_wifi:'Free High-Speed WiFi',fac_dining:'Premium Dining',
    nav_about:'About',nav_gallery:'Gallery',nav_facilities:'Facilities',nav_team:'Team',nav_reviews:'Reviews',nav_contact:'Contact',
  },
  hi: {
    hero_label:'स्थापित 1995 · अहमदाबाद, भारत',
    hero_title:'द ग्रैंड मेहता पैलेस',
    hero_subtitle:'जहाँ हर खाना एक कृति है और हर ठहराव एक याद',
    hero_cta1:'सिस्टम एक्सप्लोर करें →',hero_cta2:'और जानें',
    about_label:'हमारी कहानी',about_title:'विलासिता और स्वाद की विरासत',
    about_desc1:'1995 में दूरदर्शी उद्यमी अर्जुन मेहता द्वारा स्थापित, द ग्रैंड मेहता पैलेस अहमदाबाद का सबसे शानदार होटल है।',
    about_desc2:'हमारा दर्शन: हर अतिथि शाही अनुभव का हकदार है।',
    gallery_label:'दृश्य यात्रा',gallery_title:'हमारी गैलरी',
    fac_title:'हमारी सुविधाएं',fac_wifi:'मुफ्त हाई-स्पीड वाईफाई',fac_dining:'प्रीमियम भोजन',
    nav_about:'हमारे बारे में',nav_gallery:'गैलरी',nav_facilities:'सुविधाएं',nav_team:'टीम',nav_reviews:'समीक्षाएं',nav_contact:'संपर्क',
  },
  gu: {
    hero_label:'સ્થાપિત 1995 · અમદાવાદ, ભારત',
    hero_title:'ધ ગ્રૅન્ડ મેહતા પૅલૅસ',
    hero_subtitle:'જ્યાં દરેક ભોજન એક કળાકૃતિ છે અને દરેક રોકાણ એક સ્મૃતિ',
    hero_cta1:'સિસ્ટમ જુઓ →',hero_cta2:'વધુ જાણો',
    about_label:'આપણી વાર્તા',about_title:'વૈભવ અને સ્વાદની વિરાસત',
    about_desc1:'1995 માં દ્રષ્ટિવાન ઉદ્યોગપતિ અર્જુન મેહતા દ્વારા સ્થાપિત, ધ ગ્રૅન્ડ મેહતા પૅલૅસ અમદાવાદનો ગૌરવ છે.',
    about_desc2:'અમારી ફિલૉસૉફી: દરેક મહેમાન શાહી અનુભવ ને લાયક છે.',
    gallery_label:'દ્રશ્ય સફર',gallery_title:'અમારી ગૅલેરી',
    fac_title:'અમારી સુવિધાઓ',fac_wifi:'મફત હાઈ-સ્પીડ વૉઈ-ફૉઈ',fac_dining:'પ્રીમિયમ ભોજન',
    nav_about:'અમારા વિશે',nav_gallery:'ગૅલેરી',nav_facilities:'સુવિધાઓ',nav_team:'ટીમ',nav_reviews:'સમીક્ષા',nav_contact:'સંપર્ક',
  }
};

let currentLang = localStorage.getItem('hotelLang') || 'en';

function setLang(lang) {
  currentLang = lang;
  localStorage.setItem('hotelLang', lang);
  applyTranslations();
  document.getElementById('lang-select').value = lang;
}

function applyTranslations() {
  const t = TRANSLATIONS[currentLang] || TRANSLATIONS.en;
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (t[key]) el.innerHTML = t[key];
  });
}

function t(key) {
  return (TRANSLATIONS[currentLang] || TRANSLATIONS.en)[key] || key;
}

// Auto-apply on load
document.addEventListener('DOMContentLoaded', () => {
  applyTranslations();
  const sel = document.getElementById('lang-select');
  if (sel) sel.value = currentLang;
});

window.setLang = setLang;
window.t = t;
