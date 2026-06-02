import React, {useState} from "react";
import {Loader2, Trash2} from "lucide-react";
import {deletePost} from "../../services/postService.ts";
import {useAuth} from "../../hooks/useAuth.ts";

interface DeletePostButtonProps {
    postId: string;
    onDeleteSuccess: (id: string) => void;
}

const DeletePostButton: React.FC<DeletePostButtonProps> = ({ postId, onDeleteSuccess }) => {
    const { token } = useAuth();
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (!window.confirm("Voulez-vous vraiment supprimer cette plongée ?")) return;

        setIsDeleting(true);
        try {
            const ok = await deletePost(postId, token);
            if (ok) {
                onDeleteSuccess(postId);
            } else {
                alert("Erreur lors de la suppression");
            }
        } catch (err) {
            console.error(err);
            alert("Erreur lors de la suppression");
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="p-2 text-gray hover:text-white hover:bg-accent rounded-xl transition-all disabled:opacity-50"
            title="Supprimer le post"
        >
            {isDeleting ? (
                <Loader2 size={18} className="animate-spin" />
            ) : (
                <Trash2 size={18} />
            )}
        </button>
    );
};

export default DeletePostButton;