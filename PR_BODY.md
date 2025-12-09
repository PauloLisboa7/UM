PR title: UI: Atualizações no Splash, Login/Register, imagens e footer

Resumo
-------
- Adicionada seção showcase com 3 screenshots na página inicial (`Splash.jsx`) e estilos associados (`Splash.css`).
- Ajustes visuais nos títulos das seções (`Quem somos`, `Como usar o nosso SITE`, `Impacto Local`, `Parcerias`, `Nossa Equipe`) — tamanho e estilo unificados.
- Atualizadas imagens dos membros (Marcos, Paulo, Guilherme) e placeholders em `frontend/public/`.
- Substituído o componente de tema por modo inativo para remover ícone da lua.
- Removido/condicionado o gráfico do Impacto Local (verificação defensiva para evitar erro em HMR).
- Atualizado rodapé: rótulos, links de âncora, cor laranja em títulos e reorganização das colunas.
- Botão "Fale com nossa Equipe" altera para link do WhatsApp com número e mensagem padrão.
- Alterações nas páginas de `Login` e `Register`: cores dos botões para laranja, novo background `fundo-login.jpg` e overlay escurecido; adicionado botão de voltar (seta) ao formulário de login.
- Várias correções pequenas de CSS e responsividade para manter consistência visual.

Arquivos principais alterados
---------------------------
- `frontend/src/pages/Splash.jsx`
- `frontend/src/pages/Splash.css`
- `frontend/src/components/ThemeToggle.jsx` (desabilitado)
- `frontend/src/pages/Login.jsx`
- `frontend/src/pages/Register.jsx`
- arquivos de imagem em `frontend/public/` (Guilherme, Marcos, Paulo, fundo-login, screenshots)

Notas de teste
------------
1. Reiniciar o dev server (Vite): `npm run dev` na pasta `frontend`.
2. Verificar página inicial `/` e confirmar:
   - Showcase de 3 imagens visíveis e responsivas.
   - Seções com títulos maiores e consistentes.
   - Footer com rótulos e link para anchors.
3. Acessar `/login` e verificar:
   - Novo background `fundo-login.jpg` com overlay mais escuro.
   - Botões em laranja e seta para voltar à página inicial.
   - Botão de registrar navega para `/register`.
4. Testar botão "Fale com nossa Equipe" — abre WhatsApp com mensagem.

Sugestão de commit/PR
---------------------
Commit message:
```
UI: atualizações no Splash, Login/Register, imagens, footer e WhatsApp link
```

PR body:
Use este arquivo (`PR_BODY.md`) como corpo do Pull Request. Se quiser, posso criar o PR com `gh` (GitHub CLI) instruções.
