import { useState, useEffect, useCallback } from 'react';
import { Usb } from 'lucide-react';

interface Props {
  onNoteOn: (midi: number) => void;
  onNoteOff: (midi: number) => void;
  setVolume: (v: number) => void;
}

export default function MidiInput({ onNoteOn, onNoteOff, setVolume }: Props) {
  const [devices, setDevices] = useState<MIDIInput[]>([]);
  const [selectedId, setSelectedId] = useState<string>('');
  const [supported, setSupported] = useState(true);

  const handleMidiMessage = useCallback((e: MIDIMessageEvent) => {
    const [status, note, velocity] = e.data as unknown as number[];
    const cmd = status & 0xf0;
    if (cmd === 0x90 && velocity > 0) {
      onNoteOn(note);
    } else if (cmd === 0x80 || (cmd === 0x90 && velocity === 0)) {
      onNoteOff(note);
    } else if (cmd === 0xb0 && note === 7) {
      setVolume(velocity / 127);
    }
  }, [onNoteOn, onNoteOff, setVolume]);

  useEffect(() => {
    if (!navigator.requestMIDIAccess) {
      setSupported(false);
      return;
    }
    navigator.requestMIDIAccess().then(access => {
      const inputs = Array.from(access.inputs.values());
      setDevices(inputs);
      access.onstatechange = () => {
        setDevices(Array.from(access.inputs.values()));
      };
    }).catch(() => setSupported(false));
  }, []);

  useEffect(() => {
    if (!selectedId) return;
    const device = devices.find(d => d.id === selectedId);
    if (device) {
      device.onmidimessage = handleMidiMessage;
      return () => { device.onmidimessage = null; };
    }
  }, [selectedId, devices, handleMidiMessage]);

  return (
    <div className="glass-panel p-4">
      <h3 className="text-sm font-body text-muted-foreground mb-3 flex items-center gap-2">
        <Usb className="w-4 h-4 text-primary" /> MIDI Input
      </h3>
      {!supported ? (
        <p className="text-xs text-muted-foreground opacity-70">
          Web MIDI not supported. Try Chrome/Edge browser.
        </p>
      ) : (
        <select
          value={selectedId}
          onChange={e => setSelectedId(e.target.value)}
          className="bg-secondary text-secondary-foreground rounded-md px-2 py-1.5 text-sm font-body border-0 outline-none w-full"
        >
          <option value="">Select MIDI device...</option>
          {devices.map(d => (
            <option key={d.id} value={d.id}>{d.name}</option>
          ))}
        </select>
      )}
    </div>
  );
}
