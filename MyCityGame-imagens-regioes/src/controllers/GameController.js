export class GameController {
  constructor(model, view) { this.model = model; this.view = view; }
  init() {
    this.view.bindStart(() => { this.view.showGame(); this.view.render(this.model.getState()); });
    this.view.bindHome(() => this.view.showStart());
    this.view.bindChoosePiece(index => { if (!this.model.choosePiece(index)) this.view.flashOccupied?.(); this.view.render(this.model.getState()); });
    const toggleOffers = () => { this.model.toggleOffers(); this.view.render(this.model.getState()); };
    this.view.bindToggleOffers(toggleOffers);
    this.view.bindHideOffers(toggleOffers);
    this.view.bindGlossary();
    this.view.bindNextTurn(() => { if (!this.model.nextTurn()) { this.view.turnMessage.textContent = 'Conclua a peça deste turno antes de avançar.'; } this.view.render(this.model.getState()); });
    this.view.bindPointerMove(cell => { this.model.setHoveredCell(cell); this.view.render(this.model.getState()); });
    this.view.bindPointerLeave(() => { this.model.setHoveredCell(null); this.view.render(this.model.getState()); });
    this.view.bindBoardClick(cell => {
      if (!cell) return;
      this.model.setHoveredCell(cell);
      if (!this.model.placeBlock(cell)) this.view.flashOccupied?.();
      this.view.render(this.model.getState());
    });
    this.view.render(this.model.getState());
  }
}
