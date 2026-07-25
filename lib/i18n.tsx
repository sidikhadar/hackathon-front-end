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
      brand: 'Rijal Lghayth',
    },
    langNames: { fr: 'Français', ar: 'العربية' },
    help: {
      title: "Besoin d'aide ?",
      message:
        "Besoin d'aide pour votre inscription ? Appelez-nous, on vous guide.",
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
      titleSms: 'Connexion par SMS',
      titleOtp: 'Vérification',
      subtitlePhone: 'Connectez-vous à votre compte.',
      subtitleSms: 'Entrez votre numéro, on vous envoie un code par SMS.',
      subtitleOtp: 'Entrez le code à 6 chiffres envoyé au',
      phoneLabel: 'Numéro de téléphone',
      passwordLabel: 'Mot de passe',
      passwordPlaceholder: 'Votre mot de passe',
      forgot: 'Mot de passe oublié ?',
      sendCode: 'Recevoir un code par SMS',
      usePassword: 'Se connecter avec un mot de passe',
      or: 'ou',
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
      photo: 'Photo de profil',
      photoOptional: 'Optionnelle',
      addPhoto: 'Ajouter une photo',
      changePhoto: 'Changer la photo',
      fullName: 'Nom complet',
      fullNamePlaceholder: 'Ahmed Ould Mohamed',
      phoneLabel: 'Numéro de téléphone',
      passwordLabel: 'Mot de passe',
      passwordPlaceholder: 'Choisissez un mot de passe',
      emergencyTitle: "Contact d'urgence",
      emergencySubtitle: 'Prévenu si vous lancez une alerte',
      contactName: 'Nom du contact',
      contactNamePlaceholder: 'Proche ou famille',
      contactPhone: 'Téléphone du contact',
      submit: 'Créer mon compte',
      verify: 'Vérifier et continuer',
      haveAccount: 'Déjà inscrit ?',
      successTitle: 'Compte créé avec succès !',
      successSubtitle: 'Bienvenue sur Rijal Lghayth',
      loginNow: 'Se connecter maintenant',
    },
    home: {
      location: 'Tevragh-Zeina, Nouakchott',
      helpBig: 'AIDE',
      helpSub: 'Appuyez pour alerter',
      instruction:
        'En cas de danger, appuyez. Vos voisins proches seront alertés immédiatement.',
      neighbors: 'voisins actifs',
      responseTime: 'temps de réponse',
      notifications: 'Notifications',
    },
    menu: {
      title: 'Menu',
      settings: 'Paramètres',
      settingsSub: 'Profil, contact d’urgence',
      history: 'Historique des alertes',
      historySub: 'Vos alertes passées',
      language: 'Langue',
      logout: 'Déconnexion',
      version: 'Version 1.0.0',
    },
    logout: {
      title: 'Déconnexion',
      message: 'Voulez-vous vraiment vous déconnecter ?',
      cancel: 'Annuler',
      confirm: 'Confirmer',
    },
    alerts: {
      title: 'Alertes des voisins',
      subtitle: 'Personnes ayant besoin d’aide près de vous',
      empty: 'Aucune alerte pour le moment',
      distance: 'à',
      respond: 'Je réponds',
    },
    detail: {
      title: 'Détail de l’alerte',
      severityLabel: 'Gravité',
      severityLow: 'Faible',
      severityMedium: 'Modérée',
      severityHigh: 'Critique',
      messageLabel: 'Message',
      noMessage: 'Aucun message fourni.',
      quickCall: 'Appels d’urgence',
      police: 'Police',
      firefighters: 'Pompiers',
      ambulance: 'Ambulance',
      callVictim: 'Appeler',
      respond: 'Je réponds',
      distanceAway: 'à',
    },
    responder: {
      title: 'En route',
      helping: 'Vous aidez',
      youLabel: 'Vous',
      distanceLabel: 'Distance',
      etaLabel: 'Arrivée estimée',
      min: 'min',
      othersOne: 'autre voisin en route',
      othersMany: 'autres voisins en route',
      arrived: 'Je suis arrivé',
      cancel: 'Annuler ma réponse',
      arrivedTitle: 'Vous êtes arrivé !',
      arrivedMsg:
        'Merci pour votre aide. Restez prudent et coordonnez-vous avec les secours si besoin.',
      backHome: 'Retour à l’accueil',
      callVictim: 'Appeler la victime',
    },
    placeholder: {
      soon: 'Bientôt disponible',
      soonSub: 'Cette section arrive dans une prochaine étape.',
    },
    emergency: {
      title: "Quelle est l'urgence ?",
      subtitle: 'Sélectionnez pour alerter vos voisins',
    },
    confirm: {
      title: "Confirmer l'alerte",
      subtitle: 'Vérifiez les informations avant d’envoyer.',
      typeLabel: "Type d'urgence",
      messageLabel: 'Message (optionnel)',
      messagePlaceholder: 'Décrivez brièvement la situation…',
      locationLabel: 'Votre position',
      locating: 'Localisation en cours…',
      located: 'Position détectée',
      accuracy: 'Précision',
      send: "Envoyer l'alerte",
      sending: 'Envoi de l’alerte…',
      reassure: 'Vos voisins proches vont être prévenus immédiatement.',
    },
    live: {
      title: 'Alerte en cours',
      subtitle: 'Vos voisins sont prévenus',
      you: 'Vous',
      youHere: 'Vous êtes ici',
      enRouteOne: 'voisin en route',
      enRouteMany: 'voisins en route',
      notified: 'voisins prévenus',
      neighborsTitle: 'Voisins à proximité',
      responded: 'En route',
      willHelp: 'Je vais aider',
      onTheWay: 'Vous êtes en route',
      away: 'à',
      cancel: "Annuler l'alerte",
      resolved: 'Je suis en sécurité',
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
      brand: 'رجال الغيث',
    },
    langNames: { fr: 'Français', ar: 'العربية' },
    help: {
      title: 'هل تحتاج مساعدة؟',
      message: 'هل تحتاج مساعدة في التسجيل؟ اتصل بنا وسنرشدك.',
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
      titleSms: 'الدخول عبر SMS',
      titleOtp: 'التحقق',
      subtitlePhone: 'سجّل الدخول إلى حسابك.',
      subtitleSms: 'أدخل رقمك وسنرسل لك رمزًا عبر الرسائل القصيرة.',
      subtitleOtp: 'أدخل الرمز المكوّن من 6 أرقام المُرسَل إلى',
      phoneLabel: 'رقم الهاتف',
      passwordLabel: 'كلمة المرور',
      passwordPlaceholder: 'كلمة المرور الخاصة بك',
      forgot: 'هل نسيت كلمة المرور؟',
      sendCode: 'استلام رمز عبر SMS',
      usePassword: 'الدخول بكلمة المرور',
      or: 'أو',
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
      photo: 'صورة الملف الشخصي',
      photoOptional: 'اختياري',
      addPhoto: 'إضافة صورة',
      changePhoto: 'تغيير الصورة',
      fullName: 'الاسم الكامل',
      fullNamePlaceholder: 'أحمد ولد محمد',
      phoneLabel: 'رقم الهاتف',
      passwordLabel: 'كلمة المرور',
      passwordPlaceholder: 'اختر كلمة المرور',
      emergencyTitle: 'جهة اتصال للطوارئ',
      emergencySubtitle: 'يتم إشعارها عند إطلاق تنبيه',
      contactName: 'اسم جهة الاتصال',
      contactNamePlaceholder: 'قريب أو من العائلة',
      contactPhone: 'هاتف جهة الاتصال',
      submit: 'إنشاء حسابي',
      verify: 'تحقّق وتابع',
      haveAccount: 'لديك حساب بالفعل؟',
      successTitle: 'تم إنشاء الحساب بنجاح !',
      successSubtitle: 'مرحبًا بك في رجال الغيث',
      loginNow: 'تسجيل الدخول الآن',
    },
    home: {
      location: 'تفرغ زينة، نواكشوط',
      helpBig: 'مساعدة',
      helpSub: 'اضغط للتنبيه',
      instruction: 'عند وجود خطر، اضغط. سيتم تنبيه جيرانك القريبين فورًا.',
      neighbors: 'جار نشط',
      responseTime: 'زمن الاستجابة',
      notifications: 'الإشعارات',
    },
    menu: {
      title: 'القائمة',
      settings: 'الإعدادات',
      settingsSub: 'الملف الشخصي، جهة الطوارئ',
      history: 'سجل التنبيهات',
      historySub: 'تنبيهاتك السابقة',
      language: 'اللغة',
      logout: 'تسجيل الخروج',
      version: 'الإصدار 1.0.0',
    },
    logout: {
      title: 'تسجيل الخروج',
      message: 'هل تريد بالفعل تسجيل الخروج؟',
      cancel: 'إلغاء',
      confirm: 'تأكيد',
    },
    alerts: {
      title: 'تنبيهات الجيران',
      subtitle: 'أشخاص بحاجة إلى مساعدة بالقرب منك',
      empty: 'لا توجد تنبيهات حاليًا',
      distance: 'على بعد',
      respond: 'أستجيب',
    },
    detail: {
      title: 'تفاصيل التنبيه',
      severityLabel: 'الخطورة',
      severityLow: 'منخفضة',
      severityMedium: 'متوسطة',
      severityHigh: 'حرجة',
      messageLabel: 'الرسالة',
      noMessage: 'لا توجد رسالة.',
      quickCall: 'مكالمات الطوارئ',
      police: 'الشرطة',
      firefighters: 'الإطفاء',
      ambulance: 'الإسعاف',
      callVictim: 'اتصال',
      respond: 'أستجيب',
      distanceAway: 'على بعد',
    },
    responder: {
      title: 'في الطريق',
      helping: 'أنت تساعد',
      youLabel: 'أنت',
      distanceLabel: 'المسافة',
      etaLabel: 'الوصول المتوقع',
      min: 'دقيقة',
      othersOne: 'جار آخر في الطريق',
      othersMany: 'جيران آخرون في الطريق',
      arrived: 'لقد وصلت',
      cancel: 'إلغاء استجابتي',
      arrivedTitle: 'لقد وصلت !',
      arrivedMsg:
        'شكرًا على مساعدتك. ابقَ حذرًا ونسّق مع رجال الإنقاذ عند الحاجة.',
      backHome: 'العودة إلى الرئيسية',
      callVictim: 'الاتصال بالضحية',
    },
    placeholder: {
      soon: 'قريبًا',
      soonSub: 'سيتوفر هذا القسم في مرحلة قادمة.',
    },
    emergency: {
      title: 'ما نوع الطارئ؟',
      subtitle: 'اختر لتنبيه جيرانك',
    },
    confirm: {
      title: 'تأكيد التنبيه',
      subtitle: 'تحقق من المعلومات قبل الإرسال.',
      typeLabel: 'نوع الطارئ',
      messageLabel: 'رسالة (اختياري)',
      messagePlaceholder: 'صف الوضع باختصار…',
      locationLabel: 'موقعك',
      locating: 'جارٍ تحديد الموقع…',
      located: 'تم تحديد الموقع',
      accuracy: 'الدقة',
      send: 'إرسال التنبيه',
      sending: 'جارٍ إرسال التنبيه…',
      reassure: 'سيتم تنبيه جيرانك القريبين على الفور.',
    },
    live: {
      title: 'تنبيه جارٍ',
      subtitle: 'تم تنبيه جيرانك',
      you: 'أنت',
      youHere: 'أنت هنا',
      enRouteOne: 'جار في الطريق',
      enRouteMany: 'جيران في الطريق',
      notified: 'جيران تم تنبيههم',
      neighborsTitle: 'جيران قريبون',
      responded: 'في الطريق',
      willHelp: 'سأساعد',
      onTheWay: 'أنت في الطريق',
      away: 'على بعد',
      cancel: 'إلغاء التنبيه',
      resolved: 'أنا في أمان',
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
