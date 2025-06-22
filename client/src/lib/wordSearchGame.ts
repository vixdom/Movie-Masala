export interface GridCell {
  letter: string;
  row: number;
  col: number;
  isPartOfWord?: boolean;
  wordId?: string;
  isFound?: boolean;
  isSelected?: boolean;
}

export interface WordPlacement {
  word: string;
  startRow: number;
  startCol: number;
  direction: 'horizontal' | 'horizontal-reverse' | 'vertical' | 'vertical-reverse' | 'diagonal-down' | 'diagonal-up' | 'diagonal-down-left' | 'diagonal-up-left';
  positions: { row: number; col: number }[];
  id: string;
}

export interface GameState {
  grid: GridCell[][];
  words: WordPlacement[];
  foundWords: Set<string>;
  score: number;
  isComplete: boolean;
  selectedCells: { row: number; col: number }[];
  isSelecting: boolean;
}

const GRID_SIZE = 12;
const DIRECTIONS = [
  { name: 'horizontal', dr: 0, dc: 1 },           // left to right
  { name: 'horizontal-reverse', dr: 0, dc: -1 },  // right to left
  { name: 'vertical', dr: 1, dc: 0 },             // top to bottom
  { name: 'vertical-reverse', dr: -1, dc: 0 },    // bottom to top
  { name: 'diagonal-down', dr: 1, dc: 1 },        // diagonal down-right
  { name: 'diagonal-up', dr: -1, dc: 1 },         // diagonal up-right
  { name: 'diagonal-down-left', dr: 1, dc: -1 },  // diagonal down-left
  { name: 'diagonal-up-left', dr: -1, dc: -1 }    // diagonal up-left
] as const;

export class WordSearchGame {
  private gameState: GameState;
  
  constructor() {
    this.gameState = this.initializeGame();
  }

  private initializeGame(): GameState {
    return {
      grid: this.createEmptyGrid(),
      words: [],
      foundWords: new Set(),
      score: 0,
      isComplete: false,
      selectedCells: [],
      isSelecting: false
    };
  }

  private createEmptyGrid(): GridCell[][] {
    const grid: GridCell[][] = [];
    for (let row = 0; row < GRID_SIZE; row++) {
      grid[row] = [];
      for (let col = 0; col < GRID_SIZE; col++) {
        grid[row][col] = {
          letter: '',
          row,
          col,
          isPartOfWord: false,
          isFound: false,
          isSelected: false
        };
      }
    }
    return grid;
  }

  private canPlaceWord(word: string, startRow: number, startCol: number, direction: typeof DIRECTIONS[number]): boolean {
    const { dr, dc } = direction;
    
    // Check if word fits in grid
    const endRow = startRow + (word.length - 1) * dr;
    const endCol = startCol + (word.length - 1) * dc;
    
    if (endRow < 0 || endRow >= GRID_SIZE || endCol < 0 || endCol >= GRID_SIZE) {
      return false;
    }
    
    // Check for conflicts with existing letters
    for (let i = 0; i < word.length; i++) {
      const row = startRow + i * dr;
      const col = startCol + i * dc;
      const currentLetter = this.gameState.grid[row][col].letter;
      
      if (currentLetter !== '' && currentLetter !== word[i]) {
        return false;
      }
    }
    
    return true;
  }

  private placeWord(word: string, startRow: number, startCol: number, direction: typeof DIRECTIONS[number]): WordPlacement {
    const { dr, dc } = direction;
    const positions: { row: number; col: number }[] = [];
    const wordId = `${word}-${Date.now()}-${Math.random()}`;
    
    for (let i = 0; i < word.length; i++) {
      const row = startRow + i * dr;
      const col = startCol + i * dc;
      
      this.gameState.grid[row][col].letter = word[i];
      this.gameState.grid[row][col].isPartOfWord = true;
      this.gameState.grid[row][col].wordId = wordId;
      
      positions.push({ row, col });
    }
    
    return {
      word,
      startRow,
      startCol,
      direction: direction.name as WordPlacement['direction'],
      positions,
      id: wordId
    };
  }

