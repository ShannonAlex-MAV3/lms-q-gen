// Creates a standalone question from the chat-history and the current question
const BASE_TEMPLATE = `Classify the user's question into one of the following categories: [Places recommendation, Tour Packages, Budget Estimation].
Examples:
Question: "What are the best places to visit in Sri Lanka?"
Classification: Places recommendation
Answer layout: end of the answer provide a list of places in json separately

Question: "I like to enjoy the wildlife, do surfing and hiking. Can you suggest some places to visit?"
Classification: Tour Packages
Answer layout: end of the answer provide a list of places in json separately

Question: "How much does it cost to visit ?"
Classification: Budget Estimation

{context}

Now classify the following:
Question: "{question}"
Classification:
Helpful answer in markdown:
`;

// Refers to the history of previous questions and answers
const STANDALONE_TEMPLATE = `Given the following conversation and a follow up question, rephrase the follow up question to be a standalone question.

Chat History:
{chat_history}
Follow Up Input: {question}
Standalone question:`;

export { BASE_TEMPLATE, STANDALONE_TEMPLATE };