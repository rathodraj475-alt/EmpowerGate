import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      // Navbar Keys
      nav_home: "Home",
      nav_about: "About",
      nav_portal: "User Portal",
      nav_signin: "Sign In",
      search_placeholder: "Search schemes (e.g. Kisan, Student)...",

      // Home Page Keys
      home_title: "Find Government Schemes For You",
      home_subtitle: "Enter your details to check eligibility instantly.",
      btn_check: "Check Eligibility",
      form_age: "Age",
      form_income: "Annual Family Income (₹)",

      // Additional Keys
      app_name: "EmpowerGate",
      form_gender: "Gender",
      form_caste: "Category (Caste)",
      form_state: "State",
      select_gender: "Select Gender",
      select_caste: "Select Category",
      select_state: "Select State",
      results_found: "Schemes Found For You",
      no_results: "No matching schemes found.",
      apply_link: "Apply Here",
      loading: "Loading...",
      form_occupation: "Occupation",
      select_occupation: "Select Occupation",
      occ_student: "Student",
      occ_farmer: "Farmer",
      occ_business: "Business / Self-Employed",
      occ_unemployed: "Unemployed / Other",

      // Category Keys
      cat_agri: "Agriculture",
      cat_edu: "Education",
      cat_women: "Women & Child",
      cat_biz: "Business",
      cat_jobs: "Skills & Jobs",
      cat_health: "Health",
      cat_housing: "Housing",
      cat_banking: "Banking",
      schemes_label: "Schemes"
    }
  },
  hi: {
    translation: {
      nav_home: "होम",
      nav_about: "हमारे बारे में",
      nav_portal: "यूज़र पोर्टल",
      nav_signin: "साइन इन",
      search_placeholder: "योजनाएं खोजें (जैसे किसान, छात्र)...",
      home_title: "अपने लिए सरकारी योजनाएं खोजें",
      home_subtitle: "पात्रता जांचने के लिए अपना विवरण दर्ज करें।",
      btn_check: "पात्रता जांचें",
      form_age: "आयु",
      form_income: "वार्षिक आय (₹)",
      app_name: "एम्पावरगेट (EmpowerGate)",
      form_gender: "लिंग (Gender)",
      form_caste: "श्रेणी (Category)",
      form_state: "राज्य (State)",
      select_gender: "लिंग चुनें",
      select_caste: "श्रेणी चुनें",
      select_state: "राज्य चुनें",
      results_found: "आपके लिए मिली योजनाएं",
      no_results: "कोई योजना नहीं मिली।",
      apply_link: "आवेदन करें",
      loading: "लोड हो रहा है...",
      form_occupation: "व्यवसाय (Occupation)",
      select_occupation: "व्यवसाय चुनें",
      occ_student: "छात्र (Student)",
      occ_farmer: "किसान (Farmer)",
      occ_business: "व्यापार / स्वरोजगार",
      occ_unemployed: "बेरोजगार / अन्य",
      cat_agri: "कृषि",
      cat_edu: "शिक्षा",
      cat_women: "महिला एवं बाल",
      cat_biz: "व्यवसाय",
      cat_jobs: "कૌશલ और नौकरियां",
      cat_health: "स्वास्थ्य",
      cat_housing: "आवास",
      cat_banking: "बैंकिंग",
      schemes_label: "योजनाएं"
    }
  },
  gu: {
    translation: {
      nav_home: "હોમ",
      nav_about: "અમારા વિશે",
      nav_portal: "વપરાશકર્તા પોર્ટલ",
      nav_signin: "સાઇન ઇન",
      search_placeholder: "યોજનાઓ શોધો (દા.ત. કિસાન, વિદ્યાર્થી)...",
      home_title: "તમારા માટે સરકારી યોજનાઓ શોધો",
      home_subtitle: "તરત જ પાત્રતા તપાસવા માટે તમારી વિગતો દાખલ કરો.",
      btn_check: "પાત્રતા તપાસો",
      form_age: "ઉંમર",
      form_income: "વાર્ષિક કૌટુંબિક આવક (₹)",
      app_name: "એમ્પાવરગેટ (EmpowerGate)",
      form_gender: "લિંગ (Gender)",
      form_caste: "શ્રેણી (Category)",
      form_state: "રાજ્ય (State)",
      select_gender: "લિંગ પસંદ કરો",
      select_caste: "શ્રેણી પસંદ કરો",
      select_state: "રાજ્ય પસંદ કરો",
      results_found: "તમારા માટે મળેલી યોજનાઓ",
      no_results: "કોઈ યોજના મળી નહીં.",
      apply_link: "અહીં અરજી કરો",
      loading: "લોડ થઈ રહ્યું છે...",
      form_occupation: "વ્યવસાય (Occupation)",
      select_occupation: "વ્યવસાય પસંદ કરો",
      occ_student: "વિદ્યાર્થી (Student)",
      occ_farmer: "ખેડૂત (Farmer)",
      occ_business: "વ્યાપાર / સ્વરોજગાર",
      occ_unemployed: "બેરોજગાર / અન્ય",
      cat_agri: "કૃષિ",
      cat_edu: "શિક્ષણ",
      cat_women: "મહિલા અને બાળ",
      cat_biz: "વ્યવસાય",
      cat_jobs: "કૌશલ્ય અને નોકરીઓ",
      cat_health: "આરોગ્ય",
      cat_housing: "આવાસ",
      cat_banking: "બેંકિંગ",
      schemes_label: "યોજનાઓ"
    }
  }
};

i18n.use(initReactI18next).init({
  resources,
  lng: "en", 
  fallbackLng: "en",
  interpolation: { escapeValue: false }
});

export default i18n;