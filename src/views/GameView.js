/**
 * View: desenha a interface e o tabuleiro em Canvas.
 * Projeção isométrica: células vistas de cima em um ângulo de aproximadamente 45°.
 */
export class GameView {
  constructor() {
    this.startScreen = document.querySelector('#start-screen');
    this.gameScreen = document.querySelector('#game-screen');
    this.startButton = document.querySelector('#start-button');
    this.homeButton = document.querySelector('#home-button');
    this.canvas = document.querySelector('#game-canvas');
    this.ctx = this.canvas.getContext('2d');
    this.placedCount = document.querySelector('#placed-count');
    this.nextPieceSwatch = document.querySelector('#next-piece-swatch');
    this.state = null;
    this.geometry = null;

    this.resizeObserver = new ResizeObserver(() => {
      if (this.state && !this.gameScreen.classList.contains('hidden')) this.renderBoard(this.state);
    });
    this.resizeObserver.observe(this.canvas.parentElement);
  }

  bindStart(handler) {
    this.startButton.addEventListener('click', handler);
  }

  bindHome(handler) {
    this.homeButton.addEventListener('click', handler);
  }

  bindPointerMove(handler) {
    this.canvas.addEventListener('pointermove', (event) => handler(this.pointerToCell(event)));
  }

  bindPointerLeave(handler) {
    this.canvas.addEventListener('pointerleave', handler);
  }

  bindBoardClick(handler) {
    this.canvas.addEventListener('click', (event) => handler(this.pointerToCell(event)));
  }

  showGame() {
    this.startScreen.classList.add('hidden');
    this.gameScreen.classList.remove('hidden');
    requestAnimationFrame(() => {
      if (this.state) this.renderBoard(this.state);
    });
  }

  showStart() {
    this.gameScreen.classList.add('hidden');
    this.startScreen.classList.remove('hidden');
  }

  render(state) {
    this.state = state;
    this.placedCount.textContent = String(state.placedCount);
    this.nextPieceSwatch.style.background = state.nextColor;
    this.nextPieceSwatch.style.setProperty('--piece-color', state.nextColor);
    if (!this.gameScreen.classList.contains('hidden')) this.renderBoard(state);
  }

  resizeCanvas() {
    const rect = this.canvas.getBoundingClientRect();
    const dpr = Math.max(1, window.devicePixelRatio || 1);
    this.canvas.width = Math.round(rect.width * dpr);
    this.canvas.height = Math.round(rect.height * dpr);
    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    return { width: rect.width, height: rect.height };
  }

