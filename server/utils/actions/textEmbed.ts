import { OpenAIEmbeddings } from "@langchain/openai";
// setup openai embeddings of langchain
export const embeddings = new OpenAIEmbeddings({
    apiKey: process.env.OPENAI_KEY!,
    batchSize: 512,
    model: "text-embedding-ada-002",
});


// embed the text - PUBLIC
export const getEmbeddings = async (text: string): Promise<any> => {
    try {
        const query = await embeddings.embedQuery(text);
        return query;

    } catch (error) {
        throw new Error("Error splitting PDF: " + error);
    }
}