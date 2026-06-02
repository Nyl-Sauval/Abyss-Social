import React from "react";
import {useNavigate} from "react-router-dom";
import Feed from "../components/Feed.tsx";
import {useAuth} from "../hooks/useAuth.ts";

const Home: React.FC = () => {
    const navigate = useNavigate();
    const {user, isAuthenticated} = useAuth();

    if (!isAuthenticated || !user) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-light p-6">
                <h1 className="text-5xl font-bold text-primary mb-6">
                    Bienvenue sur <span className="text-accent">Abyss</span>
                </h1>
                <p className="text-gray text-lg mb-10">
                    Connectez-vous ou inscrivez-vous pour continuer.
                </p>

                <div className="flex gap-4">
                    <button
                        onClick={() => navigate("/login")}
                        className="bg-primary hover:bg-light text-white font-bold py-3 px-8 rounded-lg transition duration-300 shadow-md"
                    >
                        Se connecter
                    </button>
                    <button
                        onClick={() => navigate("/register")}
                        className="bg-accent hover:bg-opacity-90 text-white font-bold py-3 px-8 rounded-lg transition duration-300 shadow-md"
                    >
                        S'inscrire
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div>
            <Feed/>
        </div>
    );
};

export default Home;