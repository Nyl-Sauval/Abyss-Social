import React, {useState} from "react";
import {Link, useNavigate} from "react-router-dom";
import {useMutation} from "../hooks/useMutation";
import {useAuth} from "../hooks/useAuth.ts";
import type {LoginCredentials, LoginResponse} from "../types/Login.ts";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { mutate, loading, error } = useMutation<LoginCredentials, LoginResponse>("/auth/login", {
    method: "POST",
  });
  const { login } = useAuth();
  const navigate = useNavigate();

  const loginErrorMessage = error ? "Email ou mot de passe incorrect." : null;

  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault();
    try {
      const response = await mutate({ email, password });
      if (response && response.token) {
        await login(response.token);
        navigate("/");
      }
    } catch (err) {
      console.error("Login failed:", err);
    }
  };

  return (
    <div className="relative overflow-hidden bg-light px-4 py-12 sm:px-6 lg:px-8 min-h-[calc(100vh-10rem)] flex items-center justify-center">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-24 -left-20 h-72 w-72 rounded-full bg-secondary/15 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-80 w-80 rounded-full bg-accent/20 blur-3xl" />
      </div>

      <div className="relative w-full max-w-5xl overflow-hidden rounded-[2rem] bg-white shadow-[0_25px_80px_rgba(7,50,73,0.18)] ring-1 ring-primary/10 grid lg:grid-cols-[1.05fr_0.95fr]">
        <div className="hidden lg:flex flex-col justify-between bg-primary text-white p-12 xl:p-14">
          <div>
            <span className="inline-flex items-center rounded-full bg-white/10 px-4 py-1 text-sm font-semibold tracking-wide text-light">
              Abyss Social
            </span>
            <h1 className="mt-8 text-4xl xl:text-5xl font-bold leading-tight">
              Replonge dans ta communauté.
            </h1>
            <p className="mt-5 max-w-md text-white/75 text-base leading-7">
              Accède à ton profil, retrouve tes échanges et continue à naviguer
              dans un espace pensé pour l’exploration.
            </p>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
            <p className="text-sm uppercase tracking-[0.22em] text-white/60">
              Connexion rapide
            </p>
            <p className="mt-3 text-sm text-white/80 leading-6">
              Utilise ton adresse email et ton mot de passe pour rejoindre
              directement ton espace personnel.
            </p>
          </div>
        </div>

        <div className="p-8 sm:p-10 lg:p-12 xl:p-14">
          <div className="max-w-md mx-auto lg:mx-0">
            <div className="mb-8 lg:mb-10">
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-secondary">
                Connexion
              </p>
              <h2 className="mt-3 text-3xl font-bold text-primary">
                Bon retour parmi nous
              </h2>
              <p className="mt-3 text-gray leading-7">
                Entre tes identifiants pour accéder à ton compte Abyss.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="mb-2 block text-sm font-semibold text-primary">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="toi@exemple.com"
                  className="w-full rounded-2xl border border-primary/10 bg-light/70 px-4 py-3.5 text-primary placeholder:text-gray outline-none transition focus:border-secondary focus:ring-4 focus:ring-secondary/10"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-primary">
                  Mot de passe
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="w-full rounded-2xl border border-primary/10 bg-light/70 px-4 py-3.5 text-primary placeholder:text-gray outline-none transition focus:border-secondary focus:ring-4 focus:ring-secondary/10"
                />
              </div>

              {loginErrorMessage && (
                <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {loginErrorMessage}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-2xl bg-accent px-5 py-3.5 font-bold text-white shadow-lg shadow-accent/25 transition hover:-translate-y-0.5 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:translate-y-0"
              >
                {loading ? "Connexion en cours..." : "Se connecter"}
              </button>
            </form>

            <p className="mt-6 text-sm text-gray">
              Pas encore de compte ?{" "}
              <Link
                to="/register"
                className="font-semibold text-secondary transition hover:text-primary"
              >
                Créer un compte
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
