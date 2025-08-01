export type DesignCardType = {
    id: string;
    images: string[];
    prompt: string;
    createdAt: string;
    visibility: "PUBLIC" | "PRIVATE";
}