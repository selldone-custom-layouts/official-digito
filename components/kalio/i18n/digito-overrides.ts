/*
 * Base keys that Digito says differently (the shared packages call them by
 * their base key, so they cannot take a digito.* key). Digito sells
 * electronics: cards, a cart, categories, one seller.
 */
export const OVERRIDES: Record<string, Record<string, string>> = {
  en: {
    "region.note": "Prices everywhere change at once: cards, filters, cart and checkout.",
  },
  ar: {
    "region.note": "تتغيّر الأسعار في كل مكان دفعة واحدة: البطاقات والفلاتر وسلة التسوق والدفع.",
  },
  hi: {
    "region.note": "कीमतें हर जगह एक साथ बदल जाती हैं: कार्ड, फ़िल्टर, बास्केट और चेकआउट।",
  },
  da: {
    "region.note": "Priserne skifter alle steder på én gang: kort, filtre, kurv og kassen.",
  },
};
