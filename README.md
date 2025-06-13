
# ChatNest - Real-time Chat with AI

A beautiful real-time web chat application where users can interact with each other and ChatGPT in the same chatroom.

## 🚀 Features

- **Real-time messaging** with Socket.io
- **AI Integration** - Chat with ChatGPT by starting messages with `@gpt`
- **Beautiful modern UI** with glassmorphism effects and gradients
- **Responsive design** that works on all devices
- **Typing indicators** and online user count
- **Message history** with timestamps
- **Special styling** for GPT responses

## 🛠 Tech Stack

**Frontend:**
- React.js with TypeScript
- Tailwind CSS for styling
- shadcn/ui components
- Socket.io-client for real-time communication
- Lucide React for icons

**Backend (For Production):**
- Node.js with Express/Fastify
- Socket.io for WebSocket communication
- OpenAI GPT-4 API integration
- Optional: MongoDB/Firebase for message persistence

## 🎨 Design Features

- Modern gradient backgrounds (purple to blue to cyan)
- Glassmorphism effects with backdrop blur
- Smooth animations and transitions
- Distinct message bubbles for users vs GPT
- Interactive hover effects
- Responsive layout for mobile and desktop

## 🔧 Setup Instructions

### Frontend (Current Implementation)
1. Clone the repository
2. Install dependencies: `npm install`
3. Start the development server: `npm run dev`
4. Enter your display name to join the chat
5. Optionally add your OpenAI API key for real GPT responses

### Backend (For Production)
To implement the full backend functionality:

1. Create a Node.js server with Express
2. Set up Socket.io for real-time communication
3. Integrate OpenAI API for GPT responses
4. Add message persistence if needed

## 📝 Usage

1. **Join the chat**: Enter your display name to join ChatNest
2. **Send messages**: Type and send messages to chat with other users
3. **Chat with AI**: Start any message with `@gpt` to get responses from ChatGPT
4. **Real-time updates**: See messages from other users instantly
5. **Typing indicators**: See when others are typing

## 🌟 Demo Mode

The current implementation runs in demo mode with simulated backend functionality:
- Messages are shown locally
- GPT responses are simulated (actual API integration ready)
- Typing indicators work locally
- Perfect for testing the UI and user experience

## 🚀 Production Deployment

For production deployment:
1. Implement the backend server with Socket.io
2. Add OpenAI API integration
3. Deploy backend to Render, Railway, or Heroku
4. Deploy frontend to Vercel or Netlify
5. Configure environment variables for API keys

## 🔐 Environment Variables

```env
VITE_SOCKET_URL=your_backend_url
OPENAI_API_KEY=your_openai_api_key
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is open source and available under the MIT License.
