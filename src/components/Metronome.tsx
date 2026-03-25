import { useState, useRef, useCallback, useEffect } from 'react';
import { Play, Pause, Hand } from 'lucide-react';
import { TAAL_PRESETS } from '@/lib/constants';

interface Props {
  playTick: (accent: boolean) => void;
}

export default function Metronome({ playTick }: Props) {
  const [bpm, setBpm] = useState(120);
  const [playing, setPlaying] = useState(false);
  const [taal, setTaal] = useState('teentaal');
  const [currentBeat, setCurrentBeat] = useState(0);
  const intervalRef = useRef<number | null>(null);
  const beatRef = useRef(0);
  const tapTimesRef = useRef<number[]>([]);

  const taalConfig = TAAL_PRESETS[taal];

  const startStop = useCallback(() => {
    if (playing) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      setPlaying(false);
      setCurrentBeat(0);
      beatRef.current = 0;
    } else {
      beatRef.current = 0;
      setCurrentBeat(0);
      setPlaying(true);
      const ms = 60000 / bpm;
      intervalRef.current = window.setInterval(() => {
        const pattern = TAAL_PRESETS[taal].pattern;
        const isAccent = pattern[beatRef.current % pattern.length];
        playTick(isAccent);
        setCurrentBeat(beatRef.current % pattern.length);
        beatRef.current++;
      }, ms);
    }
  }, [playing, bpm, taal, playTick]);

  useEffect(() => {
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, []);

  // Restart if bpm/taal changes while playing
  useEffect(() => {
    if (playing) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      beatRef.current = 0;
      const ms = 60000 / bpm;
      intervalRef.current = window.setInterval(() => {
        const pattern = TAAL_PRESETS[taal].pattern;
        const isAccent = pattern[beatRef.current % pattern.length];
        playTick(isAccent);
        setCurrentBeat(beatRef.current % pattern.length);
        beatRef.current++;
      }, ms);
    }
  }, [bpm, taal, playing, playTick]);

  const handleTap = () => {
    const now = Date.now();
    tapTimesRef.current.push(now);
    if (tapTimesRef.current.length > 5) tapTimesRef.current.shift();
    if (tapTimesRef.current.length >= 2) {
      const intervals = [];
      for (let i = 1; i < tapTimesRef.current.length; i++) {
        intervals.push(tapTimesRef.current[i] - tapTimesRef.current[i - 1]);
      }
      const avg = intervals.reduce((a, b) => a + b) / intervals.length;
      setBpm(Math.round(Math.min(240, Math.max(30, 60000 / avg))));
    }
  };

  return (
    <div className="glass-panel p-4">
      <h3 className="text-sm font-body text-muted-foreground mb-3">Metronome</h3>
      <div className="flex flex-wrap items-center gap-3">
        <button onClick={startStop}
          className="p-2 rounded-md bg-primary text-primary-foreground">
          {playing ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
        </button>

        <div className="flex items-center gap-2">
          <span className="text-sm text-foreground font-body w-16">{bpm} BPM</span>
          <input type="range" min={30} max={240} value={bpm}
            onChange={e => setBpm(parseInt(e.target.value))}
            className="accent-primary w-24" />
        </div>

        <button onClick={handleTap}
          className="px-3 py-1.5 rounded-md bg-secondary text-secondary-foreground text-sm font-body flex items-center gap-1">
          <Hand className="w-3.5 h-3.5" /> Tap
        </button>

        <select value={taal} onChange={e => setTaal(e.target.value)}
          className="bg-secondary text-secondary-foreground rounded-md px-2 py-1.5 text-sm font-body border-0 outline-none">
          {Object.entries(TAAL_PRESETS).map(([k, v]) => (
            <option key={k} value={k}>{v.name} ({v.beats})</option>
          ))}
        </select>

        {/* Beat indicators */}
        {playing && (
          <div className="flex gap-1 ml-2">
            {taalConfig.pattern.map((isAccent, i) => (
              <div key={i} className={`w-3 h-3 rounded-full transition-all duration-100
                ${i === currentBeat
                  ? isAccent ? 'bg-primary scale-125' : 'bg-accent scale-110'
                  : 'bg-secondary'}`} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
