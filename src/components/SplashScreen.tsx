interface SplashScreenProps {
  onStart: () => void;
  loading: boolean;
}

export default function SplashScreen({ onStart, loading }: SplashScreenProps) {
  return (
    <div className="fixed inset-0 bg-background flex flex-col items-center justify-center z-50">
      <div className="text-center animate-fade-in-up">
        {/* Harmonium Bellows SVG */}
        <div className="w-32 h-32 mx-auto mb-8">
          <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
            {/* Bellows body */}
            <path d="M20 85 L30 35 L90 35 L100 85 Z" fill="hsl(var(--walnut))" stroke="hsl(var(--gold))" strokeWidth="1.5" opacity="0.9"/>
            {/* Bellows folds */}
            <line x1="35" y1="40" x2="25" y2="80" stroke="hsl(var(--gold))" strokeWidth="0.8" opacity="0.4"/>
            <line x1="50" y1="40" x2="40" y2="80" stroke="hsl(var(--gold))" strokeWidth="0.8" opacity="0.4"/>
            <line x1="65" y1="40" x2="55" y2="80" stroke="hsl(var(--gold))" strokeWidth="0.8" opacity="0.4"/>
            <line x1="80" y1="40" x2="70" y2="80" stroke="hsl(var(--gold))" strokeWidth="0.8" opacity="0.4"/>
            {/* Keyboard section */}
            <rect x="25" y="85" width="70" height="18" rx="3" fill="hsl(var(--mahogany))" stroke="hsl(var(--gold))" strokeWidth="1"/>
            {/* White keys */}
            <rect x="30" y="87" width="7" height="14" rx="1" fill="hsl(var(--ivory))" opacity="0.9"/>
            <rect x="39" y="87" width="7" height="14" rx="1" fill="hsl(var(--ivory))" opacity="0.9"/>
            <rect x="48" y="87" width="7" height="14" rx="1" fill="hsl(var(--ivory))" opacity="0.9"/>
            <rect x="57" y="87" width="7" height="14" rx="1" fill="hsl(var(--ivory))" opacity="0.9"/>
            <rect x="66" y="87" width="7" height="14" rx="1" fill="hsl(var(--ivory))" opacity="0.9"/>
            <rect x="75" y="87" width="7" height="14" rx="1" fill="hsl(var(--ivory))" opacity="0.9"/>
            {/* Black keys */}
            <rect x="35" y="87" width="5" height="9" rx="0.5" fill="hsl(var(--ebony))"/>
            <rect x="44" y="87" width="5" height="9" rx="0.5" fill="hsl(var(--ebony))"/>
            <rect x="62" y="87" width="5" height="9" rx="0.5" fill="hsl(var(--ebony))"/>
            <rect x="71" y="87" width="5" height="9" rx="0.5" fill="hsl(var(--ebony))"/>
            {/* Top ornament */}
            <ellipse cx="60" cy="30" rx="12" ry="5" fill="hsl(var(--gold))" opacity="0.3"/>
            {/* Gold accent line */}
            <line x1="30" y1="35" x2="90" y2="35" stroke="hsl(var(--gold))" strokeWidth="2" opacity="0.7"/>
          </svg>
        </div>

        <h1 className="text-5xl md:text-7xl font-display font-bold text-primary mb-3 tracking-wide"
            style={{ textShadow: '0 0 40px hsl(38 70% 50% / 0.3)' }}>
          Naadam
        </h1>
        <p className="text-muted-foreground font-body text-lg md:text-xl mb-14 tracking-wider">
          Your Digital Riyaz Companion
        </p>

        <button
          onClick={onStart}
          disabled={loading}
          className="px-12 py-4 rounded-full font-body font-medium text-lg bg-primary text-primary-foreground
            hover:opacity-90 transition-all duration-300 gold-glow disabled:opacity-50"
        >
          {loading ? 'Loading Samples...' : 'Tap to Begin'}
        </button>
      </div>
    </div>
  );
}
