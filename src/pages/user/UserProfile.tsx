import {Navigate, useNavigate, useParams} from "react-router-dom";
import {useState} from "react";
import {Ban, Blocks, Loader2, ShieldCheck} from "lucide-react";
import {useFetch} from "../../hooks/useFetch.ts";
import {useMutation} from "../../hooks/useMutation.ts";
import {API_BASE_URL} from "../../config.ts";
import {UserPosts} from "../../components/user/UserPosts.tsx";
import type {Role, User} from "../../types/User.ts";
import UserAvatar from "../../components/user/UserAvatar.tsx";
import {useAuth} from "../../hooks/useAuth.ts";

const UserProfile = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user: currentUser, token, refreshUser } = useAuth();
  const [isChangingRole, setIsChangingRole] = useState(false);
  const { data: userData, loading: userLoading, error: userError, refetch } = useFetch<User>(id ? `/users/${id}` : "");
  const { mutate: banUser, loading: isBanning } = useMutation(id ? `/users/${id}/ban` : "", { method: "PATCH" });
  const { mutate: unbanUser, loading: isUnbanning } = useMutation(id ? `/users/${id}/unban` : "", { method: "PATCH" });
  const { mutate: block, loading: isBlocking } = useMutation(id ? `/users/${id}/block` : "", { method: "PATCH" });
  const { mutate: unblock, loading: isUnblocking } = useMutation(id ? `/users/${id}/unblock` : "", { method: "PATCH" });
  const canEditProfilePhoto: boolean = currentUser?.id === id;
  const isActionLoading: boolean = isBanning || isUnbanning || isBlocking || isUnblocking;
  const isBlocked: boolean = !!currentUser?.usersBanned?.some((userBanned) => userBanned.id === id);

  if (!id) {
    return <Navigate to="/" replace />;
  }

  const getRole = (role: Role) => {
      if(role === "BANNED"){
          return "Banni"
      }else if(role === "ADMIN"){
          return "Admin"
      }else if(role === "USER"){
          return "Utilisateur";
      }
  }

  const handleBan = async () => {
    try {
      await banUser();
      refetch(); // Reload the user profile to fetch the updated "BANNED" role
    } catch (err) {
      console.error("Failed to ban user", err);
    }
  };

    const handleUnban = async () => {
        try {
            await unbanUser();
            refetch(); // Reload the user profile to fetch the updated "USER" role
        } catch (err) {
            console.error("Failed to unban user", err);
        }
    };

    //unblock if the user is already block, unblock otherwise
    const handleBlock = async () => {
        try{
            if(isBlocked){
                await unblock();
            } else{
                await block()
            }
            await refreshUser();
        }catch(err){
            console.error("Failed to ban user", err);
        }

    }

    const handleRoleChange = async (targetRole?: Role) => {
        if (!userData) return;
        const newRole = targetRole || (userData.role === "ADMIN" ? "USER" : "ADMIN");

        if (!window.confirm(`Passer l'utilisateur en ${newRole} ?`)) return;

        setIsChangingRole(true);
        try {
            const response = await fetch(`${API_BASE_URL}/users/${id}/role?newRole=${newRole}`, {
                method: "PATCH",
                headers: { "Authorization": `Bearer ${token}` }
            });
            if (response.ok) refetch();
        } catch (err) {
            console.error(err);
        } finally {
            setIsChangingRole(false);
        }
    };

  const isAdmin = currentUser?.role === "ADMIN";
  const isBanned = userData?.role === "BANNED";
  const isSameUser = currentUser?.id === userData?.id;

  return (
    <div className="w-full max-w-4xl mx-auto px-4 pb-20">
        <div className="flex flex-col gap-6 p-4">
          {userLoading && (
            <div className="glass rounded-2xl p-6">
              <p className="text-abyss-blue/70">Chargement du profil...</p>
            </div>
          )}

          {userError && (
            <div className="glass rounded-2xl p-6 border border-accent/20">
              <p className="text-accent font-medium">Erreur: {userError.message}</p>
            </div>
          )}

          {!userLoading && !userError && userData && (
            <div className="glass rounded-3xl p-8 sm:p-10">
              <div className="flex flex-col gap-8 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-5">
                  <UserAvatar
                    username={userData.username}
                    profilePicture={userData.profilePicture}
                    className="h-20 w-20 rounded-full border border-abyss-blue/10 bg-abyss-blue/5 shadow-sm"
                    fallbackClassName="text-abyss-blue/60 font-semibold"
                  />

                  <div>
                    <h1 className="text-2xl font-semibold text-abyss-blue">{userData.username}</h1>
                    <div className="mt-1 flex flex-wrap items-center gap-3">
                      <p className="text-sm text-abyss-blue/60">Rôle: {getRole(userData.role)}</p>
                      <span className="h-1 w-1 rounded-full bg-abyss-blue/30" />
                      <p className="text-sm text-abyss-blue/60">Abonnements: {userData.friends?.length ?? 0}</p>
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl border border-abyss-blue/10 bg-white/30 px-5 py-4 flex flex-col gap-4">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-abyss-blue/60">Email</p>
                    <p className="text-sm font-medium text-abyss-blue">{userData.email ?? "Non renseigné"}</p>
                  </div>

                    {isAdmin && !isSameUser && (
                        <div className="flex flex-col gap-2 mt-2">
                            {/* Bouton Changer Rôle */}
                            {isAdmin && (
                                <button
                                    onClick={() => handleRoleChange("ADMIN")}
                                    disabled={isChangingRole || isBanned}
                                    className="flex items-center justify-center gap-2 px-4 py-2 bg-abyss-blue text-white text-sm font-medium rounded-xl hover:bg-ocean-deep transition-colors disabled:opacity-50"
                                >
                                    {isChangingRole ? <Loader2 size={16} className="animate-spin" /> : <ShieldCheck size={16} />}
                                   Promouvoir en Admin
                                </button>
                            )}
                            
                            {isBanned ? (
                                <button
                                    onClick={handleUnban}
                                    disabled={isActionLoading}
                                    className="flex items-center justify-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-xl disabled:opacity-50"
                                >
                                    {isActionLoading ? <Loader2 size={16} className="animate-spin" /> : <ShieldCheck size={16} />}
                                    Débannir
                                </button>
                            ) : (
                                <button
                                    onClick={handleBan}
                                    disabled={isBanning || isActionLoading}
                                    className="flex items-center justify-center gap-2 px-4 py-2 bg-accent hover:bg-red-700 text-white text-sm font-medium rounded-xl disabled:opacity-50"
                                >
                                    {isBanning ? <Loader2 size={16} className="animate-spin" /> : <Ban size={16} />}
                                    Bannir l'utilisateur
                                </button>
                            )}
                        </div>
                    )}
                    {!isSameUser && userData.role !== "ADMIN" && (
                        !isBlocked ?
                        <button
                            onClick={handleBlock}
                            disabled={isSameUser || isActionLoading}
                            className="flex items-center justify-center gap-2 px-4 py-2 bg-accent hover:bg-red-700 text-white text-sm font-medium rounded-xl disabled:opacity-50"
                        >
                            {isBlocking ? <Loader2 size={16} className="animate-spin" /> : <Blocks size={16} />}
                            Bloquer l'utilisateur
                        </button>
                            :
                        <button
                            onClick={handleBlock}
                            disabled={isActionLoading}
                            className="flex items-center justify-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-xl disabled:opacity-50"
                        >
                            {isActionLoading ? <Loader2 size={16} className="animate-spin" /> : <ShieldCheck size={16} />}
                            Débloquer l'utilisateur
                        </button>
                    )
                    }

                </div>
              </div>

              {canEditProfilePhoto && (
                <div className="mt-6 flex justify-end">
                  <button
                    type="button"
                    onClick={() => navigate("/profile/edit")}
                    className="btn-ocean btn-primary"
                  >
                    Modifier ma photo de profil
                  </button>
                </div>
              )}
            </div>
          )}

        </div>
        {userData && <UserPosts user={userData} username={userData?.username}></UserPosts>}

    </div>
  );
};

export default UserProfile;
