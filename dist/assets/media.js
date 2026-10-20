(function(){var vs=document.querySelectorAll('video.lazy-clip');if(!vs.length)return;
var rm=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;if(rm)return;
function go(v){v.querySelectorAll('source[data-src]').forEach(function(s){s.src=s.dataset.src;s.removeAttribute('data-src');});v.load();var p=v.play();if(p&&p.catch)p.catch(function(){});}
if(!('IntersectionObserver' in window)){vs.forEach(go);return;}
var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){go(e.target);io.unobserve(e.target);}});},{rootMargin:'200px 0px'});
vs.forEach(function(v){io.observe(v);});})();
