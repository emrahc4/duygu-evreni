document.addEventListener('DOMContentLoaded', async () => {
    console.log("DOMContentLoaded -> Uygulama Başlıyor (vFinal-Fix-2)");

    // === DEĞİŞKENLER ===
    let quoteLibrary = {}; let allQuotes = []; let favorites = [];
    let isPaused = false; let currentQuote = null; let isAudioUnlocked = false;
    let quoteInterval; let activeScreen = null;
    let currentQuoteIntervalDuration = 4000; let currentAnimationDuration = '10s';
    let particlesEnabled = true; let isMuted = false;
    let lastDisplayedQuoteText = null;
    let glslCanvasInstance = null;

    const emotions = [
        { key: 'huzurlu', text: 'Huzurlu', icon: 'M2 17s1.5-2 5-2 5 2 5 2-1.5 2-5 2-5-2-5-2zM12 17s1.5-2 5-2 5 2 5 2-1.5 2-5 2-5-2-5-2zM7 12s1.5-2 5-2 5 2 5 2-1.5 2-5 2-5-2-5-2z' },
        { key: 'melankolik', text: 'Melankolik', icon: 'M12 2.962c-4.963 0-9 4.037-9 9s4.037 9 9 9 9-4.037 9-9-4.037-9-9-9zM8 12a4 4 0 1 1 8 0 4 4 0 0 1-8 0z' },
        { key: 'nostaljik', text: 'Nostaljik', icon: 'M6 4h12v12h-6l-3 3-3-3H6V4zm2 2v8h8V6H8z' },
        { key: 'enerjik', text: 'Enerjik', icon: 'M13 10V3L4 14h7v7l9-11h-7z' },
        { key: 'umutlu', text: 'Umutlu', icon: 'M12 2l2.36 7.19H22l-6.06 4.38 2.3 7.43L12 16.5l-6.24 4.5.98-5.71L2 9.19h7.64L12 2z' },
        { key: 'dusunsel', text: 'Düşünsel', icon: 'M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm-1 15v-2a3 3 0 0 1 3-3h.5a3.5 3.5 0 1 0-3.28-4.95' },
        { key: 'yaratici', text: 'Yaratıcı', icon: 'M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34a1.001 1.001 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z' },
        { key: 'cesur', text: 'Cesur', icon: 'M18.5 3.5L12 8 5.5 3.5 4 5l8 8 8-8-1.5-1.5zM12 13l-8 8h16l-8-8z' }
    ];

    // === SHADER KODLARI ===
    const shaders = { /* ... Önceki shader kodları buraya ... */
        huzurlu: ` #ifdef GL_ES\nprecision mediump float;\n#endif\nuniform vec2 u_resolution; uniform float u_time; float random (vec2 st) { return fract(sin(dot(st.xy, vec2(12.9898,78.233)))* 43758.5453); } float noise (vec2 st) { vec2 i = floor(st); vec2 f = fract(st); vec2 u = f*f*(3.0-2.0*f); return mix( mix( random( i + vec2(0.0,0.0) ), random( i + vec2(1.0,0.0) ), u.x), mix( random( i + vec2(0.0,1.0) ), random( i + vec2(1.0,1.0) ), u.x), u.y); } mat2 rotate(float a) { float s=sin(a); float c=cos(a); return mat2(c, -s, s, c); } void main() { vec2 st = gl_FragCoord.xy/u_resolution.xy - 0.5; st.x *= u_resolution.x/u_resolution.y; st *= rotate(u_time * 0.05); float d = 0.0; vec3 color = vec3(0.0); float a = 0.5; for (int i = 0; i < 5; i++){ d += noise(st * 2.0 + u_time * 0.1) * a; st *= 2.0; a *= 0.5; } color = mix(vec3(0.1, 0.3, 0.6), vec3(0.8, 0.9, 1.0), smoothstep(0.3, 0.7, d)); gl_FragColor = vec4(color,1.0); }`,
        melankolik: ` #ifdef GL_ES\nprecision mediump float;\n#endif\nuniform vec2 u_resolution; uniform float u_time; float random (in float x) { return fract(sin(x)*1e4); } float random (in vec2 st) { return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453); } float noise (in vec2 st) { vec2 i = floor(st); vec2 f = fract(st); float a = random(i); float b = random(i + vec2(1.0, 0.0)); float c = random(i + vec2(0.0, 1.0)); float d = random(i + vec2(1.0, 1.0)); vec2 u = f*f*(3.0-2.0*f); return mix(a, b, u.x) + (c - a)* u.y * (1.0 - u.x) + (d - b) * u.x * u.y; } void main() { vec2 st = gl_FragCoord.xy/u_resolution.xy; float speed = u_time * 0.1; float n = noise(st * vec2(2.0, 1.0) + vec2(0.0, speed)); vec3 color = mix(vec3(0.05, 0.05, 0.1), vec3(0.2, 0.25, 0.35), n); float rain = 0.0; for(float i=0.; i<20.; i+=1.){ float t = fract(u_time*0.1 + i*0.13); float x = random(i*13.37); float y = 1.0 - t; rain += smoothstep(0.005, 0.0, abs(st.x-x)) * smoothstep(0.1, 0.0, abs(st.y-y)) * (1.0-t) * 0.3; } color += vec3(rain*0.5, rain*0.7, rain); gl_FragColor = vec4(color, 1.0); }`,
        enerjik: ` #ifdef GL_ES\nprecision mediump float;\n#endif\nuniform vec2 u_resolution; uniform float u_time; vec3 palette( float t ) { vec3 a=vec3(0.5,0.5,0.5); vec3 b=vec3(0.5,0.5,0.5); vec3 c=vec3(1.0,1.0,1.0); vec3 d=vec3(0.8,0.9,0.3); return a+b*cos(6.28318*(c*t+d)); } void main() { vec2 st = (gl_FragCoord.xy*2.0 - u_resolution.xy) / min(u_resolution.x, u_resolution.y); float d = length(st); float angle = atan(st.y, st.x); float radius = length(st); float colorIdx = angle / 6.283 + radius * 0.8 + u_time * 0.4; vec3 color = palette(colorIdx); float intensity = smoothstep(0.7, 0.1, d) * (0.8 + 0.2 * sin(angle * 10.0 + u_time * 5.0)); gl_FragColor = vec4(color * intensity, 1.0); }`,
        default: ` #ifdef GL_ES\nprecision mediump float;\n#endif\nuniform vec2 u_resolution; uniform float u_time; void main() { vec2 st=gl_FragCoord.xy/u_resolution.xy; vec3 color=vec3(0.1+st.x*0.2, 0.1+st.y*0.2, 0.2+abs(sin(u_time*0.5))*0.1); gl_FragColor=vec4(color, 1.0); }`
     };

    // === DOM ELEMENTLERİNİ GÜVENLİ SEÇME ===
    // (safeGetElementById fonksiyonu burada tanımlı)
    function safeGetElementById(id) { const e = document.getElementById(id); if (!e) console.warn(`Uyarı: Element bulunamadı! ID: ${id}`); return e; }
    const body = document.body;
    const startScreen = safeGetElementById('start-screen');
    const feelingScreen = safeGetElementById('feeling-screen');
    const displayScreen = safeGetElementById('display-screen');
    const favoritesScreen = safeGetElementById('favorites-screen');
    const startButton = safeGetElementById('start-button');
    const feelingOptionsContainer = safeGetElementById('feeling-options-container');
    const feelingPrompt = safeGetElementById('feeling-prompt');
    const bgMusic = safeGetElementById('bg-music');
    const clickSound = safeGetElementById('click-sound');
    const themeToggle = safeGetElementById('theme-toggle');
    const startFavoritesButton = safeGetElementById('start-favorites-button');
    const globalFavoritesButton = safeGetElementById('global-favorites-button');
    const favoritesList = safeGetElementById('favorites-list');
    const backFromFavoritesButton = safeGetElementById('back-from-favorites-button');
    const pauseResumeButton = safeGetElementById('pause-resume-button');
    const likeButton = safeGetElementById('like-button');
    const backToFeelingsButton = safeGetElementById('back-to-feelings-button');
    const backToStartButton = safeGetElementById('back-to-start-button');
    const settingsButton = safeGetElementById('settings-button');
    const settingsPanel = safeGetElementById('settings-panel');
    const closeSettingsButton = safeGetElementById('close-settings-button');
    const fontRadios = document.querySelectorAll('input[name="font-setting"]'); // Hata vermemeli
    const speedRadios = document.querySelectorAll('input[name="speed-setting"]'); // Hata vermemeli
    const backgroundToggle = safeGetElementById('background-toggle');
    const surpriseMeButton = safeGetElementById('surprise-me-button');
    const copyQuoteButton = safeGetElementById('copy-quote-button');
    const copyNotification = safeGetElementById('copy-notification');
    const muteButton = safeGetElementById('mute-button');
    const shaderCanvasElement = safeGetElementById('shader-canvas');
    const iconVolumeOn = muteButton ? muteButton.querySelector('.icon-volume-on') : null;
    const iconVolumeOff = muteButton ? muteButton.querySelector('.icon-volume-off') : null;
    const iconPause = pauseResumeButton ? pauseResumeButton.querySelector('.icon-pause') : null;
    const iconPlay = pauseResumeButton ? pauseResumeButton.querySelector('.icon-play') : null;
    console.log("DOM elementleri seçimi tamamlandı.");


    // === FONKSİYONLAR ===
    // (Tüm fonksiyon tanımları BURAYA gelecek, initializeApp'ten ÖNCE)

    function switchScreen(target) { /* ... */ }
    async function loadQuotes() { /* ... */ }
    function loadFavorites() { /* ... */ }
    function saveFavorites() { /* ... */ }
    function renderFavoritesList() { /* ... */ }
    function toggleFavorite() { /* ... */ }
    function checkIfFavorite(q) { /* ... */ }
    function unlockAudio() { /* ... */ }
    function playClickSound() { /* ... */ }
    function toggleMute() { /* ... */ }
    function applyMuteSetting() { /* ... */ }
    function updateMuteButtonIcon() { /* ... */ }
    function copyToClipboard(t) { /* ... */ }
    function showCopyNotification() { /* ... */ }
    function showFeelingScreen() { /* ... */ }
    function populateFeelingOptions() { /* ... */ }
    function startDisplayingQuotes(key, single = null) { /* ... */ }
    function showRandomQuote(qs) { /* ... */ }
    function togglePause() { /* ... */ }
    function applySettings() { /* ... */ }
    function toggleParticles(e) { /* ... */ }
    function initializeParticles() { /* ... */ }
    function initializeShaderCanvas() { /* ... */ }
    function loadShader(key) { /* ... */ }
    function hideShader() { /* ... */ }
    function logShaderError(error) { /* ... */ }

    // --- Fonksiyonların Tam İçerikleri (Tekrar) ---
    function switchScreen(targetScreenElement) { console.log(`Switching screen to: ${targetScreenElement ? targetScreenElement.id : 'None'}`); const screens = [startScreen, feelingScreen, displayScreen, favoritesScreen].filter(Boolean); screens.forEach(screen => screen.classList.remove('active')); const currentTheme = Array.from(body.classList).find(cls => cls.startsWith('theme-')); if (currentTheme) body.classList.remove(currentTheme); body.style.animation = 'none'; if (activeScreen === displayScreen && targetScreenElement !== displayScreen) hideShader(); if (targetScreenElement && screens.includes(targetScreenElement)) { targetScreenElement.classList.add('active'); activeScreen = targetScreenElement; } else { console.warn("Hedef ekran geçersiz, başa dönülüyor."); if (startScreen) startScreen.classList.add('active'); activeScreen = startScreen; } if (activeScreen !== displayScreen) { clearInterval(quoteInterval); if (displayScreen) { const wrappers = displayScreen.querySelectorAll('.quote-wrapper'); wrappers.forEach(w => w.remove()); currentQuote = null; } } if (settingsPanel && settingsPanel.classList.contains('active')) { settingsPanel.classList.remove('active'); } }
    async function loadQuotes() { try { const r = await fetch('quotes.json'); if (!r.ok) throw new Error(`HTTP ${r.status}`); quoteLibrary = await r.json(); allQuotes = Object.values(quoteLibrary).flat(); console.log(`Veri havuzu yüklendi (${allQuotes.length} söz).`); } catch (e) { console.error("Veri YÜKLENEMEDİ:", e); if(feelingPrompt) feelingPrompt.innerText = "Sözler yüklenemedi..."; throw e; } }
    function loadFavorites() { try { const f = localStorage.getItem('favorites'); favorites = f ? JSON.parse(f) : []; console.log("Favoriler yüklendi:", favorites.length); } catch (e) { console.error("Favoriler yüklenemedi:", e); favorites = []; localStorage.removeItem('favorites'); } }
    function saveFavorites() { try { localStorage.setItem('favorites', JSON.stringify(favorites)); console.log("Favoriler kaydedildi."); } catch (e) { console.error("Favoriler kaydedilemedi:", e); } }
    function renderFavoritesList() { if (!favoritesList) { console.warn("renderFavoritesList: favoritesList elementi yok."); return; } favoritesList.innerHTML = ''; if (favorites.length === 0) { favoritesList.innerHTML = '<li class="empty-favs">Henüz favori sözünüz yok.</li>'; return; } favorites.forEach((q, i) => { const li = document.createElement('li'); const qt = q.text || ''; const qa = q.author || ''; const txt = `“${qt}”${qa ? ` - ${qa}` : ''}`; li.innerHTML = `<div class="fav-quote-content"><p class="fav-quote-text">“${qt}”</p>${qa ? `<cite class="fav-quote-author">- ${qa}</cite>` : ''}</div><div class="fav-actions"><button class="copy-fav-button" title="Kopyala" data-clipboard-text="${txt}"><svg viewBox="0 0 24 24"><path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/></svg></button><button class="delete-fav-button" data-index="${i}" title="Favorilerden Sil">&times;</button></div>`; favoritesList.appendChild(li); }); }
    function toggleFavorite() { if (!currentQuote || !likeButton) return; const idx = favorites.findIndex(f => f.text === currentQuote.text); if (idx > -1) { favorites.splice(idx, 1); likeButton.classList.remove('liked'); } else { favorites.push(currentQuote); likeButton.classList.add('liked'); likeButton.classList.add('heart-pop'); setTimeout(() => likeButton?.classList.remove('heart-pop'), 600); } saveFavorites(); }
    function checkIfFavorite(q) { if (!q || !likeButton) return; likeButton.classList.toggle('liked', favorites.some(f => f.text === q.text)); }
    function unlockAudio() { if (isAudioUnlocked) return; console.log("Ses kilidi açılıyor..."); try { if (bgMusic) { bgMusic.volume = 0; bgMusic.play().then(()=>bgMusic.pause()).catch(()=>{}); bgMusic.volume = 0.05; bgMusic.muted = isMuted; } if (clickSound) { clickSound.volume = 0; clickSound.play().then(()=>clickSound.pause()).catch(()=>{}); clickSound.volume = 0.5; clickSound.muted = isMuted; } isAudioUnlocked = true; console.log("Ses kilidi açıldı.");} catch(e) { console.error("Ses kilidi açılırken hata:", e);} }
    function playClickSound() { if (clickSound && isAudioUnlocked && !isMuted) { clickSound.currentTime = 0; clickSound.play().catch(e => {}); } }
    function toggleMute() { isMuted = !isMuted; console.log("Mute:", isMuted); if (bgMusic) { bgMusic.muted = isMuted; if (!isMuted && activeScreen !== startScreen && bgMusic.paused) bgMusic.play().catch(e=>{}); } try { localStorage.setItem('settings-mute', isMuted); } catch(e) {} updateMuteButtonIcon(); }
    function applyMuteSetting() { try{ isMuted = localStorage.getItem('settings-mute') === 'true'; if (bgMusic) bgMusic.muted = isMuted; updateMuteButtonIcon(); } catch(e){ console.error("applyMuteSetting error:", e); isMuted = false; }}
    function updateMuteButtonIcon() { if (!muteButton || !iconVolumeOn || !iconVolumeOff) return; try{ iconVolumeOn.style.display = isMuted ? 'none' : 'block'; iconVolumeOff.style.display = isMuted ? 'block' : 'none'; } catch(e){}}
    function copyToClipboard(t) { if (!navigator.clipboard) { try { const ta=document.createElement("textarea"); ta.value=t; ta.style.position="fixed"; ta.style.left="-9999px"; body.appendChild(ta); ta.select(); document.execCommand('copy'); body.removeChild(ta); showCopyNotification(); } catch (err) { alert("Kopyalanamadı."); } return; } navigator.clipboard.writeText(t).then(showCopyNotification).catch(err => { alert("Kopyalanamadı."); }); }
    function showCopyNotification() { if (!copyNotification) return; copyNotification.classList.add('show'); setTimeout(() => { copyNotification.classList.remove('show'); }, 1500); }
    function showFeelingScreen() { switchScreen(feelingScreen); const h = new Date().getHours(); let g="Bugün nasıl..."; if(h>=5&&h<12)g="Bu sabah..."; else if(h>=12&&h<18)g="Günün bu vaktinde..."; else if(h>=18&&h<22)g="Akşamın..."; else g="Gecenin..."; if(feelingPrompt)feelingPrompt.innerText=g; populateFeelingOptions(); }
    function populateFeelingOptions() { if(!feelingOptionsContainer){console.error("populate: Konteyner yok!"); return;} feelingOptionsContainer.innerHTML=''; emotions.forEach((emo, idx)=>{ try { const card=document.createElement('div'); card.className='feeling-card'; card.dataset.emotionKey=emo.key; const svg=document.createElementNS('http://www.w3.org/2000/svg','svg'); svg.setAttribute('viewBox','0 0 24 24'); svg.setAttribute('fill','currentColor'); const path=document.createElementNS('http://www.w3.org/2000/svg','path'); if(emo.icon) path.setAttribute('d',emo.icon); else console.warn(`İkon eksik: ${emo.key}`); svg.appendChild(path); const span=document.createElement('span'); span.innerText=emo.text||'???'; card.appendChild(svg); card.appendChild(span); feelingOptionsContainer.appendChild(card); setTimeout(()=>{card.classList.add('visible');}, 50*idx + 10); } catch(error){ console.error(`Kart oluşturma hatası (${emo.key}):`, error); } }); }
    function startDisplayingQuotes(key, single = null) { switchScreen(displayScreen); const shaderKey = single ? (allQuotes.find(q => q.text === single.text)?.emotionKey || key || 'default') : (key || 'default'); loadShader(shaderKey); isPaused = false; if(pauseResumeButton) pauseResumeButton.dataset.status = "playing"; if(iconPause) iconPause.style.display = 'block'; if(iconPlay) iconPlay.style.display = 'none'; if(likeButton) likeButton.style.display = 'none'; if(copyQuoteButton) copyQuoteButton.style.display = 'none'; if(displayScreen) displayScreen.classList.remove('paused'); let quotes; if (single) { quotes = [single]; lastDisplayedQuoteText = null; } else if (key && quoteLibrary[key]) { quotes = quoteLibrary[key]; lastDisplayedQuoteText = null; } else { quotes = [{ text: "Söz bulunamadı.", author: "" }]; } showRandomQuote(quotes); clearInterval(quoteInterval); if (!single) { quoteInterval = setInterval(() => { if(!isPaused) showRandomQuote(quotes); }, currentQuoteIntervalDuration); } else { if(likeButton) likeButton.style.display = 'flex'; if(copyQuoteButton) copyQuoteButton.style.display = 'flex'; isPaused = true; if(pauseResumeButton) pauseResumeButton.dataset.status = "paused"; if(iconPause) iconPause.style.display = 'none'; if(iconPlay) iconPlay.style.display = 'block'; if(displayScreen) displayScreen.classList.add('paused'); } }
    function showRandomQuote(qs) { if (!qs || qs.length === 0 || !displayScreen) return; const old = displayScreen.querySelector('.quote-wrapper'); if(old) old.remove(); let nq; let att = 0; const maxAtt = qs.length > 1 ? qs.length * 2 : 1; do { const i = Math.floor(Math.random()*qs.length); nq = qs[i]; att++; } while (nq && nq.text === lastDisplayedQuoteText && qs.length > 1 && att < maxAtt); currentQuote = nq; if (!currentQuote) return; lastDisplayedQuoteText = currentQuote.text; const w = document.createElement('div'); w.className='quote-wrapper'; w.style.animationDuration = currentAnimationDuration; const p = document.createElement('p'); p.className='quote-main'; p.innerText=`“${currentQuote.text}”`; w.appendChild(p); if(currentQuote.author){ const c=document.createElement('cite'); c.className='quote-author'; c.innerText=`- ${currentQuote.author}`; w.appendChild(c); } const x=Math.random()*(innerWidth-450)+100; const y=Math.random()*(innerHeight-250)+100; w.style.left=`${x}px`; w.style.top=`${y}px`; displayScreen.appendChild(w); checkIfFavorite(currentQuote); if (isPaused && copyQuoteButton) copyQuoteButton.style.display = 'flex'; const dur = parseFloat(currentAnimationDuration)*1000; setTimeout(()=>{ if(w.parentElement) w.remove(); }, dur-100); }
    function togglePause() { isPaused = !isPaused; if (!displayScreen || !pauseResumeButton || !iconPause || !iconPlay || !likeButton || !copyQuoteButton) return; const key = feelingScreen?.dataset.emotionKey || 'dusunsel'; const quotes = quoteLibrary[key] || []; if (isPaused) { clearInterval(quoteInterval); displayScreen.classList.add('paused'); pauseResumeButton.dataset.status="paused"; iconPause.style.display='none'; iconPlay.style.display='block'; likeButton.style.display='flex'; copyQuoteButton.style.display='flex'; } else { displayScreen.classList.remove('paused'); pauseResumeButton.dataset.status="playing"; iconPause.style.display='block'; iconPlay.style.display='none'; likeButton.style.display='none'; copyQuoteButton.style.display='none'; showRandomQuote(quotes); quoteInterval = setInterval(()=>{ if(!isPaused) showRandomQuote(quotes); }, currentQuoteIntervalDuration); } }
    function applySettings() { console.log("Ayarlar uygulanıyor..."); try { const root = document.documentElement.style; const font = localStorage.getItem('settings-font')||'handwriting'; root.setProperty('--font-quote-active', font==='standard'?'var(--font-quote-standard)':'var(--font-quote-default)'); fontRadios.forEach(r=>r.checked = r.value===font); const speed = localStorage.getItem('settings-speed')||'normal'; if(speed==='slow'){currentQuoteIntervalDuration=6000; currentAnimationDuration='15s'; root.setProperty('--anim-duration-active','var(--anim-duration-slow)');} else if(speed==='fast'){currentQuoteIntervalDuration=3000; currentAnimationDuration='7s'; root.setProperty('--anim-duration-active','var(--anim-duration-fast)');} else {currentQuoteIntervalDuration=4000; currentAnimationDuration='10s'; root.setProperty('--anim-duration-active','var(--anim-duration-default)');} speedRadios.forEach(r=>r.checked = r.value===speed); const bg = localStorage.getItem('settings-background') !== 'false'; particlesEnabled=bg; if(backgroundToggle) backgroundToggle.checked=particlesEnabled; else console.warn("backgroundToggle yok!"); applyMuteSetting(); } catch(e){ console.error("applySettings hatası:", e);}}
    function toggleParticles(enable) { console.log(`Particles: ${enable}`); try { const pJS = window.pJSDom?.[0]?.pJS; if (pJS?.fn?.vendors) { if (enable) { body.classList.remove('background-off'); pJS.fn.vendors.start(); } else { body.classList.add('background-off'); pJS.fn.vendors.stop(); } } else if (enable) { initializeParticles(); } else { body.classList.add('background-off'); } } catch (e) { console.error("Particles toggle hatası:", e); } }
    function initializeParticles() { if (!particlesEnabled) { body.classList.add('background-off'); return; } try { if (typeof particlesJS === 'function') { particlesJS('particles-js', { particles: { number: { value: 60, density: { enable: true, value_area: 800 } }, color: { value: "#778DA9" }, shape: { type: "circle" }, opacity: { value: 0.4, random: true }, size: { value: 2, random: true }, line_linked: { enable: false }, move: { enable: true, speed: 1, direction: "none", random: true, straight: false, out_mode: "out" } }, interactivity: { detect_on: "canvas", events: { onhover: { enable: true, mode: "bubble" }, onclick: { enable: false } }, modes: { bubble: { distance: 200, size: 4, duration: 2, opacity: 0.8 } } }, retina_detect: true }); } } catch (e) { console.error("particles.js hatası.", e); } }
    function initializeShaderCanvas() { if (!shaderCanvasElement) {console.warn("Shader canvas yok."); return;} try { glslCanvasInstance = new GlslCanvas(shaderCanvasElement, { fragmentString: shaders.default, errorCallback: logShaderError }); shaderCanvasElement.style.opacity = '0'; } catch(e) { console.error("glslCanvas başlatılamadı:", e); } }
    function loadShader(key) { if (!glslCanvasInstance) return; if (body.classList.contains('light-theme')) { hideShader(); return; } const shaderCode = shaders[key] || shaders.default; try { glslCanvasInstance.load(shaderCode); if (shaderCanvasElement) shaderCanvasElement.classList.add('visible'); glslCanvasInstance.play(); } catch(e) { logShaderError(e); try { glslCanvasInstance.load(shaders.default); if (shaderCanvasElement) shaderCanvasElement.classList.add('visible'); glslCanvasInstance.play(); } catch {} } }
    function hideShader() { if (shaderCanvasElement) shaderCanvasElement.classList.remove('visible'); if (glslCanvasInstance) glslCanvasInstance.pause(); }
    function logShaderError(error) { console.error("GLSL Hatası:", error?.message || error); }

    // === UYGULAMAYI BAŞLATMA ===
    async function initializeApp() {
        console.log("initializeApp başlıyor (vFinal-Fix-2)...");
        // Hata yakalamayı kaldırıyoruz, sorunları direkt görelim.
        // try {
            applySettings(); // Ayarları en başta uygula
            loadFavorites(); // Favorileri yükle
            await loadQuotes(); // Verileri yükle (await önemli!)
            console.log("Veri yüklendi, DOM hazırlandı, olay dinleyiciler ekleniyor...");
            activeScreen = startScreen; // Başlangıç ekranını ayarla
            initializeShaderCanvas(); // Shader'ı hazırla
            initializeParticles(); // Particles'ı hazırla (ayarlara göre)

            // --- OLAY DİNLEYİCİLERİNİ GÜVENLİ EKLE ---
            // (Her bir 'if (element)' kontrolü önemli)
            if (startButton) startButton.addEventListener('click', () => { unlockAudio(); playClickSound(); if (bgMusic && particlesEnabled && !isMuted) bgMusic.play().catch(e=>{}); showFeelingScreen(); });
            if (startFavoritesButton) startFavoritesButton.addEventListener('click', () => { playClickSound(); switchScreen(favoritesScreen); renderFavoritesList(); });
            if (globalFavoritesButton) globalFavoritesButton.addEventListener('click', () => { playClickSound(); if (activeScreen !== favoritesScreen) { switchScreen(favoritesScreen); renderFavoritesList(); }});
            if (feelingOptionsContainer) feelingOptionsContainer.addEventListener('click', (event) => { const c = event.target.closest('.feeling-card'); if (c) { playClickSound(); const k = c.dataset.emotionKey; if(feelingScreen) feelingScreen.dataset.emotionKey = k; startDisplayingQuotes(k); } });
            if (backToStartButton) backToStartButton.addEventListener('click', () => { playClickSound(); switchScreen(startScreen); });
            if (pauseResumeButton) pauseResumeButton.addEventListener('click', () => { playClickSound(); togglePause(); });
            if (likeButton) likeButton.addEventListener('click', () => { playClickSound(); toggleFavorite(); });
            if (backToFeelingsButton) backToFeelingsButton.addEventListener('click', () => { playClickSound(); switchScreen(feelingScreen); });
            if (backFromFavoritesButton) backFromFavoritesButton.addEventListener('click', () => { playClickSound(); switchScreen(startScreen); });
            if (favoritesList) { favoritesList.addEventListener('click', (event) => { const delBtn = event.target.closest('.delete-fav-button'); const copyBtn = event.target.closest('.copy-fav-button'); if (delBtn) { playClickSound(); const i = delBtn.dataset.index; if (i !== undefined) { favorites.splice(parseInt(i), 1); saveFavorites(); renderFavoritesList(); } } else if (copyBtn) { playClickSound(); const textToCopy = copyBtn.dataset.clipboardText; if (textToCopy) copyToClipboard(textToCopy); } }); }
            if (themeToggle) themeToggle.addEventListener('click', () => { playClickSound(); body.classList.toggle('light-theme'); localStorage.setItem('theme', body.classList.contains('light-theme') ? 'light' : 'dark'); if (body.classList.contains('light-theme')) hideShader(); else loadShader(feelingScreen?.dataset.emotionKey || 'default'); });
            if (settingsButton) settingsButton.addEventListener('click', () => { playClickSound(); if (settingsPanel) settingsPanel.classList.toggle('active'); });
            if (closeSettingsButton) closeSettingsButton.addEventListener('click', () => { playClickSound(); if (settingsPanel) settingsPanel.classList.remove('active'); });
            if (surpriseMeButton) surpriseMeButton.addEventListener('click', () => { unlockAudio(); playClickSound(); if (allQuotes.length > 0) { const rIdx = Math.floor(Math.random() * allQuotes.length); startDisplayingQuotes(null, allQuotes[rIdx]); } });
            if (copyQuoteButton) copyQuoteButton.addEventListener('click', () => { if (currentQuote) { playClickSound(); const txt = `“${currentQuote.text}”${currentQuote.author ? ` - ${currentQuote.author}` : ''}`; copyToClipboard(txt); } });
            if (muteButton) muteButton.addEventListener('click', () => { playClickSound(); toggleMute(); });

            // Ayarlar Paneli Kontrolleri
            fontRadios.forEach(r => r.addEventListener('change', (e) => { const v = e.target.value; document.documentElement.style.setProperty('--font-quote-active', v==='standard'?'var(--font-quote-standard)':'var(--font-quote-default)'); localStorage.setItem('settings-font', v); }));
            speedRadios.forEach(r => r.addEventListener('change', (e) => { const v = e.target.value; const rs = document.documentElement.style; if (v==='slow'){currentInterval=6000; currentAnim='15s'; rs.setProperty('--anim-duration-active','var(--anim-duration-slow)');} else if (v==='fast'){currentInterval=3000; currentAnim='7s'; rs.setProperty('--anim-duration-active','var(--anim-duration-fast)');} else {currentInterval=4000; currentAnim='10s'; rs.setProperty('--anim-duration-active','var(--anim-duration-default)');} currentQuoteIntervalDuration=currentInterval; currentAnimationDuration=currentAnim; localStorage.setItem('settings-speed', v); if (activeScreen===displayScreen && !isPaused) { clearInterval(quoteInterval); const k = feelingScreen?.dataset.emotionKey||'dusunsel'; const q = quoteLibrary[k]; if(q){ showRandomQuote(q); quoteInterval = setInterval(()=>{ if(!isPaused) showRandomQuote(q); }, currentInterval); }} }));
            if (backgroundToggle) backgroundToggle.addEventListener('change', (e) => { const v = e.target.checked; particlesEnabled = v; toggleParticles(v); localStorage.setItem('settings-background', v); });

            console.log("Uygulama başarıyla başlatıldı ve olay dinleyiciler eklendi.");
        // } catch (error) {
        //     console.error("initializeApp içinde KRİTİK HATA:", error);
        //     alert("Uygulama başlatılırken bir hata oluştu. Lütfen konsolu kontrol edin.");
        // }
         // Hata yakalamayı şimdilik devre dışı bırakalım ki tüm hataları görelim
    }
    initializeApp();
});

window.addEventListener('load', () => {
    const p = document.getElementById('preloader'); if (p) p.classList.add('hidden');
});