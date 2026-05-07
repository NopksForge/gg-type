'use client';

import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import {
  getSentencePool, AMBIENT_CHAT, CHAT_AUTHORS,
  type Mode, type Lang, type PackName,
} from '@/app/lib/word-packs';
import {
  useTweaks, TweaksPanel, TweakSection,
  TweakRadio, TweakToggle, TweakColor, TweakButton,
} from '@/app/components/tweaks-panel';

// ── helpers ──────────────────────────────────────────────────────────────────

const pick = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];
const rand = (lo: number, hi: number) => lo + Math.random() * (hi - lo);
const HISTORY_KEY = 'ggtype.history.v1';

function nowStamp() {
  const d = new Date();
  return `${String(d.getMinutes()).padStart(2, '0')}:${String(d.getSeconds()).padStart(2, '0')}`;
}
function pickAuthor(team: 'ally' | 'enemy') {
  return pick(CHAT_AUTHORS[team]);
}

// ── types ─────────────────────────────────────────────────────────────────────

interface TweakValues {
  mode: Mode;
  theme: string[];
  pack: PackName;
  lang: Lang;
  duration: number;
  autoRage: boolean;
}

interface HistoryEntry {
  id: string; mode: Mode; pack: PackName; lang: Lang; duration: number;
  wpm: number; acc: number; sentences: number; errors: number; ts: number;
}

interface ChatMessage {
  id: string; time: string;
  team: 'ally' | 'enemy' | 'system' | 'you' | 'all';
  name: string; role?: string; text: string;
}

// ── GlitchMark ───────────────────────────────────────────────────────────────

function GlitchMark({ mode, accent, size = 22 }: { mode: Mode; accent: string; size?: number }) {
  return (
    <div className={`gg-mark gg-mark--${mode}`}
         style={{ '--gg-accent': accent, fontSize: size } as React.CSSProperties}>
      <span className="gg-mark__layer gg-mark__layer--base">GGType</span>
      <span className="gg-mark__layer gg-mark__layer--r" aria-hidden="true">GGType</span>
      <span className="gg-mark__layer gg-mark__layer--g" aria-hidden="true">GGType</span>
      <span className="gg-mark__scan" aria-hidden="true" />
    </div>
  );
}

// ── TopBar ────────────────────────────────────────────────────────────────────

interface TopBarProps {
  mode: Mode; pack: PackName; lang: Lang; accent: string; status: string;
  runId: number; timeLeft: number; totalTime: number; running: boolean;
}

function TopBar({ mode, pack, lang, accent, status, runId, timeLeft, totalTime, running }: TopBarProps) {
  const time = useClock();
  const pct = totalTime > 0 ? (timeLeft / totalTime) * 100 : 100;
  const lowTime = running && timeLeft <= 5 && timeLeft > 0;
  return (
    <header className="hud-top">
      <div className="hud-top__l">
        <GlitchMark mode={mode} accent={accent} />
        <span className="hud-pip" />
        <span className="hud-meta">MATCH #{String(runId).padStart(4, '0')}</span>
        <span className="hud-meta">{pack.toUpperCase()}</span>
        <span className="hud-meta">{lang.toUpperCase()}</span>
      </div>
      <div className="hud-top__c">
        <div className={`hud-mode hud-mode--${mode}`}>
          <span className="hud-mode__dot" />
          {mode === 'hype' ? 'HYPE MODE · BE NICE' : 'RAGE MODE · NO MERCY'}
        </div>
      </div>
      <div className="hud-top__r">
        <div className={`hud-timer ${lowTime ? 'hud-timer--low' : ''}`}>
          <span className="hud-timer__l">TIME</span>
          <span className="hud-timer__v">{Math.ceil(timeLeft)}<small>s</small></span>
          <span className="hud-timer__bar"><i style={{ width: `${pct}%` }} /></span>
        </div>
        <span className="hud-meta">{status}</span>
        <span className="hud-meta hud-meta--time">{time}</span>
      </div>
    </header>
  );
}

function useClock() {
  const [t, setT] = useState('');
  useEffect(() => {
    setT(formatTime(new Date()));
    const id = setInterval(() => setT(formatTime(new Date())), 1000);
    return () => clearInterval(id);
  }, []);
  return t;
}
const formatTime = (d: Date) =>
  `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}:${String(d.getSeconds()).padStart(2, '0')}`;

// ── PlayerPanel ───────────────────────────────────────────────────────────────

