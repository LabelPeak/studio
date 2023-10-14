import en_US from "./en_US";
import zh_CN from "./zh_CN";

function loadLocale(lang: string) {
  let locale: string | null = null;
  let messages: Record<string, string> | null = null;
  switch (lang) {
  case "en-US":
    locale = "en-US";
    messages = en_US;
    break;
  case "zh-CN":
    locale = "zh-CN";
    messages = zh_CN;
    break;
  default:
    locale = "zh-CN";
    messages = zh_CN;
    break;
  }

  return { locale, messages };
}

export {
  loadLocale
};