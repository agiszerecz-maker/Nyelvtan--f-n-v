import React, { useState } from 'react';
import { Users, Shuffle, Clock, BookOpen, CheckSquare } from 'lucide-react';
import { DEFAULT_STUDENTS_28, LESSON_PHASES, TEXTBOOK_SOURCE } from '../data/escapeData';
import { soundFX } from '../utils/sound';

export const TeacherPanel: React.FC = () => {
  const [rosterText, setRosterText] = useState<string>(DEFAULT_STUDENTS_28.join('\n'));
  const [groupMode, setGroupMode] = useState<'pairs' | 'groups4'>('pairs');
  const [shuffledNames, setShuffledNames] = useState<string[]>(DEFAULT_STUDENTS_28);
  const [activeTeamIndex, setActiveTeamIndex] = useState<number | null>(null);

  const parseNames = (text: string) =>
    text
      .split(/[\n,;]+/)
      .map((s) => s.trim())
      .filter(Boolean);

  const handleApplyAndShuffle = () => {
    soundFX.playClick();
    const list = parseNames(rosterText);
    const copy = [...list];
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    setShuffledNames(copy);
    setActiveTeamIndex(null);
  };

  const handlePickRandomTeam = () => {
    soundFX.playCorrect();
    const size = groupMode === 'pairs' ? 2 : 4;
    const totalTeams = Math.ceil(shuffledNames.length / size);
    if (totalTeams === 0) return;
    setActiveTeamIndex(Math.floor(Math.random() * totalTeams));
  };

  const chunkSize = groupMode === 'pairs' ? 2 : 4;
  const teams: string[][] = [];
  for (let i = 0; i < shuffledNames.length; i += chunkSize) {
    teams.push(shuffledNames.slice(i, i + chunkSize));
  }

  return (
    <section className="space-y-6">
      <div className="border-b border-slate-200 pb-5">
        <p className="text-sm font-medium text-blue-700 mb-1">
          Tanári segédlet · {TEXTBOOK_SOURCE}
        </p>
        <h2 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight" style={{ textWrap: 'balance' }}>
          Óravázlat és 28 fős páros / csoportos szervező
        </h2>
        <p className="text-slate-600 mt-1 max-w-3xl">
          A szabadulószoba a tankönyvi felosztásra (élőlény, élettelen tárgy, gondolati dolog), a Ki? / Mi? kérdőszavakra, valamint a közös és saját nevek helyesírási tapasztalására épül.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Lesson Plan & Objectives */}
        <div className="lg:col-span-5 space-y-5">
          <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-3">
            <div className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-blue-700" aria-hidden="true" />
              <h3 className="text-base font-bold text-slate-900">A tanóra pedagógiai céljai</h3>
            </div>
            <p className="text-sm font-semibold text-slate-800 bg-blue-50 border border-blue-200 p-3 rounded-lg">
              Alapgondolat: A szavaknak nevet adó erejük van! (Még nem a nyelvtani definíció megtanulása a cél.)
            </p>
            <ul className="space-y-2 text-sm text-slate-700">
              <li className="flex items-start gap-2">
                <CheckSquare className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" aria-hidden="true" />
                <span>Fedezzék fel, hogy vannak szavaink, amelyek valakit vagy valamit megneveznek.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckSquare className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" aria-hidden="true" />
                <span>Tudjanak példákat mondani személyekre, állatokra, tárgyakra és egyéb dolgokra.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckSquare className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" aria-hidden="true" />
                <span>Fejlődjön szókincsük, szóbeli kifejezőkészségük a páros mondatalkotásokkal.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckSquare className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" aria-hidden="true" />
                <span>Gyakorolják a szavak pontos leírását, helyesírását a 4. lakatnál.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckSquare className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" aria-hidden="true" />
                <span>Tudjanak párban (14 pár) és kisebb csoportban (7×4 fő) együttműködni.</span>
              </li>
            </ul>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-3">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-blue-700" aria-hidden="true" />
              <h3 className="text-base font-bold text-slate-900">45 perces időbeosztás</h3>
            </div>
            <div className="divide-y divide-slate-100">
              {LESSON_PHASES.map((item) => (
                <div key={item.phase} className="py-3 first:pt-1 last:pb-1 space-y-1">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-sm font-bold text-slate-900">{item.phase}</span>
                    <span className="font-mono-code text-xs font-bold text-blue-800">{item.duration}</span>
                  </div>
                  <p className="text-xs font-medium text-slate-500">{item.workform}</p>
                  <p className="text-xs text-slate-600 leading-relaxed">{item.goal}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: 28-Student Team & Pair Organizer */}
        <div className="lg:col-span-7 bg-white border border-slate-200 rounded-xl p-5 space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-blue-700" aria-hidden="true" />
              <h3 className="text-base font-bold text-slate-900">
                Osztályszervező ({shuffledNames.length} tanuló)
              </h3>
            </div>

            <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg">
              <button
                type="button"
                onClick={() => {
                  soundFX.playClick();
                  setGroupMode('pairs');
                  setActiveTeamIndex(null);
                }}
                className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                  groupMode === 'pairs' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                14 pár (2 fő)
              </button>
              <button
                type="button"
                onClick={() => {
                  soundFX.playClick();
                  setGroupMode('groups4');
                  setActiveTeamIndex(null);
                }}
                className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                  groupMode === 'groups4' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                7 csoport (4 fő)
              </button>
            </div>
          </div>

          <div className="flex flex-wrap gap-2.5">
            <button
              type="button"
              onClick={handleApplyAndShuffle}
              className="py-2 px-4 rounded-lg bg-blue-700 hover:bg-blue-800 text-white text-sm font-semibold inline-flex items-center gap-2 cursor-pointer"
            >
              <Shuffle className="w-4 h-4" aria-hidden="true" />
              <span>Csapatok véletlenszerű sorsolása</span>
            </button>
            <button
              type="button"
              onClick={handlePickRandomTeam}
              className="py-2 px-4 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-slate-900 text-sm font-semibold cursor-pointer"
            >
              Következő válaszoló {groupMode === 'pairs' ? 'pár' : 'csoport'} kisorsolása
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {teams.map((members, idx) => {
              const isHighlighted = activeTeamIndex === idx;
              return (
                <div
                  key={idx}
                  className={`p-3.5 rounded-lg border transition-colors ${
                    isHighlighted
                      ? 'bg-amber-50 border-amber-400 shadow-sm'
                      : 'bg-slate-50 border-slate-200'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-slate-500">
                      {idx + 1}. {groupMode === 'pairs' ? 'detektívpár' : 'detektívcsapat'}
                    </span>
                    {isHighlighted && (
                      <span className="text-xs font-bold text-amber-900">Most ti jöttök!</span>
                    )}
                  </div>
                  <p className="text-sm font-bold text-slate-900">{members.join(' · ')}</p>
                </div>
              );
            })}
          </div>

          <details className="border-t border-slate-200 pt-4">
            <summary className="text-sm font-semibold text-slate-700 cursor-pointer hover:text-blue-700">
              Osztálynévsor szerkesztése (28 tanuló neve)
            </summary>
            <div className="mt-3 space-y-2">
              <textarea
                rows={4}
                value={rosterText}
                onChange={(e) => setRosterText(e.target.value)}
                aria-label="Tanulók nevei vesszővel vagy új sorral elválasztva"
                className="w-full p-3 rounded-lg border border-slate-300 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
              <button
                type="button"
                onClick={handleApplyAndShuffle}
                className="py-2 px-4 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold cursor-pointer"
              >
                Névsor frissítése és újrarendezése
              </button>
            </div>
          </details>
        </div>
      </div>
    </section>
  );
};
