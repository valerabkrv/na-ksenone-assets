(() => {
const root = document.querySelector('#nx .upgrade-scene');
const q = selector => root.querySelector(selector);
const qa = selector => [...root.querySelectorAll(selector)];
const clamp = value => Math.max(0, Math.min(1, value));
const range = (value, start, end) => clamp((value - start) / (end - start));
const smooth = value => value * value * (3 - 2 * value);
const layout = q('.process-layout');
const story = q('.story');
const stage = q('.stage');
const rig = q('.car-rig');
const old = qa('.old');
const xenon = qa('.xenon');
const pads = qa('.polisher');
const cards = qa('.process-step');
const compact = matchMedia('(max-width: 820px)');
const motion = matchMedia('(prefers-reduced-motion: reduce)');
const limits = [0, .24, .415, .61, .87, 1];
const chapters = [
  ['Осмотр фар', 'Проверяем свет и состояние оптики.', 'ОСМОТР'],
  ['Разборка фары', 'Снимаем стекло и старую оптику.', 'РАЗБОРКА'],
  ['Монтаж линз', 'Устанавливаем модули и собираем фару.', 'МОНТАЖ'],
  ['Полировка стёкол', 'Восстанавливаем прозрачность поверхности.', 'ПОЛИРОВКА'],
  ['Регулировка света', 'Проверяем и настраиваем направление света.', 'РЕГУЛИРОВКА'],
];

let target = 0;
let p = 0;
let last = 0;
let chapter = -1;
let frame = 0;

function anchors() {
  const readLine = compact.matches ? story.offsetHeight + 35 : Math.min(250, innerHeight * .32);
  const positions = cards.map(card => card.getBoundingClientRect().top + scrollY - readLine);
  const lastCard = cards.at(-1).getBoundingClientRect();
  const stickyTop = parseFloat(getComputedStyle(story).top) || 0;
  const endOfPin = layout.getBoundingClientRect().bottom + scrollY - story.offsetHeight - stickyTop;
  const endOfRead = lastCard.bottom + scrollY - readLine - 8;
  positions.push(Math.max(positions.at(-1) + 1, Math.min(endOfPin, endOfRead)));
  return positions;
}

function updateTarget() {
  const stops = anchors();
  const index = stops.findIndex(stop => stop > scrollY) - 1;
  if (scrollY >= stops.at(-1)) target = 1;
  else if (index < 0) target = 0;
  else {
    target = limits[index] + range(scrollY, stops[index], stops[index + 1]) *
      (limits[index + 1] - limits[index]);
  }
  if (!frame) frame = requestAnimationFrame(render);
}

function jump(value) {
  const stops = anchors();
  const index = Math.max(0, limits.findIndex(limit => limit > value) - 1);
  const from = stops[index];
  const to = stops[index + 1];
  const top = from + range(value, limits[index], limits[index + 1]) * (to - from);
  scrollTo({ top, behavior: motion.matches ? 'instant' : 'smooth' });
}

qa('[data-progress]').forEach(button => {
  button.addEventListener('click', () => jump(Number(button.dataset.progress)));
});
q('#start').addEventListener('click', () => {
  const next = [.30, .49, .73, .97].find(value => value > target + .03);
  if (next !== undefined) jump(next);
  else root.querySelector('.process-outro').scrollIntoView({ behavior: motion.matches ? 'instant' : 'smooth' });
});

function render(time) {
  frame = 0;
  const bounds = layout.getBoundingClientRect();
  if (bounds.bottom < 0 || bounds.top > innerHeight) {
    last = 0;
    return;
  }

  const delta = last ? Math.min(64, time - last) : 16;
  last = time;
  p = motion.matches ? target : p + (target - p) * (1 - Math.exp(-delta / 85));
  if (Math.abs(p - target) < .001) p = target;
  const active = p < limits[1] ? 0 : p < limits[2] ? 1 : p < limits[3] ? 2 : p < limits[4] ? 3 : 4;
  if (active !== chapter) {
    chapter = active;
    const [title, text, status] = chapters[active];
    q('#headline').textContent = title;
    q('#description').textContent = text;
    q('#status').textContent = status;
    q('#number').textContent = `0${active + 1}`;
    qa('[data-progress]').forEach((button, index) => {
      button.classList.toggle('active', index === active);
      if (index === active) button.setAttribute('aria-current', 'step');
      else button.removeAttribute('aria-current');
    });
  }

const arrive=smooth(range(p,0,.22)),factor=Math.min(.65,stage.clientWidth/900);
rig.style.transform=`translateX(calc(-50% + ${(1-arrive)*stage.clientWidth*.16}px)) translateY(${(1-arrive)*16}px) scale(${.88+arrive*.12})`;const surgeryVisible=range(p,.23,.265)*(1-range(p,.565,.605));rig.style.opacity=(.86+arrive*.14)*(1-.82*surgeryVisible);
const explode=smooth(range(p,.265,.34))*(1-smooth(range(p,.52,.575))),surgery=q('.surgery');
surgery.style.opacity=surgeryVisible;
surgery.style.transform=`translate(-50%,-50%) scale(${.65+.35*range(p,.23,.28)})`;
const offsets=[[115,-95],[40,-20],[-40,60],[-130,140]];
qa('.surgery-part').forEach((el,i)=>{el.style.transform=`translate(${offsets[i][0]*explode*factor}px,${offsets[i][1]*explode*factor}px) rotate(${-3*explode}deg)`});
q('.assembly-labels').style.opacity=explode;
q('.surgery .projectors').style.opacity=range(p,.415,.455);
q('.surgery .projectors img').style.translate=`${(1-smooth(range(p,.425,.51)))*-80*factor}px ${(1-smooth(range(p,.425,.51)))*-100*factor}px`;
const bulbOut=smooth(range(p,.33,.405));q('.removed-bulb').style.opacity=range(p,.29,.32)*(1-range(p,.39,.425));q('.removed-bulb').style.transform=`translate(${-bulbOut*170*factor}px,${-bulbOut*150*factor}px) rotate(${-bulbOut*18}deg) scale(${.45+bulbOut*.3})`;
const remove=range(p,.25,.38);old.forEach((el,i)=>{const s=smooth(remove);el.style.opacity=range(p,.245,.27)*(1-range(p,.37,.42));el.style.transform=`translate(calc(-50% + ${(i?-1:1)*s*25}px),calc(-50% - ${s*120*factor}px)) scale(${.08+s*.5}) rotate(${s*(i?15:-15)}deg)`});
const install=smooth(range(p,.43,.57));xenon.forEach((el,i)=>{el.style.opacity=range(p,.395,.43)*(1-range(p,.56,.585));el.style.transform=`translate(calc(-50% + ${(i?1:-1)*(1-install)*30}px),calc(-50% - ${(1-install)*110*factor}px)) scale(${.58-install*.5}) rotate(${(1-install)*(i?-8:8)}deg)`});q('.installed').style.opacity=range(p,.54,.59);q('.part-caption').style.opacity=range(p,.265,.29)*(1-range(p,.55,.59));q('#part-title').textContent=p<.33?'РАЗБИРАЕМ ФАРУ':p<.415?'ИЗВЛЕКАЕМ ЛАМПУ':p<.52?'УСТАНАВЛИВАЕМ ЛИНЗЫ':'СОБИРАЕМ ФАРУ';q('#part-subtitle').textContent=p<.33?'Снимаем стекло и внутреннюю маску':p<.415?'Освобождаем место для новой оптики':p<.52?'Размещаем модули внутри корпуса':'Возвращаем маску и стекло на место';
const polish=range(p,.62,.84),leftClean=range(polish,0,.5),rightClean=range(polish,.5,1);q('.polished').style.clipPath=`inset(0 ${100-(polish<.5?23+30*polish:62+30*(polish-.5))}% 0 0)`;if(p<.62)q('.polished').style.clipPath='inset(0 100% 0 0)';pads.forEach((el,i)=>{const local=i?rightClean:leftClean;const a=i?.73:.62,b=i?.84:.73;el.style.opacity=range(p,a,a+.012)*(1-range(p,b-.012,b));el.style.left=`${(i?63:24)+local*12}%`;el.style.top=`${46+Math.sin(local*Math.PI*5)*2}%`;el.style.transform=`translate(-8%,-55%) rotate(${-57+Math.sin(local*Math.PI*8)*2}deg)`});q('.polish-caption').style.opacity=range(p,.59,.62)*(1-range(p,.85,.88));q('.polish-caption i').style.width=`${polish*100}%`;q('#polish-progress').textContent=`${Math.round(polish*100)}%`;const on=smooth(range(p,.87,.94));qa('.flare').forEach(e=>e.style.opacity=on*.8);qa('.beam').forEach(e=>e.style.opacity=on);q('.aura').style.opacity=on;stage.style.setProperty('--progress',p);
  if (p !== target) frame = requestAnimationFrame(render);
  else last = 0;
}

addEventListener('scroll', updateTarget, { passive: true });
addEventListener('resize', updateTarget);
motion.addEventListener('change', updateTarget);
if ('ResizeObserver' in window) new ResizeObserver(updateTarget).observe(layout);
updateTarget();

})();
(() => {
  const root = document.getElementById('nx');
  const progress = root.querySelector('.nx-scroll-progress');
  const spray = root.querySelector('.service-spray');
  const services = root.querySelector('#services');
  const photos = [...services.querySelectorAll('[data-photo-motion]')];
  const bridges = root.querySelectorAll('.calligraphy-bridge');
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  const clamp = (value) => Math.max(0, Math.min(1, value));
  let frame = 0;

  function updateProgress() {
    frame = 0;
    const travel = Math.max(1, root.offsetHeight - innerHeight);
    const distance = -root.getBoundingClientRect().top;
    const value = clamp(distance / travel);
    progress.style.setProperty('--page-progress', value);

    if (motion.matches) return;
    const serviceBounds = services.getBoundingClientRect();
    const paintProgress = clamp((innerHeight * .76 - serviceBounds.top) / serviceBounds.height);
    spray.style.setProperty('--spray-progress', paintProgress);
    photos.forEach(photo => {
      const bounds = photo.getBoundingClientRect();
      const phase = clamp((innerHeight * .88 - bounds.top) / (innerHeight * .66 + bounds.height * .15));
      const strength = Math.sin(phase * Math.PI);
      photo.style.setProperty('--photo-phase', phase);
      photo.style.setProperty('--photo-strength', strength);
      photo.style.setProperty('--lamp-level', phase * phase * (3 - 2 * phase));
    });
    bridges.forEach((bridge) => {
      const drawing = clamp((innerHeight * .86 - bridge.getBoundingClientRect().top) /
        (innerHeight * .58));
      bridge.style.setProperty('--pen-progress', drawing);
    });
  }

  function requestProgress() {
    if (!frame) frame = requestAnimationFrame(updateProgress);
  }

  addEventListener('scroll', requestProgress, { passive: true });
  addEventListener('resize', requestProgress);
  motion.addEventListener('change', requestProgress);
  if ('ResizeObserver' in window) new ResizeObserver(requestProgress).observe(root);
  updateProgress();

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.classList.add('is-in');
        observer.unobserve(entry.target);
      }
    }, { threshold: 0.1 });
    root.classList.add('motion-ready');
    root.querySelectorAll('[data-anim]').forEach(element => observer.observe(element));
  }


  root.addEventListener('click', (event) => {
    const link = event.target.closest('a[href="#popup:nx-booking"]');
    if (!link) return;

    const popup = document.querySelector('.t-popup[data-tooltip-hook="#popup:nx-booking"]');
    const service = popup?.querySelector('[name="service"]');
    if (service) service.value = link.dataset.bookService || '';
  }, { capture: true });
})();

