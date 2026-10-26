/**
 * Model: mantém o estado e as regras do jogo.
 * Não deve manipular o DOM nem depender de Vite, Electron ou Capacitor.
 */
export class GameModel {
  constructor() {
    this.score = 0;
  }

  addPoint() {
    this.score += 1;
    return this.getState();
  }

  reset() {
    this.score = 0;
    return this.getState();
  }

  getState() {
    return {
      score: this.score,
      message: this.getMessage(),
    };
  }

  getMessage() {
    if (this.score === 0) return 'Faça seu primeiro ponto.';
    if (this.score === 1) return 'Boa! O jogo está funcionando.';
    if (this.score < 10) return 'Você está pegando o jeito.';
    return 'Pontuação alta! A base está pronta para evoluir.';
  }
}
