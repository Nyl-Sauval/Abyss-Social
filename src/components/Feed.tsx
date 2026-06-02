import PostCard from "./post/PostCard";
import {Loader2, Waves, Wind} from "lucide-react";
import {AnimatePresence} from "framer-motion";
import {useFetch} from "../hooks/useFetch";
import type {Post} from "../types/Post.ts";
import {BubbleBackground} from "./layout/Bubbles.tsx";
import {useState} from "react";
import {getFilteredPosts} from "../services/postService.ts";
import {useAuth} from "../hooks/useAuth.ts";

export default function Feed() {
  const [isAnimEnabled, setIsAnimEnabled] = useState(false);
  const { data, loading } = useFetch<Post[]>("/posts/all");
  const {user} = useAuth();

  const posts: Post[] = data || [];
  const filteredPosts: Post[] = getFilteredPosts(posts, user);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <div className="relative">
          <Loader2 className="text-ocean-teal animate-spin" size={48} />
          <div className="absolute inset-0 bg-ocean-teal/20 blur-xl rounded-full" />
        </div>
        <p className="text-ocean-sand/60 font-medium italic animate-pulse">Exploration des profondeurs...</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto px-4 pb-20 relative z-0">
      <BubbleBackground enabled={isAnimEnabled} />
      <div className="flex items-center justify-between mb-8 px-2">
        <h2 className="text-xl font-bold text-abyss-blue flex items-center gap-2">
          Fil d'actualité Abyss
          <span className="w-2 h-2 bg-ocean-teal rounded-full animate-pulse" />
        </h2>
          {/* Animation toggle button */}
          <button
              onClick={() => setIsAnimEnabled(!isAnimEnabled)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium transition-all shadow-sm border
            ${isAnimEnabled
                  ? "bg-ocean-teal/10 border-ocean-teal/20 text-ocean-teal hover:bg-ocean-teal/20"
                  : "bg-abyss-blue/5 border-abyss-blue/10 text-abyss-blue/40 hover:bg-abyss-blue/10"
              }`}
              title={isAnimEnabled ? "Désactiver les animations" : "Activer les animations"}
          >
              {isAnimEnabled ? (
                  <>
                      <Waves size={14} className="animate-pulse" />
                      <span>Ambiance Active</span>
                  </>
              ) : (
                  <>
                      <Wind size={14} />
                      <span>Abysses Calmes</span>
                  </>
              )}
          </button>
      </div>

      <AnimatePresence>
        <div className="flex flex-col gap-6">
          {filteredPosts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      </AnimatePresence>

      {/* If there isn't any posts we show a message to the user */}
      {filteredPosts.length === 0 && !loading && (
        <div className="text-center py-20 px-6 glass rounded-3xl border-dashed border-abyss-blue/10 max-w-2xl mx-auto">
          <h3 className="text-2xl font-bold text-abyss-blue mb-4">Bienvenue dans les Abysses</h3>
          <p className="text-abyss-blue/70 text-lg leading-relaxed mb-6">
            Bienvenue sur Abyss Social. C'est encore un peu vide ici. Il faut commencer par suivre des gens ou des pages ou des groupes afin de voir l'actualité des gens qu'on suit.
          </p>
          <p className="text-abyss-blue/50 text-sm">
            N'hésitez pas à partager si vous voulez partager des choses comme des plongées ou autres !
          </p>
        </div>
      )}
    </div>
  );
}
