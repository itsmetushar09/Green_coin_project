// Three.js Animations for Green Coins Platform

class ThreeJSAnimations {
    constructor() {
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.coins = [];
        this.particles = [];
        this.device = null;
        this.animationId = null;
        
        this.init();
    }

    init() {
        this.createHeroAnimation();
        this.createParticlesBackground();
        this.startAnimation();
    }

    createHeroAnimation() {
        // Hero 3D Container
        const container = document.getElementById('hero-3d-container');
        if (!container) return;

        // Scene setup
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer({ 
            antialias: true, 
            alpha: true,
            powerPreference: "high-performance"
        });
        
        this.renderer.setSize(384, 384);
        this.renderer.setClearColor(0x000000, 0);
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        
        container.appendChild(this.renderer.domElement);

        // Lighting
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
        this.scene.add(ambientLight);

        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(50, 50, 50);
        directionalLight.castShadow = true;
        this.scene.add(directionalLight);

        // Create floating coins
        this.createFloatingCoins();
        
        // Create 3D devices
        this.create3DDevices();
        
        // Create recycling symbol
        this.createRecyclingSymbol();

        // Position camera
        this.camera.position.z = 5;
    }

    createFloatingCoins() {
        const coinGeometry = new THREE.CylinderGeometry(0.15, 0.15, 0.05, 32);
        const coinMaterial = new THREE.MeshLambertMaterial({ 
            color: 0x10B981
        });

        for (let i = 0; i < 15; i++) {
            const coin = new THREE.Mesh(coinGeometry, coinMaterial);
            
            // Random positioning
            coin.position.x = (Math.random() - 0.5) * 8;
            coin.position.y = (Math.random() - 0.5) * 6;
            coin.position.z = (Math.random() - 0.5) * 4;
            
            // Random rotation
            coin.rotation.x = Math.random() * Math.PI;
            coin.rotation.y = Math.random() * Math.PI;
            
            // Animation properties
            coin.userData = {
                originalY: coin.position.y,
                floatSpeed: 0.02 + Math.random() * 0.02,
                rotateSpeed: 0.01 + Math.random() * 0.02,
                amplitude: 0.3 + Math.random() * 0.3
            };
            
            coin.castShadow = true;
            this.coins.push(coin);
            this.scene.add(coin);
        }
    }

    create3DDevices() {
        // Smartphone
        const phoneGeometry = new THREE.BoxGeometry(0.4, 0.8, 0.05);
        const phoneMaterial = new THREE.MeshLambertMaterial({ color: 0x333333 });
        const phone = new THREE.Mesh(phoneGeometry, phoneMaterial);
        phone.position.set(-2, 1, 1);
        phone.castShadow = true;
        this.scene.add(phone);

        // Screen
        const screenGeometry = new THREE.PlaneGeometry(0.35, 0.7);
        const screenMaterial = new THREE.MeshBasicMaterial({ 
            color: 0x0066cc,
            opacity: 0.8,
            transparent: true
        });
        const screen = new THREE.Mesh(screenGeometry, screenMaterial);
        screen.position.set(-2, 1, 1.026);
        this.scene.add(screen);

        // Laptop
        const laptopGeometry = new THREE.BoxGeometry(0.8, 0.6, 0.05);
        const laptopMaterial = new THREE.MeshLambertMaterial({ color: 0x555555 });
        const laptop = new THREE.Mesh(laptopGeometry, laptopMaterial);
        laptop.position.set(2, -1, 0.5);
        laptop.castShadow = true;
        this.scene.add(laptop);

        // Tablet
        const tabletGeometry = new THREE.BoxGeometry(0.5, 0.7, 0.03);
        const tabletMaterial = new THREE.MeshLambertMaterial({ color: 0x444444 });
        const tablet = new THREE.Mesh(tabletGeometry, tabletMaterial);
        tablet.position.set(0, -2, -1);
        tablet.rotation.x = Math.PI * 0.1;
        tablet.castShadow = true;
        this.scene.add(tablet);

        // Store reference for animation
        this.device = { phone, laptop, tablet };
    }

    createRecyclingSymbol() {
        // Create recycling symbol using torus geometry
        const torusGeometry = new THREE.TorusGeometry(0.5, 0.1, 8, 16);
        const torusMaterial = new THREE.MeshLambertMaterial({ 
            color: 0x10B981
        });
        
        // Create 3 torus parts for recycling symbol
        for (let i = 0; i < 3; i++) {
            const torus = new THREE.Mesh(torusGeometry, torusMaterial);
            torus.position.set(0, 0, 0);
            torus.rotation.z = (i * Math.PI * 2) / 3;
            torus.rotation.x = Math.PI / 6;
            torus.castShadow = true;
            this.scene.add(torus);
        }
    }

