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
      profile: 'Mon profil',
      profileSub: 'Infos et contact d’urgence',
      settings: 'Paramètres',
      settingsSub: 'Langue, notifications, aide',
      history: 'Historique des alertes',
      historySub: 'Vos alertes passées',
      language: 'Langue',
      logout: 'Déconnexion',
      version: 'Version 1.0.0',
    },
    settings: {
      title: 'Paramètres',
      // Préférences
      prefsTitle: 'Préférences',
      language: 'Langue',
      notifications: 'Notifications',
      notificationsSub: 'Alertes de vos voisins',
      sound: 'Son des alertes',
      soundSub: 'Sonnerie forte en cas d’urgence',
      location: 'Partage de la position',
      locationSub: 'Requis pour alerter les voisins proches',
      // Aide & support
      helpTitle: 'Aide & support',
      guide: 'Guide d’utilisation',
      guideSub: 'Comment utiliser l’application',
      faq: 'Questions fréquentes',
      contact: 'Contacter le support',
      contactSub: 'Nous écrire ou appeler',
      // Légal
      legalTitle: 'Légal',
      terms: 'Conditions d’utilisation',
      privacy: 'Politique de confidentialité',
      // À propos
      aboutTitle: 'À propos',
      appName: 'Rijal Lghayth',
      appVersion: 'Version 1.0.0',
      developedBy: 'Développé par',
      startup: 'HYBRIDS TECH',
      founder: 'Sidi Mohamed El Khader',
      rights: '© 2026 HYBRIDS TECH. Tous droits réservés.',
      // Guide (contenu)
      guideTitle: 'Guide d’utilisation',
      guideIntro:
        'Rijal Lghayth vous permet d’alerter vos voisins en cas d’urgence et de porter secours autour de vous.',
      guideStep1Title: 'Lancer une alerte',
      guideStep1:
        'Appuyez sur le bouton AIDE, choisissez le type d’urgence, confirmez, et vos voisins proches sont prévenus immédiatement.',
      guideStep2Title: 'Répondre à un voisin',
      guideStep2:
        'Quand un voisin lance une alerte, ouvrez-la, consultez les détails et appuyez sur « Je réponds » pour aller l’aider.',
      guideStep3Title: 'Appels d’urgence',
      guideStep3:
        'Depuis une alerte, appelez en un geste la Police, les Pompiers, l’Ambulance ou la personne concernée.',
      guideStep4Title: 'Contact d’urgence',
      guideStep4:
        'Ajoutez un proche dans votre profil : il sera prévenu automatiquement quand vous lancez une alerte.',
      close: 'Fermer',
      // FAQ (contenu)
      faqTitle: 'Questions fréquentes',
      faqItems: [
        {
          q: 'Qui reçoit mon alerte ?',
          a: 'Vos voisins proches inscrits sur Rijal Lghayth, ainsi que votre contact d’urgence enregistré.',
        },
        {
          q: 'L’application fonctionne-t-elle sans internet ?',
          a: 'Une connexion est nécessaire pour envoyer une alerte et localiser les voisins. Les appels d’urgence, eux, passent toujours.',
        },
        {
          q: 'Puis-je annuler une alerte envoyée par erreur ?',
          a: 'Oui. Depuis l’écran de suivi, vous pouvez indiquer « Je suis en sécurité » pour clore l’alerte à tout moment.',
        },
        {
          q: 'Mes données de localisation sont-elles protégées ?',
          a: 'Votre position n’est partagée que pendant une alerte active, uniquement avec les voisins qui portent secours.',
        },
      ],
      // Légal (contenu)
      termsTitle: 'Conditions d’utilisation',
      termsBody: [
        'Rijal Lghayth est un service d’entraide de voisinage destiné à alerter rapidement vos proches et voisins en cas d’urgence. Il ne remplace pas les services de secours officiels (Police, Pompiers, Ambulance).',
        'En cas de danger réel, contactez toujours en priorité les numéros d’urgence officiels.',
        'Vous vous engagez à utiliser l’application de bonne foi et à ne pas déclencher de fausses alertes. Tout abus peut entraîner la suspension de votre compte.',
        'HYBRIDS TECH met tout en œuvre pour assurer la disponibilité du service mais ne peut garantir un fonctionnement ininterrompu.',
      ],
      privacyTitle: 'Politique de confidentialité',
      privacyBody: [
        'Nous collectons uniquement les informations nécessaires au fonctionnement du service : nom, téléphone, quartier et contact d’urgence.',
        'Votre position géographique n’est utilisée que pendant une alerte active, afin de permettre aux voisins de vous porter secours.',
        'Vos données ne sont jamais vendues à des tiers. Elles sont conservées de manière sécurisée par HYBRIDS TECH.',
        'Vous pouvez demander la modification ou la suppression de vos données à tout moment via le support.',
      ],
    },
    history: {
      title: 'Historique des alertes',
      subtitle: 'Vos alertes passées et en cours',
      empty: 'Aucune alerte enregistrée',
      emptySub: 'Vos alertes apparaîtront ici.',
      statusResolved: 'Résolue',
      statusOngoing: 'En cours',
      roleVictim: 'Alerte lancée',
      roleResponder: 'Vous avez aidé',
    },
    profile: {
      title: 'Mon profil',
      editPhoto: 'Modifier la photo',
      memberSince: 'Membre depuis',
      phoneLabel: 'Téléphone',
      neighborhoodLabel: 'Quartier',
      nameLabel: 'Nom complet',
      emergencyTitle: 'Contact d’urgence',
      emergencySub: 'Prévenu si vous lancez une alerte',
      emergencyNameLabel: 'Nom du contact',
      emergencyPhoneLabel: 'Téléphone du contact',
      reputationTitle: 'Fiabilité dans le quartier',
      reputationSub: 'Basée sur vos entraides passées',
      reputationTrusted: 'Voisin de confiance',
      statHelped: 'Entraides',
      statAlerts: 'Alertes',
      edit: 'Modifier',
      save: 'Enregistrer',
      cancelEdit: 'Annuler',
      saved: 'Profil mis à jour',
      report: 'Signaler un abus',
      reportTitle: 'Signaler un abus',
      reportMsg:
        'Merci de nous aider à garder le quartier sûr. Notre équipe examinera votre signalement.',
      reportConfirm: 'Envoyer le signalement',
      reportSent: 'Signalement envoyé',
      cancel: 'Annuler',
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
      profile: 'ملفي الشخصي',
      profileSub: 'المعلومات وجهة الطوارئ',
      settings: 'الإعدادات',
      settingsSub: 'اللغة، الإشعارات، المساعدة',
      history: 'سجل التنبيهات',
      historySub: 'تنبيهاتك السابقة',
      language: 'اللغة',
      logout: 'تسجيل الخروج',
      version: 'الإصدار 1.0.0',
    },
    settings: {
      title: 'الإعدادات',
      prefsTitle: 'التفضيلات',
      language: 'اللغة',
      notifications: 'الإشعارات',
      notificationsSub: 'تنبيهات جيرانك',
      sound: 'صوت التنبيهات',
      soundSub: 'رنين قوي عند الطوارئ',
      location: 'مشاركة الموقع',
      locationSub: 'مطلوب لتنبيه الجيران القريبين',
      helpTitle: 'الم����اعدة والدعم',
      guide: 'دليل الاستخدام',
      guideSub: 'كيفية استخدام التطبيق',
      faq: 'الأسئلة الشائعة',
      contact: 'الاتصال بالدع��',
      contactSub: 'راسلنا أو اتصل بنا',
      legalTitle: 'قانوني',
      terms: 'شروط الاستخدام',
      privacy: 'سياسة الخصوصية',
      aboutTitle: 'حول التطبيق',
      appName: 'رجال الغيث',
      appVersion: 'الإصدار 1.0.0',
      developedBy: 'تطوير',
      startup: 'HYBRIDS TECH',
      founder: 'سيدي محمد الخضر',
      rights: '© 2026 HYBRIDS TECH. جميع الحقوق محفوظة.',
      guideTitle: 'دليل الاستخدام',
      guideIntro:
        'يتيح لك رجال الغيث تنبيه جيرانك عند الطوارئ وتقديم المساعدة من حولك.',
      guideStep1Title: 'إطلاق تنبيه',
      guideStep1:
        'اضغط زر المساعدة، اختر نوع الطارئ، أكّد، وسيتم تنبيه جيرانك القريبين فورًا.',
      guideStep2Title: 'الاستجابة لجار',
      guideStep2:
        'عندما يُطلق جار تنبيهًا، افتحه واطّلع على التفاصيل ثم اضغط «أستجيب» للذهاب لمساعدته.',
      guideStep3Title: 'مكالمات الطوارئ',
      guideStep3:
        'من داخل التنبيه، اتصل بلمسة واحدة بالشرطة أو الإطفاء أو الإسعاف أو الشخص المعني.',
      guideStep4Title: 'جهة اتصال الطوارئ',
      guideStep4:
        'أضف قريبًا في ملفك الشخصي: سيتم إشعاره تلقائيًا عند إطلاقك تنبيهًا.',
      close: 'إغلاق',
      faqTitle: 'الأسئلة الشائعة',
      faqItems: [
        {
          q: 'من يتلقّى تنبيهي؟',
          a: 'جيرانك القريبون المسجّلون في رجال الغيث، إضافةً إلى جهة اتصال الطوارئ المسجّلة لديك.',
        },
        {
          q: 'هل يعمل التطبيق بدون إنترنت؟',
          a: 'يلزم اتصال بالإنترنت لإرسال تنبيه وتحديد مواقع الجيران. أما مكالمات الطوارئ فتعمل دائمًا.',
        },
        {
          q: 'هل يمكنني إلغاء تنبيه أُرسل بالخطأ؟',
          a: 'نعم. من شاشة المتابعة يمكنك اختيار «أنا بأمان» لإغلاق التنبيه في أي وقت.',
        },
        {
          q: 'هل بيانات موقعي محمية؟',
          a: 'لا يُشارك موقعك إلا أثناء تنبيه نشط، ومع الجيران الذين يقدّمون المساعدة فقط.',
        },
      ],
      termsTitle: 'شروط الاستخدام',
      termsBody: [
        'رجال الغيث خدمة تعاون بين الجيران لتنبيه أقربائك وجيرانك بسرعة عند الطوارئ. وهي لا تحلّ محلّ خدمات الإنقاذ الرسمية (الشرطة، الإطفاء، الإسعاف).',
        'في حال وجود خطر حقيقي، اتصل دائمًا أولًا بأرقام الطوارئ الرسمية.',
        'تتعهّد باستخدام التطبيق بحسن نية وعدم إطلاق تنبيهات كاذبة. أي إساءة قد تؤدّي إلى تعليق حسابك.',
        'تبذل HYBRIDS TECH قصارى جهدها لضمان توفّر الخدمة لكنها لا تضمن تشغيلًا متواصلًا دون انقطاع.',
      ],
      privacyTitle: 'سياسة الخصوصية',
      privacyBody: [
        'نجمع فقط المعلومات اللازمة لعمل الخدمة: الاسم، الهاتف، الحي، وجهة اتصال الطوارئ.',
        'لا يُستخدم موقعك الجغرافي إلا أثناء تنبيه نشط، لتمكين الجيران من مساعدتك.',
        'لا تُباع بياناتك أبدًا لأطراف ثالثة. وتُحفظ بشكل آمن لدى HYBRIDS TECH.',
        'يمكنك طلب تعديل أو حذف بياناتك في أي وقت عبر الدعم.',
      ],
    },
    history: {
      title: 'سجل التنبيهات',
      subtitle: 'تنبيهاتك السابقة والجارية',
      empty: 'لا توجد تنبيهات مسجّلة',
      emptySub: 'ستظهر تنبيهاتك هنا.',
      statusResolved: 'تم الحل',
      statusOngoing: 'جارٍ',
      roleVictim: 'تنبيه مُطلق',
      roleResponder: 'لقد ساعدت',
    },
    profile: {
      title: 'ملفي الشخصي',
      editPhoto: 'تعديل الصورة',
      memberSince: 'عضو منذ',
      phoneLabel: 'الهاتف',
      neighborhoodLabel: 'الحي',
      emergencyTitle: 'جهة اتصال للطوارئ',
      emergencySub: 'يتم إشعارها عند إطلاق تنبيه',
      nameLabel: 'الاسم الكامل',
      emergencyNameLabel: 'اسم جهة الاتصال',
      emergencyPhoneLabel: 'هاتف جهة الاتصال',
      reputationTitle: 'الموثوقية في الحي',
      reputationSub: 'بناءً على مساعداتك السابقة',
      reputationTrusted: 'جار موثوق',
      statHelped: 'مساعدات',
      statAlerts: 'تنبيهات',
      edit: 'تعديل',
      save: 'حفظ',
      cancelEdit: 'إلغاء',
      saved: 'تم تحديث الملف الشخصي',
      report: 'الإبلاغ عن إساءة',
      reportTitle: 'الإبلاغ عن إساءة',
      reportMsg:
        'شكرًا لمساعدتنا في الحفاظ على أمان الحي. سيراجع فريقنا بلاغك.',
      reportConfirm: 'إرسال البلاغ',
      reportSent: 'تم إرسال البلاغ',
      cancel: 'إلغاء',
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
      backHome: 'العودة إلى الر��يسية',
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
