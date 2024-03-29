import { max, randomInt } from "./util";
import chalk from "chalk";
import { getMoveKey } from "./listen";
const Table = require("cli-table3");

const _row = 4;
const _col = 4;
const probabilitySpace = 100;
const probabilityOfTwo = 80;

export enum MOVE_KEY {
  Up = 1,
  Down,
  Left,
  Right,
  NoDir,
}

interface GameScore {
  total: number;
  maximum: number;
}

export class Game {
  static _row = _row;
  static _col = _col;
  static probabilitySpace = probabilitySpace;
  static probabilityOfTwo = probabilityOfTwo;

  matrix: number[][] = [];
  over = false;
  newRow = 0;
  newCol = 0;

  constructor() {
    this.init();
  }

  init() {
    for (let i = 0; i < _row; i++) {
      this.matrix.push(Array(_col).fill(0));
    }
  }

  /**
   * Displays the matrix in a clear console table.
   *
   * @return {void} 
   */
  display(): void {
    console.clear();
    const cliTable = new Table({
      style: { "padding-left": 4, "padding-right": 4 },
    });
    let printMatrix: (number | string)[][] = JSON.parse(
      JSON.stringify(this.matrix)
    );
    printMatrix = this.printPreset(printMatrix);
    const newVal = printMatrix[this.newRow][this.newCol];
    printMatrix[this.newRow][this.newCol] = chalk.blue.bold(newVal);
    cliTable.push(...printMatrix);
    console.log(cliTable.toString());
  }

  /**
   * Generates a new element and adds it to the matrix.
   *
   * @return {void} This function does not return anything.
   */
  addElement(): void {
    let val = randomInt(probabilitySpace);
    if (val < probabilityOfTwo) {
      val = 2;
    } else {
      val = 4;
    }

    let empty = 0;
    for (let i = 0; i < _row; i++) {
      for (let j = 0; j < _col; j++) {
        if (this.matrix[i][j] === 0) {
          empty++;
        }
      }
    }

    let elementCount = Math.min(randomInt(empty) + 1, empty);
    let index = 0;

    for (let i = 0; i < _row; i++) {
      for (let j = 0; j < _col; j++) {
        if (this.matrix[i][j] === 0) {
          index++;
          if (index === elementCount) {
            this.newRow = i;
            this.newCol = j;
            this.matrix[i][j] = val;
            return;
          }
        }
      }
    }
  }

  /**
   * Takes user input to determine the next move.
   *
   * @return {Promise<void>} This function does not return anything.
   */
  async takeInput(): Promise<void> {
    const key = await getMoveKey();
    switch (key) {
      case MOVE_KEY.Left:
        this.moveLeft();
        break;
      case MOVE_KEY.Right:
        this.moveRight();
        break;
      case MOVE_KEY.Up:
        this.moveUp();
        break;
      case MOVE_KEY.Down:
        this.moveDown();
        break;
    }
  }

  /**
   * Determines if the game is over.
   *
   * @return {boolean} Returns true if the game is over, otherwise false.
   */
  isOver(): boolean {
    let empty = 0;
    for (let i = 0; i < _row; i++) {
      for (let j = 0; j < _col; j++) {
        if (this.matrix[i][j] === 0) {
          empty++;
        }
      }
    }

    return empty === 0 || this.over;
  }

  /**
   * Calculates the score for the game.
   *
   * @return {GameScore} The score of the game.
   */
  countScore(): GameScore {
    const result = {
      total: 0,
      maximum: 0,
    };

    for (let i = 0; i < _row; i++) {
      for (let j = 0; j < _col; j++) {
        result.total += this.matrix[i][j];
        result.maximum = max(result.maximum, this.matrix[i][j]);
      }
    }

    return result;
  }

  moveLeft() {
    for (let i = 0; i < _row; i++) {
      this.matrix[i] = this.moveRow(this.matrix[i]);
    }
  }

  moveRight() {
    this.reverse();
    this.moveLeft();
    this.reverse();
  }

  moveUp() {
    this.reverseRows();
    this.moveDown();
    this.reverseRows();
  }

  moveDown() {
    this.transpose();
    this.moveLeft();
    this.transpose();
    this.transpose();
    this.transpose();
  }

  /**
   * Generates the function comment for the given function body.
   *
   * @param {Array<Array<number | string>>} r - The input array of arrays.
   * @return {Array<Array<number>>} The modified array of arrays.
   */
  printPreset(r: (number | string)[][]): number[][] {
    const result = [];
    for (let i = 0; i < _row; i++) {
      result.push(Array(_col).fill(0));
    }
    for (let i = 0; i < _row; i++) {
      for (let j = 0; j < _col; j++) {
        result[i][j] = r[i][j] || " ";
      }
    }

    return result;
  }

  /**
   * Transposes the matrix.
   *
   * @param {type} _row - description of parameter
   * @param {type} _col - description of parameter
   * @return {void} Does not return any value
   */
  transpose() {
    const result = [];
    for (let i = 0; i < _row; i++) {
      result.push(Array(_col).fill(0));
    }
    for (let i = 0; i < _row; i++) {
      for (let j = 0; j < _col; j++) {
        result[i][j] = this.matrix[_col - j - 1][i];
      }
    }

    this.matrix = result;
  }

  /**
   * Reverses the elements in each row of the matrix.
   *
   * No parameters.
   *
   * No return value.
   */
  reverse() {
    for (let i = 0; i < _row; i++) {
      this.matrix[i] = this.matrix[i].reverse();
    }
  }

  /**
   * Reverses the rows of the matrix.
   *
   * @return {void} 
   */
  reverseRows() {
    const result = [];
    for (let i = 0; i < _row; i++) {
      result.push(Array(_col).fill(0));
    }

    for (let i = 0; i < _row; i++) {
      for (let j = 0; j < _col; j++) {
        result[_row - i - 1][j] = this.matrix[i][j];
      }
    }

    this.matrix = result;
  }

  /**
  * Move a row by removing all zeros and filling the remaining elements.
  *
  * @param {number[]} r - The row to be moved.
  * @return {number[]} The moved row.
  */
  moveRow(r: number[]): number[] {
    let result = [];
    for (let i = 0; i < _col; i++) {
      if (r[i] !== 0) {
        result.push(r[i]);
      }
    }
    if (result.length < _col) {
      result = this.rowFillInit(result);
    }
    return this.mergeElements(result);
  }

  /**
   * Fills the given array with zeros until it reaches the desired length.
   *
   * @param {number[]} arr - the original array
   * @return {number[]} - the filled array
   */
  rowFillInit(arr: number[]): number[] {
    const result = [...arr];
    const remaining = _col - result.length;
    for (let i = 0; i < remaining; i++) {
      result.push(0);
    }
    return result;
  }

  /**
   * Merges elements in an array by adding consecutive elements that are equal,
   * and returns the merged array.
   *
   * @param {number[]} arr - The array of numbers to merge.
   * @return {number[]} - The merged array.
   */
  mergeElements(arr: number[]): number[] {
    let result = [];
    result[0] = arr[0];
    let index = 0;
    for (let i = 1; i < arr.length; i++) {
      if (arr[i] === result[index]) {
        result[index] += arr[i];
      } else {
        index++;
        result[index] = arr[i];
      }
    }
    if (result.length < _col) {
      result = this.rowFillInit(result);
    }
    return result;
  }
}
