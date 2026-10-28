import { ATTRIBUTE_NAMES } from '../models/GameModel.js';
export class GameView {
  constructor() {
    this.startScreen=document.querySelector('#start-screen'); this.gameScreen=document.querySelector('#game-screen');
    this.startButton=document.querySelector('#start-button'); this.homeButton=document.querySelector('#home-button');
    this.canvas=document.querySelector('#game-canvas'); this.ctx=this.canvas.getContext('2d');
    this.placedCount=document.querySelector('#placed-count'); this.turnCount=document.querySelector('#turn-count'); this.moneyCount=document.querySelector('#money-count'); this.offerOverlay=document.querySelector('#offer-overlay'); this.offerCards=document.querySelector('#offer-cards'); this.nextTurnButton=document.querySelector('#next-turn-button'); this.toggleOffersButton=document.querySelector('#toggle-offers-button'); this.hideOffersButton=document.querySelector('#hide-offers-button'); this.turnMessage=document.querySelector('#turn-message'); this.worldAlerts=document.querySelector('#world-alerts'); this.nextPieceSwatch=document.querySelector('#next-piece-swatch');
    this.selectedTitle=document.querySelector('#selected-title'); this.selectedAttrs=document.querySelector('#selected-attrs'); this.selectedArt=document.querySelector('#selected-art'); this.offerTurn=document.querySelector('#offer-turn'); this.nextPieceName=document.querySelector('#next-piece-name'); this.populationCount=document.querySelector('#population-count'); this.pieceCatalog=document.querySelector('#piece-catalog');
    this.totalAttrs=document.querySelector('#total-attrs'); this.nextPanel=document.querySelector('#next-panel'); this.glossaryButton=document.querySelector('#glossary-button'); this.glossaryOverlay=document.querySelector('#glossary-overlay'); this.closeGlossaryButton=document.querySelector('#close-glossary-button'); this.glossaryCards=document.querySelector('#glossary-cards'); this.imageCache=new Map();
    this.hints=document.querySelector('#board-hints'); this.state=null; this.geometry=null; this.camera={x:0,y:0}; this.zoom=1; this.pointer=null; this.lastPointer=null; this.cameraPausedUntil=0; this.cameraFrame=null; this.lastCameraTime=0;
    this.resizeObserver=new ResizeObserver(()=>{if(this.state&&!this.gameScreen.classList.contains('hidden'))this.renderBoard(this.state)}); this.resizeObserver.observe(this.canvas.parentElement);
  }
  bindStart(fn){this.startButton.addEventListener('click',fn)} bindHome(fn){this.homeButton.addEventListener('click',fn)} bindChoosePiece(fn){this.offerCards.addEventListener('click',e=>{const b=e.target.closest('[data-offer]');if(b)fn(Number(b.dataset.offer));})} bindNextTurn(fn){this.nextTurnButton.addEventListener('click',fn)} bindToggleOffers(fn){this.toggleOffersButton.addEventListener('click',fn)} bindHideOffers(fn){this.hideOffersButton.addEventListener('click',fn)} bindGlossary(){this.glossaryButton.addEventListener('click',()=>this.glossaryOverlay.classList.remove('hidden'));this.closeGlossaryButton.addEventListener('click',()=>this.glossaryOverlay.classList.add('hidden'));this.glossaryOverlay.addEventListener('click',e=>{if(e.target===this.glossaryOverlay)this.glossaryOverlay.classList.add('hidden')})}
  bindPointerMove(fn){this.canvas.addEventListener('pointermove',e=>{const r=this.canvas.getBoundingClientRect();const now=performance.now();const pt={x:e.clientX-r.left,y:e.clientY-r.top,time:now};if(this.lastPointer){const dt=Math.max(1,now-this.lastPointer.time);const speed=Math.hypot(pt.x-this.lastPointer.x,pt.y-this.lastPointer.y)/dt;if(speed>1.15)this.cameraPausedUntil=now+220;}this.lastPointer=pt;this.pointer=pt;fn(this.pointerToCell(e));this.scheduleCamera()})}
  bindPointerLeave(fn){this.canvas.addEventListener('pointerleave',()=>{this.pointer=null;this.lastPointer=null;fn();})} bindBoardClick(fn){this.canvas.addEventListener('click',e=>fn(this.pointerToCell(e)));this.canvas.addEventListener('wheel',e=>{e.preventDefault();this.zoom=Math.max(.55,Math.min(1.8,this.zoom*(e.deltaY<0?1.1:1/1.1)));if(this.state)this.renderBoard(this.state)},{passive:false})}
  showGame(){this.startScreen.classList.add('hidden');this.gameScreen.classList.remove('hidden');requestAnimationFrame(()=>this.state&&this.renderBoard(this.state))}
  showStart(){this.gameScreen.classList.add('hidden');this.startScreen.classList.remove('hidden')}
  render(state){this.state=state;this.placedCount.textContent=state.placedCount;this.turnCount.textContent=state.turn;this.moneyCount.textContent=state.money;this.populationCount.textContent=state.totals['População'];this.offerTurn.textContent=state.turn;this.renderAttributes(this.totalAttrs,state.totals);
    const selected=state.hoveredBlock;
    if(selected){this.selectedTitle.textContent=`${selected.name} · (${selected.col}, ${selected.row})`;this.selectedArt.innerHTML=`<img src="${import.meta.env.BASE_URL}tiles/${selected.id}.png" alt="Ilustração de ${selected.name}">`;this.renderAttributes(this.selectedAttrs,selected.attributes);this.nextPanel.classList.add('is-muted');}
    else if(state.selectedPiece){this.selectedTitle.textContent=`${state.selectedPiece.name} · pronta para posicionar`;this.selectedArt.innerHTML=`<img src="${import.meta.env.BASE_URL}tiles/${state.selectedPiece.id}.png" alt="Ilustração de ${state.selectedPiece.name}">`;this.renderAttributes(this.selectedAttrs,state.selectedPiece.attributes);this.nextPanel.classList.remove('is-muted');}
    else {this.selectedTitle.textContent='Nenhuma peça selecionada';this.selectedArt.innerHTML='<div class="empty-art">Escolha uma construção</div>';this.renderAttributes(this.selectedAttrs,null);this.nextPanel.classList.remove('is-muted');}
    this.offerOverlay.classList.toggle('hidden',!state.offersVisible||!!state.selectedPiece||this.gameScreen.classList.contains('hidden'));
    const icons={'Energia':'⚡','Minerais':'⛏️','Água':'💧','População':'👥','Cultura':'📖','Ciência':'⚗️','Comércio':'🛒','Influência':'👑','Saúde':'❤️','Impostos':'💰','Poluição':'🔥','Barulho':'🔊','Crime':'🚨','Congestionamento':'🚗','Desemprego':'🧑‍💼','Custo de manutenção':'🔧','Risco de enchente':'🌊','Desigualdade':'⚖️'};
    this.offerCards.innerHTML='';
    state.offers.forEach((piece,i)=>{const affordable=state.money>=piece.price;const card=document.createElement('article');card.className='offer-card';const badAttrs=['Poluição','Barulho','Crime','Congestionamento','Desemprego','Custo de manutenção','Risco de enchente','Desigualdade'];const effects=Object.entries(piece.attributes).filter(([,v])=>v!==0).map(([n,v])=>{const bad=badAttrs.includes(n)?v>0:v<0;return `<span class="effect-row ${bad?'negative':'positive'}"><span class="effect-label"><span class="effect-icon">${icons[n]||'•'}</span><span class="effect-name">${n}</span></span><b>${v>0?'+':''}${v}</b></span>`}).join('');card.innerHTML=`<img class="offer-art" src="${import.meta.env.BASE_URL}tiles/${piece.id}.png" alt="Ilustração isométrica de ${piece.name}"><div class="offer-card-title"><strong>${piece.name}</strong><span class="offer-price">🪙 ${piece.price}</span></div><p class="offer-description">${piece.description||'Uma construção para desenvolver a cidade.'}</p><div class="offer-effects">${effects}</div><button type="button" class="button button-primary choose-piece-button" data-offer="${i}" ${!affordable||state.selectedPiece?'disabled':''}>${affordable?'Escolher esta peça':'Dinheiro insuficiente'}</button></article>`;this.offerCards.append(card)});
    this.toggleOffersButton.textContent=state.offersVisible?'Ver mapa':'Ver escolhas';
    this.toggleOffersButton.disabled=!!state.selectedPiece||state.placedThisTurn;
    this.toggleOffersButton.title=state.placedThisTurn?'As escolhas voltam no próximo turno':'Alternar entre o mercado e o tabuleiro';
    this.nextTurnButton.disabled=!!state.selectedPiece;
    this.worldAlerts.innerHTML='';
    const badAttributes=new Set(['Poluição','Barulho','Crime','Congestionamento','Desemprego','Custo de manutenção','Risco de enchente','Desigualdade']);
    for(const name of ATTRIBUTE_NAMES){
      const value=state.totals[name]||0;
      const negative=badAttributes.has(name)?value>0:value<0;
      const alert=document.createElement('span');
      alert.className=`world-alert ${negative?'is-negative':value>0?'is-positive':'is-neutral'}`;
      alert.title=`${name}: ${value}`;
      alert.innerHTML=`<span class="world-alert-icon">${icons[name]||'•'}</span><b>${value>0&&!badAttributes.has(name)?'+':''}${value}</b>`;
      this.worldAlerts.append(alert);
    }
    this.turnMessage.textContent=state.selectedPiece?'Posicione a peça escolhida no mapa para encerrar o turno.':state.placedThisTurn?'Você já posicionou a peça deste turno.':'Escolha e posicione uma construção para encerrar o turno.';
    this.renderGlossary(); if(!this.gameScreen.classList.contains('hidden'))this.renderBoard(state);
  }
  renderGlossary(){
    if(this.glossaryCards.dataset.ready)return;
    const pieces=[
      ['zona-residencial','Zona residencial','Abriga moradores; gera população e impostos, mas pode aumentar trânsito e desigualdade.'],
      ['distrito-comercial','Distrito comercial','Movimenta comércio e arrecadação; pode gerar barulho e congestionamento.'],
      ['fabrica-industrial','Fábrica industrial','Produz minerais e comércio, com impactos de poluição e ruído.'],
      ['usina-de-energia','Usina de energia','Fornece energia para a cidade e exige manutenção.'],
      ['estacao-de-tratamento-de-agua','Estação de tratamento de água','Amplia o abastecimento de água e melhora a saúde pública.'],
      ['hospital-municipal','Hospital municipal','Aumenta a saúde e atende à população, consumindo recursos.'],
      ['colegio-municipal','Colégio Municipal','Gera ciência e cultura, reduz desigualdade e desemprego.'],
      ['centro-de-pesquisa','Centro de pesquisa','Impulsiona ciência e influência, com custos de operação.'],
      ['centro-cultural','Centro cultural','Promove cultura e influência, podendo gerar algum barulho.'],
      ['parque-urbano','Parque urbano','Melhora saúde e cultura, reduzindo poluição e risco de enchente.'],
      ['delegacia','Delegacia','Reduz criminalidade e melhora a segurança da cidade.']
    ];
    this.glossaryCards.innerHTML=pieces.map(([id,name,description])=>`<article class="glossary-card"><img src="${import.meta.env.BASE_URL}tiles/${id}.png" alt="Ilustração isométrica de ${name}"><div><h3>${name}</h3><p>${description}</p></div></article>`).join('');
    this.glossaryCards.dataset.ready='1';
  }
  renderAttributes(container,attrs){const icons={'Energia':'⚡','Minerais':'⛏️','Água':'💧','População':'👥','Cultura':'📖','Ciência':'⚗️','Comércio':'🛒','Influência':'👑','Saúde':'❤️','Impostos':'💰','Poluição':'🔥','Barulho':'🔊','Crime':'🚨','Congestionamento':'🚗','Desemprego':'🧑‍💼','Custo de manutenção':'🔧','Risco de enchente':'🌊','Desigualdade':'⚖️'};const bad=['Poluição','Barulho','Crime','Congestionamento','Desemprego','Custo de manutenção','Risco de enchente','Desigualdade'];container.innerHTML='';for(const name of ATTRIBUTE_NAMES){const row=document.createElement('div');row.className='attribute-row';const icon=document.createElement('span');icon.className='attribute-icon';icon.textContent=icons[name]||'•';icon.title=name;const label=document.createElement('span');label.className='attribute-name';label.textContent=name;const value=document.createElement('strong');const v=attrs?attrs[name]:null;value.textContent=v===null?'—':`${v>0&& !bad.includes(name)?'+':''}${v}`;if(v!==null&&v!==0){const negative=bad.includes(name)?v>0:v<0;value.classList.add(negative?'value-negative':'value-positive')}row.append(icon,label,value);container.append(row)}}
  resizeCanvas(){const r=this.canvas.getBoundingClientRect(),dpr=Math.max(1,devicePixelRatio||1);this.canvas.width=Math.round(r.width*dpr);this.canvas.height=Math.round(r.height*dpr);this.ctx.setTransform(dpr,0,0,dpr,0,0);return {width:r.width,height:r.height}}
  renderBoard(state){
    if(!state)return;
    const {width,height}=this.resizeCanvas(),ctx=this.ctx;
    ctx.clearRect(0,0,width,height);
    const cellW=76*this.zoom,cellH=38*this.zoom,depth=5*this.zoom;
    const hovered=state.hoveredCell;
    const originX=width/2-(this.camera.x-this.camera.y)*cellW/2;
    const originY=height/2-(this.camera.x+this.camera.y)*cellH/2;
    this.geometry={cellW,cellH,depth,originX,originY,width,height};
    ctx.fillStyle='rgba(177,200,225,.08)';
    for(let x=12;x<width;x+=28)for(let y=12;y<height;y+=28){ctx.beginPath();ctx.arc(x,y,1,0,Math.PI*2);ctx.fill()}

    // O grid só valida ocupação. A ordem visual é calculada pela profundidade isométrica:
    // peças com base mais distante são desenhadas primeiro; as mais próximas, por último.
    // A borda frontal da pegada (col + row + largura + altura) determina a profundidade.
    const depthOrderedBlocks=[...state.blocks].sort((a,b)=>{
      const depthA=a.col+a.row+a.footprint.width+a.footprint.height;
      const depthB=b.col+b.row+b.footprint.width+b.footprint.height;
      return depthA-depthB || (a.col+a.footprint.width)-(b.col+b.footprint.width) || a.instanceId-b.instanceId;
    });
    for(const block of depthOrderedBlocks){
      const centerCol=block.col+(block.footprint.width-1)/2;
      const centerRow=block.row+(block.footprint.height-1)/2;
      this.drawBlock(centerCol,centerRow,block.color,false,block.id,block.footprint,block.footprint.width+block.footprint.height);
    }
    if(hovered&&state.selectedPiece){
      const piece=state.selectedPiece;
      const occupiedCells=new Set((state.occupiedCells||[]).map(c=>`${c.col}:${c.row}`));
      let invalid=false;
      for(let dx=0;dx<piece.footprint.width;dx++)for(let dy=0;dy<piece.footprint.height;dy++)if(occupiedCells.has(`${hovered.col+dx}:${hovered.row+dy}`))invalid=true;
      const centerCol=hovered.col+(piece.footprint.width-1)/2;
      const centerRow=hovered.row+(piece.footprint.height-1)/2;
      this.drawBlock(centerCol,centerRow,piece.color,true,piece.id,piece.footprint,piece.footprint.width+piece.footprint.height,invalid);
    }
  }
  modelBlock(state,col,row){const cell=state.occupiedCells?.find(c=>c.col===col&&c.row===row);return cell?state.blocks.find(b=>b.instanceId===cell.instanceId)||null:null}
  scheduleCamera(){if(this.cameraFrame)return;this.cameraFrame=requestAnimationFrame(t=>{this.cameraFrame=null;this.updateCamera(t)})}
  updateCamera(now){if(!this.state||!this.pointer||now<this.cameraPausedUntil)return;const g=this.geometry;if(!g)return;const marginX=g.cellW*3,marginY=g.cellH*3;let dx=0,dy=0;if(this.pointer.x<marginX)dx=-Math.min(1,(marginX-this.pointer.x)/marginX);else if(this.pointer.x>g.width-marginX)dx=Math.min(1,(this.pointer.x-(g.width-marginX))/marginX);if(this.pointer.y<marginY)dy=-Math.min(1,(marginY-this.pointer.y)/marginY);else if(this.pointer.y>g.height-marginY)dy=Math.min(1,(this.pointer.y-(g.height-marginY))/marginY);if(Math.abs(dx)+Math.abs(dy)<.01)return;const dt=this.lastCameraTime?Math.min(32,now-this.lastCameraTime):16;this.lastCameraTime=now;const factor=dt/1000;
    this.cameraVelocity=this.cameraVelocity||{x:0,y:0};
    const targetX=((dx+dy)*.5)*5.8, targetY=((dy-dx)*.5)*5.8;
    const ease=1-Math.exp(-factor*2.8);
    this.cameraVelocity.x+=(targetX-this.cameraVelocity.x)*ease;
    this.cameraVelocity.y+=(targetY-this.cameraVelocity.y)*ease;
    this.camera.x+=this.cameraVelocity.x*factor;
    this.camera.y+=this.cameraVelocity.y*factor;
    this.renderBoard(this.state);this.scheduleCamera()}
  cellCenter(col,row){const g=this.geometry;return {x:g.originX+(col-row)*g.cellW/2,y:g.originY+(col+row)*g.cellH/2}}
  cellPolygon(col,row){const c=this.cellCenter(col,row),{cellW:w,cellH:h}=this.geometry;return [{x:c.x,y:c.y-h/2},{x:c.x+w/2,y:c.y},{x:c.x,y:c.y+h/2},{x:c.x-w/2,y:c.y}]}
  drawBlock(col,row,color,preview=false,pieceId=null,footprint={width:1,height:1},extent=2,invalid=false){
    const {cellW:w,cellH:h}=this.geometry,c=this.cellCenter(col,row),ctx=this.ctx;
    if(!pieceId)return;
    let img=this.imageCache.get(pieceId);
    if(!img){img=new Image();img.src=`${import.meta.env.BASE_URL}tiles/${pieceId}.png`;this.imageCache.set(pieceId,img);img.onload=()=>this.state&&this.renderBoard(this.state)}
    if(!img.complete||!img.naturalWidth)return;
    // A largura acompanha a base isométrica da pegada, sem o grid desenhado por baixo.
    const maxW=Math.max(36,extent*w*.5);
    const scale=maxW/img.naturalWidth;
    const iw=img.naturalWidth*scale,ih=img.naturalHeight*scale;
    const baseBottom=c.y+extent*h*.25;
    ctx.save();ctx.globalAlpha=preview?.62:1;
    ctx.drawImage(img,c.x-iw/2,baseBottom-ih,iw,ih);
    if(preview){ctx.globalAlpha=1;ctx.strokeStyle=invalid?'#ff5364':'#21e6a2';ctx.lineWidth=2;ctx.setLineDash([5,4]);ctx.strokeRect(c.x-iw/2,baseBottom-ih,iw,ih);ctx.setLineDash([])}
    ctx.restore();
  }
  drawPolygon(points,fill,stroke,lw=1){const c=this.ctx;c.beginPath();c.moveTo(points[0].x,points[0].y);for(let i=1;i<points.length;i++)c.lineTo(points[i].x,points[i].y);c.closePath();c.fillStyle=fill;c.fill();if(stroke){c.strokeStyle=stroke;c.lineWidth=lw;c.lineJoin='round';c.stroke()}}
  pointerToCell(event){if(!this.geometry)return null;const r=this.canvas.getBoundingClientRect(),x=event.clientX-r.left,y=event.clientY-r.top,g=this.geometry;const a=(x-g.originX)/(g.cellW/2),b=(y-g.originY)/(g.cellH/2);const col=Math.round((a+b)/2),row=Math.round((b-a)/2);const c=this.cellCenter(col,row);if(Math.abs(x-c.x)/(g.cellW/2)+Math.abs(y-c.y)/(g.cellH/2)>1.1)return null;return {col,row}}
  darken(hex,f){const n=hex.slice(1);return `rgb(${Math.round(parseInt(n.slice(0,2),16)*f)},${Math.round(parseInt(n.slice(2,4),16)*f)},${Math.round(parseInt(n.slice(4,6),16)*f)})`}
  flashOccupied(){this.canvas.classList.add('invalid-click');setTimeout(()=>this.canvas.classList.remove('invalid-click'),180)}
}
