/* ================= shared header / footer / language ================= */
(function(){
  "use strict";
  var page = document.body.getAttribute("data-page") || "";

  var HEADER =
  '<header class="site-header" id="siteHeader">'+
    '<div class="wrap hdr">'+
      '<a class="brand" href="index.html"><span class="drop"></span>ALAKÓL</a>'+
      '<nav class="nav">'+
        '<a href="index.html" data-nav="home" data-i18n="nav_home">Главная</a>'+
        '<a href="why.html" data-nav="why" data-i18n="nav_why">Почему Алаколь</a>'+
        '<a href="route.html" data-nav="route" data-i18n="nav_route">Как добраться</a>'+
        '<a href="stay.html" data-nav="stay" data-i18n="nav_stay">Где остановиться</a>'+
        '<a href="explore.html" data-nav="explore" data-i18n="nav_explore">Ландшафт</a>'+
      '</nav>'+
      '<div class="hdr-right">'+
        '<div class="lang" role="group" aria-label="Язык / Тіл">'+
          '<button data-lang="kz">KZ</button>'+
          '<button data-lang="ru">RU</button>'+
        '</div>'+
        '<button class="burger" id="burger" aria-label="Меню"><span></span><span></span><span></span></button>'+
      '</div>'+
    '</div>'+
    '<div class="mobile-nav" id="mobileNav">'+
      '<a href="index.html" data-nav="home" data-i18n="nav_home">Главная</a>'+
      '<a href="why.html" data-nav="why" data-i18n="nav_why">Почему Алаколь</a>'+
      '<a href="route.html" data-nav="route" data-i18n="nav_route">Как добраться</a>'+
      '<a href="stay.html" data-nav="stay" data-i18n="nav_stay">Где остановиться</a>'+
      '<a href="explore.html" data-nav="explore" data-i18n="nav_explore">Ландшафт</a>'+
    '</div>'+
  '</header>';

  var FOOTER =
  '<footer class="site-footer">'+
    '<div class="wrap">'+
      '<div class="foot-grid">'+
        '<div><div class="brand"><span class="drop"></span>ALAKÓL</div>'+
          '<p data-i18n="foot_about">Цифровая туристическая платформа развития региона озера Алаколь.</p></div>'+
        '<div><h4 data-i18n="foot_sections">Разделы</h4>'+
          '<a class="fl" href="why.html" data-i18n="nav_why">Почему Алаколь</a>'+
          '<a class="fl" href="route.html" data-i18n="nav_route">Как добраться</a>'+
          '<a class="fl" href="stay.html" data-i18n="nav_stay">Где остановиться</a>'+
          '<a class="fl" href="explore.html" data-i18n="nav_explore">Ландшафт</a></div>'+
        '<div><h4 data-i18n="foot_contact">Контакты</h4>'+
          '<a class="fl" href="mailto:info@alakol.kz">info@alakol.kz</a>'+
          '<a class="fl" href="tel:+77000000000">+7 (700) 000-00-00</a>'+
          '<a class="fl" href="stay.html" data-i18n="foot_partners">Партнёрам и отелям</a></div>'+
      '</div>'+
      '<div class="foot-bottom">© 2026 ALAKÓL · <span data-i18n="foot_rights">Демонстрационная версия платформы</span></div>'+
    '</div>'+
  '</footer>';

  document.querySelectorAll('[data-include="header"]').forEach(function(el){el.outerHTML=HEADER});
  document.querySelectorAll('[data-include="footer"]').forEach(function(el){el.outerHTML=FOOTER});

  // active nav
  document.querySelectorAll('[data-nav]').forEach(function(a){
    if(a.getAttribute("data-nav")===page) a.classList.add("active");
  });

  // language buttons
  document.querySelectorAll('.lang button').forEach(function(b){
    b.addEventListener("click",function(){ window.I18N.setLang(b.getAttribute("data-lang")); });
  });

  // mobile menu
  var burger=document.getElementById("burger"), mnav=document.getElementById("mobileNav");
  if(burger&&mnav){
    burger.addEventListener("click",function(){ burger.classList.toggle("open"); mnav.classList.toggle("open"); });
    mnav.querySelectorAll("a").forEach(function(a){a.addEventListener("click",function(){burger.classList.remove("open");mnav.classList.remove("open")})});
  }

  // header scrolled state
  var hd=document.getElementById("siteHeader");
  if(hd) window.addEventListener("scroll",function(){hd.classList.toggle("scrolled",window.scrollY>10)},{passive:true});

  // apply saved language now that header/footer/page are in the DOM
  window.I18N.setLang(window.I18N.getLang());
})();
