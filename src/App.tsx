import React, { useEffect, useState } from 'react';
import { Lock, LockOpen, Pause, Play, RotateCcw, Volume2, VolumeX } from 'lucide-react';
import { LOCK_DIGITS } from './data/escapeData';
import { CustomCollectedWord, PadlockState, StageId, WordCategory } from './types/escapeRoom';
import { VaultDoorStage } from './components/VaultDoorStage';
import { Room1MagicBag } from './components/Room1MagicBag';
import { Room2WordSorter } from './components/Room2WordSorter';
import { Room3ClassroomHunt } from './components/Room3ClassroomHunt';
import { Room4SpellingVault } from './components/Room4SpellingVault';
import { TeacherPanel } from './components/TeacherPanel';
import { soundFX } from './utils/sound';

const TOTAL_LESSON_SECONDS = 45 * 60;

export default function App() {
  const [activeStage, setActiveStage] = useState<StageId>('overview');
  const [padlocks, setPadlocks] = useState<PadlockState>({
    room1: false,
    room2: false,
    room3: false,
    room4: false,
    escaped: false,
  });
  const [discoveredWords, setDiscoveredWords] = useState<CustomCollectedWord[]>([]);

  // 45-minute classroom timer
  const [secondsLeft, setSecondsLeft] = useState<number>(TOTAL_LESSON_SECONDS);
  const [timerRunning, setTimerRunning] = useState<boolean>(false);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [resetKey, setResetKey] = useState<number>(0);

  useEffect(() => {
    if (!timerRunning || secondsLeft <= 0) return;
    const interval = window.setInterval(() => {
      setSecondsLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => window.clearInterval(interval);
  }, [timerRunning, secondsLeft]);

  const formatTimer = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  const handleToggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    soundFX.enabled = next;
    if (next) soundFX.playClick();
  };

  const handleAddDiscoveredWord = (word: string, category: WordCategory) => {
    const normalized = word.trim();
    if (!normalized) return;
    setDiscoveredWords((prev) => {
      if (prev.some((w) => w.word.toLowerCase() === normalized.toLowerCase())) {
        return prev;
      }
      return [
        ...prev,
        {
          id: `${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
          word: normalized,
          category,
          source: activeStage,
        },
      ];
    });
  };

  const handleUnlockRoom = (roomKey: 'room1' | 'room2' | 'room3' | 'room4') => {
    setPadlocks((prev) => ({ ...prev, [roomKey]: true }));
  };

  const handleEscapeSuccess = () => {
    setPadlocks((prev) => ({ ...prev, escaped: true }));
    setTimerRunning(false);
  };

  const handleResetAll = () => {
    soundFX.playClick();
    setPadlocks({
      room1: false,
      room2: false,
      room3: false,
      room4: false,
      escaped: false,
    });
    setDiscoveredWords([]);
    setSecondsLeft(TOTAL_LESSON_SECONDS);
    setTimerRunning(false);
    setActiveStage('overview');
    setResetKey((k) => k + 1);
  };

  const navItems: Array<{ id: StageId; label: string }> = [
    { id: 'overview', label: 'Titkos Ajtó' },
    { id: 'room1', label: '1. Varázszsák' },
    { id: 'room2', label: '2. Szóválogató' },
    { id: 'room3', label: '3. Nyomozás' },
    { id: 'room4', label: '4. Helyesírás' },
  ];

  const padlockHud = [
    { id: 'room1' as StageId, num: 1, open: padlocks.room1, digit: LOCK_DIGITS.room1 },
    { id: 'room2' as StageId, num: 2, open: padlocks.room2, digit: LOCK_DIGITS.room2 },
    { id: 'room3' as StageId, num: 3, open: padlocks.room3, digit: LOCK_DIGITS.room3 },
    { id: 'room4' as StageId, num: 4, open: padlocks.room4, digit: LOCK_DIGITS.room4 },
  ];

  const elapsedSeconds = TOTAL_LESSON_SECONDS - secondsLeft;

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC] text-[#0F172A]">
      {/* Strict 3-Zone Top Bar */}
      <header className="bg-white border-b border-slate-200 no-print">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between gap-8">
          {/* Zone 1: Single text wordmark */}
          <button
            type="button"
            onClick={() => {
              soundFX.playClick();
              setActiveStage('overview');
            }}
            className="font-display text-xl font-extrabold tracking-tight text-slate-900 whitespace-nowrap shrink-0 cursor-pointer"
          >
            Főnévdetektív
          </button>

          {/* Zone 2: 5 concise single-line nav links */}
          <nav aria-label="Szabadulószoba szobái" className="hidden lg:flex items-center gap-6">
            {navItems.map((item) => {
              const isActive = activeStage === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    soundFX.playClick();
                    setActiveStage(item.id);
                  }}
                  className={`py-1 text-sm font-semibold whitespace-nowrap shrink-0 border-b-2 transition-colors cursor-pointer ${
                    isActive
                      ? 'text-blue-700 border-blue-700'
                      : 'text-slate-600 border-transparent hover:text-slate-900'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Zone 3: 1 primary action */}
          <div className="shrink-0">
            <button
              type="button"
              onClick={() => {
                soundFX.playClick();
                setActiveStage(activeStage === 'teacher' ? 'overview' : 'teacher');
              }}
              className={`px-4 py-2 text-sm font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                activeStage === 'teacher'
                  ? 'bg-blue-700 text-white hover:bg-blue-800'
                  : 'bg-slate-900 text-white hover:bg-slate-800'
              }`}
            >
              {activeStage === 'teacher' ? 'Vissza a játékhoz' : 'Tanári segédlet'}
            </button>
          </div>
        </div>

        {/* Mobile/Tablet Horizontal Nav */}
        <div className="lg:hidden border-t border-slate-100 px-4 py-2 flex items-center gap-4 overflow-x-auto">
          {navItems.map((item) => {
            const isActive = activeStage === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  soundFX.playClick();
                  setActiveStage(item.id);
                }}
                className={`py-1 text-xs font-semibold whitespace-nowrap shrink-0 border-b-2 ${
                  isActive ? 'text-blue-700 border-blue-700' : 'text-slate-600 border-transparent'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </div>
      </header>

      {/* Workspace Mission Control Strip */}
      <div className="bg-white border-b border-slate-200 no-print">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5 flex flex-wrap items-center justify-between gap-4">
          {/* 4 Padlock Digit Progress */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold text-slate-500 mr-1">Lakatok kódjai:</span>
            {padlockHud.map((lock) => (
              <button
                key={lock.id}
                type="button"
                onClick={() => {
                  soundFX.playClick();
                  setActiveStage(lock.id);
                }}
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md border text-xs font-bold transition-colors cursor-pointer ${
                  lock.open
                    ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                    : 'bg-slate-50 border-slate-200 text-slate-600 hover:border-blue-400'
                }`}
              >
                {lock.open ? (
                  <LockOpen className="w-3.5 h-3.5 text-emerald-700" aria-hidden="true" />
                ) : (
                  <Lock className="w-3.5 h-3.5 text-slate-400" aria-hidden="true" />
                )}
                <span>{lock.num}.</span>
                <span className="font-mono-code">{lock.open ? lock.digit : '?'}</span>
              </button>
            ))}
          </div>

          {/* 45-Minute Classroom Timer & Sound Toggle */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-slate-500 hidden sm:inline">Órai időkeret:</span>
            <span
              className={`font-mono-code text-sm font-bold px-2.5 py-1 rounded-md border ${
                secondsLeft < 300
                  ? 'bg-rose-50 border-rose-200 text-rose-800'
                  : 'bg-slate-50 border-slate-200 text-slate-900'
              }`}
            >
              {formatTimer(secondsLeft)}
            </span>
            <button
              type="button"
              onClick={() => {
                soundFX.playClick();
                setTimerRunning((r) => !r);
              }}
              aria-label={timerRunning ? 'Időzítő szüneteltetése' : 'Időzítő indítása'}
              className="p-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 cursor-pointer"
            >
              {timerRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            </button>
            <button
              type="button"
              onClick={() => {
                soundFX.playClick();
                setTimerRunning(false);
                setSecondsLeft(TOTAL_LESSON_SECONDS);
              }}
              aria-label="45 perces időzítő alaphelyzetbe"
              className="p-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={handleToggleSound}
              aria-label={soundEnabled ? 'Hanghatások némítása' : 'Hanghatások bekapcsolása'}
              className="p-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 cursor-pointer"
            >
              {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4 text-slate-400" />}
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Stage */}
      <main key={resetKey} className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 md:py-8">
        {activeStage === 'overview' && (
          <VaultDoorStage
            padlocks={padlocks}
            discoveredWords={discoveredWords}
            elapsedSeconds={elapsedSeconds}
            onSelectStage={(s) => setActiveStage(s)}
            onEscapeSuccess={handleEscapeSuccess}
            onResetAll={handleResetAll}
          />
        )}
        {activeStage === 'room1' && (
          <Room1MagicBag
            isUnlocked={padlocks.room1}
            onUnlock={() => handleUnlockRoom('room1')}
            onGoNext={() => {
              soundFX.playClick();
              setActiveStage('room2');
            }}
            onAddDiscoveredWord={handleAddDiscoveredWord}
          />
        )}
        {activeStage === 'room2' && (
          <Room2WordSorter
            isUnlocked={padlocks.room2}
            onUnlock={() => handleUnlockRoom('room2')}
            onGoNext={() => {
              soundFX.playClick();
              setActiveStage('room3');
            }}
            onAddDiscoveredWord={handleAddDiscoveredWord}
          />
        )}
        {activeStage === 'room3' && (
          <Room3ClassroomHunt
            isUnlocked={padlocks.room3}
            onUnlock={() => handleUnlockRoom('room3')}
            onGoNext={() => {
              soundFX.playClick();
              setActiveStage('room4');
            }}
            onAddDiscoveredWord={handleAddDiscoveredWord}
          />
        )}
        {activeStage === 'room4' && (
          <Room4SpellingVault
            isUnlocked={padlocks.room4}
            onUnlock={() => handleUnlockRoom('room4')}
            onGoEscapeDoor={() => {
              soundFX.playClick();
              setActiveStage('overview');
            }}
            onAddDiscoveredWord={handleAddDiscoveredWord}
          />
        )}
        {activeStage === 'teacher' && <TeacherPanel />}
      </main>

      {/* Quiet Footer */}
      <footer className="border-t border-slate-200 bg-white no-print">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-500">
          <span>Fülöp Mária – Szilágyi Katalin: Nyelvtan és helyesírás 3. · 1. óra – A főnevek titkos világa</span>
          <span>Alapgondolat: A szavaknak nevet adó erejük van!</span>
        </div>
      </footer>
    </div>
  );
}
