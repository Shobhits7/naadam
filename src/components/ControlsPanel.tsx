import { Volume2, Waves, ArrowUpDown, Layers, Music } from 'lucide-react';
import { getRootNote } from '@/lib/constants';

interface Props {
  volume: number;
  setVolume: (v: number) => void;
  reverbOn: boolean;
  setReverbOn: (v: boolean) => void;
  transpose: number;
  setTranspose: (v: number) => void;
  octave: number;
  setOctave: (v: number) => void;
  additionalReeds: number;
  setAdditionalReeds: (v: number) => void;
}

export default function ControlsPanel({
  volume, setVolume, reverbOn, setReverbOn,
  transpose, setTranspose, octave, setOctave,
  additionalReeds, setAdditionalReeds,
}: Props) {
  return (
    <div className="glass-panel p-4 grid grid-cols-2 md:grid-cols-5 gap-4">
      {/* Volume */}
      <div className="flex flex-col gap-2">
        <label className="flex items-center gap-2 text-sm font-body text-muted-foreground">
          <Volume2 className="w-4 h-4 text-primary" /> Volume
        </label>
        <input
          type="range" min={0} max={1} step={0.01} value={volume}
          onChange={e => setVolume(parseFloat(e.target.value))}
          className="accent-primary w-full"
        />
      </div>

      {/* Reverb */}
      <div className="flex flex-col gap-2">
        <label className="flex items-center gap-2 text-sm font-body text-muted-foreground">
          <Waves className="w-4 h-4 text-primary" /> Reverb
        </label>
        <button
          onClick={() => setReverbOn(!reverbOn)}
          className={`px-3 py-1.5 rounded-md text-sm font-body transition-colors
            ${reverbOn ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground'}`}
        >
          {reverbOn ? 'ON' : 'OFF'}
        </button>
      </div>

      {/* Transpose */}
      <div className="flex flex-col gap-2">
        <label className="flex items-center gap-2 text-sm font-body text-muted-foreground">
          <ArrowUpDown className="w-4 h-4 text-primary" /> Transpose: {transpose > 0 ? '+' : ''}{transpose} ({getRootNote(transpose)})
        </label>
        <input
          type="range" min={-11} max={11} step={1} value={transpose}
          onChange={e => setTranspose(parseInt(e.target.value))}
          className="accent-primary w-full"
        />
      </div>

      {/* Octave */}
      <div className="flex flex-col gap-2">
        <label className="flex items-center gap-2 text-sm font-body text-muted-foreground">
          <Music className="w-4 h-4 text-primary" /> Octave: {octave}
        </label>
        <div className="flex gap-1">
          <button onClick={() => setOctave(Math.max(0, octave - 1))}
            className="flex-1 px-2 py-1.5 rounded-md bg-secondary text-secondary-foreground text-sm">−</button>
          <button onClick={() => setOctave(Math.min(6, octave + 1))}
            className="flex-1 px-2 py-1.5 rounded-md bg-secondary text-secondary-foreground text-sm">+</button>
        </div>
      </div>

      {/* Additional Reeds */}
      <div className="flex flex-col gap-2">
        <label className="flex items-center gap-2 text-sm font-body text-muted-foreground">
          <Layers className="w-4 h-4 text-primary" /> Reeds: +{additionalReeds}
        </label>
        <input
          type="range" min={0} max={3} step={1} value={additionalReeds}
          onChange={e => setAdditionalReeds(parseInt(e.target.value))}
          className="accent-primary w-full"
        />
      </div>
    </div>
  );
}
