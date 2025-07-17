"use client";

import {
    createContext,
    Dispatch,
    ReactNode,
    SetStateAction,
    useContext,
    useEffect,
    useState,
} from "react";

type AuthInfoType = {
    email: string;
    password: string;
    isLoggedIn: boolean;
    accountCreated: boolean;
};

type AuthContextValue = {
    isLoggedIn: boolean;
    setIsLoggedIn: Dispatch<SetStateAction<boolean>>;
    authInfo: AuthInfoType;
    setAuthInfo: Dispatch<SetStateAction<AuthInfoType>>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const EMPTY_AUTH: AuthInfoType = {
    email: "",
    password: "",
    isLoggedIn: false,
    accountCreated: false,
};

const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [authInfo, setAuthInfo] = useState<AuthInfoType>(EMPTY_AUTH);

    useEffect(() => {
        try {
            const stored = localStorage.getItem("authInfo");
            if (stored) {
                const parsed: AuthInfoType = JSON.parse(stored);
                setAuthInfo(parsed);
                setIsLoggedIn(parsed.isLoggedIn);
            } else {
                setAuthInfo(EMPTY_AUTH);
            }
        } catch {
            setAuthInfo(EMPTY_AUTH);
        }
    }, []);

    useEffect(() => {
        localStorage.setItem("authInfo", JSON.stringify(authInfo));
    }, [authInfo]);

    return (
        <AuthContext.Provider
            value={{ isLoggedIn, setIsLoggedIn, authInfo, setAuthInfo }}
        >
            {children}
        </AuthContext.Provider>
    );
};

const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};

export default AuthProvider;
export { useAuth };
