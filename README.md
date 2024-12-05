# Simple Chat Bot

A modern, interactive chat application built with Flask, featuring user authentication and an intelligent chatbot.

## Features

- User Authentication
  - Registration with username and email
  - Secure login/logout functionality
  - Password hashing for security

- Modern UI
  - Responsive design
  - Dark/Light mode toggle
  - Animated gradients and transitions
  - Clean, professional interface

- Chatbot Capabilities
  - Intelligent response system
  - Multiple conversation categories
  - Emoji-rich communication
  - Chat history tracking

- Real-time Features
  - Message history preservation
  - New chat functionality
  - Dynamic message loading

## Technologies Used

- Backend
  - Python
  - Flask
  - SQLAlchemy
  - Flask-Login

- Frontend
  - HTML5
  - CSS3
  - JavaScript
  - Modern UI/UX principles

- Database
  - SQLite

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/YOUR_USERNAME/simple-chat-bot.git
   cd simple-chat-bot
   ```

2. Create a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Initialize the database:
   ```bash
   python
   >>> from app import db
   >>> db.create_all()
   >>> exit()
   ```

5. Run the application:
   ```bash
   python app.py
   ```

6. Visit `http://localhost:5000` in your browser

## Usage

1. Register a new account
2. Login with your credentials
3. Start chatting with the bot
4. Try different types of questions:
   - Greetings
   - Technical questions
   - Jokes
   - Personal questions

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
