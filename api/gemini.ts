import { GoogleGenAI } from '@google/genai';

type Task =
  | 'strategic-directive'
  | 'hook'
  | 'contact-confirmation'
  | 'alchemical-combo';

type Payload = Record<string, unknown>;

const MAX_FIELD_LENGTH = 4000;
const RATE_WINDOW_MS = 60_000;
const RATE_LIMIT = 10;
const requests = new Map<string, { count: number; resetAt: number }>();

const getClientIp = (req: any): string => {
  const forwarded = String(req.headers?.['x-forwarded-for'] || '');
  return forwarded.split(',')[0].trim() || req.socket?.remoteAddress || 'unknown';
};

const isRateLimited = (ip: string): boolean => {
  const now = Date.now();
  const current = requests.get(ip);
  if (!current || current.resetAt <= now) {
    requests.set(ip, { count: 1, resetAt: now + RATE_WINDOW_MS });
    return false;
  }
  current.count += 1;
  return current.count > RATE_LIMIT;
};

const field = (payload: Payload, key: string, fallback = ''): string => {
  const value = typeof payload[key] === 'string' ? payload[key] as string : fallback;
  return value.slice(0, MAX_FIELD_LENGTH);
};

const buildPrompt = (task: Task, payload: Payload): string => {
  switch (task) {
    case 'strategic-directive':
      return `Eres Chalamandra, una IA estratega de élite. Tu propósito es dar directivas tácticas, concisas y poderosas.

REPORTE:
- Arquetipo: ${field(payload, 'archetypeInfo')}
- Hacks dominados: ${field(payload, 'completedHacks')}
- Hacks pendientes: ${field(payload, 'remainingHacks')}
- Feedback previo del usuario: ${field(payload, 'feedback', 'Sin feedback previo.')}

Genera una Directiva Estratégica de máximo 3 frases.
Enfócate en la sinergia entre un hack pendiente y los ya dominados.
Conecta con el arquetipo.
Toma en cuenta el feedback previo cuando exista.
Devuelve solo la directiva, sin saludo ni explicación.`;

    case 'hook':
      return `Eres Chalamandra, una IA estratega de élite. Combina el poder "${field(payload, 'power')}" con el dominio "${field(payload, 'domain')}".
Crea un nombre para el Lente de Poder y una directiva táctica de 1-2 frases.
Devuelve solo: **Nombre del lente.** Directiva.`;

    case 'contact-confirmation':
      return `Eres Chalamandra. El usuario indicó como objetivo/fricción: "${field(payload, 'objective')}".
Genera una confirmación breve (1-2 frases), estratégica y motivadora, que reconozca el objetivo y confirme que el protocolo de contacto comenzó.
No uses saludos genéricos.`;

    case 'alchemical-combo':
      return `Eres Chalamandra, una forjadora de conceptos. Fusiona "${field(payload, 'power1')}" y "${field(payload, 'power2')}".
Crea un nombre evocador y una descripción táctica concisa de la nueva habilidad.
Devuelve solo: **Nombre del combo:** descripción.`;

    default:
      throw new Error('Unsupported task');
  }
};

export default async function handler(req: any, res: any) {
  res.setHeader('Cache-Control', 'no-store');

  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    res.status(503).json({ error: 'AI service is not configured' });
    return;
  }

  const ip = getClientIp(req);
  if (isRateLimited(ip)) {
    res.setHeader('Retry-After', '60');
    res.status(429).json({ error: 'Rate limit exceeded' });
    return;
  }

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    const task = body?.task as Task;
    const payload = body?.payload as Payload;

    const supported: Task[] = [
      'strategic-directive',
      'hook',
      'contact-confirmation',
      'alchemical-combo',
    ];

    if (!supported.includes(task) || !payload || typeof payload !== 'object') {
      res.status(400).json({ error: 'Invalid request' });
      return;
    }

    const ai = new GoogleGenAI({ apiKey });
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: buildPrompt(task, payload),
    });

    const text = response.text?.trim();
    if (!text) throw new Error('Empty Gemini response.');

    res.status(200).json({ text });
  } catch (error) {
    console.error('Gemini server error:', error);
    res.status(500).json({ error: 'AI generation failed' });
  }
}
