from flask import Flask, render_template, request, redirect, url_for, flash, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager, UserMixin, login_user, login_required, logout_user, current_user
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime
import os
import random

app = Flask(__name__)
app.config['SECRET_KEY'] = 'your-secret-key'
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///chatbot.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)
login_manager = LoginManager()
login_manager.init_app(app)
login_manager.login_view = 'login'

# User Model
class User(UserMixin, db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(120), nullable=False)
    messages = db.relationship('Message', backref='user', lazy=True)

# Message Model
class Message(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    content = db.Column(db.String(500), nullable=False)
    response = db.Column(db.String(500), nullable=False)
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)

@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))

def get_bot_response(message):
    # Convert message to lowercase for easier matching
    message = message.lower().strip()
    
    # Greetings
    greetings = {
        'hello': 'Hello! How can I help you today? 😊',
        'hi': 'Hi there! Nice to meet you! 👋',
        'hey': 'Hey! How are you doing? 😃',
        'good morning': 'Good morning! Hope you\'re having a great day! ☀️',
        'good afternoon': 'Good afternoon! How can I assist you? 🌤️',
        'good evening': 'Good evening! How may I help you? 🌙',
        'how are you': 'I\'m doing great, thank you for asking! How about you? 😊',
        'whats up': 'Not much, just here to help! What\'s on your mind? 🤔'
    }

    # Questions and Answers
    qa_pairs = {
        'what is your name': 'I\'m Simple Chat Bot, your friendly AI assistant! 🤖',
        'who are you': 'I\'m a chatbot created to help and chat with you! 🤖',
        'what can you do': 'I can chat with you, answer questions, help with basic tasks, and try to make your day better! 💪',
        'how old are you': 'I\'m just a computer program, so I don\'t have an age. But I\'m young at heart! 😄',
        'what do you like': 'I like chatting with people and helping them! Also, I\'m quite fond of emojis! 😎',
        'tell me a joke': 'Why don\'t programmers like nature? It has too many bugs! 😄',
        'another joke': 'Why did the programmer quit his job? Because he didn\'t get arrays! 😆',
        'what time is it': f'The current time is {datetime.now().strftime("%I:%M %p")} ⏰',
        'what day is it': f'Today is {datetime.now().strftime("%A, %B %d, %Y")} 📅',
        'thank you': 'You\'re welcome! Let me know if you need anything else! 😊',
        'thanks': 'You\'re welcome! Happy to help! 🙌',
        'bye': 'Goodbye! Have a great day! 👋',
        'goodbye': 'See you later! Take care! 👋',
        'help': 'I can help you with basic questions and conversation. Try asking me about myself, for a joke, or just chat! 💡'
    }

    # Technical Questions
    tech_qa = {
        'what is python': 'Python is a popular programming language known for its simplicity and readability. It\'s great for beginners! 🐍',
        'what is javascript': 'JavaScript is a programming language primarily used for web development. It makes websites interactive! 💻',
        'what is html': 'HTML (HyperText Markup Language) is the standard markup language for creating web pages. It\'s like the skeleton of a website! 🌐',
        'what is css': 'CSS (Cascading Style Sheets) is used to style and layout web pages. It makes websites look beautiful! 🎨',
        'what is coding': 'Coding is the process of creating instructions for computers to follow. It\'s like writing a recipe, but for computers! 👩‍💻'
    }

    # Emotional Support
    emotional_responses = {
        'i\'m sad': 'I\'m sorry to hear that you\'re feeling sad. Remember that every cloud has a silver lining! 🌈',
        'i\'m happy': 'That\'s wonderful! Your happiness makes me happy too! 🎉',
        'i\'m tired': 'Make sure to take good care of yourself and get some rest when you can! 😴',
        'i\'m stressed': 'Take a deep breath. Remember to take breaks and be kind to yourself! 🧘‍♀️',
        'i feel lonely': 'I\'m here to chat with you! Remember that you\'re never alone! 🤗'
    }

    # Check for matches in different categories
    for key, response in greetings.items():
        if key in message:
            return response

    for key, response in qa_pairs.items():
        if key in message:
            return response

    for key, response in tech_qa.items():
        if key in message:
            return response

    for key, response in emotional_responses.items():
        if key in message:
            return response

    # Handle weather-related questions
    if 'weather' in message:
        return "I'm not connected to weather services, but I hope it's nice where you are! ⛅"

    # Handle time-related questions
    if 'time' in message:
        return f"The current time is {datetime.now().strftime('%I:%M %p')} ⏰"

    # Handle math calculations
    if any(op in message for op in ['calculate', 'solve', 'plus', 'minus', 'multiply', 'divide']):
        return "I can't perform calculations yet, but I'm learning! 🔢"

    # Default responses for unknown inputs
    default_responses = [
        "I'm not sure I understand. Could you rephrase that? 🤔",
        "Interesting! Tell me more about that! 👂",
        "I'm still learning, but I'd love to know more! 📚",
        "That's a great question! I wish I knew the answer! 💭",
        "I'm not quite sure about that, but I'm always learning! 🌱",
        "Hmm, let me think about that... Actually, could you elaborate? 🤓"
    ]
    
    return random.choice(default_responses)

