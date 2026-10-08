import React, { useCallback, useEffect, useState } from "react";
import { Toaster, toast } from "sonner";
import { AnimatePresence, motion } from "motion/react";
import * as Tone from "tone";

import { CERTIFICATIONS_DATA, HACKS_DATA } from "@/utils/constants";
import {
  Archetype,
  ModalData,
  ModalState,
  PurchasedService,
} from "@/utils/types";
import { generateStrategicDirective } from "@/services/geminiService";
import { verifyPaymentSession } from "@/services/paymentService";
import { useAudio } from "@/hooks/useAudio";

import Confetti from "@/components/Confetti";
import SEO from "@/components/SEO";
import Introduction from "@/components/Introduction";
import HowItWorks from "@/components/HowItWorks";
import Testimonials from "@/components/Testimonials";
import Faq from "@/components/Faq";
import Footer from "@/components/Footer";
import ArchetypeQuiz from "@/components/ArchetypeQuiz";
import HacksSection from "@/components/HacksSection";
import ContactForm from "@/components/ContactForm";
import ArchitectDashboard from "@/components/ArchitectDashboard";
import PowerLensGenerator from "@/components/PowerLensGenerator";
import GrimorioTacticoSection from "@/components/GrimorioTacticoSection";
import SRAPMetronome from "@/components/SRAPMetronome";
import OraculoChalamandra from "@/components/OraculoChalamandra";
import KitMagistralRPG from "@/components/KitMagistralRPG";
import PremiumServices from "@/components/PremiumServices";
import SrapRitual from "@/components/SrapRitual";
import Header from "@/components/Header";
import WhatsAppFloat from "@/components/WhatsAppFloat";
import TheCodex from "@/components/TheCodex";
import ModalManager from "@/components/ModalManager";

const readJSON = <T,>(key: string, fallback: T): T => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    localStorage.removeItem(key);
    return fallback;
  }
};

const readNumberSet = (key: string): Set<number> => {
  const values = readJSON<unknown>(key, []);
  if (!Array.isArray(values)) return new Set();

  return new Set(
    values.filter(
      (value): value is number =>
        typeof value === "number" && Number.isInteger(value) && value > 0,
    ),
  );
};

const writeJSON = <T,>(key: string, value: T): void => {
  localStorage.setItem(key, JSON.stringify(value));
};

