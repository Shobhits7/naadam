import { useState, useCallback } from 'react';
import SplashScreen from '@/components/SplashScreen';
import HarmoniumKeyboard from '@/components/HarmoniumKeyboard';
import ControlsPanel from '@/components/ControlsPanel';
import NotationTracker from '@/components/NotationTracker';
import Metronome from '@/components/Metronome';
import RagaSelector from '@/components/RagaSelector';
import AlankarMode from '@/components/AlankarMode';
import MidiInput from '@/components/MidiInput';
import { useHarmoniumAudio } from '@/hooks/useHarmoniumAudio';
import { RAGAS } from '@/lib/constants';

export default function Index() {
  const audio = useHarmoniumAudio();
  const [started, setStarted] = useState(false);
  const [pressedKeys, setPressedKeys] = useState<Set<number>>(new Set());
  const [notation, setNotation] = useState<string[]>([]);
  const [selectedRaga, setSelectedRaga] = useState<string | null>(null);

  const handleStart = async () => {
    await audio.init();
    setStarted(true);
  };

  const handleNoteOn = useCallback((midi: number) => {
    audio.noteOn(midi);
    setPressedKeys(prev => new Set(prev).add(midi));
  }, [audio]);

  const handleNoteOff = useCallback((midi: number) => {
    audio.noteOff(midi);
    setPressedKeys(prev => {
      const next = new Set(prev);
      next.delete(midi);
      return next;
    });
  }, [audio]);

  const handleNotePlayed = useCallback((sargam: string) => {
    if (sargam) setNotation(prev => [...prev.slice(-100), sargam]);
  }, []);

  const highlightedNotes = selectedRaga ? new Set(RAGAS[selectedRaga].notes) : undefined;

  if (!started) {
    return <SplashScreen onStart={handleStart} loading={audio.loading} />;
  }

  return (
    <div className="min-h-screen bg-background p-4 md:p-6 flex flex-col gap-4 max-w-6xl mx-auto">
      {/* Header */}
      <header className="text-center py-2">
        <h1 className="text-3xl md:text-4xl font-display font-bold text-primary">
          Naadam
        </h1>
        <p className="text-muted-foreground text-sm font-body mt-1">
          Spacebar for sustain · Keyboard shortcuts shown on keys
        </p>
      </header>

      {/* Controls */}
      <ControlsPanel
        volume={audio.volume} setVolume={audio.setVolume}
        reverbOn={audio.reverbOn} setReverbOn={audio.setReverbOn}
        transpose={audio.transpose} setTranspose={audio.setTranspose}
        octave={audio.octave} setOctave={audio.setOctave}
        additionalReeds={audio.additionalReeds} setAdditionalReeds={audio.setAdditionalReeds}
      />

      {/* Notation */}
      <NotationTracker notes={notation} onClear={() => setNotation([])} />

      {/* Keyboard */}
      <div className="glass-panel p-4 overflow-x-auto">
        <HarmoniumKeyboard
          onNoteOn={handleNoteOn}
          onNoteOff={handleNoteOff}
          onSustain={audio.setSustain}
          pressedKeys={pressedKeys}
          highlightedNotes={highlightedNotes}
          onNotePlayed={handleNotePlayed}
        />
      </div>

      {/* Features row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Metronome playTick={audio.playTick} />
        <AlankarMode
          onNoteOn={handleNoteOn}
          onNoteOff={handleNoteOff}
          onNotePlayed={handleNotePlayed}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <RagaSelector selectedRaga={selectedRaga} onSelect={setSelectedRaga} />
        <MidiInput onNoteOn={handleNoteOn} onNoteOff={handleNoteOff} setVolume={audio.setVolume} />
      </div>

      {/* Footer */}
      <footer className="text-center py-4 mt-auto">
        <p className="text-xs font-body text-muted-foreground opacity-50">
          Made with ❤️ by{' '}
          <a
            href="https://www.linkedin.com/in/shobhitjain09/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:opacity-80 transition-opacity"
          >
            Shobhit Jain
          </a>
        </p>
      </footer>
    </div>
  );
}
