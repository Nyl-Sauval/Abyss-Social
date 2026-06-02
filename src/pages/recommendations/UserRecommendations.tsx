import {useFetch} from "../../hooks/useFetch";
import {AlertCircle, Layers, Loader2, UserPlus, Users} from "lucide-react";
import {Link} from "react-router-dom";
import UserAvatar from "../../components/user/UserAvatar.tsx";
import type {UserRecommended} from "../../types/Recommanded.ts";
import {useAuth} from "../../hooks/useAuth.ts";

const UserRecommendations = () => {
    const {user} = useAuth()

    const { data: recommendations, loading, error } = useFetch<UserRecommended[]>(
        "/recommendations/users"
    );

    // 1. État de chargement
    if (loading) return (
        <div className="glass rounded-[32px] p-8 flex flex-col items-center gap-3">
            <Loader2 className="animate-spin text-ocean-teal" size={32} />
            <p className="text-xs text-abyss-blue/40 italic">Analyse des courants...</p>
        </div>
    );

    // 2. Gestion de l'erreur (pour voir pourquoi ça ne s'affiche pas)
    if (error) return (
        <div className="glass rounded-[32px] p-6 border border-red-200 bg-red-50/50">
            <div className="flex items-center gap-2 text-red-600 mb-2">
                <AlertCircle size={18} />
                <h3 className="font-bold text-sm">Accès restreint</h3>
            </div>
        </div>
    );

    // 3. Pas de données
    const validRecommendations: UserRecommended[] = recommendations?.filter(rec => rec.role !== "BANNED" && !user?.usersBanned?.some((userBanned) => userBanned.id === rec.id)) || [];

    if (validRecommendations.length === 0) return (
        <div className="glass rounded-[32px] p-6 text-center">
            <p className="text-sm text-abyss-blue/40">Aucun utilisateur à suggérer pour le moment.</p>
        </div>
    );

    // 4. Rendu normal
    return (
        <div className="glass rounded-[32px] p-6 border border-white/10 shadow-xl bg-white/5 backdrop-blur-md">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-abyss-blue font-bold text-lg flex items-center gap-2">
                    Explorateurs suggérés
                    <span className="flex h-2 w-2 rounded-full bg-ocean-teal animate-pulse" />
                </h3>
            </div>

            <div className="space-y-6">
                {validRecommendations.slice(0, 4).map((rec) => (
                    <div key={rec.id} className="group relative">
                        <div className="flex items-start justify-between">
                            <Link to={`/users/${rec.id}`} className="flex items-center gap-3">
                                <UserAvatar
                                    username={rec.username}
                                    profilePicture={rec.profilePicture}
                                    className="h-12 w-12 rounded-2xl border border-ocean-teal/30 bg-light shadow-inner transition-transform group-hover:scale-105"
                                    fallbackClassName="text-xl font-bold text-ocean-teal"
                                />

                                <div>
                                    <p className="text-sm font-bold text-abyss-blue transition-colors">
                                        {/* Bon dans l'idée c'est déjà le username mais le back renvoie l'email et j'ai pas envie des les embêter encore plus*/}
                                        {rec.username.split("@")[0]}
                                    </p>
                                </div>
                            </Link>

                            <button className="p-2 bg-ocean-teal/10 text-ocean-teal hover:bg-ocean-teal hover:text-white rounded-xl transition-all active:scale-90">
                                <UserPlus size={18} />
                            </button>
                        </div>

                        <div className="flex gap-3 mt-3 ml-1">
                            {rec.shared_friends > 0 && (
                                <div className="flex items-center gap-1 text-[10px] text-abyss-blue/50">
                                    <Users size={12} className="text-ocean-teal" />
                                    {rec.shared_friends}
                                </div>
                            )}
                            {rec.shared_groups > 0 && (
                                <div className="flex items-center gap-1 text-[10px] text-abyss-blue/50">
                                    <Layers size={12} className="text-ocean-teal" />
                                    {rec.shared_groups}
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default UserRecommendations;
