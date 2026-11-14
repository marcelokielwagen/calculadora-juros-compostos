# Calculadora de Juros Compostos

Calculadora com cara de planilha do Excel. Abre direto no navegador (computador ou celular), sem instalar nada. O resultado atualiza sozinho enquanto você muda os números.

| Opção | O que dá para escolher |
|---|---|
| Taxa de juros | ao dia, semana, mês, bimestre, trimestre, semestre ou ano |
| Capitalização | diária, semanal, mensal, trimestral, semestral ou anual |
| Tipo de taxa | efetiva (equivalente) ou nominal (proporcional) |
| Prazo | em dias, semanas, meses ou anos |
| Aportes | valor e frequência (diário até anual), no início ou no fim do período, com reajuste anual |
| Taxas de cobrança (terceirizado) | administração (% a.a.), performance (% do lucro), entrada (% de cada depósito), fixa por aporte (R$) e fixa mensal (R$) |
| Imposto de renda | nenhum, tabela regressiva (22,5% a 15%) ou alíquota fixa |
| Inflação | mostra o valor final em dinheiro de hoje |
| Meta | diz em quanto tempo você chega no valor desejado |

Três abas, como no Excel: **Calculadora** (campos amarelos + resultado), **Evolução** (tabela por dia, semana, mês ou ano, com opção de exportar para o Excel) e **Gráfico** (investido x juros).

## Arquivos

| Arquivo | O que é |
|---|---|
| `index.html` | A página |
| `calculo.js` | As contas (sem tela) |
| `testes.js` | Confere as contas contra fórmulas conhecidas. Uso: `node testes.js` |

Seus números ficam salvos só no seu navegador. Nada é enviado para lugar nenhum.

Desenvolvido por Claude Sonnet 5.5.
