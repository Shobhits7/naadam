import { useRef, useEffect } from 'react';
import { Copy, X } from 'lucide-react';

interface Props {
  notes: string[];
  onClear: () => void;
}

export default function NotationTracker({ notes, onClear }: Props) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollLeft = scrollRef.current.scrollWidth;
    }
  }, [notes]);

  const handleCopy = () => {
    navigator.clipboard.writeText(notes.join(' '));
  };

  return (
    <div className="glass-panel p-3">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-body text-muted-foreground">Notation</span>
        <div className="flex gap-2">
          <button onClick={handleCopy} className="p-1 rounded hover:bg-secondary transition-colors" title="Copy">
            <Copy className="w-3.5 h-3.5 text-primary" />
          </button>
          <button onClick={onClear} className="p-1 rounded hover:bg-secondary transition-colors" title="Clear">
            <X className="w-3.5 h-3.5 text-muted-foreground" />
          </button>
        </div>
      </div>
      <div ref={scrollRef} className="notation-strip h-8 flex items-center gap-1.5">
        {notes.length === 0 ? (
          <span className="text-muted-foreground text-sm italic">Play to see notation...</span>
        ) : (
          notes.map((note, i) => (
            <span key={i} className="inline-block px-2 py-0.5 rounded bg-secondary text-foreground text-sm font-body whitespace-nowrap">
              {note}
            </span>
          ))
        )}
      </div>
    </div>
  );
}
