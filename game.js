/**
 * Fridge Puzzle Game - A browser-based puzzle game where players manipulate handles to turn on lights
 */

// Game configuration constants
const GAME_CONFIG = {
  FRIDGE_WIDTH: 1024,
  FRIDGE_HEIGHT: 1536,
  GRID_SIZE: 4,
  HANDLE_SIZE: 110,
  LIGHT_SIZE: 111,
  SHUFFLE_MOVES: 16,
  WIN_ANIMATION_DURATION: 5000,
  
  // Asset paths
  IMAGES: {
    FRIDGE: 'images/fridge.png',
    LIGHT_RED: 'images/light_red.png',
    LIGHT_YELLOW: 'images/light_yellow.png',
    LIGHT_GREEN: 'images/light_green.png',
    LIGHT_BLUE: 'images/light_blue.png',
    HANDLE_HORIZONTAL: 'images/tap_horizontal.png',
    HANDLE_VERTICAL: 'images/tap_vertical.png'
  },
  
  // Game element positions
  POSITIONS: {
    LIGHTS: [
      { x: 323, y: 484 + 5 },
      { x: 413, y: 483 + 3 },
      { x: 503, y: 482 + 1 },
      { x: 594, y: 481 }
    ],
    HANDLE_TOPLEFT: { x: 311, y: 666 },
    HANDLE_BOTTOMRIGHT: { x: 589, y: 1030 }
  }
};

/**
 * Main game class that manages the Fridge Puzzle game
 */
class FridgeGame {
  constructor() {
    this.gameState = {
      handles: [],
      lightElements: [],
      handleElements: [],
      isWinning: false
    };
    
    this.container = null;
    this.winModal = null;
    
    this.init();
  }
  
  /**
   * Initialize the game
   */
  init() {
    this.container = document.getElementById('game-container');
    this.winModal = document.getElementById('win-modal');
    
    this.setupEventListeners();
    this.resizeGame();
    this.startNewGame();
  }
  
  /**
   * Set up event listeners for window events
   */
  setupEventListeners() {
    // Prevent scrolling on mobile
    document.body.addEventListener('touchmove', (e) => e.preventDefault(), { passive: false });
    
    // Handle window resize and orientation changes
    window.addEventListener('resize', () => this.resizeGame());
    window.addEventListener('orientationchange', () => {
      setTimeout(() => this.resizeGame(), 100);
    });
  }
  
  /**
   * Start a new game
   */
  startNewGame() {
    this.initializeGameState();
    this.clearGameElements();
    this.renderGame();
    this.shuffleGame();
    this.updateLights();
  }
  
  /**
   * Initialize the game state with all handles horizontal
   */
  initializeGameState() {
    this.gameState.handles = [];
    for (let row = 0; row < GAME_CONFIG.GRID_SIZE; row++) {
      this.gameState.handles[row] = [];
      for (let col = 0; col < GAME_CONFIG.GRID_SIZE; col++) {
        this.gameState.handles[row][col] = true; // true = horizontal
      }
    }
    
    this.gameState.lightElements = [];
    this.gameState.handleElements = [];
    this.gameState.isWinning = false;
  }
  
  /**
   * Clear existing game elements from the DOM
   */
  clearGameElements() {
    const existingLights = this.container.querySelectorAll('.light');
    const existingHandles = this.container.querySelectorAll('.handle');
    
    existingLights.forEach(el => el.remove());
    existingHandles.forEach(el => el.remove());
  }
  
  /**
   * Calculate positions for all handles in the 4x4 grid
   */
  calculateHandlePositions() {
    const positions = [];
    const { HANDLE_TOPLEFT, HANDLE_BOTTOMRIGHT } = GAME_CONFIG.POSITIONS;
    
    for (let row = 0; row < GAME_CONFIG.GRID_SIZE; row++) {
      for (let col = 0; col < GAME_CONFIG.GRID_SIZE; col++) {
        // Linear interpolation between top-left and bottom-right
        const x = HANDLE_TOPLEFT.x + (HANDLE_BOTTOMRIGHT.x - HANDLE_TOPLEFT.x) * (col / 3);
        const y = HANDLE_TOPLEFT.y + (HANDLE_BOTTOMRIGHT.y - HANDLE_TOPLEFT.y) * (row / 3);
        positions.push({ x, y, row, col });
      }
    }
    
    return positions;
  }
  
