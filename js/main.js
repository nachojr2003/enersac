/* ENERSAC — interacciones de la página (vanilla JS, sin dependencias) */
(function () {
  'use strict';

  /* ----- Menú móvil ----- */
  var toggle = document.getElementById('nav-toggle');
  var menuMovil = document.getElementById('nav-movil');
  var iconoAbrir = document.getElementById('icono-abrir');
  var iconoCerrar = document.getElementById('icono-cerrar');

  function cerrarMenu() {
    menuMovil.classList.remove('abierto');
    toggle.setAttribute('aria-expanded', 'false');
    iconoAbrir.style.display = '';
    iconoCerrar.style.display = 'none';
  }

  toggle.addEventListener('click', function () {
    var abierto = menuMovil.classList.toggle('abierto');
    toggle.setAttribute('aria-expanded', String(abierto));
    iconoAbrir.style.display = abierto ? 'none' : '';
    iconoCerrar.style.display = abierto ? '' : 'none';
  });
  menuMovil.querySelectorAll('a').forEach(function (enlace) {
    enlace.addEventListener('click', cerrarMenu);
  });

  /* ----- Navbar sólida al pasar el héroe (sentinela, sin listener de scroll) ----- */
  var nav = document.getElementById('nav');
  var sentinela = document.getElementById('nav-sentinela');
  if ('IntersectionObserver' in window && sentinela) {
    new IntersectionObserver(function (entradas) {
      var arriba = entradas[0].isIntersecting;
      nav.classList.toggle('nav--solida', !arriba);
      nav.classList.toggle('nav--oscura', arriba);
    }, { rootMargin: '80px 0px 0px 0px' }).observe(sentinela);
  }

  /* ----- Revelado al entrar en viewport ----- */
  var revelables = document.querySelectorAll('.revelar');
  if ('IntersectionObserver' in window) {
    var obs = new IntersectionObserver(function (entradas) {
      entradas.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add('visible');
          obs.unobserve(e.target);
        }
      });
    }, { threshold: 0.05 });
    revelables.forEach(function (el) {
      /* Lo que ya está a la vista al cargar se muestra de inmediato (héroe incluido) */
      if (el.getBoundingClientRect().top < window.innerHeight) {
        el.classList.add('visible');
      } else {
        obs.observe(el);
      }
    });
  } else {
    revelables.forEach(function (el) { el.classList.add('visible'); });
  }

  /* ----- Formulario de cotización → correo prellenado -----
     Nota: si más adelante se conecta un workflow de leads (n8n), reemplazar por fetch al webhook. */
  var CORREO_DESTINO = 'proyectos@enersac.pe';
  var form = document.getElementById('form-cotizacion');
  if (form) {
    form.addEventListener('submit', function (ev) {
      ev.preventDefault();
      var datos = new FormData(form);
      var asunto = 'Solicitud de cotización: ' + (datos.get('servicio') || 'proyecto');
      var cuerpo = [
        'Nombre: ' + datos.get('nombre'),
        'Empresa: ' + (datos.get('empresa') || 'No indicada'),
        'Teléfono: ' + datos.get('telefono'),
        'Email: ' + datos.get('email'),
        'Tipo de proyecto: ' + (datos.get('servicio') || 'No indicado'),
        '',
        'Mensaje:',
        datos.get('mensaje')
      ].join('\n');
      window.location.href = 'mailto:' + CORREO_DESTINO +
        '?subject=' + encodeURIComponent(asunto) +
        '&body=' + encodeURIComponent(cuerpo);
    });
  }

  /* ----- Año del pie ----- */
  var anio = document.getElementById('anio');
  if (anio) { anio.textContent = String(new Date().getFullYear()); }
})();
