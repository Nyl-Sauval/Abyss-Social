import React from "react";
import {useAuth} from "../../hooks/useAuth.ts";

const DeleteAccountButton: React.FC = () => {
    const { deleteAccount } = useAuth();

    const handleDelete = async () => {
        if (window.confirm("Êtes-vous certain de vouloir supprimer votre compte ? Cette action est irréversible.")) {
            try {
                await deleteAccount(); // Tout est géré dans le AuthContext
            } catch (err) {
                alert("Une erreur est survenue lors de la suppression:");
                console.error("Erreur lors de la suppression du compte", err);
            }
        }
    };

    return (
        <button
            onClick={handleDelete}
            className="w-full bg-red-50 border-2 border-accent text-accent hover:bg-accent hover:text-white font-bold py-3 rounded-xl transition-all duration-300 shadow-sm"
        >
            Supprimer mon compte
        </button>
    );
};

export default DeleteAccountButton;