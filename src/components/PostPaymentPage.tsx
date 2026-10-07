import React, { useEffect, useState } from "react";

import { generatePostPaymentDirective } from "@/services/geminiService";
import { Archetype, ServiceType } from "@/utils/types";
import { getWhatsAppUrl } from "@/config/public";

interface PostPaymentPageProps {
  serviceName: ServiceType;
  archetype: Archetype | null;
}

const SERVICE_LABELS: Record<ServiceType, string> = {
  discovery: "Sesión Descubrimiento",
  magistral: "Kit Magistral",
};

const PostPaymentPage: React.FC<PostPaymentPageProps> = ({
  serviceName,
  archetype,
}) => {
  const [directive, setDirective] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let active = true;

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

  const renderDeliveryAction = (): React.ReactNode => {
    if (serviceName === "discovery") {
      return (
        <div className="space-y-4">
          <p className="text-lg text-gray-300">
            Tu pago fue verificado. El siguiente paso es agendar tu sesión de
            descubrimiento.
          </p>
          <a
            href="https://calendly.com/chalamandra/discovery"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block rounded-xl bg-yellow-500 px-8 py-4 font-black text-black shadow-xl transition-all hover:scale-105 hover:bg-yellow-400"
          >
            <i className="fa-solid fa-calendar-days mr-2" />
            AGENDAR SESIÓN AHORA
          </a>
        </div>
      );
    }

    const whatsappUrl = getWhatsAppUrl();

    return (
      <div className="space-y-4">
        <p className="text-lg text-gray-300">
          Tu pago fue verificado. El siguiente paso es coordinar la activación
          de tu Kit Magistral.
        </p>

        {whatsappUrl ? (
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block rounded-xl bg-green-600 px-8 py-4 font-black text-white shadow-xl transition-all hover:scale-105 hover:bg-green-500"
          >
            <i className="fa-brands fa-whatsapp mr-2" />
            UNIRSE A "LA FORJA"
          </a>
        ) : (
          <p className="rounded-xl border border-white/10 bg-white/5 p-4 text-sm text-gray-400">
            WhatsApp aún no está configurado. Conserva esta confirmación y
            continúa por el canal de contacto disponible.
          </p>
        )}
      </div>
    );
  };

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
