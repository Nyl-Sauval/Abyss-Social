import React from "react";
import { useNavigate } from "react-router-dom";

const NotFound: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-white text-center p-6">
            <h1 className="text-9xl font-extrabold text-secondary mb-4">404</h1>
            <h2 className="text-3xl font-semibold text-primary mb-2">Page introuvable</h2>
            <p className="text-gray mb-8">
                Il semble que vous vous soyez aventuré trop profondément dans l'abysse.
            </p>

            <button
                onClick={() => navigate("/")}
                className="border-2 border-primary text-primary hover:bg-primary hover:text-white font-bold py-2 px-6 rounded-full transition duration-300"
            >
                Retour à l'accueil
            </button>
        </div>
    );
};

export default NotFound;