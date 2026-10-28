import './styles/main.css';
import { GameModel } from './models/GameModel.js';
import { GameView } from './views/GameView.js';
import { GameController } from './controllers/GameController.js';

const model = new GameModel({ columns: 10, rows: 10 });
const view = new GameView();
const controller = new GameController(model, view);

controller.init();
