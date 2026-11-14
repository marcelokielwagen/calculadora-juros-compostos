// Uso: node testes.js  — confere o motor de cálculo contra fórmulas conhecidas.
const { simular } = require('./calculo.js');
const base = {
  capital: 1000, taxa: 1, taxaPer: 'mes', cap: 'mes', tipo: 'efetiva',
  prazo: 12, prazoUn: 'meses', aporte: 0, aporteFreq: 'mes', momento: 'fim',
  reajuste: 0, admin: 0, performance: 0, entrada: 0, fixaAporte: 0, fixaMes: 0,
  ir: 'nenhum', irFixo: 0, inflacao: 0, meta: 0, exibir: 'mes'
};
let falhas = 0;
function esperar(nome, obtido, esperado, tol = 0.01) {
  const ok = Math.abs(obtido - esperado) <= tol;
  if (!ok) falhas++;
  console.log((ok ? 'OK   ' : 'FALHOU ') + nome + ': ' + obtido.toFixed(2) + ' (esperado ' + esperado.toFixed(2) + ')');
}
const com = (o) => simular({ ...base, ...o });

esperar('1000 a 1% a.m. por 12 meses', com({}).saldoBruto, 1000 * 1.01 ** 12);
const fv = 100 * ((1.01 ** 12 - 1) / 0.01);
esperar('+ aporte 100/mês no fim', com({ aporte: 100 }).saldoBruto, 1000 * 1.01 ** 12 + fv);
esperar('+ aporte 100/mês no início', com({ aporte: 100, momento: 'inicio' }).saldoBruto, 1000 * 1.01 ** 12 + fv * 1.01);
esperar('12% a.a. efetiva, 1 ano, cap. mensal', com({ taxa: 12, taxaPer: 'ano' }).saldoBruto, 1120);
esperar('12% a.a. nominal, cap. mensal', com({ taxa: 12, taxaPer: 'ano', tipo: 'nominal' }).saldoBruto, 1000 * 1.01 ** 12);
esperar('1% a.m. capitalizado por dia, 1 ano ≈ 12,68%', com({ cap: 'dia' }).saldoBruto, 1000 * 1.01 ** 12, 0.05);
esperar('5 anos a 10% a.a.', com({ taxa: 10, taxaPer: 'ano', cap: 'ano', prazo: 5, prazoUn: 'anos' }).saldoBruto, 1000 * 1.1 ** 5);
const ir = com({ ir: 'regressivo', prazo: 3, prazoUn: 'anos' });
esperar('IR regressivo 15% (3 anos)', ir.ir, 0.15 * (ir.saldoBruto - 1000));
esperar('Líquido = bruto - IR', ir.liquido, ir.saldoBruto - ir.ir);
esperar('Taxa de entrada 2% no capital', com({ entrada: 2 }).investido - 1000 + com({ entrada: 2 }).taxaEntrada, 20);
esperar('Taxa de performance 20% do lucro', com({ performance: 20 }).taxaPerf, 0.2 * (1000 * 1.01 ** 12 - 1000));
esperar('Inflação 5% a.a. por 1 ano', com({ inflacao: 5 }).real, 1000 * 1.01 ** 12 / 1.05);
const m = com({ meta: 1100 });
esperar('Meta 1100 atingida no mês 10 (dias ~304)', m.metaDia, 304, 2);
const r = com({ aporte: 100 });
esperar('Soma da tabela = saldo final', r.rows[r.rows.length - 1].bal, r.saldoBruto);
esperar('Saldo = investido + juros - taxas', r.investido + r.jurosBrutos - r.taxasTotal, r.saldoBruto);
const longo = com({ prazo: 30, prazoUn: 'anos', exibir: 'dia' });
esperar('30 anos "por dia" vira tabela menor que 4001 linhas', longo.rows.length <= 4001 ? 1 : 0, 1, 0);
console.log(falhas ? '\n' + falhas + ' FALHA(S)' : '\nTudo certo.');
process.exit(falhas ? 1 : 0);
