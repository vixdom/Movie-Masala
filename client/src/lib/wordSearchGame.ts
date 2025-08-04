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

  /**
   * Verifies that all words in the gameState.words array are correctly placed in the grid
   * @private
   */
  private _verifyAllWordsPlaced(): void {
    // Only log in development for better mobile performance
    if (process.env.NODE_ENV === 'development') {
      console.log('🔍 VERIFYING WORD PLACEMENT...');
    }
    
    let successfulPlacements = 0;
    let failedPlacements = 0;
    const issues: string[] = [];
    
    for (const wordPlacement of this.gameState.words) {
      const { word, positions, id, direction } = wordPlacement;
      
      // Reconstruct the word from grid positions
      let reconstructedWord = '';
      let positionIssues = false;
      
      for (let i = 0; i < positions.length; i++) {
        const pos = positions[i];
        
        // Check if position is within grid bounds
        if (pos.row < 0 || pos.row >= GRID_SIZE || pos.col < 0 || pos.col >= GRID_SIZE) {
          issues.push(`❌ ${word}: Position ${i} (${pos.row}, ${pos.col}) is out of grid bounds`);
          positionIssues = true;
          continue;
        }
        
        const gridLetter = this.gameState.grid[pos.row][pos.col].letter;
        reconstructedWord += gridLetter;
        
        // Check if the letter matches what it should be
        if (gridLetter !== word[i]) {
          issues.push(`❌ ${word}: Position ${i} should be '${word[i]}' but grid has '${gridLetter}' at (${pos.row}, ${pos.col})`);
          positionIssues = true;
        }
        
        // Check if the cell has the correct wordId
        const cellWordId = this.gameState.grid[pos.row][pos.col].wordId;
        if (cellWordId !== id) {
          issues.push(`⚠️ ${word}: Cell at (${pos.row}, ${pos.col}) has wordId '${cellWordId}' but should be '${id}'`);
        }
      }
      
      // Verify the reconstructed word matches the original
      if (reconstructedWord === word && !positionIssues) {
        successfulPlacements++;
        if (process.env.NODE_ENV === 'development') {
          console.log(`✅ ${word}: Successfully placed ${direction} at positions ${JSON.stringify(positions)}`);
        }
      } else {
        failedPlacements++;
        issues.push(`❌ ${word}: Expected '${word}' but reconstructed '${reconstructedWord}'`);
      }
      
      // Verify line straightness
      if (positions.length > 1) {
        const isValidLine = this.validateStraightLine(word, positions, direction);
        if (!isValidLine) {
          issues.push(`❌ ${word}: Positions do not form a valid straight line in ${direction} direction`);
        }
      }
    }
    
    // Summary report (only log in development)
    if (process.env.NODE_ENV === 'development') {
      console.log(`\n📊 WORD PLACEMENT VERIFICATION SUMMARY:`);
      console.log(`✅ Successfully placed: ${successfulPlacements} words`);
      console.log(`❌ Failed placements: ${failedPlacements} words`);
      console.log(`📈 Success rate: ${((successfulPlacements / this.gameState.words.length) * 100).toFixed(1)}%`);
      
      if (issues.length > 0) {
        console.log(`\n🚨 ISSUES FOUND:`);
        issues.forEach(issue => console.log(issue));
      } else {
        console.log(`\n🎉 ALL WORDS VERIFIED SUCCESSFULLY!`);
      }
      
      // Additional grid integrity check
      this._verifyGridIntegrity();
    }
  }

  /**
   * Performs additional integrity checks on the grid
   * @private
   */
  private _verifyGridIntegrity(): void {
    // Only log in development for better mobile performance
    if (process.env.NODE_ENV === 'development') {
      let emptyCells = 0;
      let wordCells = 0;
      let fillerCells = 0;
      const wordIds = new Set<string>();
      
      for (let row = 0; row < GRID_SIZE; row++) {
        for (let col = 0; col < GRID_SIZE; col++) {
          const cell = this.gameState.grid[row][col];
          
          if (cell.letter === '') {
            emptyCells++;
          } else if (cell.isPartOfWord && cell.wordId) {
            wordCells++;
            wordIds.add(cell.wordId);
          } else {
            fillerCells++;
          }
        }
      }
      
      console.log(`\n🔬 GRID INTEGRITY CHECK:`);
      console.log(`📊 Grid composition:`);
      console.log(`   • Word cells: ${wordCells}`);
      console.log(`   • Filler cells: ${fillerCells}`);
      console.log(`   • Empty cells: ${emptyCells}`);
      console.log(`🆔 Unique word IDs found: ${wordIds.size}`);
      console.log(`📝 Words to place: ${this.gameState.words.length}`);
      
      if (emptyCells > 0) {
        console.log(`⚠️ WARNING: ${emptyCells} empty cells found - grid may not be fully generated`);
      }
      
      if (wordIds.size !== this.gameState.words.length) {
        console.log(`⚠️ WARNING: Word ID count mismatch - expected ${this.gameState.words.length}, found ${wordIds.size}`);
      }
    }
  }

  public generateGrid(words: string[]): string[] {
    const targetWordCount = 10; // Exactly 10 words in the final game
    const maxDiagonalWords = 3; // Maximum number of diagonal words allowed
    
    // Shuffle the words and take exactly 10
    const selectedWords = [...words]
      .sort(() => Math.random() - 0.5)
      .slice(0, targetWordCount);
    
    let maxRetries = 20; // Increased retries for better success rate
    let bestResult: { 
      placedWords: WordPlacement[], 
      placedWordsStrings: string[], 
      placedCount: number,
      diagonalCount: number 
    } = { 
      placedWords: [], 
      placedWordsStrings: [],
      placedCount: 0,
      diagonalCount: 0
    };
    
    if (process.env.NODE_ENV === 'development') {
      console.log(`🎯 STARTING GRID GENERATION:`);
      console.log(`📝 Target words: ${targetWordCount} (max ${maxDiagonalWords} diagonal)`);
      console.log(`🎲 Selected words:`, selectedWords);
    }
    
    for (let retry = 0; retry < maxRetries; retry++) {
      // Reset game state
      this.gameState = this.initializeGame();
      
      // Track successfully placed words and diagonal count
      const successfullyPlacedWords: string[] = [];
      const placedWordObjects: WordPlacement[] = [];
      let diagonalWordsCount = 0;
      
      // Create a copy of the word pool for this attempt
      const availableWords = [...selectedWords];
      
      // Attempt to place exactly targetWordCount words
      for (let wordIndex = 0; wordIndex < targetWordCount && availableWords.length > 0; wordIndex++) {
        let wordPlaced = false;
        let attempts = 0;
        const maxWordAttempts = availableWords.length * 2; // Try harder to place each word
        
        while (!wordPlaced && attempts < maxWordAttempts && availableWords.length > 0) {
          // Take the next word from available words
          const currentWordIndex = attempts % availableWords.length;
          const currentWord = availableWords[currentWordIndex];
          
          // Get preferred directions based on current diagonal count
          const directionAssignments = this.getBalancedDirections(
            [currentWord], 
            diagonalWordsCount,
            maxDiagonalWords
          );
          const preferredDirections = directionAssignments[0];
          
          // Try to place this word
          for (const direction of preferredDirections) {
            if (wordPlaced) break;
            
            const positions = this.generatePositions(currentWord.length, direction);
            
            for (const pos of positions) {
              if (this.canPlaceWord(currentWord, pos.row, pos.col, direction)) {
                const placement = this.placeWord(currentWord, pos.row, pos.col, direction);
                placedWordObjects.push(placement);
                successfullyPlacedWords.push(currentWord);
                
                // Update diagonal count if this was a diagonal placement
                if (direction.name.includes('diagonal')) {
                  diagonalWordsCount++;
                }
                
                // Remove this word from available words
                availableWords.splice(currentWordIndex, 1);
                wordPlaced = true;
                break;
              }
            }
          }
          
          attempts++;
        }
        
        // If we couldn't place any word, this attempt failed
        if (!wordPlaced) {
          if (process.env.NODE_ENV === 'development') {
            console.log(`❌ Attempt ${retry + 1}: Could only place ${successfullyPlacedWords.length} words`);
          }
          break;
        }
      }
      
      // Update game state with placed words
      this.gameState.words = placedWordObjects;
      
      // Calculate score for this attempt (prioritize reaching target word count, then fewer diagonals)
      const score = (successfullyPlacedWords.length * 100) + 
                   (diagonalWordsCount <= maxDiagonalWords ? 50 : 0) - 
                   (Math.abs(diagonalWordsCount - maxDiagonalWords) * 10);
      
      const currentBestScore = (bestResult.placedCount * 100) + 
                             (bestResult.diagonalCount <= maxDiagonalWords ? 50 : 0) - 
                             (Math.abs(bestResult.diagonalCount - maxDiagonalWords) * 10);
      
      // Check if this attempt is better
      if (score > currentBestScore || 
          (score === currentBestScore && successfullyPlacedWords.length > bestResult.placedCount)) {
        bestResult = {
          placedWords: [...placedWordObjects],
          placedWordsStrings: [...successfullyPlacedWords],
          placedCount: successfullyPlacedWords.length,
          diagonalCount: diagonalWordsCount
        };
        
        if (process.env.NODE_ENV === 'development') {
          console.log(`✅ Attempt ${retry + 1}: Placed ${successfullyPlacedWords.length} words ` +
                     `(${diagonalWordsCount} diagonal)`);
        }
      }
      
      // If we achieved the target with correct diagonal count, we're done
      if (successfullyPlacedWords.length === targetWordCount && 
          diagonalWordsCount <= maxDiagonalWords) {
        if (process.env.NODE_ENV === 'development') {
          console.log(`🎉 SUCCESS: Placed all ${targetWordCount} words ` +
                     `with ${diagonalWordsCount} diagonal in attempt ${retry + 1}`);
        }
        break;
      }
    }
    
    // Use the best result
    this.gameState.words = bestResult.placedWords;
    
    if (process.env.NODE_ENV === 'development') {
      console.log(`\n📊 FINAL RESULT:`);
      console.log(`✅ Successfully placed: ${bestResult.placedCount} out of ${targetWordCount} target words`);
      console.log(`📈 Success rate: ${((bestResult.placedCount / targetWordCount) * 100).toFixed(1)}%`);
      console.log(`📝 Final word list:`, bestResult.placedWordsStrings);
    }
    
    // Verify and fix coordinate consistency
    this.verifyAndFixCoordinates();
    
    // Fill empty spaces with random letters
    this.fillEmptySpaces();
    
    // 🔍 VERIFICATION: Check all words are correctly placed
    this._verifyAllWordsPlaced();
    
    // Return the actual successfully placed words
    return bestResult.placedWordsStrings;
  }
  
  private verifyAndFixCoordinates(): void {
    // Only log in development for better mobile performance
    if (process.env.NODE_ENV === 'development') {
      console.log('Verifying coordinate consistency and line straightness...');
    }
    
    // Re-apply word placements to ensure grid matches stored positions
    for (const wordPlacement of this.gameState.words) {
      const { word, positions, id, direction } = wordPlacement;
      
      // Verify this is a proper straight line
      this.validateStraightLine(word, positions, direction);
      
      // Only log in development for better mobile performance
      if (process.env.NODE_ENV === 'development') {
        console.log(`Verifying word: ${word} in ${direction} direction at positions:`, positions);
      }
      
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
      
      // Only log in development for better mobile performance
      if (process.env.NODE_ENV === 'development') {
        console.log(`Word: ${word}, Grid reads: ${actualWord}, Match: ${actualWord === word}, Straight line: ${this.isStraightLine(positions)}`);
      }
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
        if (process.env.NODE_ENV === 'development') {
          console.error(`Line validation failed for ${word}: position ${i} should be (${expectedRow}, ${expectedCol}) but got (${positions[i].row}, ${positions[i].col})`);
        }
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
      if (process.env.NODE_ENV === 'development') {
        console.error(`Invalid direction pattern: deltaRow=${deltaRow}, deltaCol=${deltaCol}`);
      }
      return false;
    }
    
    // Check if all movements are consistent with this direction
    for (let i = 1; i < positions.length; i++) {
      const expectedRow = positions[0].row + (deltaRow * i);
      const expectedCol = positions[0].col + (deltaCol * i);
      
      if (positions[i].row !== expectedRow || positions[i].col !== expectedCol) {
        if (process.env.NODE_ENV === 'development') {
          console.error(`Position ${i} deviation: expected (${expectedRow}, ${expectedCol}), got (${positions[i].row}, ${positions[i].col})`);
        }
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
  
  private getBalancedDirections(
    words: string[], 
    currentDiagonalCount: number = 0,
    maxDiagonalWords: number = 3
  ): typeof DIRECTIONS[number][][] {
    const assignments: typeof DIRECTIONS[number][][] = [];
    
    // Define direction categories
    const horizontalDirs = DIRECTIONS.filter(d => d.name.includes('horizontal'));
    const verticalDirs = DIRECTIONS.filter(d => d.name.includes('vertical') && !d.name.includes('diagonal'));
    const diagonalDirs = DIRECTIONS.filter(d => d.name.includes('diagonal'));
    
    for (let i = 0; i < words.length; i++) {
      let preferredDirections: typeof DIRECTIONS[number][] = [];
      
      // If we've reached the diagonal limit, exclude diagonal directions
      if (currentDiagonalCount >= maxDiagonalWords) {
        // Prefer horizontal and vertical directions, shuffled for variety
        preferredDirections = [
          ...horizontalDirs.sort(() => Math.random() - 0.5),
          ...verticalDirs.sort(() => Math.random() - 0.5)
        ];
      } 
      // Otherwise, include all directions but with diagonal less likely
      else {
        // 40% horizontal, 40% vertical, 20% diagonal
        const rand = Math.random();
        if (rand < 0.4) {
          preferredDirections = [
            ...horizontalDirs.sort(() => Math.random() - 0.5),
            ...verticalDirs.sort(() => Math.random() - 0.5),
            ...diagonalDirs.sort(() => Math.random() - 0.5)
          ];
        } else if (rand < 0.8) {
          preferredDirections = [
            ...verticalDirs.sort(() => Math.random() - 0.5),
            ...horizontalDirs.sort(() => Math.random() - 0.5),
            ...diagonalDirs.sort(() => Math.random() - 0.5)
          ];
        } else {
          preferredDirections = [
            ...diagonalDirs.sort(() => Math.random() - 0.5),
            ...horizontalDirs.sort(() => Math.random() - 0.5),
            ...verticalDirs.sort(() => Math.random() - 0.5)
          ];
        }
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
      this.gameState.score += 10;
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