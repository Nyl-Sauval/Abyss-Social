import {useState} from "react";
import {motion} from "framer-motion";
import {Heart, Loader2, MessageCircle, Send, ThumbsDown} from "lucide-react";
import {Link} from "react-router-dom";
import CommentList from "../CommentList.tsx";
import {useFetch} from "../../hooks/useFetch.ts";
import type {Post} from "../../types/Post.ts";
import type {Comment} from "../../types/Comment.ts";
import DeletePostButton from "./DeletePostButton.tsx";
import {useMutation} from "../../hooks/useMutation.ts";
import {toggleReaction} from "../../services/postService.ts";
import type {User} from "../../types/User.ts";
import UserAvatar from "../user/UserAvatar.tsx";
import {useAuth} from "../../hooks/useAuth.ts";

type PostCardProps = {
  readonly post: Post;
  readonly isDetail?: boolean;
  readonly comments?: Comment[];
};

export default function PostCard({ post, isDetail = false, comments }: PostCardProps) {
  const { token, refreshUser, user } = useAuth();
  const [showComments, setShowComments] = useState(false);
  const [likes, setLikes] = useState(post.likes.length || 0);
  const [dislikes, setDislikes] = useState(post.dislikes.length || 0);
  const [userAction, setUserAction] = useState<null | "likes" | "dislikes">(null);
  const [interactionLoading, setInteractionLoading] = useState(false);

  const shouldNavigate: boolean = !isDetail;
  const commentsUrl: string = `/posts/${post.id}/comments`;


  //Retrieve the author (User) of the post
  const { data: userData } = useFetch<User>(`/users/${post.userId}`);
  const { data, refetch, loading: commentsLoading } = useFetch<Comment[] | { content?: Comment[] }>(commentsUrl);
  const { mutate: addComment } = useMutation<{ text: string; postId: string }, Comment>(commentsUrl);
  const [newComment, setNewComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Local comments state to store newly created comments before the refetch
  const [localComments, setLocalComments] = useState<Comment[]>([]);

  const handleCommentSubmit = async (e?: React.SyntheticEvent) => {
    if (e) {
      // Prevents the Link component from triggering a page navigation (Post detail for example) when clicking the submit button
      e.preventDefault();
      e.stopPropagation();
    }
    if (!newComment.trim() || isSubmitting) return;

    setIsSubmitting(true);

    try {
      const addedComment = await addComment({ text: newComment.trim(), postId: post.id });
      if (addedComment) {
        // Update local UI state immediately
        setLocalComments((prev) => [addedComment, ...prev]);
      }
      setNewComment("");
      refetch();
    } catch (error) {
      console.error("Failed to add comment:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  /**
   * COMMENT NORMALIZATION & DEDUPLICATION
   * We merge 3 potential sources of comments:
   * Fetched data and locally added comments.
   * A Map is used here to ensure uniqueness by ID in case the refetch and local state overlap.
   */
  const baseComments: Comment[] = (comments ?? (Array.isArray(data) ? data : (data?.content || [])));
  const allComments = [...localComments, ...baseComments];

  const uniqueComments: Comment[] = Array.from(new Map(allComments.map(c => [c.id, c])).values());

  const commentsArray: Comment[] = uniqueComments
    .slice()
    .sort((a, b) => {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

  const commentCount: number = commentsArray.length;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleInteraction = async (action: "likes" | "dislikes") => {
    if (!token || !user) return alert("Vous devez être connecté.");
    if (interactionLoading) return;

    setInteractionLoading(true);

    const previousAction = userAction;
    const previousLikes = likes;
    const previousDislikes = dislikes;

    // Optimistic Update
    if (action === "likes") {
      if (userAction === "likes") {
        setLikes(prev => Math.max(0, prev - 1));
        setUserAction(null);
      } else {
        setLikes(prev => prev + 1);
        if (userAction === "dislikes") setDislikes(prev => Math.max(0, prev - 1));
        setUserAction("likes");
      }
    } else {
      if (userAction === "dislikes") {
        setDislikes(prev => Math.max(0, prev - 1));
        setUserAction(null);
      } else {
        setDislikes(prev => prev + 1);
        if (userAction === "likes") setLikes(prev => Math.max(0, prev - 1));
        setUserAction("dislikes");
      }
    }

    try {
      const method = previousAction === action ? "DELETE" : "POST" as const;
      const ok = await toggleReaction(post.id, user.id, action, token, method);

      if (ok) {
        await refreshUser();
      } else {
        // Rollback on failure
        setLikes(previousLikes);
        setDislikes(previousDislikes);
        setUserAction(previousAction);
      }
    } catch (err) {
      console.error("Erreur interaction:", err);
      // Rollback on error
      setLikes(previousLikes);
      setDislikes(previousDislikes);
      setUserAction(previousAction);
    } finally {
      setInteractionLoading(false);
    }
  };

  /**
  * Hide the content if the author is banned, unless the viewer is an Administrator.
  */
  if (userData?.role === "BANNED" && user?.role !== "ADMIN") {
    return (
      <div className="text-center py-20 glass rounded-3xl border-dashed border-white/10">
        <p className="text-primary">Aucune plongée trouvée dans cette zone.</p>
        <p className="mt-4 text-sm text-abyss-blue/60">Des posts ont été masqués parce que leur auteurs ont été bannis</p>
      </div>
    );
  }

  return (
      // The entire card is wrapped in a Link. We conditionally prevent default behavior
      // if the user is already on the detail page to avoid redundant navigation.
    <Link to={`/post/${post.id}`} className="block" onClick={(e) => { if (!shouldNavigate) e.preventDefault(); }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass glass-hover rounded-2xl p-6 mb-4 w-full max-w-2xl mx-auto overflow-hidden relative group bg-white shadow-sm"
      >

        {post.userId === user?.id && (
          <div className="absolute top-4 right-4 z-10">
            <DeletePostButton
              postId={post.id}
              onDeleteSuccess={() => {
                if (isDetail) {
                  window.location.href = "/";
                } else {
                  window.location.reload();
                }
              }}
            />
          </div>
        )}

        <div className="absolute -right-4 -top-4 w-24 h-24 bg-ocean-teal/10 rounded-full blur-3xl group-hover:bg-ocean-teal/20 transition-all duration-700" />

        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <UserAvatar
              username={userData?.username}
              profilePicture={userData?.profilePicture}
              className="h-12 w-12 rounded-full bg-primary"
              fallbackClassName="bg-primary text-lg font-bold text-white"
            />
            <div>
              {isDetail ? <Link to={`/users/${post.userId}`} className="shrink-0">
                <h3 className="font-semibold text-primary">
                  {userData?.username ?? "Utilisateur"}
                </h3>
              </Link>
                :
                <h3 className="font-semibold text-abyss-blue group-hover:text-ocean-teal transition-colors">{userData?.username ?? "Plongeur Anonyme"}</h3>
              }

              <p className="text-sm text-abyss-blue/50">{formatDate(post.createdAt)}</p>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <p className="text-primary/90 leading-relaxed text-lg">{post.content}</p>
          {post.image && (
            <div className="mt-4 rounded-xl overflow-hidden border border-primary/10">
              <img src={post.image} alt="Post content" className="w-full h-auto object-cover max-h-96" />
            </div>
          )}
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-primary/10">
          <div className="flex items-center gap-6">
            {/* LIKE */}
            <button disabled={interactionLoading} onClick={(e) => { e.preventDefault(); handleInteraction("likes"); }} className="flex items-center gap-2 text-gray hover:text-secondary transition-colors">
              <Heart size={18} className={userAction === "likes" ? "fill-secondary text-secondary" : ""} />
              <span className="text-sm font-medium">{likes}</span>
            </button>

            {/* DISLIKE */}
            <button disabled={interactionLoading} onClick={(e) => { e.preventDefault(); handleInteraction("dislikes"); }} className="flex items-center gap-2 text-gray hover:text-accent transition-colors">
              <ThumbsDown size={18} className={userAction === "dislikes" ? "fill-accent text-accent" : ""} />
              <span className="text-sm font-medium">{dislikes}</span>
            </button>

            {/* COMMENTAIRES */}
            <button
              onClick={(e) => { e.preventDefault(); setShowComments(!showComments) }}
              className="flex items-center gap-2 text-abyss-blue/60 hover:text-ocean-teal transition-colors"
            >
              <MessageCircle size={18} />
              {commentsLoading ? (
                <Loader2 size={14} className="animate-spin text-abyss-blue/40" />
              ) : (
                <span className="text-sm font-medium">{commentCount}</span>
              )}
            </button>
          </div>
        </div>

        {showComments && (
          <div onClick={(e) => {
            // prevent clicks inside the comment section from navigating to post details
            e.preventDefault();
            e.stopPropagation();
          }}>
            <div className="mt-4 flex gap-2">
              <input
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleCommentSubmit(e)}
                placeholder="Écrire un commentaire..."
                className="flex-1 bg-white/50 border border-abyss-blue/10 rounded-full px-4 py-2 text-sm text-abyss-blue placeholder-abyss-blue/40 focus:outline-none focus:border-ocean-teal/50"
              />
              <button
                type="button"
                onClick={handleCommentSubmit}
                disabled={isSubmitting || !newComment.trim()}
                className="p-2 rounded-full bg-ocean-teal text-white hover:bg-ocean-teal/80 disabled:opacity-50 transition-colors flex items-center justify-center shrink-0"
              >
                {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
              </button>
            </div>
            <CommentList
              comments={commentsArray}
              onRefresh={() => {
                setLocalComments([]);
                refetch();
              }}
            />
          </div>
        )}
      </motion.div>
    </Link>

  );
}
