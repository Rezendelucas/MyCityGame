# MyCityGame

Protótipo de jogo de construção urbana em Canvas isométrico, com turnos, ofertas de construções, dinheiro e 18 atributos possíveis por peça (até 6 ativos por peça).

Consulte `documentacao/README.md` para regras, arquivos e comandos.


## Interface ilustrada e mercado de construções

- A interface usa painéis escuros azul-marinho, bordas azuladas, realces neon e botões verdes.
- O mercado apresenta exatamente duas opções de construção por turno, sem repetir o mesmo tipo na mesma oferta.
- Cada tipo possui uma ilustração isométrica PNG com fundo transparente em `public/tiles/`, reutilizada nos cartões de escolha, no glossário, no painel de peça selecionada e no tabuleiro.
- Depois da compra, o mercado fica oculto até o turno seguinte; é possível fechar e reabrir a janela antes de comprar.
- As ilustrações são assets vetoriais leves para funcionarem em diferentes resoluções.

### Glossário e arte das peças
O catálogo permanente foi substituído por um botão **Abrir glossário** no painel inferior direito. O glossário mostra os 11 tipos de construção com arte isométrica e descrição. As peças posicionadas no tabuleiro também exibem a ilustração correspondente ao seu tipo.

## Correções recentes
- O botão **Ver escolhas** fica desabilitado após posicionar a construção do turno e só volta a ser habilitado quando o próximo turno começa.
- A ilustração isométrica da construção no tabuleiro preserva a proporção original do PNG para evitar deformação.


## Ilustrações das construções

As construções agora usam imagens PNG individuais com canal alfa (fundo transparente), extraídas da folha de arte isométrica em `public/tiles/`. Os nomes de arquivo correspondem ao identificador de cada tipo de peça e são utilizados nos cartões de oferta, glossário, painel da peça selecionada e desenho no tabuleiro.

Arquivos disponíveis: `zona-residencial.png`, `distrito-comercial.png`, `fabrica-industrial.png`, `usina-de-energia.png`, `estacao-de-tratamento-de-agua.png`, `hospital-municipal.png`, `colegio-municipal.png`, `centro-de-pesquisa.png`, `centro-cultural.png`, `parque-urbano.png` e `delegacia.png`.

## Atualização de interface e posicionamento

- O tabuleiro mostra dicas fixas no canto inferior esquerdo: arrastar para mover o mapa, usar o scroll para zoom e clicar para posicionar.
- Os ícones dos atributos foram padronizados conforme o mockup. Valores negativos visualmente ruins ficam vermelhos: valores positivos em Poluição, Barulho, Crime, Congestionamento, Desemprego, Custo de manutenção, Risco de enchente e Desigualdade; valores negativos nos outros atributos também aparecem em vermelho.
- O grid serve somente como referência. A colocação continua exigindo que a nova área seja adjacente a uma construção existente e não sobreponha células ocupadas.
- Cada tipo de construção possui tamanho fixo: Zona residencial e Delegacia 1×1; Centro cultural e Distrito comercial 2×1; construções de água, parque, energia, hospital, escola e pesquisa 2×2; Fábrica industrial 3×2. Todas as peças do mesmo tipo mantêm a mesma pegada.
- Uma peça pode ocupar várias células, mas seus atributos são contabilizados uma única vez. A arte é desenhada uma vez, dimensionada conforme a área ocupada.


## Ajustes visuais mais recentes

- O HUD superior exibe os 18 atributos com ícones maiores e valores codificados por cor: verde para efeitos favoráveis, vermelho para impactos negativos e neutro para zero.
- Os botões **Passar para o próximo turno** e **Ver escolhas** ficam no painel inferior esquerdo, fora do tabuleiro.
- A prévia da construção selecionada usa `object-fit: contain` e um quadro de altura definida para evitar cortes.
- O grid deixou de ser desenhado como losangos por baixo das construções. Ele continua sendo usado internamente para validar ocupação, pegadas e adjacência; as imagens são dimensionadas pela pegada isométrica e ancoradas pela base para encaixarem visualmente.


## Ajuste de ícones e profundidade isométrica

- Os ícones do HUD de atributos, dos painéis de atributos, das dicas e dos efeitos das ofertas foram ampliados em 1,5×.
- As construções são desenhadas em ordem de profundidade isométrica: a pegada mais distante é renderizada primeiro e a mais próxima por último. A ordenação usa a borda frontal da pegada (`col + row + largura + altura`) e desempates estáveis para reduzir casos em que uma construção distante aparece na frente de outra próxima.


### Atualização: câmera, tamanho residencial e turnos livres

- A Zona Residencial agora ocupa uma pegada fixa de 2×2 células, igual para todas as peças desse tipo.
- A câmera pode ser deslocada segurando o botão esquerdo do mouse e arrastando o tabuleiro; arrastar não posiciona uma construção.
- É possível passar o turno sem construir. O jogo continua bloqueando o avanço quando há uma peça comprada aguardando posicionamento.

### Atualização de jogabilidade

- Zona Residencial ocupa uma área isométrica maior: 2×2 células, com tamanho consistente entre construções do mesmo tipo.
- Arraste a câmera segurando o botão esquerdo do mouse sobre o tabuleiro. O jogo diferencia arrasto de clique para evitar posicionar uma peça acidentalmente ao mover a visão.
- É possível avançar o turno sem construir. Se uma peça já foi comprada e está aguardando posicionamento, é necessário posicioná-la antes de avançar.
