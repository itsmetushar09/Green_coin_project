// main.js - FINAL CORRECTED VERSION

const API_BASE_URL = 'http://localhost:5000/api/users'; // Ensure this matches your backend URL

class GreenCoinsApp {
    constructor() {
        // --- AUTH/STATE DATA ---
        this.userData = null; 
        this.isScanning = false;

        // --- DOM REFERENCES (Will be populated in init()) ---
        this.authButton = null;
        this.authModal = null;
        this.authSwitchBtn = null;
        this.signInForm = null;
        this.signUpForm = null;
    }

    init() {
        // --- GET ALL ELEMENTS NOW (THE FAIL-SAFE LOCATION) ---
        this.authButton = document.getElementById('auth-button');
        this.authModal = document.getElementById('auth-modal');
        this.authSwitchBtn = document.getElementById('auth-switch-btn');
        this.signInForm = document.getElementById('signin-form');
        this.signUpForm = document.getElementById('signup-form');

        // Check if critical elements were found before proceeding
        if (!this.authButton || !this.authModal || !this.signInForm || !this.signUpForm) {
            console.error("CRITICAL ERROR: Main auth elements not found. Check HTML IDs.");
            return;
        }

        this.setupAuthUI();
        this.checkAuthStatus(); 
        this.setupEventListeners();
        this.startRealTimeUpdates();
        this.initializeCharts();
        this.populateActivityFeed();
        this.initAIScanner();
        this.setupIntersectionObserver();
        this.initSmoothScrolling();
    }

    // --- AUTHENTICATION & DYNAMIC DATA FUNCTIONS ---

    setupAuthUI() {
        // 1. Navbar Sign-In Button Click Handler (Opens Modal or Signs Out)
        this.authButton.addEventListener('click', () => {
             if (this.userData) {
                this.handleSignOut();
            } else {
                this.authModal.classList.remove('hidden');
            }
        });
        document.getElementById("startEarningBtn").addEventListener("click", function() {
    window.location.href = "./scanner.html"; // Replace with your target URL
});


        // 2. Toggle Forms Handler (for the text button inside the modal)
        this.authSwitchBtn.addEventListener('click', this.toggleAuthForms.bind(this));

        // 3. Form Submission Listeners (Attach to the forms themselves)
        this.signInForm.addEventListener('submit', (e) => this.handleAuth(e, 'signin'));
        this.signUpForm.addEventListener('submit', (e) => this.handleAuth(e, 'signup'));
    }

    toggleAuthForms() {
        const isSigningIn = this.signInForm.classList.contains('hidden');
        this.signInForm.classList.toggle('hidden');
        this.signUpForm.classList.toggle('hidden');
        document.getElementById('auth-title').textContent = isSigningIn ? 'Sign Up' : 'Sign In';
        document.getElementById('auth-switch-text').textContent = isSigningIn ? 'Already have an account? ' : 'New user? ';
        this.authSwitchBtn.textContent = isSigningIn ? 'Sign In' : 'Create Account';
        document.getElementById('auth-message').textContent = ''; 
    }

