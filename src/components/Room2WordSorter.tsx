import React, { useState } from 'react';
import { CheckCircle2, LockOpen, ArrowRight, Plus, Ban, Sparkles } from 'lucide-react';
import { CATEGORY_META, LOCK_DIGITS, ROOM2_SORTING_WORDS } from '../data/escapeData';
import { SorterTarget, WordCategory } from '../types/escapeRoom';
import { CategoryIcon } from './CategoryBadge';
import { soundFX } from '../utils/sound';

interface Room2WordSorterProps {
  isUnlocked: boolean;
  onUnlock: () => void;
  onGoNext: () => void;
  onAddDiscoveredWord: (word: string, category: WordCategory) => void;
}

export const Room2WordSorter: React.FC<Room2WordSorterProps> = ({
  isUnlocked,
  onUnlock,
  onGoNext,
  onAddDiscoveredWord,
}) => {
  const [placedMap, setPlacedMap] = useState<Record<string, SorterTarget>>(() => {
    if (!isUnlocked) return {};
    const initial: Record<string, SorterTarget> = {};
    ROOM2_SORTING_WORDS.forEach((item) => {
      initial[item.id] = item.target;
    });
    return initial;
  });

  const [selectedWordId, setSelectedWordId] = useState<string | null>(
    isUnlocked ? null : ROOM2_SORTING_WORDS[0].id
  );
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Group brainstorm addition
  const [customWord, setCustomWord] = useState('');
  const [customCategory, setCustomCategory] = useState<WordCategory>('object');
  const [customGroupWords, setCustomGroupWords] = useState<Array<{ id: string; word: string; category: WordCategory }>>([]);

  const remainingWords = ROOM2_SORTING_WORDS.filter((w) => !placedMap[w.id]);
  const selectedWordObj = ROOM2_SORTING_WORDS.find((w) => w.id === selectedWordId) || remainingWords[0] || null;

  const handlePlaceWord = (target: SorterTarget) => {
    if (!selectedWordObj) return;

    if (selectedWordObj.target === target) {
      soundFX.playCorrect();
      const updated = { ...placedMap, [selectedWordObj.id]: target };
      setPlacedMap(updated);

      if (target !== 'decoy') {
        onAddDiscoveredWord(selectedWordObj.word, target);
      }

      const nextRemaining = ROOM2_SORTING_WORDS.filter((w) => !updated[w.id]);
      setSelectedWordId(nextRemaining[0]?.id ?? null);

      if (nextRemaining.length === 0) {
        soundFX.playUnlock();
        onUnlock();
        setFeedback({
          type: 'success',
          text: `Minden kártyát tökéletesen szétválogattatok! A 2. lakat kinyílt, a kód második számjegye: ${LOCK_DIGITS.room2}`,
        });
      } else {
        setFeedback({
          type: 'success',
          text: selectedWordObj.explanation,
        });
      }
    } else {
      soundFX.playWrong();
      if (selectedWordObj.target === 'decoy') {
        setFeedback({
          type: 'error',
          text: `Vigasztaló nyom: nézd meg közelebbről a „${selectedWordObj.word}” szót! Ez megnevez valakit vagy valamit, vagy inkább kakukktojás?`,
        });
      } else {
        setFeedback({
          type: 'error',
          text: `A „${selectedWordObj.word}” valóban megnevez valakit vagy valamit! Melyik ládába illik jobban?`,
        });
      }
    }
  };

  const handleAddCustomWord = (e: React.FormEvent) => {
    e.preventDefault();
    const cleaned = customWord.trim();
    if (!cleaned) return;
    soundFX.playCorrect();
    setCustomGroupWords((prev) => [
      ...prev,
      { id: `${Date.now()}`, word: cleaned, category: customCategory },
    ]);
    onAddDiscoveredWord(cleaned, customCategory);
    setCustomWord('');
  };

  const totalSorted = Object.keys(placedMap).length;

  return (
    <section className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <p className="text-sm font-medium text-blue-700 mb-1">2. lakat · Csoportos felfedezés (12 perc)</p>
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight" style={{ textWrap: 'balance' }}>
            A Szóválogató műhely
          </h2>
          <p className="text-slate-600 mt-1 max-w-2xl">
            Válogassátok szét a kártyákat a 4 kincsesládába! Vigyázat: négy kakukktojás is elrejtőzött közöttük, amelyek nem neveznek meg senkit és semmit.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          {isUnlocked ? (
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-900 font-semibold text-sm">
              <LockOpen className="w-4 h-4 text-emerald-700" aria-hidden="true" />
              <span>2. lakat nyitva · Kódszám:</span>
              <span className="font-mono-code text-base font-bold">{LOCK_DIGITS.room2}</span>
            </div>
          ) : (
            <div className="text-sm font-medium text-slate-600 font-mono-code">
              Elhelyezve: {totalSorted} / {ROOM2_SORTING_WORDS.length}
            </div>
          )}
        </div>
      </div>

      {/* Word Deck */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h3 className="text-base font-bold text-slate-900">
            {remainingWords.length > 0
              ? '1. Válasszatok egy szókártyát, majd kattintsatok a megfelelő ládára:'
              : 'Minden kártya a helyére került!'}
          </h3>
          {selectedWordObj && (
            <span className="text-sm font-semibold text-blue-800">
              Kijelölt szó: „{selectedWordObj.word}”
            </span>
          )}
        </div>

        {remainingWords.length > 0 ? (
          <div className="flex flex-wrap gap-2.5">
            {remainingWords.map((item) => {
              const isSelected = selectedWordObj?.id === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    soundFX.playClick();
                    setSelectedWordId(item.id);
                  }}
                  className={`px-4 py-2.5 rounded-lg border text-base font-bold transition-colors cursor-pointer ${
                    isSelected
                      ? 'bg-blue-700 text-white border-blue-700 shadow-sm'
                      : 'bg-slate-50 text-slate-900 border-slate-300 hover:bg-blue-50 hover:border-blue-400'
                  }`}
                >
                  {item.word}
                </button>
              );
            })}
          </div>
        ) : (
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-lg bg-emerald-50 border border-emerald-200">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-6 h-6 text-emerald-700 shrink-0" aria-hidden="true" />
              <p className="text-sm font-semibold text-emerald-950">
                Ügyes csapatmunka! Sikeresen szétválogattátok a megnevező szavakat és a kakukktojásokat.
              </p>
            </div>
            <button
              type="button"
              onClick={onGoNext}
              className="py-2.5 px-4 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-sm inline-flex items-center gap-2 shrink-0 cursor-pointer"
            >
              <span>Tovább a 3. lakathoz</span>
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </button>
          </div>
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

      {/* 4 Category Chests + Decoy Tray */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {(['person', 'animal', 'object', 'other'] as WordCategory[]).map((cat) => {
          const meta = CATEGORY_META[cat];
          const wordsInBox = ROOM2_SORTING_WORDS.filter((w) => placedMap[w.id] === cat);
          const customInBox = customGroupWords.filter((w) => w.category === cat);
          return (
            <button
              key={cat}
              type="button"
              disabled={!selectedWordObj}
              onClick={() => handlePlaceWord(cat)}
              className={`text-left rounded-xl border p-4 flex flex-col justify-between gap-3 transition-colors min-h-[190px] ${
                selectedWordObj
                  ? `bg-white border-slate-300 hover:border-blue-500 hover:bg-slate-50 cursor-pointer`
                  : `${meta.bgClass} ${meta.borderClass} cursor-default`
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-1">
                  <span className={`inline-flex items-center gap-1.5 font-bold text-base ${meta.textClass}`}>
                    <CategoryIcon category={cat} className="w-5 h-5 shrink-0" />
                    <span>{meta.shortLabel}</span>
                  </span>
                  <span className="font-mono-code text-xs font-bold text-slate-500">
                    {wordsInBox.length}/2
                  </span>
                </div>
                <p className="text-[11px] font-semibold text-slate-500 mb-1">{meta.textbookGroup}</p>
                <p className="text-xs text-slate-600 leading-snug">{meta.description}</p>
              </div>

              <div className="flex flex-wrap gap-1.5 pt-2 border-t border-slate-100">
                {wordsInBox.map((w) => (
                  <span
                    key={w.id}
                    className={`px-2.5 py-1 rounded text-xs font-bold ${meta.bgClass} ${meta.textClass} border ${meta.borderClass}`}
                  >
                    {w.word}
                  </span>
                ))}
                {customInBox.map((cw) => (
                  <span
                    key={cw.id}
                    className="px-2.5 py-1 rounded text-xs font-bold bg-white text-slate-800 border border-slate-300"
                  >
                    + {cw.word}
                  </span>
                ))}
                {wordsInBox.length === 0 && customInBox.length === 0 && (
                  <span className="text-xs text-slate-400">Ide kattintva helyezhető el</span>
                )}
              </div>
            </button>
          );
        })}

        {/* Decoy Box */}
        <button
          type="button"
          disabled={!selectedWordObj}
          onClick={() => handlePlaceWord('decoy')}
          className={`text-left rounded-xl border p-4 flex flex-col justify-between gap-3 transition-colors min-h-[190px] ${
            selectedWordObj
              ? 'bg-slate-50 border-slate-300 hover:border-rose-400 hover:bg-rose-50/40 cursor-pointer'
              : 'bg-slate-100 border-slate-300 cursor-default'
          }`}
        >
          <div>
            <div className="flex items-center justify-between gap-2 mb-1.5">
              <span className="inline-flex items-center gap-1.5 font-bold text-base text-slate-800">
                <Ban className="w-5 h-5 text-rose-700 shrink-0" aria-hidden="true" />
                <span>Kakukktojás</span>
              </span>
              <span className="font-mono-code text-xs font-bold text-slate-500">
                {ROOM2_SORTING_WORDS.filter((w) => placedMap[w.id] === 'decoy').length}/4
              </span>
            </div>
            <p className="text-xs text-slate-600 leading-snug">
              Nem megnevező szó (pl. cselekvés vagy tulajdonság)
            </p>
          </div>

          <div className="flex flex-wrap gap-1.5 pt-2 border-t border-slate-200/70">
            {ROOM2_SORTING_WORDS.filter((w) => placedMap[w.id] === 'decoy').map((w) => (
              <span
                key={w.id}
                className="px-2.5 py-1 rounded text-xs font-bold bg-rose-50 text-rose-900 border border-rose-200"
              >
                {w.word}
              </span>
            ))}
            {ROOM2_SORTING_WORDS.filter((w) => placedMap[w.id] === 'decoy').length === 0 && (
              <span className="text-xs text-slate-400">Ide kerülnek a kakukktojások</span>
            )}
          </div>
        </button>
      </div>

      {/* Group Brainstorming Extension */}
      <div className="bg-white border border-slate-200 rounded-xl p-5">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="w-4 h-4 text-blue-700" aria-hidden="true" />
          <h3 className="text-base font-bold text-slate-900">
            Csoportos szókincsbővítő: Mondjatok saját példákat a ládákba!
          </h3>
        </div>
        <form onSubmit={handleAddCustomWord} className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            value={customWord}
            onChange={(e) => setCustomWord(e.target.value)}
            placeholder="Írjatok be egy új megnevező szót (pl. tűzoltó, mókus, ceruza)..."
            aria-label="Új megnevező szó"
            className="flex-1 px-4 py-2.5 rounded-lg border border-slate-300 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
          <select
            value={customCategory}
            onChange={(e) => setCustomCategory(e.target.value as WordCategory)}
            aria-label="Kategória választása"
            className="px-3.5 py-2.5 rounded-lg border border-slate-300 bg-white text-slate-900 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-600"
          >
            <option value="person">Személy</option>
            <option value="animal">Állat</option>
            <option value="object">Tárgy</option>
            <option value="other">Egyéb dolog</option>
          </select>
          <button
            type="submit"
            className="px-4 py-2.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold inline-flex items-center justify-center gap-1.5 whitespace-nowrap cursor-pointer"
          >
            <Plus className="w-4 h-4" aria-hidden="true" />
            <span>Hozzáadás a táblához</span>
          </button>
        </form>
      </div>
    </section>
  );
};
