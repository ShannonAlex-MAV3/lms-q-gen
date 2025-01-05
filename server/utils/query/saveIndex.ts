import { getIndex } from "./client";
import { v4 as uuidv4 } from 'uuid';
import { PineconeStore } from "@langchain/pinecone"
import { Document } from "langchain/document";
import { embeddings } from "../actions/textEmbed";

export const saveIndex = async (text: Document[], meta: string) => {
    const index = await getIndex();
    await PineconeStore.fromDocuments(text, embeddings, { pineconeIndex: index });
};