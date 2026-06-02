import {useParams} from "react-router-dom";
import {useFetch} from "../../hooks/useFetch.ts";
import type {Post} from "../../types/Post.ts";
import type {Comment} from "../../types/Comment.ts";
import PostCard from "../../components/post/PostCard.tsx";
import BackButton from "../../components/BackButton.tsx";

type PostDetailResponse = {
    post: Post;
    comments: Comment[];
};

export const PostDetail = () => {
    const params = useParams();
    const postId: string | undefined = params.id;

    const {data, error, loading} = useFetch<PostDetailResponse>(postId ? `/posts/${postId}` : "");

    if (!postId) {
        return (
            <section className="relative flex min-h-screen items-center justify-center overflow-hidden bg-light/35 px-4 py-10">
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(44,134,172,0.16),transparent_55%),radial-gradient(circle_at_bottom,rgba(255,127,80,0.18),transparent_55%)]"/>
                <div className="glass rounded-2xl p-6 w-full max-w-2xl mx-auto">
                    <p className="text-ocean-sand/80">Aucun identifiant de post fourni.</p>
                    <BackButton />
                </div>
            </section>
        );
    }

    return (
        <section className="relative flex min-h-screen items-start justify-center overflow-hidden bg-light/35 px-4 py-10">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(44,134,172,0.16),transparent_55%),radial-gradient(circle_at_bottom,rgba(255,127,80,0.18),transparent_55%)]"/>
            <div className="w-full max-w-3xl mx-auto">
                <div className="mb-4">
                    <BackButton />
                </div>

                {loading && (
                    <div className="glass rounded-2xl p-6 w-full max-w-2xl mx-auto">
                        <p className="text-ocean-sand/70">Chargement...</p>
                    </div>
                )}

                {error && (
                    <div className="glass rounded-2xl p-6 w-full max-w-2xl mx-auto">
                        <p className="text-accent">Erreur: {error.message}</p>
                    </div>
                )}

                {!loading && !error && !data?.post && (
                    <div className="glass rounded-2xl p-6 w-full max-w-2xl mx-auto">
                        <p className="text-ocean-sand/70">Post introuvable.</p>
                    </div>
                )}

                {!loading && !error && data?.post && (
                    <PostCard post={data.post} isDetail comments={data.comments ?? []} />
                )}
            </div>
        </section>
    );
};
