import { max, randomInt } from "./util";
import chalk from "chalk";
import { getMoveKey } from "./listen";
const Table = require("cli-table3");

const _row = 4;
const _col = 4;
const probabilitySpace = 100;
const probabilityOfTwo = 80;

export enum moveKey {
  up = 1,
  down,
  left,
  right,
  noDir,
}

interface GameScore {
  total: number;
  maximum: number;
}

export class Game {
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

  Display(): void {
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

  AddElement(): void {
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

    let elementCount = randomInt(empty) + 1;
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

  async TakeInput(): Promise<void> {
    const key = await getMoveKey();
    switch (key) {
      case moveKey.left:
        this.moveLeft();
        break;
      case moveKey.right:
        this.moveRight();
        break;
      case moveKey.up:
        this.moveUp();
        break;
      case moveKey.down:
        this.moveDown();
        break;
    }
  }

  IsOver(): boolean {
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

  CountScore(): GameScore {
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

  private printPreset(r: (number | string)[][]): number[][] {
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

  private transpose() {
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

  private reverse() {
    for (let i = 0; i < _row; i++) {
      this.matrix[i] = this.matrix[i].reverse();
    }
  }

  private reverseRows() {
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

  private moveRow(r: number[]): number[] {
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

  private rowFillInit(arr: number[]): number[] {
    const result = [...arr];
    const remaining = _col - result.length;
    for (let i = 0; i < remaining; i++) {
      result.push(0);
    }
    return result;
  }

  private mergeElements(arr: number[]): number[] {
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