  /**
   * Render all game elements (lights and handles)
   */
  renderGame() {
    this.renderLights();
    this.renderHandles();
  }
  
  /**
   * Render the light elements
   */
  renderLights() {
    GAME_CONFIG.POSITIONS.LIGHTS.forEach((pos, index) => {
      const lightElement = this.createLightElement(pos, index);
      this.container.appendChild(lightElement);
      this.gameState.lightElements.push(lightElement);
    });
  }
  
  /**
   * Create a light element
   */
  createLightElement(position, index) {
    const element = document.createElement('img');
    element.src = GAME_CONFIG.IMAGES.LIGHT_RED; // Start with red
    element.alt = `Light ${index + 1}`;
    element.className = 'light';
    element.style.left = `${position.x - GAME_CONFIG.LIGHT_SIZE / 2}px`;
    element.style.top = `${position.y - GAME_CONFIG.LIGHT_SIZE / 2}px`;
    element.draggable = false;
    return element;
  }
  
  /**
   * Render the handle elements
   */
  renderHandles() {
    const handlePositions = this.calculateHandlePositions();
    
    handlePositions.forEach((pos) => {
      const handleElement = this.createHandleElement(pos);
      this.container.appendChild(handleElement);
      this.gameState.handleElements.push(handleElement);
    });
  }
  
  /**
   * Create a handle element
   */
  createHandleElement(position) {
    const { row, col } = position;
    const isHorizontal = this.gameState.handles[row][col];
    
    const element = document.createElement('img');
    element.src = isHorizontal ? GAME_CONFIG.IMAGES.HANDLE_HORIZONTAL : GAME_CONFIG.IMAGES.HANDLE_VERTICAL;
    element.alt = `Handle ${row},${col}`;
    element.className = 'handle';
    element.style.left = `${position.x - GAME_CONFIG.HANDLE_SIZE / 2}px`;
    element.style.top = `${position.y - GAME_CONFIG.HANDLE_SIZE / 2}px`;
    element.draggable = false;
    element.dataset.row = row;
    element.dataset.col = col;
    
    element.addEventListener('click', () => this.handleClick(row, col));
    
    return element;
  }
  
  /**
   * Handle click on a game handle
   */
  handleClick(clickedRow, clickedCol) {
    if (this.gameState.isWinning) return;
    
    this.toggleHandles(clickedRow, clickedCol);
    this.updateHandleImages();
    this.updateLights();
    this.checkWinCondition();
  }
  
  /**
   * Toggle handles according to game rules
   */
  toggleHandles(clickedRow, clickedCol) {
    // Toggle the clicked handle
    this.gameState.handles[clickedRow][clickedCol] = !this.gameState.handles[clickedRow][clickedCol];
    
    // Toggle all handles in the same row (except the clicked one)
    for (let col = 0; col < GAME_CONFIG.GRID_SIZE; col++) {
      if (col !== clickedCol) {
        this.gameState.handles[clickedRow][col] = !this.gameState.handles[clickedRow][col];
      }
    }
    
    // Toggle all handles in the same column (except the clicked one)
    for (let row = 0; row < GAME_CONFIG.GRID_SIZE; row++) {
      if (row !== clickedRow) {
        this.gameState.handles[row][clickedCol] = !this.gameState.handles[row][clickedCol];
      }
    }
  }
  
  /**
   * Update handle images based on current state
   */
  updateHandleImages() {
    this.gameState.handleElements.forEach((element) => {
      const row = parseInt(element.dataset.row);
      const col = parseInt(element.dataset.col);
      const isHorizontal = this.gameState.handles[row][col];
      element.src = isHorizontal ? GAME_CONFIG.IMAGES.HANDLE_HORIZONTAL : GAME_CONFIG.IMAGES.HANDLE_VERTICAL;
    });
  }
  
  /**
   * Update light colors based on column states
   */
  updateLights() {
    for (let col = 0; col < GAME_CONFIG.GRID_SIZE; col++) {
      const allHorizontal = this.isColumnAllHorizontal(col);
      const lightElement = this.gameState.lightElements[col];
      lightElement.src = allHorizontal ? GAME_CONFIG.IMAGES.LIGHT_GREEN : GAME_CONFIG.IMAGES.LIGHT_RED;
    }
  }
  
