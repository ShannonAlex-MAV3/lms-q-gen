import { Pinecone } from "@pinecone-database/pinecone"
const getClient = async () => {
    const pineconeClient = new Pinecone({
        apiKey: process.env.PINECONE_API_KEY!
    });
    return pineconeClient;
}


export const getIndex = async () => {
    const client = await getClient();
    const index = client.Index(process.env.PINECONE_INDEX_NAME!);
    return index;
}