/**
 * Controller: conecta as ações do usuário às regras e atualiza a View.
 */
export class GameController {
  constructor(model, view) {
    this.model = model;
    this.view = view;
  }

  init() {
    this.view.bindAddPoint(() => this.addPoint());
    this.view.bindReset(() => this.reset());
    this.view.render(this.model.getState());
  }

  addPoint() {
    this.view.render(this.model.addPoint());
  }

  reset() {
    this.view.render(this.model.reset());
  }
}