  /**
   * Check if all handles in a column are horizontal
   */
  isColumnAllHorizontal(col) {
    for (let row = 0; row < GAME_CONFIG.GRID_SIZE; row++) {
      if (!this.gameState.handles[row][col]) {
        return false;
      }
    }
    return true;
  }
  
  /**
   * Check if all handles are horizontal (win condition)
   */
  checkWinCondition() {
    const allHorizontal = this.gameState.handles.every(row => 
      row.every(handle => handle)
    );
    
    if (allHorizontal) {
      this.triggerWinSequence();
    }
  }
  
  /**
   * Trigger the winning sequence
   */
  triggerWinSequence() {
    this.gameState.isWinning = true;
    
    const lightColors = [
      GAME_CONFIG.IMAGES.LIGHT_YELLOW,
      GAME_CONFIG.IMAGES.LIGHT_RED,
      GAME_CONFIG.IMAGES.LIGHT_BLUE,
      GAME_CONFIG.IMAGES.LIGHT_GREEN
    ];
    
    // Start blinking lights with random colors
    const blinkIntervals = this.startLightBlinking(lightColors);
    
    // Stop blinking after animation duration and show modal
    setTimeout(() => {
      this.stopLightBlinking(blinkIntervals);
      this.showWinModal();
    }, GAME_CONFIG.WIN_ANIMATION_DURATION);
  }
  
  /**
   * Start the light blinking animation
   */
  startLightBlinking(colors) {
    const intervals = [];
    
    this.gameState.lightElements.forEach((light) => {
      light.classList.add('blinking');
      
      // Start each light with a random color immediately
      const initialColor = colors[Math.floor(Math.random() * colors.length)];
      light.src = initialColor;
      
      // Give each light its own independent timer with slightly different intervals
      const randomInterval = 600 + Math.random() * 400; // Between 600-1000ms
      const interval = setInterval(() => {
        const randomColor = colors[Math.floor(Math.random() * colors.length)];
        light.src = randomColor;
      }, randomInterval);
      
      intervals.push(interval);
    });
    
    return intervals;
  }
  
  /**
   * Stop the light blinking animation
   */
  stopLightBlinking(intervals) {
    intervals.forEach(interval => clearInterval(interval));
    
    this.gameState.lightElements.forEach(light => {
      light.classList.remove('blinking');
      light.src = GAME_CONFIG.IMAGES.LIGHT_GREEN; // Set all to green
    });
  }
  
  /**
   * Show the win modal
   */
  showWinModal() {
    this.winModal.style.display = 'block';
  }
  
  /**
   * Shuffle the game by performing random handle clicks
   */
  shuffleGame() {
    for (let i = 0; i < GAME_CONFIG.SHUFFLE_MOVES; i++) {
      const randomRow = Math.floor(Math.random() * GAME_CONFIG.GRID_SIZE);
      const randomCol = Math.floor(Math.random() * GAME_CONFIG.GRID_SIZE);
      
      // Perform the same logic as handleClick but without updating visuals
      this.toggleHandles(randomRow, randomCol);
    }
    
    // Update visuals after shuffling
    this.updateHandleImages();
  }
  
  /**
   * Restart the game
   */
  restart() {
    this.winModal.style.display = 'none';
    this.startNewGame();
  }
  
  /**
   * Center and scale the game container to fit the viewport
   */
  resizeGame() {
    const scale = Math.min(
      window.innerWidth / GAME_CONFIG.FRIDGE_WIDTH,
      window.innerHeight / GAME_CONFIG.FRIDGE_HEIGHT
    );
    
    this.container.style.transform = `scale(${scale})`;
    
    const left = (window.innerWidth - GAME_CONFIG.FRIDGE_WIDTH * scale) / 2;
    const top = (window.innerHeight - GAME_CONFIG.FRIDGE_HEIGHT * scale) / 2;
    
    this.container.style.left = `${left}px`;
    this.container.style.top = `${top}px`;
  }
}

// Global game instance
let fridgeGame;

/**
 * Initialize the game when the page loads
 */
window.addEventListener('load', () => {
  fridgeGame = new FridgeGame();
});

/**
 * Global function to restart the game (called from HTML button)
 */
function restartGame() {
  fridgeGame.restart();
} 