  private fillEmptySpaces(): void {
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    
    for (let row = 0; row < GRID_SIZE; row++) {
      for (let col = 0; col < GRID_SIZE; col++) {
        if (this.gameState.grid[row][col].letter === '') {
          this.gameState.grid[row][col].letter = letters[Math.floor(Math.random() * letters.length)];
        }
      }
    }
  }

  public generateGrid(words: string[]): void {
    let maxRetries = 10; // More retries for better success
    let bestResult: { placedWords: WordPlacement[], placedCount: number } = { placedWords: [], placedCount: 0 };
    
    for (let retry = 0; retry < maxRetries; retry++) {
      // Reset game state
      this.gameState = this.initializeGame();
      
      // Sort words by length (shorter first for easier placement)
      const sortedWords = [...words].sort((a, b) => a.length - b.length);
      
      // Enforce direction variety with guaranteed distribution
      const directionAssignments = this.getBalancedDirections(sortedWords);
      
      // Place each word systematically
      for (let i = 0; i < sortedWords.length; i++) {
        const word = sortedWords[i];
        const preferredDirections = directionAssignments[i];
        let placed = false;
        
        // Try each preferred direction systematically
        for (const direction of preferredDirections) {
          if (placed) break;
          
          // Try different starting positions for this direction
          const positions = this.generatePositions(word.length, direction);
          
          for (const pos of positions) {
            if (this.canPlaceWord(word, pos.row, pos.col, direction)) {
              const placement = this.placeWord(word, pos.row, pos.col, direction);
              this.gameState.words.push(placement);
              placed = true;
              break;
            }
          }
        }
        
        // If still not placed, try any direction
        if (!placed) {
          for (const direction of DIRECTIONS) {
            if (placed) break;
            const positions = this.generatePositions(word.length, direction);
            
            for (const pos of positions) {
              if (this.canPlaceWord(word, pos.row, pos.col, direction)) {
                const placement = this.placeWord(word, pos.row, pos.col, direction);
                this.gameState.words.push(placement);
                placed = true;
                break;
              }
            }
          }
        }
      }
      
      // Check if this attempt is better
      if (this.gameState.words.length > bestResult.placedCount) {
        bestResult = {
          placedWords: [...this.gameState.words],
          placedCount: this.gameState.words.length
        };
      }
      
      // If we placed all words, we're done
      if (this.gameState.words.length === words.length) {
        break;
      }
    }
    
    // Use the best result
    this.gameState.words = bestResult.placedWords;
    
    console.log(`Placed ${this.gameState.words.length} out of ${words.length} words`);
    
    // Verify and fix coordinate consistency
    this.verifyAndFixCoordinates();
    
    // Fill empty spaces with random letters
    this.fillEmptySpaces();
  }
  
  private verifyAndFixCoordinates(): void {
    console.log('Verifying coordinate consistency and line straightness...');
    
    // Re-apply word placements to ensure grid matches stored positions
    for (const wordPlacement of this.gameState.words) {
      const { word, positions, id, direction } = wordPlacement;
      
      // Verify this is a proper straight line
      this.validateStraightLine(word, positions, direction);
      
      console.log(`Verifying word: ${word} in ${direction} direction at positions:`, positions);
      
      // Clear any existing wordId for this word first
      for (let row = 0; row < GRID_SIZE; row++) {
        for (let col = 0; col < GRID_SIZE; col++) {
          if (this.gameState.grid[row][col].wordId === id) {
            this.gameState.grid[row][col].wordId = undefined;
            this.gameState.grid[row][col].isPartOfWord = false;
          }
        }
      }
      
      // Re-apply the word to the grid at its stored positions
      for (let i = 0; i < positions.length && i < word.length; i++) {
        const pos = positions[i];
        if (pos.row >= 0 && pos.row < GRID_SIZE && pos.col >= 0 && pos.col < GRID_SIZE) {
          this.gameState.grid[pos.row][pos.col].letter = word[i];
          this.gameState.grid[pos.row][pos.col].wordId = id;
          this.gameState.grid[pos.row][pos.col].isPartOfWord = true;
        }
      }
      
      // Verify the word can be read from the grid
      let actualWord = '';
      for (const pos of positions) {
        if (pos.row >= 0 && pos.row < GRID_SIZE && pos.col >= 0 && pos.col < GRID_SIZE) {
          actualWord += this.gameState.grid[pos.row][pos.col].letter;
        }
      }
      
      console.log(`Word: ${word}, Grid reads: ${actualWord}, Match: ${actualWord === word}, Straight line: ${this.isStraightLine(positions)}`);
    }
  }
  
