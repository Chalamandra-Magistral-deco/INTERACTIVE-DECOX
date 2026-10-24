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
        Tu pago fue verificado por Stripe. Continúa con tu Sesión de Descubrimiento y después agenda la conversación de seguimiento.
      </p>
      {DISCOVERY_APP_URL ? (
        <a
          href={DISCOVERY_APP_URL}
          className="inline-flex w-full items-center justify-center rounded-xl bg-yellow-500 px-6 py-4 font-black text-black shadow-xl transition-all hover:scale-[1.01] hover:bg-yellow-400 sm:w-auto"
        >
          <i className="fa-solid fa-compass mr-2" />
          INICIAR SESIÓN DE DESCUBRIMIENTO
          <i className="fa-solid fa-arrow-up-right-from-square ml-2 text-sm" />
        </a>
      ) : (
        <p role="status" className="rounded-xl border border-yellow-500/30 bg-yellow-500/10 p-4 text-sm leading-relaxed text-yellow-100">
          El pago está confirmado. La dirección de la aplicación de Descubrimiento todavía no está configurada; conserva esta confirmación y agenda tu sesión mientras se habilita la entrega interactiva.
        </p>
      )}
      <div>
        <a
          href="https://calendly.com/chalamandra/discovery"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block rounded-xl border border-white/15 px-6 py-3 font-bold text-white transition-colors hover:bg-white/10"
        >
          <i className="fa-solid fa-calendar-days mr-2" />
          AGENDAR SESIÓN
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
