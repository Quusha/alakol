/* ================= common UI: reveal, counters, toast ================= */
(function(){
  "use strict";
  // toast
  var toastEl=document.createElement("div"); toastEl.className="toast"; document.body.appendChild(toastEl);
  var tTimer;
  window.toast=function(msg){ toastEl.textContent=msg; toastEl.classList.add("on"); clearTimeout(tTimer); tTimer=setTimeout(function(){toastEl.classList.remove("on")},1900); };

  function countUp(root){
    root.querySelectorAll("[data-count]").forEach(function(el){
      var end=+el.getAttribute("data-count"),pre=el.getAttribute("data-prefix")||"",suf=el.getAttribute("data-suffix")||"",st=null;
      function step(ts){if(!st)st=ts;var pr=Math.min((ts-st)/900,1);var val=Math.round(end*pr).toLocaleString("ru-RU");el.textContent=pre+val+suf;if(pr<1)requestAnimationFrame(step)}
      requestAnimationFrame(step);
    });
  }

  var io=new IntersectionObserver(function(ents){
    ents.forEach(function(e){
      if(e.isIntersecting){
        e.target.classList.add("in");
        if(e.target.querySelector&&e.target.querySelector("[data-count]")) countUp(e.target);
        io.unobserve(e.target);
      }
    });
  },{threshold:.15});
  function observeAll(){ document.querySelectorAll(".reveal:not(.in)").forEach(function(el){io.observe(el)}); }
  document.addEventListener("DOMContentLoaded",observeAll);
  observeAll();
})();
