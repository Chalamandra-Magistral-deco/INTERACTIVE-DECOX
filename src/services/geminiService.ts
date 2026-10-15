type AIResponse = {
  text?: string;
  error?: string;
};

const requestAI = async (
  operation:
    | "strategicDirective"
    | "postPaymentDirective"
    | "hook"
    | "contactConfirmation"
    | "alchemicalCombo",
  payload: Record<string, unknown>,
): Promise<string> => {
  const response = await fetch("/api/ai", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ operation, payload }),
  });

  let data: AIResponse = {};
  try {
    data = (await response.json()) as AIResponse;
  } catch {
    // Keep the client fallback deterministic when the API returns no JSON.
  }

  if (!response.ok || !data.text) {
    throw new Error(data.error || "AI request failed");
  }

  return data.text.trim();
};

export type StreamHandlers = {
  onChunk: (delta: string, fullText: string) => void;
  onDone?: (fullText: string) => void;
  onError?: (err: Error) => void;
  signal?: AbortSignal;
};

export async function streamStrategicDirective(
  completedHacks: string,
  remainingHacks: string,
  archetypeInfo: string,
  feedback: string,
  handlers: StreamHandlers,
): Promise<string> {
  const { onChunk, onDone, onError, signal } = handlers;
  let full = "";

  try {
    const response = await fetch("/api/ai", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        accept: "text/event-stream",
        "x-stream": "1",
      },
      body: JSON.stringify({
        operation: "strategicDirective",
        payload: { completedHacks, remainingHacks, archetypeInfo, feedback },
      }),
      signal,
    });

    if (!response.ok || !response.body) {
      throw new Error(`Stream failed: ${response.status}`);
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";

    while (true) {
      const { value, done } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const events = buffer.split("\n\n");
      buffer = events.pop() ?? "";

      for (const evt of events) {
        const line = evt.trim();
        if (!line.startsWith("data:")) continue;

        const payload = line.slice(5).trim();
        if (!payload) continue;

        try {
          const parsed = JSON.parse(payload) as {
            delta?: string;
            done?: boolean;
            error?: string;
          };

          if (parsed.error) {
            throw new Error(parsed.error);
          }
          if (parsed.delta) {
            full += parsed.delta;
            onChunk(parsed.delta, full);
          }
          if (parsed.done) {
            onDone?.(full);
            return full;
          }
        } catch (e) {
          // Ignorar chunks JSON malformados y seguir
          if (e instanceof Error && e.message !== "Unexpected end of JSON input") {
            throw e;
          }
        }
      }
    }

    onDone?.(full);
    return full;
  } catch (error) {
    const err = error instanceof Error ? error : new Error("Unknown stream error");
    onError?.(err);
    // Fallback: usar la versión no-streaming para no dejar al usuario sin directiva
    try {
      const fallback = await generateStrategicDirective(
        completedHacks,
        remainingHacks,
        archetypeInfo,
        feedback,
      );
      onChunk(fallback, fallback);
      onDone?.(fallback);
      return fallback;
    } catch {
      throw err;
    }
  }
}

export async function generateStrategicDirective(
  completedHacks: string,
  remainingHacks: string,
  archetypeInfo: string,
  feedback = "Sin feedback previo.",
): Promise<string> {
  try {
    return await requestAI("strategicDirective", {
      completedHacks,
      remainingHacks,
      archetypeInfo,
      feedback,
    });
  } catch (error) {
    console.error("Error generating strategic directive:", error);
    return "Error: No se pudo conectar con el Oráculo Chalamandra. Verifica la configuración del sistema.";
  }
}

export async function generatePostPaymentDirective(
  serviceName: string,
  archetype: string | null,
): Promise<string> {
  try {
    return await requestAI("postPaymentDirective", {
      serviceName,
      archetype: archetype || "",
    });
  } catch (error) {
    console.error("Error generating post-payment directive:", error);
    return "Tu camino ha comenzado. Prepara tu mente para la transformación. Los detalles de tu sesión llegarán pronto.";
  }
}

export async function generarHook(power: string, domain: string): Promise<string> {
  try {
    return await requestAI("hook", { power, domain });
  } catch (error) {
    console.error("Error generating hook:", error);
    return "Error: No se pudo conectar con el Oráculo Chalamandra. El sistema está experimentando interferencias.";
  }
}

export async function generateContactConfirmation(objective: string): Promise<string> {
  try {
    return await requestAI("contactConfirmation", { objective });
  } catch (error) {
    console.error("Error generating contact confirmation:", error);
    return "Tu solicitud ha sido recibida y está siendo procesada. El primer movimiento está en juego.";
  }
}

export async function generateAlchemicalCombo(power1: string, power2: string): Promise<string> {
  try {
    return await requestAI("alchemicalCombo", { power1, power2 });
  } catch (error) {
    console.error("Error generating alchemical combo:", error);
    return "Error: Fusión fallida. Los ingredientes son inestables. Revisa el protocolo.";
  }
}
