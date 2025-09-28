// Kiosks Three.js Animations

class KiosksAnimations {
    constructor() {
        this.scenes = {};
        this.renderers = {};
        this.cameras = {};
        this.animationIds = {};
        
        this.init();
    }

    init() {
        document.addEventListener('DOMContentLoaded', () => {
            this.createKiosksHero();
            this.createMapVisualization();
            this.createNetworkStats();
            this.createParticleBackground();
        });
    }

    createKiosksHero() {
        const container = document.getElementById('kiosks-hero-3d');
        if (!container) return;

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ 
            antialias: true, 
            alpha: true 
        });
        
        renderer.setSize(320, 320);
        renderer.setClearColor(0x000000, 0);
        container.appendChild(renderer.domElement);

        // Lighting
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
        scene.add(ambientLight);

        // Create kiosk network
        const kiosks = [];
        const connections = [];
        
        // Central hub
        const hubGeometry = new THREE.CylinderGeometry(0.3, 0.5, 1, 8);
        const hubMaterial = new THREE.MeshBasicMaterial({ color: 0x10B981 });
        const hub = new THREE.Mesh(hubGeometry, hubMaterial);
        scene.add(hub);

        // Surrounding kiosks
        for (let i = 0; i < 6; i++) {
            const kioskGeometry = new THREE.BoxGeometry(0.3, 0.8, 0.2);
            const status = Math.random();
            let color;
            if (status > 0.7) color = 0x10B981; // Green - Available
            else if (status > 0.3) color = 0xFF8C00; // Orange - Busy
            else color = 0xEF4444; // Red - Offline
            
            const kioskMaterial = new THREE.MeshBasicMaterial({ color: color });
            const kiosk = new THREE.Mesh(kioskGeometry, kioskMaterial);
            
            const angle = (i / 6) * Math.PI * 2;
            kiosk.position.x = Math.cos(angle) * 3;
            kiosk.position.y = Math.sin(angle) * 2;
            kiosk.position.z = 0;
            
            kiosk.userData = {
                angle: angle,
                orbitSpeed: 0.005 + Math.random() * 0.005,
                floatSpeed: 0.01 + Math.random() * 0.01
            };
            
            kiosks.push(kiosk);
            scene.add(kiosk);

            // Create connection to hub
            const geometry = new THREE.BufferGeometry().setFromPoints([
                new THREE.Vector3(0, 0, 0),
                kiosk.position
            ]);
            
            const material = new THREE.LineBasicMaterial({ 
                color: color,
                opacity: 0.6,
                transparent: true
            });
            
            const line = new THREE.Line(geometry, material);
            connections.push(line);
            scene.add(line);
        }

        camera.position.z = 6;

        // Animation loop
        const animate = () => {
            this.animationIds.hero = requestAnimationFrame(animate);
            
            const time = Date.now() * 0.001;
            
            // Rotate hub
            hub.rotation.y += 0.01;
            
            // Animate kiosks
            kiosks.forEach((kiosk, index) => {
                kiosk.userData.angle += kiosk.userData.orbitSpeed;
                kiosk.position.x = Math.cos(kiosk.userData.angle) * 3;
                kiosk.position.y = Math.sin(kiosk.userData.angle) * 2;
                
                // Float animation
                kiosk.position.z = Math.sin(time * kiosk.userData.floatSpeed + index) * 0.3;
                
                // Update connection
                const connection = connections[index];
                const positions = [
                    0, 0, 0,
                    kiosk.position.x, kiosk.position.y, kiosk.position.z
                ];
                connection.geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
            });
            
            renderer.render(scene, camera);
        };
        
        animate();
        
        this.scenes.hero = scene;
        this.cameras.hero = camera;
        this.renderers.hero = renderer;
    }

    createMapVisualization() {
        const container = document.getElementById('map-3d-container');
        if (!container) return;

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ 
            antialias: true, 
            alpha: true 
        });
        
        renderer.setSize(400, 300);
        renderer.setClearColor(0x000000, 0);
        container.appendChild(renderer.domElement);

        // Lighting
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
        scene.add(ambientLight);

        // Create map points
        const mapPoints = [];
        for (let i = 0; i < 12; i++) {
            const geometry = new THREE.SphereGeometry(0.1, 8, 8);
            const status = Math.random();
            let color;
            if (status > 0.6) color = 0x10B981; // Available
            else if (status > 0.3) color = 0xFF8C00; // Busy
            else color = 0xEF4444; // Offline
            
            const material = new THREE.MeshBasicMaterial({ color: color });
            const point = new THREE.Mesh(geometry, material);
            
            point.position.x = (Math.random() - 0.5) * 6;
            point.position.y = (Math.random() - 0.5) * 4;
            point.position.z = 0;
            
            point.userData = {
                originalScale: 1,
                pulseSpeed: 1 + Math.random()
            };
            
            mapPoints.push(point);
            scene.add(point);
        }

        camera.position.z = 4;

        // Animation loop
        const animate = () => {
            this.animationIds.map = requestAnimationFrame(animate);
            
            const time = Date.now() * 0.002;
            
            mapPoints.forEach((point, index) => {
                // Pulse effect
                const scale = point.userData.originalScale + 
                    Math.sin(time * point.userData.pulseSpeed + index) * 0.3;
                point.scale.setScalar(scale);
            });
            
            renderer.render(scene, camera);
        };
        
        animate();
        
        this.scenes.map = scene;
        this.cameras.map = camera;
        this.renderers.map = renderer;
    }

    createNetworkStats() {
        // Network stat icons
        this.createStatIcon('network-3d-1', 0x10B981, 'kiosk');
        this.createStatIcon('network-3d-2', 0x3B82F6, 'devices');
        this.createStatIcon('network-3d-3', 0x8B5CF6, 'coins');
    }

    createStatIcon(containerId, color, type) {
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
        
        switch(type) {
            case 'kiosk':
                const kioskGeometry = new THREE.BoxGeometry(0.4, 0.8, 0.2);
                const kioskMaterial = new THREE.MeshBasicMaterial({ color: color });
                mainObject = new THREE.Mesh(kioskGeometry, kioskMaterial);
                break;
                
            case 'devices':
                const deviceGeometry = new THREE.BoxGeometry(0.3, 0.5, 0.05);
                const deviceMaterial = new THREE.MeshBasicMaterial({ color: color });
                mainObject = new THREE.Mesh(deviceGeometry, deviceMaterial);
                break;
                
            case 'coins':
                const coinGeometry = new THREE.CylinderGeometry(0.3, 0.3, 0.1, 16);
                const coinMaterial = new THREE.MeshBasicMaterial({ color: color });
                mainObject = new THREE.Mesh(coinGeometry, coinMaterial);
                break;
        }
        
        scene.add(mainObject);
        camera.position.z = 2;

        // Animation loop
        const animate = () => {
            this.animationIds[containerId] = requestAnimationFrame(animate);
            
            const time = Date.now() * 0.003;
            
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
        const container = document.getElementById('kiosks-particles');
        if (!container) return;

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ alpha: true });
        
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setClearColor(0x000000, 0);
        container.appendChild(renderer.domElement);

        // Create network particles
        const particleCount = 50;
        const particles = [];
        
        for (let i = 0; i < particleCount; i++) {
            const geometry = new THREE.BoxGeometry(0.02, 0.02, 0.02);
            const material = new THREE.MeshBasicMaterial({ 
                color: new THREE.Color().setHSL(0.5 + Math.random() * 0.2, 0.7, 0.6),
                transparent: true,
                opacity: 0.6
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

// Initialize kiosks animations
const kiosksAnimations = new KiosksAnimations();

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
    kiosksAnimations.destroy();
});