/**
 * View: exibe o estado e expõe eventos da interface.
 * As regras do jogo ficam no Model, não aqui.
 */
export class GameView {
  constructor() {
    this.scoreValue = document.querySelector('#score-value');
    this.scoreMessage = document.querySelector('#score-message');
    this.gameStatus = document.querySelector('#game-status');
    this.addPointButton = document.querySelector('#add-point-button');
    this.resetButton = document.querySelector('#reset-button');
  }

  bindAddPoint(handler) {
    this.addPointButton.addEventListener('click', handler);
  }

  bindReset(handler) {
    this.resetButton.addEventListener('click', handler);
  }

  render(state) {
    this.scoreValue.textContent = String(state.score);
    this.scoreMessage.textContent = state.message;
    this.gameStatus.textContent = state.score === 0
      ? 'Pronto para jogar'
      : `${state.score} ${state.score === 1 ? 'ponto conquistado' : 'pontos conquistados'}`;
  }
}