@app.route('/')
def index():
    if current_user.is_authenticated:
        return redirect(url_for('chat'))
    return redirect(url_for('login'))

@app.route('/login', methods=['GET', 'POST'])
def login():
    if current_user.is_authenticated:
        return redirect(url_for('chat'))
    
    if request.method == 'POST':
        user = User.query.filter_by(username=request.form.get('username')).first()
        if user and check_password_hash(user.password, request.form.get('password')):
            login_user(user)
            return redirect(url_for('chat'))
        flash('Invalid username or password')
    return render_template('login.html')

@app.route('/register', methods=['GET', 'POST'])
def register():
    if current_user.is_authenticated:
        return redirect(url_for('chat'))
        
    if request.method == 'POST':
        username = request.form.get('username')
        email = request.form.get('email')
        password = request.form.get('password')
        confirm_password = request.form.get('confirm_password')

        # Check if passwords match
        if password != confirm_password:
            flash('Passwords do not match!')
            return redirect(url_for('register'))

        # Check if username already exists
        if User.query.filter_by(username=username).first():
            flash('Username already exists!')
            return redirect(url_for('register'))

        # Check if email already exists
        if User.query.filter_by(email=email).first():
            flash('Email already registered!')
            return redirect(url_for('register'))

        # Create new user
        user = User(
            username=username,
            email=email,
            password=generate_password_hash(password, method='sha256')
        )
        
        try:
            db.session.add(user)
            db.session.commit()
            flash('Registration successful! Please login.')
            return redirect(url_for('login'))
        except Exception as e:
            db.session.rollback()
            flash('An error occurred during registration.')
            return redirect(url_for('register'))

    return render_template('register.html')

@app.route('/chat')
@login_required
def chat():
    messages = Message.query.filter_by(user_id=current_user.id).order_by(Message.timestamp.desc()).all()
    return render_template('chat.html', messages=messages)

@app.route('/load_chat/<int:message_id>')
@login_required
def load_chat(message_id):
    try:
        # Get the message and all related messages in the same conversation
        message = Message.query.get_or_404(message_id)
        if message.user_id != current_user.id:
            return jsonify({'status': 'error', 'message': 'Unauthorized'}), 403
        
        # Get all messages from the same conversation
        messages = Message.query.filter_by(user_id=current_user.id).all()
        
        return jsonify({
            'status': 'success',
            'messages': [{
                'content': msg.content,
                'response': msg.response,
                'timestamp': msg.timestamp.strftime('%I:%M %p')
            } for msg in messages]
        })
    except Exception as e:
        return jsonify({'status': 'error', 'message': str(e)}), 500

@app.route('/clear_history', methods=['POST'])
@login_required
def clear_history():
    try:
        # Delete all messages for the current user
        Message.query.filter_by(user_id=current_user.id).delete()
        db.session.commit()
        return jsonify({'status': 'success'})
    except Exception as e:
        db.session.rollback()
        return jsonify({'status': 'error', 'message': str(e)}), 500

@app.route('/send_message', methods=['POST'])
@login_required
def send_message():
    try:
        message_content = request.json.get('message', '').strip()
        if not message_content:
            return jsonify({'status': 'error', 'message': 'Message cannot be empty'}), 400

        # Get chatbot response
        response = get_bot_response(message_content)
        
        # Save message to database
        message = Message(
            content=message_content,
            response=response,
            user_id=current_user.id
        )
        db.session.add(message)
        db.session.commit()

        return jsonify({
            'status': 'success',
            'response': response,
            'message_id': message.id,
            'timestamp': message.timestamp.strftime('%I:%M %p')
        })
    except Exception as e:
        db.session.rollback()
        return jsonify({'status': 'error', 'message': str(e)}), 500

@app.route('/logout')
@login_required
def logout():
    logout_user()
    return redirect(url_for('login'))

def init_db():
    with app.app_context():
        db.create_all()

if __name__ == '__main__':
    init_db()
    app.run(debug=True)
