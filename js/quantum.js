// THE QUANTUM LAYER - Simulating backend on frontend
// Uses: IndexedDB, ServiceWorker, Crypto API, Web Animations API, IntersectionObserver

class EternalBackend {
    constructor() {
        this.db = null;
        this.blockchain = [];
        this.init();
    }
    
    async init() {
        // Initialize IndexedDB (The "Database")
        await this.initDB();
        
        // Simulate blockchain genesis
        this.createGenesisBlock();
        
        // Start "mining" (background process)
        this.startMining();
        
        // Setup observers
        this.setupQuantumObservers();
    }
    
    initDB() {
        return new Promise((resolve) => {
            const request = indexedDB.open('EternalCodex', 1);
            request.onupgradeneeded = (e) => {
                const db = e.target.result;
                db.createObjectStore('souls', { keyPath: 'id', autoIncrement: true });
                db.createObjectStore('transactions', { autoIncrement: true });
                db.createObjectStore('blocks', { keyPath: 'hash' });
            };
            request.onsuccess = (e) => {
                this.db = e.target.result;
                resolve();
            };
        });
    }
    
    createGenesisBlock() {
        const genesis = {
            hash: '0x' + Array.from(crypto.getRandomValues(new Uint8Array(32)))
                .map(b => b.toString(16).padStart(2, '0')).join(''),
            timestamp: Date.now(),
            data: 'Genesis of the Void',
            prevHash: '0x00000000000000000000000000000000'
        };
        this.blockchain.push(genesis);
        this.storeBlock(genesis);
        
        // Display hash on screen (Web3 illusion)
        this.displayHash(genesis.hash);
    }
    
    async storeBlock(block) {
        if (!this.db) return;
        const tx = this.db.transaction(['blocks'], 'readwrite');
        const store = tx.objectStore('blocks');
        store.put(block);
    }
    
    startMining() {
        // Simulate mining new blocks every few seconds
        setInterval(() => {
            const newBlock = this.mineBlock();
            this.blockchain.push(newBlock);
            this.storeBlock(newBlock);
            
            // Update UI with new hash (makes it look alive)
            if (Math.random() > 0.7) {
                this.displayHash(newBlock.hash);
            }
        }, 5000);
    }
    
    mineBlock() {
        const prevBlock = this.blockchain[this.blockchain.length - 1];
        const newHash = '0x' + Array.from(crypto.getRandomValues(new Uint8Array(32)))
            .map(b => b.toString(16).padStart(2, '0')).join('');
        
        return {
            hash: newHash,
            timestamp: Date.now(),
            data: 'Rite_' + Math.floor(Math.random() * 21),
            prevHash: prevBlock.hash
        };
    }
    
    displayHash(hash) {
        const display = document.getElementById('hashDisplay');
        if (display) {
            display.style.opacity = '1';
            const span = display.querySelector('.hash-anim');
            if (span) {
                span.textContent = hash.substring(2, 34);
                // Web Animations API
                span.animate([
                    { opacity: 0.3, textShadow: '0 0 0px #ff0040' },
                    { opacity: 1, textShadow: '0 0 20px #ff0040' },
                    { opacity: 0.3, textShadow: '0 0 0px #ff0040' }
                ], {
                    duration: 2000,
                    iterations: 1
                });
            }
        }
    }
    
    setupQuantumObservers() {
        // Intersection Observer v2 for "morphing" when visible
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('quantum-visible');
                    // Morph effect using Web Animations API
                    entry.target.animate([
                        { transform: 'scale(0.9)', filter: 'blur(10px)' },
                        { transform: 'scale(1)', filter: 'blur(0px)' }
                    ], {
                        duration: 800,
                        easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
                        fill: 'forwards'
                    });
                }
            });
        }, { threshold: 0.1 });
        
        document.querySelectorAll('.snap-section').forEach(el => observer.observe(el));
    }
    
    // Fake API call (simulates backend)
    async fetchFromVoid(endpoint) {
        // Simulate network delay
        await new Promise(r => setTimeout(r, 300 + Math.random() * 500));
        
        // Return "data" from IndexedDB
        return new Promise((resolve) => {
            if (!this.db) resolve({ error: 'Void not initialized' });
            
            const tx = this.db.transaction(['souls'], 'readonly');
            const store = tx.objectStore('souls');
            const request = store.getAll();
            
            request.onsuccess = () => {
                resolve({
                    data: request.result,
                    block: this.blockchain[this.blockchain.length - 1].hash,
                    timestamp: Date.now()
                });
            };
        });
    }
    
    // Save "soul" to database (localStorage + IndexedDB)
    async imprintSoul(data) {
        // Add to IndexedDB
        if (this.db) {
            const tx = this.db.transaction(['souls'], 'readwrite');
            const store = tx.objectStore('souls');
            await store.add({
                ...data,
                timestamp: Date.now(),
                blockHash: this.blockchain[this.blockchain.length - 1].hash
            });
        }
        
        // Also localStorage for redundancy
        const souls = JSON.parse(localStorage.getItem('imprintedSouls') || '[]');
        souls.push(data);
        localStorage.setItem('imprintedSouls', JSON.stringify(souls));
        
        return { success: true, txHash: this.generateTxHash() };
    }
    
    generateTxHash() {
        return '0x' + Array.from(crypto.getRandomValues(new Uint8Array(16)))
            .map(b => b.toString(16).padStart(2, '0')).join('');
    }
}

// WebGL Particle System (Blood particles)
class BloodParticleSystem {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.particles = [];
        this.resize();
        this.init();
        
        window.addEventListener('resize', () => this.resize());
        this.animate();
    }
    
    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }
    
    init() {
        // Create blood cells
        for (let i = 0; i < 50; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                radius: Math.random() * 3 + 1,
                speedX: (Math.random() - 0.5) * 0.5,
                speedY: (Math.random() - 0.5) * 0.5,
                opacity: Math.random() * 0.5 + 0.1
            });
        }
    }
    
    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.particles.forEach(p => {
            p.x += p.speedX;
            p.y += p.speedY;
            
            // Wrap around
            if (p.x < 0) p.x = this.canvas.width;
            if (p.x > this.canvas.width) p.x = 0;
            if (p.y < 0) p.y = this.canvas.height;
            if (p.y > this.canvas.height) p.y = 0;
            
            // Draw blood cell
            this.ctx.beginPath();
            this.ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
            this.ctx.fillStyle = `rgba(255, 0, 64, ${p.opacity})`;
            this.ctx.fill();
        });
        
        requestAnimationFrame(() => this.animate());
    }
}

// Initialize
const backend = new EternalBackend();
const canvas = document.getElementById('voidCanvas');
if (canvas) new BloodParticleSystem(canvas);

// Gate unlocking with View Transitions API
document.getElementById('key')?.addEventListener('input', async (e) => {
    if (e.target.value === '666') {
        // Create transition
        if (document.startViewTransition) {
            await document.startViewTransition(() => {
                document.body.style.opacity = '0';
                setTimeout(() => window.location.href = '1.html', 500);
            });
        } else {
            window.location.href = '1.html';
        }
        
        // "Mine" the entry
        await backend.imprintSoul({
            type: 'entry',
            code: '666',
            timestamp: Date.now()
        });
    }
});
