# MyCityGame — versão com turnos e economia

## Ciclo de turno
1. O jogador recebe três ofertas aleatórias de construções.
2. Cada oferta tem preço e cor fixa por tipo. Ofertas que custam mais que o saldo ficam desabilitadas.
3. Comprar uma oferta desconta o dinheiro e seleciona a peça.
4. A peça acompanha o cursor como prévia apenas depois da compra e pode ser posicionada em uma célula livre adjacente ao tabuleiro.
5. Depois de posicionar, o turno fica concluído. O botão **Passar turno** libera o próximo turno, gera três ofertas novas e atualiza o dinheiro usando a arrecadação total de Impostos.
6. O botão de esconder ofertas permite observar o tabuleiro e abrir as escolhas novamente. A seleção comprada não pode ser escondida/perdida.

## Economia e atributos
Cada peça tem 18 campos de atributos, mas no máximo seis podem ter valores diferentes de zero. Os atributos escolhidos e seus valores são sorteados dentro de faixas específicas do tipo de construção. Cada tipo possui cor e preço fixos.

Atributos positivos incluem Energia, Minerais, Água, População, Cultura, Ciência, Comércio, Influência, Saúde e Impostos. Atributos de impacto negativo incluem Poluição, Barulho, Crime, Congestionamento, Desemprego, Custo de manutenção, Risco de enchente e Desigualdade.

Ao avançar turno, os totais são recalculados. Valores negativos de atributos positivos e valores positivos de atributos negativos são destacados em vermelho no topo.

## Estrutura dos arquivos
- `src/models/GameModel.js`: catálogo de construções, preços, cores, sorteio de atributos, saldo, ofertas, turnos, regras de compra e posicionamento, agregação de totais.
- `src/views/GameView.js`: Canvas isométrico, câmera/zoom, painel de atributos, mercado de três ofertas, contador de turno e avisos de atributos.
- `src/controllers/GameController.js`: liga ações de interface às regras do modelo.
- `src/styles/main.css`: layout, mercado, botões, avisos e responsividade.
- `tests/GameModel.test.js`: testes para ofertas, custo, compra, posicionamento, atributos e totais.
- `index.html`: estrutura dos painéis e diálogo de compra.

## Comandos locais
```bash
npm install
npm test
npm run dev
npm run build
```


## Interface ilustrada e mercado de construções

- A interface usa painéis escuros azul-marinho, bordas azuladas, realces neon e botões verdes.
- O mercado apresenta exatamente duas opções de construção por turno, sem repetir o mesmo tipo na mesma oferta.
- Cada tipo possui uma ilustração isométrica SVG em `public/tiles/`, reutilizada nos cartões, na peça selecionada, na prévia e no catálogo.
- Depois da compra, o mercado fica oculto até o turno seguinte; é possível fechar e reabrir a janela antes de comprar.
- As ilustrações são assets vetoriais leves para funcionarem em diferentes resoluções.

## Glossário e ilustrações no tabuleiro

- O catálogo fixo no rodapé foi removido para liberar espaço para o tabuleiro e os painéis principais.
- O painel antes usado para prévia da próxima peça agora abre o glossário de construções.
- O glossário reúne os 11 tipos de construção, suas ilustrações e uma descrição dos principais efeitos.
- As ilustrações SVG de cada tipo também são desenhadas sobre as peças posicionadas no tabuleiro. O desenho usa a mesma arte presente nos cartões de escolha e no painel de peça selecionada.
- O glossário pode ser fechado pelo botão `×` ou clicando fora da janela.

## Atualização: dicas, ícones e áreas de construção

- O quadro de dicas no canto inferior esquerdo do tabuleiro mostra os controles de arrastar o mapa, zoom com scroll e posicionamento por clique.
- Os atributos usam ícones consistentes com o mockup. Valores que representam um impacto ruim são vermelhos: valor positivo para Poluição, Barulho, Crime, Congestionamento, Desemprego, Custo de manutenção, Risco de enchente e Desigualdade; valor negativo para os demais atributos.
- O grid é apenas uma referência de posicionamento. As regras de adjacência continuam valendo: a área ocupada pela nova construção deve tocar pelo menos uma célula ocupada e não pode sobrepor outra construção.
- Cada tipo tem uma pegada fixa, compartilhada por todas as construções do mesmo tipo. Exemplos atuais: Zona residencial e Delegacia 1×1; Centro cultural e Distrito comercial 2×1; escolas, parques, hospitais, usinas, tratamento de água e centro de pesquisa 2×2; Fábrica industrial 3×2.
- A construção ocupa todas as células da sua pegada, mas seus atributos só são contabilizados uma vez. A ilustração também é desenhada uma vez, dimensionada pela área da construção.


## Ajustes visuais mais recentes

- O HUD superior exibe os 18 atributos com ícones maiores e valores codificados por cor: verde para efeitos favoráveis, vermelho para impactos negativos e neutro para zero.
- Os botões **Passar para o próximo turno** e **Ver escolhas** ficam no painel inferior esquerdo, fora do tabuleiro.
- A prévia da construção selecionada usa `object-fit: contain` e um quadro de altura definida para evitar cortes.
- O grid deixou de ser desenhado como losangos por baixo das construções. Ele continua sendo usado internamente para validar ocupação, pegadas e adjacência; as imagens são dimensionadas pela pegada isométrica e ancoradas pela base para encaixarem visualmente.


## Ordem de desenho e escala dos ícones

Os ícones de atributos foram ampliados em 1,5× para melhorar a leitura. No Canvas, as construções são ordenadas pela profundidade isométrica da pegada antes de desenhar: objetos mais distantes aparecem primeiro; objetos mais próximos são desenhados por cima. Essa ordem visual é independente da ordem em que as peças foram criadas.


### Atualização: câmera, tamanho residencial e turnos livres

- A Zona Residencial agora ocupa uma pegada fixa de 2×2 células, igual para todas as peças desse tipo.
- A câmera pode ser deslocada segurando o botão esquerdo do mouse e arrastando o tabuleiro; arrastar não posiciona uma construção.
- É possível passar o turno sem construir. O jogo continua bloqueando o avanço quando há uma peça comprada aguardando posicionamento.

## Controles e turnos (atualização)

- Segure o botão esquerdo do mouse e arraste para mover a câmera. Um arrasto não é interpretado como clique de posicionamento.
- A roda do mouse controla o zoom.
- O turno pode ser passado sem construir. Uma peça comprada, mas ainda não posicionada, continua exigindo posicionamento antes do avanço.
- A Zona Residencial tem pegada fixa de 2×2 células e a ilustração é dimensionada de acordo com a pegada para acompanhar o aumento.
