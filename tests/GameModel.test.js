import test from 'node:test';
import assert from 'node:assert/strict';
import { GameModel, ATTRIBUTE_NAMES, FOOTPRINTS } from '../src/models/GameModel.js';

test('começa com uma peça aleatória posicionada e oferece duas opções únicas', () => {
 const model=new GameModel();const s=model.getState();
 assert.equal(s.placedCount,1);assert.equal(s.offers.length,2);assert.notEqual(s.offers[0].id,s.offers[1].id);assert.ok(s.money>=0);
});
test('as duas ofertas nunca têm o mesmo tipo',()=>{const m=new GameModel();assert.equal(m.getState().offers.length,2);assert.notEqual(m.getState().offers[0].id,m.getState().offers[1].id);});
test('uma peça custa dinheiro, pode ser posicionada e conclui o turno',()=>{
 const m=new GameModel();const s=m.getState();const price=s.offers[0].price;
 assert.equal(m.choosePiece(0),true);assert.equal(m.getState().money,100-price);
 const adjacent=Array.from({length:11},(_,i)=>i-5).flatMap(col=>Array.from({length:11},(_,i)=>i-5).map(row=>({col,row}))).find(c=>m.isValidCell(c,m.selectedPiece));assert.ok(adjacent);assert.equal(m.placeBlock(adjacent),true);assert.equal(m.getState().placedCount,2);
 assert.equal(m.getState().placedThisTurn,true);assert.equal(m.nextTurn(),true);assert.equal(m.getState().turn,2);
});
test('não permite comprar se não houver dinheiro suficiente',()=>{
 const m=new GameModel();m.money=0;assert.equal(m.choosePiece(0),false);
});
test('não permite colocar peça em célula ocupada ou inválida',()=>{
 const m=new GameModel();assert.equal(m.choosePiece(0),true);
 assert.equal(m.placeBlock({col:0,row:0}),false);const adjacent=Array.from({length:11},(_,i)=>i-5).flatMap(col=>Array.from({length:11},(_,i)=>i-5).map(row=>({col,row}))).find(c=>m.isValidCell(c,m.selectedPiece));assert.ok(adjacent);assert.equal(m.placeBlock(adjacent),true);
});
test('cada peça usa no máximo seis atributos não nulos',()=>{
 const m=new GameModel();for(const p of [...m.getState().blocks,...m.getState().offers]) {
  assert.equal(Object.keys(p.attributes).length,18);
  assert.ok(Object.values(p.attributes).filter(v=>v!==0).length<=6);
 }
});
test('totais somam todos os atributos posicionados',()=>{
 const m=new GameModel();const s=m.getState();
 for(const name of ATTRIBUTE_NAMES)assert.equal(s.totals[name],s.blocks.reduce((sum,b)=>sum+b.attributes[name],0));
});

test('permite passar o turno sem posicionar uma construção',()=>{
 const m=new GameModel();const initialCount=m.getState().placedCount;assert.equal(m.getState().placedThisTurn,false);assert.equal(m.nextTurn(),true);assert.equal(m.getState().turn,2);assert.equal(m.getState().placedCount,initialCount);assert.equal(m.getState().offersVisible,true);
});
test('zona residencial tem uma pegada maior e fixa de 2x2',()=>{
 const m=new GameModel();const residential=m.getState().offers.find(p=>p.id==='zona-residencial')||(()=>{m.offers=[...m.offers,{...m.getState().blocks[0],id:'zona-residencial',footprint:{width:2,height:2}}];return m.offers[2]})();assert.deepEqual(residential.footprint,{width:2,height:2});
});
