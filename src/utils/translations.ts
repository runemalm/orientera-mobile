
import { CompetitionType, Discipline } from "../types";

// Define available languages
export type SupportedLanguage = 'en' | 'sv';

// Define translation categories
export type TranslationCategory = 'discipline' | 'competitionType';

// Translation dictionary for all supported languages and categories
const translations: Record<TranslationCategory, Record<string, Record<SupportedLanguage, string>>> = {
  discipline: {
    [Discipline.Sprint]: {
      en: 'Sprint',
      sv: 'Sprint'
    },
    [Discipline.Middle]: {
      en: 'Middle',
      sv: 'Medel'
    },
    [Discipline.Long]: {
      en: 'Long',
      sv: 'Lång'
    },
    [Discipline.Night]: {
      en: 'Night',
      sv: 'Natt'
    },
    [Discipline.Relay]: {
      en: 'Relay',
      sv: 'Stafett'
    },
    [Discipline.UltraLong]: {
      en: 'Ultra Long',
      sv: 'Ultralång'
    },
    [Discipline.PreO]: {
      en: 'PreO',
      sv: 'PreO'
    },
    [Discipline.TempO]: {
      en: 'TempO',
      sv: 'TempO'
    }
  },
  competitionType: {
    [CompetitionType.Championship]: {
      en: 'Championship',
      sv: 'Mästerskap'
    },
    [CompetitionType.National]: {
      en: 'National',
      sv: 'Nationell tävling'
    },
    [CompetitionType.Regional]: {
      en: 'Regional',
      sv: 'Regional tävling'
    },
    [CompetitionType.Near]: {
      en: 'Near',
      sv: 'Närtävling'
    },
    [CompetitionType.Club]: {
      en: 'Club',
      sv: 'Klubbtävling'
    },
    [CompetitionType.Weekly]: {
      en: 'Weekly',
      sv: 'Veckotävling'
    }
  }
};

// Default language if not specified
const DEFAULT_LANGUAGE: SupportedLanguage = 'sv';

/**
 * Translates a value from a specific category to the requested language
 * 
 * @param category The translation category (discipline, competitionType, etc.)
 * @param value The value to translate
 * @param language Target language code (defaults to Swedish)
 * @returns Translated string or the original value if translation not found
 */
export const translate = (
  category: TranslationCategory,
  value: string,
  language: SupportedLanguage = DEFAULT_LANGUAGE
): string => {
  // Check if category exists
  if (!translations[category]) {
    console.warn(`Translation category '${category}' not found`);
    return value;
  }
  
  // Check if value exists in category
  if (!translations[category][value]) {
    console.warn(`No translation found for '${value}' in category '${category}'`);
    return value;
  }
  
  // Return the translation or fall back to the value if language not supported
  return translations[category][value][language] || value;
};

/**
 * Helper function to translate discipline values
 */
export const translateDiscipline = (
  discipline: string,
  language: SupportedLanguage = DEFAULT_LANGUAGE
): string => {
  return translate('discipline', discipline, language);
};

/**
 * Helper function to translate competition type values
 */
export const translateCompetitionType = (
  competitionType: string,
  language: SupportedLanguage = DEFAULT_LANGUAGE
): string => {
  return translate('competitionType', competitionType, language);
};
