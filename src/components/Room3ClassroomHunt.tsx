import React, { useState } from 'react';
import { Search, LockOpen, CheckCircle2, MessageCircle, Plus, ArrowRight } from 'lucide-react';
import { CATEGORY_META, ESCAPE_ASSETS, LOCK_DIGITS, ROOM3_CLASSROOM_HOTSPOTS } from '../data/escapeData';
import { ClassroomHotspot, WordCategory } from '../types/escapeRoom';
import { CategoryIcon } from './CategoryBadge';
import { soundFX } from '../utils/sound';

interface Room3ClassroomHuntProps {
  isUnlocked: boolean;
  onUnlock: () => void;
  onGoNext: () => void;
  onAddDiscoveredWord: (word: string, category: WordCategory) => void;
}

export const Room3ClassroomHunt: React.FC<Room3ClassroomHuntProps> = ({
  isUnlocked,
  onUnlock,
  onGoNext,
  onAddDiscoveredWord,
}) => {
  const [foundIds, setFoundIds] = useState<string[]>(
    isUnlocked ? ROOM3_CLASSROOM_HOTSPOTS.slice(0, 6).map((h) => h.id) : []
  );
  const [activeSpot, setActiveSpot] = useState<ClassroomHotspot | null>(null);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [realRoomWords, setRealRoomWords] = useState<Array<{ id: string; word: string; category: WordCategory }>>(
    isUnlocked
      ? [
          { id: 'real-1', word: 'tábla', category: 'object' },
          { id: 'real-2', word: 'padtárs', category: 'person' },
        ]
      : []
  );
  const [newWordInput, setNewWordInput] = useState('');
  const [newWordCat, setNewWordCat] = useState<WordCategory>('object');
  const [imgError, setImgError] = useState(false);

  const requiredSceneFinds = 5;
  const requiredRealWords = 2;

  const checkUnlockCondition = (nextFound: string[], nextReal: typeof realRoomWords) => {
    if (nextFound.length >= requiredSceneFinds && nextReal.length >= requiredRealWords && !isUnlocked) {
      soundFX.playUnlock();
      onUnlock();
      setFeedback({
        type: 'success',
        text: `Kiváló nyomozás! Megtaláltátok a nyomokat a képen és a saját termetekben is. A 3. lakat nyitva, kódszám: ${LOCK_DIGITS.room3}`,
      });
    }
  };

  const handleSpotClick = (spot: ClassroomHotspot) => {
    soundFX.playClick();
    setActiveSpot(spot);
    setFeedback(null);
  };

  const handleClassifySpot = (chosenCategory: WordCategory) => {
    if (!activeSpot) return;
    if (chosenCategory === activeSpot.category) {
      soundFX.playCorrect();
      const nextFound = Array.from(new Set([...foundIds, activeSpot.id]));
      setFoundIds(nextFound);
      onAddDiscoveredWord(activeSpot.word, chosenCategory);
      setFeedback({
        type: 'success',
        text: `Megvan! A „${activeSpot.word}” egy ${CATEGORY_META[chosenCategory].label.toLowerCase()} megnevezése. Mondjatok vele egy mondatot szóban!`,
      });
      checkUnlockCondition(nextFound, realRoomWords);
    } else {
      soundFX.playWrong();
      setFeedback({
        type: 'error',
        text: `Nézd meg jobban a képen! A „${activeSpot.word}” tényleg ${CATEGORY_META[chosenCategory].label.toLowerCase()}?`,
      });
    }
  };

  const handleAddRealRoomWord = (e: React.FormEvent) => {
    e.preventDefault();
    const cleaned = newWordInput.trim();
    if (!cleaned) return;
    soundFX.playCorrect();
    const nextReal = [...realRoomWords, { id: `${Date.now()}`, word: cleaned, category: newWordCat }];
    setRealRoomWords(nextReal);
    onAddDiscoveredWord(cleaned, newWordCat);
    setNewWordInput('');
    checkUnlockCondition(foundIds, nextReal);
  };

  const foundCount = Math.min(foundIds.length, requiredSceneFinds);
  const realCount = Math.min(realRoomWords.length, requiredRealWords);

  return (
    <section className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <p className="text-sm font-medium text-blue-700 mb-1">3. lakat · Páros nyomozás (10 perc)</p>
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight" style={{ textWrap: 'balance' }}>
            Főnévdetektív-nyomozás a teremben
          </h2>
          <p className="text-slate-600 mt-1 max-w-2xl">
            Kattintsatok legalább {requiredSceneFinds} rejtett nyomra a mesebeli osztályteremben, és írjatok be {requiredRealWords} olyan megnevező szót is, amit most láttok a saját tantermetekben!
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          {isUnlocked ? (
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-900 font-semibold text-sm">
              <LockOpen className="w-4 h-4 text-emerald-700" aria-hidden="true" />
              <span>3. lakat nyitva · Kódszám:</span>
              <span className="font-mono-code text-base font-bold">{LOCK_DIGITS.room3}</span>
            </div>
          ) : (
            <div className="text-sm font-medium text-slate-600 font-mono-code">
              Kép: {foundCount}/{requiredSceneFinds} · Terem: {realCount}/{requiredRealWords}
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Interactive Panoramic Scene */}
        <div className="lg:col-span-7 bg-white border border-slate-200 rounded-xl p-4 space-y-3">
          <div className="relative overflow-hidden rounded-lg border border-slate-200 bg-slate-100 aspect-video">
            {!imgError ? (
              <img
                src={ESCAPE_ASSETS.classroomScene}
                alt="Mesebeli 3. osztályos tanterem rejtett megnevező szavakkal"
                referrerPolicy="no-referrer"
                onError={() => setImgError(true)}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-slate-100">
                <Search className="w-10 h-10 text-blue-700 mb-2" aria-hidden="true" />
                <p className="font-display font-bold text-slate-800">Osztálytermi detektívjelenet</p>
              </div>
            )}

            {ROOM3_CLASSROOM_HOTSPOTS.map((spot) => {
              const isFound = foundIds.includes(spot.id);
              const isActive = activeSpot?.id === spot.id;
              return (
                <button
                  key={spot.id}
                  type="button"
                  onClick={() => handleSpotClick(spot)}
                  aria-label={`Nyom vizsgálata: ${spot.cluePrompt}`}
                  style={{ left: `${spot.xPercent}%`, top: `${spot.yPercent}%` }}
                  className={`absolute -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full border-2 flex items-center justify-center shadow-md transition-transform cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white ${
                    isFound
                      ? 'bg-emerald-600 border-white text-white scale-95'
                      : isActive
                      ? 'bg-blue-700 border-white text-white scale-110'
                      : 'bg-white/95 border-blue-700 text-blue-800 hover:scale-110'
                  }`}
                >
                  {isFound ? (
                    <CheckCircle2 className="w-5 h-5" aria-hidden="true" />
                  ) : (
                    <Search className="w-4 h-4" aria-hidden="true" />
                  )}
                </button>
              );
            })}
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-600 px-1">
            <span>Kattints a nagyítókra a képen! Megtalált nyomok: {foundIds.length} / {ROOM3_CLASSROOM_HOTSPOTS.length}</span>
            <div className="flex flex-wrap gap-1.5">
              {ROOM3_CLASSROOM_HOTSPOTS.filter((h) => foundIds.includes(h.id)).map((h) => (
                <span
                  key={h.id}
                  className="px-2 py-0.5 rounded bg-emerald-50 border border-emerald-200 text-emerald-900 font-semibold"
                >
                  {h.word}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Active Clue & Real Classroom Entry */}
        <div className="lg:col-span-5 space-y-5">
          {/* Active Hotspot Card */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-4">
            <h3 className="text-base font-bold text-slate-900">1. feladat: Képes nyomozás</h3>
            {activeSpot ? (
              <div className="space-y-4">
                <div className="p-4 rounded-lg bg-slate-50 border border-slate-200">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <p className="text-xs font-semibold text-slate-500">Megfigyelt nyom</p>
                    <span className="text-xs font-bold text-blue-800">
                      Kérdőszava: {activeSpot.questionWord}
                    </span>
                  </div>
                  <p className="text-2xl font-display font-bold text-slate-900">{activeSpot.word}</p>
                  <p className="text-sm text-slate-600 mt-1">{activeSpot.cluePrompt}</p>
                </div>

                {!foundIds.includes(activeSpot.id) ? (
                  <div className="space-y-2">
                    <p className="text-sm font-semibold text-slate-700">Mit nevez meg ez a szó?</p>
                    <div className="grid grid-cols-2 gap-2.5">
                      {(['person', 'animal', 'object', 'other'] as WordCategory[]).map((cat) => {
                        const meta = CATEGORY_META[cat];
                        return (
                          <button
                            key={cat}
                            type="button"
                            onClick={() => handleClassifySpot(cat)}
                            className="py-2.5 px-3 rounded-lg border border-slate-300 bg-white hover:bg-blue-50 hover:border-blue-500 text-sm font-semibold text-slate-900 inline-flex items-center justify-center gap-2 cursor-pointer"
                          >
                            <CategoryIcon category={cat} className="w-4 h-4 shrink-0" />
                            <span>{meta.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ) : (
                  <div className="p-3.5 rounded-lg bg-amber-50 border border-amber-200 flex items-start gap-2.5">
                    <MessageCircle className="w-4 h-4 text-amber-800 shrink-0 mt-0.5" aria-hidden="true" />
                    <p className="text-sm text-amber-950 font-medium">{activeSpot.oralSentencePrompt}</p>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-sm text-slate-600 py-3">
                Válasszatok ki egy kék nagyító ikont a képen, hogy megvizsgáljátok a benne rejtőző megnevező szót!
              </p>
            )}

            {feedback && (
              <div
                role="status"
                className={`p-3.5 rounded-lg border text-sm font-medium ${
                  feedback.type === 'success'
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                    : 'bg-rose-50 border-rose-200 text-rose-900'
                }`}
              >
                {feedback.text}
              </div>
            )}
          </div>

          {/* Real Classroom Scavenger Hunt */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-3.5">
            <div className="flex items-center justify-between gap-2">
              <h3 className="text-base font-bold text-slate-900">2. feladat: Nézzetek körül a saját termetekben!</h3>
              <span className="font-mono-code text-xs font-bold text-slate-600">
                {realRoomWords.length}/{requiredRealWords}
              </span>
            </div>
            <p className="text-sm text-slate-600">
              Írjatok be legalább 2 olyan megnevező szót, amit most a saját osztálytermetekben láttok (pl. kréta, szivacs, ablak, padtárs).
            </p>

            <form onSubmit={handleAddRealRoomWord} className="space-y-2.5">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newWordInput}
                  onChange={(e) => setNewWordInput(e.target.value)}
                  placeholder="Pl. kréta, tolltartó, osztálytárs..."
                  aria-label="Tantermi megnevező szó"
                  className="flex-1 px-3.5 py-2 rounded-lg border border-slate-300 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
                <select
                  value={newWordCat}
                  onChange={(e) => setNewWordCat(e.target.value as WordCategory)}
                  aria-label="Kategória"
                  className="px-3 py-2 rounded-lg border border-slate-300 bg-white text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
                >
                  <option value="person">Személy</option>
                  <option value="animal">Állat</option>
                  <option value="object">Tárgy</option>
                  <option value="other">Egyéb dolog</option>
                </select>
              </div>
              <button
                type="submit"
                className="w-full py-2.5 px-4 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold inline-flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-4 h-4" aria-hidden="true" />
                <span>Szó feljegyzése a detektívfüzetbe</span>
              </button>
            </form>

            {realRoomWords.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-100">
                {realRoomWords.map((item) => {
                  const meta = CATEGORY_META[item.category];
                  return (
                    <span
                      key={item.id}
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-bold border ${meta.bgClass} ${meta.borderClass} ${meta.textClass}`}
                    >
                      <CategoryIcon category={item.category} className="w-3.5 h-3.5" />
                      <span>{item.word}</span>
                    </span>
                  );
                })}
              </div>
            )}

            {isUnlocked && (
              <button
                type="button"
                onClick={onGoNext}
                className="w-full py-3 px-4 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-sm inline-flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Tovább a 4. lakathoz</span>
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
