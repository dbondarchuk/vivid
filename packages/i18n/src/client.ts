// "use client";

// import i18next from "i18next";
// import resourcesToBackend from "i18next-resources-to-backend";
// import { useEffect, useState } from "react";
// import {
//   initReactI18next,
//   useTranslation as useTranslationOrg,
// } from "react-i18next";
// import { fallbackLanguage, getOptions, languages } from "./settings";

// const runsOnServerSide = typeof window === "undefined";

// //
// i18next
//   .use(initReactI18next)
//   .use(
//     resourcesToBackend(
//       (language: string, namespace: string) =>
//         import(`./locales/${language}/${namespace}.json`)
//     )
//   )
//   .init({
//     ...getOptions(),
//     lng: undefined, // let detect the language on client side
//     detection: {
//       order: ["htmlTag"],
//     },
//     preload: runsOnServerSide ? languages : [],
//   });

// export function useTranslation(
//   language?: string,
//   namespace?: string,
//   options?: { keyPrefix?: string }
// ) {
//   if (!language) {
//     language = fallbackLanguage;
//   }

//   const ret = useTranslationOrg(namespace, options);
//   const { i18n } = ret;
//   if (runsOnServerSide && language && i18n.resolvedLanguage !== language) {
//     i18n.changeLanguage(language);
//   } else {
//     // eslint-disable-next-line react-hooks/rules-of-hooks
//     const [activeLng, setActiveLng] = useState(i18n.resolvedLanguage);
//     // eslint-disable-next-line react-hooks/rules-of-hooks
//     useEffect(() => {
//       if (activeLng === i18n.resolvedLanguage) return;
//       setActiveLng(i18n.resolvedLanguage);
//     }, [activeLng, i18n.resolvedLanguage]);
//     // eslint-disable-next-line react-hooks/rules-of-hooks
//     useEffect(() => {
//       if (!language || i18n.resolvedLanguage === language) return;
//       i18n.changeLanguage(language);
//     }, [language, i18n]);
//   }
//   return ret;
// }
