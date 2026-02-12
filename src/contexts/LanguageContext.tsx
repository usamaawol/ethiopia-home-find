import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type Language = 'en' | 'am' | 'om';

interface Translations {
  [key: string]: {
    en: string;
    am: string;
    om: string;
  };
}

// Core translations
export const translations: Translations = {
  // Navigation
  'nav.home': { en: 'Home', am: 'መነሻ', om: 'Mana' },
  'nav.browse': { en: 'Browse Houses', am: 'ቤቶችን ፈልግ', om: 'Manneen Barbaadi' },
  'nav.cities': { en: 'Cities', am: 'ከተሞች', om: 'Magaalota' },
  'nav.addListing': { en: 'Add Listing', am: 'ዝርዝር ጨምር', om: 'Galmeessi' },
  'nav.myListings': { en: 'My Listings', am: 'የኔ ዝርዝሮች', om: 'Galmeewwan Koo' },
  'nav.adminDashboard': { en: 'Admin Dashboard', am: 'አስተዳዳሪ ዳሽቦርድ', om: 'Daashboordii Bulchiinsaa' },
  'nav.profile': { en: 'Profile', am: 'መገለጫ', om: 'Eenyummaa' },
  'nav.settings': { en: 'Settings', am: 'ቅንብሮች', om: 'Qindaa\'ina' },
  'nav.login': { en: 'Login', am: 'ግባ', om: 'Seeni' },
  'nav.register': { en: 'Register', am: 'ተመዝገብ', om: 'Galmaa\'i' },
  'nav.logout': { en: 'Logout', am: 'ውጣ', om: 'Ba\'i' },

  // Hero section
  'hero.title': { en: 'Find Your Perfect Home in Ethiopia', am: 'በኢትዮጵያ ውስጥ ፍጹም ቤትዎን ያግኙ', om: 'Mana Kee Mudaa Itoophiyaa Keessatti Argadhu' },
  'hero.subtitle': { en: 'Connect directly with house owners. No brokers, no hidden fees.', am: 'ከቤት ባለቤቶች ጋር በቀጥታ ይገናኙ። ደላላ የለም፣ የተደበቀ ክፍያ የለም።', om: 'Abbaa manaa waliin kallattiin wal qunnamaa. Dallaalli hin jiru, kaffaltii dhokfamaa hin jiru.' },
  'hero.searchPlaceholder': { en: 'Search by city, neighborhood...', am: 'በከተማ፣ በሰፈር ይፈልጉ...', om: 'Magaalaa, ollaa barbaadi...' },
  'hero.search': { en: 'Search', am: 'ፈልግ', om: 'Barbaadi' },

  // Cities
  'cities.title': { en: 'Browse by City', am: 'በከተማ ይፈልጉ', om: 'Magaalaadhaan Barbaadi' },
  'cities.viewAll': { en: 'View All Cities', am: 'ሁሉንም ከተሞች ይመልከቱ', om: 'Magaalota Hunda Ilaali' },

  // Houses
  'houses.featured': { en: 'Featured Houses', am: 'ተለይተው የቀረቡ ቤቶች', om: 'Manneen Addaa' },
  'houses.recent': { en: 'Recently Added', am: 'በቅርብ የተጨመሩ', om: 'Dhiyeenya Dabalaman' },
  'houses.perMonth': { en: '/month', am: '/ወር', om: '/ji\'a' },
  'houses.rooms': { en: 'Rooms', am: 'ክፍሎች', om: 'Kutaalee' },
  'houses.viewDetails': { en: 'View Details', am: 'ዝርዝሮችን ይመልከቱ', om: 'Bal\'inaan Ilaali' },
  'houses.contactOwner': { en: 'Contact Owner', am: 'ባለቤቱን ያግኙ', om: 'Abbaa Manaa Quunnami' },

  // Status
  'status.pending': { en: 'Pending', am: 'በመጠባበቅ ላይ', om: 'Eegamaa' },
  'status.approved': { en: 'Approved', am: 'ጸድቋል', om: 'Mirkanaa\'e' },
  'status.rejected': { en: 'Rejected', am: 'ተቀባይነት አላገኘም', om: 'Dhiifame' },

  // Actions
  'action.improve': { en: 'Improve with AI', am: 'በ AI ያሻሽሉ', om: 'AI\'n Fooyyessi' },
  'action.submit': { en: 'Submit', am: 'አስገባ', om: 'Galchi' },
  'action.cancel': { en: 'Cancel', am: 'ሰርዝ', om: 'Haqi' },
  'action.edit': { en: 'Edit', am: 'አርትዕ', om: 'Gulaali' },
  'action.delete': { en: 'Delete', am: 'ሰርዝ', om: 'Haqi' },
  'action.approve': { en: 'Approve', am: 'አጽድቅ', om: 'Mirkaneessi' },
  'action.reject': { en: 'Reject', am: 'አትቀበል', om: 'Dhiisi' },
  'action.report': { en: 'Report Listing', am: 'ዝርዝሩን ሪፖርት አድርግ', om: 'Galmeessa Gabaasi' },

  // Form labels
  'form.title': { en: 'Title', am: 'ርዕስ', om: 'Mata Duree' },
  'form.city': { en: 'City', am: 'ከተማ', om: 'Magaalaa' },
  'form.area': { en: 'Area / Neighborhood', am: 'አካባቢ / ሰፈር', om: 'Naannoo / Ollaa' },
  'form.price': { en: 'Monthly Price (ETB)', am: 'ወርሃዊ ዋጋ (ብር)', om: 'Gatii Ji\'aa (ETB)' },
  'form.rooms': { en: 'Number of Rooms', am: 'የክፍሎች ብዛት', om: 'Lakkoofsa Kutaalee' },
  'form.maxPeople': { en: 'Max People', am: 'ከፍተኛ ሰዎች', om: 'Namoota Hanga Daangaa' },
  'form.environment': { en: 'Environment', am: 'አካባቢ', om: 'Haala Naannoo' },
  'form.description': { en: 'Description', am: 'መግለጫ', om: 'Ibsa' },
  'form.phone': { en: 'Phone Number', am: 'ስልክ ቁጥር', om: 'Lakkoofsa Bilbilaa' },
  'form.images': { en: 'Upload Images', am: 'ምስሎችን ያስገቡ', om: 'Suuraalee Galchi' },

  // Environment options
  'env.quiet': { en: 'Quiet', am: 'ጸጥ ያለ', om: 'Callisaa' },
  'env.safe': { en: 'Safe', am: 'ደህንነቱ የተጠበቀ', om: 'Nageenya' },
  'env.nearTransport': { en: 'Near Transport', am: 'ለትራንስፖርት ቅርብ', om: 'Geejjiba Dhihoo' },
  'env.nearMarket': { en: 'Near Market', am: 'ለገበያ ቅርብ', om: 'Gabaa Dhihoo' },
  'env.nearSchool': { en: 'Near School', am: 'ለትምህርት ቤት ቅርብ', om: 'Mana Barumsaa Dhihoo' },

  // Misc
  'app.name': { en: 'HouseRent Connect', am: 'HouseRent Connect', om: 'HouseRent Connect' },
  'app.tagline': { en: 'Ethiopian House Rental Platform', am: 'የኢትዮጵያ ቤት ኪራይ መድረክ', om: 'Waltajjii Kireeffannaa Manaa Itoophiyaa' },
  'theme.light': { en: 'Light', am: 'ብርሃን', om: 'Ifaa' },
  'theme.dark': { en: 'Dark', am: 'ጨለማ', om: 'Dukkana' },
  'language': { en: 'Language', am: 'ቋንቋ', om: 'Afaan' },
  'filter.priceRange': { en: 'Price Range', am: 'የዋጋ ክልል', om: 'Sadarkaa Gatii' },
  'filter.minPrice': { en: 'Min Price', am: 'ዝቅተኛ ዋጋ', om: 'Gatii Xiqqaa' },
  'filter.maxPrice': { en: 'Max Price', am: 'ከፍተኛ ዋጋ', om: 'Gatii Guddaa' },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem('language');
    return (saved as Language) || 'en';
  });

  useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);

  const t = (key: string): string => {
    const translation = translations[key];
    if (!translation) {
      console.warn(`Translation missing for key: ${key}`);
      return key;
    }
    return translation[language] || translation.en;
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
