// Community Three.js Animations

class CommunityAnimations {
    constructor() {
        this.scenes = {};
        this.renderers = {};
        this.cameras = {};
        this.animationIds = {};
        
        this.init();
    }

    init() {
        document.addEventListener('DOMContentLoaded', () => {
            this.createCommunityHero();
            this.createParticleBackground();
            this.setupPostInteractions();
        });
    }

    createCommunityHero() {
        const container = document.getElementById('community-hero-3d');
        if (!container) return;

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
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
        scene.add(ambientLight);

        // Create connected network of people
        const people = [];
        const connections = [];
        
        for (let i = 0; i < 8; i++) {
            const personGeometry = new THREE.SphereGeometry(0.15, 8, 8);
            const personMaterial = new THREE.MeshBasicMaterial({ 
                color: new THREE.Color().setHSL(Math.random() * 0.3 + 0.3, 0.7, 0.6)
            });
            const person = new THREE.Mesh(personGeometry, personMaterial);
            
            const angle = (i / 8) * Math.PI * 2;
            person.position.x = Math.cos(angle) * 2;
            person.position.y = Math.sin(angle) * 1.5;
            person.position.z = 0;
            
            person.userData = {
                angle: angle,
                originalY: person.position.y,
                floatSpeed: 0.01 + Math.random() * 0.01
            };
            
            people.push(person);
            scene.add(person);
        }

        // Create connections between people
        for (let i = 0; i < people.length; i++) {
            const nextIndex = (i + 1) % people.length;
            const geometry = new THREE.BufferGeometry().setFromPoints([
                people[i].position,
                people[nextIndex].position
            ]);
            
            const material = new THREE.LineBasicMaterial({ 
                color: 0x10B981,
                opacity: 0.6,
                transparent: true
            });
            
            const line = new THREE.Line(geometry, material);
            connections.push(line);
            scene.add(line);
        }

        camera.position.z = 4;

        // Animation loop
        const animate = () => {
            this.animationIds.hero = requestAnimationFrame(animate);
            
            const time = Date.now() * 0.001;
            
            people.forEach((person, index) => {
                person.position.y = person.userData.originalY + 
                    Math.sin(time * person.userData.floatSpeed + index) * 0.2;
            });
            
            renderer.render(scene, camera);
        };
        
        animate();
        
        this.scenes.hero = scene;
        this.cameras.hero = camera;
        this.renderers.hero = renderer;
    }

    createParticleBackground() {
        const container = document.getElementById('community-particles');
        if (!container) return;

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ alpha: true });
        
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setClearColor(0x000000, 0);
        container.appendChild(renderer.domElement);

        // Create heart-shaped particles for social connections
        const particleCount = 40;
        const particles = [];
        
        for (let i = 0; i < particleCount; i++) {
            const geometry = new THREE.SphereGeometry(0.02, 4, 4);
            const material = new THREE.MeshBasicMaterial({ 
                color: new THREE.Color().setHSL(0.3 + Math.random() * 0.4, 0.7, 0.6),
                transparent: true,
                opacity: 0.4
            });
            const particle = new THREE.Mesh(geometry, material);
            
            particle.position.x = (Math.random() - 0.5) * 20;
            particle.position.y = (Math.random() - 0.5) * 20;
            particle.position.z = (Math.random() - 0.5) * 20;
            
            particle.userData = {
                velocity: {
                    x: (Math.random() - 0.5) * 0.01,
                    y: (Math.random() - 0.5) * 0.01,
                    z: (Math.random() - 0.5) * 0.01
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
                
                // Wrap around screen
                if (particle.position.x > 10) particle.position.x = -10;
                if (particle.position.x < -10) particle.position.x = 10;
                if (particle.position.y > 10) particle.position.y = -10;
                if (particle.position.y < -10) particle.position.y = 10;
                
                // Pulse effect
                const scale = 1 + Math.sin(Date.now() * 0.003 + particle.position.x) * 0.3;
                particle.scale.setScalar(scale);
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

    setupPostInteractions() {
        // Post button
        const postBtn = document.getElementById('post-btn');
        const textarea = document.getElementById('post-textarea');
        
        if (postBtn && textarea) {
            postBtn.addEventListener('click', () => {
                this.createPost(textarea.value);
            });
        }

        // Like buttons
        document.querySelectorAll('[data-action="like"]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.handleLike(e.target);
            });
        });
    }

    createPost(content) {
        if (!content.trim()) {
            this.showNotification('Please write something to share!', 'warning');
            return;
        }

        const feed = document.getElementById('community-feed');
        const newPost = document.createElement('div');
        newPost.className = 'bg-white rounded-xl p-6 shadow-lg border hover-lift animate-fade-in-up';
        newPost.innerHTML = `
            <div class="flex items-start mb-4">
                <div class="w-12 h-12 bg-gradient-to-br from-green-primary to-blue-primary rounded-full flex items-center justify-center text-white font-bold mr-4">YOU</div>
                <div class="flex-1">
                    <div class="flex items-center justify-between mb-2">
                        <div class="flex items-center">
                            <span class="font-semibold text-gray-800 mr-2">You</span>
                            <span class="text-sm text-gray-500 mr-2">Level 6</span>
                            <span class="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full">Eco Warrior</span>
                        </div>
                        <span class="text-sm text-gray-500">Just now</span>
                    </div>
                    <p class="text-gray-700 mb-4">${content}</p>
                    <div class="flex items-center justify-between">
                        <div class="flex items-center space-x-6">
                            <button class="flex items-center text-gray-500 hover:text-red-500 transition-colors" data-action="like">
                                <i class="fas fa-heart mr-1"></i>
                                <span>0</span>
                            </button>
                            <button class="flex items-center text-gray-500 hover:text-blue-500 transition-colors">
                                <i class="fas fa-comment mr-1"></i>
                                <span>0</span>
                            </button>
                            <button class="flex items-center text-gray-500 hover:text-green-500 transition-colors">
                                <i class="fas fa-share mr-1"></i>
                                <span>Share</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        feed.insertBefore(newPost, feed.firstChild);
        document.getElementById('post-textarea').value = '';
        
        this.showNotification('Post shared successfully! 🎉', 'success');
    }

    handleLike(button) {
        const countSpan = button.querySelector('span');
        const currentCount = parseInt(countSpan.textContent);
        countSpan.textContent = currentCount + 1;
        
        button.classList.add('text-red-500');
        button.classList.remove('text-gray-500');
        
        const heart = button.querySelector('i');
        heart.classList.add('animate-bounce-custom');
        setTimeout(() => {
            heart.classList.remove('animate-bounce-custom');
        }, 600);
    }

    showNotification(message, type = 'info') {
        if (window.greenCoinsApp && window.greenCoinsApp.showNotification) {
            window.greenCoinsApp.showNotification(message, type);
        }
    }

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

// Initialize community animations
const communityAnimations = new CommunityAnimations();

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
    communityAnimations.destroy();
});