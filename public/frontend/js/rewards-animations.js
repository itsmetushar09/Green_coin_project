// Enhanced Three.js Animations for Rewards Page

class RewardsAnimations {
    constructor() {
        this.scenes = {};
        this.renderers = {};
        this.cameras = {};
        this.animationIds = {};
        
        this.init();
    }

    init() {
        document.addEventListener('DOMContentLoaded', () => {
            this.createRewardsHero();
            this.createRewardCards();
            this.createParticleBackground();
            this.setupCategoryFiltering();
            this.setupRewardInteractions();
        });
    }

    createRewardsHero() {
        const container = document.getElementById('rewards-hero-3d');
        if (!container) return;

        // Scene setup
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ 
            antialias: true, 
            alpha: true 
        });
        
        renderer.setSize(256, 256);
        renderer.setClearColor(0x000000, 0);
        container.appendChild(renderer.domElement);

        // Lighting
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
        scene.add(ambientLight);

        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(10, 10, 5);
        scene.add(directionalLight);

        // Create floating reward boxes
        const rewardBoxes = [];
        const colors = [0xFF6B6B, 0x4ECDC4, 0x45B7D1, 0x96CEB4, 0xFFA726];
        
        for (let i = 0; i < 8; i++) {
            const geometry = new THREE.BoxGeometry(0.4, 0.4, 0.4);
            const material = new THREE.MeshLambertMaterial({ 
                color: colors[i % colors.length] 
            });
            const box = new THREE.Mesh(geometry, material);
            
            // Position in circle
            const angle = (i / 8) * Math.PI * 2;
            box.position.x = Math.cos(angle) * 2;
            box.position.y = Math.sin(angle) * 1.5;
            box.position.z = Math.sin(angle * 2) * 0.5;
            
            // Animation properties
            box.userData = {
                originalPosition: box.position.clone(),
                rotationSpeed: 0.01 + Math.random() * 0.02,
                floatSpeed: 0.005 + Math.random() * 0.01
            };
            
            rewardBoxes.push(box);
            scene.add(box);
        }

        // Central gift icon
        const giftGeometry = new THREE.ConeGeometry(0.3, 0.6, 8);
        const giftMaterial = new THREE.MeshLambertMaterial({ color: 0xFFD700 });
        const gift = new THREE.Mesh(giftGeometry, giftMaterial);
        gift.position.y = 0.3;
        scene.add(gift);

        camera.position.z = 4;

        // Animation loop
        const animate = () => {
            this.animationIds.hero = requestAnimationFrame(animate);
            
            const time = Date.now() * 0.001;
            
            // Animate reward boxes
            rewardBoxes.forEach((box, index) => {
                box.rotation.x += box.userData.rotationSpeed;
                box.rotation.y += box.userData.rotationSpeed * 1.5;
                
                // Float animation
                box.position.y = box.userData.originalPosition.y + 
                    Math.sin(time * box.userData.floatSpeed + index) * 0.3;
            });
            
            // Animate central gift
            gift.rotation.y += 0.02;
            gift.position.y = 0.3 + Math.sin(time * 2) * 0.1;
            
            renderer.render(scene, camera);
        };
        
        animate();
        
        this.scenes.hero = scene;
        this.cameras.hero = camera;
        this.renderers.hero = renderer;
    }

    createRewardCards() {
        // Netflix Card Animation
        this.createCardAnimation('netflix-3d-card', 0xFF0000, 'netflix');
        
        // Prime Card Animation  
        this.createCardAnimation('prime-3d-card', 0x00A8E1, 'prime');
        
        // Spotify Card Animation
        this.createCardAnimation('spotify-3d-card', 0x1DB954, 'spotify');
        
        // Disney+ Card Animation
        this.createCardAnimation('disney-3d-card', 0x113CCF, 'disney');
        
        // YouTube Card Animation
        this.createCardAnimation('youtube-3d-card', 0xFF0000, 'youtube');
        
        // Gaming Card Animation
        this.createCardAnimation('gaming-3d-card', 0x107C10, 'gaming');
        
        // Metro Card Animation
        this.createCardAnimation('metro-3d-card', 0x0078D4, 'metro');
        
        // Bus Card Animation
        this.createCardAnimation('bus-3d-card', 0xFF8C00, 'bus');
        
        // Uber Card Animation
        this.createCardAnimation('uber-3d-card', 0x000000, 'uber');
        
        // EV Charging Animation
        this.createCardAnimation('ev-3d-card', 0x10B981, 'ev');
        
        // Solar Animation
        this.createCardAnimation('solar-3d-card', 0xFFD700, 'solar');
        
        // Shopping Cards
        this.createCardAnimation('amazon-3d-card', 0xFF9900, 'amazon');
        this.createCardAnimation('flipkart-3d-card', 0x047BD6, 'flipkart');
        this.createCardAnimation('zomato-3d-card', 0xE23744, 'zomato');
    }

    createCardAnimation(containerId, color, type) {
        const container = document.getElementById(containerId);
        if (!container) return;

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ 
            antialias: true, 
            alpha: true 
        });
        
        renderer.setSize(64, 64);
        renderer.setClearColor(0x000000, 0);
        container.appendChild(renderer.domElement);

        // Lighting
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
        scene.add(ambientLight);

        let mainObject;
        
        // Create different objects based on type
        switch(type) {
            case 'netflix':
            case 'prime':
            case 'disney':
            case 'youtube':
                // TV/Screen for streaming services
                const tvGeometry = new THREE.BoxGeometry(0.8, 0.6, 0.1);
                const tvMaterial = new THREE.MeshLambertMaterial({ color: color });
                mainObject = new THREE.Mesh(tvGeometry, tvMaterial);
                
                // Screen
                const screenGeometry = new THREE.PlaneGeometry(0.7, 0.5);
                const screenMaterial = new THREE.MeshBasicMaterial({ color: 0x000000 });
                const screen = new THREE.Mesh(screenGeometry, screenMaterial);
                screen.position.z = 0.051;
                mainObject.add(screen);
                break;
                
            case 'spotify':
            case 'gaming':
                // Headphones/Controller
                const headGeometry = new THREE.SphereGeometry(0.3, 16, 16);
                const headMaterial = new THREE.MeshLambertMaterial({ color: color });
                mainObject = new THREE.Mesh(headGeometry, headMaterial);
                break;
                
            case 'metro':
            case 'bus':
                // Card shape
                const cardGeometry = new THREE.BoxGeometry(0.6, 0.4, 0.05);
                const cardMaterial = new THREE.MeshLambertMaterial({ color: color });
                mainObject = new THREE.Mesh(cardGeometry, cardMaterial);
                break;
                
            case 'uber':
                // Car shape
                const carGeometry = new THREE.BoxGeometry(0.8, 0.4, 0.3);
                const carMaterial = new THREE.MeshLambertMaterial({ color: color });
                mainObject = new THREE.Mesh(carGeometry, carMaterial);
                break;
                
            case 'ev':
                // Charging port
                const chargerGeometry = new THREE.CylinderGeometry(0.1, 0.1, 0.6, 8);
                const chargerMaterial = new THREE.MeshLambertMaterial({ color: color });
                mainObject = new THREE.Mesh(chargerGeometry, chargerMaterial);
                mainObject.rotation.z = Math.PI / 2;
                break;
                
            case 'solar':
                // Solar panel
                const solarGeometry = new THREE.BoxGeometry(0.6, 0.6, 0.1);
                const solarMaterial = new THREE.MeshLambertMaterial({ color: color });
                mainObject = new THREE.Mesh(solarGeometry, solarMaterial);
                break;
                
            default:
                // Shopping bag for other items
                const bagGeometry = new THREE.ConeGeometry(0.3, 0.6, 8);
                const bagMaterial = new THREE.MeshLambertMaterial({ color: color });
                mainObject = new THREE.Mesh(bagGeometry, bagMaterial);
        }
        
        scene.add(mainObject);
        camera.position.z = 2;

        // Animation loop
        const animate = () => {
            this.animationIds[containerId] = requestAnimationFrame(animate);
            
            const time = Date.now() * 0.002;
            
            mainObject.rotation.y += 0.02;
            mainObject.position.y = Math.sin(time) * 0.1;
            
            renderer.render(scene, camera);
        };
        
        animate();
        
        this.scenes[containerId] = scene;
        this.cameras[containerId] = camera;
        this.renderers[containerId] = renderer;
    }

    createParticleBackground() {
        const container = document.getElementById('rewards-particles');
        if (!container) return;

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ alpha: true });
        
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setClearColor(0x000000, 0);
        container.appendChild(renderer.domElement);

        // Create gift particles
        const particleCount = 50;
        const particles = [];
        
        for (let i = 0; i < particleCount; i++) {
            const geometry = new THREE.BoxGeometry(0.05, 0.05, 0.05);
            const material = new THREE.MeshBasicMaterial({ 
                color: new THREE.Color().setHSL(Math.random(), 0.7, 0.6),
                transparent: true,
                opacity: 0.6
            });
            const particle = new THREE.Mesh(geometry, material);
            
            particle.position.x = (Math.random() - 0.5) * 20;
            particle.position.y = (Math.random() - 0.5) * 20;
            particle.position.z = (Math.random() - 0.5) * 20;
            
            particle.userData = {
                velocity: {
                    x: (Math.random() - 0.5) * 0.02,
                    y: (Math.random() - 0.5) * 0.02,
                    z: (Math.random() - 0.5) * 0.02
                }
            };
            
            particles.push(particle);
            scene.add(particle);
        }

        camera.position.z = 5;

        // Animation loop
        const animate = () => {
            this.animationIds.particles = requestAnimationFrame(animate);
            
            particles.forEach(particle => {
                particle.position.add(new THREE.Vector3(
                    particle.userData.velocity.x,
                    particle.userData.velocity.y,
                    particle.userData.velocity.z
                ));
                
                particle.rotation.x += 0.01;
                particle.rotation.y += 0.01;
                
                // Wrap around screen
                if (particle.position.x > 10) particle.position.x = -10;
                if (particle.position.x < -10) particle.position.x = 10;
                if (particle.position.y > 10) particle.position.y = -10;
                if (particle.position.y < -10) particle.position.y = 10;
            });
            
            renderer.render(scene, camera);
        };
        
        animate();

        // Handle resize
        window.addEventListener('resize', () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        });
    }

    setupCategoryFiltering() {
        const categoryBtns = document.querySelectorAll('.category-btn');
        const rewardSections = document.querySelectorAll('[data-category]');
        
        categoryBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const category = btn.dataset.category;
                
                // Update active button
                categoryBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                
                // Filter sections
                rewardSections.forEach(section => {
                    if (category === 'all' || section.dataset.category === category) {
                        section.classList.remove('hidden');
                        section.style.display = 'block';
                    } else {
                        section.classList.add('hidden');
                        section.style.display = 'none';
                    }
                });
            });
        });
    }

    setupRewardInteractions() {
        const rewardCards = document.querySelectorAll('.reward-card');
        
        rewardCards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                this.animateCardHover(card, true);
            });
            
            card.addEventListener('mouseleave', () => {
                this.animateCardHover(card, false);
            });
            
            card.addEventListener('click', () => {
                this.showRewardModal(card);
            });
        });
        
        // Floating Action Button
        const walletFab = document.getElementById('wallet-fab');
        if (walletFab) {
            walletFab.addEventListener('click', () => {
                this.showWalletModal();
            });
        }
    }

    animateCardHover(card, isHover) {
        const coins = card.querySelector('.text-2xl');
        
        if (isHover) {
            card.style.transform = 'translateY(-8px) scale(1.02)';
            if (coins) {
                coins.style.transform = 'scale(1.1)';
                coins.style.color = '#10B981';
            }
        } else {
            card.style.transform = 'translateY(0) scale(1)';
            if (coins) {
                coins.style.transform = 'scale(1)';
                coins.style.color = '';
            }
        }
    }

    showRewardModal(card) {
        const rewardType = card.dataset.reward;
        const title = card.querySelector('h3').textContent;
        const coins = card.querySelector('.text-2xl').textContent;
        
        const modal = document.createElement('div');
        modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fade-in';
        modal.innerHTML = `
            <div class="bg-white rounded-2xl p-8 max-w-md mx-4 transform scale-0 transition-transform duration-300">
                <div class="text-center mb-6">
                    <div class="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full flex items-center justify-center">
                        <i class="fas fa-gift text-3xl text-purple-600"></i>
                    </div>
                    <h3 class="text-2xl font-bold mb-2 text-gray-800">${title}</h3>
                    <div class="text-3xl font-bold text-green-600">${coins} Green Coins</div>
                </div>
                
                <div class="bg-gray-50 rounded-xl p-4 mb-6">
                    <h4 class="font-semibold mb-2">Redemption Details:</h4>
                    <ul class="text-sm text-gray-600 space-y-1">
                        <li>• Instant digital delivery</li>
                        <li>• Valid for 12 months</li>
                        <li>• Non-transferable</li>
                        <li>• Customer support included</li>
                    </ul>
                </div>
                
                <div class="flex gap-3">
                    <button class="flex-1 bg-gradient-to-r from-green-500 to-blue-500 text-white py-3 rounded-lg font-semibold hover:shadow-lg transform hover:-translate-y-1 transition-all" onclick="this.closest('.fixed').remove(); showNotification('🎉 Reward redeemed successfully!', 'success')">
                        Redeem Now
                    </button>
                    <button class="flex-1 border border-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-50 transition-colors" onclick="this.closest('.fixed').remove()">
                        Cancel
                    </button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Animate modal in
        setTimeout(() => {
            modal.querySelector('.bg-white').style.transform = 'scale(1)';
        }, 10);
        
        // Close on backdrop click
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        });
    }

    showWalletModal() {
        const modal = document.createElement('div');
        modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
        modal.innerHTML = `
            <div class="bg-white rounded-2xl p-8 max-w-md mx-4">
                <div class="text-center mb-6">
                    <div class="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-green-100 to-blue-100 rounded-full flex items-center justify-center">
                        <i class="fas fa-wallet text-3xl text-green-600"></i>
                    </div>
                    <h3 class="text-2xl font-bold mb-2 text-gray-800">Your Green Wallet</h3>
                    <div class="text-4xl font-bold text-green-600">1,245 Coins</div>
                </div>
                
                <div class="grid grid-cols-2 gap-4 mb-6">
                    <div class="bg-gray-50 p-4 rounded-lg text-center">
                        <div class="text-2xl font-bold text-blue-600">45</div>
                        <div class="text-sm text-gray-600">Earned Today</div>
                    </div>
                    <div class="bg-gray-50 p-4 rounded-lg text-center">
                        <div class="text-2xl font-bold text-purple-600">127</div>
                        <div class="text-sm text-gray-600">Devices Recycled</div>
                    </div>
                </div>
                
                <button class="w-full bg-gray-600 text-white py-3 rounded-lg" onclick="this.closest('.fixed').remove()">
                    Close
                </button>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        });
    }

    // Utility function for notifications
    showNotification(message, type = 'info') {
        // This would be implemented in main.js
        if (window.greenCoinsApp && window.greenCoinsApp.showNotification) {
            window.greenCoinsApp.showNotification(message, type);
        }
    }

    // Cleanup function
    destroy() {
        Object.values(this.animationIds).forEach(id => {
            if (id) cancelAnimationFrame(id);
        });
        
        Object.values(this.renderers).forEach(renderer => {
            if (renderer) renderer.dispose();
        });
        
        this.scenes = {};
        this.renderers = {};
        this.cameras = {};
        this.animationIds = {};
    }
}

// Initialize rewards animations
const rewardsAnimations = new RewardsAnimations();

// Make globally accessible
window.rewardsAnimations = rewardsAnimations;

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
    rewardsAnimations.destroy();
});