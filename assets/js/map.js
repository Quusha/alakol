/* ================= interactive map of Kazakhstan ================= */
(function(){
  "use strict";
  var reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Real Kazakhstan border (Natural Earth, simplified) projected to a 1000x581 canvas.
  var KZ_PATH = "M589.9 481.5 L577.2 487.7 L547.9 510.8 L538.2 534.6 L529.9 534.8 L523.8 519.1 L495.6 518.0 L491.1 490.8 L480.2 490.6 L481.9 457.3 L455.3 433.0 L417.2 435.6 L391.2 440.4 L370.0 410.5 L351.8 397.9 L317.4 374.2 L313.3 371.3 L256.1 390.9 L257.0 513.3 L245.6 514.9 L230.0 488.9 L215.0 479.6 L189.8 486.5 L180.0 497.6 L178.8 489.5 L184.2 475.6 L180.0 464.1 L154.3 452.8 L144.2 422.9 L132.0 414.5 L131.2 403.7 L152.8 406.9 L153.7 382.6 L172.6 377.2 L192.0 382.2 L196.0 349.8 L192.0 329.3 L169.8 330.9 L150.9 322.8 L125.2 337.4 L104.5 344.3 L93.2 339.0 L95.5 321.9 L81.3 299.7 L64.8 300.6 L46.0 278.1 L58.8 252.9 L52.3 246.2 L70.0 209.7 L92.9 228.9 L95.6 204.7 L141.5 168.6 L176.2 167.7 L225.1 190.7 L251.4 204.1 L275.0 190.1 L310.2 189.5 L338.6 206.7 L345.0 196.8 L376.2 198.3 L381.8 182.5 L345.8 159.7 L367.1 143.5 L362.9 134.5 L384.2 125.9 L368.2 103.1 L378.4 91.8 L461.5 80.2 L472.3 72.0 L527.9 59.8 L547.8 46.0 L587.8 53.2 L594.7 87.6 L617.9 79.5 L646.4 90.8 L644.6 108.9 L665.9 107.0 L721.5 75.7 L713.4 86.1 L741.8 111.8 L791.4 196.1 L803.2 178.7 L833.8 197.8 L865.7 189.3 L878.0 195.3 L888.6 214.4 L904.2 220.9 L913.6 235.0 L942.2 230.5 L954.0 250.8 L937.1 272.9 L918.7 276.1 L917.6 309.3 L905.2 324.3 L861.2 313.4 L845.2 372.9 L833.8 380.3 L789.8 393.5 L809.8 451.2 L794.6 459.8 L796.4 478.8 L782.7 473.9 L771.5 462.0 L738.6 458.5 L701.8 457.6 L693.7 461.2 L662.1 447.3 L649.5 454.1 L646.0 473.7 L609.5 462.3 L594.9 467.0 L589.9 481.5 Z";

  var PINS=[
    {id:"astana",cls:"city",x:601.2,y:186.3,r:6,ring:13,lx:0,ly:-16,an:"middle"},
    {id:"pavlodar",cls:"hist",x:722.9,y:149.1,r:5,ring:12,lx:0,ly:-13,an:"middle"},
    {id:"kurchatov",cls:"hist",x:758.2,y:199.9,r:4.5,ring:11,lx:26,ly:4,an:"start"},
    {id:"semey",cls:"hist",x:795.7,y:211.2,r:5.5,ring:12,lx:0,ly:-13,an:"middle"},
    {id:"almaty",cls:"city",x:721.5,y:449.2,r:6,ring:13,lx:0,ly:24,an:"middle"},
    {id:"dostyk",cls:"border",x:845.9,y:382.1,r:4.5,ring:10,lx:8,ly:14,an:"start"},
    {id:"bakty",cls:"border",x:851.0,y:332.7,r:4.5,ring:10,lx:8,ly:-8,an:"start"},
    {id:"kabanbay",cls:"village",x:805,y:368,r:3.5,ring:9,lx:-8,ly:6,an:"end"},
    {id:"akshi",cls:"village",x:833,y:335,r:3.5,ring:9,lx:8,ly:-6,an:"start"}
  ];

  var NAMES={
    ru:{astana:"Астана",almaty:"Алматы",semey:"Семей",pavlodar:"Павлодар",kurchatov:"Курчатов",alakol:"Алаколь",dostyk:"Достык",bakty:"Бақты",kabanbay:"Кабанбай",akshi:"Акши"},
    kz:{astana:"Астана",almaty:"Алматы",semey:"Семей",pavlodar:"Павлодар",kurchatov:"Курчатов",alakol:"Алакөл",dostyk:"Достық",bakty:"Бақты",kabanbay:"Қабанбай",akshi:"Ақши"}
  };
  var REG={ru:{abai:"Абай",jetisu:"Жетісу"},kz:{abai:"Абай",jetisu:"Жетісу"}};

  var POINTS={
    ru:{
      astana:{t:"Астана",tag:"Столица · старт",d:"Точка старта для севера страны: отсюда идёт ж/д магистраль Астана → Достык и авиасообщение."},
      almaty:{t:"Алматы",tag:"Южный хаб",d:"Крупнейший город и «южные ворота». Прямая автотрасса до Алаколя — самый популярный маршрут."},
      kurchatov:{t:"Курчатов",tag:"Историко-научный",d:"Узел в области Абай с особым историко-научным контекстом территории."},
      semey:{t:"Семей",tag:"Ворота Абая",d:"Сюда сходятся дороги из Павлодара и далее ведут к озеру."},
      pavlodar:{t:"Павлодар",tag:"Северный въезд",d:"Северный вход в маршрут: трасса Павлодар → Семей → Алаколь."},
      alakol:{t:"Алаколь",tag:"Сердце маршрута",d:"«Разноцветное» лечебное озеро на стыке Абая и Жетісу. Основной въезд — через Бақты."},
      dostyk:{t:"Достык",tag:"Ж/д погранпереход",d:"Конечная магистрали Астана → Достык, погранпереход с Китаем."},
      bakty:{t:"Бақты",tag:"Осн. автовъезд",d:"Основная автотрасса-погранпереход рядом с озером — ключевой ориентир подъезда."},
      kabanbay:{t:"Кабанбай",tag:"Прибрежное село",d:"Село у берега — одна из баз размещения и въезда в курортную зону."},
      akshi:{t:"Акши",tag:"Курортное село",d:"Прибрежное село Алаколя, точка размещения и доступа к пляжам."}
    },
    kz:{
      astana:{t:"Астана",tag:"Елорда · бастау",d:"Солтүстік үшін бастау нүктесі: осы жерден Астана → Достық теміржолы мен әуе қатынасы басталады."},
      almaty:{t:"Алматы",tag:"Оңтүстік хаб",d:"Ең ірі қала әрі «оңтүстік қақпа». Алакөлге тікелей тас жол — ең танымал бағыт."},
      kurchatov:{t:"Курчатов",tag:"Тарихи-ғылыми",d:"Абай облысындағы ерекше тарихи-ғылыми маңызы бар түйін."},
      semey:{t:"Семей",tag:"Абай қақпасы",d:"Мұнда Павлодардан жолдар тоғысып, әрі қарай көлге бағыттайды."},
      pavlodar:{t:"Павлодар",tag:"Солтүстік кіріс",d:"Бағытқа солтүстік кіріс: Павлодар → Семей → Алакөл жолы."},
      alakol:{t:"Алакөл",tag:"Бағыт жүрегі",d:"Абай мен Жетісу түйісіндегі «түрлі-түсті» шипалы көл. Негізгі кіріс — Бақты арқылы."},
      dostyk:{t:"Достық",tag:"Теміржол өткелі",d:"Астана → Достық магистралінің соңы, Қытаймен шекара өткелі."},
      bakty:{t:"Бақты",tag:"Негізгі автокіріс",d:"Көл маңындағы негізгі автомобиль өткелі — жаққа жетудің басты бағдары."},
      kabanbay:{t:"Қабанбай",tag:"Жаға ауылы",d:"Жаға маңындағы ауыл — курорт аймағына тұру мен кірудің бір базасы."},
      akshi:{t:"Ақши",tag:"Курорт ауылы",d:"Алакөлдің жаға ауылы, тұру мен жағажайға шығу нүктесі."}
    }
  };
  var JOURNEY={
    ru:{
      almaty:{t:"Алматы → Алаколь",tag:"≈ 560 км",d:"Самый популярный маршрут: по трассе через Ушарал и погранпост Бақты — прямо к южному берегу озера."},
      astana:{t:"Астана → Алаколь",tag:"Железная дорога",d:"По магистрали Астана–Достык до ближайшей станции у озера, далее короткий трансфер к берегу."},
      semey:{t:"Семей → Алаколь",tag:"≈ 500 км",d:"Через область Абай и Аягоз — удобный въезд к озеру с северо-востока."},
      pavlodar:{t:"Павлодар → Алаколь",tag:"Северный путь",d:"Единый северный маршрут: Павлодар → Семей → Алаколь по трассе."}
    },
    kz:{
      almaty:{t:"Алматы → Алакөл",tag:"≈ 560 км",d:"Ең танымал бағыт: Үшарал мен Бақты өткелі арқылы — тікелей көлдің оңтүстік жағасына."},
      astana:{t:"Астана → Алакөл",tag:"Теміржол",d:"Астана–Достық магистралімен көлге жақын станцияға дейін, одан кейін қысқа трансфер."},
      semey:{t:"Семей → Алакөл",tag:"≈ 500 км",d:"Абай облысы мен Аягөз арқылы — көлге солтүстік-шығыстан ыңғайлы кіріс."},
      pavlodar:{t:"Павлодар → Алакөл",tag:"Солтүстік жол",d:"Біртұтас солтүстік бағыт: Павлодар → Семей → Алакөл тас жолмен."}
    }
  };
  var ROADNAME={
    ru:{"r-rail":"Ж/д Астана → Достык","r-pav":"Трасса Павлодар → Семей","r-sem":"Трасса Семей → Алаколь","r-alm":"Трасса Алматы → Алаколь","r-bak":"Въезд Алаколь → Бақты"},
    kz:{"r-rail":"Теміржол Астана → Достық","r-pav":"Тас жол Павлодар → Семей","r-sem":"Тас жол Семей → Алакөл","r-alm":"Тас жол Алматы → Алакөл","r-bak":"Кіріс Алакөл → Бақты"}
  };
  var ORIGIN_PATHS={almaty:["r-alm"],astana:["r-rail"],semey:["r-sem"],pavlodar:["r-pav","r-sem"]};
  var PRIMARY={almaty:"r-alm",astana:"r-rail",semey:"r-sem",pavlodar:"r-sem"};
  var REGION_OF={almaty:"jetisu",astana:null,semey:"abai",pavlodar:"abai"};
  var ORIGINS=["almaty","astana","semey","pavlodar"];

  function pinSVG(p){
    return '<g class="pin '+p.cls+'" data-id="'+p.id+'" transform="translate('+p.x+' '+p.y+')">'+
      '<circle class="hit" r="'+(p.r+14)+'"/>'+
      '<g class="pop"><circle class="ring" r="'+p.ring+'"/><circle class="core" r="'+p.r+'"/></g>'+
      '<text class="lbl" data-city="'+p.id+'" x="'+p.lx+'" y="'+p.ly+'" text-anchor="'+p.an+'"></text></g>';
  }

  function buildSVG(){
    var pins=PINS.map(pinSVG).join("");
    return ''+
    '<div class="mapstage">'+
    '<svg class="kzmap" viewBox="0 0 1000 581" role="img" aria-label="Карта Казахстана">'+
      '<defs>'+
        '<linearGradient id="land" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#14636b"/><stop offset="1" stop-color="#0d4b53"/></linearGradient>'+
        '<filter id="glow" x="-60%" y="-60%" width="220%" height="220%"><feGaussianBlur stdDeviation="4" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>'+
        '<radialGradient id="tracerG"><stop offset="0" stop-color="#fff"/><stop offset="55%" stop-color="#FFC24B"/><stop offset="100%" stop-color="#FF7A45" stop-opacity="0"/></radialGradient>'+
      '</defs>'+
      '<path class="kz-outline" d="'+KZ_PATH+'"/>'+
      '<ellipse class="regionblob" data-r="abai" cx="795" cy="238" rx="78" ry="90" fill="#2BD4C8" fill-opacity=".1" stroke="#2BD4C8" stroke-opacity=".35" stroke-dasharray="5 6"/>'+
      '<ellipse class="regionblob" data-r="jetisu" cx="770" cy="380" rx="84" ry="66" fill="#FF8A4C" fill-opacity=".1" stroke="#FF8A4C" stroke-opacity=".38" stroke-dasharray="5 6"/>'+
      '<text class="rlabel reg" data-reg="abai" x="762" y="240">Абай</text>'+
      '<text class="rlabel reg" data-reg="jetisu" x="726" y="392" fill="#ffe0c9">Жетісу</text>'+
      '<path id="r-rail" class="route-rail" d="M601.2 186.3 C670 178 740 190 795.7 211.2 C825 250 835 320 845.9 382.1"/>'+
      '<path id="r-pav" class="route-road road dim" d="M722.9 149.1 C748 168 775 190 795.7 211.2"/>'+
      '<path id="r-sem" class="route-road road" d="M795.7 211.2 C799 245 800 270 800.1 292.5 C806 322 815 346 826.1 354.3"/>'+
      '<path id="r-alm" class="route-road road" d="M721.5 449.2 C735 420 745 402 754.6 390.1 C780 366 800 356 826.1 354.3"/>'+
      '<path id="r-bak" class="route-road road dim" d="M826.1 354.3 C836 346 845 340 851 332.7"/>'+
      '<g transform="translate(826.1 354.3)"><circle class="alakol-halo" r="30"/></g>'+
      '<circle class="tracer" r="7" fill="url(#tracerG)" style="opacity:0"></circle>'+
      pins+
      '<g class="pin lake active" data-id="alakol" transform="translate(826.1 354.3)">'+
        '<circle class="hit" r="26"/><circle class="ripple" r="15"/><circle class="ripple d2" r="15"/>'+
        '<g class="pop"><circle class="ring" r="16"/><path class="alakol-star" d="M0 -12 L3.4 -3.7 L12 -3.7 L5.2 1.8 L7.9 10 L0 5 L-7.9 10 L-5.2 1.8 L-12 -3.7 L-3.4 -3.7 Z"/></g>'+
        '<text class="lbl" data-city="alakol" y="-19" text-anchor="middle" style="font-size:15px;fill:#fff"></text></g>'+
    '</svg>'+
    '<div class="map-tip"></div>'+
    '</div>'+
    '<div class="legend">'+
      '<span><i style="border-color:#ffd27a"></i><span class="lg" data-k="lg_rail"></span></span>'+
      '<span><i style="border-color:#FF8A4C"></i><span class="lg" data-k="lg_road"></span></span>'+
      '<span><i class="sq" style="background:#FF8A4C"></i><span class="lg" data-k="lg_lake"></span></span>'+
    '</div>'+
    '<div class="map-controls">'+
      '<span class="mc-hint"></span>'+
      '<div class="mc-row">'+
        '<button class="mc" data-go="almaty"></button>'+
        '<button class="mc" data-go="astana"></button>'+
        '<button class="mc" data-go="semey"></button>'+
        '<button class="mc" data-go="pavlodar"></button>'+
      '</div>'+
    '</div>';
  }

  function init(){
    var mount=document.querySelector(".map-mount"); if(!mount) return;
    mount.innerHTML=buildSVG();
    var svg=mount.querySelector(".kzmap");
    var stage=mount.querySelector(".mapstage");
    var tip=mount.querySelector(".map-tip");
    var tracer=mount.querySelector(".tracer");
    var info=document.querySelector("#mapInfo");
    var lang=window.I18N.getLang();
    var mapLock=null, curSel={mode:"point",id:"alakol"}, travelRAF=null, drawn=false;

    function byId(id){return svg.querySelector("#"+id)}
    function pinEl(id){return svg.querySelector('.pin[data-id="'+id+'"]')}

    function setLabels(){
      lang=window.I18N.getLang();
      svg.querySelectorAll(".lbl").forEach(function(t){var c=t.getAttribute("data-city");t.textContent=(NAMES[lang]||NAMES.ru)[c]||c});
      svg.querySelectorAll(".reg").forEach(function(t){var r=t.getAttribute("data-reg");t.textContent=(REG[lang]||REG.ru)[r]||r});
      mount.querySelectorAll(".lg").forEach(function(s){s.textContent=window.I18N.t(s.getAttribute("data-k"),lang)});
      mount.querySelector(".mc-hint").textContent=window.I18N.t("mc_hint",lang);
      mount.querySelectorAll(".mc").forEach(function(b){b.textContent=window.I18N.t("mc_"+b.getAttribute("data-go"),lang)});
    }
    function renderInfo(o){ if(info) info.innerHTML='<div class="t">'+o.t+' <span class="tag">'+o.tag+'</span></div><p>'+o.d+'</p>'; }
    function clearHot(){
      svg.querySelectorAll(".route-road,.route-rail").forEach(function(p){p.classList.remove("hot")});
      svg.querySelectorAll(".pin").forEach(function(p){if(p.getAttribute("data-id")!=="alakol")p.classList.remove("active")});
      svg.querySelectorAll(".regionblob").forEach(function(r){r.classList.remove("lit")});
    }
    function stopTravel(){if(travelRAF){cancelAnimationFrame(travelRAF);travelRAF=null}if(tracer)tracer.style.opacity=0}
    function travel(id){
      stopTravel(); if(reduceMotion) return;
      var p=byId(id); if(!p||!tracer) return;
      var len=p.getTotalLength(),start=null,dur=2600; tracer.style.opacity=1;
      function fr(ts){if(!start)start=ts;var t=((ts-start)%dur)/dur;var pt=p.getPointAtLength(t*len);tracer.setAttribute("cx",pt.x);tracer.setAttribute("cy",pt.y);travelRAF=requestAnimationFrame(fr)}
      travelRAF=requestAnimationFrame(fr);
    }
    function paintOrigin(o){
      clearHot();
      (ORIGIN_PATHS[o]||[]).forEach(function(id){var e=byId(id);if(e)e.classList.add("hot")});
      var pe=pinEl(o); if(pe)pe.classList.add("active");
      var rg=REGION_OF[o]; if(rg){var re=svg.querySelector('.regionblob[data-r="'+rg+'"]');if(re)re.classList.add("lit")}
      renderInfo((JOURNEY[lang]||JOURNEY.ru)[o]); travel(PRIMARY[o]);
    }
    function paintPoint(id){
      clearHot(); var pe=pinEl(id); if(pe)pe.classList.add("active");
      renderInfo((POINTS[lang]||POINTS.ru)[id]||(POINTS[lang]||POINTS.ru).alakol);
      if(id==="alakol"){travel("r-alm")}else{stopTravel()}
    }
    function rerender(){ if(curSel.mode==="origin")paintOrigin(curSel.id); else paintPoint(curSel.id); }
    function restore(){ rerender(); }

    // controls
    mount.querySelectorAll(".mc").forEach(function(b){var o=b.getAttribute("data-go");
      b.addEventListener("click",function(){mapLock=o;curSel={mode:"origin",id:o};mount.querySelectorAll(".mc").forEach(function(x){x.classList.toggle("on",x===b)});paintOrigin(o)});
      b.addEventListener("mouseenter",function(){paintOrigin(o)});
      b.addEventListener("mouseleave",function(){restore()});
    });
    // tooltip
    function showTip(cx,cy,html){var r=stage.getBoundingClientRect();tip.innerHTML=html;tip.style.left=(cx-r.left)+"px";tip.style.top=(cy-r.top)+"px";tip.classList.add("on")}
    function hideTip(){tip.classList.remove("on")}
    // pins
    svg.querySelectorAll(".pin").forEach(function(pin){var id=pin.getAttribute("data-id");
      pin.addEventListener("click",function(){
        if(ORIGINS.indexOf(id)>=0){mapLock=id;curSel={mode:"origin",id:id};mount.querySelectorAll(".mc").forEach(function(x){x.classList.toggle("on",x.getAttribute("data-go")===id)});paintOrigin(id);}
        else{mapLock=null;curSel={mode:"point",id:id};mount.querySelectorAll(".mc").forEach(function(x){x.classList.remove("on")});paintPoint(id);}
      });
      pin.addEventListener("mouseenter",function(){var p=(POINTS[lang]||POINTS.ru)[id];if(p){var r=pin.getBoundingClientRect();showTip(r.left+r.width/2,r.top+r.height*0.34,"<b>"+p.t+"</b>")}if(ORIGINS.indexOf(id)>=0)paintOrigin(id);});
      pin.addEventListener("mouseleave",function(){hideTip();restore()});
    });
    // roads
    svg.querySelectorAll(".route-road,.route-rail").forEach(function(rd){
      rd.addEventListener("mouseenter",function(e){rd.classList.add("hot");var nm=(ROADNAME[lang]||ROADNAME.ru)[rd.id];if(nm)showTip(e.clientX,e.clientY,nm)});
      rd.addEventListener("mousemove",function(e){var nm=(ROADNAME[lang]||ROADNAME.ru)[rd.id];if(nm)showTip(e.clientX,e.clientY,nm)});
      rd.addEventListener("mouseleave",function(){hideTip();restore()});
    });
    // draw-in
    function drawRoutes(){
      if(drawn)return; drawn=true;
      var roads=svg.querySelectorAll(".road");
      roads.forEach(function(p){var L=p.getTotalLength();p.style.strokeDasharray=L;p.style.strokeDashoffset=reduceMotion?0:L});
      if(!reduceMotion){requestAnimationFrame(function(){roads.forEach(function(p,i){p.style.transition="stroke-dashoffset 1.3s ease "+(i*0.14)+"s";p.style.strokeDashoffset=0})})}
    }
    var obs=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){drawRoutes();paintPoint("alakol");obs.disconnect()}})},{threshold:.2});
    obs.observe(stage);

    setLabels();
    document.addEventListener("langchange",function(){ setLabels(); rerender(); });
  }

  if(document.readyState==="loading") document.addEventListener("DOMContentLoaded",init); else init();
})();
