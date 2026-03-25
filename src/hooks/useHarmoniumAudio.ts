import { useRef, useCallback, useState, useEffect } from 'react';

const SAMPLE_URL = 'https://rajaramaniyer.github.io/harmonium-kannan-orig.wav';
const REVERB_URL = 'https://rajaramaniyer.github.io/reverb.wav';

interface ActiveNote {
  sources: AudioBufferSourceNode[];
  gains: GainNode[];
}

export function useHarmoniumAudio() {
  const ctxRef = useRef<AudioContext | null>(null);
  const sampleBufferRef = useRef<AudioBuffer | null>(null);
  const reverbBufferRef = useRef<AudioBuffer | null>(null);
  const masterGainRef = useRef<GainNode | null>(null);
  const convolverRef = useRef<ConvolverNode | null>(null);
  const dryGainRef = useRef<GainNode | null>(null);
  const wetGainRef = useRef<GainNode | null>(null);
  const activeNotesRef = useRef<Map<number, ActiveNote>>(new Map());
  const sustainedNotesRef = useRef<Set<number>>(new Set());
  const sustainOnRef = useRef(false);

  const [isReady, setIsReady] = useState(false);
  const [loading, setLoading] = useState(false);
  const [volume, setVolumeState] = useState(() => {
    const saved = localStorage.getItem('harmonium-volume');
    return saved ? parseFloat(saved) : 0.7;
  });
  const [reverbOn, setReverbOnState] = useState(() => {
    return localStorage.getItem('harmonium-reverb') === 'true';
  });
  const [transpose, setTransposeState] = useState(() => {
    const saved = localStorage.getItem('harmonium-transpose');
    return saved ? parseInt(saved) : 0;
  });
  const [octave, setOctaveState] = useState(() => {
    const saved = localStorage.getItem('harmonium-octave');
    return saved ? parseInt(saved) : 3;
  });
  const [additionalReeds, setAdditionalReedsState] = useState(() => {
    const saved = localStorage.getItem('harmonium-reeds');
    return saved ? parseInt(saved) : 0;
  });

  const transposeRef = useRef(transpose);
  const octaveRef = useRef(octave);
  const additionalReedsRef = useRef(additionalReeds);

  useEffect(() => { transposeRef.current = transpose; }, [transpose]);
  useEffect(() => { octaveRef.current = octave; }, [octave]);
  useEffect(() => { additionalReedsRef.current = additionalReeds; }, [additionalReeds]);

  const loadBuffer = useCallback((url: string, ctx: AudioContext): Promise<AudioBuffer> => {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open('GET', url, true);
      xhr.responseType = 'arraybuffer';
      xhr.onload = () => {
        ctx.decodeAudioData(xhr.response, resolve, reject);
      };
      xhr.onerror = reject;
      xhr.send();
    });
  }, []);

  const init = useCallback(async () => {
    if (ctxRef.current) return;
    setLoading(true);
    try {
      const ctx = new AudioContext();
      ctxRef.current = ctx;

      const masterGain = ctx.createGain();
      masterGain.gain.value = volume;
      masterGainRef.current = masterGain;

      const convolver = ctx.createConvolver();
      convolverRef.current = convolver;

      const dryGain = ctx.createGain();
      dryGain.gain.value = reverbOn ? 0.6 : 1;
      dryGainRef.current = dryGain;

      const wetGain = ctx.createGain();
      wetGain.gain.value = reverbOn ? 0.4 : 0;
      wetGainRef.current = wetGain;

      masterGain.connect(dryGain);
      dryGain.connect(ctx.destination);

      masterGain.connect(convolver);
      convolver.connect(wetGain);
      wetGain.connect(ctx.destination);

      const [sample, reverb] = await Promise.all([
        loadBuffer(SAMPLE_URL, ctx),
        loadBuffer(REVERB_URL, ctx),
      ]);

      sampleBufferRef.current = sample;
      reverbBufferRef.current = reverb;
      convolver.buffer = reverb;

      setIsReady(true);
    } catch (e) {
      console.error('Failed to init audio:', e);
    } finally {
      setLoading(false);
    }
  }, [volume, reverbOn, loadBuffer]);

  const noteOn = useCallback((midiNote: number) => {
    const ctx = ctxRef.current;
    const buffer = sampleBufferRef.current;
    if (!ctx || !buffer) return;

    // Already playing
    if (activeNotesRef.current.has(midiNote)) return;

    const actualMidi = midiNote + transposeRef.current + (octaveRef.current - 3) * 12;
    const reeds = additionalReedsRef.current;
    const baseSemitone = actualMidi - 60; // relative to middle C

    const sources: AudioBufferSourceNode[] = [];
    const gains: GainNode[] = [];

    for (let r = 0; r <= reeds; r++) {
      const semitone = baseSemitone + r * 12;
      const source = ctx.createBufferSource();
      source.buffer = buffer;
      source.detune.value = semitone * 100;
      source.loop = true;
      source.loopStart = 0.5;
      source.loopEnd = Math.min(7.5, buffer.duration);

      const noteGain = ctx.createGain();
      noteGain.gain.value = r === 0 ? 1 : 0.6;
      source.connect(noteGain);
      noteGain.connect(masterGainRef.current!);

      source.start();
      sources.push(source);
      gains.push(noteGain);
    }

    activeNotesRef.current.set(midiNote, { sources, gains });
  }, []);

  const noteOff = useCallback((midiNote: number) => {
    if (sustainOnRef.current) {
      sustainedNotesRef.current.add(midiNote);
      return;
    }
    const active = activeNotesRef.current.get(midiNote);
    if (!active) return;

    active.gains.forEach(g => {
      g.gain.setTargetAtTime(0, ctxRef.current!.currentTime, 0.05);
    });
    active.sources.forEach(s => {
      try { s.stop(ctxRef.current!.currentTime + 0.15); } catch {}
    });
    activeNotesRef.current.delete(midiNote);
  }, []);

  const setSustain = useCallback((on: boolean) => {
    sustainOnRef.current = on;
    if (!on) {
      sustainedNotesRef.current.forEach(midi => {
        const active = activeNotesRef.current.get(midi);
        if (active) {
          active.gains.forEach(g => {
            g.gain.setTargetAtTime(0, ctxRef.current!.currentTime, 0.05);
          });
          active.sources.forEach(s => {
            try { s.stop(ctxRef.current!.currentTime + 0.15); } catch {}
          });
          activeNotesRef.current.delete(midi);
        }
      });
      sustainedNotesRef.current.clear();
    }
  }, []);

  const setVolume = useCallback((v: number) => {
    setVolumeState(v);
    localStorage.setItem('harmonium-volume', String(v));
    if (masterGainRef.current) {
      masterGainRef.current.gain.setTargetAtTime(v, ctxRef.current!.currentTime, 0.02);
    }
  }, []);

  const setReverbOn = useCallback((on: boolean) => {
    setReverbOnState(on);
    localStorage.setItem('harmonium-reverb', String(on));
    if (dryGainRef.current && wetGainRef.current) {
      const t = ctxRef.current!.currentTime;
      dryGainRef.current.gain.setTargetAtTime(on ? 0.6 : 1, t, 0.02);
      wetGainRef.current.gain.setTargetAtTime(on ? 0.4 : 0, t, 0.02);
    }
  }, []);

  const setTranspose = useCallback((t: number) => {
    setTransposeState(t);
    localStorage.setItem('harmonium-transpose', String(t));
  }, []);

  const setOctave = useCallback((o: number) => {
    setOctaveState(o);
    localStorage.setItem('harmonium-octave', String(o));
  }, []);

  const setAdditionalReeds = useCallback((r: number) => {
    setAdditionalReedsState(r);
    localStorage.setItem('harmonium-reeds', String(r));
  }, []);

  // Metronome tick
  const playTick = useCallback((accent: boolean = false) => {
    const ctx = ctxRef.current;
    if (!ctx) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.frequency.value = accent ? 1000 : 800;
    gain.gain.value = 0.3;
    gain.gain.setTargetAtTime(0, ctx.currentTime + 0.05, 0.02);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.1);
  }, []);

  return {
    init, isReady, loading,
    noteOn, noteOff, setSustain, playTick,
    volume, setVolume,
    reverbOn, setReverbOn,
    transpose, setTranspose,
    octave, setOctave,
    additionalReeds, setAdditionalReeds,
  };
}
