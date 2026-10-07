import React, { useCallback, useEffect, useRef, useState } from "react";
import * as Tone from "tone";

const SRAPMetronome: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [bpm, setBpm] = useState(60);
  const [isPulsingVisual, setIsPulsingVisual] = useState(false);
  const synthRef = useRef<Tone.MembraneSynth | null>(null);
  const loopRef = useRef<Tone.Loop | null>(null);

  const ensureAudio = useCallback(async (): Promise<void> => {
    await Tone.start();

    if (!synthRef.current) {
      synthRef.current = new Tone.MembraneSynth({
        pitchDecay: 0.01,
        octaves: 6,
        envelope: {
          attack: 0.001,
          decay: 0.2,
          sustain: 0,
          release: 0.4,
        },
      }).toDestination();
    }
  }, []);

  const stopMetronome = useCallback((): void => {
    loopRef.current?.stop(0);
    loopRef.current?.dispose();
    loopRef.current = null;

    if (Tone.Transport.state !== "stopped") {
      Tone.Transport.stop();
      Tone.Transport.cancel();
    }

    setIsPlaying(false);
  }, []);

  const startMetronome = useCallback((): void => {
    const synth = synthRef.current;
    if (!synth) return;

    stopMetronome();

    Tone.Transport.bpm.value = bpm;
    loopRef.current = new Tone.Loop((time) => {
      synth.triggerAttackRelease("C2", "8n", time);

      Tone.Draw.schedule(() => {
        setIsPulsingVisual(true);
        window.setTimeout(() => setIsPulsingVisual(false), 100);
      }, time);
    }, "4n").start(0);

    Tone.Transport.start();
    setIsPlaying(true);
  }, [bpm, stopMetronome]);

  const handleTogglePlay = async (): Promise<void> => {
    if (isPlaying) {
      stopMetronome();
      return;
    }

    try {
      await ensureAudio();
      startMetronome();
    } catch (error) {
      console.error(
        "Unable to start SRAP metronome:",
        error instanceof Error ? error.message : "unknown",
      );
    }
  };

  const handleBpmChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const newBpm = Number(event.target.value);
    setBpm(newBpm);

    if (isPlaying) {
      Tone.Transport.bpm.rampTo(newBpm, 0.05);
    }
  };

  useEffect(() => {
    return () => {
      stopMetronome();
      synthRef.current?.dispose();
      synthRef.current = null;
    };
  }, [stopMetronome]);

  return (
    <section className="bg-black px-6 py-20">
      <div className="mx-auto max-w-4xl text-center">
        <h2 className="mb-6 text-4xl font-black text-white">
          <i className="fa-solid fa-wave-square mr-3 text-cyan-300" />
          METRÓNOMO SRAP
        </h2>

        <p className="mb-8 text-xl leading-relaxed text-gray-300">
          Calibra tu frecuencia operativa entre acción y pausa, ejecución y
          reflexión.
        </p>

        <div className="dashboard-widget mx-auto max-w-lg p-8">
          <div
            className={`relative mx-auto mb-8 flex h-24 w-24 items-center justify-center rounded-full border-4 border-cyan-400 transition-all duration-100 ${
              isPulsingVisual
                ? "scale-110 bg-cyan-400/30"
                : "scale-100 bg-transparent"
            }`}
          >
            <p className="text-4xl font-black text-white">{bpm}</p>
            <span className="absolute -bottom-6 text-sm text-gray-400">BPM</span>
          </div>

          <div className="mb-8 pt-4">
            <label htmlFor="bpm-slider" className="sr-only">
              BPM
            </label>
            <input
              type="range"
              id="bpm-slider"
              min="40"
              max="200"
              value={bpm}
              onChange={handleBpmChange}
              className="metronome-slider w-full cursor-pointer appearance-none rounded-lg bg-gray-700"
              aria-label={`Tempo de ${bpm} BPM`}
            />
          </div>

          <button
            type="button"
            onClick={() => void handleTogglePlay()}
            className="btn-dynamic rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-500 px-10 py-4 text-lg font-black text-white shadow-2xl transition-all hover:from-cyan-600 hover:to-blue-600"
          >
            <i className={`fa-solid ${isPlaying ? "fa-pause" : "fa-play"} mr-2`} />
            {isPlaying ? "DETENER" : "INICIAR"}
          </button>
        </div>
      </div>
    </section>
  );
};

export default SRAPMetronome;
