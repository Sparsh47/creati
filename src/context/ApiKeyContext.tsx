"use client";

import {createContext, Dispatch, ReactNode, SetStateAction, useContext, useEffect, useState} from "react";

type ApiKeyContextValue = {
    apiKey: string;
    setApiKey: Dispatch<SetStateAction<string>>
}

const ApiKetContext = createContext<ApiKeyContextValue | undefined>(undefined);

const ApiKeyProvider = ({ children }: { children: ReactNode }) => {

    const [apiKey, setApiKey] = useState<string>(()=>{
        if(typeof window === "undefined") {
            return "";
        } else {
            return localStorage.getItem("gemini_api_key") || "";
        }
    });

    useEffect(() => {
        if(apiKey) {
            localStorage.setItem("gemini_api_key", apiKey);
        } else {
            localStorage.removeItem("gemini_api_key");
        }
    }, [apiKey]);

    return (
        <ApiKetContext.Provider value={{apiKey, setApiKey}}>
            {children}
        </ApiKetContext.Provider>
    )
}

const useApiKey = () => {
    const context = useContext(ApiKetContext);
    if (!context) {
        throw new Error("useApiKey must be used within ApiKeyContext");
    }

    return context;
}

export default ApiKeyProvider;
export { useApiKey };