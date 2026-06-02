import {Loader2} from "lucide-react";
import {useSearchParams} from "react-router-dom";
import BackButton from "../../components/BackButton";
import {useFetch} from "../../hooks/useFetch";
import type {Post} from "../../types/Post";
import PostList from "../../components/post/PostList.tsx";

const PostSearchResults = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("query") ?? "";
  const searchUrl = query ? `/posts/search?query=${encodeURIComponent(query)}` : "";
  const { data, loading, error } = useFetch<Post[]>(searchUrl);

  return (
    <div className="mx-auto max-w-5xl px-6 py-12">
      <BackButton />

      <div className="glass mt-8 rounded-3xl p-8">
        <h1 className="text-2xl font-bold text-abyss-blue">
          Resultats pour "{query || "recherche vide"}"
        </h1>

        {!query ? (
          <p className="mt-4 text-abyss-blue/60">
            Saisissez un contenu de post dans la barre de recherche.
          </p>
        ) : null}

        {query && loading ? (
          <div className="flex items-center gap-3 py-8 text-abyss-blue/70">
            <Loader2 className="animate-spin text-ocean-teal" size={20} />
            Chargement des posts...
          </div>
        ) : null}

        {query && error ? (
          <p className="mt-4 text-rose-500">La recherche a echoue. Reessayez.</p>
        ) : null}

        {query && !loading && !error && data ? (
          <div className="mt-6">
            <PostList
              posts={data}
              emptyMessage="Aucun post trouve pour cette recherche."
            />
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default PostSearchResults;
