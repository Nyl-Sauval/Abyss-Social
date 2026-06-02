import {Loader2, UserMinus, UserPlus} from "lucide-react";
import {useMutation} from "../../hooks/useMutation.ts";
import {useAuth} from "../../hooks/useAuth.ts";

type FriendRef = { id?: string | number | null };

type FollowButtonProps = {
    userToFollowId: string;
    onChanged?: () => void;
};

export const FollowButton = ({userToFollowId, onChanged}: FollowButtonProps) => {
    const {user, refreshUser} = useAuth();

    const isFollowing: boolean = !!user?.friends?.some((friend: FriendRef) => String(friend?.id) === String(userToFollowId));

    const {mutate: follow, error: followError, loading: followLoading} = useMutation<void, unknown>(
        `/users/friends/add?friendId=${userToFollowId}`,
        {method: "PATCH"},
    );

    const {mutate: unfollow, error: unfollowError, loading: unfollowLoading} = useMutation<void, unknown>(
        `/users/friends/remove?friendId=${userToFollowId}`,
        {method: "PATCH"},
    );

    const isMe: boolean = user?.id === userToFollowId;
    const loading: boolean = followLoading || unfollowLoading;
    const error: Error | null = followError || unfollowError;

    let icon = <UserPlus size={16} />;
    let label: string = "Suivre";

    if (loading) {
        icon = <Loader2 size={16} className="animate-spin" />;
        label = "Chargement...";
    } else if (isFollowing) {
        icon = <UserMinus size={16} />;
        label = "Suivi";
    }

    const handleClick = async () => {
        if (!user || isMe) return;

        try {
            if (isFollowing) {
                await unfollow();
            } else {
                await follow();
            }
            await refreshUser();
            onChanged?.();
        } catch {
            console.error("Failed to follow/unfollow");
        }
    };

    return (
        <div className="flex flex-col items-end gap-2">
            <button
                type="button"
                onClick={handleClick}
                disabled={!user || isMe || loading}
                className="inline-flex items-center gap-2 rounded-xl border border-abyss-blue/10 bg-white/30 px-4 py-2 text-sm font-semibold text-abyss-blue transition hover:bg-white/40 disabled:cursor-not-allowed disabled:opacity-60"
            >
                {icon}
                {label}
            </button>

            {error && (
                <p className="text-xs font-medium text-accent">{error.message}</p>
            )}
        </div>
    );
};
