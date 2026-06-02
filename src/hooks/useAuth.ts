import {useContext} from "react";
import {AuthContext} from "../context/AuthContextBase";

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("Not in context provider");
    }
    return context;
};