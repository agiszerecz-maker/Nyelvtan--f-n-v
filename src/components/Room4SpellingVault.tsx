import React, { useEffect, useState } from 'react';
import { CheckCircle2, Eye, LockOpen, PenTool, ArrowRight } from 'lucide-react';
import {
  LOCK_DIGITS,
  ROOM4_CAPITAL_PAIRS,
  ROOM4_FLASH_WORDS,
  ROOM4_MISSING_LETTERS,
} from '../data/escapeData';
import { WordCategory } from '../types/escapeRoom';
import { CategoryLabel } from './CategoryBadge';
import { soundFX } from '../utils/sound';

interface Room4SpellingVaultProps {
  isUnlocked: boolean;
  onUnlock: () => void;
  onGoEscapeDoor: () => void;
  onAddDiscoveredWord: (word: string, category: WordCategory) => void;
}

export const Room4SpellingVault: React.FC<Room4SpellingVaultProps> = ({
  isUnlocked,
  onUnlock,
  onGoEscapeDoor,
  onAddDiscoveredWord,
}) => {
  // Part A: Missing letters
  const [missingSolvedIds, setMissingSolvedIds] = useState<string[]>(
    isUnlocked ? ROOM4_MISSING_LETTERS.map((m) => m.id) : []
  );
  const [partAFeedback, setPartAFeedback] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Part B: Flash spelling
  const [flashIdx, setFlashIdx] = useState<number>(0);
  const [flashSolvedIds, setFlashSolvedIds] = useState<string[]>(
    isUnlocked ? ROOM4_FLASH_WORDS.map((f) => f.id) : []
  );
  const [flashPhase, setFlashPhase] = useState<'ready' | 'showing' | 'typing'>('ready');
  const [typedWord, setTypedWord] = useState('');
  const [flashFeedback, setFlashFeedback] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Part C: Common vs Proper name initial capitalization awareness
  const [capitalSolvedIds, setCapitalSolvedIds] = useState<string[]>(
    isUnlocked ? ROOM4_CAPITAL_PAIRS.map((c) => c.id) : []
  );
  const [capitalFeedback, setCapitalFeedback] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const activeFlash = ROOM4_FLASH_WORDS[flashIdx];

  useEffect(() => {
    if (flashPhase !== 'showing') return;
    const timer = window.setTimeout(() => {
      setFlashPhase('typing');
    }, 3000);
    return () => window.clearTimeout(timer);
  }, [flashPhase, flashIdx]);

  const checkAllUnlocked = (nextMissing: string[], nextFlash: string[], nextCapital: string[]) => {
    if (
      nextMissing.length === ROOM4_MISSING_LETTERS.length &&
      nextFlash.length === ROOM4_FLASH_WORDS.length &&
      nextCapital.length === ROOM4_CAPITAL_PAIRS.length &&
      !isUnlocked
    ) {
      soundFX.playUnlock();
      onUnlock();
    }
  };

  const handleMissingChoice = (
    challengeId: string,
    chosen: string,
    correct: string,
    fullWord: string,
    category: WordCategory
  ) => {
    if (missingSolvedIds.includes(challengeId)) return;
    if (chosen === correct) {
      soundFX.playCorrect();
      const updated = [...missingSolvedIds, challengeId];
      setMissingSolvedIds(updated);
      onAddDiscoveredWord(fullWord, category);
      setPartAFeedback({
        type: 'success',
        text: `Pontos helyesírás! A helyes szó: „${fullWord}”.`,
      });
      checkAllUnlocked(updated, flashSolvedIds, capitalSolvedIds);
    } else {
      soundFX.playWrong();
      setPartAFeedback({
        type: 'error',
        text: `Ejtsd ki lassan, szótagolva a szót! A „${chosen}” helyett egy másik betű illik oda.`,
      });
    }
  };

  const handleShowFlashWord = () => {
    soundFX.playClick();
    setTypedWord('');
    setFlashFeedback(null);
    setFlashPhase('showing');
  };

  const handleSubmitFlashWord = (e: React.FormEvent) => {
    e.preventDefault();
    const cleaned = typedWord.trim().toLowerCase();
    const target = activeFlash.word.toLowerCase();
    if (!cleaned) return;

    if (cleaned === target) {
      soundFX.playCorrect();
      const updatedFlash = Array.from(new Set([...flashSolvedIds, activeFlash.id]));
      setFlashSolvedIds(updatedFlash);
      onAddDiscoveredWord(activeFlash.word, activeFlash.category);
      setFlashFeedback({
        type: 'success',
        text: `Hibátlan leírás! A „${activeFlash.word}” pontosan így írandó.`,
      });

      checkAllUnlocked(missingSolvedIds, updatedFlash, capitalSolvedIds);

      if (flashIdx < ROOM4_FLASH_WORDS.length - 1) {
        window.setTimeout(() => {
          setFlashIdx((prev) => prev + 1);
          setFlashPhase('ready');
          setTypedWord('');
          setFlashFeedback(null);
        }, 1200);
      }
    } else {
      soundFX.playWrong();
      setFlashFeedback({
        type: 'error',
        text: `Majdnem! Figyelj az ékezetekre és a betűkapcsolatokra. Tipp: ${activeFlash.hint}`,
      });
    }
  };

  const handleCapitalChoice = (pairId: string, chosen: string, correctCapital: string, explanation: string) => {
    if (capitalSolvedIds.includes(pairId)) return;
    if (chosen === correctCapital) {
      soundFX.playCorrect();
      const updated = Array.from(new Set([...capitalSolvedIds, pairId]));
      setCapitalSolvedIds(updated);
      setCapitalFeedback({
        type: 'success',
        text: explanation,
      });
      checkAllUnlocked(missingSolvedIds, flashSolvedIds, updated);
    } else {
      soundFX.playWrong();
      setCapitalFeedback({
        type: 'error',
        text: `A „${chosen}” közös név (több hasonlóra is mondjuk), ezért kisbetűvel írjuk. Melyik a saját, külön név?`,
      });
    }
  };

  return (
    <section className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <p className="text-sm font-medium text-blue-700 mb-1">4. lakat · Pontos leírás és helyesírás (10 perc)</p>
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight" style={{ textWrap: 'balance' }}>
            A Helyesíró széf
          </h2>
          <p className="text-slate-600 mt-1 max-w-2xl">
            A Nyelvtan és helyesírás 3. tankönyv szavaival gyakoroljuk a pontos írást! Pótoljátok a hiányzó betűket, másoljatok emlékezetből, és figyeljétek meg a kezdőbetűket!
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          {isUnlocked ? (
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-900 font-semibold text-sm">
              <LockOpen className="w-4 h-4 text-emerald-700" aria-hidden="true" />
              <span>4. lakat nyitva · Kódszám:</span>
              <span className="font-mono-code text-base font-bold">{LOCK_DIGITS.room4}</span>
            </div>
          ) : (
            <div className="text-sm font-medium text-slate-600 font-mono-code">
              Betűpótlás: {missingSolvedIds.length}/5 · Villámírás: {flashSolvedIds.length}/3 · Kezdőbetű: {capitalSolvedIds.length}/2
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Part A: Missing Letters */}
        <div className="lg:col-span-7 bg-white border border-slate-200 rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between gap-2">
            <h3 className="text-base font-bold text-slate-900">1. próba: Pótoljátok a hiányzó betűket!</h3>
            <span className="font-mono-code text-xs font-bold text-slate-500">
              {missingSolvedIds.length} / {ROOM4_MISSING_LETTERS.length}
            </span>
          </div>

          <div className="space-y-3">
            {ROOM4_MISSING_LETTERS.map((item) => {
              const isDone = missingSolvedIds.includes(item.id);
              return (
                <div
                  key={item.id}
                  className={`p-4 rounded-xl border transition-colors ${
                    isDone ? 'bg-emerald-50/70 border-emerald-200' : 'bg-slate-50 border-slate-200'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <CategoryLabel category={item.category} />
                      </div>
                      <p className="text-2xl font-display font-bold tracking-wide text-slate-900">
                        {isDone ? (
                          <span>{item.fullWord}</span>
                        ) : (
                          <span>
                            {item.before}
                            <span className="inline-block min-w-[2.2rem] text-center border-b-2 border-blue-600 text-blue-700 mx-0.5">
                              _
                            </span>
                            {item.after}
                          </span>
                        )}
                      </p>
                      <p className="text-xs text-slate-600 mt-1">{item.clue}</p>
                    </div>

                    {isDone ? (
                      <span className="inline-flex items-center gap-1.5 text-sm font-bold text-emerald-800 shrink-0">
                        <CheckCircle2 className="w-5 h-5 text-emerald-700" aria-hidden="true" />
                        <span>Kész</span>
                      </span>
                    ) : (
                      <div className="flex items-center gap-2 shrink-0">
                        {item.choices.map((choice) => (
                          <button
                            key={choice}
                            type="button"
                            onClick={() =>
                              handleMissingChoice(item.id, choice, item.missing, item.fullWord, item.category)
                            }
                            className="min-w-[44px] h-11 px-3 rounded-lg border border-slate-300 bg-white hover:bg-blue-50 hover:border-blue-500 text-base font-bold text-slate-900 cursor-pointer"
                          >
                            {choice}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {partAFeedback && (
            <div
              role="status"
              className={`p-3.5 rounded-lg border text-sm font-medium ${
                partAFeedback.type === 'success'
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                  : 'bg-rose-50 border-rose-200 text-rose-900'
              }`}
            >
              {partAFeedback.text}
            </div>
          )}
        </div>

        {/* Right column: Part B Flash Spelling + Part C Common vs Proper initial awareness */}
        <div className="lg:col-span-5 space-y-5">
          <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-5">
            <div className="flex items-center justify-between gap-2">
              <h3 className="text-base font-bold text-slate-900">2. próba: Villámmásolás emlékezetből</h3>
              <span className="font-mono-code text-xs font-bold text-slate-500">
                {flashSolvedIds.length} / {ROOM4_FLASH_WORDS.length}
              </span>
            </div>

            <p className="text-sm text-slate-600">
              Figyeljétek meg jól a szót 3 másodpercig, aztán írjátok le pontosan!
            </p>

            <div className="flex gap-2">
              {ROOM4_FLASH_WORDS.map((fw, idx) => {
                const done = flashSolvedIds.includes(fw.id);
                const active = idx === flashIdx;
                return (
                  <button
                    key={fw.id}
                    type="button"
                    onClick={() => {
                      soundFX.playClick();
                      setFlashIdx(idx);
                      setFlashPhase(done ? 'typing' : 'ready');
                      setTypedWord(done ? fw.word : '');
                      setFlashFeedback(null);
                    }}
                    className={`flex-1 py-2 px-3 rounded-lg border text-xs font-bold cursor-pointer ${
                      active
                        ? 'bg-blue-700 text-white border-blue-700'
                        : done
                        ? 'bg-emerald-50 text-emerald-900 border-emerald-300'
                        : 'bg-slate-50 text-slate-700 border-slate-200'
                    }`}
                  >
                    {idx + 1}. szó {done ? '✓' : ''}
                  </button>
                );
              })}
            </div>

            {flashSolvedIds.includes(activeFlash.id) ? (
              <div className="p-5 rounded-xl bg-emerald-50 border border-emerald-200 text-center space-y-2">
                <CheckCircle2 className="w-7 h-7 text-emerald-700 mx-auto" aria-hidden="true" />
                <p className="text-xl font-display font-bold text-emerald-950">{activeFlash.word}</p>
                <p className="text-sm text-emerald-800">Ezt a szót már hibátlanul leírtátok!</p>
              </div>
            ) : flashPhase === 'ready' ? (
              <div className="p-6 rounded-xl bg-slate-50 border border-slate-200 text-center space-y-4">
                <CategoryLabel category={activeFlash.category} />
                <p className="text-sm text-slate-600">
                  Kattints a gombra, figyeld a betűket 3 másodpercig, majd írd le!
                </p>
                <button
                  type="button"
                  onClick={handleShowFlashWord}
                  className="py-3 px-5 rounded-lg bg-blue-700 hover:bg-blue-800 text-white font-semibold text-sm inline-flex items-center gap-2 cursor-pointer"
                >
                  <Eye className="w-4 h-4" aria-hidden="true" />
                  <span>Mutasd a szót 3 másodpercre!</span>
                </button>
              </div>
            ) : flashPhase === 'showing' ? (
              <div className="p-8 rounded-xl bg-blue-50 border border-blue-300 text-center space-y-2">
                <p className="text-xs font-semibold text-blue-700">Figyeld meg minden betűjét!</p>
                <p className="text-3xl md:text-4xl font-display font-extrabold text-slate-900 tracking-wide">
                  {activeFlash.word}
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmitFlashWord} className="space-y-3">
                <div className="flex items-center justify-between">
                  <label htmlFor="flash-input" className="text-sm font-semibold text-slate-800">
                    Írjátok le a látott szót pontosan:
                  </label>
                  <button
                    type="button"
                    onClick={handleShowFlashWord}
                    className="text-xs font-semibold text-blue-700 hover:underline cursor-pointer"
                  >
                    Újranézés (3 mp)
                  </button>
                </div>
                <input
                  id="flash-input"
                  type="text"
                  autoComplete="off"
                  value={typedWord}
                  onChange={(e) => setTypedWord(e.target.value)}
                  placeholder="Írd ide a szót..."
                  className="w-full px-4 py-3 rounded-lg border border-slate-300 text-lg font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
                <button
                  type="submit"
                  className="w-full py-3 px-4 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-semibold text-sm inline-flex items-center justify-center gap-2 cursor-pointer"
                >
                  <PenTool className="w-4 h-4" aria-hidden="true" />
                  <span>Helyesírás ellenőrzése</span>
                </button>
              </form>
            )}

            {flashFeedback && (
              <div
                role="status"
                className={`p-3.5 rounded-lg border text-sm font-medium ${
                  flashFeedback.type === 'success'
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                    : 'bg-rose-50 border-rose-200 text-rose-900'
                }`}
              >
                {flashFeedback.text}
              </div>
            )}
          </div>

          {/* Part C: Közös név vs. saját név (kis vagy nagy kezdőbetű) */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-4">
            <div className="flex items-center justify-between gap-2">
              <h3 className="text-base font-bold text-slate-900">3. próba: Kis vagy nagy kezdőbetű?</h3>
              <span className="font-mono-code text-xs font-bold text-slate-500">
                {capitalSolvedIds.length} / {ROOM4_CAPITAL_PAIRS.length}
              </span>
            </div>

            <div className="space-y-3">
              {ROOM4_CAPITAL_PAIRS.map((pair) => {
                const isDone = capitalSolvedIds.includes(pair.id);
                return (
                  <div
                    key={pair.id}
                    className={`p-3.5 rounded-lg border ${
                      isDone ? 'bg-emerald-50/70 border-emerald-200' : 'bg-slate-50 border-slate-200'
                    }`}
                  >
                    <p className="text-xs font-semibold text-slate-700 mb-2">{pair.prompt}</p>
                    <div className="grid grid-cols-2 gap-2.5">
                      {[pair.commonWord, pair.properWord].map((wordOpt) => {
                        const isChosenCorrect = isDone && wordOpt === pair.correctCapital;
                        return (
                          <button
                            key={wordOpt}
                            type="button"
                            disabled={isDone}
                            onClick={() =>
                              handleCapitalChoice(pair.id, wordOpt, pair.correctCapital, pair.explanation)
                            }
                            className={`py-2.5 px-3 rounded-lg border text-base font-bold transition-colors cursor-pointer ${
                              isChosenCorrect
                                ? 'bg-emerald-700 text-white border-emerald-700'
                                : isDone
                                ? 'bg-white text-slate-400 border-slate-200 cursor-default'
                                : 'bg-white text-slate-900 border-slate-300 hover:border-blue-500 hover:bg-blue-50'
                            }`}
                          >
                            {wordOpt}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>

            {capitalFeedback && (
              <div
                role="status"
                className={`p-3.5 rounded-lg border text-sm font-medium ${
                  capitalFeedback.type === 'success'
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                    : 'bg-rose-50 border-rose-200 text-rose-900'
                }`}
              >
                {capitalFeedback.text}
              </div>
            )}

            {isUnlocked && (
              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-300 space-y-3">
                <p className="text-sm font-bold text-emerald-950">
                  Mind a 4 lakat kódszáma megvan! Menjetek a Titkos Könyvtár ajtajához, és szabaduljatok ki!
                </p>
                <button
                  type="button"
                  onClick={onGoEscapeDoor}
                  className="w-full py-3 px-4 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-sm inline-flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Ugrás a Titkos Ajtóhoz</span>
                  <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
