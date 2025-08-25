export type DesignCardType = {
    id: string;
    images: string[];
    title: string;
    prompt: string;
    createdAt: string;
    visibility: "PUBLIC" | "PRIVATE";
    onChangeAction: () => void;
}