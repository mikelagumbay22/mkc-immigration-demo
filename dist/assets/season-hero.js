/* Seasonal homepage hero. Runs inline right after <video id="heroVideo"> so sources are swapped before the browser fetches anything.
   JS off: the <noscript> video plays the current Toronto hero. Load failure also falls back to it. ?season=fall|winter|spring|summer overrides the visitor's local month. */
(function(){var v=document.getElementById('heroVideo');if(!v)return;
var S=['fall','winter','spring','summer'],q=(location.search.match(/[?&]season=(\w+)/)||[])[1],m=new Date().getMonth();
var s=S.indexOf(q)>-1?q:(m>=8&&m<=10?'fall':(m==11||m<=1)?'winter':(m<=4?'spring':'summer'));
var wrap=v.parentNode,base='assets/hero-'+s,poster=base+'-poster.webp';
var rm=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;
wrap.setAttribute('data-season',s);wrap.style.backgroundImage='url("'+poster+'")';
while(v.firstChild)v.removeChild(v.firstChild);v.poster=poster;
if(rm){v.preload='none';v.removeAttribute('autoplay');return;}
var fell=false;function fallback(){if(fell)return;fell=true;wrap.setAttribute('data-season','fallback');wrap.style.backgroundImage='';
 while(v.firstChild)v.removeChild(v.firstChild);v.poster='assets/hero-poster.jpg';var o=document.createElement('source');o.src='assets/hero-toronto.mp4';o.type='video/mp4';v.appendChild(o);v.load();var p=v.play();if(p&&p.catch)p.catch(function(){});}
[['webm','video/webm'],['mp4','video/mp4']].forEach(function(t,i,a){var e=document.createElement('source');e.src=base+'.'+t[0];e.type=t[1];if(i==a.length-1)e.addEventListener('error',fallback);v.appendChild(e);});
v.addEventListener('error',fallback);v.load();})();
