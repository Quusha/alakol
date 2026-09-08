/* ================= stay: zones, filters, booking ================= */
(function(){
  "use strict";
  function init(){
    var list=document.getElementById("hotelList"); if(!list) return;
    var HOTELS={
      1:[{n:"Aqua Resort «Первая линия»",s:"4.8",p:{ru:"от 28 000 ₸",kz:"28 000 ₸-ден"},c:"h1"},{n:"Отель «Жағалау»",s:"4.7",p:{ru:"от 22 000 ₸",kz:"22 000 ₸-ден"},c:"h2"},{n:"Гостевой дом «Толқын»",s:"4.6",p:{ru:"от 15 000 ₸",kz:"15 000 ₸-ден"},c:"h3"}],
      2:[{n:"База отдыха «Алтын Көл»",s:"4.4",p:{ru:"от 12 000 ₸",kz:"12 000 ₸-ден"},c:"h1"},{n:"Мини-отель «Самал»",s:"4.5",p:{ru:"от 10 000 ₸",kz:"10 000 ₸-ден"},c:"h2"}],
      3:[{n:"Эко-домики «Қоныс»",s:"4.3",p:{ru:"от 8 000 ₸",kz:"8 000 ₸-ден"},c:"h3"},{n:"Кемпинг «Дала»",s:"4.2",p:{ru:"от 6 000 ₸",kz:"6 000 ₸-ден"},c:"h1"}]
    };
    var curZone="1";
    function render(){
      var lang=window.I18N.getLang(), bl=window.I18N.t("book",lang);
      list.innerHTML=HOTELS[curZone].map(function(h){
        return '<div class="hotel '+h.c+'"><div class="thumb"></div><div style="flex:1;min-width:0">'+
          '<div class="nm">'+h.n+'</div><div class="rw"><span class="star">★ '+h.s+'</span>'+
          '<span class="price">'+(h.p[lang]||h.p.ru)+'</span></div></div>'+
          '<button class="bk" data-nm="'+h.n+'" data-p="'+(h.p[lang]||h.p.ru)+'">'+bl+'</button></div>';
      }).join("");
      bindBook();
    }
    function selectZone(z){
      curZone=z;
      document.querySelectorAll(".zone-tabs button").forEach(function(b){b.classList.toggle("on",b.getAttribute("data-z")===z)});
      document.querySelectorAll(".beach .strip").forEach(function(s){s.classList.toggle("on",s.getAttribute("data-z")===z)});
      render();
    }
    document.querySelectorAll(".zone-tabs button, .beach .strip").forEach(function(el){el.addEventListener("click",function(){selectZone(el.getAttribute("data-z"))})});
    document.querySelectorAll(".filters .f").forEach(function(f){f.addEventListener("click",function(){
      f.classList.toggle("on");
      var lang=window.I18N.getLang();
      if(window.toast) window.toast(lang==="kz"?"Сүзгілер жаңарды":"Фильтры обновлены");
    })});

    // modal
    var overlay=document.getElementById("overlay"), mForm=document.getElementById("modalForm"), mDone=document.getElementById("modalDone");
    function openBook(name,price){
      document.getElementById("mHotel").textContent=name; document.getElementById("mPrice").textContent=price;
      mForm.style.display=""; mDone.style.display="none";
      var t=Date.now(); document.getElementById("mIn").value=new Date(t+86400000*30).toISOString().slice(0,10);
      document.getElementById("mOut").value=new Date(t+86400000*33).toISOString().slice(0,10);
      overlay.classList.add("on");
    }
    function bindBook(){document.querySelectorAll(".bk").forEach(function(b){b.addEventListener("click",function(){openBook(b.getAttribute("data-nm"),b.getAttribute("data-p"))})})}
    document.getElementById("mConfirm").addEventListener("click",function(){
      var lang=window.I18N.getLang(), nm=document.getElementById("mHotel").textContent, ci=document.getElementById("mIn").value, co=document.getElementById("mOut").value;
      document.getElementById("mOkText").textContent = lang==="kz"
        ? (nm+" · "+ci+" → "+co+". Растауды поштаңызға жібереміз.")
        : (nm+" · "+ci+" → "+co+". Подтверждение придёт на вашу почту.");
      mForm.style.display="none"; mDone.style.display="";
    });
    document.getElementById("mClose").addEventListener("click",function(){overlay.classList.remove("on")});
    overlay.addEventListener("click",function(e){if(e.target===overlay)overlay.classList.remove("on")});

    render();
    document.addEventListener("langchange",render);
  }
  if(document.readyState==="loading") document.addEventListener("DOMContentLoaded",init); else init();
})();
