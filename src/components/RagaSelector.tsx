import { RAGAS } from '@/lib/constants';

interface Props {
  selectedRaga: string | null;
  onSelect: (raga: string | null) => void;
}

export default function RagaSelector({ selectedRaga, onSelect }: Props) {
  return (
    <div className="glass-panel p-4">
      <h3 className="text-sm font-body text-muted-foreground mb-3">Raga Scale Highlighter</h3>
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => onSelect(null)}
          className={`px-3 py-1.5 rounded-md text-sm font-body transition-colors
            ${!selectedRaga ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground'}`}
        >
          All Notes
        </button>
        {Object.entries(RAGAS).map(([key, raga]) => (
          <button
            key={key}
            onClick={() => onSelect(key)}
            className={`px-3 py-1.5 rounded-md text-sm font-body transition-colors
              ${selectedRaga === key ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground'}`}
          >
            {raga.name}
          </button>
        ))}
      </div>
    </div>
  );
}