(() => {
  const title = document.querySelector('#hero-title');
  const art = title.querySelector('.hero-title-art');
  const displayArt = () => {
    if (art.naturalWidth && CSS.supports('filter', 'url("#nx-street-ink")')) {
      title.classList.add('has-title-art');
    }
  };

  if (art.complete) displayArt();
  else art.addEventListener('load', displayArt, { once: true });
})();

(() => {
  const scene = document.querySelector('#nx .headlight-scene .scene');
  const video = scene.querySelector('.scene-video');
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  let inView = !('IntersectionObserver' in window);

  function syncPlayback() {
    if (motion.matches || !inView || document.hidden) {
      video.pause();
      return;
    }
    // When autoplay is unavailable, the video element retains its poster.
    video.play().catch(() => {});
  }

  document.addEventListener('visibilitychange', syncPlayback);
  motion.addEventListener('change', syncPlayback);

  if ('IntersectionObserver' in window) {
    new IntersectionObserver(([entry]) => {
      inView = entry.intersectionRatio >= .1;
      syncPlayback();
    }, { threshold: .1 }).observe(scene);
  } else {
    syncPlayback();
  }
})();

(() => {
  const scene = document.querySelector('#nx .headlight-scene .scene');
  const glow = scene.querySelector('.hero-cursor-light');
  const interaction = matchMedia('(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)');
  const target = { x: 0, y: 0 };
  const light = { x: 0, y: 0 };
  const trail = { x: 0, y: 0 };
  let frame = 0;
  let last = 0;
  let visible = false;

  function draw(time) {
    const delta = last ? Math.min(time - last, 45) : 16;
    last = time;
    const follow = 1 - Math.exp(-delta / 65);
    const lag = 1 - Math.exp(-delta / 160);
    light.x += (target.x - light.x) * follow;
    light.y += (target.y - light.y) * follow;
    trail.x += (target.x - trail.x) * lag;
    trail.y += (target.y - trail.y) * lag;

    glow.style.setProperty('--light-x', `${light.x}px`);
    glow.style.setProperty('--light-y', `${light.y}px`);
    glow.style.setProperty('--trail-x', `${trail.x}px`);
    glow.style.setProperty('--trail-y', `${trail.y}px`);

    const remaining = Math.hypot(target.x - light.x, target.y - light.y) +
      Math.hypot(target.x - trail.x, target.y - trail.y);
    if (remaining > .4) {
      frame = requestAnimationFrame(draw);
    } else {
      frame = 0;
      last = 0;
    }
  }

  function fade() {
    visible = false;
    glow.classList.remove('is-visible');
    cancelAnimationFrame(frame);
    frame = 0;
    last = 0;
  }

  scene.addEventListener('pointermove', (event) => {
    if (!interaction.matches || event.pointerType !== 'mouse') return;
    const bounds = scene.getBoundingClientRect();
    target.x = event.clientX - bounds.left;
    target.y = event.clientY - bounds.top;

    if (!visible) {
      visible = true;
      Object.assign(light, target);
      Object.assign(trail, target);
      glow.classList.add('is-visible');
    }

    if (!frame) frame = requestAnimationFrame(draw);
  });

  scene.addEventListener('pointerleave', fade);
  scene.addEventListener('pointercancel', fade);
  interaction.addEventListener('change', fade);
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) fade();
    }).observe(scene);
  }
})();
