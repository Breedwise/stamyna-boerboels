/* Stamyna Boerboels — shared behaviour (every page) */
(function(){
  // year
  var yr=document.getElementById('yr'); if(yr) yr.textContent=new Date().getFullYear();

  // nav blur on scroll
  var nav=document.getElementById('nav');
  if(nav){
    var sc=function(){nav.classList.toggle('scrolled',window.scrollY>10);};
    sc(); window.addEventListener('scroll',sc,{passive:true});
  }

  // mobile menu
  var bg=document.getElementById('burg'), mm=document.getElementById('mm');
  if(bg&&mm){
    bg.addEventListener('click',function(){mm.classList.toggle('on');});
    mm.addEventListener('click',function(e){if(e.target.tagName==='A')mm.classList.remove('on');});
  }

  // hero image shows in full (no parallax crop)

  // reveal (supports .reveal/.in and .rev/.show + the annotated portrait)
  function showNow(el){el.classList.add('in');el.classList.add('show');}
  try{
    var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){showNow(e.target);io.unobserve(e.target);}});},
      {threshold:.14,rootMargin:'0px 0px -8% 0px'});
    document.querySelectorAll('.reveal,.rev,.anno').forEach(function(el){io.observe(el);});
  }catch(e){document.querySelectorAll('.reveal,.rev,.anno').forEach(showNow);}

  // lightbox
  var lb=document.getElementById('lb');
  if(lb){
    var lbImg=lb.querySelector('img');
    document.querySelectorAll('[data-full],.lifegrid img,.parent .ph img').forEach(function(img){
      img.style.cursor='zoom-in';
      img.addEventListener('click',function(){
        lbImg.src=img.getAttribute('data-full')||img.src;
        lb.classList.add('on');
      });
    });
    lb.addEventListener('click',function(){lb.classList.remove('on');lbImg.src='';});
  }

  // application form -> Kennel OS CRM (each submission becomes a lead in the kennel's OS)
  var KOS='https://jrfdufemonjhafqyacge.supabase.co/functions/v1/kennel-os-api?key=kos_pk_456d0c56ec4f4435a54c704e17caf55d';
  var form=document.getElementById('inq'), msg=document.getElementById('inqmsg');
  if(form&&msg){
    var V=function(id){var el=document.getElementById(id);return el?(el.value||'').trim():'';};
    var done=function(){form.style.display='none';msg.classList.add('on');msg.scrollIntoView({behavior:'smooth',block:'center'});};
    form.addEventListener('submit',function(e){
      e.preventDefault();
      if(form.website && form.website.value){return;} // honeypot
      var name=V('name'), email=V('email'), phone=V('phone');
      var L=[['Location','location'],['How they heard','hear'],['Home','hometype'],['Outdoor space','yard'],['Children','children'],['Other pets','pets'],['Experience with the breed','experience'],['Looking for','interest'],['Timeline','timeline'],['Sex preference','sex'],['Primarily for','role']];
      var parts=[];
      L.forEach(function(p){var v=V(p[1]);if(v)parts.push(p[0]+': '+v);});
      var home=V('home'); if(home)parts.push('About their home: '+home);
      var pref=V('pref'); if(pref)parts.push('Anything else: '+pref);
      var btn=form.querySelector('button[type="submit"]'); if(btn){btn.disabled=true;btn.textContent='Submitting…';}
      fetch(KOS,{method:'POST',headers:{'content-type':'application/json'},keepalive:true,
        body:JSON.stringify({name:name,email:email,phone:phone,message:parts.join('\n'),source:'Website application'})})
        .then(function(r){return r.json().catch(function(){return{};});})
        .then(function(){done();})
        .catch(function(){done();});
    });
  }
})();
