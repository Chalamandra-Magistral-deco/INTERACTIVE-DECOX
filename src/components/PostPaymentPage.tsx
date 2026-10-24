import React, { useEffect, useState } from "react";

import { generatePostPaymentDirective } from "@/services/geminiService";
import { DISCOVERY_APP_URL } from "@/config/public";
import { T } from "@/core/Telemetry";
import { Archetype, ServiceType } from "@/utils/types";

interface PostPaymentPageProps {
  serviceName: ServiceType;
  archetype: Archetype | null;
}

const SERVICE_LABELS: Record<ServiceType, string> = {
  discovery: "Sesión Descubrimiento",
};

const PostPaymentPage: React.FC<PostPaymentPageProps> = ({
  serviceName,
  archetype,
}) => {
  const [directive, setDirective] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let active = true;

    // Tracking de pago verificado (una sola vez por sesión)
    T.payment.success(serviceName);

    const fetchDirective = async (): Promise<void> => {
      setIsLoading(true);
      const result = await generatePostPaymentDirective(
        serviceName,
        archetype,
      );

      if (active) {
        setDirective(result);
        setIsLoading(false);
      }
    };

    void fetchDirective();

    return () => {
      active = false;
    };
  }, [serviceName, archetype]);

  const renderDeliveryAction = (): React.ReactNode => (
    <div className="space-y-5">
      <p className="text-lg text-gray-300">
        Tu compra fue verificada. La Sesión de Descubrimiento es una experiencia
        autoguiada de cinco fases que termina con tu Ruta Inicial y un informe
        ejecutivo descargable en PDF/A4 y JSON.
      </p>

      {DISCOVERY_APP_URL ? (
        <a
          href={DISCOVERY_APP_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block rounded-xl bg-yellow-500 px-8 py-4 font-black text-black shadow-xl transition-all hover:scale-105 hover:bg-yellow-400"
        >
          <i className="fa-solid fa-compass mr-2" />
          ABRIR MI SESIÓN INTERACTIVA
        </a>
      ) : (
        <div
          role="status"
          className="rounded-xl border border-amber-400/30 bg-amber-400/10 px-5 py-4 text-left text-sm text-amber-100"
        >
          La URL de entrega de la aplicación aún no está configurada. Antes de
          activar ventas, define VITE_DISCOVERY_APP_URL con la dirección pública
          verificada de la Sesión de Descubrimiento.
        </div>
      )}

      <div className="border-t border-gray-700 pt-4">
        <p className="mb-3 text-sm text-gray-400">
          ¿También necesitas acompañamiento humano? Puedes agendarlo por separado.
        </p>
        <a
          href="https://calendly.com/chalamandra/discovery"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block rounded-xl border border-white/15 px-6 py-3 font-bold text-white transition-colors hover:bg-white/10"
        >
          <i className="fa-solid fa-calendar-days mr-2" />
          AGENDAR ACOMPAÑAMIENTO OPCIONAL
        </a>
      </div>
    </div>
  );

  return (
    <div className="space-y-8 text-center text-white">
      <div>
        <h4 className="text-3xl font-bold text-green-400">
          Pago Verificado
        </h4>
        <p className="mt-3 text-xl leading-relaxed text-gray-300">
          Has adquirido{" "}
          <strong className="uppercase text-white">
            {SERVICE_LABELS[serviceName]}
          </strong>
          .
        </p>
      </div>

      <div className="flex min-h-[150px] items-center justify-center rounded-2xl border border-gray-700 bg-gray-800 p-6">
        {isLoading ? (
          <i className="fa-solid fa-spinner fa-spin text-3xl text-yellow-400" />
        ) : (
          <p className="text-lg italic leading-relaxed text-yellow-300">
            {directive}
          </p>
        )}
      </div>

      <div className="border-t border-gray-700 py-6">
        <h5 className="mb-6 text-xl font-bold text-white">
          SIGUIENTE ACCIÓN
        </h5>
        {renderDeliveryAction()}
      </div>
    </div>
  );
};

export default PostPaymentPage;
