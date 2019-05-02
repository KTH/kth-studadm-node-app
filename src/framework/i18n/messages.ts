export const messages = {
    tilltopp: {
      sv: 'Till sidans topp',
      en: 'Back to top'
    },
    breadcrumb: {
        sv: 'Brödsmulor - navigation uppåt i innehållsstrukturen',
        en: 'Breadcrumbs - navigation upwards in content structure'
    }
}

export type MessageKey = keyof typeof messages

export type Language = 'sv' | 'en'

export function getMessage (key: MessageKey, lang: Language): string {
  return messages[key] && messages[key][lang]
}

export function getMessagesForLang (lang: Language): { [key: string]: string } {
  const result = {}
  Object.keys(messages).forEach(key => result[key] = messages[key][lang])
  return result
}

export type Translator = (key: MessageKey) => string

export function createTranslator (lang: Language) {
  return (key: MessageKey) => getMessage(key, lang)
}