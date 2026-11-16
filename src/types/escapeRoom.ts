export type WordCategory = 'person' | 'animal' | 'object' | 'other';

export type SorterTarget = WordCategory | 'decoy';

export type StageId = 'overview' | 'room1' | 'room2' | 'room3' | 'room4' | 'teacher';

export type QuestionWord = 'Ki?' | 'Mi?';

export interface MagicBagClue {
  id: string;
  riddle: string;
  hint: string;
  options: string[];
  correctWord: string;
  category: WordCategory;
  questionWord: QuestionWord;
  textbookTag: string;
  oralPrompt: string;
}

export interface SortingWordCard {
  id: string;
  word: string;
  target: SorterTarget;
  questionWord?: QuestionWord;
  explanation: string;
}

export interface ClassroomHotspot {
  id: string;
  word: string;
  category: WordCategory;
  questionWord: QuestionWord;
  xPercent: number;
  yPercent: number;
  cluePrompt: string;
  oralSentencePrompt: string;
}

export interface MissingLetterChallenge {
  id: string;
  before: string;
  after: string;
  missing: string;
  choices: string[];
  fullWord: string;
  category: WordCategory;
  clue: string;
}

export interface FlashSpellingChallenge {
  id: string;
  word: string;
  category: WordCategory;
  hint: string;
}

export interface CapitalLetterPair {
  id: string;
  commonWord: string;
  properWord: string;
  prompt: string;
  correctCapital: string;
  explanation: string;
}

export interface CustomCollectedWord {
  id: string;
  word: string;
  category: WordCategory;
  source: string;
}

export interface PadlockState {
  room1: boolean;
  room2: boolean;
  room3: boolean;
  room4: boolean;
  escaped: boolean;
}
