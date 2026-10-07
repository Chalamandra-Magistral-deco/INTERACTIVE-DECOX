import { useCallback, useEffect, useRef, useState } from "react";
import * as Tone from "tone";

type SynthBank = {
  completion: Tone.Synth | null;
  directive: Tone.Synth | null;
  celebration: Tone.Synth | null;
  uiClick: Tone.Synth | null;
  modalOpen: Tone.NoiseSynth | null;
  modalClose: Tone.NoiseSynth | null;
  quizSelect: Tone.MembraneSynth | null;
  comboReveal: Tone.FMSynth | null;
};

const createSynthBank = (): SynthBank => ({
  completion: new Tone.Synth({
    oscillator: { type: "triangle" },
    envelope: { attack: 0.02, decay: 0.1, sustain: 0.3, release: 0.4 },
  }).toDestination(),
  directive: new Tone.Synth().toDestination(),
  celebration: new Tone.Synth().toDestination(),
  uiClick: new Tone.Synth({
    volume: -15,
    oscillator: { type: "sine" },
    envelope: { attack: 0.001, decay: 0.1, sustain: 0.01, release: 0.1 },
  }).toDestination(),
  modalOpen: new Tone.NoiseSynth({
    volume: -20,
    noise: { type: "white" },
    envelope: { attack: 0.005, decay: 0.2, sustain: 0 },
  }).toDestination(),
  modalClose: new Tone.NoiseSynth({
    volume: -25,
    noise: { type: "pink" },
    envelope: { attack: 0.005, decay: 0.15, sustain: 0 },
  }).toDestination(),
  quizSelect: new Tone.MembraneSynth({ volume: -10 }).toDestination(),
  comboReveal: new Tone.FMSynth({
    volume: -10,
    harmonicity: 2,
    modulationIndex: 3,
  }).toDestination(),
});

const disposeSynthBank = (bank: SynthBank): void => {
  Object.values(bank).forEach((synth) => synth?.dispose());
};

export const useAudio = () => {
  const [isAudioContextStarted, setIsAudioContextStarted] = useState(false);
  const synths = useRef<SynthBank | null>(null);

  const startAudioContext = useCallback(async () => {
    if (isAudioContextStarted) return;

    await Tone.start();
    if (!synths.current) {
      synths.current = createSynthBank();
    }
    setIsAudioContextStarted(true);
  }, [isAudioContextStarted]);

  const playSound = useCallback(
    (
      type: keyof SynthBank,
      note?: string,
      duration?: Tone.Unit.Time,
      time?: number,
    ) => {
      const synth = synths.current?.[type];
      if (!isAudioContextStarted || !synth) return;

      if (synth instanceof Tone.NoiseSynth) {
        synth.triggerAttackRelease(duration || "8n", time ?? Tone.now());
        return;
      }

      if (note) {
        synth.triggerAttackRelease(note, duration || "16n", time ?? Tone.now());
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

  return { startAudioContext, playSound, isAudioContextStarted };
};
