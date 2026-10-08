import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

let supabase: ReturnType<typeof createClient> | undefined;

type AuthDetails = {
  authorization_id: string;
  client: {
    name: string;
  };
  redirect_uri: string;
  scope: string;
};

const getSupabaseClient = () => {
  if (supabase) return supabase;

  const url = import.meta.env.VITE_SUPABASE_URL;
  const publishableKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

  if (!url || !publishableKey) {
    throw new Error(
      "Faltan VITE_SUPABASE_URL o VITE_SUPABASE_PUBLISHABLE_KEY en el entorno.",
    );
  }

  supabase = createClient(url, publishableKey);
  return supabase;
};

export default function ConsentPage() {
  const [details, setDetails] = useState<AuthDetails | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);

  const authorizationId = new URLSearchParams(window.location.search).get(
    "authorization_id",
  );

  useEffect(() => {
    const load = async () => {
      if (!authorizationId) {
        setError("Falta authorization_id.");
        setLoading(false);
        return;
      }

      try {
        const client = getSupabaseClient();
        const { data: sessionData, error: sessionError } =
          await client.auth.getSession();

        if (sessionError) throw sessionError;
        if (!sessionData.session) {
          throw new Error(
            "No hay una sesión de Supabase iniciada en este navegador.",
          );
        }

        const { data, error } =
          await client.auth.oauth.getAuthorizationDetails(authorizationId);

        if (error) throw error;

        if (!("authorization_id" in data)) {
          window.location.assign(data.redirect_url);
          return;
        }

        setDetails(data as AuthDetails);
      } catch (loadError) {
        setError(
          loadError instanceof Error
            ? loadError.message
            : "No se pudo cargar la autorización.",
        );
      } finally {
        setLoading(false);
      }
    };

    void load();
  }, [authorizationId]);

  const decide = async (approve: boolean) => {
    if (!authorizationId || busy) return;

    setBusy(true);

    try {
      const client = getSupabaseClient();
      const result = approve
        ? await client.auth.oauth.approveAuthorization(authorizationId)
        : await client.auth.oauth.denyAuthorization(authorizationId);

      if (result.error) throw result.error;

      window.location.assign(result.data.redirect_url);
    } catch (decisionError) {
      setError(
        decisionError instanceof Error
          ? decisionError.message
          : "No se pudo completar la autorización.",
      );
      setBusy(false);
    }
  };

  if (loading) {
    return <div style={{ padding: 40 }}>Cargando autorización…</div>;
  }

  if (error) {
    return (
      <div style={{ padding: 40, fontFamily: "sans-serif" }}>
        <h1>Autorización OAuth</h1>
        <p>{error}</p>
      </div>
    );
  }

  if (!details) return null;

  return (
    <main
      style={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        padding: 24,
        fontFamily: "sans-serif",
      }}
    >
      <section
        style={{
          width: "100%",
          maxWidth: 560,
          padding: 32,
          border: "1px solid #ddd",
          borderRadius: 16,
          background: "#fff",
        }}
      >
        <h1>Autorizar {details.client.name}</h1>

        <p>Esta aplicación solicita acceso a tu cuenta.</p>

        <p>
          <strong>Redirección:</strong> {details.redirect_uri}
        </p>

        {details.scope?.trim() && (
          <>
            <strong>Permisos solicitados:</strong>
            <ul>
              {details.scope.split(" ").map((scope) => (
                <li key={scope}>{scope}</li>
              ))}
            </ul>
          </>
        )}

        <div style={{ display: "flex", gap: 12, marginTop: 24 }}>
          <button
            disabled={busy}
            onClick={() => void decide(false)}
          >
            Denegar
          </button>

          <button
            disabled={busy}
            onClick={() => void decide(true)}
          >
            Aprobar
          </button>
        </div>
      </section>
    </main>
  );
}
