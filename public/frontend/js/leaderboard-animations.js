// Leaderboard Three.js Animations

class LeaderboardAnimations {
    constructor() {
        this.scenes = {};
        this.renderers = {};
        this.cameras = {};
        this.animationIds = {};
        
        this.init();
    }

    init() {
        document.addEventListener('DOMContentLoaded', () => {
            this.createLeaderboardHero();
            this.createPodiumAnimations();
            this.createParticleBackground();
            this.setupTabSwitching();
        });
    }

    createLeaderboardHero() {
        const container = document.getElementById('leaderboard-hero-3d');
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

        // Create main trophy
        const trophyGroup = new THREE.Group();
        
        // Trophy base
        const baseGeometry = new THREE.CylinderGeometry(0.4, 0.5, 0.2, 8);
        const baseMaterial = new THREE.MeshBasicMaterial({ color: 0xFFD700 });
        const base = new THREE.Mesh(baseGeometry, baseMaterial);
        base.position.y = -0.1;
        trophyGroup.add(base);

        // Trophy stem
        const stemGeometry = new THREE.CylinderGeometry(0.1, 0.15, 0.6, 8);
        const stemMaterial = new THREE.MeshBasicMaterial({ color: 0xC0C0C0 });
        const stem = new THREE.Mesh(stemGeometry, stemMaterial);
        stem.position.y = 0.3;
        trophyGroup.add(stem);

        // Trophy cup
        const cupGeometry = new THREE.SphereGeometry(0.35, 16, 16);
        const cupMaterial = new THREE.MeshBasicMaterial({ color: 0xFFD700 });
        const cup = new THREE.Mesh(cupGeometry, cupMaterial);
        cup.position.y = 0.7;
        cup.scale.y = 0.8;
        trophyGroup.add(cup);

        // Floating medals around trophy
        const medals = [];
        const medalColors = [0xFFD700, 0xC0C0C0, 0xCD7F32]; // Gold, Silver, Bronze
        
        for (let i = 0; i < 3; i++) {
            const medalGeometry = new THREE.CylinderGeometry(0.15, 0.15, 0.05, 16);
            const medalMaterial = new THREE.MeshBasicMaterial({ color: medalColors[i] });
            const medal = new THREE.Mesh(medalGeometry, medalMaterial);
            
            const angle = (i / 3) * Math.PI * 2;
            medal.position.x = Math.cos(angle) * 2;
            medal.position.y = Math.sin(angle) * 1.5 + 0.5;
            medal.position.z = 0;
            
            medal.userData = {
                angle: angle,
                orbitSpeed: 0.01,
                floatSpeed: 0.005 + i * 0.002
            };
            
            medals.push(medal);
            scene.add(medal);
        }

        scene.add(trophyGroup);
        camera.position.z = 4;

        // Animation loop
        const animate = () => {
            this.animationIds.hero = requestAnimationFrame(animate);
            
            const time = Date.now() * 0.001;
            
            // Rotate trophy
            trophyGroup.rotation.y += 0.005;
            
            // Float trophy
            trophyGroup.position.y = Math.sin(time * 0.5) * 0.2;
            
            // Animate medals
            medals.forEach((medal, index) => {
                medal.userData.angle += medal.userData.orbitSpeed;
                medal.position.x = Math.cos(medal.userData.angle) * 2;
                medal.position.y = Math.sin(medal.userData.angle) * 1.5 + 0.5 + 
                    Math.sin(time * medal.userData.floatSpeed) * 0.3;
                
                medal.rotation.z += 0.02;
            });
            
            renderer.render(scene, camera);
        };
        
        animate();
        
        this.scenes.hero = scene;
        this.cameras.hero = camera;
        this.renderers.hero = renderer;
    }

    createPodiumAnimations() {
        // First place animation
        this.createPlaceAnimation('first-place-3d', 0xFFD700, 1);
        
        // Second place animation
        this.createPlaceAnimation('second-place-3d', 0xC0C0C0, 2);
        
        // Third place animation
        this.createPlaceAnimation('third-place-3d', 0xCD7F32, 3);
    }

