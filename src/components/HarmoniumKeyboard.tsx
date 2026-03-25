import { useCallback, useEffect, useRef, useState } from 'react';
import { KEYBOARD_LAYOUT, KEY_MAP, type KeyDef } from '@/lib/constants';

interface Props {
  onNoteOn: (midi: number) => void;
  onNoteOff: (midi: number) => void;
  onSustain: (on: boolean) => void;
  pressedKeys: Set<number>;
  highlightedNotes?: Set<number>;
  onNotePlayed?: (sargam: string) => void;
}

export default function HarmoniumKeyboard({ onNoteOn, onNoteOff, onSustain, pressedKeys, highlightedNotes, onNotePlayed }: Props) {
  const keyboardRef = useRef<Set<string>>(new Set());

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.repeat) return;
    const key = e.key.toLowerCase();

    if (key === ' ') {
      e.preventDefault();
      onSustain(true);
      return;
    }

    if (key === 'tab') {
      e.preventDefault(); // Prevent Tab's default focus behavior
    }

    if (keyboardRef.current.has(key)) return;
    const midi = KEY_MAP[key];
    if (midi !== undefined) {
      keyboardRef.current.add(key);
      onNoteOn(midi);
      const def = KEYBOARD_LAYOUT.find(k => k.midi === midi);
      if (def && onNotePlayed) onNotePlayed(def.sargam);
    }
  }, [onNoteOn, onSustain, onNotePlayed]);

  const handleKeyUp = useCallback((e: KeyboardEvent) => {
    const key = e.key.toLowerCase();
    if (key === ' ') {
      onSustain(false);
      return;
    }

    if (key === 'tab') {
      e.preventDefault(); // Prevent Tab's default focus behavior
    }

    keyboardRef.current.delete(key);
    const midi = KEY_MAP[key];
    if (midi !== undefined) {
      onNoteOff(midi);
    }
  }, [onNoteOff, onSustain]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [handleKeyDown, handleKeyUp]);

  const whiteKeys = KEYBOARD_LAYOUT.filter(k => !k.isBlack);
  const blackKeys = KEYBOARD_LAYOUT.filter(k => k.isBlack);

  // Calculate black key positions based on white key index
  const getBlackKeyPosition = (bk: KeyDef) => {
    const bkIndex = KEYBOARD_LAYOUT.indexOf(bk);
    // Find how many white keys are before this black key
    let whiteCount = 0;
    for (let i = 0; i < bkIndex; i++) {
      if (!KEYBOARD_LAYOUT[i].isBlack) whiteCount++;
    }
    const whiteKeyWidth = 100 / whiteKeys.length;
    return whiteCount * whiteKeyWidth - whiteKeyWidth * 0.17;
  };

  const isHighlighted = (midi: number) => {
    if (!highlightedNotes) return true;
    const noteInOctave = ((midi - 60) % 12 + 12) % 12;
    return highlightedNotes.has(noteInOctave);
  };

  return (
    <div className="relative select-none overflow-x-auto pb-2" style={{ minHeight: 220 }}>
      <div className="relative" style={{ minWidth: whiteKeys.length * 52, height: 200 }}>
        {/* White keys */}
        {whiteKeys.map((key, i) => {
          const isPressed = pressedKeys.has(key.midi);
          const highlighted = isHighlighted(key.midi);
          const width = 100 / whiteKeys.length;
          return (
            <button
              key={key.midi}
              className={`white-key absolute top-0 flex flex-col items-center justify-end pb-2 text-xs
                ${isPressed ? 'pressed' : ''} ${!highlighted ? 'opacity-30' : ''}`}
              style={{ left: `${i * width}%`, width: `${width}%`, height: '100%' }}
              onMouseDown={() => { onNoteOn(key.midi); onNotePlayed?.(key.sargam); }}
              onMouseUp={() => onNoteOff(key.midi)}
              onMouseLeave={() => { if (pressedKeys.has(key.midi)) onNoteOff(key.midi); }}
              onTouchStart={(e) => { e.preventDefault(); onNoteOn(key.midi); onNotePlayed?.(key.sargam); }}
              onTouchEnd={(e) => { e.preventDefault(); onNoteOff(key.midi); }}
            >
              <span className="font-display text-sm font-semibold mb-1" style={{ color: 'hsl(20 15% 30%)' }}>
                {key.sargam}
              </span>
              <span className="text-[10px] opacity-60">{key.shortcut}</span>
            </button>
          );
        })}
        {/* Black keys */}
        {blackKeys.map((key) => {
          const isPressed = pressedKeys.has(key.midi);
          const highlighted = isHighlighted(key.midi);
          const left = getBlackKeyPosition(key);
          const width = 100 / whiteKeys.length * 0.65;
          return (
            <button
              key={key.midi}
              className={`black-key absolute top-0 flex flex-col items-center justify-end pb-2 text-[10px] z-10
                ${isPressed ? 'pressed' : ''} ${!highlighted ? 'opacity-20' : ''}`}
              style={{ left: `${left}%`, width: `${width}%`, height: '62%' }}
              onMouseDown={() => { onNoteOn(key.midi); onNotePlayed?.(key.sargam); }}
              onMouseUp={() => onNoteOff(key.midi)}
              onMouseLeave={() => { if (pressedKeys.has(key.midi)) onNoteOff(key.midi); }}
              onTouchStart={(e) => { e.preventDefault(); onNoteOn(key.midi); onNotePlayed?.(key.sargam); }}
              onTouchEnd={(e) => { e.preventDefault(); onNoteOff(key.midi); }}
            >
              <span className="font-body font-medium mb-0.5">{key.sargam}</span>
              <span className="opacity-60">{key.shortcut}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
