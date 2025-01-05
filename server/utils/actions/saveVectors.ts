import { Document } from "langchain/document";
import { saveIndex } from "../query/saveIndex";

export const saveEmbeddings = async (chunks: Document[], meta: string) => {
    try {
        if (chunks.length > 0) {
            await saveIndex(chunks, meta);
        }
    } catch (error) {
        throw new Error("Error saving embeddings: " + error);
    }
}