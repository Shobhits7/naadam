export const NOTE_NAMES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

export const SARGAM_MAP: Record<number, string> = {
  0: 'Sa', 1: 're', 2: 'Re', 3: 'ga', 4: 'Ga',
  5: 'Ma', 6: 'ma\'', 7: 'Pa', 8: 'dha', 9: 'Dha',
  10: 'ni', 11: 'Ni',
};

// Key-to-MIDI mapping (relative, Sa = 60)
export const KEY_MAP: Record<string, number> = {
  'tab': 55, '1': 56, 'q': 57, '2': 58, 'w': 59,
  'e': 60, '4': 61, 'r': 62, '5': 63, 't': 64,
  'y': 65, '7': 66, 'u': 67, '8': 68, 'i': 69,
  '9': 70, 'o': 71, 'p': 72, '-': 73, '[': 74,
  '=': 75, ']': 76,
};

// Keyboard layout for rendering
export interface KeyDef {
  midi: number;
  sargam: string;
  shortcut: string;
  isBlack: boolean;
}

export const KEYBOARD_LAYOUT: KeyDef[] = [
  { midi: 55, sargam: '', shortcut: 'Tab', isBlack: false },
  { midi: 56, sargam: '', shortcut: '1', isBlack: true },
  { midi: 57, sargam: '', shortcut: 'Q', isBlack: false },
  { midi: 58, sargam: '', shortcut: '2', isBlack: true },
  { midi: 59, sargam: '', shortcut: 'W', isBlack: false },
  { midi: 60, sargam: 'Sa', shortcut: 'E', isBlack: false },
  { midi: 61, sargam: '', shortcut: '4', isBlack: true },
  { midi: 62, sargam: 'Re', shortcut: 'R', isBlack: false },
  { midi: 63, sargam: '', shortcut: '5', isBlack: true },
  { midi: 64, sargam: 'Ga', shortcut: 'T', isBlack: false },
  { midi: 65, sargam: 'Ma', shortcut: 'Y', isBlack: false },
  { midi: 66, sargam: '', shortcut: '7', isBlack: true },
  { midi: 67, sargam: 'Pa', shortcut: 'U', isBlack: false },
  { midi: 68, sargam: '', shortcut: '8', isBlack: true },
  { midi: 69, sargam: 'Dha', shortcut: 'I', isBlack: false },
  { midi: 70, sargam: '', shortcut: '9', isBlack: true },
  { midi: 71, sargam: 'Ni', shortcut: 'O', isBlack: false },
  { midi: 72, sargam: '', shortcut: 'P', isBlack: false },
  { midi: 73, sargam: '', shortcut: '-', isBlack: true },
  { midi: 74, sargam: '', shortcut: '[', isBlack: false },
  { midi: 75, sargam: '', shortcut: '=', isBlack: true },
  { midi: 76, sargam: '', shortcut: ']', isBlack: false },
];

export function getRootNote(transpose: number): string {
  const idx = ((transpose % 12) + 12) % 12;
  return NOTE_NAMES[idx];
}

// Raga definitions (intervals from Sa)
export const RAGAS: Record<string, { name: string; notes: number[] }> = {
  yaman: { name: 'Yaman', notes: [0, 2, 4, 6, 7, 9, 11] },
  bhairav: { name: 'Bhairav', notes: [0, 1, 4, 5, 7, 8, 11] },
  bhairavi: { name: 'Bhairavi', notes: [0, 1, 3, 5, 7, 8, 10] },
  kalyan: { name: 'Kalyan', notes: [0, 2, 4, 6, 7, 9, 11] },
  kafi: { name: 'Kafi', notes: [0, 2, 3, 5, 7, 9, 10] },
  bilawal: { name: 'Bilawal', notes: [0, 2, 4, 5, 7, 9, 11] },
  khamaj: { name: 'Khamaj', notes: [0, 2, 4, 5, 7, 9, 10] },
  asavari: { name: 'Asavari', notes: [0, 2, 3, 5, 7, 8, 10] },
  todi: { name: 'Todi', notes: [0, 1, 3, 6, 7, 8, 11] },
  marwa: { name: 'Marwa', notes: [0, 1, 4, 6, 7, 9, 11] },
};

export const TAAL_PRESETS: Record<string, { name: string; beats: number; pattern: boolean[] }> = {
  teentaal: { name: 'Teentaal', beats: 16, pattern: [true, false, false, false, false, false, false, false, true, false, false, false, true, false, false, false] },
  keherwa: { name: 'Keherwa', beats: 8, pattern: [true, false, false, false, true, false, false, false] },
  jhaptaal: { name: 'Jhaptaal', beats: 10, pattern: [true, false, false, true, false, true, false, false, true, false] },
  rupak: { name: 'Rupak', beats: 7, pattern: [true, false, false, true, false, true, false] },
  dadra: { name: 'Dadra', beats: 6, pattern: [true, false, false, true, false, false] },
};

export const ALANKAR_PATTERNS: Record<string, { name: string; pattern: number[] }> = {
  ascending: { name: 'Aroha (Ascending)', pattern: [0, 2, 4, 5, 7, 9, 11, 12] },
  descending: { name: 'Avroha (Descending)', pattern: [12, 11, 9, 7, 5, 4, 2, 0] },
  zigzag: { name: 'Zig-Zag', pattern: [0, 2, 2, 4, 4, 5, 5, 7, 7, 9, 9, 11, 11, 12] },
  srgm: { name: 'Sa Re Ga Ma', pattern: [0, 2, 4, 5, 2, 4, 5, 7, 4, 5, 7, 9, 5, 7, 9, 11, 7, 9, 11, 12] },
};
