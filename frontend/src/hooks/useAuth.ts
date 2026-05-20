import { useContext } from "react";
import type { AuthContextType } from "../types/types";
import { AuthContext } from "../context/AuthContext";

export const useAuth = () : AuthContextType => {
    const context = useContext(AuthContext)
    if(context == null) throw new Error('Context cannot be null')
    return context
}