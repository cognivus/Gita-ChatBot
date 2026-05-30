import { EmotionType, VerseCard } from '../types'

// ── Emotion metadata ────────────────────────────────────────────────────────

export const EMOTION_META: Record<EmotionType, { label: string; color: string; icon: string }> = {
  sadness:    { label: 'Sadness',     color: '#6b8cba', icon: '🌧' },
  fear:       { label: 'Fear',        color: '#c4a05a', icon: '🌪' },
  anxiety:    { label: 'Anxiety',     color: '#a07bc4', icon: '🌀' },
  anger:      { label: 'Anger',       color: '#c4705a', icon: '🔥' },
  confusion:  { label: 'Confusion',   color: '#8ba07b', icon: '🌫' },
  motivation: { label: 'Motivation',  color: '#7bc47b', icon: '🌱' },
  peace:      { label: 'Peace',       color: '#7ba0c4', icon: '🪷' },
  grief:      { label: 'Grief',       color: '#8b7ba0', icon: '🍂' },
  loneliness: { label: 'Loneliness',  color: '#7ba0a0', icon: '🌙' },
  overwhelm:  { label: 'Overwhelm',   color: '#ba8b6b', icon: '🌊' },
  guilt:      { label: 'Guilt',       color: '#a08b7b', icon: '🪨' },
  hope:       { label: 'Hope',        color: '#b8c47b', icon: '🌅' },
  unknown:    { label: 'Seeking',     color: '#8b8ba0', icon: '✨' },
}

// ── Key verses mapped to emotions ───────────────────────────────────────────

