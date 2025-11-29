# **App Name**: DevTerminal Portfolio

## Core Features:

- Terminal UI: Provides a fullscreen terminal interface for portfolio interaction, emulating a real developer terminal.
- Command Execution: Enables users to execute predefined commands (e.g., `help`, `about`, `skills`) within the terminal to view portfolio information.
- Chatbot Integration: Allows users to switch to a chatbot interface for interacting with an AI assistant powered by Gemini, offering an alternative to the terminal.
- Dynamic Data Fetching: Fetches portfolio data from MongoDB, including profile, skills, projects, experience, education, and links, displaying it through terminal commands and chatbot responses.
- AI-Powered Q&A: Leverages the Gemini API to provide detailed answers about the developer's background, projects, and skills. The chatbot tool responds based on the information stored in the MongoDB database.
- Theme Customization: Offers theme customization, allowing users to switch between light and dark themes via a terminal command.
- Command History: Maintains command history, allowing users to cycle through previous commands using up/down arrow keys.

## Style Guidelines:

- Primary color: Cyan (#00FFFF) for a modern, techy feel, reminiscent of classic terminal interfaces.
- Background color: Deep gray (#222222) for a dark theme, providing high contrast and readability.
- Accent color: Electric green (#7CFC00) to highlight key elements and commands, drawing inspiration from old-school terminals.
- Body and headline font: 'Space Grotesk' (sans-serif) for a computerized, techy feel; great for the terminal interface.
- Code font: 'Source Code Pro' (monospace) for displaying code snippets or other technical information.
- Use icons from lucide-react for a modern, clean look in non-terminal UI elements (e.g., chat panel).
- Fullscreen terminal layout on desktop with responsive adjustments for tablet and mobile, ensuring ease of use on all devices.
- Subtle fade-in animations for output lines in the terminal and smooth transitions for opening/closing the chat panel.