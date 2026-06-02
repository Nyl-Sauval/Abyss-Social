import React, {useState} from "react";
import {Link, useNavigate} from "react-router-dom";
import {useMutation} from "../hooks/useMutation";
import {useAuth} from "../hooks/useAuth.ts";
import type {RegisterQuery, RegisterResponse} from "../types/Register.ts";
import { Info } from "lucide-react";

export default function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { mutate, loading, error } = useMutation<RegisterQuery, RegisterResponse>("/auth/register", {
    method: "POST",
  });
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault();
    try {
      const response = await mutate({ username, email, password });
      if (response?.token) {
        await login(response.token);
        navigate("/");
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="relative overflow-hidden bg-light px-4 py-12 sm:px-6 lg:px-8 min-h-[calc(100vh-10rem)] flex items-center justify-center">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-28 right-[-4rem] h-80 w-80 rounded-full bg-secondary/15 blur-3xl" />
        <div className="absolute bottom-[-5rem] left-[-3rem] h-72 w-72 rounded-full bg-accent/20 blur-3xl" />
      </div>

      <div className="relative w-full max-w-5xl overflow-hidden rounded-[2rem] bg-white shadow-[0_25px_80px_rgba(7,50,73,0.18)] ring-1 ring-primary/10 grid lg:grid-cols-[0.95fr_1.05fr]">
        <div className="hidden lg:flex flex-col justify-between bg-primary text-white p-12 xl:p-14">
          <div>
            <span className="inline-flex items-center rounded-full bg-white/10 px-4 py-1 text-sm font-semibold tracking-wide text-light">
              Abyss Social
            </span>
            <h1 className="mt-8 text-4xl xl:text-5xl font-bold leading-tight">
              Crée ton espace sous la surface.
            </h1>
            <p className="mt-5 max-w-md text-white/75 text-base leading-7">
              Rejoins l’application pour personnaliser ton profil, suivre tes
              interactions et explorer l’univers Abyss.
            </p>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
            <p className="text-sm uppercase tracking-[0.22em] text-white/60">
              Nouveau compte
            </p>
            <p className="mt-3 text-sm text-white/80 leading-6">
              L’inscription prend quelques secondes et te donne accès à ton
              profil immédiatement après validation.
            </p>
          </div>
        </div>

        <div className="p-8 sm:p-10 lg:p-12 xl:p-14">
          <div className="max-w-md mx-auto lg:mx-0">
            <div className="mb-8 lg:mb-10">
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-secondary">
                Inscription
              </p>
              <h2 className="mt-3 text-3xl font-bold text-primary">
                Crée ton compte
              </h2>
              <p className="mt-3 text-gray leading-7">
                Remplis les champs ci-dessous pour commencer à utiliser Abyss.
              </p>
            </div>

            <div className="mb-8 rounded-2xl border border-secondary/20 bg-secondary/5 p-4 shadow-sm">
              <div className="flex gap-3">
                <Info className="text-secondary shrink-0 mt-0.5" size={20} />
                <div className="text-sm text-primary/80 leading-relaxed">
                  <span className="font-bold text-primary block mb-0.5">Note d'hébergement</span>
                  Ce projet est hébergé sur un service gratuit. Lors de votre inscription, <strong>un délai de chargement allant jusqu'à 1 minute</strong> peut se produire le temps que le serveur "se réveille". Merci de votre patience !
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="mb-2 block text-sm font-semibold text-primary">
                  Nom d’utilisateur
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  placeholder="Ton pseudo"
                  className="w-full rounded-2xl border border-primary/10 bg-light/70 px-4 py-3.5 text-primary placeholder:text-gray outline-none transition focus:border-secondary focus:ring-4 focus:ring-secondary/10"
                />
              </div>

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

              {error && (
                <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {error.message}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-2xl bg-accent px-5 py-3.5 font-bold text-white shadow-lg shadow-accent/25 transition hover:-translate-y-0.5 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:translate-y-0"
              >
                {loading ? "Création du compte..." : "S'inscrire"}
              </button>
            </form>

            <p className="mt-6 text-sm text-gray">
              Tu as déjà un compte ?{" "}
              <Link
                to="/login"
                className="font-semibold text-secondary transition hover:text-primary"
              >
                Se connecter
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
