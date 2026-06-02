import {API_BASE_URL} from "../config.ts";

export const deleteAccount = async (token: string, userId: number): Promise<boolean> => {
    const res = await fetch(`${API_BASE_URL}/users/${userId}`, {
        method: "DELETE",
        headers: {
            "Authorization": `Bearer ${token}`,
        }
    });
    return res.ok;
};