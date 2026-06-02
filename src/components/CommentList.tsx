import type {Comment} from "../types/Comment";
import {useFetch} from "../hooks/useFetch.ts";
import {useMutation} from "../hooks/useMutation.ts";
import {Loader2, Trash2} from "lucide-react";
import {Link} from "react-router-dom";
import UserAvatar from "./user/UserAvatar.tsx";
import {useAuth} from "../hooks/useAuth.ts";
import type {User} from "../types/User.ts";

interface CommentListProps {
  comments: Comment[];
  onRefresh?: () => void;
}

function CommentItem({ comment, onRefresh }: Readonly<{ comment: Comment, onRefresh?: () => void }>) {
  const { data: userData } = useFetch<User>(`/users/${comment.userId}`);
  const username = userData?.username ?? "Plongeur Anonyme";
  const { user } = useAuth();
  
  const { mutate: deleteComment, loading: isDeleting } = useMutation(`/posts/comments/${comment.id}`, { method: "DELETE" });

  const handleDelete = async () => {
    if (window.confirm("Voulez-vous vraiment supprimer ce commentaire ?")) {
      try {
        await deleteComment();
        if (onRefresh) onRefresh();
      } catch (err) {
        console.error("Erreur lors de la suppression du commentaire", err);
      }
    }
  };

  const isOwner = user?.id === comment.userId;
  const isAdmin = user?.role === "ADMIN";
  const canDelete = isOwner || isAdmin;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (userData?.role === "BANNED" && user?.role !== "ADMIN") {
    return (
        <div className="bg-white/60 rounded-xl p-4 border border-abyss-blue/5 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-ocean-deep to-ocean-teal flex items-center justify-center text-white font-bold text-xs shadow-sm">
              B
            </div>
            <div>
              <p className="text-sm font-medium text-abyss-blue">Profil introuvable</p>
              <p className="text-xs text-abyss-blue/50">{comment.createdAt ? formatDate(comment.createdAt) : ""}</p>
            </div>
          </div>
          <p className="text-sm text-abyss-blue/80 pl-10">Ce commentaire a été masqué</p>
        </div>
    );
  }

  return (
    <div className="bg-white/60 rounded-xl p-4 border border-abyss-blue/5 shadow-sm group">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2 mb-2">
          <Link to={`/users/${comment.userId}`} className="shrink-0">
            <div className="flex items-center gap-2">
              <UserAvatar
                username={username}
                profilePicture={userData?.profilePicture}
                className="h-8 w-8 rounded-full bg-gradient-to-br from-ocean-deep to-ocean-teal shadow-sm"
                fallbackClassName="bg-gradient-to-br from-ocean-deep to-ocean-teal text-xs font-bold text-white"
              />
              <div>
              <p className="text-sm font-medium text-abyss-blue">{username}</p>
              <p className="text-xs text-abyss-blue/50">{comment.createdAt ? formatDate(comment.createdAt) : ""}</p>
              </div>
            </div>
          </Link>
      </div>
        
        {canDelete && (
          <button 
            onClick={handleDelete}
            disabled={isDeleting}
            className="text-red-500/50 hover:text-red-600 transition-colors disabled:opacity-50"
            title="Supprimer le commentaire"
          >
            {isDeleting ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
          </button>
        )}
      </div>
      <p className="text-sm text-abyss-blue/80 pl-10">{comment.text}</p>
    </div>
  );
}

export default function CommentList({ comments, onRefresh }: CommentListProps) {
  if (!comments || comments.length === 0) {
    return (
      <div className="mt-4 pt-4 border-t border-abyss-blue/10 text-center">
        <p className="text-abyss-blue/40 text-sm">Aucun commentaire pour le moment.</p>
      </div>
    );
  }

  return (
    <div className="mt-4 pt-4 border-t border-abyss-blue/10 space-y-4">
      {comments.map((comment) => (
        <CommentItem key={comment.id} comment={comment} onRefresh={onRefresh} />
      ))}
    </div>
  );
}