    createParticlesBackground() {
        const particlesContainer = document.getElementById('hero-particles');
        if (!particlesContainer) return;

        // Create particle system with Three.js
        const particleScene = new THREE.Scene();
        const particleCamera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        const particleRenderer = new THREE.WebGLRenderer({ alpha: true });
        
        particleRenderer.setSize(window.innerWidth, window.innerHeight);
        particleRenderer.setClearColor(0x000000, 0);
        particlesContainer.appendChild(particleRenderer.domElement);

        // Create particles
        const particleCount = 100;
        const particles = new THREE.BufferGeometry();
        const positions = new Float32Array(particleCount * 3);
        const colors = new Float32Array(particleCount * 3);

        for (let i = 0; i < particleCount * 3; i += 3) {
            positions[i] = (Math.random() - 0.5) * 20;
            positions[i + 1] = (Math.random() - 0.5) * 20;
            positions[i + 2] = (Math.random() - 0.5) * 20;

            // Green to blue gradient
            const colorMix = Math.random();
            colors[i] = 0.06 + colorMix * 0.17; // R
            colors[i + 1] = 0.73 + colorMix * (-0.22); // G
            colors[i + 2] = 0.51 + colorMix * 0.45; // B
        }

        particles.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        particles.setAttribute('color', new THREE.BufferAttribute(colors, 3));

        const particleMaterial = new THREE.PointsMaterial({
            size: 0.05,
            vertexColors: true,
            transparent: true,
            opacity: 0.6
        });

        const particleSystem = new THREE.Points(particles, particleMaterial);
        particleScene.add(particleSystem);

        particleCamera.position.z = 5;

        // Animation loop for particles
        const animateParticles = () => {
            particleSystem.rotation.x += 0.001;
            particleSystem.rotation.y += 0.002;
            
            particleRenderer.render(particleScene, particleCamera);
            requestAnimationFrame(animateParticles);
        };
        
        animateParticles();

        // Handle resize
        window.addEventListener('resize', () => {
            particleCamera.aspect = window.innerWidth / window.innerHeight;
            particleCamera.updateProjectionMatrix();
            particleRenderer.setSize(window.innerWidth, window.innerHeight);
        });
    }

    startAnimation() {
        const animate = () => {
            this.animationId = requestAnimationFrame(animate);

            // Animate coins
            this.coins.forEach((coin, index) => {
                const time = Date.now() * 0.001;
                
                // Float animation
                coin.position.y = coin.userData.originalY + 
                    Math.sin(time * coin.userData.floatSpeed) * coin.userData.amplitude;
                
                // Rotation animation
                coin.rotation.y += coin.userData.rotateSpeed;
                coin.rotation.x += coin.userData.rotateSpeed * 0.5;
            });

            // Animate devices
            if (this.device) {
                const time = Date.now() * 0.001;
                
                this.device.phone.rotation.y = Math.sin(time * 0.5) * 0.1;
                this.device.laptop.rotation.z = Math.sin(time * 0.3) * 0.05;
                this.device.tablet.rotation.x = Math.PI * 0.1 + Math.sin(time * 0.4) * 0.05;
            }

            // Render scene
            if (this.renderer && this.scene && this.camera) {
                this.renderer.render(this.scene, this.camera);
            }
        };

        animate();
    }

    // Interactive effects
    addCoinCollectEffect(x, y) {
        if (!this.scene) return;

        const effectGeometry = new THREE.SphereGeometry(0.1, 8, 8);
        const effectMaterial = new THREE.MeshBasicMaterial({ 
            color: 0x10B981,
            transparent: true,
            opacity: 1
        });
        const effect = new THREE.Mesh(effectGeometry, effectMaterial);
        
        effect.position.set(
            (x / window.innerWidth - 0.5) * 10,
            -(y / window.innerHeight - 0.5) * 6,
            2
        );
        
        this.scene.add(effect);

        // Animate effect
        let scale = 0.1;
        let opacity = 1;
        
        const animateEffect = () => {
            scale += 0.1;
            opacity -= 0.05;
            
            effect.scale.setScalar(scale);
            effect.material.opacity = opacity;
            
            if (opacity <= 0) {
                this.scene.remove(effect);
                return;
            }
            
            requestAnimationFrame(animateEffect);
        };
        
        animateEffect();
    }

