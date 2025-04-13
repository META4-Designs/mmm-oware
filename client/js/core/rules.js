/**
 * Mansa's Marbles - Game Rules Implementation
 * 
 * This file implements the rules of Oware Nam Nam, including:
 * - Seed sowing (anticlockwise)
 * - "Laps" rule [cite: 10-13]
 * - Capture logic (capture-on-four, last-seed rule) [cite: 15-19]
 * - Turn ending logic
 * - End-of-round logic
 * - Territory gain logic
 */

class OwareRules {
  /**
   * Creates a new rules handler for Oware
   * @param {OwareBoard} board - The game board to operate on
   */
  constructor(board) {
    this.board = board;
  }
  
  /**
   * Executes a move from the specified house
   * @param {number} houseIndex - The index of the house to play from (0-11)
   * @returns {Object} Move result containing captures and next player
   */
  makeMove(houseIndex) {
    // Check if the move is valid
    if (!this.board.isValidMove(houseIndex)) {
      return { valid: false, message: "Invalid move" };
    }
    
    // Get the number of seeds in the selected house
    const seedCount = this.board.houses[houseIndex];
    
    // Clear the selected house
    this.board.houses[houseIndex] = 0;
    
    // Sow the seeds anticlockwise
    const lastHouse = this.sowSeeds(houseIndex, seedCount);
    
    // Check for captures
    const captures = this.checkCaptures(lastHouse);
    
    // Add captures to the current player's score
    this.board.scores[this.board.currentPlayer] += captures.seeds;
    
    // Check if the round is over
    if (this.board.checkRoundOver()) {
      this.board.roundOver = true;
      this.handleRoundEnd();
    }
    
    // Check if the game is over
    if (this.board.checkGameOver()) {
      this.board.gameOver = true;
    }
    
    // Switch to the next player if the round isn't over
    if (!this.board.roundOver) {
      this.board.switchPlayer();
    }
    
    return {
      valid: true,
      lastHouse,
      captures,
      roundOver: this.board.roundOver,
      gameOver: this.board.gameOver,
      nextPlayer: this.board.currentPlayer
    };
  }
  
  /**
   * Sows seeds from a house in an anticlockwise direction
   * Implements the "Laps" rule [cite: 10-13]
   * @param {number} startHouse - The starting house index
   * @param {number} seedCount - The number of seeds to sow
   * @returns {number} The index of the last house where a seed was sown
   */
  sowSeeds(startHouse, seedCount) {
    let currentHouse = startHouse;
    let remainingSeeds = seedCount;
    
    while (remainingSeeds > 0) {
      // Move to the next house anticlockwise
      currentHouse = (currentHouse + 1) % 12;
      
      // Skip the starting house (Laps rule)
      if (currentHouse === startHouse) {
        continue;
      }
      
      // Add a seed to the current house
      this.board.houses[currentHouse]++;
      remainingSeeds--;
    }
    
    return currentHouse;
  }
  
  /**
   * Checks for captures after a move
   * Implements capture-on-four and last-seed rule [cite: 15-19]
   * @param {number} lastHouse - The index of the last house where a seed was sown
   * @returns {Object} Capture result containing the number of seeds captured and houses affected
   */
  checkCaptures(lastHouse) {
    const capturedSeeds = [];
    let totalCaptured = 0;
    
    // Get the opponent's houses
    const opponentHouses = this.board.currentPlayer === 0 
      ? [6, 7, 8, 9, 10, 11] 
      : [0, 1, 2, 3, 4, 5];
    
    // Start from the last house and move clockwise (opposite of sowing direction)
    // to check for consecutive houses with 2 or 4 seeds
    let currentHouse = lastHouse;
    
    // Only check opponent's houses
    while (opponentHouses.includes(currentHouse)) {
      const seedCount = this.board.houses[currentHouse];
      
      // Capture if the house has exactly 2 or 4 seeds
      if (seedCount === 2 || seedCount === 4) {
        capturedSeeds.push({ house: currentHouse, seeds: seedCount });
        totalCaptured += seedCount;
        this.board.houses[currentHouse] = 0;
        
        // Move to the next house clockwise (opposite of sowing direction)
        currentHouse = (currentHouse - 1 + 12) % 12;
      } else {
        // Stop checking if we encounter a house that doesn't have 2 or 4 seeds
        break;
      }
    }
    
    return {
      seeds: totalCaptured,
      houses: capturedSeeds
    };
  }
  
  /**
   * Handles the end of a round, including territory gains
   * Implements territory gain logic [cite: 23-29]
   */
  handleRoundEnd() {
    // Determine the winner of the round
    const roundWinner = this.board.scores[0] > this.board.scores[1] ? 0 : 1;
    const roundLoser = 1 - roundWinner;
    
    // If it's a tie, no territory changes
    if (this.board.scores[0] === this.board.scores[1]) {
      return;
    }
    
    // The winner gains one house from the loser's territory
    if (this.board.territories[roundLoser].length > 0) {
      // Take the first house from the loser's territory
      const gainedHouse = this.board.territories[roundLoser].shift();
      
      // Add it to the winner's territory
      this.board.territories[roundWinner].push(gainedHouse);
      
      // Sort the territories to keep them in order
      this.board.territories[roundWinner].sort((a, b) => a - b);
    }
    
    // Reset the board for the next round
    this.resetForNextRound();
  }
  
  /**
   * Resets the board for a new round
   */
  resetForNextRound() {
    // Reset houses to 4 seeds each
    this.board.houses = Array(12).fill(4);
    
    // Reset scores for the new round
    this.board.scores = [0, 0];
    
    // Reset round over flag
    this.board.roundOver = false;
    
    // Winner of the previous round goes first
    // (this is already set correctly since we didn't switch players after determining the round winner)
  }
  
  /**
   * Simulates a move without changing the actual board state
   * Useful for AI to evaluate potential moves
   * @param {number} houseIndex - The index of the house to play from
   * @returns {Object} The resulting board state after the move
   */
  simulateMove(houseIndex) {
    // Create a copy of the current board state
    const originalState = this.board.getState();
    
    // Make the move
    const result = this.makeMove(houseIndex);
    
    // Save the resulting state
    const resultState = this.board.getState();
    
    // Restore the original state
    this.board.setState(originalState);
    
    // Return the result
    return {
      resultState,
      moveResult: result
    };
  }
}

// Export the OwareRules class
export default OwareRules;
