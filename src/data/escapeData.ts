import {
  CapitalLetterPair,
  ClassroomHotspot,
  FlashSpellingChallenge,
  MagicBagClue,
  MissingLetterChallenge,
  SortingWordCard,
  WordCategory,
} from '../types/escapeRoom';

export const ESCAPE_ASSETS = {
  vaultDoor: '/src/assets/images/escape_vault_door_1794827442531.jpg',
  magicBag: '/src/assets/images/magic_bag_hero_1794827396371.jpg',
  detectiveNotebook: '/src/assets/images/detective_notebook_badge_1794827397463.jpg',
  classroomScene: '/src/assets/images/classroom_detective_scene_1794827398579.jpg',
} as const;

export const TEXTBOOK_SOURCE =
  'Fülöp Mária – Szilágyi Katalin: Nyelvtan és helyesírás 3. (OH-MNY03TB)';

export const LOCK_DIGITS = {
  room1: '4',
  room2: '7',
  room3: '2',
  room4: '9',
} as const;

export const MASTER_CODE = '4729';

export const CATEGORY_META: Record<
  WordCategory,
  {
    label: string;
    shortLabel: string;
    textbookGroup: string;
    questionHint: string;
    description: string;
    examples: string;
    bgClass: string;
    borderClass: string;
    textClass: string;
    accentBgClass: string;
  }
> = {
  person: {
    label: 'Személy',
    shortLabel: 'Személyek',
    textbookGroup: 'Élőlény (ember)',
    questionHint: 'Kérdése: Ki?',
    description: 'Emberek, családtagok, foglalkozások nevei (Ki?)',
    examples: 'pl. pék, nagymama, tanító néni, orvos',
    bgClass: 'bg-blue-50',
    borderClass: 'border-blue-300',
    textClass: 'text-blue-900',
    accentBgClass: 'bg-blue-600',
  },
  animal: {
    label: 'Állat',
    shortLabel: 'Állatok',
    textbookGroup: 'Élőlény (állat)',
    questionHint: 'Kérdése: Mi? (mesében Ki?)',
    description: 'Kis és nagy állatok az erdőben, ház körül (Mi?)',
    examples: 'pl. sündisznó, denevér, róka, bagoly',
    bgClass: 'bg-emerald-50',
    borderClass: 'border-emerald-300',
    textClass: 'text-emerald-900',
    accentBgClass: 'bg-emerald-600',
  },
  object: {
    label: 'Tárgy',
    shortLabel: 'Tárgyak',
    textbookGroup: 'Élettelen tárgy',
    questionHint: 'Kérdése: Mi?',
    description: 'Kézzel fogható élettelen tárgyak, eszközök (Mi?)',
    examples: 'pl. kesztyű, kabát, füzet, földgömb',
    bgClass: 'bg-amber-50',
    borderClass: 'border-amber-300',
    textClass: 'text-amber-900',
    accentBgClass: 'bg-amber-600',
  },
  other: {
    label: 'Egyéb dolog',
    shortLabel: 'Egyéb dolgok',
    textbookGroup: 'Növény és gondolati dolog',
    questionHint: 'Kérdése: Mi?',
    description: 'Növények, természeti jelenségek, gondolati dolgok (Mi?)',
    examples: 'pl. tulipán, tél, öröm, szeretet, szivárvány',
    bgClass: 'bg-indigo-50',
    borderClass: 'border-indigo-300',
    textClass: 'text-indigo-900',
    accentBgClass: 'bg-indigo-600',
  },
};

