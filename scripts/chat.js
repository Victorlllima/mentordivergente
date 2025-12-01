// ===================================
// CHAT UI MANAGEMENT
// ===================================

let chatInitialized = false;

// Scroll to chat section
function scrollToChat() {
    const chatContainer = document.getElementById('chat-container');
    chatContainer.scrollIntoView({ behavior: 'smooth' });
}

// Enable/Disable chat input
function setChatEnabled(enabled) {
    const input = document.getElementById('chat-input');
    const button = document.getElementById('send-button');

    input.disabled = !enabled;
    button.disabled = !enabled;

    if (enabled && !chatInitialized) {
        input.placeholder = 'Digite sua mensagem...';
        chatInitialized = true;
    }
}

// Show/Hide loading screen
function showLoadingScreen(show) {
    const loadingScreen = document.getElementById('loading-screen');
    if (loadingScreen) {
        loadingScreen.style.display = show ? 'flex' : 'none';
    }
}

// Show/Hide typing indicator
function showTypingIndicator(show) {
    const indicator = document.getElementById('typing-indicator');
    indicator.style.display = show ? 'flex' : 'none';
}

// Add message to chat
function addMessage(content, role) {
    const messagesContainer = document.getElementById('chat-messages');

    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message', role);

    // Format message content (handle line breaks)
    const formattedContent = content.replace(/\n/g, '<br>');
    messageDiv.innerHTML = formattedContent;

    messagesContainer.appendChild(messageDiv);

    // Auto-scroll to bottom
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

// Show start screen
function showStartScreen() {
    const startScreen = document.getElementById('start-screen');
    startScreen.style.display = 'flex';
}

// Start chat conversation
async function startChat() {
    // Hide start button and show conversation starters
    const startButton = document.querySelector('.start-button');
    const conversationStarters = document.getElementById('conversation-starters');

    startButton.style.display = 'none';
    conversationStarters.style.display = 'flex';
}

// Send starter message
async function sendStarterMessage(button) {
    const message = button.textContent;
    const startScreen = document.getElementById('start-screen');

    // Hide start screen
    startScreen.style.display = 'none';

    // Disable input while sending message
    setChatEnabled(false);

    // Add user message to chat
    addMessage(message, 'user');

    // Show typing indicator
    showTypingIndicator(true);

    try {
        // Send message to assistant
        const response = await sendMessageToAssistant(message);

        // Hide typing indicator
        showTypingIndicator(false);

        // Add assistant response
        if (response) {
            addMessage(response, 'assistant');
        }
    } catch (error) {
        console.error('Error starting chat:', error);
        showTypingIndicator(false);
        showErrorModal('Não foi possível iniciar a conversa. Tente novamente.');
    } finally {
        // Re-enable input
        setChatEnabled(true);
        document.getElementById('chat-input').focus();
    }
}

// Show error modal
function showErrorModal(message) {
    const modal = document.getElementById('error-modal');
    const errorMessage = document.getElementById('error-message');

    errorMessage.textContent = message;
    modal.style.display = 'flex';
}

// Close error modal
function closeErrorModal() {
    const modal = document.getElementById('error-modal');
    modal.style.display = 'none';
}

// Send message
async function sendMessage() {
    const input = document.getElementById('chat-input');
    const message = input.value.trim();

    if (!message) return;

    // Disable input while sending
    setChatEnabled(false);

    // Add user message to chat
    addMessage(message, 'user');

    // Clear input
    input.value = '';
    input.style.height = 'auto';

    // Show typing indicator
    showTypingIndicator(true);

    try {
        // Send message to OpenAI
        const response = await sendMessageToAssistant(message);

        // Hide typing indicator
        showTypingIndicator(false);

        // Add assistant response
        if (response) {
            addMessage(response, 'assistant');
        }
    } catch (error) {
        console.error('Error sending message:', error);
        showTypingIndicator(false);
        showErrorModal('Não foi possível enviar a mensagem. Tente novamente.');
    } finally {
        // Re-enable input
        setChatEnabled(true);
        input.focus();
    }
}

// Handle Enter key in textarea
function setupInputHandlers() {
    const input = document.getElementById('chat-input');

    // Auto-resize textarea
    input.addEventListener('input', function () {
        this.style.height = 'auto';
        this.style.height = Math.min(this.scrollHeight, 120) + 'px';
    });

    // Send on Enter (without Shift)
    input.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    });
}

// Initialize chat on page load
async function initializeChat() {
    try {
        // Show loading screen
        showLoadingScreen(true);

        // Setup input handlers
        setupInputHandlers();

        // Initialize OpenAI thread
        await initializeThread();

        // Hide loading screen
        showLoadingScreen(false);

        // Show start screen instead of welcome message
        showStartScreen();

        // Enable chat input
        setChatEnabled(true);
    } catch (error) {
        console.error('Error initializing chat:', error);
        showLoadingScreen(false);
        showErrorModal('Não foi possível inicializar o chat. Verifique sua conexão e recarregue a página.');
    }
}

// Run on page load
window.addEventListener('DOMContentLoaded', () => {
    // Scroll to top on page load
    window.scrollTo({ top: 0, behavior: 'instant' });

    // Initialize chat
    initializeChat();
});

// Ensure scroll to top on page reload
window.addEventListener('beforeunload', () => {
    window.scrollTo(0, 0);
});
