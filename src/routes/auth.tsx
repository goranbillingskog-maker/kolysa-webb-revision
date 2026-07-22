import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Logga in – Kolysa admin" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate({ to: "/admin", replace: true });
    });
  }, [navigate]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: window.location.origin + "/admin" },
        });
        if (error) throw error;
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
      }
      navigate({ to: "/admin", replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Något gick fel");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-6 py-16">
      <Link to="/" className="mb-8 font-serif text-2xl text-ink">
        Kolysa
      </Link>
      <h1 className="font-serif text-3xl text-ink">
        {mode === "signup" ? "Skapa admin-konto" : "Logga in"}
      </h1>
      <p className="mt-2 text-sm text-subtle">
        Endast administratörer har åtkomst.
      </p>
      <form onSubmit={submit} className="mt-8 space-y-4">
        <div>
          <label className="block text-sm font-medium text-ink">E-post</label>
          <input
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 w-full rounded-[6px] border border-rule bg-paper px-3 py-2 text-ink outline-none focus:border-primary"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-ink">Lösenord</label>
          <input
            type="password"
            required
            minLength={8}
            autoComplete={mode === "signup" ? "new-password" : "current-password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 w-full rounded-[6px] border border-rule bg-paper px-3 py-2 text-ink outline-none focus:border-primary"
          />
        </div>
        {error && (
          <p className="text-sm text-red-700" role="alert">
            {error}
          </p>
        )}
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-[6px] bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-60"
        >
          {loading
            ? "Ett ögonblick…"
            : mode === "signup"
              ? "Skapa konto"
              : "Logga in"}
        </button>
      </form>
      <button
        type="button"
        onClick={() => setMode(mode === "signup" ? "signin" : "signup")}
        className="mt-6 text-sm text-subtle underline"
      >
        {mode === "signup"
          ? "Har du redan ett konto? Logga in"
          : "Första gången? Skapa konto"}
      </button>
    </main>
  );
}
