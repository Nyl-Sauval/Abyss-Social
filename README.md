# Frontend du groupe Abyss-Social (2)

## Equipe Echoo (5)

Lucie Bacqueville - Mattéo Fierquin - Emma Grave - Romain Hannoir - Nyl Sauval

## Structure du projet

```text
src/
        pages # Toutes les pages
        components # Tous les components de l'app
        context # Contextes de l'app (contient que l'AuthContext)
        hooks # Hooks réutilisables
        services # Services de l'app (principalement les requêtes)
        types # Interfaces de l'app
        App.tsx # Composant racine, contient les routes et le layout
        config.ts # Contient la config de l'API
```

## Les hooks

### useFetch

Hook de fetch qui gère les data, l'état de loading et les erreurs. Il ajoute aussi automatiquement le bearer token si l'utilisateur est connecté.

Exemple :

```tsx
const { data, loading, error } = useFetch<Post[]>('/posts/feed');

if (loading) return <p>Chargement...</p>;
if (error) return <p>Erreur de chargement.</p>;

return (
    <div>
        {data?.map(post => (
            <p key={post.id}>{post.content}</p>
        ))}
    </div>
);
```

### useMutation

Même type de hook que useFetch, mais pour les requêtes d'écriture.

Exemple :

```tsx
const { mutate, loading, error } = useMutation('/auth/login', {
    method: 'POST',
});

const handleSubmit = async () => {
    const response = await mutate({ email, password });
    console.log(response);
};

return (
    <button onClick={handleSubmit} disabled={loading}>
        Se connecter
    </button>
);
```

### useCallback

Hook pour mémoriser une fonction asynchrone qui dépend de certaines variables. Utile pour éviter les re-renders inutiles, et évite les erreurs lint.

Exemple :

```tsx
const refreshUser = useCallback(async () => {
    if (!token) return;
    setHasInitialized(false);
    await fetchCurrentUser(token);
}, [token, fetchCurrentUser]);
```

Ici on mémorise la fonction refreshUser, qui dépend du token et de fetchCurrentUser. Elle ne sera recréée que si l'une de ces dépendances change, ce qui évite les re-renders inutiles et les erreurs lint. On a besoin d'un refresh user car pouvoir mettre à jour les utilisateurs bloqués par l'utilisateur connecté. 

### useMemo

Hook pour mémoriser une valeur qui dépend de certaines variables. Utile pour éviter les re-renders inutiles, et évite les erreurs lint.

Exemple :

```tsx
const contextValue: AuthContextType = useMemo(
    () => ({
        user,
        token,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
        setToken,
        deleteAccount,
        fetchCurrentUser,
        refreshUser,
    }),
    [user, token, isLoading, login, logout, deleteAccount, fetchCurrentUser, refreshUser],
);
```