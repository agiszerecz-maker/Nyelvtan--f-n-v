import React, { useState } from 'react';
import { Sparkles, CheckCircle2, LockOpen, HelpCircle, MessageCircle, ArrowRight } from 'lucide-react';
import { CATEGORY_META, ESCAPE_ASSETS, LOCK_DIGITS, ROOM1_MAGIC_BAG_CLUES } from '../data/escapeData';
import { WordCategory } from '../types/escapeRoom';
import { CategoryIcon } from './CategoryBadge';
import { soundFX } from '../utils/sound';

interface Room1MagicBagProps {
  isUnlocked: boolean;
  onUnlock: () => void;
  onGoNext: () => void;
  onAddDiscoveredWord: (word: string, category: WordCategory) => void;
}

export const Room1MagicBag: React.FC<Room1MagicBagProps> = ({
  isUnlocked,
  onUnlock,
  onGoNext,
  onAddDiscoveredWord,
}) => {
  const [bagOpenedCount, setBagOpenedCount] = useState<number>(isUnlocked ? ROOM1_MAGIC_BAG_CLUES.length : 0);
  const [currentIdx, setCurrentIdx] = useState<number>(0);
  const [solvedIds, setSolvedIds] = useState<string[]>(
    isUnlocked ? ROOM1_MAGIC_BAG_CLUES.map((c) => c.id) : []
  );
  const [pickedWord, setPickedWord] = useState<string | null>(null);
  const [pickedCategory, setPickedCategory] = useState<WordCategory | null>(null);
  const [feedback, setFeedback] = useState<{ type: 'error' | 'info' | 'success'; text: string } | null>(null);
  const [showHint, setShowHint] = useState(false);
  const [imgError, setImgError] = useState(false);

  const activeClue = ROOM1_MAGIC_BAG_CLUES[currentIdx];
  const isCurrentWordSolved = pickedWord === activeClue.correctWord;
  const isCurrentFullySolved = solvedIds.includes(activeClue.id);

  const handlePullFromBag = () => {
    soundFX.playClick();
    if (bagOpenedCount === 0) {
      setBagOpenedCount(1);
      setCurrentIdx(0);
    } else if (currentIdx < ROOM1_MAGIC_BAG_CLUES.length - 1) {
      const next = currentIdx + 1;
      setCurrentIdx(next);
      setBagOpenedCount((prev) => Math.max(prev, next + 1));
      setPickedWord(null);
      setPickedCategory(null);
      setFeedback(null);
      setShowHint(false);
    }
  };

  const handleSelectClueTab = (index: number) => {
    if (index >= bagOpenedCount && !isUnlocked) return;
    soundFX.playClick();
    setCurrentIdx(index);
    const targetClue = ROOM1_MAGIC_BAG_CLUES[index];
    if (solvedIds.includes(targetClue.id)) {
      setPickedWord(targetClue.correctWord);
      setPickedCategory(targetClue.category);
      setFeedback({
        type: 'success',
        text: `Megfejtve! A „${targetClue.correctWord}” egy ${CATEGORY_META[targetClue.category].label.toLowerCase()} megnevezése.`,
      });
    } else {
      setPickedWord(null);
      setPickedCategory(null);
      setFeedback(null);
    }
    setShowHint(false);
  };

  const handleWordGuess = (word: string) => {
    if (isCurrentFullySolved) return;
    if (word === activeClue.correctWord) {
      soundFX.playCorrect();
      setPickedWord(word);
      setFeedback({
        type: 'info',
        text: `Szuper! Megtaláltad a megnevező szót: „${word}”. Most válaszd ki, kit vagy mit nevez meg!`,
      });
    } else {
      soundFX.playWrong();
      setFeedback({
        type: 'error',
        text: `Figyelj a találós kérdésre! A „${word}” inkább cselekvést vagy tulajdonságot fejez ki, nem nevez meg senkit vagy semmit.`,
      });
    }
  };

  const handleCategoryGuess = (category: WordCategory) => {
    if (!isCurrentWordSolved || isCurrentFullySolved) return;
    if (category === activeClue.category) {
      soundFX.playCorrect();
      setPickedCategory(category);
      const updatedSolved = Array.from(new Set([...solvedIds, activeClue.id]));
      setSolvedIds(updatedSolved);
      onAddDiscoveredWord(activeClue.correctWord, category);

      if (updatedSolved.length === ROOM1_MAGIC_BAG_CLUES.length) {
        soundFX.playUnlock();
        onUnlock();
        setFeedback({
          type: 'success',
          text: `Minden kincset kihúztatok a Varázszsákból! Az 1. lakat kinyílt, a kód első számjegye: ${LOCK_DIGITS.room1}`,
        });
      } else {
        setFeedback({
          type: 'success',
          text: `Helyes! A „${activeClue.correctWord}” szó egy ${CATEGORY_META[category].label.toLowerCase()} nevét adja meg. Húzzátok ki a következő kártyát!`,
        });
      }
    } else {
      soundFX.playWrong();
      setFeedback({
        type: 'error',
        text: `Gondolj bele: a „${activeClue.correctWord}” valóban ${CATEGORY_META[category].label.toLowerCase()}? Próbáld meg egy másik csoporttal!`,
      });
    }
  };

  return (
    <section className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <p className="text-sm font-medium text-blue-700 mb-1">1. lakat · Ráhangolódás (8 perc)</p>
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight" style={{ textWrap: 'balance' }}>
            A Varázszsák titka
          </h2>
          <p className="text-slate-600 mt-1 max-w-2xl">
            Húzzatok elő 4 titkos kártyát a Varázszsákból! Fedezzétek fel, milyen nevet adó szavak lapulnak benne, és alkossatok velük mondatokat szóban.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          {isUnlocked ? (
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-900 font-semibold text-sm">
              <LockOpen className="w-4 h-4 text-emerald-700" aria-hidden="true" />
              <span>1. lakat nyitva · Kódszám:</span>
              <span className="font-mono-code text-base font-bold">{LOCK_DIGITS.room1}</span>
            </div>
          ) : (
            <div className="text-sm font-medium text-slate-600 font-mono-code">
              Megfejtve: {solvedIds.length} / {ROOM1_MAGIC_BAG_CLUES.length}
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Left: Interactive Magic Bag */}
        <div className="lg:col-span-5 bg-white border border-slate-200 rounded-xl p-5 flex flex-col justify-between gap-4">
          <div className="relative overflow-hidden rounded-lg border border-slate-200 bg-slate-50 aspect-[4/3]">
            {!imgError ? (
              <img
                src={ESCAPE_ASSETS.magicBag}
                alt="A titkos Varázszsák kártyákkal a tantermi asztalon"
                referrerPolicy="no-referrer"
                onError={() => setImgError(true)}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-slate-100">
                <Sparkles className="w-10 h-10 text-blue-700 mb-2" aria-hidden="true" />
                <p className="font-display font-bold text-slate-800">A Titkos Varázszsák</p>
              </div>
            )}
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs font-medium text-slate-500">
              <span>Zsákból kihúzott kártyák</span>
              <span className="font-mono-code">{bagOpenedCount} / {ROOM1_MAGIC_BAG_CLUES.length}</span>
            </div>

            <div className="grid grid-cols-4 gap-2">
              {ROOM1_MAGIC_BAG_CLUES.map((clue, idx) => {
                const isSolved = solvedIds.includes(clue.id);
                const isAvailable = idx < bagOpenedCount || isUnlocked;
                const isActive = bagOpenedCount > 0 && idx === currentIdx;
                return (
                  <button
                    key={clue.id}
                    type="button"
                    disabled={!isAvailable}
                    onClick={() => handleSelectClueTab(idx)}
                    className={`py-2.5 px-2 rounded-lg text-sm font-semibold border transition-colors whitespace-nowrap flex items-center justify-center gap-1.5 ${
                      isActive
                        ? 'bg-blue-700 text-white border-blue-700'
                        : isSolved
                        ? 'bg-emerald-50 text-emerald-900 border-emerald-300 hover:bg-emerald-100'
                        : isAvailable
                        ? 'bg-white text-slate-800 border-slate-300 hover:bg-slate-50'
                        : 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed'
                    }`}
                  >
                    {isSolved && <CheckCircle2 className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />}
                    <span>{idx + 1}.</span>
                  </button>
                );
              })}
            </div>

            {bagOpenedCount === 0 ? (
              <button
                type="button"
                onClick={handlePullFromBag}
                className="w-full py-3 px-4 rounded-lg bg-blue-700 hover:bg-blue-800 text-white font-semibold text-base transition-colors cursor-pointer"
              >
                Nyúlj bele a Varázszsákba!
              </button>
            ) : isCurrentFullySolved && currentIdx < ROOM1_MAGIC_BAG_CLUES.length - 1 ? (
              <button
                type="button"
                onClick={handlePullFromBag}
                className="w-full py-3 px-4 rounded-lg bg-blue-700 hover:bg-blue-800 text-white font-semibold text-base transition-colors inline-flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Következő kincs kihúzása</span>
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </button>
            ) : isUnlocked ? (
              <button
                type="button"
                onClick={onGoNext}
                className="w-full py-3 px-4 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-base transition-colors inline-flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Tovább a 2. lakathoz</span>
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </button>
            ) : null}
          </div>
        </div>

        {/* Right: Active Mystery Card */}
        <div className="lg:col-span-7 bg-white border border-slate-200 rounded-xl p-6 flex flex-col justify-between gap-6">
          {bagOpenedCount === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center py-12 px-4">
              <div className="w-14 h-14 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center mb-4">
                <Sparkles className="w-7 h-7 text-blue-700" aria-hidden="true" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Készen álltok, Főnévdetektívek?</h3>
              <p className="text-slate-600 max-w-md mb-6">
                A Varázszsák négy titkos kártyát rejt. Minden kártya mögött egy olyan szó bújik meg, amely megnevez valakit vagy valamit. Kattintsatok a bal oldali gombra az első kártyáért!
              </p>
              <button
                type="button"
                onClick={handlePullFromBag}
                className="py-3 px-6 rounded-lg bg-blue-700 hover:bg-blue-800 text-white font-semibold transition-colors cursor-pointer"
              >
                Első kártya kihúzása
              </button>
            </div>
          ) : (
            <>
              <div className="space-y-5">
                <div className="flex items-center justify-between gap-4">
                  <span className="text-sm font-semibold text-slate-500">
                    {currentIdx + 1}. kártya feladványa
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      soundFX.playClick();
                      setShowHint((prev) => !prev);
                    }}
                    className="inline-flex items-center gap-1.5 text-sm font-medium text-blue-700 hover:text-blue-900 cursor-pointer"
                  >
                    <HelpCircle className="w-4 h-4" aria-hidden="true" />
                    <span>{showHint ? 'Segítség elrejtése' : 'Segítség kérése'}</span>
                  </button>
                </div>

                <div className="p-5 rounded-xl bg-slate-50 border border-slate-200">
                  <p className="text-lg md:text-xl font-semibold text-slate-900 leading-relaxed">
                    „{activeClue.riddle}”
                  </p>
                  {showHint && (
                    <p className="mt-3 text-sm text-blue-800 font-medium">
                      Nyomravezető tipp: {activeClue.hint}
                    </p>
                  )}
                </div>

                {/* Step 1: Pick the naming word */}
                <div className="space-y-2.5">
                  <p className="text-sm font-semibold text-slate-700">
                    1. lépés: Melyik szó nevezi meg a feladvány megoldását?
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {activeClue.options.map((option) => {
                      const isCorrectSelected = isCurrentWordSolved && option === activeClue.correctWord;
                      return (
                        <button
                          key={option}
                          type="button"
                          disabled={isCurrentWordSolved}
                          onClick={() => handleWordGuess(option)}
                          className={`py-3.5 px-4 rounded-lg border text-lg font-bold transition-colors cursor-pointer ${
                            isCorrectSelected
                              ? 'bg-emerald-50 border-emerald-400 text-emerald-900'
                              : isCurrentWordSolved
                              ? 'bg-slate-50 border-slate-200 text-slate-400 cursor-default'
                              : 'bg-white border-slate-300 text-slate-900 hover:border-blue-500 hover:bg-blue-50'
                          }`}
                        >
                          {option}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Step 2: Classify what it names */}
                <div className={`space-y-2.5 transition-opacity ${isCurrentWordSolved ? 'opacity-100' : 'opacity-45 pointer-events-none'}`}>
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="text-sm font-semibold text-slate-700">
                      2. lépés: Kit vagy mit nevez meg a „{isCurrentWordSolved ? activeClue.correctWord : '...'}” szó?
                    </p>
                    {isCurrentWordSolved && (
                      <span className="text-xs font-bold text-blue-800">
                        Kérdése: {activeClue.questionWord}
                      </span>
                    )}
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {(['person', 'animal', 'object', 'other'] as WordCategory[]).map((cat) => {
                      const meta = CATEGORY_META[cat];
                      const isCatChosen = isCurrentFullySolved && activeClue.category === cat;
                      return (
                        <button
                          key={cat}
                          type="button"
                          disabled={!isCurrentWordSolved || isCurrentFullySolved}
                          onClick={() => handleCategoryGuess(cat)}
                          className={`py-3 px-3 rounded-lg border text-sm font-semibold transition-colors flex flex-col items-center gap-1 cursor-pointer ${
                            isCatChosen
                              ? `${meta.bgClass} ${meta.borderClass} ${meta.textClass}`
                              : 'bg-white border-slate-300 text-slate-800 hover:bg-slate-50 hover:border-blue-400'
                          }`}
                        >
                          <CategoryIcon category={cat} className="w-5 h-5" />
                          <span className="whitespace-nowrap">{meta.label}</span>
                          <span className="text-[11px] font-normal text-slate-500">{meta.textbookGroup}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Oral Vocabulary Challenge */}
                {isCurrentFullySolved && (
                  <div className="p-4 rounded-lg bg-amber-50 border border-amber-200 flex items-start gap-3">
                    <MessageCircle className="w-5 h-5 text-amber-800 shrink-0 mt-0.5" aria-hidden="true" />
                    <div>
                      <p className="text-xs font-bold text-amber-900">
                        Szóbeli páros próba · {activeClue.textbookTag} ({activeClue.questionWord})
                      </p>
                      <p className="text-sm text-amber-950 mt-0.5">{activeClue.oralPrompt}</p>
                    </div>
                  </div>
                )}
              </div>

              {feedback && (
                <div
                  role="status"
                  className={`p-4 rounded-lg border text-sm font-medium ${
                    feedback.type === 'success'
                      ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                      : feedback.type === 'error'
                      ? 'bg-rose-50 border-rose-200 text-rose-900'
                      : 'bg-blue-50 border-blue-200 text-blue-900'
                  }`}
                >
                  {feedback.text}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </section>
  );
};
