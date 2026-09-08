/* ================= live lake scene: time-of-day + travel date ================= */
(function(){
  "use strict";
  function init(){
    var heroEl=document.querySelector(".hero"); if(!heroEl) return;
    var travelInput=document.getElementById("travelDate");

    function hx(h){h=h.replace("#","");return [parseInt(h.slice(0,2),16),parseInt(h.slice(2,4),16),parseInt(h.slice(4,6),16)]}
    function toHex(a){return "#"+a.map(function(v){v=Math.max(0,Math.min(255,Math.round(v)));return (v<16?"0":"")+v.toString(16)}).join("")}
    function lerpC(a,b,t){a=hx(a);b=hx(b);return toHex([a[0]+(b[0]-a[0])*t,a[1]+(b[1]-a[1])*t,a[2]+(b[2]-a[2])*t])}
    function bright(c,m){var a=hx(c);return toHex([a[0]*m,a[1]*m,a[2]*m])}

    var SEASON={
      winter:{far:"#6fb8c4",mid:"#3f8b9a",near:"#28545f",ref:"#d3e9ef",ico:"❄️",n:{ru:"Зима",kz:"Қыс"}},
      spring:{far:"#33c1b6",mid:"#12979d",near:"#0b616c",ref:"#caecec",ico:"🌱",n:{ru:"Весна",kz:"Көктем"}},
      summer:{far:"#22ccc4",mid:"#0fa6ab",near:"#0a5f68",ref:"#bfe9e6",ico:"🌊",n:{ru:"Лето",kz:"Жаз"}},
      autumn:{far:"#3aa79b",mid:"#1c7f7d",near:"#0e5252",ref:"#d7e6d5",ico:"🍂",n:{ru:"Осень",kz:"Күз"}}
    };
    function seasonOf(m){if(m<=1||m===11)return "winter";if(m<=4)return "spring";if(m<=7)return "summer";return "autumn"}

    var DAY=[
      {h:0,   sky1:"#0a1430",sky2:"#122349",sky3:"#1d3260",sun:"#cfd8ee",glow:"#8ea3d6",sx:32,sy:20,so:.8, amb:"#0a1330",ao:.36,mood:"#14294d",mul:.5, star:1, ico:"🌙",lab:{ru:"Ночь",kz:"Түн"}},
      {h:5.5, sky1:"#2a2a5e",sky2:"#7b5a86",sky3:"#f0a97e",sun:"#ffd9a8",glow:"#ff9e6a",sx:20,sy:64,so:.95,amb:"#b5638a",ao:.22,mood:"#7a5a6e",mul:.72,star:.28,ico:"🌅",lab:{ru:"Рассвет",kz:"Таң"}},
      {h:8,   sky1:"#6db6e6",sky2:"#a9dbf0",sky3:"#e4f3ea",sun:"#fff3cf",glow:"#ffe6a6",sx:30,sy:40,so:.97,amb:"#ffe9c8",ao:.06,mood:"#bfe6ee",mul:.95,star:0, ico:"🌤️",lab:{ru:"Утро",kz:"Таңертең"}},
      {h:13,  sky1:"#4aa8e6",sky2:"#9fd6f2",sky3:"#e9f5ef",sun:"#fffbe6",glow:"#fff0b0",sx:60,sy:12,so:1, amb:"#ffffff",ao:0,  mood:"#cdeef0",mul:1.05,star:0, ico:"☀️",lab:{ru:"День",kz:"Күндіз"}},
      {h:17,  sky1:"#5aa6d8",sky2:"#bcd9e6",sky3:"#f2ead2",sun:"#fff0c4",glow:"#ffd98a",sx:74,sy:34,so:1, amb:"#ffe3b0",ao:.08,mood:"#cfe4dd",mul:1.0, star:0, ico:"🌤️",lab:{ru:"День",kz:"Күндіз"}},
      {h:19.5,sky1:"#3d3b7a",sky2:"#d9628a",sky3:"#ffb060",sun:"#ffd68a",glow:"#ff7a45",sx:82,sy:60,so:1, amb:"#ff884c",ao:.26,mood:"#ff9a5a",mul:.85,star:.1,ico:"🌇",lab:{ru:"Закат",kz:"Кеш"}},
      {h:21,  sky1:"#141a45",sky2:"#3f2f6b",sky3:"#7a3f74",sun:"#d9c2ea",glow:"#8a6ab0",sx:88,sy:30,so:.6,amb:"#2a1f52",ao:.3, mood:"#2e2a55",mul:.62,star:.6,ico:"🌆",lab:{ru:"Сумерки",kz:"Ымырт"}},
      {h:24,  sky1:"#0a1430",sky2:"#122349",sky3:"#1d3260",sun:"#cfd8ee",glow:"#8ea3d6",sx:32,sy:20,so:.8, amb:"#0a1330",ao:.36,mood:"#14294d",mul:.5, star:1, ico:"🌙",lab:{ru:"Ночь",kz:"Түн"}}
    ];
    function phaseAt(h){
      var a=DAY[0],b=DAY[DAY.length-1];
      for(var i=0;i<DAY.length-1;i++){if(h>=DAY[i].h&&h<=DAY[i+1].h){a=DAY[i];b=DAY[i+1];break}}
      var t=(b.h===a.h)?0:(h-a.h)/(b.h-a.h);
      return {sky1:lerpC(a.sky1,b.sky1,t),sky2:lerpC(a.sky2,b.sky2,t),sky3:lerpC(a.sky3,b.sky3,t),
        sun:lerpC(a.sun,b.sun,t),glow:lerpC(a.glow,b.glow,t),
        sx:a.sx+(b.sx-a.sx)*t,sy:a.sy+(b.sy-a.sy)*t,so:a.so+(b.so-a.so)*t,
        amb:lerpC(a.amb,b.amb,t),ao:a.ao+(b.ao-a.ao)*t,mood:lerpC(a.mood,b.mood,t),
        mul:a.mul+(b.mul-a.mul)*t,star:a.star+(b.star-a.star)*t,ico:(t<.5?a.ico:b.ico),lab:(t<.5?a.lab:b.lab)};
    }
    var curSeasonKey="summer", curPhase=null;
    function applyScene(){
      var now=new Date(), h=now.getHours()+now.getMinutes()/60, p=phaseAt(h); curPhase=p;
      var S=SEASON[curSeasonKey], moodAmt=p.mul<.75?0.5:0.28;
      var wfar=bright(lerpC(S.far,p.mood,moodAmt),p.mul);
      var wmid=bright(lerpC(S.mid,p.mood,moodAmt),p.mul);
      var wnear=bright(lerpC(S.near,p.mood,moodAmt*.7),p.mul);
      var wref=lerpC(S.ref,p.sky3,.55), st=heroEl.style;
      st.setProperty("--sky1",p.sky1);st.setProperty("--sky2",p.sky2);st.setProperty("--sky3",p.sky3);
      st.setProperty("--sun",p.sun);st.setProperty("--sunglow",p.glow);
      st.setProperty("--sunx",p.sx.toFixed(1)+"%");st.setProperty("--suny",p.sy.toFixed(1)+"%");
      st.setProperty("--sunop",p.so.toFixed(2));st.setProperty("--reflop",p.so.toFixed(2));
      st.setProperty("--amb",p.amb);st.setProperty("--ambop",p.ao.toFixed(2));st.setProperty("--starop",p.star.toFixed(2));
      st.setProperty("--wref",wref);st.setProperty("--wfar",wfar);st.setProperty("--wmid",wmid);st.setProperty("--wnear",wnear);
      applyLabels();
    }
    function applyLabels(){
      var lang=window.I18N.getLang(), S=SEASON[curSeasonKey];
      var sn=document.getElementById("seasonName"); if(sn){sn.textContent=S.n[lang]||S.n.ru;var si=sn.parentElement.querySelector(".ico");if(si)si.textContent=S.ico}
      if(curPhase){var ln=document.getElementById("lightName");if(ln)ln.textContent=curPhase.lab[lang]||curPhase.lab.ru;var li=document.getElementById("lightIco");if(li)li.textContent=curPhase.ico}
    }
    function setSeasonFromDate(){
      if(!travelInput||!travelInput.value)return;
      var d=new Date(travelInput.value); if(isNaN(d.getTime()))return;
      curSeasonKey=seasonOf(d.getMonth()); applyScene();
      var lang=window.I18N.getLang(), nm=SEASON[curSeasonKey].n;
      if(window.toast) window.toast(lang==="kz"?("Су реңкі: "+nm.kz):("Оттенок воды: "+nm.ru.toLowerCase()));
    }
    if(travelInput){
      var d0=new Date(Date.now()+86400000*30);
      travelInput.value=d0.toISOString().slice(0,10);
      curSeasonKey=seasonOf(d0.getMonth());
      travelInput.addEventListener("change",setSeasonFromDate);
    }
    applyScene();
    setInterval(applyScene,60000);
    document.addEventListener("langchange",applyLabels);
  }
  if(document.readyState==="loading") document.addEventListener("DOMContentLoaded",init); else init();
})();
