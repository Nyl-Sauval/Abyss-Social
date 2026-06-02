import {Loader2} from "lucide-react";
import {Link, useSearchParams} from "react-router-dom";
import BackButton from "../../components/BackButton";
import {useFetch} from "../../hooks/useFetch";
import type {User} from "../../types/User.ts";
import UserAvatar from "../../components/user/UserAvatar.tsx";
import {useAuth} from "../../hooks/useAuth.ts";

const UserSearchResults = () => {
  const [searchParams] = useSearchParams();
  const username = searchParams.get("username") ?? "";
  const searchUrl = username
    ? `/users/search?username=${encodeURIComponent(username)}`
    : "";
  const { data, loading, error } = useFetch<User[]>(searchUrl);
  const { user: currentUser } = useAuth();

    const usersSorted = data
        ?.filter((user) => user.role !== "BANNED" || currentUser?.role === "ADMIN")
        .map((user) => user);

  return (
    <div className="mx-auto max-w-5xl px-6 py-12">
      <BackButton />

      <div className="glass mt-8 rounded-3xl p-8">
        <h1 className="text-2xl font-bold text-abyss-blue">
          Resultats pour "{username || "recherche vide"}"
        </h1>

        {!username ? (
          <p className="mt-4 text-abyss-blue/60">
            Saisissez un nom d&apos;utilisateur dans la barre de recherche.
          </p>
        ) : null}

        {username && loading ? (
          <div className="flex items-center gap-3 py-8 text-abyss-blue/70">
            <Loader2 className="animate-spin text-ocean-teal" size={20} />
            Chargement des utilisateurs...
          </div>
        ) : null}

        {username && error ? (
          <p className="mt-4 text-rose-500">
            La recherche a echoue. Reessayez.
          </p>
        ) : null}

        {username && !loading && !error && data?.length === 0 ? (
          <p className="mt-4 text-abyss-blue/60">Aucun utilisateur trouve.</p>
        ) : null}

        {usersSorted && usersSorted.length > 0 ? (
          <div className="mt-6 grid gap-4">
            {usersSorted.map((result) => {

              return (
                <Link
                  key={result.id}
                  to={`/users/${result.id}`}
                  className="flex items-center justify-between rounded-2xl border border-abyss-blue/10 bg-white/70 px-5 py-4 transition-colors hover:bg-white"
                >
                  <div className="flex items-center gap-4">
                    <UserAvatar
                      username={result.username}
                      profilePicture={result.profilePicture}
                      className="h-12 w-12 rounded-full bg-gradient-to-br from-ocean-teal to-ocean-deep"
                      fallbackClassName="bg-gradient-to-br from-ocean-teal to-ocean-deep font-bold text-white"
                    />

                    <div>
                      <p className="font-semibold text-abyss-blue">
                        {result.username}
                      </p>
                      <p className="text-sm text-abyss-blue/60">
                        {result.email || "Profil utilisateur"}
                      </p>
                    </div>
                  </div>

                  <span className="text-sm font-medium text-ocean-teal">
                    Voir le profil
                  </span>
                </Link>
              );
            })}
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default UserSearchResults;
