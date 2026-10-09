# INTERACTIVE-DECOX: Firebase Hosting + Vercel

## Arquitectura
- Firebase sirve el frontend compilado en dist.
- Vercel conserva las APIs de IA, contacto, pagos y webhook.
- src/config/api.ts resuelve las URL mediante VITE_API_BASE_URL.
- .env.firebase contiene solo la URL pública del backend.

## Firebase Hosting
- Proyecto: interactive-decox-875051-3b397
- Sitio: interactive-decox-875051-3b397
- El directorio publicado es dist.
- La regla SPA excluye /api y sus rutas descendientes.
- No se crean Firebase Functions ni se migra el backend.

## Seguridad y validación
- CORS restringe los orígenes y gestiona preflight explícito.
- El webhook conserva su validación de firma.
- No desplegar hasta finalizar las pruebas y confirmar las APIs.
- Contact delivery uses Formspree through the endpoint configured in `api/contact.ts`. Verify Formspree notifications and test a real submission before production.
