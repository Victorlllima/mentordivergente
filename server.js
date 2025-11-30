// ===================================
// BACKEND SERVER - MENTOR DIVERGENTE
// ===================================

const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const OpenAI = require('openai');
const path = require('path');

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname)));

// Initialize OpenAI client
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

const ASSISTANT_ID = process.env.OPENAI_ASSISTANT_ID;

// Store active threads (in production, use a database)
const activeThreads = new Map();

// ===================================
// API ENDPOINTS
// ===================================

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'Server is running' });
});

// Create a new thread
app.post('/api/threads', async (req, res) => {
    try {
        const thread = await openai.beta.threads.create();

        // Store thread ID (in production, associate with user session)
        activeThreads.set(thread.id, {
            createdAt: new Date(),
            messageCount: 0
        });

        console.log('Thread created:', thread.id);

        res.json({
            id: thread.id,
            created_at: thread.created_at
        });
    } catch (error) {
        console.error('Error creating thread:', error);
        res.status(500).json({
            error: {
                message: error.message || 'Failed to create thread'
            }
        });
    }
});

// Send message and get response
app.post('/api/messages', async (req, res) => {
    try {
        const { threadId, content } = req.body;

        if (!threadId || !content) {
            return res.status(400).json({
                error: { message: 'threadId and content are required' }
            });
        }

        // Add message to thread
        await openai.beta.threads.messages.create(threadId, {
            role: 'user',
            content: content
        });

        console.log('Message added to thread:', threadId);

        // Create and run assistant
        const run = await openai.beta.threads.runs.create(threadId, {
            assistant_id: ASSISTANT_ID
        });

        console.log('Run created:', run.id);

        // Poll for completion
        let runStatus = await openai.beta.threads.runs.retrieve(threadId, run.id);

        const maxAttempts = 60;
        let attempts = 0;

        while (runStatus.status !== 'completed' && attempts < maxAttempts) {
            if (runStatus.status === 'failed' ||
                runStatus.status === 'cancelled' ||
                runStatus.status === 'expired') {
                throw new Error(`Run ${runStatus.status}: ${runStatus.last_error?.message || 'Unknown error'}`);
            }

            // Wait 1 second before next poll
            await new Promise(resolve => setTimeout(resolve, 1000));

            runStatus = await openai.beta.threads.runs.retrieve(threadId, run.id);
            attempts++;

            console.log(`Run status (${attempts}/${maxAttempts}):`, runStatus.status);
        }

        if (runStatus.status !== 'completed') {
            throw new Error('Run polling timeout');
        }

        // Get messages
        const messages = await openai.beta.threads.messages.list(threadId);

        // Get the latest assistant message
        const assistantMessage = messages.data.find(msg => msg.role === 'assistant');

        if (!assistantMessage) {
            throw new Error('No assistant message found');
        }

        // Extract text content
        const textContent = assistantMessage.content.find(c => c.type === 'text');

        if (!textContent) {
            throw new Error('No text content in assistant message');
        }

        // Update thread stats
        if (activeThreads.has(threadId)) {
            const threadData = activeThreads.get(threadId);
            threadData.messageCount += 1;
            threadData.lastMessageAt = new Date();
        }

        res.json({
            message: textContent.text.value,
            messageId: assistantMessage.id,
            threadId: threadId
        });

    } catch (error) {
        console.error('Error processing message:', error);
        res.status(500).json({
            error: {
                message: error.message || 'Failed to process message'
            }
        });
    }
});

// Get thread messages (optional - for debugging)
app.get('/api/threads/:threadId/messages', async (req, res) => {
    try {
        const { threadId } = req.params;

        const messages = await openai.beta.threads.messages.list(threadId);

        res.json({
            messages: messages.data.map(msg => ({
                id: msg.id,
                role: msg.role,
                content: msg.content,
                created_at: msg.created_at
            }))
        });
    } catch (error) {
        console.error('Error getting messages:', error);
        res.status(500).json({
            error: {
                message: error.message || 'Failed to get messages'
            }
        });
    }
});

// ===================================
// START SERVER
// ===================================

app.listen(PORT, () => {
    console.log(`
╔════════════════════════════════════════╗
║   MENTOR DIVERGENTE - SERVER RUNNING   ║
╚════════════════════════════════════════╝

🚀 Server: http://localhost:${PORT}
🤖 Assistant ID: ${ASSISTANT_ID}
📡 API Endpoints:
   - POST /api/threads
   - POST /api/messages
   - GET  /api/threads/:id/messages
   - GET  /api/health

Ready to receive requests...
    `);
});
