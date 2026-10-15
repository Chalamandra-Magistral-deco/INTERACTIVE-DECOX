import { useCallback, useEffect, useRef, useState } from "react";
import type * as ToneNS from "tone";

type Tone = typeof ToneNS;

type SynthBank = {
  completion: ToneNS.Synth | null;
  directive: ToneNS.Synth | null;
  celebration: ToneNS.Synth | null;
  uiClick: ToneNS.Synth | null;
  modalOpen: ToneNS.NoiseSynth | null;
  modalClose: ToneNS.NoiseSynth | null;
  quizSelect: ToneNS.MembraneSynth | null;
  comboReveal: ToneNS.FMSynth | null;
};

// Carga dinámica del módulo Tone — solo cuando el usuario interactúa
let toneModule: Tone | null = null;
let toneModulePromise: Promise<Tone> | null = null;

const loadTone = (): Promise<Tone> => {
  if (toneModule) return Promise.resolve(toneModule);
  if (toneModulePromise) return toneModulePromise;
  toneModulePromise = import("tone").then((m) => {
    toneModule = (m as unknown as { default?: Tone }).default ?? (m as unknown as Tone);
    return toneModule;
  });
  return toneModulePromise;
};

const createSynthBank = (T: Tone): SynthBank => ({
  completion: new T.Synth({
    oscillator: { type: "triangle" },
    envelope: { attack: 0.02, decay: 0.1, sustain: 0.3, release: 0.4 },
  }).toDestination(),
  directive: new T.Synth().toDestination(),
  celebration: new T.Synth().toDestination(),
  uiClick: new T.Synth({
    volume: -15,
    oscillator: { type: "sine" },
    envelope: { attack: 0.001, decay: 0.1, sustain: 0.01, release: 0.1 },
  }).toDestination(),
  modalOpen: new T.NoiseSynth({
    volume: -20,
    noise: { type: "white" },
    envelope: { attack: 0.005, decay: 0.2, sustain: 0 },
  }).toDestination(),
  modalClose: new T.NoiseSynth({
    volume: -25,
    noise: { type: "pink" },
    envelope: { attack: 0.005, decay: 0.15, sustain: 0 },
  }).toDestination(),
  quizSelect: new T.MembraneSynth({ volume: -10 }).toDestination(),
  comboReveal: new T.FMSynth({
    volume: -10,
    harmonicity: 2,
    modulationIndex: 3,
  }).toDestination(),
});

const disposeSynthBank = (bank: SynthBank): void => {
  Object.values(bank).forEach((synth) => synth?.dispose());
};

// Fallback de tiempo cuando Tone no está cargado aún
let audioTimeFallback = 0;

export const useAudio = () => {
  const [isAudioContextStarted, setIsAudioContextStarted] = useState(false);
  const synths = useRef<SynthBank | null>(null);

  const startAudioContext = useCallback(async () => {
    if (isAudioContextStarted) return;
    const T = await loadTone();
    await T.start();
    if (!synths.current) {
      synths.current = createSynthBank(T);
    }
    setIsAudioContextStarted(true);
  }, [isAudioContextStarted]);

  // Tiempo actual del AudioContext. Si Tone no ha cargado, devuelve un contador
  // monótono basado en performance.now() — suficiente como offset para programar notas.
  const getAudioTime = useCallback((): number => {
    if (toneModule) {
      try {
        return toneModule.now();
      } catch {
        return audioTimeFallback;
      }
    }
    audioTimeFallback = performance.now() / 1000;
    return audioTimeFallback;
  }, []);

  const playSound = useCallback(
    (
      type: keyof SynthBank,
      note?: string,
      duration?: string,
      time?: number,
    ) => {
      const synth = synths.current?.[type];
      if (!isAudioContextStarted || !synth || !toneModule) return;

      const T = toneModule;
      if (synth instanceof T.NoiseSynth) {
        synth.triggerAttackRelease(duration || "8n", time ?? T.now());
        return;
      }

      if (note) {
        synth.triggerAttackRelease(note, duration || "16n", time ?? T.now());
      }
    },
    [isAudioContextStarted],
  );

  useEffect(() => {
    return () => {
      if (synths.current) {
        disposeSynthBank(synths.current);
        synths.current = null;
      }
    };
  }, []);

  return { startAudioContext, playSound, isAudioContextStarted, getAudioTime };
};
