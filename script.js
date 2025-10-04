// Mascot (chibi lion) injected as inline SVG and yawns when clicked. Music toggle + scroll-based music switching.
// Replace assets/theme_dark.mp3, theme_calm.mp3, theme_sad.mp3 with your own licensed files in the assets folder.

document.addEventListener('DOMContentLoaded', function(){
  // add mascot
  const wrap = document.createElement('div');
  wrap.id = 'mascot-wrap';
  wrap.innerHTML = `
    <svg id="mascot" viewBox="0 0 160 160" xmlns="http://www.w3.org/2000/svg" aria-label="mascot">
      <defs>
        <linearGradient id="m1" x1="0" x2="1"><stop offset="0" stop-color="#ff6b6b"/><stop offset="1" stop-color="#7f5cff"/></linearGradient>
      </defs>
      <circle cx="80" cy="80" r="72" fill="url(#m1)" opacity="0.12"/>
      <!-- face -->
      <g transform="translate(20,20)">
        <circle cx="40" cy="40" r="34" fill="#1b1b1b" stroke="#fff" stroke-opacity="0.05"/>
        <!-- mane spikes -->
        <g id="mane" fill="#ff3b3b">
          <path d="M15 10 q12 -14 50 -8 q22 4 30 16 q-6 -12 -28 -18 q-36 -2 -52 8z" opacity="0.95"/>
        </g>
        <!-- eyes -->
        <circle cx="28" cy="38" r="3" fill="#fff"/>
        <circle cx="52" cy="38" r="3" fill="#fff"/>
        <!-- mouth (will animate) -->
        <path id="mouth" d="M32 56 q8 8 16 0" stroke="#ffb3b3" stroke-width="2" fill="none"/>
      </g>
    </svg>`;
  document.body.appendChild(wrap);

  const mascot = document.getElementById('mascot');
  mascot.addEventListener('click', ()=>{
    // simple yawn animation: mouth curve expands then shrinks
    const mouth = document.getElementById('mouth');
    mouth.setAttribute('d','M32 56 q8 18 16 0');
    setTimeout(()=>{ mouth.setAttribute('d','M32 56 q8 8 16 0'); }, 700);
  });

  // Music setup
  const tracks = {
    dark: 'assets/theme_dark.mp3',
    calm: 'assets/theme_calm.mp3',
    sad: 'assets/theme_sad.mp3'
  };
  // create audio elements
  const audioDark = new Audio(tracks.dark);
  const audioCalm = new Audio(tracks.calm);
  const audioSad = new Audio(tracks.sad);
  audioDark.loop = true; audioCalm.loop = true; audioSad.loop = true;
  audioDark.volume = 0.6; audioCalm.volume = 0.5; audioSad.volume = 0.5;

  let current = null;
  function fadeOut(a, cb){ if(!a) return cb && cb(); let vol=a.volume; const iv=setInterval(()=>{vol-=0.06; if(vol<=0){ a.pause(); a.currentTime=0; a.volume=vol=0; clearInterval(iv); cb && cb(); } else a.volume=vol; },80); }
  function fadeIn(a){ a.volume=0; a.play().catch(()=>{}); let vol=0; const iv=setInterval(()=>{vol+=0.06; if(vol>=0.6){ a.volume=0.6; clearInterval(iv); } else a.volume=vol; },80); current=a; }

  // toggle control
  const ctrl = document.createElement('div'); ctrl.id='audio-control';
  ctrl.innerHTML = '<button id="audioBtn" class="audio-btn">Play Music</button>';
  document.body.appendChild(ctrl);
  const btn = document.getElementById('audioBtn');
  let musicOn = false;
  btn.addEventListener('click', ()=>{
    if(!musicOn){
      // start with dark by default
      fadeIn(audioDark);
      btn.textContent='Pause Music';
      musicOn=true;
    } else {
      fadeOut(audioDark); fadeOut(audioCalm); fadeOut(audioSad);
      btn.textContent='Play Music';
      musicOn=false;
    }
  });

  // scroll-based switching
  const secDark = document.getElementById('sec-dark');
  const secSlice = document.getElementById('sec-slice');
  const secHosp = document.getElementById('sec-hospital');

  function inView(el){
    if(!el) return false;
    const rect = el.getBoundingClientRect();
    return rect.top < window.innerHeight*0.6 && rect.bottom > window.innerHeight*0.2;
  }

  function checkMusic(){
    if(!musicOn) return;
    if(inView(secDark) && current !== audioDark){ fadeOut(current,function(){ fadeIn(audioDark); }); }
    else if(inView(secSlice) && current !== audioCalm){ fadeOut(current,function(){ fadeIn(audioCalm); }); }
    else if(inView(secHosp) && current !== audioSad){ fadeOut(current,function(){ fadeIn(audioSad); }); }
  }

  document.addEventListener('scroll', checkMusic);
  window.addEventListener('resize', checkMusic);

  // initial check
  setTimeout(checkMusic,800);
});