## Diário de Classe

Aplicativo web instalável (PWA) para professores registrarem e acompanharem as notas dos alunos por turma e por trimestre.

**O que faz**
- Cadastro de turmas, alunos e avaliações (tipo, nome e pontos), com modelos prontos
- Lançamento de notas por avaliação (todos os alunos) ou por aluno, somando, retirando ou definindo pontos
- Recuperação substitutiva: vale a maior nota entre as avaliações substituídas e a recuperação
- Cálculo do total do trimestre e do ano, quanto falta para a meta e situação do aluno
- Relatórios em PDF, impressão, exportação para Excel (CSV) e backup em JSON
- Instalável na tela inicial (Android, iPhone e computador) e funciona sem internet

**Privacidade:** não há servidor nem conta. Os dados de cada professor ficam apenas no aparelho dele (IndexedDB). O repositório contém só o código do aplicativo.

**Tecnologias:** HTML5, CSS3 e JavaScript puro (sem frameworks), com Service Worker, Web App Manifest e IndexedDB. O gerador de PDF é próprio, escrito em JavaScript.
