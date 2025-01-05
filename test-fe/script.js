const chatHistoryElement = document.getElementById('chat-history');
const messageInput = document.getElementById('message-input');
const sendButton = document.getElementById('send-button');
const fileInput = document.getElementById('file-input');
const uploadButton = document.getElementById('upload-button');

const API_URL = 'http://localhost:3000/api/chat/chat-chain'; // Update with your API URL
const FILE_UPLOAD_URL = 'http://localhost:3000/api/file/save-file'; // Update with your file upload API URL

sendButton.addEventListener('click', async () => {
    const message = messageInput.value;
    if (message) {
        appendMessage(`User: ${message}`);
        messageInput.value = '';

        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ message }),
        });

        const data = await response.json();
        appendMessage(`Bot: ${data.body}`);
    }
});

uploadButton.addEventListener('click', async () => {
    const file = fileInput.files[0];
    if (file) {
        const formData = new FormData();
        formData.append('file', file);

        const response = await fetch(FILE_UPLOAD_URL, {
            method: 'POST',
            body: formData,
        });

        const data = await response.json();
        alert(data.message);
        fileInput.value = ''; // Clear the file input
    }
});

function appendMessage(message) {
    const messageElement = document.createElement('div');
    messageElement.textContent = message;
    // Regular expression to match the JSON block
    const jsonRegex = /```json\s+([\s\S]*?)\s+```/;

    // Extract the JSON part
    const match = message.match(jsonRegex);
    if (match && match[1]) {
        try {
            // Parse the JSON string
            const jsonData = JSON.parse(match[1]);
            if (Array.isArray(jsonData)) {
                const jsonElement = document.createElement('pre');
                jsonElement.textContent = JSON.stringify(jsonData, null, 2); // Beautify JSON
                jsonElement.style.backgroundColor = '#f0f0f0'; // Light background for better visibility
                jsonElement.style.padding = '10px';
                jsonElement.style.borderRadius = '5px';
                jsonElement.style.overflowX = 'auto'; // Allow horizontal scrolling if needed
                messageElement.appendChild(jsonElement);
            }

        } catch (error) {
            console.error("Failed to parse JSON:", error);
        }
    } else {
        console.error("No JSON block found in the text.");
    }

    chatHistoryElement.appendChild(messageElement);
    chatHistoryElement.scrollTop = chatHistoryElement.scrollHeight; // Scroll to the bottom
}