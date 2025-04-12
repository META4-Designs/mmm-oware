/**
 * Mansa's Marbles - Game Board Representation
 * 
 * This file implements the core data structure for the Oware game board.
 * The board consists of 12 houses (6 per player) and follows the Oware Nam Nam rules.
 */

class OwareBoard {
  /**
   * Creates a new Oware game board
   */
  constructor() {
    // Initialize the board with 4 seeds in each house
    this.houses = Array(12).fill(4);
    
    // Player indices: 0 for south (bottom) player, 1 for north (top) player
    // Houses 0-5 belong to player 0, houses 6-11 belong to player 1
    this.currentPlayer = 0;
    
    // Initialize score counters
    this.scores = [0, 0];
    
    // Track captured territories (for territory gain between rounds)
    // Initially, each player owns their 6 houses
    this.territories = [
      [0, 1, 2, 3, 4, 5],    // Player 0's territory
      [6, 7, 8, 9, 10, 11]    // Player 1's territory
    ];
    
    // Game state flags
    this.gameOver = false;
    this.roundOver = false;
  }
  
  /**
   * Returns the current state of the board
   * @returns {Object} The current board state
   */
  getState() {
    return {
      houses: [...this.houses],
      currentPlayer: this.currentPlayer,
      scores: [...this.scores],
      territories: [
        [...this.territories[0]],
        [...this.territories[1]]
      ],
      gameOver: this.gameOver,
      roundOver: this.roundOver
    };
  }
  
  /**
   * Sets the board to a specific state
   * @param {Object} state - The state to set the board to
   */
  setState(state) {
    if (!state) return;
    
    this.houses = [...state.houses];
    this.currentPlayer = state.currentPlayer;
    this.scores = [...state.scores];
    this.territories = [
      [...state.territories[0]],
      [...state.territories[1]]
    ];
    this.gameOver = state.gameOver;
    this.roundOver = state.roundOver;
  }
  
  /**
   * Resets the board to the initial state
   */
  reset() {
    this.houses = Array(12).fill(4);
    this.currentPlayer = 0;
    this.scores = [0, 0];
    this.territories = [
      [0, 1, 2, 3, 4, 5],
      [6, 7, 8, 9, 10, 11]
    ];
    this.gameOver = false;
    this.roundOver = false;
  }
  
  /**
   * Checks if a move is valid for the current player
   * @param {number} houseIndex - The index of the house to play from (0-11)
   * @returns {boolean} Whether the move is valid
   */
  isValidMove(houseIndex) {
    // Check if game is over
    if (this.gameOver) return false;
    
    // Check if house index is valid
    if (houseIndex < 0 || houseIndex > 11) return false;
    
    // Check if the house belongs to the current player
    const playerHouses = this.currentPlayer === 0 ? [0, 1, 2, 3, 4, 5] : [6, 7, 8, 9, 10, 11];
    if (!playerHouses.includes(houseIndex)) return false;
    
    // Check if the house has seeds
    if (this.houses[houseIndex] === 0) return false;
    
    return true;
  }
  
  /**
   * Returns the valid moves for the current player
   * @returns {Array} Array of valid house indices
   */
  getValidMoves() {
    const playerHouses = this.currentPlayer === 0 ? [0, 1, 2, 3, 4, 5] : [6, 7, 8, 9, 10, 11];
    return playerHouses.filter(houseIndex => this.houses[houseIndex] > 0);
  }
  
  /**
   * Switches to the next player's turn
   */
  switchPlayer() {
    this.currentPlayer = 1 - this.currentPlayer; // Toggle between 0 and 1
  }
  
  /**
   * Checks if the round is over (8 or fewer seeds remain on the board)
   * @returns {boolean} Whether the round is over
   */
  checkRoundOver() {
    const totalSeeds = this.houses.reduce((sum, seeds) => sum + seeds, 0);
    return totalSeeds <= 8;
  }
  
  /**
   * Checks if the game is over (one player owns all houses)
   * @returns {boolean} Whether the game is over
   */
  checkGameOver() {
    return this.territories[0].length === 12 || this.territories[1].length === 12;
  }
  
  /**
   * Returns a string representation of the board
   * @returns {string} String representation of the board
   */
  toString() {
    const northHouses = this.houses.slice(6, 12).reverse().map(seeds => `[${seeds}]`).join(' ');
    const southHouses = this.houses.slice(0, 6).map(seeds => `[${seeds}]`).join(' ');
    
    return `Player 1 (North): ${this.scores[1]}\n` +
           `  ${northHouses}\n` +
           `${southHouses}\n` +
           `Player 0 (South): ${this.scores[0]}`;
  }
}

// Export the OwareBoard class if using modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = OwareBoard;
}
