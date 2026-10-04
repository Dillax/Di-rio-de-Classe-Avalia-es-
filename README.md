# Diário de Classe — PWA local-first (v2)

Cada professor usa o mesmo link. Os dados (turmas, alunos, notas, logo) ficam
somente no IndexedDB do aparelho dele. Não há servidor, conta ou banco central.

## Publicar no GitHub Pages
1. Crie um repositório (ex.: `diario-classe`) e envie todos os arquivos desta pasta.
2. Settings → Pages → Deploy from a branch → `main` / `(root)`.
3. Link final: `https://SEU-USUARIO.github.io/diario-classe/`

## Logo padrão
Coloque a logo em `logo-escola.png` antes de publicar.
Sem esse arquivo, o app mostra o nome da escola cadastrado no perfil.

## Instalar (cada professor, uma vez)
O app mostra um convite "Instale o Diário de Classe" e um botão de instalar no topo
(e em Ajustes). No Android e no PC o botão instala direto; no iPhone ele mostra o
passo a passo do Safari (Compartilhar → Adicionar à Tela de Início).
Depois de instalado: ícone próprio na tela inicial, abre em tela cheia, funciona offline.
Os dados de cada professor ficam só no aparelho dele.

## Funcionalidades
- Primeiro acesso com perfil; modo de exemplo; PIN opcional.
- Turmas por componente. Nova turma pode importar alunos e avaliações de outra turma.
- Avaliações cadastradas pelo professor, por trimestre (tipo, nome, pontos).
  Modelos prontos, autopreenchimento por nome já usado e cópia de outra turma/trimestre.
- Recuperação substitutiva: vale a maior entre o grupo substituído e a recuperação.
- Lançamento de notas:
  - Notas por avaliação: todos os alunos de uma avaliação; troca de avaliação no topo.
  - Notas do aluno: todas as avaliações de um aluno.
  - Modos Somar / Retirar / Definir; ✕ apaga com Desfazer.
  - PC: Enter registra. Celular: registra sozinho ao parar de digitar.
  - Celular: janela em tela cheia acima do teclado (o app fica escondido por trás).
- Relatório para impressão, CSV (Excel), backup JSON, funciona offline.

## Atualizar o app
Altere os arquivos e aumente `CACHE` em `sw.js` (v2 → v3). Os dados dos
professores não são afetados por atualizações.

## Limites conhecidos
- Sem sincronização automática entre aparelhos: use exportar/importar backup.
- Se o professor limpar os dados do navegador ou desinstalar o app, os dados
  somem. Backup semanal é obrigatório.
- Documento de apoio: o registro oficial continua sendo o RCO.
