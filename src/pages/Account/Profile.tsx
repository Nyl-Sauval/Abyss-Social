import {Navigate, useNavigate} from "react-router-dom";
import BackButton from "../../components/BackButton.tsx";
import DeleteAccountButton from "./DeleteAccountButton.tsx";
import UserAvatar from "../../components/user/UserAvatar.tsx";
import {useAuth} from "../../hooks/useAuth.ts";

const Profile = () => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-primary"></div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="py-12 px-6">
      <BackButton />

      <div className="max-w-4xl mx-auto">
        <div className="bg-light rounded-3xl shadow-shadow overflow-hidden border border-light/20">
          <div className="bg-primary h-40 w-full relative">
              <div className="absolute -bottom-16 left-10 flex items-end gap-6">
              <UserAvatar
                username={user.username}
                profilePicture={user.profilePicture}
                className="h-32 w-32 rounded-2xl border-4 border-white bg-secondary shadow-lg"
                fallbackClassName="bg-secondary text-4xl font-bold text-white"
              />

              <div>
                <h1 className="text-3xl font-bold text-primary flex items-center gap-3">
                  {user.username}

                    {/* Affichage du rôle si présent */}
                    {user.role && (
                    <span className="bg-accent text-white text-[10px] px-3 py-1 rounded-full tracking-widest uppercase shadow-sm">
                        {user.role.replace('ROLE_', '')}
                    </span>
                    )}
                </h1>
                <p className="text-gray tracking-wide">Membre actif</p>
              </div>
            </div>

              <div className="w-full text-right">
                  <button
                      onClick={() => navigate(`/users/${user.id}`)}
                      className="m-5 mt-20 w-1/3 bg-light hover:bg-secondary text-black font-bold py-3 rounded-xl transition-all shadow-lg"
                  >
                      Voir mon profil public
                  </button>
              </div>
          </div>

          <div className="mt-20 p-10 grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="space-y-6">
              <section>
                <label className="text-xs font-bold text-secondary uppercase tracking-widest">
                  Email personnel
                </label>
                <p className="text-lg text-primary font-medium border-b border-light/30 pb-2">
                  {user.email || "Non renseigné"}
                </p>
              </section>

              <section>
                <label className="text-xs font-bold text-secondary uppercase tracking-widest">
                  Identifiant Unique
                </label>
                <p className="text-sm text-gray font-mono bg-light/10 p-2 rounded mt-1">
                  {user.id}
                </p>
              </section>

            </div>

                    <div className="space-y-6">
                        <section>
                            <label className="text-xs font-bold text-secondary uppercase tracking-widest">Statut du compte</label>
                            <div className="flex items-center gap-2 mt-1">
                                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                                <p className="text-primary font-medium">Connecté</p>
                            </div>
                        </section>

                        <section className="mt-10 pt-6 border-t border-gray flex gap-5 flex-col">
                            <button
                                onClick={() => navigate("/profile/edit")}
                                className="w-full bg-primary hover:bg-secondary text-white font-bold py-3 rounded-xl transition-all shadow-lg"
                            >
                                Modifier mon profil et ma photo
                            </button>

                            <div className="mt-2">
                                <DeleteAccountButton />
                            </div>
                        </section>
                    </div>
                </div>
            </div>

            {/* TODO : Récup le nombre de posts, pages et groupes créés par l'user */}
            {/*<div className="grid grid-cols-3 gap-6 mt-8">
                <div className="bg-white p-6 rounded-2xl border border-light/20 text-center shadow-sm">
                    <p className="text-2xl font-bold text-primary">--</p>
                    <p className="text-xs text-gray uppercase">Posts</p>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-light/20 text-center shadow-sm">
                    <p className="text-2xl font-bold text-primary">--</p>
                    <p className="text-xs text-gray uppercase">Pages</p>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-light/20 text-center shadow-sm">
                    <p className="text-2xl font-bold text-primary">--</p>
                    <p className="text-xs text-gray uppercase">Groupes</p>
                </div>
            </div>*/}
        </div>
    </div>
    );
};

export default Profile;
