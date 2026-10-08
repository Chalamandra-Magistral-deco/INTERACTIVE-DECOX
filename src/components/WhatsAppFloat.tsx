import React from "react";
import { getWhatsAppUrl } from "@/config/public";

const WhatsAppFloat: React.FC = () => {
  const url = getWhatsAppUrl();
  if (!url) return null;

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="whatsapp-float"
      aria-label="Contactar por WhatsApp"
    >
      <i className="fa-brands fa-whatsapp" />
    </a>
  );
};

export default WhatsAppFloat;
