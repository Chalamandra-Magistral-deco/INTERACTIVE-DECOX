# INTERACTIVE-DECOX // Chalamandra Magistral

Aplicación React + Vite para diagnóstico de arquetipos, dominio de Hacks Magistrales, directivas generativas y flujo de compra.

## Arquitectura

```
src/
├── components/      # UI y experiencias
├── config/          # configuración pública Vite
├── hooks/           # ciclos de vida reutilizables (audio)
├── services/        # frontera cliente -> API
└── utils/           # catálogo y tipos de dominio
api/
├── ai.ts            # Gemini server-side
├── contact.ts       # entrega de formularios
├── verify-payment.ts # verificación de Checkout Session
└── stripe-webhook.ts # entrada firmada de Stripe
```

El navegador nunca recibe secretos de Gemini, Stripe o Resend. Los valores `VITE_*` son únicamente configuración pública.

## Desarrollo

Requisitos: Node.js 20+ y npm.

```bash
npm ci
npm run dev
```

Validación:

```bash
npm run lint
npm run test -- --run
npm run build
```

## Variables de entorno

Copia `.env.example` a tu entorno de desarrollo o configura las variables en la plataforma de despliegue.

### Server-only

- `GEMINI_API_KEY`
- `GEMINI_MODEL`
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `STRIPE_DISCOVERY_PRICE_ID`
- `STRIPE_MAGISTRAL_PRICE_ID`
- `RESEND_API_KEY`
- `CONTACT_TO_EMAIL`
- `CONTACT_FROM_EMAIL`

### Públicas

- `VITE_STRIPE_DISCOVERY_URL`
- `VITE_STRIPE_MAGISTRAL_URL`
- `VITE_WHATSAPP_NUMBER`
- `VITE_WHATSAPP_MESSAGE`

## Flujo de pago

```
Usuario
  │
  ▼
Payment Link de Stripe
  │
  ├──► checkout.session.completed
  │        │
  │        ▼
  │   /api/stripe-webhook
  │        │
  │        ▼
  │   Fulfillment / CRM
  │
  └──► success?session_id={CHECKOUT_SESSION_ID}
           │
           ▼
     /api/verify-payment
           │
           ▼
       UI verificada
```

La interfaz nunca considera una compra válida por una simple bandera de URL.

## Feedback loop

```
Interacción del agente
      │
      ├──► progreso local
      │       │
      │       ▼
      │   directiva IA
      │       │
      │       ▼
      └──► siguiente acción

Pago Stripe
      │
      ▼
verificación server-side
      │
      ▼
estado adquirido
      │
      ▼
siguiente acción operativa
```

El progreso de hacks permanece como estado de experiencia en el navegador. No debe usarse como mecanismo de autorización de contenido premium.

## Producción

Antes de activar ventas, deben existir los dos productos/precios correctos en Stripe y sus respectivos Payment Links. El Payment Link de 99 MXN asociado a “Mapa Tricéntrico” detectado en la cuenta no debe reutilizarse para los servicios de $27/$397 USD.

Configura además el webhook de Stripe apuntando a:

`/api/stripe-webhook`

y usa una URL de fulfillment duradera si existe un sistema externo que deba registrar o provisionar las compras.