    // Device scanner 3D effect
    createScannerEffect(container) {
        const scannerScene = new THREE.Scene();
        const scannerCamera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
        const scannerRenderer = new THREE.WebGLRenderer({ 
            antialias: true, 
            alpha: true 
        });
        
        scannerRenderer.setSize(300, 300);
        scannerRenderer.setClearColor(0x000000, 0);
        container.appendChild(scannerRenderer.domElement);

        // Create scanning device model
        const deviceGeometry = new THREE.BoxGeometry(1, 1.6, 0.1);
        const deviceMaterial = new THREE.MeshLambertMaterial({ color: 0x333333 });
        const device = new THREE.Mesh(deviceGeometry, deviceMaterial);
        
        // Add scanning lines
        const lineGeometry = new THREE.PlaneGeometry(1.2, 0.05);
        const lineMaterial = new THREE.MeshBasicMaterial({ 
            color: 0x00ff00,
            transparent: true,
            opacity: 0.8
        });
        
        const scanLines = [];
        for (let i = 0; i < 5; i++) {
            const line = new THREE.Mesh(lineGeometry, lineMaterial);
            line.position.y = -0.8 + (i * 0.4);
            line.position.z = 0.051;
            scanLines.push(line);
            scannerScene.add(line);
        }
        
        scannerScene.add(device);
        
        // Lighting
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
        scannerScene.add(ambientLight);
        
        scannerCamera.position.z = 3;
        
        // Animation
        let scanDirection = 1;
        let scanPosition = -0.8;
        
        const animateScanner = () => {
            scanPosition += scanDirection * 0.02;
            
            if (scanPosition > 0.8) {
                scanDirection = -1;
            } else if (scanPosition < -0.8) {
                scanDirection = 1;
            }
            
            scanLines.forEach((line, index) => {
                line.position.y = scanPosition + (index * 0.1);
                line.material.opacity = 0.8 - Math.abs(line.position.y - scanPosition) * 0.5;
            });
            
            device.rotation.y += 0.01;
            
            scannerRenderer.render(scannerScene, scannerCamera);
            requestAnimationFrame(animateScanner);
        };
        
        animateScanner();
        
        return scannerRenderer.domElement;
    }

    // Network visualization for analytics
    createNetworkVisualization(container) {
        const networkScene = new THREE.Scene();
        const networkCamera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
        const networkRenderer = new THREE.WebGLRenderer({ 
            antialias: true, 
            alpha: true 
        });
        
        networkRenderer.setSize(400, 300);
        networkRenderer.setClearColor(0x000000, 0);
        container.appendChild(networkRenderer.domElement);

        // Create network nodes
        const nodes = [];
        const connections = [];
        
        for (let i = 0; i < 12; i++) {
            const nodeGeometry = new THREE.SphereGeometry(0.1, 8, 8);
            const nodeMaterial = new THREE.MeshBasicMaterial({ 
                color: Math.random() > 0.3 ? 0x10B981 : 0xEF4444 
            });
            const node = new THREE.Mesh(nodeGeometry, nodeMaterial);
            
            // Arrange in circle
            const angle = (i / 12) * Math.PI * 2;
            node.position.x = Math.cos(angle) * 2;
            node.position.y = Math.sin(angle) * 1.5;
            node.position.z = 0;
            
            nodes.push(node);
            networkScene.add(node);
        }

        // Create connections between nodes
        for (let i = 0; i < nodes.length; i++) {
            const nextIndex = (i + 1) % nodes.length;
            const geometry = new THREE.BufferGeometry().setFromPoints([
                nodes[i].position,
                nodes[nextIndex].position
            ]);
            
            const material = new THREE.LineBasicMaterial({ 
                color: 0x10B981,
                opacity: 0.5,
                transparent: true
            });
            
            const line = new THREE.Line(geometry, material);
            connections.push(line);
            networkScene.add(line);
        }
        
        networkCamera.position.z = 5;
        
        // Animation
        const animateNetwork = () => {
            nodes.forEach((node, index) => {
                node.scale.setScalar(1 + Math.sin(Date.now() * 0.002 + index) * 0.3);
            });
            
            networkRenderer.render(networkScene, networkCamera);
            requestAnimationFrame(animateNetwork);
        };
        
        animateNetwork();
        
        return networkRenderer.domElement;
    }

    // Cleanup
    destroy() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
        
        if (this.renderer) {
            this.renderer.dispose();
        }
        
        // Cleanup geometries and materials
        this.coins.forEach(coin => {
            coin.geometry.dispose();
            coin.material.dispose();
        });
        
        this.coins = [];
        this.particles = [];
        this.device = null;
    }
}

// Initialize Three.js animations when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const threeAnimations = new ThreeJSAnimations();
    
    // Add coin collect effect on click
    document.addEventListener('click', (e) => {
        if (e.target.closest('.reward-card') || e.target.closest('#wallet-balance')) {
            threeAnimations.addCoinCollectEffect(e.clientX, e.clientY);
        }
    });
    
    // Cleanup on page unload
    window.addEventListener('beforeunload', () => {
        threeAnimations.destroy();
    });
});