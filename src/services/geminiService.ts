type GeminiTask = 'strategic-directive' | 'post-payment-directive' | 'hook' | 'contact-confirmation' | 'alchemical-combo';

interface GeminiRequest {
  task: GeminiTask;
  payload: Record<string, string | null | undefined>;
}

async function callGemini(request: GeminiRequest, fallback: string): Promise<string> {
  try {
    const response = await fetch('/api/gemini', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(request),
    });
    if (!response.ok) throw new Error(`Gemini request failed: ${response.status}`);
    const data = await response.json() as { text?: string };
    if (!data.text) throw new Error('Empty Gemini response.');
    return data.text.trim();
  } catch (error) {
    console.error('Gemini request failed:', error);
    return fallback;
  }
}

export function generateStrategicDirective(completedHacks: string, remainingHacks: string, archetypeInfo: string, feedback = 'Sin feedback previo.'): Promise<string> {
  return callGemini({ task: 'strategic-directive', payload: { completedHacks, remainingHacks, archetypeInfo, feedback } }, 'El Oráculo está nublado. Intenta de nuevo.');
}

export function generatePostPaymentDirective(serviceName: string, archetype: string | null): Promise<string> {
  return callGemini({ task: 'post-payment-directive', payload: { serviceName, archetype } }, 'Tu camino ha comenzado. Prepara tu mente para la transformación.');
}

export function generarHook(power: string, domain: string): Promise<string> {
  return callGemini({ task: 'hook', payload: { power, domain } }, 'El Oráculo no está disponible. Intenta de nuevo.');
}

export function generateContactConfirmation(objective: string): Promise<string> {
  return callGemini({ task: 'contact-confirmation', payload: { objective } }, 'Tu solicitud ha sido recibida y está siendo procesada.');
}

export function generateAlchemicalCombo(power1: string, power2: string): Promise<string> {
  return callGemini({ task: 'alchemical-combo', payload: { power1, power2 } }, 'Error: Fusión fallida. Los ingredientes son inestables.');
}
