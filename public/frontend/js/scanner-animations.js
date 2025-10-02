class DeviceScanner {
    constructor() {
        this.API_BASE_URL = 'http://localhost:5000/api';
        this.token = localStorage.getItem('greenCoinsToken');
        this.currentScan = null;
        this.init();
    }

    init() {
        this.bindEvents();
        this.checkAuth();
        this.setupCamera();
    }

    checkAuth() {
        if (!this.token) {
            this.showAuthRequired();
            return false;
        }
        return true;
    }

    showAuthRequired() {
        const scanSection = document.getElementById('scanner-section');
        if (scanSection) {
            scanSection.innerHTML = `
                <div class="text-center py-12">
                    <div class="mb-6">
                        <i class="fas fa-lock text-6xl text-gray-400"></i>
                    </div>
                    <h3 class="text-2xl font-bold text-gray-800 mb-4">Authentication Required</h3>
                    <p class="text-gray-600 mb-6">Please sign in to use the AI device scanner.</p>
                    <a href="index.html" class="bg-green-primary text-white px-6 py-3 rounded-full font-semibold hover:bg-green-secondary transition-colors">
                        Go to Home Page
                    </a>
                </div>
            `;
        }
    }

    bindEvents() {
        // File upload
        const fileInput = document.getElementById('device-image-input');
        if (fileInput) {
            fileInput.addEventListener('change', (e) => this.handleFileUpload(e));
        }

        // Camera capture
        const captureBtn = document.getElementById('capture-photo');
        if (captureBtn) {
            captureBtn.addEventListener('click', () => this.capturePhoto());
        }

        // Scan button
        const scanBtn = document.getElementById('scan-device');
        if (scanBtn) {
            scanBtn.addEventListener('click', () => this.scanDevice());
        }

        // Recycle confirm button
        const recycleBtn = document.getElementById('confirm-recycle');
        if (recycleBtn) {
            recycleBtn.addEventListener('click', () => this.confirmRecycle());
        }

        // Upload area drag and drop
        const uploadArea = document.getElementById('upload-area');
        if (uploadArea) {
            uploadArea.addEventListener('dragover', (e) => {
                e.preventDefault();
                uploadArea.classList.add('border-green-primary', 'bg-green-50');
            });

            uploadArea.addEventListener('dragleave', (e) => {
                e.preventDefault();
                uploadArea.classList.remove('border-green-primary', 'bg-green-50');
            });

            uploadArea.addEventListener('drop', (e) => {
                e.preventDefault();
                uploadArea.classList.remove('border-green-primary', 'bg-green-50');
                
                const files = e.dataTransfer.files;
                if (files.length > 0) {
                    this.handleFileSelect(files[0]);
                }
            });

            uploadArea.addEventListener('click', () => {
                fileInput.click();
            });
        }
    }

    setupCamera() {
        const video = document.getElementById('camera-feed');
        const startCameraBtn = document.getElementById('start-camera');

        if (startCameraBtn) {
            startCameraBtn.addEventListener('click', async () => {
                try {
                    const stream = await navigator.mediaDevices.getUserMedia({ 
                        video: { facingMode: 'environment' } // Use back camera on mobile
                    });
                    
                    if (video) {
                        video.srcObject = stream;
                        video.style.display = 'block';
                        startCameraBtn.style.display = 'none';
                        
                        const captureBtn = document.getElementById('capture-photo');
                        if (captureBtn) {
                            captureBtn.style.display = 'block';
                        }
                    }
                } catch (error) {
                    console.error('Error accessing camera:', error);
                    this.showError('Unable to access camera. Please upload an image instead.');
                }
            });
        }
    }

    handleFileUpload(event) {
        const file = event.target.files[0];
        if (file) {
            this.handleFileSelect(file);
        }
    }

    handleFileSelect(file) {
        // Validate file type
        if (!file.type.startsWith('image/')) {
            this.showError('Please select an image file.');
            return;
        }

        // Validate file size (10MB limit)
        if (file.size > 10 * 1024 * 1024) {
            this.showError('Image size should be less than 10MB.');
            return;
        }

        // Display preview
        this.displayImagePreview(file);
        
        // Store file for scanning
        this.selectedFile = file;
        
        // Enable scan button
        const scanBtn = document.getElementById('scan-device');
        if (scanBtn) {
            scanBtn.disabled = false;
            scanBtn.classList.remove('opacity-50', 'cursor-not-allowed');
        }
    }

    displayImagePreview(file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            const previewContainer = document.getElementById('image-preview');
            if (previewContainer) {
                previewContainer.innerHTML = `
                    <div class="relative">
                        <img src="${e.target.result}" alt="Device preview" class="w-full h-64 object-cover rounded-lg">
                        <button onclick="this.clearPreview()" class="absolute top-2 right-2 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-red-600">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                `;
                previewContainer.classList.remove('hidden');
            }
        };
        reader.readAsDataURL(file);
    }

    clearPreview() {
        const previewContainer = document.getElementById('image-preview');
        if (previewContainer) {
            previewContainer.classList.add('hidden');
            previewContainer.innerHTML = '';
        }

        this.selectedFile = null;
        
        const scanBtn = document.getElementById('scan-device');
        if (scanBtn) {
            scanBtn.disabled = true;
            scanBtn.classList.add('opacity-50', 'cursor-not-allowed');
        }

        const fileInput = document.getElementById('device-image-input');
        if (fileInput) {
            fileInput.value = '';
        }
    }

    capturePhoto() {
        const video = document.getElementById('camera-feed');
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');

        if (video) {
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            context.drawImage(video, 0, 0);

            // Convert to blob
            canvas.toBlob((blob) => {
                const file = new File([blob], 'captured-device.jpg', { type: 'image/jpeg' });
                this.handleFileSelect(file);
                
                // Stop camera
                const stream = video.srcObject;
                const tracks = stream.getTracks();
                tracks.forEach(track => track.stop());
                video.style.display = 'none';
                
                const startCameraBtn = document.getElementById('start-camera');
                if (startCameraBtn) {
                    startCameraBtn.style.display = 'block';
                }
                
                const captureBtn = document.getElementById('capture-photo');
                if (captureBtn) {
                    captureBtn.style.display = 'none';
                }
            }, 'image/jpeg', 0.8);
        }
    }

    async scanDevice() {
        if (!this.checkAuth()) return;
        
        if (!this.selectedFile) {
            this.showError('Please select an image first.');
            return;
        }

        const scanBtn = document.getElementById('scan-device');
        const originalText = scanBtn ? scanBtn.textContent : '';
        
        try {
            // Update UI to show scanning
            if (scanBtn) {
                scanBtn.disabled = true;
                scanBtn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Scanning...';
            }

            this.showScanningProgress();

            // Create form data
            const formData = new FormData();
            formData.append('deviceImage', this.selectedFile);

            // Send to API
            const response = await fetch(`${this.API_BASE_URL}/devices/scan`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${this.token}`
                },
                body: formData
            });

            const data = await response.json();

            if (response.ok) {
                this.currentScan = data;
                this.displayScanResults(data);
            } else {
                this.showError(data.message || 'Failed to scan device');
            }

        } catch (error) {
            console.error('Scan error:', error);
            this.showError('Failed to scan device. Please try again.');
        } finally {
            if (scanBtn) {
                scanBtn.disabled = false;
                scanBtn.innerHTML = originalText;
            }
        }
    }

    showScanningProgress() {
        const resultsContainer = document.getElementById('scan-results');
        if (resultsContainer) {
            resultsContainer.innerHTML = `
                <div class="text-center py-8">
                    <div class="mb-4">
                        <i class="fas fa-robot text-4xl text-green-primary animate-pulse"></i>
                    </div>
                    <h3 class="text-xl font-bold text-gray-800 mb-2">AI Analyzing Your Device...</h3>
                    <div class="w-full bg-gray-200 rounded-full h-2 mb-4">
                        <div class="bg-green-primary h-2 rounded-full animate-pulse" style="width: 60%"></div>
                    </div>
                    <p class="text-gray-600">Please wait while we identify and evaluate your device</p>
                </div>
            `;
            resultsContainer.classList.remove('hidden');
        }
    }

    displayScanResults(data) {
        const resultsContainer = document.getElementById('scan-results');
        const { analysis, environmentalImpact } = data;

        if (resultsContainer) {
            resultsContainer.innerHTML = `
                <div class="bg-white rounded-xl p-6 shadow-lg">
                    <div class="text-center mb-6">
                        <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <i class="fas fa-${this.getDeviceIcon(analysis.deviceType)} text-2xl text-green-primary"></i>
                        </div>
                        <h3 class="text-2xl font-bold text-gray-800 mb-2">Device Identified!</h3>
                        <div class="flex items-center justify-center space-x-2 mb-4">
                            <span class="text-lg font-semibold text-green-primary">${this.formatDeviceType(analysis.deviceType)}</span>
                            <span class="text-gray-400">•</span>
                            <span class="text-lg font-semibold text-blue-primary">${this.formatCondition(analysis.condition)}</span>
                        </div>
                        <div class="flex items-center justify-center space-x-1 mb-4">
                            <span class="text-sm text-gray-600">Confidence:</span>
                            <div class="flex space-x-1">
                                ${this.renderConfidenceStars(analysis.confidence)}
                            </div>
                            <span class="text-sm font-medium text-gray-800">${Math.round(analysis.confidence * 100)}%</span>
                        </div>
                    </div>

                    <!-- Reward Information -->
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                        <div class="bg-green-50 rounded-lg p-4 text-center">
                            <div class="flex items-center justify-center mb-2">
                                <i class="fas fa-coins text-2xl text-green-primary mr-2"></i>
                                <span class="text-3xl font-bold text-green-primary">${analysis.coinsReward}</span>
                            </div>
                            <p class="text-sm text-gray-600">Green Coins Reward</p>
                        </div>
                        <div class="bg-blue-50 rounded-lg p-4 text-center">
                            <div class="flex items-center justify-center mb-2">
                                <i class="fas fa-dollar-sign text-2xl text-blue-primary mr-2"></i>
                                <span class="text-3xl font-bold text-blue-primary">$${analysis.estimatedValue}</span>
                            </div>
                            <p class="text-sm text-gray-600">Estimated Value</p>
                        </div>
                    </div>

                    <!-- Environmental Impact -->
                    <div class="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-4 mb-6">
                        <h4 class="font-bold text-gray-800 mb-3 flex items-center">
                            <i class="fas fa-leaf text-green-primary mr-2"></i>
                            Environmental Impact
                        </h4>
                        <div class="grid grid-cols-3 gap-4 text-center">
                            <div>
                                <div class="text-lg font-bold text-green-600">${environmentalImpact.co2Saved}kg</div>
                                <div class="text-xs text-gray-600">CO₂ Saved</div>
                            </div>
                            <div>
                                <div class="text-lg font-bold text-blue-600">${environmentalImpact.energySaved}kWh</div>
                                <div class="text-xs text-gray-600">Energy Saved</div>
                            </div>
                            <div>
                                <div class="text-lg font-bold text-purple-600">${environmentalImpact.wasteDiverted}kg</div>
                                <div class="text-xs text-gray-600">Waste Diverted</div>
                            </div>
                        </div>
                    </div>

                    <!-- Action Buttons -->
                    <div class="flex flex-col sm:flex-row gap-3">
                        <button id="confirm-recycle" class="flex-1 bg-gradient-to-r from-green-primary to-green-secondary text-white py-3 px-6 rounded-full font-semibold hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300">
                            <i class="fas fa-recycle mr-2"></i>
                            Confirm & Recycle Now
                        </button>
                        <button onclick="window.location.href='kiosks.html'" class="flex-1 border-2 border-green-primary text-green-primary py-3 px-6 rounded-full font-semibold hover:bg-green-primary hover:text-white transition-all duration-300">
                            <i class="fas fa-map-marker-alt mr-2"></i>
                            Find Nearest Kiosk
                        </button>
                    </div>
                </div>
            `;

            // Bind confirm recycle button
            const confirmBtn = document.getElementById('confirm-recycle');
            if (confirmBtn) {
                confirmBtn.addEventListener('click', () => this.confirmRecycle());
            }
        }
    }

    async confirmRecycle() {
        if (!this.checkAuth() || !this.currentScan) return;

        const confirmBtn = document.getElementById('confirm-recycle');
        const originalText = confirmBtn ? confirmBtn.innerHTML : '';

        try {
            if (confirmBtn) {
                confirmBtn.disabled = true;
                confirmBtn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Processing...';
            }

            const { analysis } = this.currentScan;
            
            const response = await fetch(`${this.API_BASE_URL}/devices/recycle`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${this.token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    deviceType: analysis.deviceType,
                    condition: analysis.condition,
                    estimatedValue: analysis.estimatedValue,
                    coinsReward: analysis.coinsReward,
                    location: 'User Scanner' // You can add location selection later
                })
            });

            const data = await response.json();

            if (response.ok) {
                this.showRecycleSuccess(data);
                this.updateUserStats(data.user);
            } else {
                this.showError(data.message || 'Failed to confirm recycling');
            }

        } catch (error) {
            console.error('Recycle error:', error);
            this.showError('Failed to confirm recycling. Please try again.');
        } finally {
            if (confirmBtn) {
                confirmBtn.disabled = false;
                confirmBtn.innerHTML = originalText;
            }
        }
    }

    showRecycleSuccess(data) {
        const resultsContainer = document.getElementById('scan-results');
        const { transaction, user, environmentalImpact } = data;

        if (resultsContainer) {
            resultsContainer.innerHTML = `
                <div class="bg-white rounded-xl p-6 shadow-lg text-center">
                    <div class="mb-6">
                        <div class="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
                            <i class="fas fa-check text-3xl text-green-primary"></i>
                        </div>
                        <h3 class="text-2xl font-bold text-gray-800 mb-2">🎉 Success!</h3>
                        <p class="text-green-600 font-semibold text-lg">You earned ${transaction.coinsEarned} Green Coins!</p>
                    </div>

                    <!-- Updated Stats -->
                    <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                        <div class="bg-green-50 rounded-lg p-3">
                            <div class="text-2xl font-bold text-green-primary">${user.coins}</div>
                            <div class="text-xs text-gray-600">Total Coins</div>
                        </div>
                        <div class="bg-blue-50 rounded-lg p-3">
                            <div class="text-2xl font-bold text-blue-primary">${user.level}</div>
                            <div class="text-xs text-gray-600">Level</div>
                        </div>
                        <div class="bg-purple-50 rounded-lg p-3">
                            <div class="text-2xl font-bold text-purple-primary">${user.devicesRecycled}</div>
                            <div class="text-xs text-gray-600">Devices</div>
                        </div>
                        <div class="bg-orange-50 rounded-lg p-3">
                            <div class="text-2xl font-bold text-orange-500">${user.badges.length}</div>
                            <div class="text-xs text-gray-600">Badges</div>
                        </div>
                    </div>

                    <!-- Environmental Impact -->
                    <div class="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-4 mb-6">
                        <h4 class="font-bold text-gray-800 mb-3">🌱 Your Environmental Contribution</h4>
                        <div class="grid grid-cols-3 gap-4 text-center text-sm">
                            <div>
                                <div class="font-bold text-green-600">${environmentalImpact.co2Saved}kg CO₂</div>
                                <div class="text-gray-600">Prevented</div>
                            </div>
                            <div>
                                <div class="font-bold text-blue-600">${environmentalImpact.energySaved}kWh</div>
                                <div class="text-gray-600">Energy Saved</div>
                            </div>
                            <div>
                                <div class="font-bold text-purple-600">${environmentalImpact.wasteDiverted}kg</div>
                                <div class="text-gray-600">Waste Diverted</div>
                            </div>
                        </div>
                    </div>

                    <!-- Action Buttons -->
                    <div class="flex flex-col sm:flex-row gap-3">
                        <button onclick="window.location.reload()" class="flex-1 bg-gradient-to-r from-green-primary to-green-secondary text-white py-3 px-6 rounded-full font-semibold">
                            <i class="fas fa-camera mr-2"></i>
                            Scan Another Device
                        </button>
                        <button onclick="window.location.href='rewards.html'" class="flex-1 border-2 border-green-primary text-green-primary py-3 px-6 rounded-full font-semibold hover:bg-green-primary hover:text-white transition-all duration-300">
                            <i class="fas fa-gift mr-2"></i>
                            View Rewards
                        </button>
                    </div>
                </div>
            `;
        }

        // Show celebration animation
        this.showCelebration();
    }

    showCelebration() {
        // Create confetti or celebration effect
        const celebration = document.createElement('div');
        celebration.className = 'fixed inset-0 pointer-events-none z-50';
        celebration.innerHTML = `
            <div class="absolute inset-0 flex items-center justify-center">
                <div class="text-6xl animate-bounce">🎉</div>
            </div>
        `;
        document.body.appendChild(celebration);

        setTimeout(() => {
            document.body.removeChild(celebration);
        }, 3000);
    }

    updateUserStats(user) {
        // Update navigation coins
        const navCoins = document.getElementById('nav-coins');
        if (navCoins) {
            navCoins.textContent = user.coins;
        }
    }

    // Helper methods
    getDeviceIcon(deviceType) {
        const icons = {
            smartphone: 'mobile-alt',
            laptop: 'laptop',
            tablet: 'tablet-alt',
            charger: 'plug',
            headphones: 'headphones',
            earphones: 'headphones',
            smartwatch: 'clock',
            camera: 'camera',
            mouse: 'mouse',
            keyboard: 'keyboard',
            router: 'wifi',
            speaker: 'volume-up'
        };
        return icons[deviceType] || 'microchip';
    }

    formatDeviceType(type) {
        return type.charAt(0).toUpperCase() + type.slice(1).replace(/([A-Z])/g, ' $1');
    }

    formatCondition(condition) {
        const conditions = {
            excellent: 'Excellent',
            good: 'Good',
            fair: 'Fair',
            poor: 'Poor'
        };
        return conditions[condition] || condition;
    }

    renderConfidenceStars(confidence) {
        const stars = 5;
        const filled = Math.round(confidence * stars);
        let html = '';
        
        for (let i = 0; i < stars; i++) {
            if (i < filled) {
                html += '<i class="fas fa-star text-yellow-400"></i>';
            } else {
                html += '<i class="far fa-star text-gray-300"></i>';
            }
        }
        
        return html;
    }

    showError(message) {
        const errorContainer = document.getElementById('error-message');
        if (errorContainer) {
            errorContainer.textContent = message;
            errorContainer.classList.remove('hidden');
            
            setTimeout(() => {
                errorContainer.classList.add('hidden');
            }, 5000);
        } else {
            alert(message);
        }
    }
}

// Initialize scanner when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.deviceScanner = new DeviceScanner();
});