export const ROOM1_MAGIC_BAG_CLUES: MagicBagClue[] = [
  {
    id: 'bag-1',
    riddle: 'Hajnalban kel, lisztes a köténye, ropogós kenyeret és meleg kiflit süt mindenkinek. Kit nevezünk meg így?',
    hint: 'Egy finom péksüteményeket készítő ember – a „Ki?” kérdésre felel.',
    options: ['pék', 'süt', 'illatos'],
    correctWord: 'pék',
    category: 'person',
    questionWord: 'Ki?',
    textbookTag: 'Élőlény · ember neve',
    oralPrompt: 'Mondjatok a párotokkal egy teljes mondatot, amiben szerepel a „pék” szó!',
  },
  {
    id: 'bag-2',
    riddle: 'Tüskés ruhája védi az erdőben, ősszel avar alá bújik aludni, és szívesen eszik rovarokat. Mi a neve?',
    hint: 'Apró erdei állat – a tankönyvben is találkozunk vele!',
    options: ['szúr', 'sün', 'álmos'],
    correctWord: 'sün',
    category: 'animal',
    questionWord: 'Mi?',
    textbookTag: 'Élőlény · állat neve',
    oralPrompt: 'Találjatok ki egy rövid kérdést vagy mondatot a „sün” szóval!',
  },
  {
    id: 'bag-3',
    riddle: 'Melegen tartja az ujjaidat a téli hidegben, gyakran gyapjúból kötik. Mi a neve?',
    hint: 'Öt ujja van, vagy egyujjas, és tárgy!',
    options: ['meleg', 'kesztyű', 'fázik'],
    correctWord: 'kesztyű',
    category: 'object',
    questionWord: 'Mi?',
    textbookTag: 'Élettelen tárgy neve',
    oralPrompt: 'Milyen színű vagy anyagú lehet egy „kesztyű”? Mondjatok vele egy mondatot!',
  },
  {
    id: 'bag-4',
    riddle: 'Nem tudjuk kézbe venni és nem látszik a zsebünkben, mégis megtölti a szívünket, amikor valaki kedves velünk. Mi ez?',
    hint: 'A tankönyv ezt gondolati dolognak nevezi – a szívedben érzed!',
    options: ['vidáman', 'öröm', 'mosolyog'],
    correctWord: 'öröm',
    category: 'other',
    questionWord: 'Mi?',
    textbookTag: 'Gondolati dolog neve',
    oralPrompt: 'Mi okozott nektek ma „örömöt”? Meséljétek el egy mondatban a párotoknak!',
  },
];

export const ROOM2_SORTING_WORDS: SortingWordCard[] = [
  {
    id: 'sort-1',
    word: 'nagymama',
    target: 'person',
    questionWord: 'Ki?',
    explanation: 'Helyes! A „nagymama” egy élőlényt, azon belül egy személyt nevez meg (Ki?).',
  },
  {
    id: 'sort-2',
    word: 'denevér',
    target: 'animal',
    questionWord: 'Mi?',
    explanation: 'Talált! A „denevér” egy éjszaka repülő állatot nevez meg (Mi?).',
  },
  {
    id: 'sort-3',
    word: 'szalad',
    target: 'decoy',
    explanation: 'Ügyes megfigyelés! A „szalad” nem nevez meg senkit vagy semmit – azt mondja meg, mit csinál valaki.',
  },
  {
    id: 'sort-4',
    word: 'kabát',
    target: 'object',
    questionWord: 'Mi?',
    explanation: 'Pontosan! A „kabát” egy kézzel fogható élettelen tárgy (Mi?).',
  },
  {
    id: 'sort-5',
    word: 'tél',
    target: 'other',
    questionWord: 'Mi?',
    explanation: 'Nagyszerű! A „tél” egy évszakot, gondolati dolgot nevez meg (Mi?).',
  },
  {
    id: 'sort-6',
    word: 'vidám',
    target: 'decoy',
    explanation: 'Kiváló! A „vidám” egy tulajdonság (milyen valaki?), nem pedig megnevező szó.',
  },
  {
    id: 'sort-7',
    word: 'orvos',
    target: 'person',
    questionWord: 'Ki?',
    explanation: 'Így van! Az „orvos” egy gyógyító személyt nevez meg (Ki?).',
  },
  {
    id: 'sort-8',
    word: 'medve',
    target: 'animal',
    questionWord: 'Mi?',
    explanation: 'Szuper! A „medve” az erdő egyik nagy testű állata (Mi?).',
  },
  {
    id: 'sort-9',
    word: 'csillog',
    target: 'decoy',
    explanation: 'Bizony! A „csillog” egy történés vagy cselekvés, nem név.',
  },
  {
    id: 'sort-10',
    word: 'füzet',
    target: 'object',
    questionWord: 'Mi?',
    explanation: 'Remek! A „füzet” az iskolatáskánk egyik fontos élettelen tárgya (Mi?).',
  },
  {
    id: 'sort-11',
    word: 'szeretet',
    target: 'other',
    questionWord: 'Mi?',
    explanation: 'Ügyes vagy! A „szeretet” egy gondolati dolog – nem fogható meg kézzel, mégis van neve (Mi?).',
  },
  {
    id: 'sort-12',
    word: 'kék',
    target: 'decoy',
    explanation: 'Helyes! A „kék” egy színt, tulajdonságot fejez ki, nem nevez meg önmagában élőlényt vagy tárgyat.',
  },
];

