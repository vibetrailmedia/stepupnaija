import { useState, useEffect, createContext, useContext } from 'react';

interface TranslationContextType {
  language: string;
  setLanguage: (lang: string) => void;
  t: (key: string, params?: Record<string, string>) => string;
  isLoading: boolean;
}

export const TranslationContext = createContext<TranslationContextType | null>(null);

export const SUPPORTED_LANGUAGES = {
  en: 'English',
  ha: 'Hausa',
  ig: 'Igbo', 
  yo: 'Yoruba'
};

// Translation dictionaries
const translations = {
  en: {
    // Navigation
    'nav.dashboard': 'Dashboard',
    'nav.projects': 'Projects',
    'nav.leaders': 'Leaders',
    'nav.engage': 'Engage',
    'nav.voting': 'Voting',
    'nav.events': 'Events',
    'nav.treasury': 'Treasury',
    'nav.analytics': 'Analytics',
    'nav.programs': 'Programs',
    'nav.network': 'Network',
    'nav.more': 'More',

    // Common actions
    'common.submit': 'Submit',
    'common.cancel': 'Cancel',
    'common.save': 'Save',
    'common.edit': 'Edit',
    'common.delete': 'Delete',
    'common.loading': 'Loading...',
    'common.error': 'Error',
    'common.success': 'Success',
    'common.continue': 'Continue',
    'common.back': 'Back',
    'common.next': 'Next',

    // Profile page
    'profile.title': 'Your Civic Profile',
    'profile.badges': 'Civic Achievement Badges',
    'profile.stats': 'Your Statistics',
    'profile.credibility': 'Credibility Score',
    'profile.engagements': 'Civic Actions',
    'profile.badges_earned': 'Badges Earned',
    'profile.streak': 'Day Streak',
    'profile.joined': 'Joined {date}',

    // Badges
    'badge.first_steps': 'First Steps',
    'badge.first_steps_desc': 'Completed your first civic task',
    'badge.community_helper': 'Community Helper',
    'badge.community_helper_desc': 'Helped resolve 5 community issues',
    'badge.civic_champion': 'Civic Champion',
    'badge.civic_champion_desc': 'Complete 50 civic engagement tasks',

    // Notifications
    'notification.task_completed': 'Civic Task Completed',
    'notification.prize_won': 'Congratulations! You Won',
    'notification.project_funded': 'Project Successfully Funded',
    'notification.kyc_approved': 'Identity Verification Approved',
    'notification.forum_reply': 'New Forum Reply',

    // Reports
    'report.title': 'Citizen Reporting System',
    'report.create': 'Report Issue',
    'report.total': 'Total Reports',
    'report.resolved': 'Resolved',
    'report.in_progress': 'In Progress',
    'report.my_active': 'My Active',
    'report.types.infrastructure': 'Infrastructure',
    'report.types.security': 'Security',
    'report.types.corruption': 'Corruption',
    'report.types.service_delivery': 'Service Delivery',
    'report.types.environmental': 'Environmental',
    'report.types.electoral': 'Electoral',

    // Transparency Dashboard
    'dashboard.title': 'Nigeria Civic Engagement Transparency Dashboard',
    'dashboard.subtitle': 'Real-time insights into civic participation, community impact, and democratic engagement across all 774 Local Government Areas in Nigeria.',
    'dashboard.live_data': 'Live Data',
    'dashboard.monthly_growth': '+{percent}% This Month',
    'dashboard.updated_live': 'Updated Live',
    'dashboard.total_citizens': 'Total Citizens',
    'dashboard.active_month': 'Active This Month',
    'dashboard.civic_actions': 'Civic Actions',
    'dashboard.community_funding': 'Community Funding',
    'dashboard.projects_completed': 'Projects Completed',
    'dashboard.credibility_score': 'Credibility Score',

    // Forums
    'forum.title': 'Community Forums',
    'forum.no_categories': 'No Forum Categories',
    'forum.join_conversation': 'Join the conversation and connect with fellow citizens!',
    'forum.topics': 'topics',
    'forum.replies': 'replies',
    'forum.last_activity': 'Last activity {time}',
    'forum.activity.high': 'High',
    'forum.activity.medium': 'Medium',
    'forum.activity.low': 'Low',
    'forum.activity.new': 'New',
  },

  ha: {
    // Navigation (Hausa)
    'nav.dashboard': 'Dashboard',
    'nav.projects': 'Ayyuka',
    'nav.leaders': 'Jagororin',
    'nav.engage': 'Shiga',
    'nav.voting': 'Zabe',
    'nav.events': 'Al\'amura',
    'nav.treasury': 'Baitul Mali',
    'nav.analytics': 'Bincike',
    'nav.programs': 'Shirye-shirye',
    'nav.network': 'Hanyar Sadarwa',
    'nav.more': 'Ƙarin',

    // Common actions
    'common.submit': 'Tura',
    'common.cancel': 'Soke',
    'common.save': 'Adana',
    'common.edit': 'Gyara',
    'common.delete': 'Share',
    'common.loading': 'Ana Lodawa...',
    'common.error': 'Kuskure',
    'common.success': 'Nasara',
    'common.continue': 'Ci gaba',
    'common.back': 'Koma',
    'common.next': 'Gaba',

    // Profile page
    'profile.title': 'Bayanan Ku na Jama\'a',
    'profile.badges': 'Lambar Yabo na Jama\'a',
    'profile.stats': 'Alkalanku',
    'profile.credibility': 'Maki na Aminci',
    'profile.engagements': 'Ayyukan Jama\'a',
    'profile.badges_earned': 'Lambar Yabo da Kuka Samu',
    'profile.streak': 'Kwanaki a Jere',
    'profile.joined': 'Kun shiga {date}',

    // Transparency Dashboard
    'dashboard.title': 'Dashboard na Bayyana Gaskiya na Jama\'ar Nijeriya',
    'dashboard.subtitle': 'Bayani na lokaci-lokaci game da shiga jama\'a, tasiri na al\'umma, da shigar da dimokuradiyya a duk LGA 774 na Nijeriya.',
    'dashboard.total_citizens': 'Jimillar \'yan Ƙasa',
    'dashboard.active_month': 'Masu Aiki a Wannan Wata',
    'dashboard.civic_actions': 'Ayyukan Jama\'a',
    'dashboard.community_funding': 'Kuɗin Al\'umma',
    'dashboard.projects_completed': 'Ayyukan da Aka Kammala',
  },

  ig: {
    // Navigation (Igbo)
    'nav.dashboard': 'Dashboard',
    'nav.projects': 'Ọrụ',
    'nav.leaders': 'Ndị Ndu',
    'nav.engage': 'Sonye',
    'nav.voting': 'Ịtụ Vootu',
    'nav.events': 'Ihe Omume',
    'nav.treasury': 'Ụlọ Ego',
    'nav.analytics': 'Nyocha',
    'nav.programs': 'Mmemme',
    'nav.network': 'Netwọk',
    'nav.more': 'Karịa',

    // Common actions
    'common.submit': 'Zipu',
    'common.cancel': 'Kagbuo',
    'common.save': 'Chekwaa',
    'common.edit': 'Dezie',
    'common.delete': 'Hichapụ',
    'common.loading': 'Na-ebu...',
    'common.error': 'Njehie',
    'common.success': 'Ihe Ịga Nke Ọma',
    'common.continue': 'Gaba n\'ihu',
    'common.back': 'Laghachi',
    'common.next': 'Osote',

    // Profile page
    'profile.title': 'Profaịlụ Obodo Gị',
    'profile.badges': 'Akara Mmeri Obodo',
    'profile.stats': 'Ọnụ Ọgụgụ Gị',
    'profile.credibility': 'Akara Ntụkwasị Obi',
    'profile.engagements': 'Omume Obodo',
    'profile.badges_earned': 'Akara Mmeri I Nwetara',
    'profile.streak': 'Ụbọchị na-aga',
    'profile.joined': 'I sonyere {date}',

    // Transparency Dashboard
    'dashboard.title': 'Dashboard Nghọta Ntinye Obodo Naịjirịa',
    'dashboard.subtitle': 'Nghọta oge niile banyere itinye obodo, mmetụta obodo, na itinye ọchịchị onye kwuo uche ya n\'ofe LGA 774 niile na Naịjirịa.',
    'dashboard.total_citizens': 'Ngụkọta Ụmụ Amaala',
    'dashboard.active_month': 'Ndị Na-arụ Ọrụ n\'Ọnwa A',
    'dashboard.civic_actions': 'Omume Obodo',
    'dashboard.community_funding': 'Ego Obodo',
    'dashboard.projects_completed': 'Ọrụ Emechara',
  },

  yo: {
    // Navigation (Yoruba)
    'nav.dashboard': 'Dashboard',
    'nav.projects': 'Iṣẹ',
    'nav.leaders': 'Awọn Oludari',
    'nav.engage': 'Kopa',
    'nav.voting': 'Idibo',
    'nav.events': 'Awọn Iṣẹlẹ',
    'nav.treasury': 'Ile-iṣura',
    'nav.analytics': 'Itupalẹ',
    'nav.programs': 'Awọn Eto',
    'nav.network': 'Nẹtiwọki',
    'nav.more': 'Diẹ Sii',

    // Common actions
    'common.submit': 'Fi ranṣẹ',
    'common.cancel': 'Fagilee',
    'common.save': 'Fi pamọ',
    'common.edit': 'Ṣatunṣe',
    'common.delete': 'Pa rẹ',
    'common.loading': 'N gbigbe...',
    'common.error': 'Aṣiṣe',
    'common.success': 'Aṣeyọri',
    'common.continue': 'Tẹsiwaju',
    'common.back': 'Pada',
    'common.next': 'Itẹle',

    // Profile page
    'profile.title': 'Profaili Ilu Rẹ',
    'profile.badges': 'Awọn Ami-ẹyẹ Ilu',
    'profile.stats': 'Awọn Iṣiro Rẹ',
    'profile.credibility': 'Ami Igbagbọ',
    'profile.engagements': 'Awọn Iṣe Ilu',
    'profile.badges_earned': 'Awọn Ami-ẹyẹ Ti O Gba',
    'profile.streak': 'Awọn Ọjọ Lẹsẹsẹ',
    'profile.joined': 'O darapọ {date}',

    // Transparency Dashboard
    'dashboard.title': 'Dashboard Kedere Ikopa Ilu Naijiria',
    'dashboard.subtitle': 'Oye akoko-gidi nipa ikopa ilu, ipa agbegbe, ati ikopa tiwantiwa kaakiri gbogbo Awọn Agbegbe Ijọba Ibilẹ 774 ni Naijiria.',
    'dashboard.total_citizens': 'Lapapọ Awọn Ara Ilu',
    'dashboard.active_month': 'Ti O Ṣiṣẹ ni Oṣu Yi',
    'dashboard.civic_actions': 'Awọn Iṣe Ilu',
    'dashboard.community_funding': 'Owo Agbegbe',
    'dashboard.projects_completed': 'Awọn Iṣẹ Ti O Pari',
  }
};

