# Illinois Hub - Sistema Unificado

Este projeto une os três sistemas anteriores em uma única plataforma premium com controle de acesso.

## Estrutura
- **Portal**: Localizado em `/portal`. Contém o login, dashboard de seleção e painel administrativo.
- **Módulos**: Localizados em `/modules`. Contém os projetos originais (`gestaotecnica`, `juntas-illinois`, `relatorio-despesas`).
- **Servidor**: Um único servidor Node.js gerencia as rotas e o banco de dados compartilhado (`db.json`).

## Como Iniciar
1. Certifique-se de que o Node.js está instalado.
2. Abra o terminal na pasta `illinois-hub`.
3. Instale as dependências (caso necessário): `npm install express cors`
4. Inicie o servidor: `node server.js` ou use o arquivo `START_SERVER.bat`.
5. Acesse no navegador: `http://localhost:1943`

## Credenciais Padrão
- **Usuário**: `admin`
- **Senha**: `admin`

## Funcionalidades
- **Login Centralizado**: O usuário loga uma vez e tem acesso aos módulos permitidos.
- **Gestão de Usuários**: No menu de Configurações (Admin), é possível criar novos usuários e definir quais módulos cada um pode acessar.
- **Integração**: Cada módulo agora possui uma barra superior para retornar ao menu principal.

---
Desenvolvido por Antigravity.
