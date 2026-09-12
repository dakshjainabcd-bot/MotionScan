// WOMAC+ item bank — NER-adapted per Solution Doc §8.1
// Wording lives in the i18n locale files; this file only defines structure
// and which WOMAC subscale (domain) each item belongs to.
// domain: 'pain' | 'stiffness' | 'function'

export const WOMAC_ITEMS = [
  { id: 'pain_walking',      domain: 'pain',       i18nKey: 'womac.items.pain_walking' },
  { id: 'pain_slopes',       domain: 'pain',       i18nKey: 'womac.items.pain_slopes' },
  { id: 'pain_night',        domain: 'pain',       i18nKey: 'womac.items.pain_night' },
  { id: 'stiffness_morning', domain: 'stiffness',  i18nKey: 'womac.items.stiffness_morning' },
  { id: 'stiffness_later',   domain: 'stiffness',  i18nKey: 'womac.items.stiffness_later' },
  { id: 'function_market',   domain: 'function',   i18nKey: 'womac.items.function_market' },
  { id: 'function_transport',domain: 'function',   i18nKey: 'womac.items.function_transport' },
  { id: 'function_squatting',domain: 'function',   i18nKey: 'womac.items.function_squatting' },
];

export const WOMAC_SCALE = [
  { value: 0, emoji: '😀', i18nKey: 'scale.none' },
  { value: 1, emoji: '🙂', i18nKey: 'scale.mild' },
  { value: 2, emoji: '😐', i18nKey: 'scale.moderate' },
  { value: 3, emoji: '😣', i18nKey: 'scale.severe' },
  { value: 4, emoji: '😖', i18nKey: 'scale.extreme' },
];