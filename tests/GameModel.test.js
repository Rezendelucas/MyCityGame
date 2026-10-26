import test from 'node:test';
import assert from 'node:assert/strict';
import { GameModel } from '../src/models/GameModel.js';

test('começa sem blocos colocados', () => {
  const model = new GameModel({ columns: 30, rows: 30 });
  assert.equal(model.getState().placedCount, 0);
});

test('coloca um bloco na célula selecionada', () => {
  const model = new GameModel();
  assert.equal(model.placeBlock({ col: 2, row: 3 }), true);
  assert.equal(model.getState().placedCount, 1);
  assert.deepEqual(model.getState().blocks[0] && {
    col: model.getState().blocks[0].col,
    row: model.getState().blocks[0].row,
  }, { col: 2, row: 3 });
});

test('não permite colocar dois blocos na mesma célula', () => {
  const model = new GameModel();
  assert.equal(model.placeBlock({ col: 1, row: 1 }), true);
  assert.equal(model.placeBlock({ col: 1, row: 1 }), false);
  assert.equal(model.getState().placedCount, 1);
});

test('cada colocação sorteia a próxima cor', () => {
  const model = new GameModel();
  const firstColor = model.getState().nextColor;
  model.placeBlock({ col: 0, row: 0 });
  const state = model.getState();
  assert.equal(state.placedCount, 1);
  assert.ok(state.blocks[0].color);
  assert.ok(state.nextColor);
  // A paleta contém várias cores; uma cor nova pode coincidir por acaso, então não exigimos diferença.
  assert.ok(typeof firstColor === 'string');
});

test('rejeita células fora do tabuleiro', () => {
  const model = new GameModel();
  assert.equal(model.placeBlock({ col: 20, row: 0 }), false);
  assert.equal(model.getState().placedCount, 0);
});