export const ROOM3_CLASSROOM_HOTSPOTS: ClassroomHotspot[] = [
  {
    id: 'spot-teacher',
    word: 'tanító néni',
    category: 'person',
    questionWord: 'Ki?',
    xPercent: 24,
    yPercent: 44,
    cluePrompt: 'A tábla előtt áll, és mosolyogva segít a felfedezésben.',
    oralSentencePrompt: 'Mondj egy kedves mondatot a „tanító néni” szóval!',
  },
  {
    id: 'spot-girl',
    word: 'kislány',
    category: 'person',
    questionWord: 'Ki?',
    xPercent: 47,
    yPercent: 56,
    cluePrompt: 'Copfos diák, aki kíváncsian olvas a padban.',
    oralSentencePrompt: 'Mit olvas vajon a „kislány”? Mondd el egy mondatban!',
  },
  {
    id: 'spot-boy',
    word: 'kisfiú',
    category: 'person',
    questionWord: 'Ki?',
    xPercent: 60,
    yPercent: 53,
    cluePrompt: 'Sárga pulóveres tanuló, aki épp a földgömböt forgatja.',
    oralSentencePrompt: 'Melyik országot keresheti a „kisfiú”? Mondd el szóban!',
  },
  {
    id: 'spot-globe',
    word: 'földgömb',
    category: 'object',
    questionWord: 'Mi?',
    xPercent: 68,
    yPercent: 58,
    cluePrompt: 'Kerek modell az asztalon, amin kontinensek és óceánok láthatók.',
    oralSentencePrompt: 'Mondj egy mondatot arról, mire jó a „földgömb”!',
  },
  {
    id: 'spot-book',
    word: 'könyv',
    category: 'object',
    questionWord: 'Mi?',
    xPercent: 46,
    yPercent: 72,
    cluePrompt: 'Nyitva fekszik az asztalon, tele történetekkel.',
    oralSentencePrompt: 'Milyen a kedvenc „könyved”? Mesélj róla röviden a párodnak!',
  },
  {
    id: 'spot-bag',
    word: 'iskolatáska',
    category: 'object',
    questionWord: 'Mi?',
    xPercent: 60,
    yPercent: 78,
    cluePrompt: 'Csillagos, színes hátizsák az asztal szélén.',
    oralSentencePrompt: 'Mi van ma az „iskolatáskádban”? Sorolj fel belőle két tárgyat!',
  },
  {
    id: 'spot-cat',
    word: 'cica',
    category: 'animal',
    questionWord: 'Mi?',
    xPercent: 84,
    yPercent: 55,
    cluePrompt: 'Vörös bundás kis vendég ül az ablakpárkányon.',
    oralSentencePrompt: 'Mit figyel az ablakból a „cica”? Alkoss vele egy mondatot!',
  },
  {
    id: 'spot-rain',
    word: 'eső',
    category: 'other',
    questionWord: 'Mi?',
    xPercent: 91,
    yPercent: 31,
    cluePrompt: 'Cseppekben hullik az ablakon túl.',
    oralSentencePrompt: 'Szereted-e, amikor esik az „eső”? Mondd el egy mondatban!',
  },
  {
    id: 'spot-tree',
    word: 'fa',
    category: 'other',
    questionWord: 'Mi?',
    xPercent: 94,
    yPercent: 45,
    cluePrompt: 'Lombos ágai az iskola udvarán magasodnak (élőlény – növény).',
    oralSentencePrompt: 'Milyen évszak látszik a „fa” levelein? Mondd el szóban!',
  },
];

export const ROOM4_MISSING_LETTERS: MissingLetterChallenge[] = [
  {
    id: 'miss-1',
    before: 'pi',
    after: 'angó',
    missing: 'll',
    choices: ['l', 'll', 'ly'],
    fullWord: 'pillangó',
    category: 'animal',
    clue: 'Színes szárnyú élőlény, amelyik virágról virágra száll.',
  },
  {
    id: 'miss-2',
    before: 'keszt',
    after: 'ű',
    missing: 'y',
    choices: ['j', 'y', 'ly'],
    fullWord: 'kesztyű',
    category: 'object',
    clue: 'A kezünket melegítő téli tárgy – figyelj a ty betűre!',
  },
  {
    id: 'miss-3',
    before: 'bago',
    after: '',
    missing: 'ly',
    choices: ['j', 'ly', 'll'],
    fullWord: 'bagoly',
    category: 'animal',
    clue: 'Éjszaka vadászó, nagy szemű bölcs madár.',
  },
  {
    id: 'miss-4',
    before: 't',
    after: 'lipán',
    missing: 'u',
    choices: ['u', 'ú', 'ü'],
    fullWord: 'tulipán',
    category: 'other',
    clue: 'Tavaszi kerti virág – növény neve.',
  },
  {
    id: 'miss-5',
    before: 'felh',
    after: '',
    missing: 'ő',
    choices: ['ö', 'ő', 'ó'],
    fullWord: 'felhő',
    category: 'other',
    clue: 'Puha, fehér vagy szürke párapamacs magasan az égen.',
  },
];

