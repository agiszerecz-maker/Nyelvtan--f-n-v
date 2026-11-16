import React, { useState } from 'react';
import { KeyRound, Lock, LockOpen, Award, ArrowRight, RotateCcw, Printer } from 'lucide-react';
import { CATEGORY_META, ESCAPE_ASSETS, LOCK_DIGITS, MASTER_CODE, TEXTBOOK_SOURCE } from '../data/escapeData';
import { CustomCollectedWord, PadlockState, StageId } from '../types/escapeRoom';
import { CategoryIcon } from './CategoryBadge';
import { soundFX } from '../utils/sound';

interface VaultDoorStageProps {
  padlocks: PadlockState;
  discoveredWords: CustomCollectedWord[];
  elapsedSeconds: number;
  onSelectStage: (stage: StageId) => void;
  onEscapeSuccess: () => void;
  onResetAll: () => void;
}

export const VaultDoorStage: React.FC<VaultDoorStageProps> = ({
  padlocks,
  discoveredWords,
  elapsedSeconds,
  onSelectStage,
  onEscapeSuccess,
  onResetAll,
}) => {
  const [digits, setDigits] = useState<[string, string, string, string]>(['0', '0', '0', '0']);
  const [codeError, setCodeError] = useState<string | null>(null);
  const [imgError, setImgError] = useState(false);

  const allFourUnlocked = padlocks.room1 && padlocks.room2 && padlocks.room3 && padlocks.room4;

  const formatDuration = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const rem = sec % 60;
    return `${String(mins).padStart(2, '0')}:${String(rem).padStart(2, '0')}`;
  };

  const handleCycleDigit = (index: number, delta: number) => {
    soundFX.playClick();
    setCodeError(null);
    setDigits((prev) => {
      const next = [...prev] as [string, string, string, string];
      const val = (Number(next[index]) + delta + 10) % 10;
      next[index] = String(val);
      return next;
    });
  };

  const handleTryUnlockDoor = () => {
    const entered = digits.join('');
    if (entered === MASTER_CODE) {
      soundFX.playVictory();
      setCodeError(null);
      onEscapeSuccess();
    } else {
      soundFX.playWrong();
      setCodeError(
        allFourUnlocked
          ? `Ez a kód (${entered}) nem nyitja az ajtót. Nézzétek meg a fenti négy kódszámot sorrendben!`
          : 'Még nem nyitottátok ki mind a 4 lakatot! Teljesítsétek a szobákat, és gyűjtsétek össze a 4 kódszámot.'
      );
    }
  };

  const rooms = [
    {
      id: 'room1' as StageId,
      num: 1,
      title: 'A Varázszsák kamrája',
      subtitle: 'Találós kérdések · Személy, állat, tárgy, egyéb',
      unlocked: padlocks.room1,
      digit: LOCK_DIGITS.room1,
    },
    {
      id: 'room2' as StageId,
      num: 2,
      title: 'A Szóválogató műhely',
      subtitle: 'Megnevező szavak és kakukktojások',
      unlocked: padlocks.room2,
      digit: LOCK_DIGITS.room2,
    },
    {
      id: 'room3' as StageId,
      num: 3,
      title: 'A Titkos Osztályterem',
      subtitle: 'Képes és valós tantermi nyomozás',
      unlocked: padlocks.room3,
      digit: LOCK_DIGITS.room3,
    },
    {
      id: 'room4' as StageId,
      num: 4,
      title: 'A Helyesíró széf',
      subtitle: 'Betűpótlás, villámmásolás és kezdőbetűk',
      unlocked: padlocks.room4,
      digit: LOCK_DIGITS.room4,
    },
  ];

  return (
    <section className="space-y-8">
      {/* Hero Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        <div className="lg:col-span-7 bg-white border border-slate-200 rounded-xl p-6 md:p-8 flex flex-col justify-between gap-6">
          <div className="space-y-3">
            <p className="text-sm font-medium text-blue-700">
              {TEXTBOOK_SOURCE} · 1. óra · 45 perc · 28 tanuló
            </p>
            <h1
              className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight"
              style={{ textWrap: 'balance' }}
            >
              A főnevek titkos világa: Varázszsák-szabadulószoba
            </h1>
            <p className="text-base text-slate-600 leading-relaxed max-w-2xl">
              A Titkos Könyvtár ajtaját négy rézlakat zárja el. Főnévdetektívként nyissátok ki mind a négyet, fedezzétek fel, hogy <strong>a szavaknak nevet adó erejük van</strong>, és szerezzétek meg a négyjegyű szabadulókódot!
            </p>
          </div>

          {/* Escape Keypad or Victory Certificate */}
          {!padlocks.escaped ? (
            <div className="p-5 rounded-xl bg-slate-50 border border-slate-200 space-y-4">
              <div className="flex items-center justify-between gap-2">
                <span className="inline-flex items-center gap-2 text-sm font-bold text-slate-900">
                  <KeyRound className="w-4 h-4 text-amber-700" aria-hidden="true" />
                  <span>A Titkos Ajtó 4 jegyű kódzára</span>
                </span>
                <span className="text-xs font-medium text-slate-500">
                  Állítsátok be a 4 lakatból kapott számokat!
                </span>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-2.5">
                  {digits.map((digit, i) => (
                    <div
                      key={i}
                      className="flex flex-col items-center bg-white border border-slate-300 rounded-lg p-1.5 w-14"
                    >
                      <button
                        type="button"
                        aria-label={`${i + 1}. számjegy növelése`}
                        onClick={() => handleCycleDigit(i, 1)}
                        className="w-full py-1 text-xs font-bold text-slate-600 hover:text-blue-700 hover:bg-slate-100 rounded cursor-pointer"
                      >
                        ▲
                      </button>
                      <span className="font-mono-code text-2xl font-bold text-slate-900 py-1">
                        {digit}
                      </span>
                      <button
                        type="button"
                        aria-label={`${i + 1}. számjegy csökkentése`}
                        onClick={() => handleCycleDigit(i, -1)}
                        className="w-full py-1 text-xs font-bold text-slate-600 hover:text-blue-700 hover:bg-slate-100 rounded cursor-pointer"
                      >
                        ▼
                      </button>
                    </div>
                  ))}
                </div>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={handleTryUnlockDoor}
                    className="py-3 px-5 rounded-lg bg-blue-700 hover:bg-blue-800 text-white font-semibold text-sm transition-colors whitespace-nowrap cursor-pointer"
                  >
                    Ajtó kinyitása
                  </button>
                  {!padlocks.room1 && (
                    <button
                      type="button"
                      onClick={() => onSelectStage('room1')}
                      className="py-3 px-4 rounded-lg border border-slate-300 bg-white hover:bg-slate-100 text-slate-800 font-semibold text-sm inline-flex items-center gap-1.5 whitespace-nowrap cursor-pointer"
                    >
                      <span>1. szoba indítása</span>
                      <ArrowRight className="w-4 h-4" aria-hidden="true" />
                    </button>
                  )}
                </div>
              </div>

              {codeError && (
                <p role="status" className="text-sm font-medium text-rose-800">
                  {codeError}
                </p>
              )}
            </div>
          ) : (
            <div className="p-6 rounded-xl bg-emerald-50 border border-emerald-300 space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-11 h-11 rounded-lg bg-emerald-700 text-white flex items-center justify-center shrink-0">
                  <Award className="w-6 h-6" aria-hidden="true" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-emerald-950">
                    Sikeres szabadulás! Főnévdetektív-oklevél
                  </h2>
                  <p className="text-sm text-emerald-900 mt-1">
                    Gratulálunk, 3. osztály! Eltelt idő: <strong className="font-mono-code">{formatDuration(elapsedSeconds)}</strong> · Kód: <strong className="font-mono-code">{MASTER_CODE}</strong>
                  </p>
                </div>
              </div>
              <p className="text-base font-semibold text-emerald-950 bg-white/80 p-4 rounded-lg border border-emerald-200">
                Közös felfedezésünk: „A szavaknak nevet adó erejük van! A Ki? és Mi? kérdésre felelő szavak élőlényeket (személyeket, állatokat, növényeket), élettelen tárgyakat és gondolati dolgokat neveznek meg.”
              </p>
              <div className="flex flex-wrap gap-3 no-print">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="py-2.5 px-4 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold inline-flex items-center gap-2 cursor-pointer"
                >
                  <Printer className="w-4 h-4" aria-hidden="true" />
                  <span>Oklevél nyomtatása</span>
                </button>
                <button
                  type="button"
                  onClick={onResetAll}
                  className="py-2.5 px-4 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-slate-800 text-sm font-semibold inline-flex items-center gap-2 cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4" aria-hidden="true" />
                  <span>Új küldetés indítása</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right: Illustrated Secret Door */}
        <div className="lg:col-span-5 bg-white border border-slate-200 rounded-xl p-4 flex flex-col justify-between gap-3">
          <div className="relative overflow-hidden rounded-lg border border-slate-200 bg-slate-100 h-full min-h-[260px]">
            {!imgError ? (
              <img
                src={ESCAPE_ASSETS.vaultDoor}
                alt="A Titkos Könyvtár négy lakattal lezárt ajtaja"
                referrerPolicy="no-referrer"
                onError={() => setImgError(true)}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-slate-100">
                <Lock className="w-10 h-10 text-amber-700 mb-2" aria-hidden="true" />
                <p className="font-display font-bold text-slate-800">A Titkos Könyvtár Ajtaja</p>
              </div>
            )}
          </div>
          <p className="text-xs text-slate-500 px-1">
            Minden kinyitott lakat felfedi a négyjegyű kulcs egy-egy számjegyét.
          </p>
        </div>
      </div>

      {/* 4 Padlocks Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {rooms.map((room) => (
          <button
            key={room.id}
            type="button"
            onClick={() => {
              soundFX.playClick();
              onSelectStage(room.id);
            }}
            className={`text-left p-5 rounded-xl border transition-colors flex flex-col justify-between gap-4 cursor-pointer ${
              room.unlocked
                ? 'bg-emerald-50/70 border-emerald-300 hover:bg-emerald-50'
                : 'bg-white border-slate-200 hover:border-blue-500 hover:bg-slate-50'
            }`}
          >
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-bold text-slate-500">{room.num}. lakat</span>
              {room.unlocked ? (
                <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800">
                  <LockOpen className="w-4 h-4 text-emerald-700" aria-hidden="true" />
                  <span>Kód:</span>
                  <span className="font-mono-code text-sm">{room.digit}</span>
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-xs font-semibold text-slate-500">
                  <Lock className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>Zárva</span>
                </span>
              )}
            </div>

            <div>
              <h3 className="text-lg font-bold text-slate-900">{room.title}</h3>
              <p className="text-sm text-slate-600 mt-1">{room.subtitle}</p>
            </div>

            <span className="text-sm font-semibold text-blue-700 inline-flex items-center gap-1">
              <span>{room.unlocked ? 'Megtekintés újra' : 'Belépés a szobába'}</span>
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </span>
          </button>
        ))}
      </div>

      {/* Detective Notebook Collected Words */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Osztályközös Detektívfüzet</h2>
            <p className="text-sm text-slate-600">
              Az eddig felfedezett és összegyűjtött megnevező szavak a szabadulószoba során
            </p>
          </div>
          <span className="font-mono-code text-sm font-bold text-slate-700">
            Összesen: {discoveredWords.length} szó
          </span>
        </div>

        {discoveredWords.length === 0 ? (
          <p className="text-sm text-slate-500 py-3">
            Még üres a detektívfüzet. Kezdjétek az 1. lakattal, a Varázszsák feladványaival!
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {(['person', 'animal', 'object', 'other'] as const).map((cat) => {
              const meta = CATEGORY_META[cat];
              const list = discoveredWords.filter((w) => w.category === cat);
              return (
                <div key={cat} className="p-4 rounded-lg bg-slate-50 border border-slate-200 space-y-2.5">
                  <div className={`inline-flex items-center gap-1.5 text-sm font-bold ${meta.textClass}`}>
                    <CategoryIcon category={cat} className="w-4 h-4 shrink-0" />
                    <span>{meta.shortLabel}</span>
                    <span className="font-mono-code text-xs text-slate-500 ml-1">({list.length})</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {list.length > 0 ? (
                      list.map((item) => (
                        <span
                          key={item.id}
                          className="px-2.5 py-1 rounded bg-white border border-slate-200 text-xs font-semibold text-slate-800"
                        >
                          {item.word}
                        </span>
                      ))
                    ) : (
                      <span className="text-xs text-slate-400">Még nincs találat</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};
