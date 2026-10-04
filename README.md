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
Ao abrir o link, o app mostra sozinho o convite "Instale o Diário de Classe". Um toque em
"Instalar agora" abre a confirmação do próprio navegador (Android/PC). No iPhone o convite
mostra o passo a passo do Safari (Compartilhar → Adicionar à Tela de Início), porque a Apple
não permite instalar por botão. O convite só aparece quando a instalação realmente funciona.
Depois de instalado: ícone próprio, tela cheia, funciona offline.

## Verificar a publicação
Abra `SEU-SITE/diagnostico.html`: a página confere o manifesto, os ícones, a versão publicada
e se o navegador liberou a instalação, e aponta o que estiver errado.
Dica: envie os arquivos pelo site do GitHub (Add file → Upload files) e abra o link no
Chrome/Safari, não dentro do WhatsApp ou Instagram.

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