interface PlayerPanelProps {
  accent: string; wpm: number; acc: number; sentences: number;
  errors: number; timeLeft: number; totalTime: number; phase: string;
}

function PlayerPanel({ accent, wpm, acc, sentences, errors, timeLeft, totalTime, phase }: PlayerPanelProps) {
  const progress = totalTime > 0 ? (1 - timeLeft / totalTime) : 0;
  return (
    <aside className="pnl pnl--l">
      <div className="pnl__hd">
        <span className="pnl__role">YOU · LIVE</span>
        <span className="pnl__rank" style={{ color: accent }}>CHALLENGER</span>
      </div>
      <div className="pnl__id">
        <div className="pnl__avatar" style={{ background: accent }}>YOU</div>
        <div>
          <div className="pnl__name" style={{ color: accent }}>player_01</div>
          <div className="pnl__tag">@you · region: SEA</div>
        </div>
      </div>
      <div className="pnl__statgrid">
        <div className="pnl__stat">
          <span className="pnl__stat-l">WPM</span>
          <span className="pnl__stat-v" style={{ color: accent }}>{Math.round(wpm)}</span>
        </div>
        <div className="pnl__stat">
          <span className="pnl__stat-l">ACC</span>
          <span className="pnl__stat-v">{Math.round(acc)}<small>%</small></span>
        </div>
        <div className="pnl__stat">
          <span className="pnl__stat-l">SENT</span>
          <span className="pnl__stat-v">{sentences}</span>
        </div>
        <div className="pnl__stat">
          <span className="pnl__stat-l">ERR</span>
          <span className="pnl__stat-v" style={{ color: errors > 0 ? '#ff5050' : undefined }}>{errors}</span>
        </div>
      </div>
      <div className="pnl__sect">
        <div className="pnl__sect-l">MATCH PROGRESS</div>
        <div className="pnl__bar">
          <div className="pnl__bar-fill" style={{ width: `${progress * 100}%`, background: accent }} />
          <div className="pnl__bar-ticks">
            {Array.from({ length: 10 }).map((_, i) => <i key={i} />)}
          </div>
        </div>
        <div className="pnl__bar-meta">
          <span>{phase === 'play' ? 'IN PROGRESS' : phase === 'done' ? 'COMPLETE' : 'STANDBY'}</span>
          <span>{Math.round(progress * 100)}%</span>
        </div>
      </div>
      <div className="pnl__sect">
        <div className="pnl__sect-l">PERFORMANCE</div>
        <div className="pnl__pf">
          <div className="pnl__pf-row">
            <span>RHYTHM</span>
            <div className="pnl__pf-bar"><i style={{ width: `${Math.min(100, wpm * 1.1)}%`, background: accent }} /></div>
          </div>
          <div className="pnl__pf-row">
            <span>PRECISION</span>
            <div className="pnl__pf-bar"><i style={{ width: `${acc}%`, background: accent }} /></div>
          </div>
          <div className="pnl__pf-row">
            <span>FOCUS</span>
            <div className="pnl__pf-bar"><i style={{ width: `${Math.max(0, 100 - errors * 8)}%`, background: accent }} /></div>
          </div>
        </div>
      </div>
      <div className="pnl__keys-lbl">EQUIPPED · QWERTY</div>
      <div className="pnl__keys">
        {['Q', 'W', 'E', 'R', 'T', 'Y'].map(k => (
          <span key={k} className="pnl__key">{k}</span>
        ))}
      </div>
    </aside>
  );
}

// ── HistoryPanel ──────────────────────────────────────────────────────────────

interface HistoryPanelProps {
  history: HistoryEntry[]; accent: string; onClear: () => void;
}

