// Mahjong Solitaire Game Logic

class MahjongGame {
    constructor() {
        this.board = [];
        this.selectedTile = null;
        this.currentRound = 1;
        this.tilesRemaining = 0;
        this.layouts = this.createLayouts();
        this.tileTypes = this.createTileTypes();
        this.ANIMATION_DELAY = 300; // milliseconds
        
        this.initializeEventListeners();
        this.loadTheme();
        this.startNewGame();
    }

    // Define different tile layouts for different rounds
    createLayouts() {
        return [
            // Layout 1: Classic pyramid (144 tiles)
            { name: 'Classic', pairs: 18, rows: 6, cols: 12 },
            // Layout 2: Rectangle (120 tiles)
            { name: 'Rectangle', pairs: 15, rows: 5, cols: 12 },
            // Layout 3: Diamond (100 tiles)
            { name: 'Diamond', pairs: 12, rows: 4, cols: 10 },
            // Layout 4: Cross (80 tiles)
            { name: 'Cross', pairs: 10, rows: 4, cols: 8 }
        ];
    }

    // Create tile types with symbols
    createTileTypes() {
        return [
            { symbol: '🀇', label: 'Bamboo' },
            { symbol: '🀈', label: 'Bamboo' },
            { symbol: '🀉', label: 'Bamboo' },
            { symbol: '🀊', label: 'Bamboo' },
            { symbol: '🀋', label: 'Bamboo' },
            { symbol: '🀌', label: 'Bamboo' },
            { symbol: '🀍', label: 'Bamboo' },
            { symbol: '🀎', label: 'Bamboo' },
            { symbol: '🀏', label: 'Bamboo' },
            { symbol: '🀙', label: 'Circle' },
            { symbol: '🀚', label: 'Circle' },
            { symbol: '🀛', label: 'Circle' },
            { symbol: '🀜', label: 'Circle' },
            { symbol: '🀝', label: 'Circle' },
            { symbol: '🀞', label: 'Circle' },
            { symbol: '🀟', label: 'Circle' },
            { symbol: '🀠', label: 'Circle' },
            { symbol: '🀡', label: 'Circle' },
            { symbol: '🀐', label: 'Character' },
            { symbol: '🀑', label: 'Character' },
            { symbol: '🀒', label: 'Character' },
            { symbol: '🀓', label: 'Character' },
            { symbol: '🀔', label: 'Character' },
            { symbol: '🀕', label: 'Character' },
            { symbol: '🀖', label: 'Character' },
            { symbol: '🀗', label: 'Character' },
            { symbol: '🀘', label: 'Character' },
            { symbol: '🀀', label: 'Wind' },
            { symbol: '🀁', label: 'Wind' },
            { symbol: '🀂', label: 'Wind' },
            { symbol: '🀃', label: 'Wind' }
        ];
    }

    initializeEventListeners() {
        document.getElementById('new-game').addEventListener('click', () => this.startNewGame());
        document.getElementById('theme-toggle').addEventListener('click', () => this.toggleTheme());
    }

    loadTheme() {
        const theme = localStorage.getItem('theme') || 'light';
        document.documentElement.setAttribute('data-theme', theme);
        this.updateThemeIcon(theme);
    }

