/**
 * Controller: conecta os eventos de entrada ao estado e à interface.
 */
export class GameController {
  constructor(model, view) {
    this.model = model;
    this.view = view;
  }

  init() {
    this.view.bindStart(() => {
      this.view.showGame();
      this.view.render(this.model.getState());
    });
    this.view.bindHome(() => this.view.showStart());
    this.view.bindPointerMove((cell) => {
      this.model.setHoveredCell(cell);
      this.view.render(this.model.getState());
    });
    this.view.bindPointerLeave(() => {
      this.model.setHoveredCell(null);
      this.view.render(this.model.getState());
    });
    this.view.bindBoardClick((cell) => {
      if (!cell) return;
      this.model.setHoveredCell(cell);
      const placed = this.model.placeBlock(cell);
      this.view.render(this.model.getState());
      if (!placed) this.view.flashOccupied?.();
    });
    this.view.render(this.model.getState());
  }
}
