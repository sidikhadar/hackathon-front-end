/* ============================================================================
   i18n.tsx — SYSTEME DE TRADUCTION (Francais / Arabe) + gestion RTL
   ----------------------------------------------------------------------------
   COMMENT CA MARCHE (explication simple) :
   - On cree un "contexte" React : une boite partagee accessible par toutes
     les pages, qui contient la langue choisie + les textes traduits.
   - <LanguageProvider> enveloppe l'application (branche dans layout.tsx).
   - Dans n'importe quel composant, on appelle le hook `useLanguage()` pour
     recuperer : la langue active, la fonction pour la changer, le sens de
     lecture (dir = 'ltr' en FR, 'rtl' en AR) et le dictionnaire de textes `t`.
   - Quand la langue change, on met a jour <html lang="..." dir="..."> pour
     que toute la page bascule automatiquement en RTL (arabe) ou LTR (francais).
   ============================================================================ */

'use client'

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'

/* Les deux langues supportees */
export type Lang = 'fr' | 'ar'

/* ----------------------------------------------------------------------------
   DICTIONNAIRE DE TEXTES
   Pour chaque langue, on liste tous les textes de l'app, ranges par ecran.
   Pour traduire un mot, il suffit de le modifier ici (un seul endroit).
   ---------------------------------------------------------------------------- */
const TRANSLATIONS = {
  fr: {
    common: {
      login: 'Se connecter',
      register: 'Créer un compte',
      continue: 'Continuer',
      back: 'Retour',
      help: 'Aide',
      close: 'Fermer',
    },
    langNames: { fr: 'Français', ar: 'العربية' },
    help: {
      question: 'Une question ?',
      contact: 'Contactez-nous au',
    },
    police: {
      title: 'Police (urgence)',
      subtitle: 'Appel direct, à tout moment',
      call: 'Appeler',
    },
    welcome: {
      tagline: "L'entraide de quartier, à portée de main",
      subtitle:
        'Alertez vos voisins en un geste et recevez de l’aide en cas d’urgence, partout à Nouakchott.',
      secure: 'Vos données restent confidentielles',
    },
    login: {
      titlePhone: 'Bon retour',
      titleOtp: 'Vérification',
      subtitlePhone: 'Connectez-vous avec votre numéro de téléphone.',
      subtitleOtp: 'Entrez le code à 6 chiffres envoyé au',
      phoneLabel: 'Numéro de téléphone',
      sendCode: 'Recevoir le code',
      verify: 'Vérifier et continuer',
      resendIn: 'Renvoyer le code dans',
      resend: 'Renvoyer le code',
      noAccount: 'Pas encore de compte ?',
    },
    register: {
      title: 'Créer un compte',
      subtitle: "Rejoignez le réseau d'entraide de votre quartier.",
      titleOtp: 'Vérification',
      subtitleOtp: 'Entrez le code à 6 chiffres envoyé au',
      photo: 'Photo (optionnelle)',
      fullName: 'Nom complet',
      fullNamePlaceholder: 'Ahmed Ould Mohamed',
      phoneLabel: 'Numéro de téléphone',
      emergencyTitle: "Contact d'urgence",
      emergencySubtitle: 'Prévenu si vous lancez une alerte',
      contactName: 'Nom du contact',
      contactNamePlaceholder: 'Proche ou famille',
      contactPhone: 'Téléphone du contact',
      submit: 'Créer mon compte',
      verify: 'Vérifier et continuer',
      haveAccount: 'Déjà inscrit ?',
    },
    home: {
      location: 'Tevragh-Zeina, Nouakchott',
      helpBig: 'AIDE',
      helpSub: 'Appuyez pour alerter',
      instruction:
        'En cas de danger, appuyez. Vos voisins proches seront alertés immédiatement.',
      neighbors: 'voisins actifs',
      responseTime: 'temps de réponse',
    },
    emergency: {
      title: "Quelle est l'urgence ?",
      subtitle: 'Sélectionnez pour alerter vos voisins',
    },
  },

  ar: {
    common: {
      login: 'تسجيل الدخول',
      register: 'إنشاء حساب',
      continue: 'متابعة',
      back: 'رجوع',
      help: 'مساعدة',
      close: 'إغلاق',
    },
    langNames: { fr: 'Français', ar: 'العربية' },
    help: {
      question: 'هل لديك سؤال؟',
      contact: 'اتصل بنا على',
    },
    police: {
      title: 'الشرطة (طوارئ)',
      subtitle: 'اتصال مباشر في أي وقت',
      call: 'اتصال',
    },
    welcome: {
      tagline: 'التضامن بين الجيران في متناول يدك',
      subtitle:
        'نبّه جيرانك بلمسة واحدة واحصل على المساعدة في حالات الطوارئ، أينما كنت في نواكشوط.',
      secure: 'تبقى بياناتك سرية',
    },
    login: {
      titlePhone: 'مرحبًا بعودتك',
      titleOtp: 'التحقق',
      subtitlePhone: 'سجّل الدخول برقم هاتفك.',
      subtitleOtp: 'أدخل الرمز المكوّن من 6 أرقام المُرسَل إلى',
      phoneLabel: 'رقم الهاتف',
      sendCode: 'إرسال الرمز',
      verify: 'تحقّق وتابع',
      resendIn: 'إعادة إرسال الرمز خلال',
      resend: 'إعادة إرسال الرمز',
      noAccount: 'ليس لديك حساب؟',
    },
    register: {
      title: 'إنشاء حساب',
      subtitle: 'انضم إلى شبكة التضامن في حيّك.',
      titleOtp: 'التحقق',
      subtitleOtp: 'أدخل الرمز المكوّن من 6 أرقام المُرسَل إلى',
      photo: 'صورة (اختياري)',
      fullName: 'الاسم الكامل',
      fullNamePlaceholder: 'أحمد ولد محمد',
      phoneLabel: 'رقم الهاتف',
      emergencyTitle: 'جهة اتصال للطوارئ',
      emergencySubtitle: 'يتم إشعارها عند إطلاق تنبيه',
      contactName: 'اسم جهة الاتصال',
      contactNamePlaceholder: 'قريب أو من العائلة',
      contactPhone: 'هاتف جهة الاتصال',
      submit: 'إنشاء حسابي',
      verify: 'تحقّق وتابع',
      haveAccount: 'لديك حساب بالفعل؟',
    },
    home: {
      location: 'تفرغ زينة، نواكشوط',
      helpBig: 'مساعدة',
      helpSub: 'اضغط للتنبيه',
      instruction: 'عند وجود خطر، اضغط. سيتم تنبيه جيرانك القريبين فورًا.',
      neighbors: 'جار نشط',
      responseTime: 'زمن الاستجابة',
    },
    emergency: {
      title: 'ما نوع الطارئ؟',
      subtitle: 'اختر لتنبيه جيرانك',
    },
  },
} as const

