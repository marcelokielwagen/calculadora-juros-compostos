# Calculadora de Juros Compostos

Calculadora feita para o celular: campos grandes, botões para escolher as opções e o valor final sempre visível no topo. O resultado atualiza sozinho enquanto você muda os números. Abre direto no navegador, sem instalar nada.

| Opção | O que dá para escolher |
|---|---|
| Capital inicial | quanto você já tem (botões − e +) |
| Taxa de juros | ao dia, semana, mês, trimestre, semestre ou ano |
| Os juros são somados | todo dia, semana, mês, trimestre, semestre ou ano |
| Prazo | em dias, semanas, meses ou anos |
| Aportes | valor e frequência (todo dia até todo ano) |
| Imposto de renda | não, tabela regressiva (22,5% a 15%) ou percentual fixo |

Três abas embaixo: **Calcular**, **Tabela** (por dia, semana, mês ou ano, com opção de baixar para o Excel) e **Gráfico** (do seu bolso x juros ganhos).

## Arquivos

| Arquivo | O que é |
|---|---|
| `index.html` | A página |
| `calculo.js` | As contas (sem tela) |
| `testes.js` | Confere as contas contra fórmulas conhecidas. Uso: `node testes.js` |

Seus números ficam salvos só no seu navegador. Nada é enviado para lugar nenhum.

Desenvolvido por Claude Sonnet 5.5.
