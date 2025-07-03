# Fridge Puzzle

A browser-based puzzle game where players manipulate handles on a fridge to turn on lights and unlock the fridge door.

## 🎮 [Play the Game](https://bukov-ka.github.io/fridge-puzzle/)

## 📖 About

Fridge Puzzle is a simple yet engaging logic puzzle game built with HTML, CSS, and JavaScript. Players must manipulate a 4×4 grid of handles on a virtual fridge to turn all the lights green and "open" the fridge. The game features a beautiful kitchen aesthetic with responsive design that works on both desktop and mobile devices.

## 🎯 How to Play

1. **Objective**: Turn all 4 lights on the top panel green by making all handles in the grid horizontal
2. **Controls**: Click any handle in the 4×4 grid to rotate it
3. **Game Mechanics**: 
   - When you click a handle, it rotates from horizontal to vertical (or vice versa)
   - All other handles in the same row and column also rotate
   - A light turns **green** when all handles in its corresponding column are horizontal
   - A light remains **red** when any handle in its column is vertical
4. **Winning**: When all handles are horizontal (all lights green), you win!
   - Lights will blink in a colorful sequence for 5 seconds
   - A congratulations modal will appear
   - Click "OK" to start a new game

## ✨ Features

- **Responsive Design**: Works perfectly on desktop, tablet, and mobile devices
- **Beautiful Graphics**: Custom kitchen-themed artwork with detailed fridge imagery
- **Smooth Animations**: Winning sequence with colorful light blinking effects
- **Touch-Friendly**: Optimized for touch interactions on mobile devices
- **Auto-Shuffle**: Each game starts with a randomized puzzle (16 random moves)
- **Adaptive Scaling**: Game scales to fit any screen size while maintaining aspect ratio

## 🛠️ Technical Details

- **Frontend**: Pure HTML5, CSS3, and vanilla JavaScript
- **No Dependencies**: Runs entirely in the browser without external libraries
- **Image Assets**: High-quality PNG graphics (1024×1536 fridge background)
- **Mobile Optimized**: Prevents scrolling and handles orientation changes
- **Cross-Browser Compatible**: Works in all modern web browsers

## 📁 Project Structure

```
fridge-puzzle/
├── index.html          # Main HTML file
├── styles.css          # Game styling and responsive design
├── game.js             # Core game logic and mechanics
├── images/             # Game assets
│   ├── fridge.png      # Main fridge background (1024×1536)
│   ├── light_*.png     # Light assets (111×111 each)
│   └── tap_*.png       # Handle assets (110×110 each)
├── context.md          # Game design documentation
└── README.md           # This file
```

## 🚀 Setup & Development

### Running Locally

1. Clone the repository:
   ```bash
   git clone https://github.com/bukov-ka/fridge-puzzle.git
   cd fridge-puzzle
   ```

2. Serve the files using any local web server:
   ```bash
   # Using Python 3
   python -m http.server 8000
   
   # Using Node.js (if you have http-server installed)
   npx http-server
   
   # Or simply open index.html in your browser
   ```

3. Open your browser and navigate to `http://localhost:8000`

### Game Configuration

The game can be customized by modifying the `GAME_CONFIG` object in `game.js`:

```javascript
const GAME_CONFIG = {
  GRID_SIZE: 4,              // Size of the handle grid
  SHUFFLE_MOVES: 16,         // Number of random moves for shuffling
  WIN_ANIMATION_DURATION: 5000, // Win animation length in milliseconds
  // ... other configuration options
};
```

## 🎨 Game Assets

All game graphics are custom-designed and located in the `images/` folder:
- **Fridge Background**: Detailed kitchen scene with realistic fridge
- **Lights**: Four colored light indicators (red, yellow, green, blue)
- **Handles**: Horizontal and vertical handle orientations

## 🤝 Contributing

Contributions are welcome! Feel free to:
- Report bugs or suggest improvements
- Submit pull requests with enhancements
- Share feedback on game mechanics or design

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

*Enjoy solving the puzzle and opening the fridge! 🍕* 
