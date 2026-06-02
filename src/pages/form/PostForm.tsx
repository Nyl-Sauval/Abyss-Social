import {type ChangeEvent, type FormEvent, useEffect, useMemo, useState,} from "react";
import {DEFAULT_POST_FORM, type PostFormType,} from "../../types/forms/PostForm.ts";
import {useMutation} from "../../hooks/useMutation.ts";
import BackButton from "../../components/BackButton.tsx";
import {createPost} from "../../services/postService.ts";
import {useNavigate} from "react-router-dom";
import type {Post} from "../../types/Post.ts";
import {useAuth} from "../../hooks/useAuth.ts";

type MessageResponse = {
  message?: string;
};

export const PostForm = () => {
  const navigate = useNavigate();
  const { token } = useAuth();

  const [postForm, setPostForm] = useState<PostFormType>(DEFAULT_POST_FORM);
  const [generationPrompt, setGenerationPrompt] = useState("");
  const [generationError, setGenerationError] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const { mutate, error, loading } = useMutation<FormData, Post>("/posts", {
    method: "POST",
  });
  const { mutate: generatePostImage } = useMutation<{ prompt: string }, MessageResponse>("", {
    method: "POST",
  });
  const previewUrl: string = useMemo(() => {
    return postForm.image ? URL.createObjectURL(postForm.image) : "";
  }, [postForm.image]);

  const handleContentChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setPostForm({ ...postForm, content: e.target.value });
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file: File | null = e.target.files?.[0] || null;
    setPostForm({ ...postForm, image: file });
  };

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setGenerationError(null);
    const formData: FormData = createPost(postForm);
    try{
      const post: Post | null = await mutate(formData);

      if(post){
        navigate(`/post/${post.id}`)
      } else{
        navigate(`/`)
      }

    }catch(e){
        console.error("Failed to create post: ", e);
    }


  };

  const handleSubmitWithGeneration = async () => {
    const trimmedPrompt = generationPrompt.trim();
    if (!trimmedPrompt) {
      setGenerationError("Ajoute un prompt pour generer l'image du post.");
      return;
    }
    if (!token) {
      setGenerationError("Vous devez etre connecte pour generer une image.");
      return;
    }

    setGenerationError(null);
    setIsGenerating(true);

    try {
      const post = await mutate(createPost(postForm));

      if (!post) {
        setGenerationError("Le post a ete cree mais son identifiant est introuvable.");
        navigate("/");
        return;
      }

      await generatePostImage({ prompt: trimmedPrompt }, `/generate/post-image/${post.id}`);

      navigate(`/post/${post.id}`);
    } catch (e) {
      console.error("Failed to create post with generated image: ", e);
      setGenerationError(e instanceof Error ? e.message : "Impossible de creer le post avec image generee.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <section className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-4 py-10">
      <div className="absolute top-6 left-6 z-20">
        <BackButton />
      </div>

      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(44,134,172,0.16),transparent_55%),radial-gradient(circle_at_bottom,rgba(255,127,80,0.18),transparent_55%)]" />
      <div className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-secondary/15 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-28 -right-20 h-80 w-80 rounded-full bg-accent/20 blur-3xl" />
      <form
        onSubmit={handleSubmit}
        className="relative w-full max-w-2xl mt-15 space-y-6 rounded-3xl border border-primary/10 bg-white p-8 shadow-2xl shadow-shadow"
      >
        <div className="space-y-2 text-center">
          <p className="mx-auto w-fit rounded-full border border-secondary/30 bg-secondary/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-secondary">
            Post
          </p>
          <h1 className="text-3xl font-semibold tracking-tight text-primary md:text-4xl">
            Creer un post
          </h1>
          <p className="text-sm text-gray md:text-base">
            Ajoute un texte et une image pour partager ton contenu.
          </p>
        </div>

        <div className="h-px w-full bg-primary/10" />

        <div className="grid gap-5 md:grid-cols-2">
          <div className="space-y-2 md:col-span-2">
            <label
              htmlFor="content"
              className="text-sm font-semibold text-primary"
            >
              Contenu
            </label>
            <p className="text-xs text-gray">
              Un paragraphe complet et clair.
            </p>
            <textarea
              id="content"
              rows={5}
              value={postForm.content}
              onChange={handleContentChange}
              placeholder="Ecris ton message"
              className="w-full rounded-xl border border-primary/15 bg-white px-4 py-3 text-primary shadow-sm shadow-shadow outline-none transition placeholder:text-gray/70 focus:border-secondary focus:ring-4 focus:ring-secondary/20"
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <label
              htmlFor="image"
              className="text-sm font-semibold text-primary"
            >
              Image
            </label>
            <p className="text-xs text-gray">
              Formats conseilles: JPG, PNG. Ratio libre.
            </p>
            <input
              id="image"
              type="file"
              onChange={handleImageChange}
              accept="image/*"
              className="w-full rounded-xl border border-primary/15 bg-white px-4 py-3 text-primary shadow-sm shadow-shadow file:mr-3 file:rounded-lg file:border-0 file:bg-secondary file:px-4 file:py-2 file:font-semibold file:text-light hover:file:bg-primary"
            />
          </div>
        </div>

        {previewUrl && (
          <div className="overflow-hidden rounded-2xl border border-secondary/25 bg-white shadow-lg shadow-shadow">
            <div className="flex items-center justify-between border-b border-primary/10 bg-primary/5 px-4 py-3">
              <p className="text-sm font-semibold text-primary">
                Apercu de l'image
              </p>
              <span className="text-xs font-medium text-gray">Preview</span>
            </div>
            <div className="p-4">
              <img
                src={previewUrl}
                alt="Image selectionnee"
                className="max-h-112 w-full rounded-xl object-cover"
              />
            </div>
          </div>
        )}

        <div className="space-y-3 rounded-2xl border border-primary/15 bg-primary/5 p-5">
          <div className="space-y-2">
            <label
              htmlFor="generationPrompt"
              className="text-sm font-semibold text-primary"
            >
              Generer une image IA
            </label>
            <p className="text-xs text-gray">
              Cree le post puis genere automatiquement son image a partir du prompt.
            </p>
            <textarea
              id="generationPrompt"
              rows={3}
              value={generationPrompt}
              onChange={(e) => setGenerationPrompt(e.target.value)}
              placeholder="Ex: abysses bioluminescentes, architecture engloutie, rendu cinematographique"
              className="w-full rounded-xl border border-primary/15 bg-white px-4 py-3 text-primary shadow-sm shadow-shadow outline-none transition placeholder:text-gray/70 focus:border-secondary focus:ring-4 focus:ring-secondary/20"
            />
          </div>
          <button
            type="button"
            onClick={handleSubmitWithGeneration}
            disabled={loading || isGenerating}
            className="w-full rounded-xl bg-primary px-4 py-3 font-semibold text-light shadow-lg shadow-shadow transition hover:-translate-y-0.5 hover:bg-secondary focus:outline-none focus:ring-4 focus:ring-secondary/25 disabled:cursor-not-allowed disabled:bg-gray disabled:hover:translate-y-0"
          >
            {isGenerating ? "Creation et generation..." : "Creer puis generer l'image"}
          </button>
        </div>

        <button
          type="submit"
          disabled={loading || isGenerating}
          className="w-full rounded-xl bg-accent px-4 py-3 font-semibold text-light shadow-lg shadow-shadow transition hover:-translate-y-0.5 hover:bg-secondary focus:outline-none focus:ring-4 focus:ring-secondary/25 disabled:cursor-not-allowed disabled:bg-gray disabled:hover:translate-y-0"
        >
          {loading ? "Envoi..." : "Envoyer"}
        </button>

        <div className="space-y-3">
          {(loading || isGenerating) && (
            <p className="rounded-xl border border-secondary/20 bg-secondary/10 px-4 py-3 text-sm font-medium text-secondary">
              {isGenerating ? "Creation et generation en cours..." : "Envoi en cours..."}
            </p>
          )}
          {error && (
            <p className="rounded-xl border border-accent/30 bg-accent/10 px-4 py-3 text-sm font-medium text-accent">
              Erreur: {error.message}
            </p>
          )}
          {generationError && (
            <p className="rounded-xl border border-accent/30 bg-accent/10 px-4 py-3 text-sm font-medium text-accent">
              {generationError}
            </p>
          )}
        </div>
      </form>
    </section>
  );
};