function HistoryPanel({ history, accent, onClear }: HistoryPanelProps) {
  const best = history.reduce<HistoryEntry | null>((b, h) => h.wpm > (b?.wpm ?? 0) ? h : b, null);
  const avgWpm = history.length === 0 ? 0 : history.reduce((s, h) => s + h.wpm, 0) / history.length;
  const avgAcc = history.length === 0 ? 0 : history.reduce((s, h) => s + h.acc, 0) / history.length;
  return (
    <aside className="pnl pnl--r">
      <div className="pnl__hd">
        <span className="pnl__role">MATCH HISTORY</span>
        <span className="pnl__rank">×{history.length}</span>
      </div>
      <div className="pnl__statgrid">
        <div className="pnl__stat">
          <span className="pnl__stat-l">BEST WPM</span>
          <span className="pnl__stat-v" style={{ color: accent }}>{Math.round(best?.wpm ?? 0)}</span>
        </div>
        <div className="pnl__stat">
          <span className="pnl__stat-l">AVG WPM</span>
          <span className="pnl__stat-v">{Math.round(avgWpm)}</span>
        </div>
        <div className="pnl__stat">
          <span className="pnl__stat-l">AVG ACC</span>
          <span className="pnl__stat-v">{Math.round(avgAcc)}<small>%</small></span>
        </div>
        <div className="pnl__stat">
          <span className="pnl__stat-l">PLAYED</span>
          <span className="pnl__stat-v">{history.length}</span>
        </div>
      </div>
      <div className="pnl__sect">
        <div className="pnl__sect-l">RECENT MATCHES</div>
        <div className="hist">
          {history.length === 0 && (
            <div className="hist__empty">no matches yet — finish a run to log it</div>
          )}
          {history.slice(0, 8).map((h, i) => (
            <div key={h.id} className={`hist__row hist__row--${h.mode}`}>
              <div className="hist__rank">#{history.length - i}</div>
              <div className="hist__main">
                <div className="hist__top">
                  <span className={`hist__mode hist__mode--${h.mode}`}>
                    {h.mode === 'rage' ? '☠ RAGE' : '★ HYPE'}
                  </span>
                  <span className="hist__pack">{h.pack}</span>
                  <span className="hist__lang">{h.lang}</span>
                  <span className="hist__dur">{h.duration}s</span>
                </div>
                <div className="hist__bot">
                  <span><b>{Math.round(h.wpm)}</b> WPM</span>
                  <span><b>{Math.round(h.acc)}%</b> ACC</span>
                  <span><b>{h.sentences}</b> SENT</span>
                </div>
                <div className="hist__bar">
                  <i style={{ width: `${Math.min(100, h.wpm * 1.1)}%`,
                              background: h.mode === 'rage' ? '#ff2d2d' : '#7CFF3F' }} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      {history.length > 0 && (
        <div className="pnl__sect" style={{ marginTop: 'auto' }}>
          <button className="pnl__clear" onClick={onClear}>✕ CLEAR HISTORY</button>
        </div>
      )}
    </aside>
  );
}

// ── ChatMsg ───────────────────────────────────────────────────────────────────

function ChatMsg({ msg }: { msg: ChatMessage }) {
  const teamCls = msg.team === 'ally' ? 'cm--ally'
                : msg.team === 'enemy' ? 'cm--enemy'
                : msg.team === 'system' ? 'cm--system'
                : msg.team === 'you' ? 'cm--you'
                : 'cm--all';
  const teamLbl = msg.team === 'ally' ? '[ALLY]'
                : msg.team === 'enemy' ? '[ENEMY]'
                : msg.team === 'system' ? '[SYSTEM]'
                : msg.team === 'you' ? '[YOU]'
                : '[ALL]';
  return (
    <div className={`cm ${teamCls}`}>
      <span className="cm__time">{msg.time}</span>
      <span className="cm__team">{teamLbl}</span>
      {msg.role && <span className="cm__role">{msg.role}</span>}
      <span className="cm__name">{msg.name}:</span>
      <span className="cm__txt">{msg.text}</span>
    </div>
  );
}

// ── Compose ───────────────────────────────────────────────────────────────────

interface ComposeProps {
  prompt: string; typed: string; onChange: (v: string) => void; onSubmit: () => void;
  focused: boolean; onFocus: () => void; mode: Mode; finished: boolean; locked: boolean;
}

function Compose({ prompt, typed, onChange, onSubmit, focused, onFocus, mode, finished, locked }: ComposeProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (focused && !finished && !locked) inputRef.current?.focus();
  }, [focused, finished, prompt, locked]);

  const chars = useMemo(() => {
    const out = [];
    for (let i = 0; i < prompt.length; i++) {
      const exp = prompt[i];
      const got = typed[i];
      let cls = 'tx tx--pending';
      if (got != null) cls = got === exp ? 'tx tx--ok' : 'tx tx--bad';
      if (i === typed.length) cls += ' tx--cur';
      out.push(<span key={i} className={cls}>{exp === ' ' ? ' ' : exp}</span>);
    }
    if (typed.length >= prompt.length) {
      out.push(<span key="end" className="tx tx--cur tx--end">{' '}</span>);
    }
    return out;
  }, [prompt, typed]);

  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (typed.length === prompt.length) onSubmit();
    }
  };

  return (
    <div className={`cmp cmp--${mode} ${finished ? 'cmp--done' : ''}`}
         onClick={() => !locked && inputRef.current?.focus()}>
      <div className="cmp__prefix">
        <span className="cmp__team">[ALL]</span>
        <span className="cmp__name">player_01:</span>
      </div>
      <div className="cmp__line">
        <span className="cmp__text">{chars}</span>
      </div>
      <div className="cmp__hint">
        {finished ? 'MATCH OVER' :
         typed.length === prompt.length
           ? <><kbd>ENTER</kbd> SEND</>
           : <><kbd>TYPE</kbd> the message · <kbd>ENTER</kbd> to send</>}
      </div>
      <input
        ref={inputRef}
        className="cmp__input"
        autoComplete="off" autoCorrect="off" autoCapitalize="off" spellCheck={false}
        value={typed}
        onFocus={onFocus}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={onKey}
        disabled={finished || locked}
      />
    </div>
  );
}

