import React, { useState } from "react";
import { apiUrl } from "@/config/api";
import { generateContactConfirmation } from "@/services/geminiService";

type FormStatus = "idle" | "loading" | "success" | "error";

interface FormData {
  name: string;
  email: string;
  phone: string;
  objective: string;
  service: string;
  website: string;
}

const initialFormData: FormData = {
  name: "",
  email: "",
  phone: "",
  objective: "",
  service: "Transformación Total",
  website: "",
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const ContactForm: React.FC = () => {
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [status, setStatus] = useState<FormStatus>("idle");
  const [message, setMessage] = useState("");
  const [formContainerClass, setFormContainerClass] =
    useState("contact-form-container");

  const handleChange = (
    event: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ): void => {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>,
  ): Promise<void> => {
    event.preventDefault();

    if (
      formData.name.trim().length < 2 ||
      !EMAIL_PATTERN.test(formData.email.trim()) ||
      formData.objective.trim().length < 5
    ) {
      setStatus("error");
      setMessage("Completa nombre, email válido y objetivo.");
      return;
    }

    setStatus("loading");
    setMessage("");

    try {
      const response = await fetch(apiUrl("/api/contact"), {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Contact delivery failed");
      }

      const personalizedMessage = await generateContactConfirmation(
        formData.objective,
      );

      setMessage(`SOLICITUD RECIBIDA. ${personalizedMessage}`);
      setStatus("success");
      setFormData(initialFormData);

      setFormContainerClass(
        "contact-form-container form-pulse-animation",
      );
      window.setTimeout(
        () => setFormContainerClass("contact-form-container"),
        1000,
      );
    } catch (error) {
      console.error(
        "Error submitting contact form:",
        error instanceof Error ? error.message : "unknown",
      );
      setStatus("error");
      setMessage(
        "No pudimos entregar tu solicitud. Verifica la configuración de contacto e inténtalo de nuevo.",
      );
    }
  };

  return (
    <section className="mx-auto max-w-4xl px-6 py-20">
      <h2 className="mb-6 text-center text-4xl font-black text-purple-400">
        <i className="fa-solid fa-feather-pointed mr-4" />
        APLICA A TU TRANSFORMACIÓN
      </h2>

      <p className="mb-12 text-center text-xl font-semibold italic text-gray-300">
        El primer paso no se da, se invoca. Llena el formulario para iniciar tu
        decodificación.
      </p>

      <div className={formContainerClass}>
        <form onSubmit={handleSubmit} noValidate>
          <input
            type="text"
            name="website"
            value={formData.website}
            onChange={handleChange}
            tabIndex={-1}
            autoComplete="off"
            aria-hidden="true"
            className="absolute -left-[9999px] h-px w-px opacity-0"
          />
          <div className="mb-6 grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <label
                htmlFor="name"
                className="mb-2 block text-lg font-bold text-gray-300"
              >
                Nombre Completo *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                maxLength={120}
                autoComplete="name"
                required
                aria-label="Nombre Completo"
              />
            </div>

            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-lg font-bold text-gray-300"
              >
                Email *
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                maxLength={200}
                autoComplete="email"
                required
                aria-label="Email"
              />
            </div>
          </div>

          <div className="mb-6 grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <label
                htmlFor="phone"
                className="mb-2 block text-lg font-bold text-gray-300"
              >
                Teléfono / WhatsApp (Opcional)
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                maxLength={40}
                autoComplete="tel"
                aria-label="Teléfono o WhatsApp"
              />
            </div>

            <div>
              <label
                htmlFor="service"
                className="mb-2 block text-lg font-bold text-gray-300"
              >
                Servicio de Interés
              </label>
              <select
                id="service"
                name="service"
                value={formData.service}
                onChange={handleChange}
                aria-label="Servicio de Interés"
              >
                <option>Transformación Total</option>
                <option>Sesión Descubrimiento</option>
              </select>
            </div>
          </div>

          <div className="mb-8">
            <label
              htmlFor="objective"
              className="mb-2 block text-lg font-bold text-gray-300"
            >
              ¿Cuál es tu principal objetivo o fricción actual? *
            </label>
            <textarea
              id="objective"
              name="objective"
              rows={5}
              value={formData.objective}
              onChange={handleChange}
              maxLength={2000}
              required
              aria-label="Objetivo o fricción actual"
            />
          </div>

          <button
            type="submit"
            disabled={status === "loading"}
            className="btn-dynamic pulse-glow w-full rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-5 text-center text-xl font-black text-white transition-all hover:from-purple-700 hover:to-pink-700 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {status === "loading" ? (
              <>
                <i className="fa-solid fa-spinner fa-spin mr-3" />
                ENVIANDO...
              </>
            ) : (
              "INICIAR PROTOCOLO DE CONTACTO"
            )}
          </button>
        </form>

        {message && (
          <div
            role={status === "error" ? "alert" : "status"}
            aria-live="polite"
            className={`mt-6 rounded-lg p-4 text-center text-lg font-bold ${
              status === "success"
                ? "bg-green-900 text-green-200"
                : "bg-red-900 text-red-200"
            }`}
          >
            {message}
          </div>
        )}
      </div>
    </section>
  );
};

export default ContactForm;
