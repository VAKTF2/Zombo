// zombo.js
(() => {
  // --------------------
  // Audio toggle (safe if elements missing)
  // --------------------
  const btn = document.getElementById('audioToggle');
  const audio = document.getElementById('zomboAudio');

  const setState = (playing) => {
    if (!btn) return;
    btn.dataset.playing = playing ? 'true' : 'false';
    btn.setAttribute('aria-pressed', playing ? 'true' : 'false');
    btn.setAttribute('aria-label', playing ? 'Pause music' : 'Play music');
  };

  if (btn && audio) {
    // Default: not playing
    setState(false);

    btn.addEventListener('click', async () => {
      const isPlaying = btn.dataset.playing === 'true';

      if (isPlaying) {
        audio.pause();
        audio.currentTime = 0;
        setState(false);
        return;
      }

      try {
        audio.loop = true;
        await audio.play();
        setState(true);
      } catch (err) {
        console.warn('Audio could not start:', err);
        setState(false);
        alert('Could not start audio. Make sure zombo_words.mp3 is present and your browser allows audio on click.');
      }
    });

    audio.addEventListener('pause', () => setState(false));
    audio.addEventListener('play', () => setState(true));
  }

  // --------------------
  // Loading bar + 30-char scroller
  // --------------------
  const fillEl = document.getElementById('loadFill');
  const pctEl = document.getElementById('loadPct');
  const scrollEl = document.getElementById('scrollWindow');
  const barEl = fillEl?.parentElement;

  if (!fillEl || !pctEl || !scrollEl || !barEl) return;

  // Make scroller links open reliably
  scrollEl.addEventListener('click', (e) => {
    const a = e.target.closest('a');
    if (!a) return;

    // prevent weird default behavior while innerHTML is constantly replaced
    e.preventDefault();

    const href = a.getAttribute('href');
    if (!href) return;

    const wantsBlank =
      a.getAttribute('target') === '_blank' || /^https?:\/\//i.test(href);

    if (wantsBlank) {
      window.open(href, '_blank', 'noopener');
    } else {
      window.location.href = href;
    }
  });

  let pct = 0;
  const setPct = (n) => {
    pct = Math.max(0, Math.min(100, n));
    fillEl.style.width = pct + '%';
    pctEl.textContent = pct + '%';
    barEl.setAttribute('aria-valuenow', String(pct));
  };

  // Scrolling text content
  const SCROLL_SEGMENTS = [
    "Welcome to Zombo, where you can do anything and the universe politely nods. ",
    //{ text: "zombo link", href: "https://zombo.com" },
    "Here the rules take a nap in a hammock and dream of being optional. ",
    "Your imagination just found its front porch, and it brought snacks. ",
    "We’re braiding starlight into pure possibility and calling it “a normal day.” ",
    "If you can think it, you can probably do it—unless it involves folding soup, then we’ll improvise. ",
    "Zombo believes in big ideas, small giggles, and shoes that sparkle for no practical reason. ",
    "Take a deep breath: inhale wonder, exhale unnecessary seriousness. ",
    "This loading bar isn’t loading data; it’s loading courage. ",
    "Every percent is a tiny lantern lighting the trail to your next weird miracle. ",
    "At Zombo, gravity is a suggestion and limitations are just shy rumors. ",
    "You are free to juggle thoughts, paint the air, and invent a brand-new flavor of Tuesday. ",
    "If your mind is loud, give it a tambourine. If it’s quiet, give it a rainbow. ",
    "Somewhere a cosmic ukulele is tuning itself to the key of “yes.” ",
    "Do not resist the giggle. The giggle is the path. ",
    "Breathe in: Zom. Breathe out: bo. Repeat until your worries forget their lines. ",
    "If you feel a sudden urge to dance like a friendly glitch, congratulations—you’re syncing. ",
    "Zombo is a barefoot parade through your thoughts, waving at every idea like it’s a friend. ",
    "Here, your dreams get tiny sunglasses and learn to moonwalk. ",
    "We put “impossible” on a comfy beanbag and ask it to reconsider. ",
    "The horizon is not a limit; it’s just the sky stretching. ",
    "Your curiosity is a passport stamped in invisible ink that says: unlimited. ",
    "If you came for answers, we can do that. If you came for questions, even better. ",
    "If you came for absolutely nothing at all, we have plenty of that, too. ",
    "Zombo provides ethically sourced nonsense and renewable wonder. ",
    "Sip this pixel-tea, exhale a rainbow, and let time do that slow, friendly swirl. ",
    "Patience is just excitement wearing a bathrobe. ",
    "Your thoughts may become crunchy; that’s normal—Zombo is certified organic imagination. ",
    "If your brain tries to be practical, gently offer it a bubble wand. ",
    "Sometimes the best plan is to stare at the color gradients and whisper, “sure.” ",
    "We’re building castles out of maybe and decorating them with definitely. ",
    "If you’ve ever wanted to high-five a comet, you’re in the right neighborhood. ",
    "Zombo’s official policy is: make room for delight. ",
    "Zombo’s unofficial policy is: delight makes room for you. ",
    "There are no limits here, only friendly possibilities wearing bright shoes. ",
    "When the world says “no,” Zombo says “what if,” and hands you glitter. ",
    "Every click is a tiny drumbeat in the festival of your own invention. ",
    "If your dreams are shy, we offer them a megaphone shaped like a sunflower. ",
    "If your fears are loud, we offer them a nap and a warm cup of “maybe later.” ",
    "The internet can be serious; Zombo is here to be sincerely ridiculous. ",
    "We take your imagination very seriously, and everything else only medium seriously. ",
    "You can build a new reality here, or just decorate the old one with friendly polka dots. ",
    "This space is made of “yes” and gently sparkling weird. ",
    "If you’re waiting, you’re already doing it: you’re practicing the art of infinite. ",
    "Each second is a soft chime, reminding you: you can do anything at Zombo. ",
    "If you want a secret door, keep your eyes open for the sentence that feels like a wink. ",
    "Knock three times with your mouse and listen closely for the sound of opportunity giggling. ",
    "If you hear nothing, that’s fine—silence is just a portal wearing socks. ",
    "Zombo approves of long walks, short naps, and extremely bold daydreams. ",
    "If you’re lost, congratulations—you’ve escaped the map. ",
    "No deadlines here, just timelines wearing flower crowns. ",
    "If a thought floats by, catch it gently and name it something silly. ",
    "Somewhere, a cloud is writing you a love letter in slow motion. ",
    "Somewhere else, a breeze is giving your worries a tiny lecture about boundaries. ",
    "Welcome, welcome, welcome—again and again—because the door never gets tired. ",
    "Stay as long as you like; Zombo is patient, playful, and suspiciously welcoming. ",
    "You can do anything here: build, dream, laugh, reboot, begin again. ",
    "And if you’re wondering what happens next, the answer is: something wonderful and a little strange. ",
    "Peace, love, and extremely suspicious internet magic. "
  ];

  function segmentsToCharStream(segments) {
    const out = [];
    for (const seg of segments) {
      if (typeof seg === "string") {
        for (const ch of seg) out.push({ ch, href: null });
      } else if (seg && typeof seg === "object" && seg.text && seg.href) {
        for (const ch of seg.text) out.push({ ch, href: seg.href });
      }
    }
    // breathing room to soften the seam
    for (const ch of "     ") out.push({ ch, href: null });
    return out;
  }

  const chars = segmentsToCharStream(SCROLL_SEGMENTS);

  const WINDOW = 30;
  let offset = 0;

  const isExternal = (href) => /^https?:\/\//i.test(href);

  const renderWindow = () => {
    // When loaded finishes, scroller becomes a static join link
    if (pct >= 100) {
      scrollEl.innerHTML =
        'you did it. now <a href="https://zombo.com/join1.htm" target="_blank" rel="noopener">join zombo</a>';
      return;
    }

    // Grab 30 chars, wrapping around
    const slice = [];
    for (let i = 0; i < WINDOW; i++) {
      slice.push(chars[(offset + i) % chars.length]);
    }

    // Render, grouping contiguous runs by href
    let html = "";
    let runHref = slice[0]?.href ?? null;
    let runText = "";

    const flush = () => {
      if (!runText) return;
      const escaped = runText
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");

      if (runHref) {
        const target = isExternal(runHref) ? ' target="_blank" rel="noopener"' : '';
        html += `<a href="${runHref}"${target}>${escaped}</a>`;
      } else {
        html += escaped;
      }
      runText = "";
    };

    for (const cell of slice) {
      const href = cell.href ?? null;
      if (href !== runHref) {
        flush();
        runHref = href;
      }
      runText += cell.ch;
    }
    flush();

    scrollEl.innerHTML = html;
  };

  // Start state
  setPct(0);
  renderWindow();

  // Update: 1%
  const loadTimer = window.setInterval(() => {
    if (pct >= 100) {
      window.clearInterval(loadTimer);
      renderWindow();
      return;
    }
    setPct(pct + 1);
    if (pct >= 100) {
      renderWindow();
      window.clearInterval(loadTimer);
    }
  }, 15000);

  // --------------------
  // Scroll (DELAY START 3s)
  // --------------------
  let scrollTimer = null;

  window.setTimeout(() => {
    if (pct >= 100) {
      renderWindow();
      return;
    }

    scrollTimer = window.setInterval(() => {
      if (pct >= 100) {
        window.clearInterval(scrollTimer);
        renderWindow();
        return;
      }
      offset = (offset + 1) % chars.length;
      renderWindow();
    }, 125);
  }, 3000);
})();
