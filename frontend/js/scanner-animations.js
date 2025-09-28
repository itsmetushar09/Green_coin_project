// Enhanced Three.js Animations for Scanner Page

class ScannerAnimations {
    constructor() {
        this.scenes = {};
        this.renderers = {};
        this.cameras = {};
        this.animationIds = {};
        this.scanningActive = false;
        
        this.init();
    }

    init() {
        document.addEventListener('DOMContentLoaded', () => {
            this.createScannerHero();
            this.createUploadIcon();
            this.createAIFeatures();
            this.createWaitingAnimation();
            this.createParticleBackground();
            this.setupScannerInteractions();
        });
    }

    createScannerHero() {
        const container = document.getElementById('scanner-hero-3d');
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
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
        scene.add(ambientLight);

        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(10, 10, 5);
        scene.add(directionalLight);

        // Create central scanning device
        const deviceGroup = new THREE.Group();
        
        // Main scanner body
        const scannerGeometry = new THREE.BoxGeometry(1, 1.5, 0.2);
        const scannerMaterial = new THREE.MeshLambertMaterial({ color: 0x333333 });
        const scanner = new THREE.Mesh(scannerGeometry, scannerMaterial);
        deviceGroup.add(scanner);

        // Scanner screen
        const screenGeometry = new THREE.PlaneGeometry(0.8, 1.2);
        const screenMaterial = new THREE.MeshBasicMaterial({ 
            color: 0x00AAFF,
            transparent: true,
            opacity: 0.8
        });
        const screen = new THREE.Mesh(screenGeometry, screenMaterial);
        screen.position.z = 0.11;
        deviceGroup.add(screen);

        // Scanning beam
        const beamGeometry = new THREE.PlaneGeometry(0.9, 0.05);
        const beamMaterial = new THREE.MeshBasicMaterial({ 
            color: 0x00FF00,
            transparent: true,
            opacity: 0.8
        });
        const scanBeam = new THREE.Mesh(beamGeometry, beamMaterial);
        scanBeam.position.z = 0.12;
        deviceGroup.add(scanBeam);

        // Create orbiting devices
        const orbitingDevices = [];
        const deviceTypes = [
            { geometry: new THREE.BoxGeometry(0.3, 0.5, 0.05), color: 0x333333 }, // Phone
            { geometry: new THREE.BoxGeometry(0.6, 0.4, 0.05), color: 0x444444 }, // Laptop
            { geometry: new THREE.BoxGeometry(0.4, 0.3, 0.03), color: 0x555555 }, // Tablet
            { geometry: new THREE.CylinderGeometry(0.05, 0.05, 0.3, 8), color: 0x222222 } // Charger
        ];

        deviceTypes.forEach((deviceType, index) => {
            const device = new THREE.Mesh(deviceType.geometry, new THREE.MeshLambertMaterial({ color: deviceType.color }));
            const angle = (index / deviceTypes.length) * Math.PI * 2;
            device.position.x = Math.cos(angle) * 3;
            device.position.y = Math.sin(angle) * 2;
            device.position.z = Math.sin(angle * 2) * 0.5;
            
            device.userData = {
                angle: angle,
                orbitRadius: 3,
                rotationSpeed: 0.01 + Math.random() * 0.01
            };
            
            orbitingDevices.push(device);
            scene.add(device);
        });

        scene.add(deviceGroup);
        camera.position.z = 6;

        // Animation loop
        let scanBeamY = -0.6;
        let scanDirection = 1;

        const animate = () => {
            this.animationIds.hero = requestAnimationFrame(animate);
            
            const time = Date.now() * 0.001;
            
            // Rotate main device group
            deviceGroup.rotation.y += 0.005;
            
            // Animate scanning beam
            scanBeamY += scanDirection * 0.02;
            if (scanBeamY > 0.6) scanDirection = -1;
            if (scanBeamY < -0.6) scanDirection = 1;
            scanBeam.position.y = scanBeamY;
            
            // Animate beam opacity
            scanBeam.material.opacity = 0.6 + Math.sin(time * 5) * 0.3;
            
            // Animate orbiting devices
            orbitingDevices.forEach((device, index) => {
                device.userData.angle += 0.01;
                device.position.x = Math.cos(device.userData.angle) * device.userData.orbitRadius;
                device.position.y = Math.sin(device.userData.angle) * 2;
                device.position.z = Math.sin(device.userData.angle * 2) * 0.5;
                
                device.rotation.x += device.userData.rotationSpeed;
                device.rotation.y += device.userData.rotationSpeed * 1.5;
            });
            
            renderer.render(scene, camera);
        };
        
        animate();
        
        this.scenes.hero = scene;
        this.cameras.hero = camera;
        this.renderers.hero = renderer;
    }

