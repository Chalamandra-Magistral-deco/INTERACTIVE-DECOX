# Reequilibrio inverso — Fase 1: inventario de solo lectura

Este piloto recopila una instantánea no invasiva del host Linux donde se ejecute. Todavía no es un balanceador, autoscaler ni agente de migración. Su único objetivo es comprobar si el entorno expone señales útiles de memoria, PSI y ZRAM, y qué herramientas de runtime están presentes.

## Ejecutar

Requiere Python 3.10 o posterior y bibliotecas estándar; no instala paquetes ni necesita credenciales.

    python3 ops/reequilibrio_inverso/inventory.py > inventario-reequilibrio.json

Para muestrear PSI durante 5 segundos:

    python3 ops/reequilibrio_inverso/inventory.py --interval-seconds 5 > inventario-reequilibrio.json

## Qué observa

- Identidad básica del host, kernel, arquitectura, CPU y load average.
- Memoria del kernel y límites/uso del cgroup cuando estén disponibles.
- PSI de CPU, memoria e I/O: promedios informados por el kernel y deltas aproximados durante la ventana.
- Estadísticas de ZRAM desde /sys/block/zram*/mm_stat si existen.
- Uso del filesystem raíz y presencia (sin versiones ni argumentos) de CLIs habituales.

## Límites y seguridad

- No lee valores de variables de entorno ni credenciales.
- No muestra argumentos completos de procesos, direcciones de red ni secretos.
- No consulta APIs de Google Cloud/Azure, no enumera nodos Kubernetes y no cambia servicios.
- La ausencia de ZRAM, PSI o cgroups se reporta como no disponible, no como cero.
- Una sola muestra no justifica una migración. Para calcular un costo empresarial faltan todavía los nodos elegibles, telemetría P95/errores, afinidad/estado y precios reales.
- La fase de ejecución se mantiene deshabilitada explícitamente.

## Verificación local del parser

Desde esta carpeta:

    python3 -m unittest -v