const App: React.FC = () => {
  const [completedHacks, setCompletedHacks] = useState<Set<number>>(
    () => readNumberSet("completedHacks"),
  );
  const [earnedCerts, setEarnedCerts] = useState<Set<number>>(
    () => readNumberSet("earnedCertifications"),
  );
  const [purchasedServices, setPurchasedServices] = useState<
    PurchasedService[]
  >(() => readJSON<PurchasedService[]>("verifiedPurchasedServices", []));
  const [modalState, setModalState] = useState<ModalState>({
    isOpen: false,
    type: null,
    data: null,
  });
  const [celebrate, setCelebrate] = useState(false);
  const [dominantArchetype, setDominantArchetype] =
    useState<Archetype | null>(() =>
      readJSON<Archetype | null>("dominantArchetype", null),
    );
  const [aiDirective, setAiDirective] = useState("");
  const [isDirectiveLoading, setIsDirectiveLoading] = useState(false);
  const [directiveFeedback, setDirectiveFeedback] = useState<"helpful" | "not-helpful" | null>(() => readJSON<"helpful" | "not-helpful" | null>("directiveFeedback", null));

  const {
    startAudioContext,
    playSound,
    isAudioContextStarted,
  } = useAudio();

  useEffect(() => {
    const sessionId = new URLSearchParams(window.location.search).get("session_id");
    if (!sessionId) return;

    const completePurchase = async (): Promise<void> => {
      const service = await verifyPaymentSession(sessionId);
      window.history.replaceState({}, document.title, window.location.pathname);

      if (!service) {
        toast.error("No pudimos verificar el pago.", {
          description:
            "La compra no se activó porque Stripe no confirmó una sesión pagada válida.",
        });
        return;
      }

      setPurchasedServices((current) => {
        if (current.some((item) => item.type === service)) {
          return current;
        }

        const newService: PurchasedService = {
          type: service,
          date: new Date().toISOString(),
          status: "active",
        };
        const updated = [...current, newService];
        writeJSON("verifiedPurchasedServices", updated);
        return updated;
      });

      const archetype = readJSON<Archetype | null>("dominantArchetype", null);
      setModalState({
        isOpen: true,
        type: "postPayment",
        data: { serviceName: service, archetype },
      });
    };

    void completePurchase();
  }, []);

  const handleCelebration = useCallback(() => {
    setCelebrate(true);

    if (isAudioContextStarted) {
      const now = Tone.now();
      ["C4", "E4", "G4", "C5"].forEach((note, index) => {
        playSound("celebration", note, "8n", now + index * 0.15);
      });
    }

    window.setTimeout(() => setCelebrate(false), 4000);
  }, [isAudioContextStarted, playSound]);

  const checkCertifications = useCallback(
    (hacks: Set<number>, currentCerts: Set<number>) => {
      const newCerts = new Set(currentCerts);
      let earnedAny = false;

      CERTIFICATIONS_DATA.forEach((cert) => {
        if (newCerts.has(cert.id)) return;

        const isEarned =
          cert.id === 1
            ? hacks.size >= 3
            : cert.requiredHacks.every((id) => hacks.has(id));

        if (!isEarned) return;

        newCerts.add(cert.id);
        earnedAny = true;

        toast.success(`¡Certificación Obtenida: ${cert.title}!`, {
          description: cert.description,
          icon: <i className={`${cert.icon} ${cert.color}`} />,
          duration: 5000,
        });
      });

      if (earnedAny) {
        setEarnedCerts(newCerts);
        writeJSON("earnedCertifications", Array.from(newCerts));
        handleCelebration();
      }
    },
    [handleCelebration],
  );

  const toggleHackCompletion = useCallback(
    (id: number) => {
      if (!HACKS_DATA.some((hack) => hack.id === id)) return;

      const newCompleted = new Set(completedHacks);
      const isCompleting = !newCompleted.has(id);

      if (isCompleting) {
        newCompleted.add(id);
        playSound("completion", "C5", "16n");
        playSound("completion", "G5", "16n", Tone.now() + 0.1);
        checkCertifications(newCompleted, earnedCerts);
      } else {
        newCompleted.delete(id);
      }

      setCompletedHacks(newCompleted);
      writeJSON("completedHacks", Array.from(newCompleted));
    },
    [completedHacks, earnedCerts, checkCertifications, playSound],
  );

  const handleGenerateDirective = useCallback(async () => {
    if (isDirectiveLoading) return;

    playSound("uiClick", "G5", "32n");
    setIsDirectiveLoading(true);
    setAiDirective("");

    try {
      const completedHackTitles =
        HACKS_DATA.filter((hack) => completedHacks.has(hack.id))
          .map((hack) => hack.title)
          .join(", ") || "ninguno";
      const remainingHacks =
        HACKS_DATA.filter((hack) => !completedHacks.has(hack.id))
          .map((hack) => hack.title)
          .join(", ") || "ninguno";
      const archetypeInfo = dominantArchetype
        ? `Su arquetipo dominante es '${dominantArchetype}'.`
        : "Aún no ha descubierto su arquetipo.";

      const directive = await generateStrategicDirective(
        completedHackTitles,
        remainingHacks,
        archetypeInfo,
        directiveFeedback || "Sin feedback previo.",
      );

      setAiDirective(directive);
      playSound("directive", "G5", "32n");
      playSound("directive", "D6", "32n", Tone.now() + 0.075);
    } catch (error) {
      console.error(
        "Error generating directive:",
        error instanceof Error ? error.message : "unknown",
      );
      setAiDirective("El Oráculo está nublado. Intenta de nuevo.");
    } finally {
      setIsDirectiveLoading(false);
    }
  }, [
    completedHacks,
    dominantArchetype,
    directiveFeedback,
    isDirectiveLoading,
    playSound,
  ]);

  const showModal = useCallback(
    (type: ModalState["type"], data: ModalData = null) => {
      playSound("modalOpen");
      setModalState({ isOpen: true, type, data });
    },
    [playSound],
  );

  const hideModal = useCallback(() => {
    playSound("modalClose");
    setModalState({ isOpen: false, type: null, data: null });
  }, [playSound]);

  const handleQuizComplete = useCallback(
    (archetype: Archetype) => {
      setDominantArchetype(archetype);
      writeJSON("dominantArchetype", archetype);
      handleCelebration();

      window.setTimeout(() => {
        document
          .getElementById("dashboard")
          ?.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 500);
    },
    [handleCelebration],
  );

  const handleRetakeQuiz = useCallback(() => {
    playSound("uiClick", "G5", "32n");
    setDominantArchetype(null);
    localStorage.removeItem("dominantArchetype");
    localStorage.removeItem("directiveFeedback");
    setDirectiveFeedback(null);
    // Retaking the diagnostic must not erase earned work.
  }, [playSound]);

  const handleComboReveal = useCallback(() => {
    playSound("comboReveal", "C4", "16n");
    playSound("comboReveal", "E4", "16n", Tone.now() + 0.07);
    playSound("comboReveal", "A4", "16n", Tone.now() + 0.14);
  }, [playSound]);

  return (
    <div
      className="min-h-screen bg-black font-sans selection:bg-yellow-400 selection:text-black"
      onClick={() => void startAudioContext()}
    >
      <SEO />
      <Toaster position="top-center" expand={false} richColors theme="dark" />
      {celebrate && <Confetti />}

      <Header
        completedCount={completedHacks.size}
        totalCount={HACKS_DATA.length}
      />

      <motion.main
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <Introduction />
        <HowItWorks />

        {!dominantArchetype ? (
          <ArchetypeQuiz
            onQuizComplete={handleQuizComplete}
            playSelectSound={() => playSound("quizSelect", "C3")}
          />
        ) : (
          <>
            <ArchitectDashboard
              completedHacks={completedHacks}
              earnedCerts={earnedCerts}
              dominantArchetype={dominantArchetype}
              onGenerateDirective={handleGenerateDirective}
              aiDirective={aiDirective}
              isDirectiveLoading={isDirectiveLoading}
              purchasedServices={purchasedServices}
              directiveFeedback={directiveFeedback}
              onDirectiveFeedback={(feedback) => {
                setDirectiveFeedback(feedback);
                writeJSON("directiveFeedback", feedback);
              }}
            />
            <PowerLensGenerator />
          </>
        )}

        <HacksSection
          hacks={HACKS_DATA}
          completedHacks={completedHacks}
          onActivateClick={(id) =>
            showModal("activation", HACKS_DATA.find((hack) => hack.id === id) ?? null)
          }
          onAmplifyClick={(id) =>
            showModal("hack", HACKS_DATA.find((hack) => hack.id === id) ?? null)
          }
          playUIClick={() => playSound("uiClick", "G5", "32n")}
        />

        {dominantArchetype && (
          <div className="py-12 text-center">
            <button
              onClick={handleRetakeQuiz}
              className="rounded-2xl border border-white/10 bg-white/5 px-8 py-4 text-xs font-black uppercase tracking-widest text-gray-400 transition-all hover:bg-white/10 hover:text-white"
            >
              Reiniciar Diagnóstico
            </button>
          </div>
        )}

        <GrimorioTacticoSection />
        <OraculoChalamandra onComboReveal={handleComboReveal} />
        <KitMagistralRPG
          onOpenModule={(id) =>
            showModal("hack", HACKS_DATA.find((hack) => hack.id === id) ?? null)
          }
        />
        <SrapRitual
          onActivate={() => showModal("srap")}
          playUIClick={() => playSound("uiClick", "G5", "32n")}
        />
        <SRAPMetronome />
        <TheCodex />
        <Testimonials />
        <PremiumServices
          onServiceClick={(type) => showModal(type)}
          playUIClick={() => playSound("uiClick", "G5", "32n")}
        />
        <ContactForm />
        <Faq />
      </motion.main>

      <Footer />

      <AnimatePresence>
        <ModalManager
          modalState={modalState}
          hideModal={hideModal}
          showModal={showModal}
          toggleHackCompletion={toggleHackCompletion}
        />
      </AnimatePresence>

      <WhatsAppFloat />
    </div>
  );
};

export default App;