/* Type du dictionnaire (structure identique pour FR et AR) */
export type Dictionary = (typeof TRANSLATIONS)['fr']

/* Contenu partage par le contexte */
type LanguageContextValue = {
  lang: Lang
  setLang: (lang: Lang) => void
  dir: 'ltr' | 'rtl' // sens de lecture
  t: Dictionary // dictionnaire de la langue active
}

const LanguageContext = createContext<LanguageContextValue | null>(null)

/* ----------------------------------------------------------------------------
   LanguageProvider — enveloppe l'app et fournit langue + traductions
   ---------------------------------------------------------------------------- */
export function LanguageProvider({ children }: { children: ReactNode }) {
  // Langue active (par defaut : francais)
  const [lang, setLangState] = useState<Lang>('fr')

  // Le sens de lecture depend de la langue (arabe = de droite a gauche)
  const dir: 'ltr' | 'rtl' = lang === 'ar' ? 'rtl' : 'ltr'

  // Change la langue + memorise le choix dans le navigateur
  const setLang = useCallback((next: Lang) => {
    setLangState(next)
    try {
      window.localStorage.setItem('rl-lang', next)
    } catch {
      /* ignore (mode navigation privee, etc.) */
    }
  }, [])

  // Au premier chargement : relit la langue memorisee (si elle existe)
  useEffect(() => {
    try {
      const saved = window.localStorage.getItem('rl-lang') as Lang | null
      if (saved === 'fr' || saved === 'ar') setLangState(saved)
    } catch {
      /* ignore */
    }
  }, [])

  // Met a jour <html lang="..." dir="..."> pour basculer toute la page
  useEffect(() => {
    document.documentElement.lang = lang
    document.documentElement.dir = dir
  }, [lang, dir])

  // Valeur fournie a toute l'app (memoisee pour eviter les recalculs inutiles)
  const value = useMemo<LanguageContextValue>(
    () => ({ lang, setLang, dir, t: TRANSLATIONS[lang] }),
    [lang, setLang, dir],
  )

  return (
    <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
  )
}

/* ----------------------------------------------------------------------------
   useLanguage() — hook pratique pour lire la langue + les textes traduits
   Exemple : const { t, lang, setLang, dir } = useLanguage()
             <h1>{t.login.titlePhone}</h1>
   ---------------------------------------------------------------------------- */
export function useLanguage() {
  const ctx = useContext(LanguageContext)
  if (!ctx) {
    throw new Error('useLanguage doit être utilisé dans <LanguageProvider>')
  }
  return ctx
}
