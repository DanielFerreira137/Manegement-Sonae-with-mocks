# Configuração de Mocks para Demonstração

## O que foi feito

Todas as chamadas à API foram substituídas por mocks para permitir a demonstração do sistema sem depender de uma API externa.

## Arquivos modificados

### 1. `api/mocks.ts`
- Contém todos os dados mock para simular as respostas da API
- Inclui dados para usuários, projetos, insígnias, empresas, logs, etc.
- Simula delays de rede e erros ocasionais

### 2. `api/mockRoutes.ts`
- Contém todas as funções mock que substituem as chamadas reais à API
- Cada função retorna dados mock apropriados
- Simula o comportamento real da API

### 3. `api/routes.ts`
- Modificado para importar as funções mock em vez das funções reais da API
- Todas as exportações agora apontam para os mocks

### 4. `context/loginContext.tsx`
- Ajustado para funcionar com tokens mock
- Cria automaticamente um token mock se não existir um

### 5. `pages/_app.tsx`
- Adicionado o LoginContextProvider para gerenciar autenticação

## Como funciona

1. **Autenticação**: O sistema cria automaticamente um token mock quando necessário
2. **Dados**: Todas as páginas recebem dados mock realistas
3. **Operações**: Todas as operações CRUD (criar, ler, atualizar, deletar) funcionam com mocks
4. **Uploads**: Simula uploads de ficheiros com URLs mock

## Dados mock disponíveis

- **Usuários**: João Silva (joao.silva@sonae.pt)
- **Projetos**: 3 projetos de exemplo:
  - Projeto Renovação Loja 1 (Insígnia Ouro)
  - Projeto Manutenção Loja 2 (Insígnia Prata)
  - **Projeto Construção Centro Comercial (Insígnia Bronze)** - NOVO!
- **Insígnias**: 3 insígnias (Ouro, Prata, Bronze)
- **Empresas**: 2 empresas de exemplo
- **Trabalhos**: 7 trabalhos incluindo fundações, estrutura metálica, HVAC, acabamentos
- **Logs**: 6 logs incluindo progresso da construção
- **Documentos**: 5 documentos incluindo projeto arquitetónico e especificações HVAC
- **Imagens**: 6 imagens reais incluindo progresso da construção

## Para voltar à API real

Para voltar a usar a API real, basta:

1. Reverter as importações em `api/routes.ts` para as funções originais
2. Remover os arquivos `api/mocks.ts` e `api/mockRoutes.ts`
3. Ajustar o `context/loginContext.tsx` se necessário

## Notas importantes

- Os mocks simulam delays de rede (500ms por padrão)
- Há 10% de chance de erro simulado para testar tratamento de erros
- Todos os dados são consistentes entre si
- As imagens usam placeholder.com para URLs de exemplo
