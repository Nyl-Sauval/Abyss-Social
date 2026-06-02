import type {PostFormType} from "../types/forms/PostForm.ts";
import type {Post} from "../types/Post.ts";
import type {User} from "../types/User.ts";
import { API_BASE_URL } from "../config";

export const toggleReaction = async (
    postId: string,
    userId: string,
    action: "likes" | "dislikes",
    token: string | null,
    method: "POST" | "DELETE" = "POST",
): Promise<boolean> => {
    const res = await fetch(`${API_BASE_URL}/posts/${postId}/${action}?userId=${userId}`, {
        method,
        headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    return res.ok;
};

export const deletePost = async (postId: string, token: string | null): Promise<boolean> => {
    const res = await fetch(`${API_BASE_URL}/posts/${postId}`, {
        method: "DELETE",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    return res.ok;
};

export const createPost = (payload: PostFormType): FormData => {
    const formData = new FormData();
    formData.append("content", payload.content);

    if (payload.image) {
        formData.append("image", payload.image);
    }

    formData.append("likes", "[]");
    formData.append("dislikes", "[]");
    formData.append("comments", "[]");

    return formData;
};

export const getFilteredPosts = (post: Post[], user: User | null) => {
    return post.filter((post) => !user?.usersBanned?.some((userBanned) => userBanned.id === post.userId));
}