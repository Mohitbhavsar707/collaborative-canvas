class CollaborativeCanvas {
    constructor() {
        this.canvas = document.getElementById('drawing-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.isDrawing = false;
        this.currentTool = 'draw';
        this.currentColor = '#000000';
        this.currentSize = 3;
        this.currentFontSize = 20;
        this.lastX = 0;
        this.lastY = 0;
        this.isLoading = false;
        
        // Auto-save timer
        setInterval(() => this.autoSave(), 30000);
        
        // Initialize canvas size
        this.resizeCanvas();
        
        // Initialize event listeners
        this.initializeEventListeners();
        
        // Initialize enhanced collaboration
        this.initializeCollaboration();
    }
    
    resizeCanvas() {
        const container = document.querySelector('.canvas-container');
        const containerWidth = container.clientWidth - 40; // Account for padding
        const containerHeight = Math.min(600, window.innerHeight * 0.6);
        
        this.canvas.width = containerWidth;
        this.canvas.height = containerHeight;
        
        // Set up canvas context defaults
        this.ctx.lineCap = 'round';
        this.ctx.lineJoin = 'round';
    }
    
    initializeEventListeners() {
        // Tool selection
        document.querySelectorAll('.tool-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelector('.tool-btn.active').classList.remove('active');
                e.target.classList.add('active');
                this.currentTool = e.target.dataset.tool;
                this.updateCursor();
            });
        });
        
        // Color picker
        document.getElementById('color-picker').addEventListener('change', (e) => {
            this.currentColor = e.target.value;
        });
        
        // Brush size
        const brushSize = document.getElementById('brush-size');
        const sizeDisplay = document.getElementById('size-display');
        brushSize.addEventListener('input', (e) => {
            this.currentSize = e.target.value;
            sizeDisplay.textContent = e.target.value;
        });
        
        // Font size
        const fontSize = document.getElementById('font-size');
        const fontSizeDisplay = document.getElementById('font-size-display');
        fontSize.addEventListener('input', (e) => {
            this.currentFontSize = e.target.value;
            fontSizeDisplay.textContent = e.target.value;
        });
        
        // Canvas drawing events
        this.canvas.addEventListener('mousedown', this.startDrawing.bind(this));
        this.canvas.addEventListener('mousemove', this.draw.bind(this));
        this.canvas.addEventListener('mouseup', this.stopDrawing.bind(this));
        this.canvas.addEventListener('mouseout', this.stopDrawing.bind(this));
        
        // Touch events for mobile
        this.canvas.addEventListener('touchstart', this.handleTouch.bind(this));
        this.canvas.addEventListener('touchmove', this.handleTouch.bind(this));
        this.canvas.addEventListener('touchend', this.stopDrawing.bind(this));
        
        // Text tool click
        this.canvas.addEventListener('click', this.handleTextClick.bind(this));
        
        // Action buttons
        document.getElementById('clear-canvas').addEventListener('click', this.clearCanvas.bind(this));
        document.getElementById('save-canvas').addEventListener('click', this.saveCanvas.bind(this));
        document.getElementById('load-canvas').addEventListener('click', this.loadCanvas.bind(this));
        
        // Image upload
        document.getElementById('image-upload').addEventListener('change', this.handleImageUpload.bind(this));
        
        // Paste functionality
        document.addEventListener('paste', this.handlePaste.bind(this));
        
        // Text input handlers
        document.getElementById('confirm-text').addEventListener('click', this.confirmText.bind(this));
        document.getElementById('cancel-text').addEventListener('click', this.cancelText.bind(this));
        document.getElementById('text-field').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.confirmText();
            } else if (e.key === 'Escape') {
                this.cancelText();
            }
        });
        
        // Window resize
        window.addEventListener('resize', () => {
            const imageData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
            this.resizeCanvas();
            this.ctx.putImageData(imageData, 0, 0);
        });
        
        // Save before page unload
        window.addEventListener('beforeunload', () => {
            this.autoSave();
        });
        
        // Save when page becomes hidden
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.autoSave();
            }
        });
    }
    
    updateCursor() {
        switch(this.currentTool) {
            case 'draw':
                this.canvas.style.cursor = 'crosshair';
                break;
            case 'erase':
                this.canvas.style.cursor = 'grab';
                break;
            case 'text':
                this.canvas.style.cursor = 'text';
                break;
        }
    }
    
    getMousePos(e) {
        const rect = this.canvas.getBoundingClientRect();
        return {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
        };
    }
    
    startDrawing(e) {
        if (this.currentTool === 'text') return;
        
        this.isDrawing = true;
        const pos = this.getMousePos(e);
        this.lastX = pos.x;
        this.lastY = pos.y;
        
        // Start the path for drawing
        this.ctx.beginPath();
        this.ctx.moveTo(this.lastX, this.lastY);
        
        // Save immediately when drawing starts
        this.autoSave();
    }
    
    draw(e) {
        if (!this.isDrawing || this.currentTool === 'text') return;
        
        const pos = this.getMousePos(e);
        
        this.ctx.globalCompositeOperation = this.currentTool === 'erase' ? 'destination-out' : 'source-over';
        this.ctx.strokeStyle = this.currentColor;
        this.ctx.lineWidth = this.currentSize;
        
        this.ctx.lineTo(pos.x, pos.y);
        this.ctx.stroke();
        this.ctx.beginPath();
        this.ctx.moveTo(pos.x, pos.y);
        
        this.lastX = pos.x;
        this.lastY = pos.y;
    }
    
    stopDrawing() {
        if (this.isDrawing) {
            this.isDrawing = false;
            this.ctx.beginPath();
            this.autoSave();
        }
    }
    
    handleTouch(e) {
        e.preventDefault();
        const touch = e.touches[0];
        const mouseEvent = new MouseEvent(e.type === 'touchstart' ? 'mousedown' : 
                                        e.type === 'touchmove' ? 'mousemove' : 'mouseup', {
            clientX: touch.clientX,
            clientY: touch.clientY
        });
        this.canvas.dispatchEvent(mouseEvent);
    }
    
    handleTextClick(e) {
        if (this.currentTool !== 'text' || this.isDrawing) return;
        
        const pos = this.getMousePos(e);
        const textInput = document.getElementById('text-input');
        const textField = document.getElementById('text-field');
        
        // Position the text input overlay
        textInput.style.left = (pos.x + 20) + 'px';
        textInput.style.top = (pos.y - 30) + 'px';
        textInput.style.display = 'block';
        
        // Store the position for text placement
        textInput.dataset.x = pos.x;
        textInput.dataset.y = pos.y;
        
        // Focus and clear the input
        textField.value = '';
        textField.focus();
    }
    
    confirmText() {
        const textInput = document.getElementById('text-input');
        const textField = document.getElementById('text-field');
        const text = textField.value.trim();
        
        if (text) {
            const x = parseFloat(textInput.dataset.x);
            const y = parseFloat(textInput.dataset.y);
            
            this.ctx.font = `${this.currentFontSize}px Arial`;
            this.ctx.fillStyle = this.currentColor;
            this.ctx.textBaseline = 'top';
            this.ctx.fillText(text, x, y);
            
            this.autoSave();
        }
        
        this.cancelText();
    }
    
    cancelText() {
        const textInput = document.getElementById('text-input');
        textInput.style.display = 'none';
    }
    
    handleImageUpload(e) {
        const file = e.target.files[0];
        if (file && file.type.startsWith('image/')) {
            this.loadImageToCanvas(file);
        }
    }
    
    handlePaste(e) {
        const items = e.clipboardData.items;
        for (let item of items) {
            if (item.type.startsWith('image/')) {
                const file = item.getAsFile();
                this.loadImageToCanvas(file);
                e.preventDefault();
                break;
            }
        }
    }
    
    loadImageToCanvas(file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            const img = new Image();
            img.onload = () => {
                // Calculate scaling to fit image reasonably on canvas
                const maxWidth = this.canvas.width * 0.5;
                const maxHeight = this.canvas.height * 0.5;
                
                let { width, height } = img;
                
                if (width > maxWidth || height > maxHeight) {
                    const ratio = Math.min(maxWidth / width, maxHeight / height);
                    width *= ratio;
                    height *= ratio;
                }
                
                // Draw image at center-ish position
                const x = (this.canvas.width - width) / 2;
                const y = (this.canvas.height - height) / 2;
                
                this.ctx.drawImage(img, x, y, width, height);
                this.autoSave();
            };
            img.src = e.target.result;
        };
        reader.readAsDataURL(file);
    }
    
    clearCanvas() {
        if (confirm('Are you sure you want to clear the canvas? This will remove all drawings.')) {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            this.autoSave();
        }
    }
    
    
    initializeCollaboration() {
        // Set up localStorage change listener for cross-tab communication
        window.addEventListener('storage', (e) => {
            if (e.key === 'collaborative-canvas' && e.newValue && !this.isLoading) {
                try {
                    const data = JSON.parse(e.newValue);
                    if (data && data.imageData) {
                        this.loadCanvasFromData(data, true); // true = from other tab/user
                    }
                } catch (error) {
                    console.error('Error parsing storage update:', error);
                }
            }
        });
        
        // Load initial canvas data
        this.loadCanvas();
        
        console.log('🌍 Enhanced collaboration ready! (Cross-tab sync active)');
    }
    
    loadCanvasFromData(data, isRealTimeUpdate = false) {
        if (!data || !data.imageData) return;
        
        const img = new Image();
        img.onload = () => {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            this.ctx.drawImage(img, 0, 0);
            
            // Update UI
            const timestamp = new Date(data.timestamp);
            const timeString = timestamp.toLocaleString();
            document.getElementById('last-saved').textContent = `Last saved: ${timeString}`;
            document.getElementById('last-editor').textContent = `Last edited by: ${data.editor}`;
            
            if (isRealTimeUpdate && data.editor !== (document.getElementById('username').value || 'Anonymous')) {
                this.showUpdateNotification(data.editor);
            }
        };
        img.src = data.imageData;
    }
    
    loadCanvasFromLocalStorage() {
        const savedData = localStorage.getItem('collaborative-canvas') || 
                         localStorage.getItem('collaborative-canvas-backup');
        
        if (savedData) {
            try {
                const data = JSON.parse(savedData);
                this.loadCanvasFromData(data);
                console.log('📱 Local canvas loaded');
            } catch (error) {
                console.error('Error loading local canvas:', error);
            }
        }
    }
    
    showUpdateNotification(editorName) {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #4CAF50;
            color: white;
            padding: 12px 16px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 10000;
            font-size: 14px;
            font-weight: 500;
        `;
        notification.textContent = `🔄 Updated by ${editorName}`;
        document.body.appendChild(notification);
        
        setTimeout(() => {
            if (document.body.contains(notification)) {
                document.body.removeChild(notification);
            }
        }, 3000);
    }
    
    saveCanvas() {
        const username = document.getElementById('username').value || 'Anonymous';
        const canvasData = this.canvas.toDataURL();
        const saveData = {
            imageData: canvasData,
            timestamp: new Date().toISOString(),
            editor: username,
            version: Date.now()
        };
        
        // Save to localStorage (will trigger cross-tab sync)
        localStorage.setItem('collaborative-canvas', JSON.stringify(saveData));
        
        // Update UI
        document.getElementById('last-saved').textContent = `Last saved: ${new Date().toLocaleString()}`;
        document.getElementById('last-editor').textContent = `Last edited by: ${username}`;
        
        // Visual feedback
        const saveBtn = document.getElementById('save-canvas');
        saveBtn.classList.add('save-success');
        saveBtn.textContent = '✓ Saved!';
        
        setTimeout(() => {
            saveBtn.classList.remove('save-success');
            saveBtn.textContent = '💾 Save';
        }, 1500);
        
        console.log('Canvas saved with cross-tab sync!');
    }
    
    loadCanvas() {
        // Load from localStorage
        this.loadCanvasFromLocalStorage();
    }
    
    autoSave() {
        if (this.isLoading) return;
        
        const username = document.getElementById('username').value || 'Anonymous';
        const canvasData = this.canvas.toDataURL();
        const saveData = {
            imageData: canvasData,
            timestamp: new Date().toISOString(),
            editor: username,
            version: Date.now()
        };
        
        // Auto-save to localStorage (will trigger cross-tab sync)
        localStorage.setItem('collaborative-canvas', JSON.stringify(saveData));
    }
    
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const app = new CollaborativeCanvas();
    
    // Show welcome message
    console.log('🎨 Collaborative Canvas loaded!');
    console.log('Features:');
    console.log('- Draw with different colors and brush sizes');
    console.log('- Add text by clicking on the canvas');
    console.log('- Upload or paste images (Ctrl+V)');
    console.log('- Auto-saves every 30 seconds');
    console.log('- Collaborative - multiple users can edit the same canvas');
});

// Export for potential module use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CollaborativeCanvas;
}
