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

type ChartsContextProps = {
    charts: string[];
    setCharts: Dispatch<SetStateAction<string[]>>;
    deleteCharts: ()=>void;
};

const ChartsContext = createContext<ChartsContextProps | undefined>(undefined);

export default function ChartsProvider({ children }: { children: ReactNode }) {
    const [charts, setCharts] = useState<string[]>([]);

    useEffect(() => {
        const stored = localStorage.getItem("charts");
        if (stored) {
            try {
                setCharts(JSON.parse(stored));
            } catch {
                setCharts([]);
            }
        }
    }, []);

    useEffect(() => {
        localStorage.setItem("charts", JSON.stringify(charts));
    }, [charts]);

    useEffect(() => {
        const onStorage = (e: StorageEvent) => {
            if (e.key === "charts" && e.newValue) {
                setCharts(JSON.parse(e.newValue));
            }
        };
        window.addEventListener("storage", onStorage);
        return () => void window.removeEventListener("storage", onStorage);
    }, []);

    const deleteCharts = () => {
        setCharts([]);
    }

    return (
        <ChartsContext.Provider value={{ charts, setCharts, deleteCharts }}>
            {children}
        </ChartsContext.Provider>
    );
}

export function useCharts() {
    const ctx = useContext(ChartsContext);
    if (!ctx) {
        throw new Error("useCharts must be used within a ChartsProvider");
    }
    return ctx;
}
