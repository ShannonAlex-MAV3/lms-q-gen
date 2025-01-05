import { PineconeStore } from "@langchain/pinecone";
import { getIndex } from "./client";
import { embeddings } from "../actions/textEmbed";

export const getFromIndex = async () => {
    const index = await getIndex();
    const store = await PineconeStore.fromExistingIndex(embeddings, { pineconeIndex: index });

    return store;
};