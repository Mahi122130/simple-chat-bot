document.addEventListener('DOMContentLoaded', function() {
    // Chat functionality
    const messageInput = document.querySelector('.chat-input input');
    const sendButton = document.querySelector('.chat-input button');
    const messagesContainer = document.querySelector('.messages');
    
    // Sidebar elements
    const newChatBtn = document.querySelector('.new-chat-btn');
    const clearHistoryBtn = document.querySelector('.history-header button');
    const historyItems = document.querySelectorAll('.history-item');
    const menuItems = document.querySelectorAll('.menu-item');
    const userMenu = document.querySelector('.user-menu');
    const chatActions = document.querySelectorAll('.chat-actions button');

    // Message sending functionality
    function sendMessage(message) {
        if (!message.trim()) return;

        const messageElement = document.createElement('div');
        messageElement.className = 'message sent';
        messageElement.innerHTML = message;
        messagesContainer.appendChild(messageElement);
        messageInput.value = '';
        messagesContainer.scrollTop = messagesContainer.scrollHeight;

        // Simulate received message
        setTimeout(() => {
            const receivedMessage = document.createElement('div');
            receivedMessage.className = 'message received';
            receivedMessage.innerHTML = 'This is a sample response!';
            messagesContainer.appendChild(receivedMessage);
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        }, 1000);
    }

    sendButton.addEventListener('click', () => {
        sendMessage(messageInput.value);
    });

    messageInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendMessage(messageInput.value);
        }
    });

    // New Chat functionality
    newChatBtn.addEventListener('click', () => {
        // Clear messages
        messagesContainer.innerHTML = '';
        
        // Deactivate all history items
        historyItems.forEach(item => item.classList.remove('active'));
        
        // Add new history item
        const newHistoryItem = createHistoryItem('New Chat', '0 messages');
        document.querySelector('.history-list').prepend(newHistoryItem);
        
        // Focus on input
        messageInput.focus();
    });

    // Clear History functionality
    clearHistoryBtn.addEventListener('click', () => {
        if (confirm('Are you sure you want to clear all chat history?')) {
            document.querySelector('.history-list').innerHTML = '';
            messagesContainer.innerHTML = '';
        }
    });

    // History item actions
    function createHistoryItem(title, messageCount) {
        const item = document.createElement('div');
        item.className = 'history-item active';
        item.innerHTML = `
            <i class="fas fa-comment"></i>
            <div class="history-content">
                <div class="history-title">${title}</div>
                <div class="history-meta">
                    <span class="history-time">
                        <i class="far fa-clock"></i>
                        just now
                    </span>
                    <span>${messageCount}</span>
                </div>
            </div>
            <div class="history-actions">
                <button class="history-action-btn" title="Pin chat">
                    <i class="fas fa-thumbtack"></i>
                </button>
                <button class="history-action-btn" title="Delete chat">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;
        setupHistoryItemListeners(item);
        return item;
    }

    function setupHistoryItemListeners(item) {
        // Pin chat
        item.querySelector('.fa-thumbtack').parentElement.addEventListener('click', (e) => {
            e.stopPropagation();
            const isPinned = item.classList.toggle('pinned');
            if (isPinned) {
                document.querySelector('.history-list').prepend(item);
            }
        });

        // Delete chat
        item.querySelector('.fa-times').parentElement.addEventListener('click', (e) => {
            e.stopPropagation();
            if (confirm('Are you sure you want to delete this chat?')) {
                item.remove();
            }
        });

        // Select chat
        item.addEventListener('click', () => {
            historyItems.forEach(hi => hi.classList.remove('active'));
            item.classList.add('active');
            // Here you would typically load the chat history
            loadChatHistory(item.querySelector('.history-title').textContent);
        });
    }

    // Setup listeners for existing history items
    historyItems.forEach(setupHistoryItemListeners);

    // Menu items functionality
    menuItems.forEach(item => {
        item.addEventListener('click', () => {
            menuItems.forEach(mi => mi.classList.remove('active'));
            item.classList.add('active');
            
            // Handle different menu actions
            const action = item.querySelector('span').textContent.toLowerCase();
            switch(action) {
                case 'starred':
                    filterChats('starred');
                    break;
                case 'archived':
                    filterChats('archived');
                    break;
                case 'settings':
                    showSettings();
                    break;
                default:
                    showAllChats();
            }
        });
    });

    // User menu toggle
    userMenu.addEventListener('click', () => {
        const dropdown = document.createElement('div');
        dropdown.className = 'user-dropdown';
        dropdown.innerHTML = `
            <div class="dropdown-item"><i class="fas fa-user"></i> Profile</div>
            <div class="dropdown-item"><i class="fas fa-cog"></i> Settings</div>
            <div class="dropdown-item"><i class="fas fa-moon"></i> Dark Mode</div>
            <div class="dropdown-item logout"><i class="fas fa-sign-out-alt"></i> Logout</div>
        `;
        
        // Position the dropdown
        const rect = userMenu.getBoundingClientRect();
        dropdown.style.position = 'absolute';
        dropdown.style.bottom = `${window.innerHeight - rect.top}px`;
        dropdown.style.left = `${rect.left}px`;
        
        // Remove existing dropdowns
        document.querySelectorAll('.user-dropdown').forEach(d => d.remove());
        
        // Add the new dropdown
        document.body.appendChild(dropdown);
        
        // Close dropdown when clicking outside
        document.addEventListener('click', function closeDropdown(e) {
            if (!dropdown.contains(e.target) && !userMenu.contains(e.target)) {
                dropdown.remove();
                document.removeEventListener('click', closeDropdown);
            }
        });
    });

    // Chat actions functionality
    chatActions.forEach(button => {
        button.addEventListener('click', () => {
            const action = button.title.toLowerCase();
            switch(action) {
                case 'search':
                    showSearchBar();
                    break;
                case 'more options':
                    showMoreOptions(button);
                    break;
            }
        });
    });

    // Helper functions
    function loadChatHistory(chatTitle) {
        // Simulate loading chat history
        messagesContainer.innerHTML = `<div class="message received">Welcome to ${chatTitle}!</div>`;
    }

    function filterChats(filter) {
        const historyItems = document.querySelectorAll('.history-item');
        historyItems.forEach(item => {
            if (filter === 'starred') {
                item.style.display = item.classList.contains('pinned') ? 'flex' : 'none';
            } else if (filter === 'archived') {
                // Implement archived logic
                item.style.display = 'none';
            }
        });
    }

    function showAllChats() {
        const historyItems = document.querySelectorAll('.history-item');
        historyItems.forEach(item => item.style.display = 'flex');
    }

    function showSettings() {
        alert('Settings panel will be implemented soon!');
    }

    function showSearchBar() {
        const header = document.querySelector('.chat-header');
        const searchBar = document.createElement('div');
        searchBar.className = 'search-bar';
        searchBar.innerHTML = `
            <input type="text" placeholder="Search messages...">
            <button><i class="fas fa-times"></i></button>
        `;
        
        header.querySelector('h2').style.display = 'none';
        header.insertBefore(searchBar, header.firstChild);
        
        searchBar.querySelector('input').focus();
        
        searchBar.querySelector('button').addEventListener('click', () => {
            searchBar.remove();
            header.querySelector('h2').style.display = 'block';
        });
    }

    function showMoreOptions(button) {
        const menu = document.createElement('div');
        menu.className = 'more-options-menu';
        menu.innerHTML = `
            <div class="menu-item"><i class="fas fa-user-plus"></i> Add Participant</div>
            <div class="menu-item"><i class="fas fa-video"></i> Start Video Call</div>
            <div class="menu-item"><i class="fas fa-phone"></i> Start Voice Call</div>
            <div class="menu-item"><i class="fas fa-file"></i> Share File</div>
            <div class="menu-item"><i class="fas fa-ban"></i> Block User</div>
        `;
        
        const rect = button.getBoundingClientRect();
        menu.style.position = 'absolute';
        menu.style.top = `${rect.bottom + 5}px`;
        menu.style.right = `${window.innerWidth - rect.right}px`;
        
        document.querySelectorAll('.more-options-menu').forEach(m => m.remove());
        document.body.appendChild(menu);
        
        document.addEventListener('click', function closeMenu(e) {
            if (!menu.contains(e.target) && !button.contains(e.target)) {
                menu.remove();
                document.removeEventListener('click', closeMenu);
            }
        });
    }

    // Theme and Settings Management
    const themeToggle = document.getElementById('theme-toggle');
    const settingsPanel = document.querySelector('.settings-panel');
    const settingsClose = document.querySelector('.settings-close');
    const settingsForm = document.querySelector('.settings-form');
    const settingsButton = document.querySelector('.settings-btn');

    // Load saved theme preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
        themeToggle.checked = true;
    }
    
    // Load saved user settings
    const displayName = localStorage.getItem('displayName');
    const email = localStorage.getItem('email');
    
    if (displayName) {
        document.getElementById('display-name').value = displayName;
    }
    if (email) {
        document.getElementById('email').value = email;
    }

    // Theme toggle functionality
    themeToggle.addEventListener('change', () => {
        if (themeToggle.checked) {
            document.documentElement.setAttribute('data-theme', 'dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.setAttribute('data-theme', 'light');
            localStorage.setItem('theme', 'light');
        }
    });

    // Settings panel toggle
    settingsButton.addEventListener('click', () => {
        settingsPanel.classList.add('active');
        userMenu.classList.remove('active');
    });

    settingsClose.addEventListener('click', () => {
        settingsPanel.classList.remove('active');
    });

    // Save settings
    settingsForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const displayName = document.getElementById('display-name').value;
        const email = document.getElementById('email').value;
        
        // Save to localStorage
        localStorage.setItem('displayName', displayName);
        localStorage.setItem('email', email);
        
        // Update UI
        const userNameElement = document.querySelector('.user-name');
        if (userNameElement && displayName) {
            userNameElement.textContent = displayName;
        }
        
        // Show success message
        const successMessage = document.createElement('div');
        successMessage.className = 'success-message';
        successMessage.textContent = 'Settings saved successfully!';
        settingsForm.appendChild(successMessage);
        
        // Remove success message after 3 seconds
        setTimeout(() => {
            successMessage.remove();
        }, 3000);
    });

    // Close settings panel when clicking outside
    document.addEventListener('click', (e) => {
        if (!settingsPanel.contains(e.target) && 
            !settingsButton.contains(e.target) && 
            settingsPanel.classList.contains('active')) {
            settingsPanel.classList.remove('active');
        }
    });

    // Add some initial messages
    setTimeout(() => {
        sendMessage('Hello! Welcome to the chat application!');
    }, 500);
});
