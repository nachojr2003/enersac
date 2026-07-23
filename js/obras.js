/* ENERSAC — bitácora de obra: filtros + lightbox (vanilla JS) */
(function () {
  'use strict';

  var filtros = document.querySelectorAll('.filtro');
  var tarjetas = Array.prototype.slice.call(document.querySelectorAll('.tarjeta'));
  var vacio = document.getElementById('galeria-vacio');

  /* ----- Filtrado por categoría ----- */
  filtros.forEach(function (btn) {
    btn.addEventListener('click', function () {
      filtros.forEach(function (f) { f.classList.remove('activo'); });
      btn.classList.add('activo');
      var cat = btn.dataset.cat;
      var visibles = 0;
      tarjetas.forEach(function (t) {
        var mostrar = cat === 'todas' || t.dataset.cat === cat;
        t.classList.toggle('oculta', !mostrar);
        if (mostrar) { visibles++; }
      });
      vacio.style.display = visibles === 0 ? 'block' : 'none';
    });
  });

  /* ----- Lightbox ----- */
  var lightbox = document.getElementById('lightbox');
  var lbImg = document.getElementById('lb-img');
  var lbMeta = document.getElementById('lb-meta');
  var lbTitulo = document.getElementById('lb-titulo');
  var btnCerrar = document.getElementById('lb-cerrar');
  var btnAnt = document.getElementById('lb-ant');
  var btnSig = document.getElementById('lb-sig');
  var actual = -1;
  var origen = null; /* elemento que abrió el lightbox, para devolver el foco */

  function listaVisible() {
    return tarjetas.filter(function (t) { return !t.classList.contains('oculta'); });
  }

  function mostrar(indice) {
    var lista = listaVisible();
    if (!lista.length) { return; }
    actual = (indice + lista.length) % lista.length;
    var t = lista[actual];
    var img = t.querySelector('img');
    lbImg.src = img.currentSrc || img.src;
    lbImg.alt = img.alt;
    lbMeta.textContent = t.querySelector('.mono').textContent;
    lbTitulo.textContent = t.querySelector('strong').textContent;
  }

  function abrir(tarjeta) {
    origen = tarjeta;
    var lista = listaVisible();
    mostrar(lista.indexOf(tarjeta));
    lightbox.classList.add('abierto');
    document.body.style.overflow = 'hidden';
    btnCerrar.focus();
  }

  function cerrar() {
    lightbox.classList.remove('abierto');
    document.body.style.overflow = '';
    lbImg.src = '';
    if (origen) { origen.focus(); origen = null; }
  }

  tarjetas.forEach(function (t) {
    t.addEventListener('click', function () { abrir(t); });
    t.addEventListener('keydown', function (ev) {
      if (ev.key === 'Enter' || ev.key === ' ') { ev.preventDefault(); abrir(t); }
    });
  });

  btnCerrar.addEventListener('click', cerrar);
  btnAnt.addEventListener('click', function () { mostrar(actual - 1); });
  btnSig.addEventListener('click', function () { mostrar(actual + 1); });
  lightbox.addEventListener('click', function (ev) {
    if (ev.target === lightbox) { cerrar(); }
  });
  document.addEventListener('keydown', function (ev) {
    if (!lightbox.classList.contains('abierto')) { return; }
    if (ev.key === 'Escape') { cerrar(); }
    if (ev.key === 'ArrowLeft') { mostrar(actual - 1); }
    if (ev.key === 'ArrowRight') { mostrar(actual + 1); }
  });
})();
