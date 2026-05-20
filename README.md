Visão geral

Aplicação web para criação, edição e compartilhamento de Tier Lists temáticas.

A intenção é que o usuário consiga criar listas com categorias (S, A, B, ...) e arrastar personagens/itens entre as categorias, usando um tema visual (imagem) para definir a estética.

Status atual (implementado)

- Frontend em React + TypeScript (Vite).
- Salvamento local (LocalStorage) de múltiplas tier lists.
- Tela inicial (Home) que lista as tier lists salvas e permite criar novas.
- Sistema simples de usuário: o usuário informa apenas um nome (salvo no LocalStorage).
- Editor com:
  - Edição de nome e tema da tier list no momento da criação.
  - Categorias (inicial: S, A, B, C, D) que podem ser renomeadas, mudar cor, adicionar e remover.
  - Banco de Itens (Item Pool): formulário para adicionar itens fora das categorias. Itens do banco podem ser arrastados para qualquer categoria. Isso permite adicionar itens em massa e só arrastá-los quando necessário.
  - Drag & Drop de itens (react-beautiful-dnd):
    - Arrastar itens do banco para qualquer categoria.
    - Mover itens entre categorias.
    - Reordenar itens dentro da mesma categoria.
  - Reordenar categorias via botões (para cima / para baixo).
  - Registro de atividades (log): cada ação importante (adicionar/remover/mover/renomear) gera uma entrada com usuário e timestamp, visível no painel de atividades.
  - Exportação: PNG (via html2canvas), PDF (html2canvas + jsPDF) e JSON (download do objeto JSON).
  - Importação de JSON: carregar uma tier list a partir de um arquivo JSON (gera uma nova id para evitar colisões).

Observações de UX / fluxo

- Ao abrir a aplicação, a tela inicial mostra as tier lists salvas e um campo para definir/alterar o nome do usuário.
- Para adicionar itens em massa, use o "Banco de Itens" (Item Pool). Insira nome e imagem e clique em "Adicionar ao Banco". Em seguida arraste do banco para a categoria desejada.

Como rodar localmente

1. Instale dependências:

   cd /path/para/tierlist
   npm install

2. Inicie o servidor de desenvolvimento:

   npm run dev

3. Abra no navegador em http://localhost:5173

Observações

- O projeto já inclui estilos base e componentes reutilizáveis. A aparência atual é inspirada na arte de referência (arquivo `rpgJ1.png`) mas ainda pode ser refinada para ficar 100% fiel à estética desejada.
- A implementação do drag & drop foi feita com `react-beautiful-dnd` (agora descontinuado, mas está funcionando). Se preferir, podemos migrar para `@dnd-kit` para manter uma solução ativa e mais flexível.
- O compartilhamento "colaborativo" em tempo real não foi implementado — atualmente o compartilhamento é feito por exportação/importação de JSON. Para edição colaborativa em tempo real, é necessário adicionar um backend (ex.: Firebase Realtime/Firestore ou WebSocket server). Posso propor e implementar uma solução se desejar.

O que foi alterado recentemente

- Fluxo inicial: agora abre na visão das tier lists salvas (conforme solicitado) e não inicia direto na criação.
- Modo de adicionar itens: adicionei um "Item Pool" (Banco de Itens) para criar itens fora das categorias e arrastá-los depois para as categorias.
- Correções no sistema de reordenação para incluir o Banco de Itens (itens sem categoria fixa) e garantir que a exportação/importação preservem os dados.

Próximos passos (opções)

- Refinar o visual para seguir com maior fidelidade a `rpgJ1.png` (cores, fontes, texturas).
- Melhorar UX do drag & drop (animações, dicas visuais, drag handles maiores).
- Adicionar drag & drop para reordenar categorias por arrastar (atualmente há botões up/down).
- Migrar para `@dnd-kit` ou outra biblioteca ativa, se preferir.
- Implementar colaboração em tempo real (Firestore / WebSockets).

Se quiser que eu prossiga com testes e ajustes (por exemplo: tornar o DnD mais suave, implementar reorder de categorias por drag, estilizar seguindo a arte de referência ou configurar deploy na Vercel), diga qual prioridade: estilizar / dnd / colaboração / deploy e eu continuo a partir daí.