  renderBoard(state) {
    if (!state) return;
    const { width, height } = this.resizeCanvas();
    const ctx = this.ctx;
    ctx.clearRect(0, 0, width, height);

    const cellW = Math.min(56, (width - 64) / (state.columns + state.rows) * 1.45);
    const cellH = cellW * 0.5;
    const gridW = (state.columns + state.rows) * cellW / 2;
    const gridH = (state.columns + state.rows) * cellH / 2;
    const originX = (width - gridW) / 2;
    const originY = Math.max(34, (height - gridH) / 2 + 6);
    this.geometry = { cellW, cellH, originX, originY, width, height, columns: state.columns, rows: state.rows };

    // Fundo discreto em pontos.
    ctx.fillStyle = 'rgba(177, 200, 225, 0.12)';
    for (let x = 18; x < width; x += 28) {
      for (let y = 18; y < height; y += 28) {
        ctx.beginPath();
        ctx.arc(x, y, 1, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // Faces das células: losangos para uma visão isométrica.
    for (let row = 0; row < state.rows; row += 1) {
      for (let col = 0; col < state.columns; col += 1) {
        const p = this.cellPolygon(col, row);
        const occupied = state.blocks.find((block) => block.col === col && block.row === row);
        this.drawPolygon(p, occupied ? this.darken(occupied.color, 0.54) : '#1d2a3a',
          occupied ? '#354b5f' : '#344457', 1);
        if (occupied) this.drawBlock(col, row, occupied.color);
      }
    }

    // Preview da peça atual sobre a célula selecionada.
    const hovered = state.hoveredCell;
    if (hovered && this.isInside(hovered.col, hovered.row, state)) {
      const keyExists = state.blocks.some((block) => block.col === hovered.col && block.row === hovered.row);
      const polygon = this.cellPolygon(hovered.col, hovered.row);
      this.drawPolygon(polygon, 'rgba(139, 227, 194, 0.16)', '#8be3c2', 2);
      if (!keyExists) {
        this.drawBlock(hovered.col, hovered.row, state.nextColor, true);
      }
    }
  }

  drawBlock(col, row, color, isPreview = false) {
    const { cellW, cellH } = this.geometry;
    const top = this.cellCenter(col, row);
    const depth = Math.max(7, cellH * 0.52);
    const halfW = cellW / 2;
    const halfH = cellH / 2;
    const ctx = this.ctx;

    // Sombra suave sob o bloco.
    ctx.save();
    ctx.globalAlpha = isPreview ? 0.35 : 0.28;
    ctx.fillStyle = '#000000';
    ctx.beginPath();
    ctx.ellipse(top.x, top.y + depth + 3, halfW * 0.88, halfH * 0.8, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // Laterais do bloco.
    const topFace = [
      { x: top.x, y: top.y - halfH - depth },
      { x: top.x + halfW, y: top.y - depth },
      { x: top.x, y: top.y + halfH - depth },
      { x: top.x - halfW, y: top.y - depth },
    ];
    const leftFace = [
      topFace[3], topFace[2],
      { x: top.x, y: top.y + halfH },
      { x: top.x - halfW, y: top.y },
    ];
    const rightFace = [
      topFace[2], topFace[1],
      { x: top.x + halfW, y: top.y },
      { x: top.x, y: top.y + halfH },
    ];
    this.drawPolygon(leftFace, this.darken(color, 0.68), this.darken(color, 0.55), 1);
    this.drawPolygon(rightFace, this.darken(color, 0.82), this.darken(color, 0.68), 1);

    // Topo com cantos arredondados.
    ctx.save();
    ctx.globalAlpha = isPreview ? 0.82 : 1;
    ctx.beginPath();
    const points = topFace;
    const radius = Math.min(5, cellH * 0.2);
    this.roundedPolygon(points, radius);
    ctx.fillStyle = color;
    ctx.fill();
    ctx.lineWidth = isPreview ? 2 : 1;
    ctx.strokeStyle = isPreview ? '#ffffff' : 'rgba(255,255,255,0.25)';
    ctx.stroke();
    ctx.restore();
  }

  roundedPolygon(points, radius) {
    const ctx = this.ctx;
    const corners = points.map((point, index) => {
      const prev = points[(index - 1 + points.length) % points.length];
      const next = points[(index + 1) % points.length];
      const lengthA = Math.hypot(prev.x - point.x, prev.y - point.y);
      const lengthB = Math.hypot(next.x - point.x, next.y - point.y);
      const r = Math.min(radius, lengthA / 3, lengthB / 3);
      return {
        start: { x: point.x + (prev.x - point.x) * r / lengthA, y: point.y + (prev.y - point.y) * r / lengthA },
        end: { x: point.x + (next.x - point.x) * r / lengthB, y: point.y + (next.y - point.y) * r / lengthB },
        point,
      };
    });
    ctx.moveTo(corners[0].start.x, corners[0].start.y);
    for (let i = 0; i < corners.length; i += 1) {
      const corner = corners[i];
      ctx.lineTo(corner.start.x, corner.start.y);
      ctx.quadraticCurveTo(corner.point.x, corner.point.y, corner.end.x, corner.end.y);
    }
    ctx.closePath();
  }

  drawPolygon(points, fill, stroke, lineWidth = 1) {
    const ctx = this.ctx;
    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    for (let i = 1; i < points.length; i += 1) ctx.lineTo(points[i].x, points[i].y);
    ctx.closePath();
    ctx.fillStyle = fill;
    ctx.fill();
    ctx.strokeStyle = stroke;
    ctx.lineWidth = lineWidth;
    ctx.stroke();
  }

  cellPolygon(col, row) {
    const center = this.cellCenter(col, row);
    const { cellW, cellH } = this.geometry;
    return [
      { x: center.x, y: center.y - cellH / 2 },
      { x: center.x + cellW / 2, y: center.y },
      { x: center.x, y: center.y + cellH / 2 },
      { x: center.x - cellW / 2, y: center.y },
    ];
  }

  cellCenter(col, row) {
    const { cellW, cellH, originX, originY } = this.geometry;
    return {
      x: originX + (col - row) * cellW / 2 + (this.geometry.rows * cellW / 2),
      y: originY + (col + row) * cellH / 2,
    };
  }

  pointerToCell(event) {
    if (!this.geometry) return null;
    const rect = this.canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const { cellW, cellH, originX, originY, rows, columns } = this.geometry;
    const baseX = x - originX - rows * cellW / 2;
    const baseY = y - originY;
    const a = baseX / (cellW / 2);
    const b = baseY / (cellH / 2);
    const col = Math.floor((a + b) / 2);
    const row = Math.floor((b - a) / 2);
    // Busca a célula mais próxima entre candidatas; isso evita erros nas bordas dos losangos.
    let best = null;
    let bestDistance = Infinity;
    for (let c = Math.max(0, col - 1); c <= Math.min(columns - 1, col + 1); c += 1) {
      for (let r = Math.max(0, row - 1); r <= Math.min(rows - 1, row + 1); r += 1) {
        const center = this.cellCenter(c, r);
        const dx = Math.abs(x - center.x) / (cellW / 2);
        const dy = Math.abs(y - center.y) / (cellH / 2);
        const distance = dx + dy;
        if (distance <= 1.02 && distance < bestDistance) {
          best = { col: c, row: r };
          bestDistance = distance;
        }
      }
    }
    return best;
  }

  isInside(col, row, state) {
    return col >= 0 && row >= 0 && col < state.columns && row < state.rows;
  }

  darken(hex, factor) {
    const value = hex.replace('#', '');
    const r = Math.round(parseInt(value.slice(0, 2), 16) * factor);
    const g = Math.round(parseInt(value.slice(2, 4), 16) * factor);
    const b = Math.round(parseInt(value.slice(4, 6), 16) * factor);
    return `rgb(${r}, ${g}, ${b})`;
  }
}
