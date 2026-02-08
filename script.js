const botaoAplicacao = document.querySelectorAll("button[data-name]");

console.log(botaoAplicacao);

if (botaoAplicacao.length > 0) {
  console.log(botaoAplicacao[0].dataset.name);
}

function abrirAplicacao(event) {
  const el = event.currentTarget || event.target;
  const nomeAplicacao = el && el.dataset ? el.dataset.name : undefined;
  if (nomeAplicacao) {
    console.log(nomeAplicacao);
    const url = `apps/${nomeAplicacao}/index.html`;
    const newWin = window.open(url, '_blank');
    if (newWin) {
      try { newWin.opener = null; } catch (e) {}
    } else {
      console.warn('Não foi possível abrir nova aba/janela.');
    }
  } else {
    console.warn('Elemento sem data-name:', el);
  }
}

botaoAplicacao.forEach(btn => btn.addEventListener('click', abrirAplicacao));