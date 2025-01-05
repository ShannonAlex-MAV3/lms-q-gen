import { StringOutputParser } from "@langchain/core/output_parsers";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { RunnableSequence } from "@langchain/core/runnables";
import { getFromIndex } from "../query/getFromIndex";
import { streamingChatModel } from "../services/gptModels";
import { BASE_TEMPLATE, STANDALONE_TEMPLATE } from "../services/templates";

export const chatProcess = async (message: string, chatHistory: string[], options?: { k?: number }): Promise<any> => {
    try {

        // get indexes
        const getStore = await getFromIndex();
        if (getStore) {
            // perform a similarity search to find the most relevant documents
            const retrieve = getStore.asRetriever({
                k: options?.k || 10
            });

            const retrievedDocs = await retrieve.invoke(message);

            if (!retrievedDocs || retrievedDocs.length === 0) {
                throw new Error("No documents found");
            }

            // Select appropriate prompt template
            const promptTemplate = chatHistory.length === 0
                ? BASE_TEMPLATE
                : STANDALONE_TEMPLATE.replace("{chat_history}", chatHistory.join("\n"));

            const prompt = ChatPromptTemplate.fromTemplate(promptTemplate);


            // construct the chain
            const chain = RunnableSequence.from([
                prompt,
                streamingChatModel,
                new StringOutputParser()
            ]);

            const response = await chain.invoke({
                context: retrievedDocs,
                question: message
            });

            return response;
        }
    } catch (error) {
        console.error("Chat process error:", error);
        return "An error occurred while processing your request.";
    }
};