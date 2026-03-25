import { useState, useRef, useCallback, useEffect } from 'react';
import { Play, Square } from 'lucide-react';
import { ALANKAR_PATTERNS, KEYBOARD_LAYOUT } from '@/lib/constants';

interface Props {
  onNoteOn: (midi: number) => void;
  onNoteOff: (midi: number) => void;
  onNotePlayed: (sargam: string) => void;
}

export default function AlankarMode({ onNoteOn, onNoteOff, onNotePlayed }: Props) {
  const [pattern, setPattern] = useState('ascending');
  const [speed, setSpeed] = useState(200);
  const [playing, setPlaying] = useState(false);
  const intervalRef = useRef<number | null>(null);
  const indexRef = useRef(0);
  const lastNoteRef = useRef<number | null>(null);

  const stop = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (lastNoteRef.current !== null) onNoteOff(lastNoteRef.current);
    lastNoteRef.current = null;
    setPlaying(false);
  }, [onNoteOff]);

  const start = useCallback(() => {
    const pat = ALANKAR_PATTERNS[pattern].pattern;
    indexRef.current = 0;
    setPlaying(true);

    intervalRef.current = window.setInterval(() => {
      if (lastNoteRef.current !== null) onNoteOff(lastNoteRef.current);

      const interval = pat[indexRef.current % pat.length];
      const midi = 60 + interval;
      onNoteOn(midi);
      lastNoteRef.current = midi;

      const def = KEYBOARD_LAYOUT.find(k => k.midi === midi);
      if (def) onNotePlayed(def.sargam);

      indexRef.current++;
      if (indexRef.current >= pat.length) indexRef.current = 0;
    }, speed);
  }, [pattern, speed, onNoteOn, onNoteOff, onNotePlayed]);

  useEffect(() => {
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, []);

  // Restart if params change while playing
  useEffect(() => {
    if (playing) {
      stop();
      // small delay to let stop finish
      setTimeout(() => start(), 50);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pattern, speed]);

  return (
    <div className="glass-panel p-4">
      <h3 className="text-sm font-body text-muted-foreground mb-3">Alankar / Riyaz Mode</h3>
      <div className="flex flex-wrap items-center gap-3">
        <button onClick={() => playing ? stop() : start()}
          className="p-2 rounded-md bg-primary text-primary-foreground">
          {playing ? <Square className="w-4 h-4" /> : <Play className="w-4 h-4" />}
        </button>

        <select value={pattern} onChange={e => setPattern(e.target.value)}
          className="bg-secondary text-secondary-foreground rounded-md px-2 py-1.5 text-sm font-body border-0 outline-none">
          {Object.entries(ALANKAR_PATTERNS).map(([k, v]) => (
            <option key={k} value={k}>{v.name}</option>
          ))}
        </select>

        <div className="flex items-center gap-2">
          <span className="text-sm text-foreground font-body">{speed}ms</span>
          <input type="range" min={80} max={500} step={10} value={speed}
            onChange={e => setSpeed(parseInt(e.target.value))}
            className="accent-primary w-24" />
        </div>
      </div>
    </div>
  );
}