  private validateStraightLine(word: string, positions: {row: number, col: number}[], direction: string): boolean {
    if (positions.length < 2) return true;
    
    const firstPos = positions[0];
    const secondPos = positions[1];
    const deltaRow = secondPos.row - firstPos.row;
    const deltaCol = secondPos.col - firstPos.col;
    
    // Check if all subsequent positions follow the same pattern
    for (let i = 2; i < positions.length; i++) {
      const expectedRow = firstPos.row + (deltaRow * i);
      const expectedCol = firstPos.col + (deltaCol * i);
      
      if (positions[i].row !== expectedRow || positions[i].col !== expectedCol) {
        console.error(`Line validation failed for ${word}: position ${i} should be (${expectedRow}, ${expectedCol}) but got (${positions[i].row}, ${positions[i].col})`);
        return false;
      }
    }
    
    return true;
  }
  
  private isStraightLine(positions: {row: number, col: number}[]): boolean {
    if (positions.length < 2) return true;
    
    const deltaRow = positions[1].row - positions[0].row;
    const deltaCol = positions[1].col - positions[0].col;
    
    // Validate that delta values are consistent with expected direction patterns
    // Only allow: (0,1), (0,-1), (1,0), (-1,0), (1,1), (1,-1), (-1,1), (-1,-1)
    const validDirections = [
      [0, 1], [0, -1],    // horizontal
      [1, 0], [-1, 0],    // vertical  
      [1, 1], [1, -1],    // diagonal down
      [-1, 1], [-1, -1]   // diagonal up
    ];
    
    const isValidDirection = validDirections.some(([dr, dc]) => dr === deltaRow && dc === deltaCol);
    if (!isValidDirection) {
      console.error(`Invalid direction pattern: deltaRow=${deltaRow}, deltaCol=${deltaCol}`);
      return false;
    }
    
    // Check if all movements are consistent with this direction
    for (let i = 1; i < positions.length; i++) {
      const expectedRow = positions[0].row + (deltaRow * i);
      const expectedCol = positions[0].col + (deltaCol * i);
      
      if (positions[i].row !== expectedRow || positions[i].col !== expectedCol) {
        console.error(`Position ${i} deviation: expected (${expectedRow}, ${expectedCol}), got (${positions[i].row}, ${positions[i].col})`);
        return false;
      }
    }
    
    return true;
  }
  
  private generatePositions(wordLength: number, direction: typeof DIRECTIONS[number]): {row: number, col: number}[] {
    const positions: {row: number, col: number}[] = [];
    const { dr, dc } = direction;
    
    // Calculate valid starting positions for this word length and direction
    for (let row = 0; row < GRID_SIZE; row++) {
      for (let col = 0; col < GRID_SIZE; col++) {
        const endRow = row + (wordLength - 1) * dr;
        const endCol = col + (wordLength - 1) * dc;
        
        if (endRow >= 0 && endRow < GRID_SIZE && endCol >= 0 && endCol < GRID_SIZE) {
          positions.push({ row, col });
        }
      }
    }
    
    // Shuffle positions for variety
    return positions.sort(() => Math.random() - 0.5);
  }
  
