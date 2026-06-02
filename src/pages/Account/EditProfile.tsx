import React, {useEffect, useRef, useState} from "react";
import {useNavigate} from "react-router-dom";
import {API_BASE_URL} from "../../config";
import BackButton from "../../components/BackButton.tsx";
import {useAuth} from "../../hooks/useAuth.ts";

const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
];

const EditProfile: React.FC = () => {
  const { user, token, fetchCurrentUser } = useAuth();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [username, setUsername] = useState(user?.username || "");
  const [profilePicturePreview, setProfilePicturePreview] = useState(user?.profilePicture || "");
  const [profilePictureFile, setProfilePictureFile] = useState<File | null>(null);
  const [generationPrompt, setGenerationPrompt] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
        setError("Format d'image non supporte. Utilise JPG, PNG, WEBP ou GIF.");
        setProfilePictureFile(null);
        return;
      }

      if (file.size > 2 * 1024 * 1024) {
        setError("L'image est trop lourde (max 2Mo)");
        setProfilePictureFile(null);
        return;
      }

      setError(null);
      setSuccess(null);
      setProfilePictureFile(file);
      setProfilePicturePreview(URL.createObjectURL(file));
    }
  };

  const handleGenerateProfilePicture = async () => {
    const trimmedPrompt = generationPrompt.trim();
    if (!trimmedPrompt || !token) {
      setError("Ajoute un prompt pour generer une photo de profil.");
      return;
    }

    setIsGenerating(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch(`${API_BASE_URL}/generate/profile-picture`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt: trimmedPrompt }),
      });

      if (!response.ok) {
        const responseText = await response.text();
        setError(
          responseText
            ? `Erreur ${response.status}: ${responseText}`
            : `Erreur ${response.status}: generation refusee par le serveur.`
        );
        return;
      }

      setProfilePictureFile(null);
      await fetchCurrentUser(token);
      setSuccess("Photo de profil generee avec succes.");
    } catch {
      setError("Impossible de contacter le serveur de generation.");
    } finally {
      setIsGenerating(false);
    }
  };

  useEffect(() => {
    return () => {
      if (profilePictureFile && profilePicturePreview.startsWith("blob:")) {
        URL.revokeObjectURL(profilePicturePreview);
      }
    };
  }, [profilePictureFile, profilePicturePreview]);

  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setSuccess(null);

    try {
      const formData = new FormData();
      formData.append("username", username);
      if (profilePictureFile) {
        formData.append("profilePicture", profilePictureFile);
      }

      const endpoint = profilePictureFile ? `${API_BASE_URL}/users/profile` : `${API_BASE_URL}/users`;
      const method = profilePictureFile ? "POST" : "PATCH";

      const response = await fetch(endpoint, {
        method,
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (response.status === 204) {
        if (token) await fetchCurrentUser(token);
        setSuccess("Photo de profil mise a jour.");
        navigate("/me");
      } else {
        const responseText = await response.text();
        setError(
          responseText
            ? `Erreur ${response.status}: ${responseText}`
            : `Erreur ${response.status}: la requete a ete refusee par le serveur.`
        );
      }
    } catch {
      setError("Impossible de contacter le serveur.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
      <div className="py-12 px-6 min-h-screen bg-light/10">
        <div className="max-w-xl mx-auto">
          <BackButton></BackButton>

          <div className="bg-white rounded-[40px] shadow-shadow p-10 border border-light/20">
            <header className="mb-10 text-center">
              <h1 className="text-3xl font-bold text-primary">Modifier mon profil</h1>
            </header>

            {error && (
                <div className="bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-2xl mb-8 text-sm text-center">
                  {error}
                </div>
            )}

            {success && (
                <div className="bg-emerald-50 border border-emerald-100 text-emerald-700 px-4 py-3 rounded-2xl mb-8 text-sm text-center">
                  {success}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="flex flex-col items-center gap-4">
                <div
                    onClick={(e) => {
                      e.stopPropagation();
                      fileInputRef.current?.click();
                    }}
                    className="relative group w-32 h-32 rounded-3xl bg-secondary border-4 border-white shadow-xl flex items-center justify-center text-white text-4xl font-bold overflow-hidden cursor-pointer hover:scale-105 transition-transform"
                >
                  {profilePicturePreview ? (
                      <img src={profilePicturePreview} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                      username.charAt(0).toUpperCase()
                  )}
                  <div className="pointer-events-none absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                    <span className="text-xs text-white">Changer</span>
                  </div>
                </div>
                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept="image/jpeg,image/png,image/webp,image/gif"
                    className="hidden"
                />
                <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">Cliquez sur l'image pour importer</p>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-secondary uppercase tracking-[0.2em] ml-1">
                  Nom d'utilisateur
                </label>
                <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full bg-light/5 border border-light/30 rounded-2xl px-6 py-4 text-primary focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all"
                    placeholder="Ex: robertduchmol"
                    required
                />
              </div>

              <div className="space-y-3 rounded-2xl border border-light/30 bg-light/5 p-5">
                <div className="space-y-2">
                  <label htmlFor="generationPrompt" className="text-xs font-bold text-secondary uppercase tracking-[0.2em] ml-1">
                    Generer une photo IA
                  </label>
                  <textarea
                    id="generationPrompt"
                    value={generationPrompt}
                    onChange={(e) => setGenerationPrompt(e.target.value)}
                    className="w-full rounded-2xl border border-light/30 bg-white px-4 py-3 text-primary focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all"
                    placeholder="Ex: portrait fantasy sous-marin, lumiere bleue, style realiste"
                    rows={3}
                  />
                  <p className="text-xs text-gray-500">
                    Le prompt genere et applique directement une nouvelle photo de profil.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleGenerateProfilePicture}
                  disabled={isGenerating || isSubmitting}
                  className="w-full rounded-2xl border border-primary/15 bg-white px-4 py-3 font-bold text-primary transition-all hover:bg-primary hover:text-white disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {isGenerating ? "Generation en cours..." : "Generer une photo de profil"}
                </button>
              </div>

              <div className="pt-6 space-y-4">
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-primary hover:bg-secondary text-white font-bold py-4 rounded-2xl transition-all shadow-lg disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {isSubmitting ? "Mise a jour..." : "Enregistrer les modifications"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
  );
};

export default EditProfile;
