import { chatProcess } from "~/utils/actions/chatProcess"
import { Constants } from "~/utils/constant";

// Initialize an in-memory chat history (consider using a database for production)
let chatHistory: string[] = [];

// Function to estimate total token count of chat history
const estimateTotalTokenCount = (chatHistory: string[]): number => {
    return chatHistory.reduce((total, message) => total + message.split(/\s+/).length, 0);
};

export default defineEventHandler(async (event) => {
    console.log("Chat histroy: ", chatHistory)
    try {
        const body = await readBody(event);
        if (!body || body === undefined) {
            return {
                message: "Error: No body found",
                statusCode: 400,
                body: null,
                success: false
            } as HTTPResponse;
        }

        // Update chat history with the prompt
        chatHistory.push(`User: ${body.message}`);

        // Check if the total token count exceeds the limit
        const totalTokens = estimateTotalTokenCount(chatHistory);
        if (totalTokens >= Constants.MAX_PROMPT_TOKEN_COUNT) {
            return {
                message: "Error: Chat history limit exceeded. Please start a new conversation.",
                statusCode: 400,
                body: null,
                success: false
            } as HTTPResponse;
        }

        // Process the chat message and include chat history with a token limit
        const response = await chatProcess(body.message, chatHistory);
        
        // Update chat history with the response
        chatHistory.push(`Bot: ${response}`);

        return {
            message: "Chat Response created successfully",
            statusCode: 200,
            body: response,
            success: true
        } as HTTPResponse;

    } catch (error) {
        return error;
    }
});