  private getBalancedDirections(words: string[]): typeof DIRECTIONS[number][][] {
    const assignments: typeof DIRECTIONS[number][][] = [];
    
    // Define direction categories for guaranteed variety
    const horizontalDirs = DIRECTIONS.filter(d => d.name.includes('horizontal'));
    const verticalDirs = DIRECTIONS.filter(d => d.name.includes('vertical'));
    const diagonalDirs = DIRECTIONS.filter(d => d.name.includes('diagonal'));
    
    // Ensure we have at least 2-3 diagonal words out of 10 total words
    const minDiagonals = Math.max(2, Math.floor(words.length * 0.25)); // At least 25% diagonal
    const minHorizontals = Math.max(2, Math.floor(words.length * 0.3)); // At least 30% horizontal
    const minVerticals = Math.max(2, Math.floor(words.length * 0.25)); // At least 25% vertical
    
    let diagonalCount = 0;
    let horizontalCount = 0;
    let verticalCount = 0;
    
    for (let i = 0; i < words.length; i++) {
      let preferredDirections: typeof DIRECTIONS[number][] = [];
      
      // Force diagonal placement for first few words to guarantee diagonal variety
      if (diagonalCount < minDiagonals) {
        preferredDirections = [...diagonalDirs, ...horizontalDirs, ...verticalDirs];
        diagonalCount++;
      }
      // Force horizontal placement
      else if (horizontalCount < minHorizontals) {
        preferredDirections = [...horizontalDirs, ...verticalDirs, ...diagonalDirs];
        horizontalCount++;
      }
      // Force vertical placement
      else if (verticalCount < minVerticals) {
        preferredDirections = [...verticalDirs, ...horizontalDirs, ...diagonalDirs];
        verticalCount++;
      }
      // For remaining words, use balanced approach
      else {
        // Shuffle all directions for variety
        preferredDirections = [...DIRECTIONS].sort(() => Math.random() - 0.5);
      }
      
      assignments.push(preferredDirections);
    }
    
    return assignments;
  }
  


  public startSelection(row: number, col: number): void {
    this.gameState.isSelecting = true;
    this.gameState.selectedCells = [{ row, col }];
    this.updateGridSelection();
  }

  public updateSelection(row: number, col: number): void {
    if (!this.gameState.isSelecting) return;
    
    const start = this.gameState.selectedCells[0];
    if (!start) return;
    
    // Calculate selection path
    const cells = this.getSelectionPath(start.row, start.col, row, col);
    this.gameState.selectedCells = cells;
    this.updateGridSelection();
  }

  public endSelection(): boolean {
    this.gameState.isSelecting = false;
    
    // Check if selection forms a valid word
    const selectedWord = this.getSelectedWord();
    const foundWord = this.checkWordMatch(selectedWord);
    
    if (foundWord) {
      this.markWordAsFound(foundWord);
      this.gameState.score += foundWord.word.length * 10;
      this.checkGameComplete();
      this.clearSelection();
      return true;
    } else {
      this.clearSelection();
      return false;
    }
  }

  private getSelectionPath(startRow: number, startCol: number, endRow: number, endCol: number): { row: number; col: number }[] {
    const cells: { row: number; col: number }[] = [];
    
    const deltaRow = endRow - startRow;
    const deltaCol = endCol - startCol;
    
    // Determine if selection is in a valid direction (horizontal, vertical, or diagonal)
    let stepRow = 0;
    let stepCol = 0;
    let length = 0;
    
    if (deltaRow === 0) {
      // Horizontal
      stepCol = deltaCol > 0 ? 1 : -1;
      length = Math.abs(deltaCol) + 1;
    } else if (deltaCol === 0) {
      // Vertical
      stepRow = deltaRow > 0 ? 1 : -1;
      length = Math.abs(deltaRow) + 1;
    } else if (Math.abs(deltaRow) === Math.abs(deltaCol)) {
      // Diagonal
      stepRow = deltaRow > 0 ? 1 : -1;
      stepCol = deltaCol > 0 ? 1 : -1;
      length = Math.abs(deltaRow) + 1;
    } else {
      // Invalid direction, just return start and end
      return [{ row: startRow, col: startCol }, { row: endRow, col: endCol }];
    }
    
    // Generate path
    for (let i = 0; i < length; i++) {
      const row = startRow + i * stepRow;
      const col = startCol + i * stepCol;
      
      if (row >= 0 && row < GRID_SIZE && col >= 0 && col < GRID_SIZE) {
        cells.push({ row, col });
      }
    }
    
    return cells;
  }

