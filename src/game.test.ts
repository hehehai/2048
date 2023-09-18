import { expect, it, describe, beforeEach } from "bun:test";

import { Game } from './game';

describe('Game', () => {

  let game: Game;

  beforeEach(() => {
    game = new Game();
  });

  it('should initialize empty matrix', () => {
    expect(game.matrix).toEqual(
      Array.from({ length: Game._row }, () =>
        Array.from({ length: Game._col }, () => 0)
      )
    );
  });

  it('should add element to random empty cell', () => {
    game.addElement();
    expect(game.matrix[game.newRow][game.newCol]).toBeGreaterThan(0);
  });

  it('should merge elements when moving left', () => {
    // Add some test elements
    game.matrix[0][0] = 2;
    game.matrix[0][1] = 2;
    game.matrix[0][2] = 4;

    game.moveLeft();

    expect(game.matrix[0][0]).toEqual(4);
    expect(game.matrix[0][1]).toEqual(4);
    expect(game.matrix[0][2]).toEqual(0);
  });

  it('should not change matrix when moving into wall', () => {
    // Add elements at edges
    game.matrix[0][0] = 2;
    game.matrix[Game._row - 1][Game._col - 1] = 4;

    game.moveUp();
    game.moveDown();
    game.moveLeft();
    game.moveRight();

    expect(game.matrix).toEqual([
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 2, 4]
    ]);
  });

  it('should report over when no empty cells', () => {
    for (let i = 0; i < Game._row; i++) {
      for (let j = 0; j < Game._col; j++) {
        game.matrix[i][j] = 2;
      }
    }
    expect(game.isOver()).toBeTrue();
  });

  // countScore
  it('should calculate total and max score correctly', () => {
    game.matrix = [[2, 4], [8, 16]];

    const result = game.countScore();

    expect(result.total).toEqual(30);
    expect(result.maximum).toEqual(16);
  });

  // reverse
  it('should reverse row elements', () => {
    game.matrix = [[1, 2, 3], [4, 5, 6]];

    game.reverse();

    expect(game.matrix).toEqual([[3, 2, 1], [6, 5, 4]]);
  });

  // reverseRows
  it('should reverse all rows', () => {
    game.matrix = [[1, 2], [3, 4]];

    game.reverseRows();

    expect(game.matrix).toEqual([[3, 4], [1, 2]]);
  });

  // moveRow
  it('should merge and fill row elements', () => {
    const row = [2, 2, 0, 4];

    const result = game.moveRow(row);

    expect(result).toEqual([4, 0, 0, 4]);
  });

  // rowFillInit
  it('should fill remaining indexes with 0', () => {
    const row = [2, 2];

    const result = game.rowFillInit(row);

    expect(result).toEqual([2, 2, 0, 0]);
  });

  // mergeElements
  it('should merge same elements', () => {
    const row = [2, 2, 4, 4];

    const result = game.mergeElements(row);

    expect(result).toEqual([4, 4, 0, 0]);
  });
});
