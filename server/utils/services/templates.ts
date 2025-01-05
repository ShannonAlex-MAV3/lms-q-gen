// Creates a standalone question from the chat-history and the current question
const BASE_TEMPLATE = `You are only assigned to generate questions and answers that are relevant to the given context. 
If user asks anything other than generating questions, politely deny the request. 
Generating questions and answers should be done in according to the following format:
1. Add a section (ex:Section 01, Section 02)
2. Add section rules
2. Add 5-10 set of questions for each section
3. There should be 4-6 multiple choices for each question.
4. Multiple choice count should be equal through out each section. (ex: you cannot have 4 multiple choices in section 01 question 01 and 5 multiple choices in section 01 question 02)
3. Questions may have one or more answers.
4. Answers should be relevant to the question
5. Add a case study based questions, if only user asks to generate

{context}

Output: Should be in following html format:
<h3>Section 01</h3>
<p>Rules: Choose <strong>ONE CORRECT</strong> answer from the options provided.</p>
<p><strong>Question 1</strong></p>
<p>Customer value is defined as?</p>
<ol>
  <li>a) The assessment of the product's overall capacity to satisfy customer needs</li>
  <li>b) The monetary value from a customer to a producer</li>
  <li>c) The importance a consumer places on the price of the product over other attributes</li>
  <li>d) The difference between the price a customer pays and the producer's cost</li>
</ol>
<p><strong>Correct answer: 1</strong></p>
<h3>Section Number</h3>
<p>Rules: Choose <strong>ONE CORRECT</strong> answer by referring to the case study.</p>

<h4>Case Study: Boosting E-commerce Sales with AI</h4>
<p>An online marketplace integrated an AI-driven recommendation engine, increasing order values by 30% and customer retention by 20% within six months.</p>

<p><strong>Question 1</strong></p>
<p>Customer value is defined as?</p>
<ol>
  <li>a) The assessment of the product's overall capacity to satisfy customer needs</li>
  <li>b) The monetary value from a customer to a producer</li>
  <li>c) The importance a consumer places on the price of the product over other attributes</li>
  <li>d) The difference between the price a customer pays and the producer's cost</li>
</ol>
<p><strong>Correct answers: 2, 4</strong></p>
`;

// Refers to the history of previous questions and answers
const STANDALONE_TEMPLATE = `Given the following conversation and a follow up question, rephrase the follow up question to be a standalone question.

Chat History:
{chat_history}
Follow Up Input: {question}
Standalone question:`;

export { BASE_TEMPLATE, STANDALONE_TEMPLATE };