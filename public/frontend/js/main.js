// Frontend JavaScript for Green Coins Platform
// Updated with proper API integration and authentication

class GreenCoinsApp {
    constructor() {
        this.API_BASE_URL = 'http://localhost:5000/api'; // Change this for production
        this.token = localStorage.getItem('greenCoinsToken');
        this.user = null;
        this.init();
    }

    init() {
        this.checkAuth();
        this.bindEvents();
        this.loadDashboardData();
        this.startActivityFeed();
        this.updateStats();
    }

    // Authentication Methods
    async checkAuth() {
        const token = localStorage.getItem('greenCoinsToken');
        if (token) {
            try {
                const response = await fetch(`${this.API_BASE_URL}/users/profile`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });

                if (response.ok) {
                    this.user = await response.json();
                    this.updateUIForLoggedInUser();
                } else {
                    this.logout();
                }
            } catch (error) {
                console.error('Auth check failed:', error);
                this.logout();
            }
        } else {
            this.updateUIForGuestUser();
        }
    }

    async login(email, password) {
        try {
            const response = await fetch(`${this.API_BASE_URL}/users/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();

            if (response.ok) {
                localStorage.setItem('greenCoinsToken', data.token);
                this.user = data.user;
                this.updateUIForLoggedInUser();
                this.hideAuthModal();
                this.showMessage('Login successful!', 'success');
                this.loadDashboardData();
            } else {
                this.showMessage(data.message || 'Login failed', 'error');
            }
        } catch (error) {
            console.error('Login error:', error);
            this.showMessage('Login failed. Please try again.', 'error');
        }
    }

    async register(username, email, password) {
        try {
            const response = await fetch(`${this.API_BASE_URL}/users/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, email, password })
            });

            const data = await response.json();

            if (response.ok) {
                localStorage.setItem('greenCoinsToken', data.token);
                this.user = data.user;
                this.updateUIForLoggedInUser();
                this.hideAuthModal();
                this.showMessage('Registration successful!', 'success');
                this.loadDashboardData();
            } else {
                this.showMessage(data.message || 'Registration failed', 'error');
            }
        } catch (error) {
            console.error('Registration error:', error);
            this.showMessage('Registration failed. Please try again.', 'error');
        }
    }

    logout() {
        localStorage.removeItem('greenCoinsToken');
        this.user = null;
        this.updateUIForGuestUser();
        this.showMessage('Logged out successfully', 'success');
    }

    // UI Update Methods
    updateUIForLoggedInUser() {
        const authButton = document.getElementById('auth-button');
        const navCoins = document.getElementById('nav-coins');
        
        if (authButton) {
            authButton.textContent = 'Sign Out';
            authButton.onclick = () => this.logout();
        }

        if (navCoins && this.user) {
            navCoins.textContent = this.user.coins || 0;
        }

        // Update wallet balance
        const walletBalance = document.getElementById('wallet-balance');
        if (walletBalance && this.user) {
            walletBalance.textContent = this.user.coins || 0;
        }

        // Update user stats
        this.updateUserStats();
    }

    updateUIForGuestUser() {
        const authButton = document.getElementById('auth-button');
        const navCoins = document.getElementById('nav-coins');
        
        if (authButton) {
            authButton.textContent = 'Sign In';
            authButton.onclick = () => this.showAuthModal();
        }

        if (navCoins) {
            navCoins.textContent = '---';
        }

        // Set default values for guest users
        const walletBalance = document.getElementById('wallet-balance');
        if (walletBalance) {
            walletBalance.textContent = '---';
        }
    }

    updateUserStats() {
        if (!this.user) return;

        // Update various user stats
        const statsMap = {
            'earned-today': this.user.earnedToday || 0,
            'level': this.user.level || 1,
            'badges': this.user.badges?.length || 0,
            'rank': this.user.rank || '---'
        };

        Object.entries(statsMap).forEach(([id, value]) => {
            const element = document.getElementById(id);
            if (element) element.textContent = value;
        });
    }

    // Dashboard Data Loading
    async loadDashboardData() {
        try {
            // Load user-specific data if logged in
            if (this.user) {
                await this.loadUserDashboard();
            }
            
            // Load public data
            await this.loadPublicStats();
        } catch (error) {
            console.error('Failed to load dashboard data:', error);
        }
    }

    async loadUserDashboard() {
        if (!this.token) return;

        try {
            const response = await fetch(`${this.API_BASE_URL}/users/dashboard`, {
                headers: {
                    'Authorization': `Bearer ${this.token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                const dashboardData = await response.json();
                this.updateDashboardUI(dashboardData);
            }
        } catch (error) {
            console.error('Failed to load user dashboard:', error);
        }
    }

    async loadPublicStats() {
        try {
            // For now, we'll use mock data since we don't have these endpoints yet
            // You can replace this with actual API calls later
            const mockStats = {
                activeUsers: '10,234',
                devicesRecycled: '52,156',
                co2Saved: '2.7',
                coinsEarned: '2.1M'
            };

            this.updatePublicStats(mockStats);
        } catch (error) {
            console.error('Failed to load public stats:', error);
        }
    }

    updateDashboardUI(data) {
        // Update dashboard with user-specific data
        const updates = {
            'wallet-balance': data.totalCoins || 0,
            'earned-today': data.earnedToday || 0,
            'level': data.level || 1,
            'badges': data.badgeCount || 0,
            'rank': data.globalRank || '---'
        };

        Object.entries(updates).forEach(([id, value]) => {
            const element = document.getElementById(id);
            if (element) element.textContent = value;
        });
    }

    updatePublicStats(stats) {
        const updates = {
            'active-users': stats.activeUsers,
            'devices-recycled': stats.devicesRecycled,
            'co2-saved': stats.co2Saved,
            'coins-earned': stats.coinsEarned,
            'total-co2': stats.co2Saved + ' Tons',
            'total-devices': stats.devicesRecycled,
            'total-warriors': stats.activeUsers
        };

        Object.entries(updates).forEach(([id, value]) => {
            const element = document.getElementById(id);
            if (element) element.textContent = value;
        });
    }

    // Activity Feed
    startActivityFeed() {
        this.loadActivityFeed();
        // Refresh activity feed every 30 seconds
        setInterval(() => this.loadActivityFeed(), 30000);
    }

    async loadActivityFeed() {
        try {
            // Mock activity data for now
            const mockActivities = [
                {
                    user: 'EcoWarrior23',
                    action: 'recycled a smartphone',
                    coins: 45,
                    time: '2 minutes ago',
                    icon: 'fas fa-mobile-alt'
                },
                {
                    user: 'GreenGuru',
                    action: 'redeemed Netflix subscription',
                    coins: -500,
                    time: '5 minutes ago',
                    icon: 'fas fa-tv'
                },
                {
                    user: 'RecycleKing',
                    action: 'recycled a laptop',
                    coins: 120,
                    time: '8 minutes ago',
                    icon: 'fas fa-laptop'
                },
                {
                    user: 'EcoChampion',
                    action: 'earned level up badge',
                    coins: 0,
                    time: '12 minutes ago',
                    icon: 'fas fa-trophy'
                },
                {
                    user: 'GreenSaver',
                    action: 'recycled earphones',
                    coins: 25,
                    time: '15 minutes ago',
                    icon: 'fas fa-headphones'
                }
            ];

            this.renderActivityFeed(mockActivities);
        } catch (error) {
            console.error('Failed to load activity feed:', error);
        }
    }

    renderActivityFeed(activities) {
        const feedContainer = document.getElementById('activity-feed');
        if (!feedContainer) return;

        feedContainer.innerHTML = activities.map(activity => `
            <div class="flex items-center justify-between p-3 bg-white rounded-lg hover:shadow-md transition-all duration-300 animate-fade-in-up">
                <div class="flex items-center space-x-3">
                    <div class="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                        <i class="${activity.icon} text-green-600 text-sm"></i>
                    </div>
                    <div>
                        <div class="text-sm font-medium text-gray-800">
                            <span class="text-green-600">${activity.user}</span> ${activity.action}
                        </div>
                        <div class="text-xs text-gray-500">${activity.time}</div>
                    </div>
                </div>
                <div class="text-right">
                    ${activity.coins !== 0 ? `
                        <div class="text-sm font-bold ${activity.coins > 0 ? 'text-green-600' : 'text-red-500'}">
                            ${activity.coins > 0 ? '+' : ''}${activity.coins} coins
                        </div>
                    ` : ''}
                </div>
            </div>
        `).join('');
    }

    // Event Binding
    bindEvents() {
        // Auth modal events
        const authButton = document.getElementById('auth-button');
        if (authButton) {
            authButton.addEventListener('click', () => {
                if (this.user) {
                    this.logout();
                } else {
                    this.showAuthModal();
                }
            });
        }

        // Start earning button
        const startEarningBtn = document.getElementById('startEarningBtn');
        if (startEarningBtn) {
            startEarningBtn.addEventListener('click', () => {
                if (this.user) {
                    window.location.href = 'scanner.html';
                } else {
                    this.showAuthModal();
                }
            });
        }

        // Auth form events
        this.bindAuthFormEvents();

        // Wallet balance click for refresh
        const walletBalance = document.getElementById('wallet-balance');
        if (walletBalance) {
            walletBalance.addEventListener('click', () => this.loadDashboardData());
        }
    }

    bindAuthFormEvents() {
        // Sign in form
        const signinForm = document.getElementById('signin-form');
        if (signinForm) {
            signinForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                const email = document.getElementById('signin-email').value;
                const password = document.getElementById('signin-password').value;
                await this.login(email, password);
            });
        }

        // Sign up form
        const signupForm = document.getElementById('signup-form');
        if (signupForm) {
            signupForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                const username = document.getElementById('signup-username').value;
                const email = document.getElementById('signup-email').value;
                const password = document.getElementById('signup-password').value;
                await this.register(username, email, password);
            });
        }

        // Auth switch button
        const authSwitchBtn = document.getElementById('auth-switch-btn');
        if (authSwitchBtn) {
            authSwitchBtn.addEventListener('click', () => this.toggleAuthMode());
        }
    }

    // Modal Methods
    showAuthModal() {
        const modal = document.getElementById('auth-modal');
        if (modal) {
            modal.classList.remove('hidden');
        }
    }

    hideAuthModal() {
        const modal = document.getElementById('auth-modal');
        if (modal) {
            modal.classList.add('hidden');
        }
    }

    toggleAuthMode() {
        const signinForm = document.getElementById('signin-form');
        const signupForm = document.getElementById('signup-form');
        const authTitle = document.getElementById('auth-title');
        const authSwitchText = document.getElementById('auth-switch-text');
        const authSwitchBtn = document.getElementById('auth-switch-btn');

        const isSigninMode = !signinForm.classList.contains('hidden');

        if (isSigninMode) {
            // Switch to signup mode
            signinForm.classList.add('hidden');
            signupForm.classList.remove('hidden');
            authTitle.textContent = 'Create Account';
            authSwitchText.textContent = 'Already have an account? ';
            authSwitchBtn.textContent = 'Sign In';
        } else {
            // Switch to signin mode
            signupForm.classList.add('hidden');
            signinForm.classList.remove('hidden');
            authTitle.textContent = 'Sign In';
            authSwitchText.textContent = 'New user? ';
            authSwitchBtn.textContent = 'Create Account';
        }

        // Clear any previous messages
        this.clearAuthMessage();
    }

    // Utility Methods
    showMessage(message, type = 'info') {
        const authMessage = document.getElementById('auth-message');
        if (authMessage) {
            authMessage.textContent = message;
            authMessage.className = `text-center mt-4 text-sm ${
                type === 'error' ? 'text-red-500' : 
                type === 'success' ? 'text-green-500' : 
                'text-blue-500'
            }`;
        }

        // Also show a toast notification if you want
        this.showToast(message, type);
    }

    showToast(message, type = 'info') {
        // Create a simple toast notification
        const toast = document.createElement('div');
        toast.className = `fixed top-20 right-4 z-50 p-4 rounded-lg text-white max-w-sm shadow-lg transform translate-x-full transition-transform duration-300 ${
            type === 'error' ? 'bg-red-500' : 
            type === 'success' ? 'bg-green-500' : 
            'bg-blue-500'
        }`;
        toast.textContent = message;

        document.body.appendChild(toast);

        // Animate in
        setTimeout(() => {
            toast.classList.remove('translate-x-full');
        }, 100);

        // Remove after 3 seconds
        setTimeout(() => {
            toast.classList.add('translate-x-full');
            setTimeout(() => {
                document.body.removeChild(toast);
            }, 300);
        }, 3000);
    }

    clearAuthMessage() {
        const authMessage = document.getElementById('auth-message');
        if (authMessage) {
            authMessage.textContent = '';
        }
    }

    updateStats() {
        // Animate counters
        this.animateCounter('active-users', 10234);
        this.animateCounter('devices-recycled', 52156);
        this.animateCounter('coins-earned', 2100000);
    }

    animateCounter(elementId, targetValue) {
        const element = document.getElementById(elementId);
        if (!element) return;

        const duration = 2000; // 2 seconds
        const steps = 60;
        const increment = targetValue / steps;
        let current = 0;
        let step = 0;

        const timer = setInterval(() => {
            step++;
            current += increment;
            
            if (step >= steps) {
                current = targetValue;
                clearInterval(timer);
            }

            // Format the number
            if (targetValue >= 1000000) {
                element.textContent = (current / 1000000).toFixed(1) + 'M+';
            } else if (targetValue >= 1000) {
                element.textContent = Math.floor(current / 1000) + 'K+';
            } else {
                element.textContent = Math.floor(current).toLocaleString();
            }
        }, duration / steps);
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.greenCoinsApp = new GreenCoinsApp();
});

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = GreenCoinsApp;
}