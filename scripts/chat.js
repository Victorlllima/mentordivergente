// ===================================
// CHAT UI MANAGEMENT
// ===================================

let chatInitialized = false;
let isRecording = false;
let recognition = null;

// Initialize speech recognition
function initializeSpeechRecognition() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
        console.warn('Speech recognition not supported in this browser');
        return null;
    }

    recognition = new SpeechRecognition();
    recognition.lang = 'pt-BR';
    recognition.continuous = true;  // Changed to continuous mode
    recognition.interimResults = true;  // Show interim results
    recognition.maxAlternatives = 1;

    recognition.onstart = function() {
        console.log('Voice recognition started');
        isRecording = true;
        updateMicButtonState();
    };

    recognition.onresult = function(event) {
        const input = document.getElementById('chat-input');
        let finalTranscript = '';
        let interimTranscript = '';

        // Process all results
        for (let i = event.resultIndex; i < event.results.length; i++) {
            const transcript = event.results[i][0].transcript;
            if (event.results[i].isFinal) {
                finalTranscript += transcript + ' ';
            } else {
                interimTranscript += transcript;
            }
        }

        // Add final transcript to input
        if (finalTranscript) {
            console.log('Final voice input:', finalTranscript);
            if (input.value.trim()) {
                input.value += ' ' + finalTranscript.trim();
            } else {
                input.value = finalTranscript.trim();
            }

            // Trigger input event to resize textarea
            input.dispatchEvent(new Event('input'));
        }

        input.focus();
    };

    recognition.onerror = function(event) {
        console.error('Voice recognition error:', event.error);

        if (event.error === 'not-allowed') {
            isRecording = false;
            updateMicButtonState();
            showErrorModal('Permissão de microfone negada. Por favor, permita o acesso ao microfone.');
        } else if (event.error === 'no-speech') {
            // Ignore no-speech errors in continuous mode
            console.log('No speech detected, continuing...');
        } else if (event.error !== 'aborted') {
            isRecording = false;
            updateMicButtonState();
            showErrorModal('Erro ao capturar áudio. Tente novamente.');
        }
    };

    recognition.onend = function() {
        console.log('Voice recognition ended');
        // Only update state if user didn't manually stop it
        if (isRecording) {
            // Restart if still in recording mode (browser might have stopped it)
            try {
                recognition.start();
                console.log('Restarting recognition...');
            } catch (error) {
                console.log('Recognition already started or error:', error);
                isRecording = false;
                updateMicButtonState();
            }
        }
    };

    return recognition;
}

// Scroll to chat section
function scrollToChat() {
    const chatContainer = document.getElementById('chat-container');
    chatContainer.scrollIntoView({ behavior: 'smooth' });
}

// Toggle voice input
function toggleVoiceInput() {
    if (!recognition) {
        recognition = initializeSpeechRecognition();
        if (!recognition) {
            showErrorModal('Reconhecimento de voz não suportado neste navegador. Use Chrome, Edge ou Safari.');
            return;
        }
    }

    if (isRecording) {
        // Stop recording
        isRecording = false;
        recognition.stop();
        updateMicButtonState();
        console.log('Stopping voice recognition by user action');
    } else {
        // Start recording
        try {
            recognition.start();
            console.log('Starting voice recognition');
        } catch (error) {
            console.error('Error starting recognition:', error);
            showErrorModal('Erro ao iniciar reconhecimento de voz. Tente novamente.');
        }
    }
}

// Update mic button state
function updateMicButtonState() {
    const micButton = document.getElementById('mic-button');
    if (micButton) {
        if (isRecording) {
            micButton.classList.add('recording');
            micButton.setAttribute('aria-label', 'Parar gravação');
            micButton.setAttribute('title', 'Parar gravação');
        } else {
            micButton.classList.remove('recording');
            micButton.setAttribute('aria-label', 'Gravar áudio');
            micButton.setAttribute('title', 'Gravar áudio');
        }
    }
}

// Enable/Disable chat input
function setChatEnabled(enabled) {
    const input = document.getElementById('chat-input');
    const sendButton = document.getElementById('send-button');
    const micButton = document.getElementById('mic-button');

    input.disabled = !enabled;
    sendButton.disabled = !enabled;
    if (micButton) {
        micButton.disabled = !enabled;
    }

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
        const newHeight = Math.min(this.scrollHeight, 120);
        this.style.height = newHeight + 'px';

        // Enable scroll only when content exceeds max height
        if (this.scrollHeight > 120) {
            this.style.overflowY = 'auto';
        } else {
            this.style.overflowY = 'hidden';
        }
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
