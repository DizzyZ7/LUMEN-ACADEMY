(() => {
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fine = matchMedia('(pointer: fine)').matches;
  const q = (selector, context = document) => context.querySelector(selector);
  const qa = (selector, context = document) => [...context.querySelectorAll(selector)];

  addEventListener('load', () => setTimeout(() => q('.loader')?.classList.add('is-hidden'), 500));

  const menu = q('.menu-panel');
  const menuButton = q('.menu-toggle');
  const setMenu = open => {
    menu?.classList.toggle('is-open', open);
    menu?.setAttribute('aria-hidden', String(!open));
    menuButton?.setAttribute('aria-expanded', String(open));
    document.body.classList.toggle('menu-open', open);
  };
  menuButton?.addEventListener('click', () => setMenu(!menu.classList.contains('is-open')));
  qa('.menu-panel a').forEach(link => link.addEventListener('click', () => setMenu(false)));

  if (fine) {
    const cursor = q('.cursor');
    addEventListener('pointermove', event => {
      cursor.style.left = `${event.clientX}px`;
      cursor.style.top = `${event.clientY}px`;
    });
    qa('a,button,[data-cursor]').forEach(element => {
      element.addEventListener('pointerenter', () => {
        cursor.classList.add('is-active');
        q('span', cursor).textContent = element.dataset.cursor || 'OPEN';
      });
      element.addEventListener('pointerleave', () => cursor.classList.remove('is-active'));
    });
    qa('.magnetic').forEach(element => {
      element.addEventListener('pointermove', event => {
        if (!window.gsap) return;
        const rect = element.getBoundingClientRect();
        gsap.to(element, { x:(event.clientX-rect.left-rect.width/2)*.14, y:(event.clientY-rect.top-rect.height/2)*.14, duration:.35 });
      });
      element.addEventListener('pointerleave', () => window.gsap && gsap.to(element, { x:0, y:0, duration:.55, ease:'power3.out' }));
    });
    const stage = q('.hero__stage');
    stage?.addEventListener('pointermove', event => {
      if (!window.gsap) return;
      const rect = stage.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - .5;
      const y = (event.clientY - rect.top) / rect.height - .5;
      gsap.to('.code-window', { rotateY:x*8, rotateX:-y*6, x:x*18, y:y*12, duration:.7, ease:'power3.out' });
      gsap.to('.floating-chip--one,.floating-chip--three', { x:x*-24, y:y*-18, duration:.8 });
      gsap.to('.floating-chip--two,.floating-chip--four', { x:x*22, y:y*17, duration:.8 });
    });
    stage?.addEventListener('pointerleave', () => window.gsap && gsap.to('.code-window,.floating-chip', { rotateX:0, rotateY:0, x:0, y:0, duration:.9, ease:'power3.out' }));
  }

  const trackData = [
    {code:'TRACK / FS-01',title:'Fullstack engineering',copy:'Design and ship web products across frontend, backend, data and deployment.',stack:['TypeScript','React','Node','PostgreSQL'],modules:['Interfaces that explain themselves','APIs, data and reliable flows','Systems, testing and deployment','Capstone product sprint'],role:'Junior / Middle Fullstack Engineer'},
    {code:'TRACK / AI-02',title:'AI systems',copy:'Build useful AI products with grounding, evaluation, orchestration and responsible deployment.',stack:['Python','LLM APIs','RAG','Evaluation'],modules:['Model behavior and product framing','Retrieval, tools and memory','Evaluation, safety and observability','AI product capstone'],role:'AI Product Engineer'},
    {code:'TRACK / SEC-03',title:'Cybersecurity',copy:'Understand attack paths, harden systems and communicate risk in language teams can act on.',stack:['Linux','Python','Web Security','SIEM'],modules:['Systems, protocols and attack surface','Web security and threat modeling','Detection, response and hardening','Security audit capstone'],role:'Junior Security Engineer'},
    {code:'TRACK / PD-04',title:'Product design',copy:'Turn ambiguous problems into clear research, interaction systems and testable digital products.',stack:['Research','Figma','UX Writing','Prototyping'],modules:['Problem framing and user evidence','Information and interaction systems','Prototypes, testing and iteration','Product case study sprint'],role:'Junior Product Designer'}
  ];
  qa('.track-tab').forEach((button, index) => {
    const activate = () => {
      qa('.track-tab').forEach((item, itemIndex) => {
        item.classList.toggle('is-active', itemIndex === index);
        item.setAttribute('aria-selected', String(itemIndex === index));
      });
      const data = trackData[index];
      q('.track-code').textContent = data.code;
      q('.track-title').textContent = data.title;
      q('.track-copy').textContent = data.copy;
      q('.track-stack').innerHTML = data.stack.map(item => `<span>${item}</span>`).join('');
      ['one','two','three','four'].forEach((key, itemIndex) => q(`.module-${key}`).textContent = data.modules[itemIndex]);
      q('.role-name').textContent = data.role;
      if (window.gsap) gsap.fromTo('.track-title,.track-copy,.track-stack,.curriculum-row,.track-role',{y:18,opacity:.15},{y:0,opacity:1,duration:.5,stagger:.04,ease:'power3.out'});
    };
    button.addEventListener('click', activate);
    button.addEventListener('mouseenter', () => fine && activate());
  });

  const challenges = {
    audit:{command:'run challenge --audit-api',lines:['Loading brief: auth-service-v2...','✓ endpoint map generated','✓ rate-limit behavior detected','! token scope may be broader than required','Challenge ready. Explain the risk and propose a fix.'],score:'DIFFICULTY 03/05'},
    debug:{command:'run challenge --debug-flow',lines:['Loading checkout-flow.json...','✓ request trace captured','✓ duplicate event located','! retry policy can create two invoices','Challenge ready. Repair the flow and defend the trade-off.'],score:'DIFFICULTY 02/05'},
    prompt:{command:'run challenge --ground-answer',lines:['Loading evidence-pack-14...','✓ sources indexed','✓ unsupported claims highlighted','! answer confidence exceeds evidence quality','Challenge ready. Add grounding and evaluation rules.'],score:'DIFFICULTY 04/05'},
    design:{command:'run challenge --fix-conversion',lines:['Loading onboarding-session-08...','✓ behavioral funnel built','✓ abandonment cluster detected','! users cannot predict the next step','Challenge ready. Redesign the decision moment.'],score:'DIFFICULTY 03/05'}
  };
  const renderChallenge = key => {
    const data = challenges[key];
    q('.typed-command').textContent = data.command;
    const lines = qa('.terminal-line');
    lines.forEach((line, index) => line.textContent = data.lines[index]);
    q('.terminal-score').textContent = data.score;
    if (window.gsap) gsap.fromTo('.terminal-line',{x:12,opacity:0},{x:0,opacity:1,duration:.35,stagger:.07});
  };
  qa('.challenge-button').forEach(button => button.addEventListener('click', () => {
    qa('.challenge-button').forEach(item => item.classList.remove('is-active'));
    button.classList.add('is-active');
    renderChallenge(button.dataset.command);
  }));
  q('.run-button')?.addEventListener('click', () => {
    const button = q('.run-button');
    button.textContent = 'Challenge launched ✓';
    if (window.gsap) gsap.fromTo('.terminal-shell',{scale:.985},{scale:1,duration:.5,ease:'back.out(1.8)'});
    setTimeout(() => button.textContent = 'Run challenge ↗', 1800);
  });

  const careerData = [
    {stage:'STAGE 01',title:'Learn the system',copy:'Map the field, understand the tools and complete your first guided build.',projects:1,reviews:2,demos:0,assets:1,filled:1},
    {stage:'STAGE 02',title:'Build with constraints',copy:'Complete a realistic sprint, make trade-offs and receive line-by-line critique.',projects:3,reviews:7,demos:1,assets:3,filled:3},
    {stage:'STAGE 03',title:'Own the decisions',copy:'Lead a larger build, document architecture and defend the result in review.',projects:5,reviews:12,demos:2,assets:5,filled:5},
    {stage:'STAGE 04',title:'Ship your proof',copy:'Present a capstone, publish the case study and leave with evidence people can inspect.',projects:6,reviews:16,demos:4,assets:7,filled:6}
  ];
  q('.career-scale input')?.addEventListener('input', event => {
    const data = careerData[Number(event.target.value)];
    q('.career-output__stage>span').textContent = data.stage;
    q('.career-output__stage strong').textContent = data.title;
    q('.career-output__stage p').textContent = data.copy;
    q('.metric-projects').textContent = data.projects;
    q('.metric-reviews').textContent = data.reviews;
    q('.metric-demos').textContent = data.demos;
    q('.metric-assets').textContent = data.assets;
    qa('.proof-items i').forEach((item,index) => item.classList.toggle('is-filled', index < data.filled));
    if (window.gsap) gsap.fromTo('.career-output strong,.career-output p,.proof-items i',{y:10,opacity:.3},{y:0,opacity:1,duration:.35,stagger:.03});
  });

  q('.apply-form')?.addEventListener('submit', async event => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const text = `LUMEN Academy application\nName: ${form.get('name')}\nEmail: ${form.get('email')}\nTrack: ${form.get('track')}\nLevel: ${form.get('level')}\nGoal: ${form.get('goal') || '—'}`;
    try { await navigator.clipboard.writeText(text); } catch {}
    const button = q('.submit-button', event.currentTarget);
    button.innerHTML = '<span>Application copied</span><b>✓</b>';
  });

  if (!reduced && window.gsap && window.ScrollTrigger) {
    gsap.registerPlugin(ScrollTrigger);
    if (window.Lenis) {
      const lenis = new Lenis({ duration:1.15, smoothWheel:true });
      lenis.on('scroll', ScrollTrigger.update);
      gsap.ticker.add(time => lenis.raf(time * 1000));
      gsap.ticker.lagSmoothing(0);
    }
    gsap.to('.page-progress span',{scaleY:1,ease:'none',scrollTrigger:{trigger:document.body,start:'top top',end:'bottom bottom',scrub:true}});
    gsap.from('.hero__copy,.hero__title-line,.hero__stage,.hero__footer',{y:70,opacity:0,duration:1.1,stagger:.09,ease:'power4.out',delay:.2});
    gsap.to('.hero__title',{yPercent:-15,ease:'none',scrollTrigger:{trigger:'.hero',start:'top top',end:'bottom top',scrub:true}});
    gsap.to('.code-window',{rotate:-5,scale:.92,ease:'none',scrollTrigger:{trigger:'.hero',start:'top top',end:'bottom top',scrub:true}});
    gsap.from('.manifest h2,.manifest__copy',{y:60,opacity:0,stagger:.14,scrollTrigger:{trigger:'.manifest',start:'top 70%'}});
    gsap.to('.manifest__rule span',{scaleX:1,ease:'none',scrollTrigger:{trigger:'.manifest__rule',start:'top 85%',end:'top 35%',scrub:true}});
    gsap.from('.track-lab',{clipPath:'inset(8% 8% 8% 8%)',scrollTrigger:{trigger:'.track-lab',start:'top 80%',end:'top 25%',scrub:true}});
    const methodSteps = qa('.method-step');
    methodSteps.forEach((step,index) => ScrollTrigger.create({trigger:step,start:'top 52%',end:'bottom 52%',onEnter:()=>activateMethod(index),onEnterBack:()=>activateMethod(index)}));
    function activateMethod(index){
      methodSteps.forEach((item,i)=>item.classList.toggle('is-active',i===index));
      q('.loop-core b').textContent = `0${index+1}`;
      const colors=['#f3ff57','#ff4fbc','#ff6b35','#5b7cff'];
      gsap.to('.loop-core',{backgroundColor:colors[index],duration:.45});
    }
    gsap.from('.terminal-lab',{y:80,opacity:0,scrollTrigger:{trigger:'.terminal-lab',start:'top 75%'}});
    const media = gsap.matchMedia();
    media.add('(min-width: 900px)', () => {
      const rail = q('.project-rail');
      gsap.to(rail,{x:()=>-(rail.scrollWidth-innerWidth+80),ease:'none',scrollTrigger:{trigger:'.projects',start:'top top',end:()=>`+=${rail.scrollWidth-innerWidth}`,pin:true,scrub:1,invalidateOnRefresh:true}});
    });
    gsap.from('.career-simulator',{scale:.94,opacity:0,scrollTrigger:{trigger:'.career-simulator',start:'top 75%',end:'top 30%',scrub:true}});
    qa('[data-count]').forEach(element => {
      const target = Number(element.dataset.count);
      const proxy = {value:0};
      gsap.to(proxy,{value:target,duration:1.6,ease:'power2.out',scrollTrigger:{trigger:element,start:'top 85%',once:true},onUpdate:()=>element.textContent=Math.round(proxy.value)});
    });
    gsap.from('.apply-form label,.submit-button',{y:35,opacity:0,stagger:.07,scrollTrigger:{trigger:'.apply-form',start:'top 75%'}});
  }
})();
