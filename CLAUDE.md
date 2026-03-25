# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Naadam** (formerly Harmonium Haven) is a web-based harmonium simulator built with React, TypeScript, and Web Audio API. It provides an interactive virtual harmonium with Indian classical music features including raga support, alankar patterns, metronome with taal presets, and MIDI input.

## Development Commands

```bash
# Development server (runs on http://localhost:8080)
npm run dev

# Production build
npm run build

# Development build (with source maps)
npm run build:dev

# Preview production build
npm run preview

# Linting
npm run lint

# Testing
npm run test          # Run all tests once
npm run test:watch    # Run tests in watch mode
```

## Architecture

### Audio System (`useHarmoniumAudio` hook)

The core audio engine is in `src/hooks/useHarmoniumAudio.ts`. It manages:

- **Sample-based synthesis**: Loads a harmonium sample from CDN and uses Web Audio API's `AudioBufferSourceNode` with pitch shifting via `detune` for different notes
- **Reverb**: Uses a `ConvolverNode` with wet/dry mixing (60/40 split when enabled)
- **Additional reeds**: Simulates traditional harmonium octave coupling by layering multiple pitched versions of the sample (each reed is +12 semitones)
- **Sustain pedal**: Maintains notes when spacebar is held, mimicking harmonium foot pedal behavior
- **State persistence**: All settings (volume, reverb, transpose, octave, reeds) persist to localStorage

**Note triggering flow**:
1. `noteOn(midiNote)` receives MIDI note number
2. Applies transpose + octave offset to get `actualMidi`
3. Creates looping audio sources for base note + additional reeds
4. Each source connects to individual gain node, then to master gain, then to dry/wet reverb chain

### Component Structure

- **Index.tsx** (`src/pages/Index.tsx`): Main application page, coordinates all components
- **HarmoniumKeyboard.tsx**: Virtual keyboard with both mouse/touch and keyboard input
  - Maps computer keyboard keys to MIDI notes via `KEY_MAP` in constants
  - Handles sustain via spacebar
  - Displays sargam (Indian solfège) notation and keyboard shortcuts on keys
  - Supports note highlighting for raga mode
- **ControlsPanel.tsx**: Volume, reverb, transpose, octave, and additional reeds controls
- **NotationTracker.tsx**: Displays recently played notes in sargam notation (last 100 notes)
- **Metronome.tsx**: Configurable metronome with Indian taal presets (Teentaal, Keherwa, etc.)
- **RagaSelector.tsx**: Highlights notes belonging to selected raga on keyboard
- **AlankarMode.tsx**: Auto-plays common practice patterns (aroha, avroha, zigzag, etc.)
- **MidiInput.tsx**: Connects to external MIDI devices via Web MIDI API

### Constants & Configuration

`src/lib/constants.ts` contains all music theory data:
- `SARGAM_MAP`: MIDI note to Indian solfège mapping
- `KEY_MAP`: Computer keyboard key to MIDI note mapping
- `KEYBOARD_LAYOUT`: Visual keyboard layout with sargam labels and shortcuts
- `RAGAS`: Scale definitions (Yaman, Bhairav, Kafi, etc.) as intervals from Sa
- `TAAL_PRESETS`: Rhythm cycle patterns for metronome
- `ALANKAR_PATTERNS`: Practice exercise patterns

### Routing & UI

- Uses React Router with catch-all 404 route
- UI built with shadcn/ui components (Radix UI primitives + Tailwind)
- Custom color palette for Indian aesthetic (gold, amber, walnut, mahogany)
- Custom fonts: Playfair Display (headings), Inter (body)
- Path alias: `@/` maps to `src/`

## Key Technical Details

- **Build tool**: Vite with SWC for React
- **TypeScript**: Lenient config (no strict null checks, implicit any allowed)
- **Testing**: Vitest + Testing Library + Playwright
- **Audio samples**: Hosted on GitHub Pages (rajaramaniyer.github.io)
- **MIDI note reference**: Middle C (MIDI 60) = Sa in the current key
- **Transpose range**: Adjusts global pitch without changing sargam labels (Sa is always Sa)
- **Octave control**: Shifts entire keyboard up/down by octaves

## Audio Implementation Notes

When working with audio features:
- Always check for AudioContext existence before operations
- Use `setTargetAtTime` for smooth parameter changes (avoid clicks)
- Stop sources gracefully with fadeout (0.15s release time)
- Sample loop points are hardcoded: `loopStart: 0.5`, `loopEnd: 7.5`
- Additional reeds have reduced gain (0.6x) compared to base note (1.0x)

## UI Component Patterns

shadcn/ui components are in `src/components/ui/`. When adding new UI:
- Use existing components from ui folder when possible
- Follow the glass morphism aesthetic (see `glass-panel` class in App.css)
- Respect the color palette (gold accents, warm wood tones)
- Components should work on both desktop and mobile (touch + mouse events)