export const EMOTION_VERSES: Record<string, VerseCard> = {
  sadness: {
    ref: 'BG 2.14',
    fullRef: 'Chapter 2, Verse 14',
    text: 'The contact between the senses and sense objects gives rise to fleeting perceptions of happiness and distress. These are non-permanent — they come and go like winter and summer. Bear them patiently, O Arjuna.',
    sanskrit: 'mātrā-sparśās tu kaunteya śītoṣṇa-sukha-duḥkha-dāḥ',
    concept: 'Impermanence',
  },
  anxiety: {
    ref: 'BG 2.47',
    fullRef: 'Chapter 2, Verse 47',
    text: 'You have the right to perform your actions, but you are not entitled to the fruits thereof. Never consider yourself the cause of the results, and never be attached to not acting.',
    sanskrit: 'karmaṇy evādhikāras te mā phaleṣu kadācana',
    concept: 'Karma Yoga',
  },
  anger: {
    ref: 'BG 2.62',
    fullRef: 'Chapter 2, Verse 62',
    text: 'While contemplating the objects of the senses, a person develops attachment for them, and from such attachment lust develops, and from lust anger arises.',
    sanskrit: 'dhyāyato viṣayān puṁsaḥ saṅgas teṣūpajāyate',
    concept: 'Equanimity',
  },
  confusion: {
    ref: 'BG 6.5',
    fullRef: 'Chapter 6, Verse 5',
    text: 'Let a man lift himself by his own self alone, and let him not lower himself; for this self alone is the friend of oneself, and this self alone is the enemy of oneself.',
    sanskrit: 'uddhared ātmanātmānaṁ nātmānam avasādayet',
    concept: 'Self-Mastery',
  },
  loneliness: {
    ref: 'BG 9.22',
    fullRef: 'Chapter 9, Verse 22',
    text: 'For those who worship Me with devotion, meditating on My transcendental form, I carry what they lack and preserve what they have.',
    sanskrit: 'ananyāś cintayanto māṁ ye janāḥ paryupāsate',
    concept: 'Bhakti Yoga',
  },
  fear: {
    ref: 'BG 2.19',
    fullRef: 'Chapter 2, Verse 19',
    text: 'One who thinks that this self is a slayer and one who thinks that this self is slain — both fail to perceive the truth. This self neither slays, nor is it slain.',
    sanskrit: 'ya enaṁ vetti hantāraṁ yaś cainaṁ manyate hatam',
    concept: 'Eternal Self',
  },
  guilt: {
    ref: 'BG 18.66',
    fullRef: 'Chapter 18, Verse 66',
    text: 'Abandon all varieties of dharmas and simply surrender unto Me alone. I shall liberate you from all sinful reactions; do not fear.',
    sanskrit: 'sarva-dharmān parityajya mām ekaṁ śaraṇaṁ vraja',
    concept: 'Surrender',
  },
  motivation: {
    ref: 'BG 3.21',
    fullRef: 'Chapter 3, Verse 21',
    text: 'Whatever a great person does, ordinary people follow. Whatever standard such a person sets, all the world pursues.',
    sanskrit: 'yad yad ācarati śreṣṭhas tat tad evetaro janaḥ',
    concept: 'Dharma',
  },
  grief: {
    ref: 'BG 2.20',
    fullRef: 'Chapter 2, Verse 20',
    text: 'For the soul there is never birth nor death at any time. It has not come into being, does not come into being, and will not come into being. It is unborn, eternal, ever-existing, and primeval.',
    sanskrit: 'na jāyate mriyate vā kadācin',
    concept: 'Eternal Soul',
  },
  overwhelm: {
    ref: 'BG 6.17',
    fullRef: 'Chapter 6, Verse 17',
    text: 'He who is regulated in his habits of eating, sleeping, recreation, and work can mitigate all material pains by practicing the yoga system.',
    concept: 'Discipline & Balance',
  },
  peace: {
    ref: 'BG 5.29',
    fullRef: 'Chapter 5, Verse 29',
    text: 'A person in full consciousness of Me, knowing Me to be the ultimate beneficiary of all sacrifices and austerities, the Supreme Lord of all planets and demigods, and the benefactor and well-wisher of all living entities, attains peace from the pangs of material miseries.',
    concept: 'Inner Peace',
  },
  hope: {
    ref: 'BG 4.7',
    fullRef: 'Chapter 4, Verse 7',
    text: 'Whenever and wherever there is a decline in dharma, O Arjuna, and a predominant rise of irreligion — at that time I manifest myself.',
    concept: 'Divine Renewal',
  },
  unknown: {
    ref: 'BG 18.61',
    fullRef: 'Chapter 18, Verse 61',
    text: 'The Supreme Lord is situated in everyone\'s heart, O Arjuna, and is directing the wanderings of all living entities, who are seated as on a machine, made of the material energy.',
    concept: 'Inner Guidance',
  },
}

// ── Starter prompts ─────────────────────────────────────────────────────────

export const STARTER_PROMPTS = [
  { text: 'I feel sad and lost in life.',              emotion: 'sadness' as EmotionType },
  { text: "I'm anxious about my career future.",        emotion: 'anxiety' as EmotionType },
  { text: "I can't stop feeling angry at someone.",     emotion: 'anger'   as EmotionType },
  { text: "I don't know my purpose in life.",           emotion: 'confusion' as EmotionType },
  { text: 'I feel completely alone.',                   emotion: 'loneliness' as EmotionType },
  { text: "I'm afraid of failing.",                     emotion: 'fear'    as EmotionType },
]

// ── Agent pipeline steps ────────────────────────────────────────────────────

export const AGENT_STEPS = [
  { key: 'emotion_detection',   name: 'Emotion Detection',   icon: '🧠' },
  { key: 'intent_understanding',name: 'Intent Understanding', icon: '🎯' },
  { key: 'verse_retrieval',     name: 'GraphRAG Retrieval',  icon: '📖' },
  { key: 'wisdom_synthesis',    name: 'Wisdom Synthesis',    icon: '✨' },
  { key: 'krishna_persona',     name: 'Krishna Persona',     icon: '🕉' },
  { key: 'safety_check',        name: 'Safety Review',       icon: '🛡' },
  { key: 'response_assembly',   name: 'Assembly',            icon: '⚡' },
]