    toggleTheme() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        this.updateThemeIcon(newTheme);
    }

    updateThemeIcon(theme) {
        const icon = document.querySelector('.theme-icon');
        icon.textContent = theme === 'dark' ? '☀️' : '🌙';
    }

    startNewGame() {
        this.selectedTile = null;
        const layoutIndex = (this.currentRound - 1) % this.layouts.length;
        const layout = this.layouts[layoutIndex];
        
        this.board = this.generateBoard(layout);
        this.tilesRemaining = this.board.length;
        
        this.updateUI();
        this.renderBoard();
        this.showMessage('');
    }

    generateBoard(layout) {
        const board = [];
        const pairsNeeded = layout.pairs;
        
        // Create pairs of tiles with better distribution
        const shuffledTileTypes = this.shuffleArray([...this.tileTypes]);
        for (let i = 0; i < pairsNeeded; i++) {
            const tileType = shuffledTileTypes[i % shuffledTileTypes.length];
            board.push({ ...tileType, id: board.length, matched: false });
            board.push({ ...tileType, id: board.length, matched: false });
        }
        
        // Shuffle the board
        return this.shuffleArray(board);
    }

    shuffleArray(array) {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    }

    renderBoard() {
        const gameBoard = document.getElementById('game-board');
        gameBoard.innerHTML = '';
        
        this.board.forEach(tile => {
            if (!tile.matched) {
                const tileElement = this.createTileElement(tile);
                gameBoard.appendChild(tileElement);
            }
        });
    }

    createTileElement(tile) {
        const tileElement = document.createElement('div');
        tileElement.className = 'tile';
        tileElement.dataset.id = tile.id;
        
        const symbolElement = document.createElement('div');
        symbolElement.className = 'tile-symbol';
        symbolElement.textContent = tile.symbol;
        
        tileElement.appendChild(symbolElement);
        
        tileElement.addEventListener('click', () => this.handleTileClick(tile));
        
        return tileElement;
    }

    handleTileClick(tile) {
        if (tile.matched) return;
        
        // If no tile selected, select this one
        if (!this.selectedTile) {
            this.selectTile(tile);
            return;
        }
        
        // If clicking the same tile, deselect it
        if (this.selectedTile.id === tile.id) {
            this.deselectTile();
            return;
        }
        
        // Check if tiles match
        if (this.tilesMatch(this.selectedTile, tile)) {
            this.matchTiles(this.selectedTile, tile);
            this.deselectTile();
            
            // Check win condition
            if (this.tilesRemaining === 0) {
                this.handleWin();
            }
        } else {
            // If tiles don't match, select the new tile
            this.deselectTile();
            this.selectTile(tile);
        }
    }

    selectTile(tile) {
        this.selectedTile = tile;
        const tileElement = document.querySelector(`[data-id="${tile.id}"]`);
        if (tileElement) {
            tileElement.classList.add('selected');
        }
    }

    deselectTile() {
        if (this.selectedTile) {
            const tileElement = document.querySelector(`[data-id="${this.selectedTile.id}"]`);
            if (tileElement) {
                tileElement.classList.remove('selected');
            }
            this.selectedTile = null;
        }
    }

    tilesMatch(tile1, tile2) {
        return tile1.symbol === tile2.symbol;
    }

    matchTiles(tile1, tile2) {
        // Mark tiles as matched
        tile1.matched = true;
        tile2.matched = true;
        this.tilesRemaining -= 2;
        
        // Animate tiles
        const tile1Element = document.querySelector(`[data-id="${tile1.id}"]`);
        const tile2Element = document.querySelector(`[data-id="${tile2.id}"]`);
        
        if (tile1Element) tile1Element.classList.add('matched');
        if (tile2Element) tile2Element.classList.add('matched');
        
        // Remove tiles after animation
        setTimeout(() => {
            if (tile1Element) tile1Element.remove();
            if (tile2Element) tile2Element.remove();
        }, this.ANIMATION_DELAY);
        
        this.updateUI();
    }

    handleWin() {
        this.showMessage('🎉 You Win! Starting next round...', 'win');
        this.currentRound++;
        
        setTimeout(() => {
            this.startNewGame();
        }, 2000);
    }

    showMessage(message, className = '') {
        const messageElement = document.getElementById('message');
        messageElement.textContent = message;
        messageElement.className = `message ${className}`;
    }

    updateUI() {
        const layoutIndex = (this.currentRound - 1) % this.layouts.length;
        const layout = this.layouts[layoutIndex];
        
        document.getElementById('round-info').textContent = `Round ${this.currentRound} - ${layout.name}`;
        document.getElementById('tiles-remaining').textContent = `Tiles: ${this.tilesRemaining}`;
    }
}

// Initialize game when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new MahjongGame();
});