    createPlaceAnimation(containerId, color, place) {
        const container = document.getElementById(containerId);
        if (!container) return;

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ 
            antialias: true, 
            alpha: true 
        });
        
        const size = place === 1 ? 96 : 80;
        renderer.setSize(size, size);
        renderer.setClearColor(0x000000, 0);
        container.appendChild(renderer.domElement);

        // Lighting
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
        scene.add(ambientLight);

        let mainObject;
        
        if (place === 1) {
            // Crown for first place
            const crownGeometry = new THREE.CylinderGeometry(0.4, 0.3, 0.3, 8);
            const crownMaterial = new THREE.MeshBasicMaterial({ color: color });
            mainObject = new THREE.Mesh(crownGeometry, crownMaterial);
            
            // Crown spikes
            for (let i = 0; i < 5; i++) {
                const spikeGeometry = new THREE.ConeGeometry(0.05, 0.2, 4);
                const spikeMaterial = new THREE.MeshBasicMaterial({ color: color });
                const spike = new THREE.Mesh(spikeGeometry, spikeMaterial);
                
                const angle = (i / 5) * Math.PI * 2;
                spike.position.x = Math.cos(angle) * 0.35;
                spike.position.z = Math.sin(angle) * 0.35;
                spike.position.y = 0.25;
                
                mainObject.add(spike);
            }
        } else {
            // Medal for other places
            const medalGeometry = new THREE.CylinderGeometry(0.3, 0.3, 0.05, 16);
            const medalMaterial = new THREE.MeshBasicMaterial({ color: color });
            mainObject = new THREE.Mesh(medalGeometry, medalMaterial);
        }
        
        scene.add(mainObject);
        camera.position.z = 2;

        // Animation loop
        const animate = () => {
            this.animationIds[containerId] = requestAnimationFrame(animate);
            
            const time = Date.now() * 0.002;
            
            mainObject.rotation.y += 0.02;
            mainObject.position.y = Math.sin(time + place) * 0.1;
            
            // Special effects for first place
            if (place === 1) {
                const scale = 1 + Math.sin(time * 2) * 0.1;
                mainObject.scale.setScalar(scale);
            }
            
            renderer.render(scene, camera);
        };
        
        animate();
        
        this.scenes[containerId] = scene;
        this.cameras[containerId] = camera;
        this.renderers[containerId] = renderer;
    }

    createParticleBackground() {
        const container = document.getElementById('leaderboard-particles');
        if (!container) return;

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ alpha: true });
        
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setClearColor(0x000000, 0);
        container.appendChild(renderer.domElement);

        // Create trophy and medal particles
        const particleCount = 30;
        const particles = [];
        
        for (let i = 0; i < particleCount; i++) {
            let geometry, material;
            
            if (Math.random() > 0.5) {
                // Trophy shape
                geometry = new THREE.ConeGeometry(0.03, 0.1, 6);
                material = new THREE.MeshBasicMaterial({ 
                    color: 0xFFD700,
                    transparent: true,
                    opacity: 0.6
                });
            } else {
                // Medal shape
                geometry = new THREE.CylinderGeometry(0.03, 0.03, 0.01, 8);
                material = new THREE.MeshBasicMaterial({ 
                    color: new THREE.Color().setHSL(0.1 + Math.random() * 0.2, 0.8, 0.6),
                    transparent: true,
                    opacity: 0.6
                });
            }
            
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
                
                particle.rotation.x += 0.01;
                particle.rotation.y += 0.02;
                
                // Wrap around screen
                if (particle.position.x > 10) particle.position.x = -10;
                if (particle.position.x < -10) particle.position.x = 10;
                if (particle.position.y > 10) particle.position.y = -10;
                if (particle.position.y < -10) particle.position.y = 10;
                
                // Sparkle effect
                const sparkle = 0.5 + Math.sin(Date.now() * 0.005 + particle.position.x) * 0.3;
                particle.material.opacity = sparkle * 0.6;
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

    setupTabSwitching() {
        const tabs = document.querySelectorAll('.leaderboard-tab');
        
        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                // Remove active class from all tabs
                tabs.forEach(t => t.classList.remove('active'));
                
                // Add active class to clicked tab
                tab.classList.add('active');
                
                // Animate leaderboard update
                this.animateLeaderboardUpdate(tab.dataset.tab);
            });
        });
    }

    animateLeaderboardUpdate(category) {
        const leaderboardList = document.getElementById('leaderboard-list');
        if (!leaderboardList) return;

        // Add loading animation
        leaderboardList.style.opacity = '0.5';
        leaderboardList.style.transform = 'scale(0.95)';
        
        setTimeout(() => {
            // Simulate data update based on category
            this.updateLeaderboardData(category);
            
            // Remove loading animation
            leaderboardList.style.opacity = '1';
            leaderboardList.style.transform = 'scale(1)';
            leaderboardList.style.transition = 'all 0.3s ease';
        }, 300);
    }

    updateLeaderboardData(category) {
        // This would normally fetch new data from the server
        // For now, we'll just show a notification
        if (window.greenCoinsApp && window.greenCoinsApp.showNotification) {
            const categoryNames = {
                'coins': 'Green Coins',
                'devices': 'Devices Recycled', 
                'co2': 'CO₂ Saved',
                'weekly': 'Weekly Rankings'
            };
            
            window.greenCoinsApp.showNotification(
                `📊 Leaderboard updated: ${categoryNames[category]}`, 
                'info'
            );
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

// Initialize leaderboard animations
const leaderboardAnimations = new LeaderboardAnimations();

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
    leaderboardAnimations.destroy();
});