export function useTranslation() {
  const context = useContext(TranslationContext);
  if (!context) {
    // Fallback if used outside provider
    return {
      language: 'en',
      setLanguage: () => {},
      t: (key: string, params?: Record<string, string>) => {
        const translation = translations['en'][key as keyof typeof translations['en']] || key;
        if (params) {
          return Object.entries(params).reduce(
            (str, [param, value]) => str.replace(`{${param}}`, value),
            translation
          );
        }
        return translation;
      },
      isLoading: false,
    };
  }
  return context;
}

export function createTranslationHook(initialLanguage = 'en') {
  const [language, setLanguage] = useState(initialLanguage);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Load language preference from localStorage
    const savedLanguage = localStorage.getItem('preferredLanguage');
    if (savedLanguage && SUPPORTED_LANGUAGES[savedLanguage as keyof typeof SUPPORTED_LANGUAGES]) {
      setLanguage(savedLanguage);
    }
  }, []);

  const changeLanguage = (newLanguage: string) => {
    if (SUPPORTED_LANGUAGES[newLanguage as keyof typeof SUPPORTED_LANGUAGES]) {
      setIsLoading(true);
      setLanguage(newLanguage);
      localStorage.setItem('preferredLanguage', newLanguage);
      
      // Simulate loading time for language change
      setTimeout(() => {
        setIsLoading(false);
      }, 300);
    }
  };

  const t = (key: string, params?: Record<string, string>) => {
    const languageDict = translations[language as keyof typeof translations] || translations.en;
    const translation = languageDict[key as keyof typeof languageDict] || key;
    
    if (params) {
      return Object.entries(params).reduce(
        (str, [param, value]) => str.replace(`{${param}}`, value),
        translation
      );
    }
    
    return translation;
  };

  return {
    language,
    setLanguage: changeLanguage,
    t,
    isLoading,
  };
}