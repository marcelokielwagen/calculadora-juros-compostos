/* Motor de cálculo da Calculadora de Juros Compostos.
   Sem nada de tela aqui: só contas. Testável com Node (node testes.js). */

// Tamanho de cada período, em dias (ano = 365 dias, mês = 365/12).
var DIAS = {
  dia: 1, semana: 7, quinzena: 15, mes: 365 / 12, bimestre: 365 / 6,
  trimestre: 365 / 4, semestre: 365 / 2, ano: 365
};
var DIAS_PRAZO = { dias: 1, semanas: 7, meses: 365 / 12, anos: 365 };

function simular(p) {
  var R = Math.round;
  var N = Math.max(1, R(p.prazo * DIAS_PRAZO[p.prazoUn]));          // prazo em dias
  var Lc = DIAS[p.cap], Lr = DIAS[p.taxaPer], La = DIAS[p.aporteFreq];
  var r = p.taxa / 100;
  // taxa que cai a cada capitalização
  var f = p.tipo === 'nominal' ? r * Lc / Lr : Math.pow(1 + r, Lc / Lr) - 1;

  // Marca os dias em que algo acontece: k*L (arredondado), k = de, de+1, ...
  function marcar(L, de) {
    var a = new Uint8Array(N + 1);
    for (var k = de; ; k++) { var d = R(k * L); if (d > N) break; a[d] = 1; }
    return a;
  }
  var evJuros = marcar(Lc, 1);
  var evMes = marcar(365 / 12, 1);
  var inicio = p.momento === 'inicio';
  var evAporte = p.aporte > 0 ? marcar(La, inicio ? 0 : 1) : null;
  if (evAporte && inicio) evAporte[N] = 0;   // aporte no início não faz sentido no último dia

  // Quantas linhas a tabela terá; se passar de 4000, mostra por período maior.
  var ordem = ['dia', 'semana', 'mes', 'ano'];
  var exibir = ordem.indexOf(p.exibir) >= 0 ? p.exibir : 'mes';
  var aviso = '';
  while (N / DIAS[exibir] > 4000 && exibir !== 'ano') {
    exibir = ordem[ordem.indexOf(exibir) + 1];
    aviso = 'Tabela agrupada por ' + { semana: 'semana', mes: 'mês', ano: 'ano' }[exibir] + ' para não ficar gigante.';
  }
  var evTabela = marcar(DIAS[exibir], 1);
  evTabela[N] = 1;

  var bal = 0, inv = 0, juros = 0, taxas = 0;
  var tAdm = 0, tEntrada = 0, tFixaMes = 0;
  var metaDia = null;
  var rows = [], idx = 0;
  var prev = { inv: 0, juros: 0, taxas: 0 };

  function depositar(valor, fixa) {
    if (valor <= 0) return;
    var fee = valor * p.entrada / 100 + fixa;
    inv += valor;
    bal = Math.max(0, bal + valor - fee);
    taxas += fee; tEntrada += fee;
  }
  function linha(d) {
    rows.push({
      per: idx++, dia: d,
      aporte: inv - prev.inv, juros: juros - prev.juros, taxas: taxas - prev.taxas,
      inv: inv, jurosAc: juros, bal: bal
    });
    prev = { inv: inv, juros: juros, taxas: taxas };
  }

  for (var d = 0; d <= N; d++) {
    if (d === 0) {
      depositar(p.capital, 0);
    } else {
      if (evJuros[d]) { var g = bal * f; bal += g; juros += g; }
      if (evMes[d]) {
        var adm = bal * (p.admin / 100) / 12;
        var fx = Math.min(bal - adm, p.fixaMes);
        bal = Math.max(0, bal - adm - fx);
        taxas += adm + fx; tAdm += adm; tFixaMes += fx;
      }
    }
    if (evAporte && evAporte[d]) {
      depositar(p.aporte * Math.pow(1 + p.reajuste / 100, Math.floor(d / 365)), p.fixaAporte);
    }
    if (metaDia === null && p.meta > 0 && bal >= p.meta) metaDia = d;
    if (d === 0 || evTabela[d]) linha(d);
  }

  // Fechamento: taxa de performance e imposto sobre o lucro
  var ganho = bal - inv;
  var perf = p.performance / 100 * Math.max(0, ganho);
  var aliq = 0;
  if (p.ir === 'fixo') aliq = p.irFixo / 100;
  else if (p.ir === 'regressivo') aliq = N <= 180 ? 0.225 : N <= 360 ? 0.20 : N <= 720 ? 0.175 : 0.15;
  var ir = aliq * Math.max(0, ganho - perf);
  var liquido = bal - perf - ir;
  var real = liquido / Math.pow(1 + p.inflacao / 100, N / 365);

  return {
    rows: rows, aviso: aviso, exibir: exibir, N: N, taxaPorCap: f, aliqIR: aliq,
    investido: inv, jurosBrutos: juros, saldoBruto: bal,
    taxaAdmin: tAdm, taxaEntrada: tEntrada, taxaFixaMes: tFixaMes, taxaPerf: perf,
    taxasTotal: taxas + perf, ir: ir, liquido: liquido, real: real,
    rentab: inv > 0 ? liquido / inv - 1 : 0, metaDia: metaDia
  };
}

if (typeof module !== 'undefined') module.exports = { simular: simular, DIAS: DIAS };