    async handleAuth(event, endpoint) {
        event.preventDefault();
        const isSignUp = endpoint === 'signup';
        const form = isSignUp ? this.signUpForm : this.signInForm;

        // --- Fetch Base Credentials ---
        const email = form.querySelector(`#${isSignUp ? 'signup-email' : 'signin-email'}`).value;
        const password = form.querySelector(`#${isSignUp ? 'signup-password' : 'signin-password'}`).value;

        // --- Conditional Payload Fix ---
        let requestBody = { email, password };
        if (isSignUp) {
            // Only add username to the payload if we are signing up
            requestBody.username = form.querySelector(`#signup-username`).value;
        }

        document.getElementById('auth-message').textContent = 'Processing...';

        try {
            const response = await fetch(`${API_BASE_URL}/${endpoint}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(requestBody), // Use the conditional payload
            });

            const data = await response.json();

            if (response.ok) {
                localStorage.setItem('userToken', data.token);
                this.authModal.classList.add('hidden');
                this.showNotification(data.message, 'success');
                this.fetchProfile();
            } else {
                // Display the error message returned from the backend (e.g., "User already exists")
                document.getElementById('auth-message').textContent = data.message || 'Authentication failed.';
            }
        } catch (error) {
            document.getElementById('auth-message').textContent = 'Network error. Check server status.';
            console.error('Auth Error:', error);
        }
    }

    handleSignOut() {
        localStorage.removeItem('userToken');
        this.userData = null;
        this.updateUI(null, false);
        this.showNotification('Signed out successfully.', 'info');
        window.location.reload(); 
    }

    checkAuthStatus() {
        const token = localStorage.getItem('userToken');
        if (token) {
            this.fetchProfile();
        } else {
            this.updateUI(null, false);
        }
    }

    async fetchProfile() {
        const token = localStorage.getItem('userToken');
        if (!token) return this.updateUI(null, false);

        try {
            const response = await fetch(`${API_BASE_URL}/profile`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (response.ok) {
                const user = await response.json();
                this.userData = user;
                this.updateUI(user, true);
            } else {
                this.handleSignOut();
            }
        } catch (error) {
            console.error('Error fetching profile:', error);
            this.handleSignOut();
        }
    }
    
    updateUI(user, loggedIn) {
        const coinBalance = user ? user.greenCoins.toLocaleString() : '---';
        
        document.getElementById('nav-coins').textContent = coinBalance;
        this.authButton.textContent = loggedIn ? 'Sign Out' : 'Sign In';

        const walletBalance = document.getElementById('wallet-balance');
        const walletContainer = document.querySelector('.hover-scale');

        if (walletBalance && walletContainer) {
            if (loggedIn) {
                // Populate dynamic data
                walletBalance.textContent = user.greenCoins.toLocaleString();
                document.getElementById('earned-today').textContent = user.earnedToday.toLocaleString();
                document.getElementById('level').textContent = user.level.toLocaleString();
                document.getElementById('badges').textContent = user.badges.toLocaleString();
                document.getElementById('rank').textContent = user.globalRank.toLocaleString();
                
                walletContainer.classList.remove('opacity-50', 'blur-sm');
                walletContainer.title = '';
            } else {
                // Reset/Hide dynamic data
                walletBalance.textContent = '---';
                document.getElementById('earned-today').textContent = '---';
                document.getElementById('level').textContent = '---';
                document.getElementById('badges').textContent = '---';
                document.getElementById('rank').textContent = '---';
                
                walletContainer.classList.add('opacity-50', 'blur-sm');
                walletContainer.title = 'Sign In to view your wallet.';
            }
        }
    }

    // --- EXISTING FRONTEND FUNCTIONS (Other features) ---
    setupEventListeners() { 
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(anchor.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth' });
                }
            });
        });

        const uploadArea = document.getElementById('upload-area');
        const fileInput = document.getElementById('device-upload');
        
        if (uploadArea && fileInput) {
            uploadArea.addEventListener('click', () => fileInput.click());
            fileInput.addEventListener('change', (e) => this.handleFileUpload(e));
        }

        const walletBalance = document.getElementById('wallet-balance');
        if (walletBalance) {
            walletBalance.addEventListener('click', () => {
                if (this.userData) {
                    this.animateCoins();
                    this.showNotification('💰 Green Coins balance updated!', 'success');
                } else {
                    this.authModal.classList.remove('hidden');
                    this.showNotification('Please sign in to collect coins!', 'warning');
                }
            });
        }

        document.querySelectorAll('.reward-card').forEach(card => {
            card.addEventListener('click', (e) => {
                this.handleRewardClick(e.currentTarget);
            });
        });

        document.querySelectorAll('.badge-shine').forEach(badge => {
            badge.addEventListener('mouseenter', () => {
                this.playBadgeAnimation(badge);
            });
        });

        this.setupCommunityInteractions();
    }

    handleFileUpload(event) {
        const file = event.target.files[0];
        if (!file) return;
        this.showAIAnalysis(file);
    }

    showAIAnalysis(file) {
        this.isScanning = true;
        const uploadArea = document.getElementById('upload-area');
        const resultsDiv = document.getElementById('analysis-results');
        
        uploadArea.innerHTML = `<div class="loading-spinner mx-auto mb-4"></div><p class="text-gray-600 mb-2">Analyzing device...</p><p class="text-sm text-gray-500">AI is processing your image</p>`;

        setTimeout(() => {
            const deviceInfo = this.analyzeDevice(file.name);
            const deviceTypeEl = document.getElementById('device-type');
            const deviceValueEl = document.getElementById('device-value');

            if (deviceTypeEl) deviceTypeEl.textContent = deviceInfo.type;
            if (deviceValueEl) deviceValueEl.textContent = `~${deviceInfo.coins} coins`;
            
            if (resultsDiv) resultsDiv.classList.remove('hidden');
            
            uploadArea.innerHTML = `<i class="fas fa-check-circle text-4xl text-green-500 mb-4"></i><p class="text-green-600 mb-2">Analysis Complete!</p><p class="text-sm text-gray-500">Upload another device to analyze</p>`;
            
            this.isScanning = false;
            this.showNotification(`📱 Device identified: ${deviceInfo.type}`, 'success');
        }, 2000);
    }

    analyzeDevice(filename) {
        const devices = {
            'phone': { type: 'Smartphone', coins: 150, co2: 0.8 }, 'iphone': { type: 'iPhone', coins: 180, co2: 0.9 },
            'samsung': { type: 'Samsung Phone', coins: 165, co2: 0.85 }, 'laptop': { type: 'Laptop', coins: 300, co2: 2.1 },
            'macbook': { type: 'MacBook', coins: 350, co2: 2.3 }, 'tablet': { type: 'Tablet', coins: 200, co2: 1.2 },
            'ipad': { type: 'iPad', coins: 220, co2: 1.3 }, 'charger': { type: 'Phone Charger', coins: 50, co2: 0.3 },
            'cable': { type: 'USB Cable', coins: 30, co2: 0.2 }, 'watch': { type: 'Smartwatch', coins: 120, co2: 0.6 },
            'headphones': { type: 'Headphones', coins: 80, co2: 0.4 }
        };
        const lower = filename.toLowerCase();
        for (const [key, value] of Object.entries(devices)) {
            if (lower.includes(key)) return value;
        }
        return { type: 'Electronic Device', coins: 100, co2: 0.5 };
    }

    animateCoins() {
        const balance = document.getElementById('wallet-balance');
        if (!balance) return;
        balance.classList.add('coin-bounce');
        setTimeout(() => balance.classList.remove('coin-bounce'), 1000);
        const currentBalance = parseInt(balance.textContent.replace(/,/g, ''));
        const newBalance = currentBalance + Math.floor(Math.random() * 50) + 10;
        this.animateNumber(balance, currentBalance, newBalance, 1000);
    }

    animateNumber(element, start, end, duration) {
        const startTime = performance.now();
        const difference = end - start;
        const updateNumber = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const current = Math.floor(start + difference * this.easeOutCubic(progress));
            element.textContent = current.toLocaleString();
            if (progress < 1) requestAnimationFrame(updateNumber);
        };
        requestAnimationFrame(updateNumber);
    }

    easeOutCubic(t) { return 1 - Math.pow(1 - t, 3); }

    handleRewardClick(card) {
        const title = card.querySelector('h3').textContent;
        card.classList.add('animate-pulse-custom');
        setTimeout(() => { card.classList.remove('animate-pulse-custom'); this.showNotification(`🎁 Exploring ${title} rewards...`, 'info'); }, 500);
        this.showRewardModal(title);
    }

    showRewardModal(rewardType) {
        const modal = document.createElement('div');
        modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
        // ... (modal content setup) ...
        document.body.appendChild(modal);
        setTimeout(() => { modal.querySelector('.bg-white').style.transform = 'scale(1)'; }, 10);
        modal.addEventListener('click', (e) => { if (e.target === modal) modal.remove(); });
    }

    startRealTimeUpdates() {
        setInterval(() => { this.addActivityItem(); }, 5000);
        setInterval(() => { this.updateStats(); }, 10000);
        setInterval(() => { this.updateKioskStatus(); }, 15000);
    }

    addActivityItem() {
        const activities = [
            { user: 'Alex M.', action: 'recycled iPhone 12', time: '2 min ago', location: 'Delhi', coins: 150, type: 'recycle' },
            { user: 'Sarah K.', action: 'redeemed Netflix subscription', time: '5 min ago', location: 'Mumbai', coins: -500, type: 'redeem' },
            { user: 'Raj P.', action: 'recycled laptop charger', time: '8 min ago', location: 'Bangalore', coins: 75, type: 'recycle' },
            { user: 'Priya S.', action: 'earned Eco Warrior badge', time: '12 min ago', location: 'Pune', coins: 100, type: 'badge' },
            { user: 'Mike R.', action: 'recycled smartwatch', time: '15 min ago', location: 'Chennai', coins: 200, type: 'recycle' }
        ];
        const randomActivity = activities[Math.floor(Math.random() * activities.length)];
        this.displayActivityItem(randomActivity);
    }

    displayActivityItem(activity) {
        const feedContainer = document.getElementById('activity-feed');
        if (!feedContainer) return;
        const item = document.createElement('div');
        item.className = 'activity-item flex items-center justify-between p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow';
        const iconColor = { 'recycle': 'bg-green-100 text-green-600', 'redeem': 'bg-blue-100 text-blue-600', 'badge': 'bg-purple-100 text-purple-600' }[activity.type] || 'bg-gray-100 text-gray-600';
        const icon = { 'recycle': 'fas fa-recycle', 'redeem': 'fas fa-gift', 'badge': 'fas fa-medal' }[activity.type] || 'fas fa-circle';
        item.innerHTML = `<div class="flex items-center"><div class="w-10 h-10 ${iconColor} rounded-full flex items-center justify-center mr-3"><i class="${icon}"></i></div><div><div class="font-semibold text-gray-800">${activity.user}</div><div class="text-sm text-gray-600">${activity.action}</div><div class="text-xs text-gray-500">${activity.time} • ${activity.location}</div></div></div><div class="text-right"><div class="font-semibold ${activity.coins > 0 ? 'text-green-600' : 'text-blue-600'}">${activity.coins > 0 ? '+' : ''}${activity.coins} coins</div></div>`;
        feedContainer.insertBefore(item, feedContainer.firstChild);
        const items = feedContainer.children;
        if (items.length > 10) items[items.length - 1].remove();
    }

    populateActivityFeed() {
        const initialActivities = [
            { user: 'Alex M.', action: 'recycled iPhone 12', time: '2 min ago', location: 'Delhi', coins: 150, type: 'recycle' },
            { user: 'Sarah K.', action: 'redeemed Netflix subscription', time: '5 min ago', location: 'Mumbai', coins: -500, type: 'redeem' },
            { user: 'Raj P.', action: 'recycled laptop charger', time: '8 min ago', location: 'Bangalore', coins: 75, type: 'recycle' },
            { user: 'Priya S.', action: 'earned Eco Warrior badge', time: '12 min ago', location: 'Pune', coins: 100, type: 'badge' },
            { user: 'Mike R.', action: 'recycled smartwatch', time: '15 min ago', location: 'Chennai', coins: 200, type: 'recycle' }
        ];
        initialActivities.forEach(activity => { this.displayActivityItem(activity); });
    }

    setupCommunityInteractions() { /* ... */ }
    updateStats() { /* ... */ }
    updateKioskStatus() { /* ... */ }
    initializeCharts() { /* ... */ }
    createImpactChart() { /* ... */ }
    createNetworkChart() { /* ... */ }
    setupIntersectionObserver() { /* ... */ }
    initSmoothScrolling() { /* ... */ }
    initAIScanner() { /* ... */ }
    showNotification(message, type = 'info') { 
        const notification = document.createElement('div');
        notification.className = `notification ${type}-state`;
        notification.innerHTML = `<div class="flex items-center"><span class="mr-2">${message}</span><button onclick="this.parentElement.parentElement.remove()" class="ml-auto text-white hover:text-gray-200"><i class="fas fa-times"></i></button></div>`;
        document.body.appendChild(notification);
        setTimeout(() => notification.classList.add('show'), 10);
        setTimeout(() => { notification.classList.remove('show'); setTimeout(() => notification.remove(), 300); }, 4000);
    }
    playBadgeAnimation(badge) { /* ... */ }
    formatNumber(num) { /* ... */ }
    debounce(func, wait) { /* ... */ }
}

// Initialize app when DOM is loaded (the standard way)
document.addEventListener('DOMContentLoaded', () => {
    const app = new GreenCoinsApp();
    app.init(); 
    window.greenCoinsApp = app;
    console.log('🌱 Green Coins Platform loaded successfully!');
});