export const ROOM4_FLASH_WORDS: FlashSpellingChallenge[] = [
  {
    id: 'flash-1',
    word: 'földgömb',
    category: 'object',
    hint: 'Figyelj az ö betűkre és a d-g találkozására!',
  },
  {
    id: 'flash-2',
    word: 'sündisznó',
    category: 'animal',
    hint: 'Összetett állatnév: rövid ü, majd sz és hosszú ó a végén!',
  },
  {
    id: 'flash-3',
    word: 'szeretet',
    category: 'other',
    hint: 'Gondolati dolog: sz-szel kezdődik, minden magánhangzója rövid e!',
  },
];

export const ROOM4_CAPITAL_PAIRS: CapitalLetterPair[] = [
  {
    id: 'cap-1',
    commonWord: 'kutya',
    properWord: 'Bodri',
    prompt: 'Melyik a saját, külön név (nagy kezdőbetűs) e kettő közül?',
    correctCapital: 'Bodri',
    explanation: 'A „kutya” sok állat közös neve (kisbetűs), a „Bodri” viszont egy bizonyos kutya saját neve, ezért nagy kezdőbetűvel írjuk!',
  },
  {
    id: 'cap-2',
    commonWord: 'kislány',
    properWord: 'Zsófi',
    prompt: 'Melyiket írjuk mondat közben is nagy kezdőbetűvel?',
    correctCapital: 'Zsófi',
    explanation: 'A „kislány” közös név (kisbetűs), míg a „Zsófi” személy saját neve, így mindig nagy kezdőbetűs!',
  },
];

export const DEFAULT_STUDENTS_28: string[] = [
  'Anna', 'Bence', 'Csenge', 'Dávid', 'Emma', 'Ferenc', 'Gréta',
  'Hanna', 'István', 'Jázmin', 'Kende', 'Lili', 'Máté', 'Nóra',
  'Olivér', 'Petra', 'Ádám', 'Boglárka', 'Csaba', 'Dóra', 'Erik',
  'Fanni', 'Gergő', 'Izabella', 'János', 'Kata', 'Levente', 'Zsófi',
];

export const LESSON_PHASES = [
  {
    phase: '1. Ráhangolódás & Varázszsák',
    duration: '8 perc',
    workform: 'Frontális és páros beszélgetés',
    goal: 'A Fülöp–Szilágyi 3. tankönyv szellemében tapasztalják meg a Ki? / Mi? kérdésre felelő megnevező szavakat (élőlény, tárgy, gondolati dolog).',
  },
  {
    phase: '2. Szóválogató műhely',
    duration: '12 perc',
    workform: '7 kis csoport (4 fő / csoport)',
    goal: 'Csoportosítsák a szavakat (személy, állat, tárgy, egyéb/gondolati dolog), és válasszák külön a kakukktojásokat (cselekvés, tulajdonság).',
  },
  {
    phase: '3. Főnévdetektív-nyomozás',
    duration: '10 perc',
    workform: '14 pár (páros munka)',
    goal: 'Keressenek a képes és a valós tanteremben Ki? és Mi? kérdésre felelő szavakat, majd alkossanak velük szóban mondatokat.',
  },
  {
    phase: '4. Pontos leírás és helyesírás',
    duration: '10 perc',
    workform: 'Egyéni / páros ellenőrzés',
    goal: 'Gyakorolják a tankönyvi szavak (kesztyű, sündisznó, bagoly, szeretet) helyesírását, valamint a közös és saját nevek kezdőbetűjét.',
  },
  {
    phase: '5. Szökés és összegzés',
    duration: '5 perc',
    workform: 'Közös osztályzárás (28 tanuló)',
    goal: 'A 4 kódjeggyel nyissák ki a Titkos Könyvtár ajtaját! Közös felismerés: „A szavaknak nevet adó erejük van!”',
  },
];