// ── SettingsGate ──────────────────────────────────────────────────────────────

interface SettingsGateDefaults {
  mode: Mode; duration: number; pack: PackName; lang: Lang;
}

function SettingsGate({ defaults, onStart }: {
  defaults: SettingsGateDefaults;
  onStart: (cfg: SettingsGateDefaults) => void;
}) {
  const [mode, setMode] = useState<Mode>(defaults.mode);
  const [duration, setDuration] = useState(defaults.duration);
  const [pack, setPack] = useState<PackName>(defaults.pack);
  const [lang, setLang] = useState<Lang>(defaults.lang);
  const accent = mode === 'rage' ? '#ff2d2d' : '#7CFF3F';
  return (
    <div className="gate">
      <div className={`gate__inner gate__inner--${mode}`} style={{ '--gg-accent': accent } as React.CSSProperties}>
        <div className="gate__top">
          <GlitchMark mode={mode} accent={accent} size={42} />
          <div className="gate__sub">CONFIGURE YOUR LOBBY</div>
        </div>
        <div className="gate__grid">
          <div className="gate__field gate__field--wide">
            <label>VIBE</label>
            <div className="gate__vibe">
              <button type="button"
                      className={`gate__vibe-card ${mode === 'hype' ? 'is-on' : ''}`}
                      style={{ '--c': '#7CFF3F' } as React.CSSProperties}
                      onClick={() => setMode('hype')}>
                <div className="gate__vibe-icon">★</div>
                <div className="gate__vibe-name">HYPE</div>
                <div className="gate__vibe-desc">teammates cheer you on</div>
                <div className="gate__vibe-tag">BE NICE</div>
              </button>
              <button type="button"
                      className={`gate__vibe-card ${mode === 'rage' ? 'is-on' : ''}`}
                      style={{ '--c': '#ff2d2d' } as React.CSSProperties}
                      onClick={() => setMode('rage')}>
                <div className="gate__vibe-icon">☠</div>
                <div className="gate__vibe-name">RAGE</div>
                <div className="gate__vibe-desc">trash talk · zero mercy</div>
                <div className="gate__vibe-tag">NO MERCY</div>
              </button>
            </div>
          </div>
          <div className="gate__field">
            <label>DURATION</label>
            <div className="gate__chips">
              {[15, 30, 60, 120].map(d => (
                <button key={d} type="button"
                        className={`gate__chip ${duration === d ? 'is-on' : ''}`}
                        onClick={() => setDuration(d)}>{d}<small>s</small></button>
              ))}
            </div>
          </div>
          <div className="gate__field">
            <label>LANGUAGE</label>
            <div className="gate__chips">
              {([{ v: 'en', l: 'EN' }, { v: 'th', l: 'TH' }] as const).map(o => (
                <button key={o.v} type="button"
                        className={`gate__chip ${lang === o.v ? 'is-on' : ''}`}
                        onClick={() => setLang(o.v)}>{o.l}</button>
              ))}
            </div>
          </div>
          <div className="gate__field gate__field--wide">
            <label>GAME · WORD POOL</label>
            <div className="gate__chips gate__chips--game">
              {([
                { v: 'overwatch', l: 'Overwatch' },
                { v: 'dota2', l: 'Dota 2' },
                { v: 'lol', l: 'League of Legends' },
              ] as const).map(o => (
                <button key={o.v} type="button"
                        className={`gate__chip gate__chip--game ${pack === o.v ? 'is-on' : ''}`}
                        onClick={() => setPack(o.v)}>{o.l}</button>
              ))}
            </div>
          </div>
        </div>
        <div className="gate__actions">
          <button type="button" className="gate__start"
                  onClick={() => onStart({ mode, duration, pack, lang })}>
            <span className="gate__start-pre">▶</span>
            START MATCH
            <span className="gate__start-kbd">ENTER</span>
          </button>
          <div className="gate__hint">
            {mode === 'rage'
              ? "don't embarrass yourself out there."
              : 'breathe. focus. you got this ✦'}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Countdown ─────────────────────────────────────────────────────────────────

function Countdown({ value, mode }: { value: number; mode: Mode }) {
  return (
    <div className={`cdn cdn--${mode}`}>
      <div className="cdn__inner">
        <div className="cdn__lbl">MATCH STARTS IN</div>
        <div key={value} className="cdn__num">
          {value > 0 ? value : 'GO!'}
        </div>
        <div className="cdn__bar"><i style={{ animationDuration: '1s' }} /></div>
      </div>
    </div>
  );
}

// ── Results ───────────────────────────────────────────────────────────────────

interface ResultsProps {
  wpm: number; acc: number; sentences: number; errors: number;
  mode: Mode; lang: Lang; onRestart: () => void; onMenu: () => void;
}

function Results({ wpm, acc, sentences, errors, mode, lang, onRestart, onMenu }: ResultsProps) {
  const headline = useMemo(() => {
    if (mode === 'rage') {
      if (lang === 'th') return sentences > 5 ? 'พอใช้ได้ มั้ง' : 'แตกแล้ว GG';
      return sentences > 5 ? 'fine. acceptable.' : 'absolute dogwater run';
    }
    if (lang === 'th') return sentences > 5 ? 'ทำได้ดีมาก!' : 'พยายามต่อนะ!';
    return sentences > 5 ? 'GREAT RUN!' : 'KEEP GOING — YOU GOT THIS';
  }, [mode, lang, sentences]);

  return (
    <div className={`results results--${mode}`}>
      <div className="results__inner">
        <div className="results__lbl">MATCH COMPLETE</div>
        <div className="results__head">{headline}</div>
        <div className="results__grid">
          <div><span>WPM</span><b>{Math.round(wpm)}</b></div>
          <div><span>ACCURACY</span><b>{Math.round(acc)}%</b></div>
          <div><span>SENTENCES</span><b>{sentences}</b></div>
          <div><span>ERRORS</span><b>{errors}</b></div>
        </div>
        <div className="results__btns">
          <button className="gg-btn gg-btn--primary" onClick={onRestart}>
            <span className="gg-btn__kbd">TAB</span> NEW MATCH
          </button>
          <button className="gg-btn" onClick={onMenu}>← LOBBY</button>
        </div>
      </div>
    </div>
  );
}

// ── Main App ──────────────────────────────────────────────────────────────────

const TWEAK_DEFAULTS: TweakValues = {
  mode: 'hype',
  theme: ['#07090a', '#7CFF3F', '#0e1113'],
  pack: 'overwatch',
  lang: 'en',
  duration: 30,
  autoRage: true,
};

export default function GGTypeApp() {
  const [t, setTweak] = useTweaks<TweakValues>(TWEAK_DEFAULTS);
  const accent = t.theme[1];
  const bg = t.theme[0];
  const panel = t.theme[2];

  type Phase = 'menu' | 'countdown' | 'play' | 'done';
  const [phase, setPhase] = useState<Phase>('menu');
  const [cdValue, setCdValue] = useState(3);

  const [runId, setRunId] = useState(1);
  const [prompt, setPrompt] = useState('');
  const [typed, setTyped] = useState('');
  const [focused, setFocused] = useState(false);
  const [startedAt, setStartedAt] = useState<number | null>(null);
  const [now, setNow] = useState(0);
  const [errors, setErrors] = useState(0);
  const [sentencesSent, setSentencesSent] = useState(0);
  const [correctCharsTotal, setCorrectCharsTotal] = useState(0);
  const [totalCharsTyped, setTotalCharsTyped] = useState(0);
  const [chat, setChat] = useState<ChatMessage[]>([]);
  const [autoRageFlipped, setAutoRageFlipped] = useState(false);
  const [shake, setShake] = useState(false);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const chatScrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      const saved: HistoryEntry[] = JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]');
      if (saved.length > 0) setHistory(saved);
    } catch { /* noop */ }
  }, []);

  const duration = t.duration || 30;
  const timeLeft = startedAt && phase === 'play'
    ? Math.max(0, duration - now)
    : phase === 'done' ? 0 : duration;

  const startMatch = useCallback((cfg: SettingsGateDefaults) => {
    setTweak(cfg);
    setRunId(r => r + 1);
    setTyped(''); setStartedAt(null); setNow(0); setErrors(0);
    setSentencesSent(0); setCorrectCharsTotal(0); setTotalCharsTyped(0);
    setAutoRageFlipped(false);
    const pool = getSentencePool(cfg.pack, cfg.lang, cfg.mode);
    setPrompt(pick(pool));
    setChat([{
      id: `sys-${Date.now()}`, team: 'system', name: 'GGType',
      text: cfg.mode === 'rage'
        ? `match queued · ${cfg.duration}s · don't choke`
        : `match queued · ${cfg.duration}s · you got this!`,
      time: nowStamp(),
    }]);
    setCdValue(3);
    setPhase('countdown');
  }, [setTweak]);

  // countdown engine
  useEffect(() => {
    if (phase !== 'countdown') return;
    if (cdValue === 0) {
      const id = setTimeout(() => {
        setPhase('play');
        setStartedAt(performance.now());
      }, 600);
      return () => clearTimeout(id);
    }
    const id = setTimeout(() => setCdValue(v => v - 1), 1000);
    return () => clearTimeout(id);
  }, [phase, cdValue]);

  // tick clock
  useEffect(() => {
    if (phase !== 'play' || !startedAt) return;
    let raf: number;
    const tick = () => {
      const elapsed = (performance.now() - startedAt) / 1000;
      setNow(elapsed);
      if (elapsed >= duration) { setPhase('done'); return; }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [phase, startedAt, duration]);

  // ambient chat
  useEffect(() => {
    if (phase !== 'play') return;
    let id: ReturnType<typeof setTimeout>;
    const schedule = () => {
      id = setTimeout(() => {
        const team = Math.random() < 0.55 ? 'ally' : 'enemy';
        const author = pickAuthor(team);
        const lines = AMBIENT_CHAT[t.mode][t.lang];
        pushChat({ team, name: author.name, role: author.role, text: pick(lines) });
        schedule();
      }, rand(2200, 5200));
    };
    schedule();
    return () => clearTimeout(id);
  }, [phase, t.mode, t.lang]); // eslint-disable-line react-hooks/exhaustive-deps

  // auto-scroll chat
  useEffect(() => {
    const el = chatScrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [chat]);

  const pushChat = useCallback((m: Omit<ChatMessage, 'id' | 'time'>) => {
    setChat((cs) => {
      const next = [...cs, { id: `m-${Date.now()}-${Math.random()}`, time: nowStamp(), ...m }];
      return next.slice(-50);
    });
  }, []);

  const pushSystem = useCallback((text: string) => {
    pushChat({ team: 'system', name: 'GGType', text });
  }, [pushChat]);

  // auto-rage side-effect
  useEffect(() => {
    if (phase !== 'play' || t.mode !== 'rage' || !autoRageFlipped) return;
    pushSystem('rage mode engaged · no mercy');
    const pool = getSentencePool(t.pack, t.lang, 'rage');
    setPrompt(pick(pool));
  }, [autoRageFlipped]); // eslint-disable-line react-hooks/exhaustive-deps

  // stats
  const correctCharsCurrent = useMemo(() => {
    let n = 0;
    for (let i = 0; i < typed.length; i++) if (typed[i] === prompt[i]) n++;
    return n;
  }, [typed, prompt]);

  const totalCorrect = correctCharsTotal + correctCharsCurrent;
  const totalTyped = totalCharsTyped + typed.length;
  const minutes = Math.max(now / 60, 1 / 60);
  const wpm = phase === 'play' || phase === 'done' ? (totalCorrect / 5) / minutes : 0;
  const acc = totalTyped === 0 ? 100 : (totalCorrect / totalTyped) * 100;

  // auto-rage trigger
  useEffect(() => {
    if (phase !== 'play') return;
    if (!t.autoRage || autoRageFlipped || t.mode === 'rage') return;
    if (totalTyped >= 12 && acc < 85) {
      setTweak({ mode: 'rage' });
      setAutoRageFlipped(true);
      setShake(true);
      setTimeout(() => setShake(false), 700);
    }
  }, [acc, totalTyped, t.autoRage, t.mode, autoRageFlipped, phase, setTweak]);

  // error tracking
  const lastTypedRef = useRef('');
  useEffect(() => {
    const prev = lastTypedRef.current;
    lastTypedRef.current = typed;
    if (typed.length > prev.length) {
      const i = typed.length - 1;
      if (typed[i] !== prompt[i]) setErrors((e) => e + 1);
    }
  }, [typed, prompt]);

  // submit
  const submit = useCallback(() => {
    if (phase !== 'play') return;
    if (typed.length !== prompt.length) return;
    pushChat({ team: 'you', name: 'player_01', role: 'YOU', text: prompt });
    setSentencesSent((s) => s + 1);
    setCorrectCharsTotal((c) => c + correctCharsCurrent);
    setTotalCharsTyped((c) => c + typed.length);
    setTyped('');
    const pool = getSentencePool(t.pack, t.lang, t.mode);
    let next = prompt;
    let guard = 0;
    while (next === prompt && guard < 10) { next = pick(pool); guard++; }
    setPrompt(next);
    if (Math.random() < 0.65) {
      const team = Math.random() < 0.5 ? 'ally' : 'enemy';
      const author = pickAuthor(team);
      const reactions = t.mode === 'rage'
        ? ['k.', 'no one cares', 'shut up and play', 'cope', 'stfu']
        : ['nice!', '+1', 'agreed', 'on it', 'gotcha', 'good call'];
      const thReactions = t.mode === 'rage'
        ? ['ก็แค่นั้น', 'เงียบไปเลย', 'ไม่มีใครสน']
        : ['โอเค!', 'รับทราบ', 'เห็นด้วย', 'จัดการเอง'];
      const lines = t.lang === 'th' ? thReactions : reactions;
      setTimeout(() => pushChat({ team, name: author.name, role: author.role, text: pick(lines) }), 350);
    }
  }, [typed, prompt, phase, correctCharsCurrent, t.pack, t.lang, t.mode, pushChat]);

  // match end — log history
  useEffect(() => {
    if (phase !== 'done') return;
    pushSystem(t.mode === 'rage'
      ? `match over. ${sentencesSent} sentences. mediocre.`
      : `match complete! ${sentencesSent} sentences sent · GG!`);
    const entry: HistoryEntry = {
      id: `h-${Date.now()}`,
      mode: t.mode, pack: t.pack, lang: t.lang, duration: t.duration,
      wpm, acc, sentences: sentencesSent, errors,
      ts: Date.now(),
    };
    setHistory((h) => {
      const next = [entry, ...h].slice(0, 25);
      try { localStorage.setItem(HISTORY_KEY, JSON.stringify(next)); } catch { /* noop */ }
      return next;
    });
  }, [phase]); // eslint-disable-line react-hooks/exhaustive-deps

  // type handler
  const handleType = (val: string) => {
    if (val.length > prompt.length) return;
    if (phase !== 'play') return;
    setTyped(val);
  };

  // tab → back to menu
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Tab') { e.preventDefault(); setPhase('menu'); }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const clearHistory = () => {
    setHistory([]);
    try { localStorage.removeItem(HISTORY_KEY); } catch { /* noop */ }
  };

  const isMenu = phase === 'menu';
  const isCountdown = phase === 'countdown';
  const isDone = phase === 'done';

  return (
    <div className={`gg-root gg-root--${t.mode} ${shake ? 'gg-shake' : ''}`}
         style={{ '--gg-bg': bg, '--gg-accent': accent, '--gg-panel': panel } as React.CSSProperties}>
      <div className="gg-grid-bg" />
      <div className="gg-scan-bg" />

      <TopBar mode={t.mode} pack={t.pack} lang={t.lang} accent={accent}
              status={isDone ? 'COMPLETE' : phase === 'play' ? 'LIVE'
                      : isCountdown ? 'STARTING' : 'LOBBY'}
              runId={runId} timeLeft={timeLeft} totalTime={duration}
              running={phase === 'play'} />

      <main className="gg-main">
        <PlayerPanel accent={accent}
                     wpm={wpm} acc={acc} sentences={sentencesSent} errors={errors}
                     timeLeft={timeLeft} totalTime={duration} phase={phase} />

        <section className="gg-center">
          <div className={`chat chat--${t.mode} ${isMenu || isCountdown ? 'chat--blur' : ''}`}>
            <div className="chat__hd">
              <span className="chat__hd-l">◢ TEAM CHAT</span>
              <span className="chat__hd-mid">{t.pack.toUpperCase()} · {t.lang.toUpperCase()}</span>
              <span className="chat__hd-r">{chat.length} msgs</span>
            </div>
            <div className="chat__body" ref={chatScrollRef}>
              {chat.map(m => <ChatMsg key={m.id} msg={m} />)}
              {chat.length === 0 && (
                <div className="chat__empty">
                  ◢ awaiting match · configure your lobby ◣
                </div>
              )}
            </div>
            <Compose prompt={prompt || '...'} typed={typed} onChange={handleType}
                     onSubmit={submit} focused={focused}
                     onFocus={() => setFocused(true)} mode={t.mode}
                     finished={isDone} locked={isMenu || isCountdown} />
          </div>

          {isMenu && (
            <SettingsGate
              defaults={{ mode: t.mode, duration: t.duration, pack: t.pack, lang: t.lang }}
              onStart={startMatch} />
          )}
          {isCountdown && <Countdown value={cdValue} mode={t.mode} />}
          {isDone && (
            <Results wpm={wpm} acc={acc} sentences={sentencesSent}
                     errors={errors} mode={t.mode} lang={t.lang}
                     onRestart={() => startMatch({ mode: t.mode, duration: t.duration, pack: t.pack, lang: t.lang })}
                     onMenu={() => setPhase('menu')} />
          )}
        </section>

        <HistoryPanel history={history} accent={accent} onClear={clearHistory} />
      </main>

      <footer className="gg-footer">
        <span>GGType v0.6 · esports HUD · lobby + history build</span>
        <span className="gg-footer__sep" />
        <span>{t.mode === 'rage' ? 'no whiners. no mercy.' : 'be excellent to each other.'}</span>
        <span className="gg-footer__sep" />
        <span>SEED 0x{(runId * 9301 + 49297).toString(16).toUpperCase()}</span>
      </footer>

      <TweaksPanel title="GGType · Tweaks">
        <TweakSection label="Mode">
          <TweakRadio label="Vibe" value={t.mode}
                      options={[{ value: 'hype', label: 'Hype' }, { value: 'rage', label: 'Rage' }]}
                      onChange={(v) => setTweak({ mode: v as Mode })} />
          <TweakToggle label="Auto-rage on tilt" value={t.autoRage}
                       onChange={(v) => setTweak({ autoRage: v })} />
        </TweakSection>
        <TweakSection label="Match defaults">
          <TweakRadio label="Duration" value={t.duration}
                      options={[
                        { value: 15,  label: '15s'  },
                        { value: 30,  label: '30s'  },
                        { value: 60,  label: '60s'  },
                        { value: 120, label: '120s' }]}
                      onChange={(v) => setTweak({ duration: v as number })} />
          <TweakRadio label="Game" value={t.pack}
                      options={[
                        { value: 'overwatch', label: 'OW' },
                        { value: 'dota2',     label: 'Dota2' },
                        { value: 'lol',       label: 'LoL' }]}
                      onChange={(v) => setTweak({ pack: v as PackName })} />
          <TweakRadio label="Language" value={t.lang}
                      options={[{ value: 'en', label: 'EN' }, { value: 'th', label: 'TH' }]}
                      onChange={(v) => setTweak({ lang: v as Lang })} />
        </TweakSection>
        <TweakSection label="Theme">
          <TweakColor label="Palette" value={t.theme}
                      options={[
                        ['#07090a', '#7CFF3F', '#0e1113'],
                        ['#0d0220', '#ff2d95', '#1a0735'],
                        ['#0a0e1a', '#7c5cff', '#121828'],
                        ['#0a0a0a', '#00d9ff', '#0d1418'],
                        ['#1a0000', '#ff3838', '#220505'],
                      ]}
                      onChange={(v) => setTweak({ theme: v as string[] })} />
        </TweakSection>
        <TweakSection label="Run">
          <TweakButton label="Back to lobby" onClick={() => setPhase('menu')} />
        </TweakSection>
      </TweaksPanel>
    </div>
  );
}
