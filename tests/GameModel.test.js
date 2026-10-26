import test from 'node:test';
import assert from 'node:assert/strict';
import { GameModel } from '../src/models/GameModel.js';

test('começa com pontuação zero', () => {
  const model = new GameModel();
  assert.equal(model.getState().score, 0);
});

test('adiciona um ponto', () => {
  const model = new GameModel();
  assert.equal(model.addPoint().score, 1);
});

test('reinicia a pontuação', () => {
  const model = new GameModel();
  model.addPoint();
  model.addPoint();
  assert.equal(model.reset().score, 0);
});

test('mensagem muda conforme a pontuação', () => {
  const model = new GameModel();
  model.addPoint();
  assert.equal(model.getState().message, 'Boa! O jogo está funcionando.');
});
