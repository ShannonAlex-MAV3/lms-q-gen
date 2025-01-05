import { ChatOpenAI } from "@langchain/openai";

// create both streaming and non-streaming chat models of langchain
const streamingChatModel = new ChatOpenAI({
    modelName: "gpt-4o-mini",
    streaming: true,
    verbose: true,
    temperature: 0.7,
    apiKey: process.env.OPENAI_KEY as string,
});

const nonStreamingChatModel = new ChatOpenAI({
    modelName: "gpt-4o-mini",
    streaming: false,
    verbose: true,
    temperature: 0.7,
    apiKey: process.env.OPENAI_KEY as string
});

export { streamingChatModel, nonStreamingChatModel }