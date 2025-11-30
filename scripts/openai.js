// ===================================
// OPENAI BACKEND API INTEGRATION
// ===================================

// Configuration
const CONFIG = {
    apiBaseUrl: (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
        ? 'http://localhost:3000/api'
        : 'https://mentordivergente.vercel.app/api'
};

// Thread state
let currentThreadId = null;

// Make API request to backend
async function makeApiRequest(endpoint, method = 'GET', body = null) {
    const headers = {
        'Content-Type': 'application/json'
    };

    const options = {
        method,
        headers
    };

    if (body) {
        options.body = JSON.stringify(body);
    }

    const response = await fetch(`${CONFIG.apiBaseUrl}${endpoint}`, options);

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error?.message || 'API request failed');
    }

    return await response.json();
}

// Create a new thread
async function createThread() {
    try {
        const result = await makeApiRequest('/threads', 'POST');
        currentThreadId = result.id;
        console.log('Thread created:', currentThreadId);
        return result.id;
    } catch (error) {
        console.error('Error creating thread:', error);
        throw error;
    }
}

// Initialize thread
async function initializeThread() {
    // Check if backend is running
    try {
        await makeApiRequest('/health', 'GET');
        console.log('Backend connection successful');
    } catch (error) {
        throw new Error('Backend server is not running. Please start the server with "npm start"');
    }

    // Create new thread
    await createThread();
}

// Send message to assistant and get response
async function sendMessageToAssistant(message) {
    if (!currentThreadId) {
        throw new Error('No active thread');
    }

    try {
        const result = await makeApiRequest('/messages', 'POST', {
            threadId: currentThreadId,
            content: message
        });

        console.log('Response received from assistant');
        return result.message;
    } catch (error) {
        console.error('Error in sendMessageToAssistant:', error);
        throw error;
    }
}

// Export functions for use in chat.js
window.initializeThread = initializeThread;
window.sendMessageToAssistant = sendMessageToAssistant;
