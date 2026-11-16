const MESSAGES = {
  URL_REQUIRED: {
    en: 'A "url" field is required.',
    tr: 'Bir "url" alanı gereklidir.',
  },
  INVALID_URL: {
    en: 'That does not look like a valid URL.',
    tr: 'Bu geçerli bir URL gibi görünmüyor.',
  },
  UNSUPPORTED_PROTOCOL: {
    en: 'Only http:// and https:// URLs are allowed.',
    tr: 'Yalnızca http:// ve https:// adresleri desteklenir.',
  },
  CREDENTIALS_IN_URL: {
    en: 'URLs with embedded credentials are not allowed.',
    tr: 'İçinde kimlik bilgisi bulunan URL adresleri kabul edilmez.',
  },
  BLOCKED_HOST: {
    en: 'This host is not allowed to be audited.',
    tr: 'Bu adres denetlenemez (izin verilmeyen bir host).',
  },
  PRIVATE_IP: {
    en: 'This address points to a private/internal network and cannot be audited.',
    tr: 'Bu adres özel/dahili bir ağı işaret ediyor ve denetlenemez.',
  },
  DNS_FAILED: {
    en: 'Could not resolve this domain name.',
    tr: 'Bu alan adı çözümlenemedi.',
  },
  RESPONSE_TOO_LARGE: {
    en: 'The page was too large to analyze safely.',
    tr: 'Sayfa güvenli bir şekilde analiz edilemeyecek kadar büyük.',
  },
  TIMEOUT: {
    en: 'The website took too long to respond.',
    tr: 'Web sitesi yanıt vermek için çok uzun süre bekletti.',
  },
  TOO_MANY_REDIRECTS: {
    en: 'The website redirected too many times.',
    tr: 'Web sitesi çok fazla yönlendirme yaptı.',
  },
  UNREACHABLE: {
    en: 'This website could not be reached.',
    tr: 'Bu web sitesine ulaşılamadı.',
  },
  BAD_STATUS: {
    en: 'The website responded with HTTP status',
    tr: 'Web sitesi şu HTTP durum koduyla yanıt verdi:',
  },
  RATE_LIMITED_AUDIT: {
    en: 'Too many audit requests. Please try again later.',
    tr: 'Çok fazla denetim isteği gönderildi. Lütfen daha sonra tekrar deneyin.',
  },
  RATE_LIMITED_GENERAL: {
    en: 'Too many requests. Please slow down.',
    tr: 'Çok fazla istek gönderildi. Lütfen yavaşlayın.',
  },
  FIX_FIELDS_REQUIRED: {
    en: '"problem" and "code" fields are required.',
    tr: '"problem" ve "code" alanları gereklidir.',
  },
  FIX_INPUT_TOO_LARGE: {
    en: 'Input is too large.',
    tr: 'Girdi çok büyük.',
  },
  FIX_FAILED: {
    en: 'AI code fix failed.',
    tr: 'AI kod düzeltmesi başarısız oldu.',
  },
};

export function msg(code, lang) {
  const entry = MESSAGES[code];
  if (!entry) return code;
  return lang === 'tr' ? entry.tr : entry.en;
}

export function normalizeLang(value) {
  return value === 'tr' ? 'tr' : 'en';
}
