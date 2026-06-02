import PostCard from "./PostCard.tsx";
import type {Post} from "../../types/Post.ts";


interface PostListProps {
  posts: Post[];
  emptyMessage?: string;
}

export default function PostList({
  posts,
  emptyMessage = "Aucune plongée trouvée dans cette zone.",
}: PostListProps) {

  return (
    <div className="w-full max-w-4xl mx-auto px-4 pb-20">
      <div className="flex flex-col gap-6">
        {posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>

      {posts.length === 0 && (
        <div className="text-center py-20 glass rounded-3xl border-dashed border-white/10">
          <p className="text-primary">{emptyMessage}</p>
        </div>
      )}
    </div>
  );
}