    createUploadIcon() {
        const container = document.getElementById('upload-3d-icon');
        if (!container) return;

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ 
            antialias: true, 
            alpha: true 
        });
        
        renderer.setSize(96, 96);
        renderer.setClearColor(0x000000, 0);
        container.appendChild(renderer.domElement);

        // Lighting
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
        scene.add(ambientLight);

        // Create upload arrow
        const arrowGroup = new THREE.Group();
        
        // Arrow shaft
        const shaftGeometry = new THREE.CylinderGeometry(0.1, 0.1, 1, 8);
        const shaftMaterial = new THREE.MeshBasicMaterial({ color: 0x3B82F6 });
        const shaft = new THREE.Mesh(shaftGeometry, shaftMaterial);
        arrowGroup.add(shaft);

        // Arrow head
        const headGeometry = new THREE.ConeGeometry(0.3, 0.4, 8);
        const headMaterial = new THREE.MeshBasicMaterial({ color: 0x3B82F6 });
        const head = new THREE.Mesh(headGeometry, headMaterial);
        head.position.y = 0.7;
        arrowGroup.add(head);

        // Cloud base
        const cloudGeometry = new THREE.SphereGeometry(0.4, 8, 8);
        const cloudMaterial = new THREE.MeshBasicMaterial({ 
            color: 0xE5E7EB,
            transparent: true,
            opacity: 0.8
        });
        const cloud = new THREE.Mesh(cloudGeometry, cloudMaterial);
        cloud.position.y = -0.8;
        cloud.scale.set(1.5, 0.6, 1);
        arrowGroup.add(cloud);

        scene.add(arrowGroup);
        camera.position.z = 3;

        // Animation loop
        const animate = () => {
            this.animationIds.upload = requestAnimationFrame(animate);
            
            const time = Date.now() * 0.002;
            
            // Float animation
            arrowGroup.position.y = Math.sin(time) * 0.2;
            arrowGroup.rotation.y += 0.01;
            
            // Pulse effect
            const scale = 1 + Math.sin(time * 2) * 0.1;
            arrowGroup.scale.setScalar(scale);
            
            renderer.render(scene, camera);
        };
        
        animate();
        
        this.scenes.upload = scene;
        this.cameras.upload = camera;
        this.renderers.upload = renderer;
    }

    createAIFeatures() {
        // Create 3D icons for AI features
        const features = [
            { id: 'ai-feature-1', icon: 'eye', color: 0x10B981 },
            { id: 'ai-feature-2', icon: 'brain', color: 0x3B82F6 },
            { id: 'ai-feature-3', icon: 'calculator', color: 0x8B5CF6 },
            { id: 'ai-feature-4', icon: 'leaf', color: 0x059669 }
        ];

        features.forEach(feature => {
            this.createFeatureIcon(feature.id, feature.icon, feature.color);
        });
    }

    createFeatureIcon(containerId, iconType, color) {
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

        switch(iconType) {
            case 'eye':
                // Eye shape
                const eyeGeometry = new THREE.SphereGeometry(0.4, 16, 8);
                const eyeMaterial = new THREE.MeshBasicMaterial({ color: color });
                mainObject = new THREE.Mesh(eyeGeometry, eyeMaterial);
                
                // Pupil
                const pupilGeometry = new THREE.SphereGeometry(0.2, 8, 8);
                const pupilMaterial = new THREE.MeshBasicMaterial({ color: 0x000000 });
                const pupil = new THREE.Mesh(pupilGeometry, pupilMaterial);
                pupil.position.z = 0.3;
                mainObject.add(pupil);
                break;
                
            case 'brain':
                // Brain-like structure
                const brainGeometry = new THREE.SphereGeometry(0.4, 8, 8);
                const brainMaterial = new THREE.MeshBasicMaterial({ color: color });
                mainObject = new THREE.Mesh(brainGeometry, brainMaterial);
                mainObject.scale.set(1.2, 1, 0.8);
                break;
                
            case 'calculator':
                // Calculator/chip
                const chipGeometry = new THREE.BoxGeometry(0.6, 0.6, 0.1);
                const chipMaterial = new THREE.MeshBasicMaterial({ color: color });
                mainObject = new THREE.Mesh(chipGeometry, chipMaterial);
                break;
                
            case 'leaf':
                // Leaf shape
                const leafGeometry = new THREE.ConeGeometry(0.3, 0.8, 8);
                const leafMaterial = new THREE.MeshBasicMaterial({ color: color });
                mainObject = new THREE.Mesh(leafGeometry, leafMaterial);
                mainObject.rotation.z = Math.PI / 4;
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

    createWaitingAnimation() {
        const container = document.getElementById('waiting-3d');
        if (!container) return;

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ 
            antialias: true, 
            alpha: true 
        });
        
        renderer.setSize(128, 128);
        renderer.setClearColor(0x000000, 0);
        container.appendChild(renderer.domElement);

        // Lighting
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
        scene.add(ambientLight);

        // Create loading dots
        const dots = [];
        for (let i = 0; i < 3; i++) {
            const dotGeometry = new THREE.SphereGeometry(0.1, 8, 8);
            const dotMaterial = new THREE.MeshBasicMaterial({ color: 0x6B7280 });
            const dot = new THREE.Mesh(dotGeometry, dotMaterial);
            dot.position.x = (i - 1) * 0.4;
            dot.userData = { delay: i * 0.5 };
            dots.push(dot);
            scene.add(dot);
        }

        camera.position.z = 2;

        // Animation loop
        const animate = () => {
            this.animationIds.waiting = requestAnimationFrame(animate);
            
            const time = Date.now() * 0.005;
            
            dots.forEach((dot, index) => {
                dot.position.y = Math.sin(time + dot.userData.delay) * 0.3;
                dot.material.color.setHSL(0.6, 0.7, 0.5 + Math.sin(time + dot.userData.delay) * 0.3);
            });
            
            renderer.render(scene, camera);
        };
        
        animate();
        
        this.scenes.waiting = scene;
        this.cameras.waiting = camera;
        this.renderers.waiting = renderer;
    }

    createParticleBackground() {
        const container = document.getElementById('scanner-particles');
        if (!container) return;

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ alpha: true });
        
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setClearColor(0x000000, 0);
        container.appendChild(renderer.domElement);

        // Create scanning particles
        const particleCount = 60;
        const particles = [];
        
        for (let i = 0; i < particleCount; i++) {
            const geometry = new THREE.SphereGeometry(0.02, 4, 4);
            const material = new THREE.MeshBasicMaterial({ 
                color: new THREE.Color().setHSL(0.5 + Math.random() * 0.3, 0.7, 0.6),
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
                
                // Wrap around screen
                if (particle.position.x > 10) particle.position.x = -10;
                if (particle.position.x < -10) particle.position.x = 10;
                if (particle.position.y > 10) particle.position.y = -10;
                if (particle.position.y < -10) particle.position.y = 10;
                
                // Pulse effect
                const scale = 1 + Math.sin(Date.now() * 0.003 + particle.position.x) * 0.5;
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

    setupScannerInteractions() {
        // Upload area interactions
        const uploadArea = document.getElementById('upload-area');
        const fileInput = document.getElementById('device-upload');
        
        if (uploadArea && fileInput) {
            uploadArea.addEventListener('click', () => fileInput.click());
            uploadArea.addEventListener('dragover', (e) => {
                e.preventDefault();
                uploadArea.style.borderColor = '#3B82F6';
                uploadArea.style.backgroundColor = '#EFF6FF';
            });
            
            uploadArea.addEventListener('dragleave', () => {
                uploadArea.style.borderColor = '#D1D5DB';
                uploadArea.style.backgroundColor = 'white';
            });
            
            uploadArea.addEventListener('drop', (e) => {
                e.preventDefault();
                const files = e.dataTransfer.files;
                if (files.length > 0) {
                    this.handleFileUpload(files[0]);
                }
                uploadArea.style.borderColor = '#D1D5DB';
                uploadArea.style.backgroundColor = 'white';
            });
            
            fileInput.addEventListener('change', (e) => {
                if (e.target.files[0]) {
                    this.handleFileUpload(e.target.files[0]);
                }
            });
        }

        // Quick scan buttons
        document.querySelectorAll('.quick-scan-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const deviceType = btn.dataset.device;
                this.simulateQuickScan(deviceType);
            });
        });

        // Help button
        const helpBtn = document.getElementById('help-btn');
        if (helpBtn) {
            helpBtn.addEventListener('click', () => {
                this.showHelpModal();
            });
        }
    }

    handleFileUpload(file) {
        if (!file.type.startsWith('image/')) {
            this.showNotification('❌ Please upload an image file', 'error');
            return;
        }
        
        if (file.size > 10 * 1024 * 1024) {
            this.showNotification('❌ File size must be under 10MB', 'error');
            return;
        }
        
        this.startScanning(file);
    }

    simulateQuickScan(deviceType) {
        const mockFile = new File([''], `${deviceType}.jpg`, { type: 'image/jpeg' });
        this.startScanning(mockFile);
    }

    startScanning(file) {
        this.scanningActive = true;
        
        // Update UI
        const uploadArea = document.getElementById('upload-area');
        const scanningProgress = document.getElementById('scanning-progress');
        const noResults = document.getElementById('no-results');
        
        uploadArea.innerHTML = `
            <div class="flex items-center justify-center">
                <div class="animate-spin mr-3">
                    <i class="fas fa-cog text-blue-500 text-3xl"></i>
                </div>
                <div>
                    <p class="text-blue-600 mb-1">Analyzing "${file.name}"</p>
                    <p class="text-sm text-gray-500">AI processing in progress...</p>
                </div>
            </div>
        `;
        
        scanningProgress.classList.remove('hidden');
        noResults.classList.add('hidden');
        
        // Simulate scanning progress
        this.animateScanningProgress();
        
        // Complete scan after delay
        setTimeout(() => {
            this.completeScan(file);
        }, 3000);
    }

    animateScanningProgress() {
        const progressBar = document.querySelector('.progress-bar');
        const scanStatus = document.getElementById('scan-status');
        
        const steps = [
            { progress: 20, status: 'Loading AI models...' },
            { progress: 40, status: 'Analyzing image composition...' },
            { progress: 60, status: 'Identifying device type...' },
            { progress: 80, status: 'Evaluating condition...' },
            { progress: 95, status: 'Calculating value...' },
            { progress: 100, status: 'Analysis complete!' }
        ];
        
        let currentStep = 0;
        
        const updateProgress = () => {
            if (currentStep < steps.length && this.scanningActive) {
                const step = steps[currentStep];
                progressBar.style.width = step.progress + '%';
                scanStatus.textContent = step.status;
                currentStep++;
                
                setTimeout(updateProgress, 500);
            }
        };
        
        updateProgress();
    }

    completeScan(file) {
        this.scanningActive = false;
        
        // Generate mock analysis results
        const analysisResult = this.generateAnalysisResult(file.name);
        
        // Update UI with results
        document.getElementById('scanning-progress').classList.add('hidden');
        document.getElementById('analysis-results').classList.remove('hidden');
        
        // Populate results
        document.getElementById('device-name').textContent = analysisResult.name;
        document.getElementById('device-condition').textContent = analysisResult.condition;
        document.getElementById('device-coins').textContent = analysisResult.coins;
        document.getElementById('device-brand').textContent = analysisResult.brand;
        document.getElementById('device-category').textContent = analysisResult.category;
        document.getElementById('co2-impact').textContent = analysisResult.co2 + ' kg saved';
        document.getElementById('ai-confidence').textContent = analysisResult.confidence + '%';
        document.getElementById('carbon-reduced').textContent = analysisResult.co2 + ' kg CO₂';
        document.getElementById('materials-recovered').textContent = analysisResult.materials + '%';
        document.getElementById('energy-saved').textContent = analysisResult.energy + ' kWh';
        
        // Reset upload area
        setTimeout(() => {
            document.getElementById('upload-area').innerHTML = `
                <div id="upload-content">
                    <div id="upload-3d-icon" class="w-24 h-24 mx-auto mb-4"></div>
                    <p class="text-gray-600 mb-2 text-lg">Click to upload another device photo</p>
                    <p class="text-sm text-gray-500">Supports JPG, PNG up to 10MB</p>
                </div>
            `;
            this.createUploadIcon(); // Recreate upload icon
        }, 1000);
        
        this.showNotification('✅ Device analyzed successfully!', 'success');
    }

    generateAnalysisResult(filename) {
        const deviceDatabase = {
            'phone': { name: 'Smartphone', brand: 'Generic', category: 'Mobile Device', coins: 150, co2: 0.8, confidence: 92, materials: 85, energy: 2.1 },
            'iphone': { name: 'iPhone 13 Pro', brand: 'Apple', category: 'Smartphone', coins: 200, co2: 0.9, confidence: 98, materials: 87, energy: 2.4 },
            'samsung': { name: 'Galaxy S21', brand: 'Samsung', category: 'Smartphone', coins: 180, co2: 0.85, confidence: 95, materials: 86, energy: 2.2 },
            'laptop': { name: 'Laptop Computer', brand: 'Generic', category: 'Computer', coins: 300, co2: 2.1, confidence: 89, materials: 78, energy: 5.2 },
            'macbook': { name: 'MacBook Pro', brand: 'Apple', category: 'Laptop', coins: 400, co2: 2.5, confidence: 96, materials: 82, energy: 6.1 },
            'tablet': { name: 'Tablet Device', brand: 'Generic', category: 'Tablet', coins: 180, co2: 1.2, confidence: 91, materials: 80, energy: 3.1 },
            'ipad': { name: 'iPad Pro', brand: 'Apple', category: 'Tablet', coins: 220, co2: 1.4, confidence: 97, materials: 83, energy: 3.5 },
            'charger': { name: 'Phone Charger', brand: 'Generic', category: 'Accessory', coins: 50, co2: 0.3, confidence: 87, materials: 70, energy: 0.8 }
        };
        
        const lowerName = filename.toLowerCase();
        for (const [key, value] of Object.entries(deviceDatabase)) {
            if (lowerName.includes(key)) {
                return {
                    ...value,
                    condition: 'Good Condition'
                };
            }
        }
        
        // Default result
        return {
            name: 'Electronic Device',
            brand: 'Unknown',
            category: 'Electronics',
            coins: 100,
            co2: 0.5,
            confidence: 85,
            materials: 75,
            energy: 1.5,
            condition: 'Fair Condition'
        };
    }

    showHelpModal() {
        const modal = document.createElement('div');
        modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
        modal.innerHTML = `
            <div class="bg-white rounded-2xl p-8 max-w-lg mx-4 max-h-96 overflow-y-auto">
                <h3 class="text-2xl font-bold mb-6 flex items-center">
                    <i class="fas fa-question-circle text-blue-500 mr-3"></i>
                    How to Use AI Scanner
                </h3>
                
                <div class="space-y-4 text-sm text-gray-600">
                    <div>
                        <h4 class="font-semibold text-gray-800 mb-2">📱 Supported Devices</h4>
                        <p>Smartphones, tablets, laptops, chargers, headphones, smartwatches, and other electronic devices.</p>
                    </div>
                    
                    <div>
                        <h4 class="font-semibold text-gray-800 mb-2">📸 Photo Guidelines</h4>
                        <ul class="list-disc list-inside space-y-1">
                            <li>Take clear, well-lit photos</li>
                            <li>Include the entire device in frame</li>
                            <li>Avoid shadows and glare</li>
                            <li>Multiple angles help accuracy</li>
                        </ul>
                    </div>
                    
                    <div>
                        <h4 class="font-semibold text-gray-800 mb-2">🤖 AI Analysis</h4>
                        <p>Our AI identifies device type, assesses condition, and calculates fair market value in Green Coins.</p>
                    </div>
                    
                    <div>
                        <h4 class="font-semibold text-gray-800 mb-2">💰 Coin Values</h4>
                        <p>Values are based on device type, condition, age, and current market rates. Premium devices earn more coins.</p>
                    </div>
                </div>
                
                <button class="w-full mt-6 bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition-colors" onclick="this.closest('.fixed').remove()">
                    Got It!
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

    showNotification(message, type = 'info') {
        if (window.greenCoinsApp && window.greenCoinsApp.showNotification) {
            window.greenCoinsApp.showNotification(message, type);
        } else {
            // Fallback notification
            const notification = document.createElement('div');
            notification.className = `fixed top-20 right-4 p-4 rounded-lg shadow-lg z-50 ${
                type === 'success' ? 'bg-green-500 text-white' : 
                type === 'error' ? 'bg-red-500 text-white' : 
                'bg-blue-500 text-white'
            }`;
            notification.textContent = message;
            
            document.body.appendChild(notification);
            
            setTimeout(() => {
                notification.remove();
            }, 3000);
        }
    }

    // Cleanup function
    destroy() {
        this.scanningActive = false;
        
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

// Initialize scanner animations
const scannerAnimations = new ScannerAnimations();

// Make globally accessible
window.scannerAnimations = scannerAnimations;

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
    scannerAnimations.destroy();
});