// Verbatim from the solution doc §4.2 — do not edit the wording without
// updating the source document too. This drives the Safety Screen below.
export const RED_FLAG_QUESTIONS = [
  { id: 'fall_injury', text: 'Recent fall or significant leg injury?', purpose: 'Excludes acute trauma' },
  { id: 'hot_swollen', text: 'Joint hot, red, or significantly swollen right now?', purpose: 'Excludes inflammatory/septic arthritis' },
  { id: 'neuro', text: "Known neurological condition (stroke, Parkinson's, neuropathy)?", purpose: 'Excludes neurological gait causes' },
  { id: 'recent_surgery', text: 'Knee/hip surgery in the past 6 months?', purpose: 'Excludes post-surgical recovery gait' },
  { id: 'cannot_bear_weight', text: 'Completely unable to bear weight?', purpose: 'Excludes acute pathology' },
  { id: 'sudden_onset', text: 'Pain started suddenly within the past 48 hours?', purpose: 'Excludes acute injury/gout flare' },
];