  private updateGridSelection(): void {
    // Clear all selections
    for (let row = 0; row < GRID_SIZE; row++) {
      for (let col = 0; col < GRID_SIZE; col++) {
        this.gameState.grid[row][col].isSelected = false;
      }
    }
    
    // Mark selected cells
    for (const cell of this.gameState.selectedCells) {
      if (cell.row >= 0 && cell.row < GRID_SIZE && cell.col >= 0 && cell.col < GRID_SIZE) {
        this.gameState.grid[cell.row][cell.col].isSelected = true;
      }
    }
  }

  private getSelectedWord(): string {
    return this.gameState.selectedCells
      .map(cell => this.gameState.grid[cell.row][cell.col].letter)
      .join('');
  }

  private checkWordMatch(selectedWord: string): WordPlacement | null {
    // Check both forward and backward
    for (const word of this.gameState.words) {
      if (this.gameState.foundWords.has(word.id)) continue;
      
      if (word.word === selectedWord || word.word === selectedWord.split('').reverse().join('')) {
        // Simply check if the selected word matches - remove strict position matching for now
        return word;
      }
    }
    
    return null;
  }

  private selectionMatchesWord(word: WordPlacement): boolean {
    if (this.gameState.selectedCells.length !== word.positions.length) {
      return false;
    }
    
    // Check if selected cells match word positions (forward or backward)
    const selectedSet = new Set(this.gameState.selectedCells.map(cell => `${cell.row}-${cell.col}`));
    const wordSet = new Set(word.positions.map(pos => `${pos.row}-${pos.col}`));
    
    if (selectedSet.size !== wordSet.size) return false;
    
    // Convert Set to Array to iterate
    const selectedArray = Array.from(selectedSet);
    for (const pos of selectedArray) {
      if (!wordSet.has(pos)) return false;
    }
    
    return true;
  }

  private markWordAsFound(word: WordPlacement): void {
    this.gameState.foundWords.add(word.id);
    
    // Mark cells as found
    for (const pos of word.positions) {
      this.gameState.grid[pos.row][pos.col].isFound = true;
    }
  }

  private clearSelection(): void {
    this.gameState.selectedCells = [];
    this.updateGridSelection();
  }

  private checkGameComplete(): void {
    this.gameState.isComplete = this.gameState.foundWords.size === this.gameState.words.length;
  }

  public getGameState(): GameState {
    return { 
      ...this.gameState,
      foundWords: new Set(this.gameState.foundWords) // Deep copy the Set
    };
  }

  public getFoundWords(): WordPlacement[] {
    return this.gameState.words.filter(word => this.gameState.foundWords.has(word.id));
  }

  public getRemainingWords(): WordPlacement[] {
    return this.gameState.words.filter(word => !this.gameState.foundWords.has(word.id));
  }

  public resetGame(): void {
    this.gameState = this.initializeGame();
  }

  public getCurrentSelectionWord(): string {
    if (!this.gameState.isSelecting || this.gameState.selectedCells.length === 0) {
      return '';
    }
    
    // Get the letters from selected cells in order
    return this.gameState.selectedCells
      .map(cell => this.gameState.grid[cell.row][cell.col].letter)
      .join('');
  }
}
