(function(){var els=document.querySelectorAll('.reveal');if(!els.length)return;
var rm=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if(rm||!('IntersectionObserver' in window)){return;}
document.documentElement.classList.add('reveal-on');
var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('is-in');io.unobserve(e.target);}});},{rootMargin:'0px 0px -8% 0px',threshold:0.08});
els.forEach(function(el,i){el.style.transitionDelay=(i%4)*70+'ms';io.observe(el);});})();
