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
  direction: 'horizontal' | 'vertical' | 'diagonal-down' | 'diagonal-up';
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

const GRID_SIZE = 9;
const DIRECTIONS = [
  { name: 'horizontal', dr: 0, dc: 1 },
  { name: 'vertical', dr: 1, dc: 0 },
  { name: 'diagonal-down', dr: 1, dc: 1 },
  { name: 'diagonal-up', dr: -1, dc: 1 }
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
    // Reset game state
    this.gameState = this.initializeGame();
    
    // Shuffle words to randomize placement
    const shuffledWords = [...words].sort(() => Math.random() - 0.5);
    
    // Place each word
    for (const word of shuffledWords) {
      let placed = false;
      let attempts = 0;
      const maxAttempts = 100;
      
      while (!placed && attempts < maxAttempts) {
        const direction = DIRECTIONS[Math.floor(Math.random() * DIRECTIONS.length)];
        const startRow = Math.floor(Math.random() * GRID_SIZE);
        const startCol = Math.floor(Math.random() * GRID_SIZE);
        
        if (this.canPlaceWord(word, startRow, startCol, direction)) {
          const placement = this.placeWord(word, startRow, startCol, direction);
          this.gameState.words.push(placement);
          placed = true;
        }
        
        attempts++;
      }
    }
    
    // Fill empty spaces with random letters
    this.fillEmptySpaces();
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
        // Verify that the selection path matches the word placement
        if (this.selectionMatchesWord(word)) {
          return word;
        }
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
    return { ...this.gameState };
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
}
