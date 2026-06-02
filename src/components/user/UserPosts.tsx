import {useFetch} from "../../hooks/useFetch.ts";
import PostList from "../post/PostList.tsx";
import {Loader2, RefreshCw} from "lucide-react";
import type {Post} from "../../types/Post.ts";
import {FollowButton} from "./FollowButton.tsx";
import type {User} from "../../types/User.ts";

type UserProfileProps ={
    username?: string;
    user: User;
}

export const UserPosts = ({username, user}: UserProfileProps) => {

    const {
        data: posts,
        loading: loadingPost,
        error: errorPost,
        refetch,
    } = useFetch<Post[]>(user?.id ? `/users/${user.id}/posts` : "");

    // Sort posts by creation date (newest first)
    const sortedPosts = posts
        ? [...posts].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        : [];

    if (loadingPost) {
        return (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
                <div className="relative">
                    <Loader2 className="text-ocean-teal animate-spin" size={48} />
                    <div className="absolute inset-0 bg-ocean-teal/20 blur-xl rounded-full" />
                </div>
                <p className="text-ocean-sand/60 font-medium italic animate-pulse">
                    Exploration des profondeurs...
                </p>
            </div>
        );
    }

    if (errorPost) {
        return (
            <div className="w-full max-w-2xl mx-auto px-4 py-20">
                <div className="glass rounded-3xl p-8 border-ocean-coral/30 border text-center flex flex-col items-center gap-6">
                    <div className="w-20 h-20 bg-ocean-coral/10 rounded-full flex items-center justify-center text-ocean-coral shadow-lg shadow-ocean-coral/10">
                        Posts de l'utilisateur introuvables
                    </div>

                    <button
                        onClick={() => globalThis.location.reload()}
                        className="btn-ocean bg-ocean-coral hover:bg-ocean-coral/80 text-white gap-2 px-8 py-3"
                    >
                        <RefreshCw size={20} />
                        Tenter une remontée
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full max-w-4xl mx-auto px-4 pb-20">
            <div className="flex items-center justify-between mb-8 px-2">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    Plongées de l'explorateur {username}
                    <span className="w-2 h-2 bg-ocean-teal rounded-full animate-pulse" />
                </h2>

                <FollowButton userToFollowId={user.id} onChanged={refetch} />
            </div>

            <PostList
                posts={sortedPosts || []}
                emptyMessage="Ce plongeur n'a pas encore exploré les abysses."
            />
        </div>
    );
};