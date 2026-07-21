const ORIGIN_X_FINE_TUNE_PX = 1.5;
const ORIGIN_Y_FINE_TUNE_PX = 6;
const STACK_LIFT_MULTIPLIER = 1.2;
const STACK_LIFT_DURATION_MS = 600;
const FAN_OUT_DURATION_MS = 750;
const VIDEO_EXIT_DURATION_MS = 225;
const CARD_BACK_IMAGE_SRC = "images/Cards/Card Back.png";
const EBAY_LOGO_SRC = "images/Other images/ebay.png";
const CARDMARKET_LOGO_SRC = "images/Other images/cardmarket.png";
const RARITY_ICON_SRC = {
  common: "images/Rarity/Common.png",
  uncommon: "images/Rarity/Uncommon.png",
  rare: "images/Rarity/Rare.png",
  "holo rare": "images/Rarity/holo_rare.png"
};
const CARD_MODAL_ANIMATION_MS = 1100;
const CARD_MODAL_LIFT_PX = 42;
const CARD_MODAL_SPIN_DEGREES = 360;
const INTRO_VINEWHIP_AUTOPLAY_DELAY_MS = 100;
const VINE_START_BELOW_BATTLE_OFFSET_PX = -25;
const setsRoot = document.getElementById("setsRoot");
const battleScene = document.getElementById("battleScene");

const VINE_TIMELINE_ID = "vineTimeline";
const VINE_SIZE = {
  // Global scale for the vine body and its motion profile.
  vine: 1.6,
  // Additional multiplier for the bud relative to the vine.
  tip: 0.6
};
const VINE_BASE_TIP_SCALE = 2.1;
const VINE_BASE_VIEWPORT = {
  width: 1440,
  height: 900
};
let vineState = null;
let vineRafId = 0;
let cardModalState = null;
let activeCardModal = null;
let onScrollLockAttempt = null;
const SCROLL_LOCK_KEYS = new Set([
  "ArrowUp",
  "ArrowDown",
  "PageUp",
  "PageDown",
  "Home",
  "End",
  " ",
  "Spacebar"
]);

const setsData = {
  baseSetShadowless1st: {
    title: "Base Set | Shadowless 1st Edition",
    subtitle: "9 Jan 1999",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    videoSrc: "images/Animations/Base set pack.webm",
    cards: [
      { imgurl: "images/Cards/1.1 BS1_Bulb.png", number: "44/102", rarity: "Common", illustrator: "Mitsuhiro Arita",
          ebay:"https://www.ebay.com/sch/i.html?_nkw=bulbasaur+44%2F102+%281st%2Cfirst%29+edition", 
          cardmarket:"https://www.cardmarket.com/en/Pokemon/Products/Singles/Base-Set/Bulbasaur-V2-BS44?language=1&minCondition=4&isFirstEd=Y"
        },
      { imgurl: "images/Cards/1.2 BS1_Ivy.png", number: "30/102", rarity: "Uncommon", illustrator: "Mitsuhiro Arita",
          ebay:"https://www.ebay.com/sch/i.html?_nkw=ivysaur+30%2F102+%281st%2Cfirst%29+edition",
          cardmarket:"https://www.cardmarket.com/en/Pokemon/Products/Singles/Base-Set/Ivysaur-V2-BS30?language=1&minCondition=4&isFirstEd=Y"
       },
      { imgurl: "images/Cards/1.3 BS1_Ven.webm", number: "15/102", rarity: "Rare", illustrator: "Mitsuhiro Arita",
          ebay:"https://www.ebay.com/sch/i.html?_nkw=venusaur+15%2F102+%281st%2Cfirst%29+edition",
          cardmarket:"https://www.cardmarket.com/en/Pokemon/Products/Singles/Base-Set/Venusaur-V2-BS15?language=1&minCondition=4&isFirstEd=Y"
       }
    ]
  },
    baseSetShadowless: {
    title: "Base Set | Shadowless",
    subtitle: "Feb 1999 (estimated)",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    videoSrc: "images/Animations/Base set pack.webm",
    cards: [
      { imgurl: "images/Cards/2.1 BSS_Bulb.png", number: "44/102" },
      { imgurl: "images/Cards/2.2 BSS_Ivy.png", number: "30/102" },
      { imgurl: "images/Cards/2.3 BSS_Ven.webm", number: "15/102" }
    ]
  },
    baseSet: {
    title: "Base Set | Unlimited",
    subtitle: "Apr 1999 (estimated)",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    videoSrc: "images/Animations/Base set pack.webm",
    cards: [
      { imgurl: "images/Cards/3.1 BS_Bulb.png", number: "44/102" },
      { imgurl: "images/Cards/3.2 BS_Ivy.png", number: "30/102" },
      { imgurl: "images/Cards/3.3 BS_Ven.webm", number: "15/102" }
    ]
  },
    baseSetUK: {
    title: "Base Set | 4th/UK Print",
    subtitle: "Jan 2000 (estimated)",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    videoSrc: "images/Animations/Base set pack.webm",
    cards: [
      { imgurl: "images/Cards/4.1 UK_Bulb.png", number: "44/102" },
      { imgurl: "images/Cards/4.2 UK_Ivy.png", number: "30/102" },
      { imgurl: "images/Cards/4.3 UK_Ven.webm", number: "15/102" }
    ]
  },
    baseSet2: {
    image: "images/Set logos/BS2_logo.png",
    title: "Base Set 2",
    subtitle: "24 Feb 2000",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    videoSrc: "images/Animations/Base set pack.webm",
    cards: [
      { imgurl: "images/Cards/4.1 UK_Bulb.png", number: "44/102" },
      { imgurl: "images/Cards/4.2 UK_Ivy.png", number: "30/102" },
      { imgurl: "images/Cards/4.3 UK_Ven.png", number: "15/102" }
    ]
  }
};

function preventScroll(e) {
  if (typeof onScrollLockAttempt === "function") {
    onScrollLockAttempt();
  }

  e.preventDefault();
}

function preventScrollKeys(event) {
  if (!SCROLL_LOCK_KEYS.has(event.key)) return;

  if (typeof onScrollLockAttempt === "function") {
    onScrollLockAttempt();
  }

  event.preventDefault();
}

function lockPageScroll(onAttempt) {
  onScrollLockAttempt = typeof onAttempt === "function" ? onAttempt : null;
  document.body.classList.add("scroll-locked");
  document.addEventListener("wheel", preventScroll, { passive: false });
  document.addEventListener("touchmove", preventScroll, { passive: false });
  document.addEventListener("keydown", preventScrollKeys, { passive: false });
}

function unlockPageScroll() {
  document.body.classList.remove("scroll-locked");
  onScrollLockAttempt = null;
  document.removeEventListener("wheel", preventScroll);
  document.removeEventListener("touchmove", preventScroll);
  document.removeEventListener("keydown", preventScrollKeys);
}

function initializeWipeawayScrollGate() {
  const wipeawayVideo = document.querySelector(".wipeaway-video");
  const introVinewhipVideo = battleScene?.querySelector(".vinewhip-video");

  if (!wipeawayVideo) return;

  let phase = "wipeaway";
  let wipeawayStarted = false;
  let vinewhipAutoplayScheduled = false;
  const unlock = () => {
    if (phase === "done") return;
    phase = "done";
    unlockPageScroll();
  };

  const scheduleVinewhipAutoplay = () => {
    if (!introVinewhipVideo) {
      unlock();
      return;
    }

    if (vinewhipAutoplayScheduled || phase === "done") return;

    vinewhipAutoplayScheduled = true;
    window.setTimeout(() => {
      if (phase === "done") return;

      introVinewhipVideo.play().catch(() => {
        unlock();
      });
    }, INTRO_VINEWHIP_AUTOPLAY_DELAY_MS);
  };

  const startPlayback = () => {
    if (phase === "done") return;

    if (phase === "vinewhip") {
      return;
    }

    if (wipeawayStarted) return;
    wipeawayStarted = true;

    wipeawayVideo.play().catch(() => {
      unlock();
    });
  };

  lockPageScroll(startPlayback);
  window.scrollTo(0, 0);

  wipeawayVideo.loop = false;
  wipeawayVideo.pause();
  wipeawayVideo.currentTime = 0;

  if (introVinewhipVideo) {
    introVinewhipVideo.pause();
    introVinewhipVideo.currentTime = 0;
  }

  if (wipeawayVideo.ended) {
    phase = "vinewhip";
    scheduleVinewhipAutoplay();
    return;
  }

  wipeawayVideo.addEventListener("ended", () => {
    phase = "vinewhip";
    scheduleVinewhipAutoplay();
  }, { once: true });

  wipeawayVideo.addEventListener("error", unlock, { once: true });

  if (introVinewhipVideo) {
    introVinewhipVideo.addEventListener("ended", unlock, { once: true });
    introVinewhipVideo.addEventListener("error", unlock, { once: true });
  }

  wipeawayVideo.addEventListener("loadedmetadata", () => {
    if (!wipeawayStarted) {
      wipeawayVideo.currentTime = 0;
    }
  }, { once: true });

  introVinewhipVideo?.addEventListener("loadedmetadata", () => {
    if (phase !== "done") {
      introVinewhipVideo.currentTime = 0;
    }
  }, { once: true });
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function getResponsiveVineScale(width = window.innerWidth, height = window.innerHeight) {
  const widthScale = width / VINE_BASE_VIEWPORT.width;
  const heightScale = height / VINE_BASE_VIEWPORT.height;
  const viewportScale = Math.min(widthScale, heightScale);

  return clamp(viewportScale, 0.72, 1.35);
}

function getVineScale(width = window.innerWidth, height = window.innerHeight) {
  return clamp(VINE_SIZE.vine, 0.4, 3) * getResponsiveVineScale(width, height);
}

function getRarityIconSrc(rarity) {
  const key = String(rarity || "").trim().toLowerCase();

  if (!key) return "";

  if (key.includes("holo")) {
    return RARITY_ICON_SRC["holo rare"];
  }

  return RARITY_ICON_SRC[key] || "";
}

function isVideoSource(src) {
  return typeof src === "string" && src.trim().toLowerCase().endsWith(".webm");
}

function createCardFrontMedia(card, setTitle) {
  const media = isVideoSource(card.imgurl)
    ? document.createElement("video")
    : document.createElement("img");

  media.className = "card-image card-face card-face-front";
  media.src = card.imgurl;
  const cardLabel = `${setTitle} card ${card.number}`;
  media.dataset.set = setTitle;
  media.dataset.number = card.number;
  media.dataset.rarity = card.rarity || "";
  media.dataset.illustrator = card.illustrator || "";
  media.dataset.ebay = card.ebay || "";
  media.dataset.cardmarket = card.cardmarket || "";

  if (media.tagName === "VIDEO") {
    media.muted = true;
    media.autoplay = true;
    media.loop = true;
    media.playsInline = true;
    media.preload = "auto";
    media.setAttribute("aria-label", cardLabel);
  } else {
    media.alt = cardLabel;
  }

  return media;
}

function getCardModalSourceMedia(flipButton) {
  return flipButton.querySelector(".card-face-front");
}

function ensureCardModal() {
  if (cardModalState) return cardModalState;

  const backdrop = document.createElement("div");
  backdrop.className = "card-modal-backdrop";
  backdrop.innerHTML = `
    <div class="card-modal-panel" role="dialog" aria-modal="true" aria-label="Card details">
      <button type="button" class="card-modal-close" aria-label="Close card modal">&times;</button>
      <div class="card-modal-left">
        <div class="card-modal-card-anchor"></div>
      </div>
      <div class="card-modal-right">
        <h3 class="card-modal-title"></h3>
        <p class="card-modal-number"></p>
        <div class="card-modal-rarity" aria-label="Card rarity"></div>
        <p class="card-modal-illustrator"></p>
        <div class="card-modal-links" aria-label="Marketplace links"></div>
      </div>
    </div>
  `;

  document.body.appendChild(backdrop);

  const closeButton = backdrop.querySelector(".card-modal-close");
  const cardAnchor = backdrop.querySelector(".card-modal-card-anchor");
  const title = backdrop.querySelector(".card-modal-title");
  const number = backdrop.querySelector(".card-modal-number");
  const rarity = backdrop.querySelector(".card-modal-rarity");
  const illustrator = backdrop.querySelector(".card-modal-illustrator");
  const links = backdrop.querySelector(".card-modal-links");

  closeButton.addEventListener("click", () => {
    closeCardModal();
  });

  backdrop.addEventListener("click", event => {
    if (event.target === backdrop) {
      closeCardModal();
    }
  });

  document.addEventListener("keydown", event => {
    if (event.key === "Escape" && activeCardModal) {
      closeCardModal();
    }
  });

  cardModalState = {
    backdrop,
    cardAnchor,
    title,
    number,
    rarity,
    illustrator,
    links
  };

  return cardModalState;
}

function openCardModal(flipButton) {
  if (!flipButton || activeCardModal) return;

  const modal = ensureCardModal();
  const sourceRect = flipButton.getBoundingClientRect();
  const sourceMedia = getCardModalSourceMedia(flipButton);

  modal.title.textContent = sourceMedia?.dataset.set || "Card";
  modal.number.textContent = sourceMedia?.dataset.number || "";
  modal.rarity.innerHTML = "";
  modal.illustrator.textContent = "";
  modal.links.innerHTML = "";

  const cardRarity = sourceMedia?.dataset.rarity || "";
  const cardIllustrator = sourceMedia?.dataset.illustrator || "";

  if (cardRarity) {
    const rarityIconSrc = getRarityIconSrc(cardRarity);
    const rarityRow = document.createElement("div");
    rarityRow.className = "card-modal-rarity-row";

    if (rarityIconSrc) {
      const rarityIcon = document.createElement("img");
      rarityIcon.className = "card-modal-rarity-icon";
      rarityIcon.src = rarityIconSrc;
      rarityIcon.alt = `${cardRarity} rarity symbol`;
      rarityRow.appendChild(rarityIcon);
    }

    const rarityText = document.createElement("span");
    rarityText.className = "card-modal-rarity-text";
    rarityText.textContent = cardRarity;
    rarityRow.appendChild(rarityText);

    modal.rarity.appendChild(rarityRow);
  }

  if (cardIllustrator) {
    modal.illustrator.textContent = `Illustrator: ${cardIllustrator}`;
  }

  modal.rarity.classList.toggle("is-hidden", !cardRarity);
  modal.illustrator.classList.toggle("is-hidden", !cardIllustrator);

  const cardLinks = [
    {
      href: sourceMedia?.dataset.ebay,
      label: "eBay",
      logoSrc: EBAY_LOGO_SRC
    },
    {
      href: sourceMedia?.dataset.cardmarket,
      label: "Cardmarket",
      logoSrc: CARDMARKET_LOGO_SRC
    }
  ];

  cardLinks.forEach(link => {
    if (!link.href) return;

    const anchor = document.createElement("a");
    anchor.className = "card-modal-marketplace-link";
    anchor.href = link.href;
    anchor.target = "_blank";
    anchor.rel = "noopener noreferrer";
    anchor.setAttribute("aria-label", `Open ${link.label} listing`);

    const logo = document.createElement("img");
    logo.src = link.logoSrc;
    logo.alt = `${link.label} logo`;

    anchor.appendChild(logo);
    modal.links.appendChild(anchor);
  });

  modal.links.classList.toggle("is-hidden", modal.links.children.length === 0);

  const floatingCard = flipButton.cloneNode(true);
  floatingCard.classList.remove("is-spinning", "is-source-hidden");
  floatingCard.classList.add("card-modal-floating");
  floatingCard.style.left = `${sourceRect.left}px`;
  floatingCard.style.top = `${sourceRect.top}px`;
  floatingCard.style.width = `${sourceRect.width}px`;
  floatingCard.style.height = `${sourceRect.height}px`;
  floatingCard.style.transform = "rotateY(0deg)";

  document.body.appendChild(floatingCard);
  flipButton.classList.add("is-source-hidden");

  document.body.classList.add("card-modal-open");
  modal.backdrop.classList.add("is-open");

  const anchorRect = modal.cardAnchor.getBoundingClientRect();
  const targetWidth = sourceRect.width * 2;
  const targetHeight = sourceRect.height * 2;
  const targetLeft = anchorRect.left - (targetWidth / 2);
  const targetTop = anchorRect.top - (targetHeight / 2) - CARD_MODAL_LIFT_PX;

  activeCardModal = {
    sourceFlipButton: flipButton,
    floatingCard,
    isAnimating: true
  };

  const openAnimation = floatingCard.animate([
    {
      left: `${sourceRect.left}px`,
      top: `${sourceRect.top}px`,
      width: `${sourceRect.width}px`,
      height: `${sourceRect.height}px`,
      transform: "rotateY(0deg)"
    },
    {
      left: `${targetLeft}px`,
      top: `${targetTop}px`,
      width: `${targetWidth}px`,
      height: `${targetHeight}px`,
      transform: `rotateY(${CARD_MODAL_SPIN_DEGREES}deg)`
    }
  ], {
    duration: CARD_MODAL_ANIMATION_MS,
    easing: "cubic-bezier(0.22, 0.61, 0.36, 1)",
    fill: "forwards"
  });

  openAnimation.addEventListener("finish", () => {
    floatingCard.style.left = `${targetLeft}px`;
    floatingCard.style.top = `${targetTop}px`;
    floatingCard.style.width = `${targetWidth}px`;
    floatingCard.style.height = `${targetHeight}px`;
    floatingCard.style.transform = `rotateY(${CARD_MODAL_SPIN_DEGREES}deg)`;
    if (activeCardModal) {
      activeCardModal.isAnimating = false;
    }
  });
}

function closeCardModal() {
  if (!activeCardModal || activeCardModal.isAnimating) return;

  const { sourceFlipButton, floatingCard } = activeCardModal;
  const sourceRect = sourceFlipButton.getBoundingClientRect();
  const currentRect = floatingCard.getBoundingClientRect();

  activeCardModal.isAnimating = true;
  cardModalState.backdrop.classList.remove("is-open");

  const closeAnimation = floatingCard.animate([
    {
      left: `${currentRect.left}px`,
      top: `${currentRect.top}px`,
      width: `${currentRect.width}px`,
      height: `${currentRect.height}px`,
      transform: `rotateY(${CARD_MODAL_SPIN_DEGREES}deg)`
    },
    {
      left: `${sourceRect.left}px`,
      top: `${sourceRect.top}px`,
      width: `${sourceRect.width}px`,
      height: `${sourceRect.height}px`,
      transform: `rotateY(${CARD_MODAL_SPIN_DEGREES * 2}deg)`
    }
  ], {
    duration: CARD_MODAL_ANIMATION_MS,
    easing: "cubic-bezier(0.45, 0.02, 0.2, 1)",
    fill: "forwards"
  });

  closeAnimation.addEventListener("finish", () => {
    floatingCard.remove();
    sourceFlipButton.classList.remove("is-source-hidden");
    document.body.classList.remove("card-modal-open");
    activeCardModal = null;
  });
}

function buildSmoothPath(points, tension = 0.2) {
  if (points.length < 2) {
    return "";
  }

  if (points.length === 2) {
    return `M ${points[0].x} ${points[0].y} L ${points[1].x} ${points[1].y}`;
  }

  let d = `M ${points[0].x} ${points[0].y}`;

  for (let i = 0; i < points.length - 1; i += 1) {
    const p0 = points[i - 1] || points[i];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[i + 2] || p2;

    const cp1x = p1.x + ((p2.x - p0.x) * tension) / 6;
    const cp1y = p1.y + ((p2.y - p0.y) * tension) / 6;
    const cp2x = p2.x - ((p3.x - p1.x) * tension) / 6;
    const cp2y = p2.y - ((p3.y - p1.y) * tension) / 6;

    d += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`;
  }

  return d;
}

function buildVinePath(width, height) {
  const vineScale = getVineScale(width, window.innerHeight);
  const baseX = width * 0.5;
  const step = 120 * vineScale;
  const amplitude = clamp(width * 0.016 * vineScale, 7 * vineScale, 18 * vineScale);
  const secondaryWaveRatio = 0.12;
  const extraLength = 200;
  const totalHeight = Math.max(height + extraLength, window.innerHeight + extraLength);
  const battleSceneBottom = battleScene
    ? battleScene.offsetTop + battleScene.offsetHeight
    : window.innerHeight;
  const startY = Math.max(0, battleSceneBottom + VINE_START_BELOW_BATTLE_OFFSET_PX);
  const straightSegmentHeight = 300;
  const straightEndY = Math.min(totalHeight, startY + straightSegmentHeight);
  const points = [
    { x: baseX, y: startY },
    { x: baseX, y: straightEndY }
  ];

  for (let y = straightEndY + step; y <= totalHeight; y += step) {
    const phase = y / step;
    const x = baseX
      + Math.sin(phase * 0.85) * amplitude
      + Math.sin(phase * 1.7) * (amplitude * secondaryWaveRatio);
    points.push({ x, y });
  }

  if (points.length < 2) {
    return `M ${baseX} ${startY} L ${baseX} ${totalHeight}`;
  }

  return buildSmoothPath(points, 1.05);
}

function getPathLengthAtY(path, totalLength, targetY) {
  let low = 0;
  let high = totalLength;

  for (let i = 0; i < 24; i += 1) {
    const mid = (low + high) / 2;
    const point = path.getPointAtLength(mid);

    if (point.y < targetY) {
      low = mid;
    } else {
      high = mid;
    }
  }

  return clamp((low + high) / 2, 1, totalLength);
}

function updateVineProgress() {
  if (!vineState) return;

  const {
    basePath,
    highlightPath,
    tipGroup,
    totalLength,
    docHeight,
    tipScale
  } = vineState;

  const scrollTop = window.scrollY;
  const targetY = scrollTop + (window.innerHeight * 0.5);
  const drawLength = getPathLengthAtY(basePath, totalLength, targetY);
  const dashOffset = Math.max(0, totalLength - drawLength);

  basePath.style.strokeDashoffset = String(dashOffset);
  highlightPath.style.strokeDashoffset = String(dashOffset);

  const pointLength = clamp(drawLength, 1, totalLength);
  const tipPoint = basePath.getPointAtLength(pointLength);
  const aheadPoint = basePath.getPointAtLength(clamp(pointLength + 12, 1, totalLength));
  const angle = Math.atan2(aheadPoint.y - tipPoint.y, aheadPoint.x - tipPoint.x) * (180 / Math.PI);

  tipGroup.setAttribute(
    "transform",
    `translate(${tipPoint.x} ${tipPoint.y}) rotate(${angle}) scale(${tipScale})`
  );
  tipGroup.style.opacity = "1";

  if (docHeight !== document.documentElement.scrollHeight) {
    buildVineTimeline();
  }
}

function scheduleVineUpdate() {
  if (vineRafId) return;

  vineRafId = window.requestAnimationFrame(() => {
    vineRafId = 0;
    updateVineProgress();
  });
}

function buildVineTimeline() {
  const svgNS = "http://www.w3.org/2000/svg";
  const vineScale = getVineScale(window.innerWidth, window.innerHeight);
  const tipScale = VINE_BASE_TIP_SCALE * vineScale * clamp(VINE_SIZE.tip, 0.4, 3);
  const width = window.innerWidth;
  const docHeight = document.documentElement.scrollHeight;
  const pathData = buildVinePath(width, docHeight);

  let svg = document.getElementById(VINE_TIMELINE_ID);
  if (!svg) {
    svg = document.createElementNS(svgNS, "svg");
    svg.setAttribute("id", VINE_TIMELINE_ID);
    svg.setAttribute("aria-hidden", "true");
    document.body.prepend(svg);
  }

  svg.setAttribute("viewBox", `0 0 ${width} ${docHeight}`);
  svg.setAttribute("width", String(width));
  svg.setAttribute("height", String(docHeight));

  svg.innerHTML = `
    <path class="vine-base" d="${pathData}"></path>
    <path class="vine-highlight" d="${pathData}"></path>
    <g class="vine-tip" opacity="0">
      <g class="vine-tip-art" transform="translate(-2 0)">
        <path
          class="vine-tip-bud"
          d="M 2 0 C 5 -6, 13 -8, 21 -5 C 27 -3, 30 0, 31 0 C 30 0, 27 3, 21 5 C 13 8, 5 6, 2 0 Z"
        ></path>
        <ellipse class="vine-tip-join-cover" cx="2.2" cy="0" rx="2.0" ry="2.0"></ellipse>
        <path class="vine-tip-bud-highlight" d="M 9 -1 C 13 -4, 19 -4, 23 -2 C 19 -1, 14 0, 10 0 Z"></path>
        <path class="vine-tip-bud-vein" d="M 6 0 C 11 -1, 18 -1, 25 0"></path>
      </g>
    </g>
  `;

  const basePath = svg.querySelector(".vine-base");
  const highlightPath = svg.querySelector(".vine-highlight");
  const tipGroup = svg.querySelector(".vine-tip");

  const totalLength = basePath.getTotalLength();
  const dasharray = `${totalLength}`;

  basePath.style.strokeWidth = `${8 * vineScale}`;
  highlightPath.style.strokeWidth = `${5.4 * vineScale}`;

  basePath.style.strokeDasharray = dasharray;
  basePath.style.strokeDashoffset = dasharray;
  highlightPath.style.strokeDasharray = dasharray;
  highlightPath.style.strokeDashoffset = dasharray;

  vineState = {
    basePath,
    highlightPath,
    tipGroup,
    totalLength,
    docHeight,
    tipScale
  };

  scheduleVineUpdate();
}

function initializeVineTimeline() {
  buildVineTimeline();

  window.addEventListener("scroll", scheduleVineUpdate, { passive: true });
  window.addEventListener("resize", buildVineTimeline);

  if ("ResizeObserver" in window) {
    const resizeObserver = new ResizeObserver(() => {
      buildVineTimeline();
    });
    resizeObserver.observe(document.body);
  }
}

function initializeBattleScene() {
  if (!battleScene) return;

  const vinewhipVideo = battleScene.querySelector(".vinewhip-video");

  if (!vinewhipVideo) return;

  let battleSceneScrollRafId = 0;
  const battleScenePlaybackMultiplier = 1.35;
  const isEmbeddedInWipeaway = Boolean(battleScene.closest(".wipeaway-section"));

  const setBattleSceneHeight = () => {
    if (isEmbeddedInWipeaway) {
      battleScene.style.height = "100%";
      return;
    }

    if (vinewhipVideo.videoWidth > 0 && vinewhipVideo.videoHeight > 0) {
      const sceneWidth = battleScene.clientWidth || window.innerWidth;
      const sceneHeight = (sceneWidth * vinewhipVideo.videoHeight / vinewhipVideo.videoWidth);
      battleScene.style.height = `${Math.max(1, Math.round(sceneHeight))}px`;
    }
  };

  const updateBattleSceneFromScroll = () => {
    battleSceneScrollRafId = 0;

    if (!Number.isFinite(vinewhipVideo.duration) || vinewhipVideo.duration <= 0) return;

    const rect = battleScene.getBoundingClientRect();
    const progress = clamp(((window.innerHeight - rect.top) / (window.innerHeight + rect.height)) * battleScenePlaybackMultiplier, 0, 1);
    const finalTime = Math.max(0, vinewhipVideo.duration - 0.04);
    const targetTime = progress >= 1 ? finalTime : progress * finalTime;

    if (Math.abs(vinewhipVideo.currentTime - targetTime) > 0.03) {
      vinewhipVideo.currentTime = targetTime;
    }

    if (progress >= 1) {
      vinewhipVideo.pause();
      vinewhipVideo.currentTime = finalTime;
    }
  };

  const scheduleBattleSceneUpdate = () => {
    if (battleSceneScrollRafId) return;
    battleSceneScrollRafId = window.requestAnimationFrame(updateBattleSceneFromScroll);
  };

  const onMetadataLoaded = () => {
    setBattleSceneHeight();
    vinewhipVideo.pause();
    vinewhipVideo.currentTime = 0;

    if (isEmbeddedInWipeaway) {
      return;
    }

    scheduleBattleSceneUpdate();
  };

  if (vinewhipVideo.readyState >= 1) {
    onMetadataLoaded();
  } else {
    vinewhipVideo.addEventListener("loadedmetadata", onMetadataLoaded, { once: true });
  }

  window.addEventListener("resize", () => {
    if (vinewhipVideo.readyState >= 1) {
      setBattleSceneHeight();

      if (isEmbeddedInWipeaway) {
        return;
      }

      scheduleBattleSceneUpdate();
    }
  });

  if (isEmbeddedInWipeaway) {
    return;
  }

  window.addEventListener("scroll", scheduleBattleSceneUpdate, { passive: true });
}

function completeAnimationWithoutJump(section, stickyVideo) {
  if (!stickyVideo) {
    section.classList.add("animation-complete");
    return;
  }

  const beforeTop = stickyVideo.getBoundingClientRect().top;
  section.classList.add("animation-complete");
  const afterTop = stickyVideo.getBoundingClientRect().top;
  const deltaY = afterTop - beforeTop;

  if (Math.abs(deltaY) > 0.5) {
    window.scrollBy(0, deltaY);
  }
}

function createSetSection(isContentLeft) {
  const section = document.createElement("section");
  section.className = `video-section ${isContentLeft ? "content-left" : "content-right"}`;
  section.innerHTML = `
    <div class="sticky-video">
      <div class="left-column"></div>
      <div class="right-column"></div>
    </div>
  `;

  const targetColumn = section.querySelector(isContentLeft ? ".left-column" : ".right-column");
  targetColumn.classList.add("set-column");
  targetColumn.innerHTML = `
    <div class="text-header">
      <img class="cards-logo is-hidden" alt="" loading="lazy">
      <h2 class="cards-title"></h2>
      <p class="cards-subtitle"></p>
      <p class="cards-description"></p>
    </div>
    <div class="cards-container"></div>
    <video class="pack-video" muted playsinline></video>
  `;

  return section;
}

function initializeSetSection(section, setData) {
  const video = section.querySelector(".pack-video");
  const stickyVideo = section.querySelector(".sticky-video");
  const cardsContainer = section.querySelector(".cards-container");
  const cardsLogo = section.querySelector(".cards-logo");
  const cardsTitle = section.querySelector(".cards-title");
  const cardsSubtitle = section.querySelector(".cards-subtitle");
  const cardsDescription = section.querySelector(".cards-description");
  const hasVideo = typeof setData.videoSrc === "string" && setData.videoSrc.trim() !== "";

  let played = false;

  cardsContainer.addEventListener("click", event => {
    const flipButton = event.target.closest(".card-flip");
    if (!flipButton || !cardsContainer.contains(flipButton)) return;
    openCardModal(flipButton);
  });

  function revealCardsWithoutVideo() {
    const cards = Array.from(cardsContainer.querySelectorAll(".card-item"));
    cardsContainer.style.visibility = "visible";

    cards.forEach(card => {
      card.style.opacity = "0";
      card.style.transform = "translateY(10px)";
      card.style.transition = "none";
    });

    requestAnimationFrame(() => {
      cards.forEach((card, index) => {
        card.style.transition = `opacity 420ms ease, transform 420ms ease`;
        card.style.transitionDelay = `${index * 40}ms`;
        card.style.opacity = "1";
        card.style.transform = "none";
      });
    });

    setTimeout(() => {
      cards.forEach(card => {
        card.style.transitionDelay = "0ms";
      });
      completeAnimationWithoutJump(section, stickyVideo);
    }, 420 + (cards.length * 40));
  }

  function prepareFanOutCards() {
    const items = Array.from(cardsContainer.querySelectorAll(".card-item"));
    if (items.length === 0) return;

    cardsContainer.style.visibility = "hidden";
    const containerRect = cardsContainer.getBoundingClientRect();
    const videoRect = video.getBoundingClientRect();
    const positions = items.map(item => {
      const rect = item.getBoundingClientRect();
      return {
        item,
        top: rect.top - containerRect.top,
        left: rect.left - containerRect.left,
        width: rect.width,
        height: rect.height
      };
    });

    const firstCard = positions[0];
    const videoCenterTop = (videoRect.top - containerRect.top) + (videoRect.height / 2);
    const videoCenterLeft = (videoRect.left - containerRect.left) + (videoRect.width / 2);

    const originTop = Number.isFinite(videoCenterTop)
      ? videoCenterTop - (firstCard.height / 2) + ORIGIN_Y_FINE_TUNE_PX
      : firstCard.top;
    const originLeft = Number.isFinite(videoCenterLeft)
      ? videoCenterLeft + ORIGIN_X_FINE_TUNE_PX
      : firstCard.left;

    positions.forEach(({ item, top, left }) => {
      const dx = originLeft - left;
      const dy = originTop - top;
      item.style.transform = `translate3d(${dx}px, ${dy}px, 0)`;
      item.dataset.stackDx = String(dx);
      item.dataset.stackDy = String(dy);
      item.classList.add("no-transition");
    });

    requestAnimationFrame(() => {
      items.forEach(item => {
        item.style.transition = "transform 0.45s ease-out";
        item.classList.remove("no-transition");
      });
      cardsContainer.style.visibility = "visible";
    });
  }

  function renderCards() {
    if (hasVideo) {
      video.src = setData.videoSrc;
      video.playbackRate = 1.5;
      video.classList.remove("is-hidden");
    } else {
      video.removeAttribute("src");
      video.classList.add("is-hidden");
    }

    cardsContainer.style.visibility = "hidden";
    cardsContainer.innerHTML = "";

    const hasLogo = typeof setData.image === "string" && setData.image.trim() !== "";
    if (hasLogo) {
      cardsLogo.src = setData.image;
      cardsLogo.alt = `${setData.title} logo`;
      cardsLogo.classList.remove("is-hidden");
    } else {
      cardsLogo.removeAttribute("src");
      cardsLogo.alt = "";
      cardsLogo.classList.add("is-hidden");
    }

    cardsTitle.textContent = setData.title;
    cardsSubtitle.textContent = setData.subtitle;
    cardsDescription.textContent = setData.description;

    let loadedImages = 0;
    const totalImages = setData.cards.length;

    setData.cards.forEach(card => {
      const item = document.createElement("div");
      item.className = "card-item";

      const flipButton = document.createElement("button");
      flipButton.type = "button";
      flipButton.className = "card-flip";
      flipButton.setAttribute("aria-label", `Flip ${setData.title} card ${card.number}`);

      const frontMedia = createCardFrontMedia(card, setData.title);

      const backImg = document.createElement("img");
      backImg.className = "card-image card-face card-face-back";
      backImg.src = CARD_BACK_IMAGE_SRC;
      backImg.alt = `Card back for ${setData.title} card ${card.number}`;

      const caption = document.createElement("span");
      caption.className = "card-number";
      caption.textContent = card.number;

      flipButton.appendChild(frontMedia);
      flipButton.appendChild(backImg);
      item.appendChild(flipButton);
      item.appendChild(caption);
      cardsContainer.appendChild(item);

      const onLoad = () => {
        loadedImages += 1;
        if (loadedImages === totalImages) {
          if (hasVideo) {
            requestAnimationFrame(() => requestAnimationFrame(prepareFanOutCards));
          } else {
            requestAnimationFrame(() => requestAnimationFrame(revealCardsWithoutVideo));
          }
        }
      };

      if (frontMedia.tagName === "VIDEO") {
        const onVideoReady = () => {
          frontMedia.currentTime = 0;
          frontMedia.play().catch(() => {});
          onLoad();
        };

        if (frontMedia.readyState >= 2) {
          onVideoReady();
        } else {
          frontMedia.addEventListener("loadeddata", onVideoReady, { once: true });
          frontMedia.addEventListener("error", onLoad, { once: true });
        }
      } else if (frontMedia.complete && frontMedia.naturalWidth !== 0) {
        onLoad();
      } else {
        frontMedia.addEventListener("load", onLoad);
        frontMedia.addEventListener("error", onLoad);
      }
    });
  }

  video.addEventListener("ended", () => {
    const cards = cardsContainer.querySelectorAll(".card-item");
    cards.forEach(card => {
      card.classList.remove("no-transition");
      card.style.transition = `transform ${STACK_LIFT_DURATION_MS}ms ease-out`;
    });

    requestAnimationFrame(() => {
      cards.forEach(card => void card.offsetWidth);
      cards.forEach(card => {
        const stackDx = Number(card.dataset.stackDx || 0);
        const stackDy = Number(card.dataset.stackDy || 0);
        const liftY = card.getBoundingClientRect().height * STACK_LIFT_MULTIPLIER;
        card.style.transform = `translate3d(${stackDx}px, ${stackDy - liftY}px, 0)`;
      });
    });

    setTimeout(() => {
      video.classList.add("video-exit");

      setTimeout(() => {
        cards.forEach(card => {
          card.style.transition = `transform ${FAN_OUT_DURATION_MS}ms ease-out`;
          card.style.transform = "none";
        });
      }, VIDEO_EXIT_DURATION_MS);
    }, STACK_LIFT_DURATION_MS);

    setTimeout(() => {
      completeAnimationWithoutJump(section, stickyVideo);
    }, STACK_LIFT_DURATION_MS + VIDEO_EXIT_DURATION_MS + FAN_OUT_DURATION_MS);
  });

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting || played) return;

      played = true;

      if (!hasVideo) {
        return;
      }

      video.play();
    });
  }, {
    threshold: 0.5
  });

  observer.observe(section);

  renderCards();
}

Object.entries(setsData).forEach(([, setData], index) => {
  const isContentLeft = index % 2 === 0;
  const section = createSetSection(isContentLeft);
  setsRoot.appendChild(section);
  initializeSetSection(section, setData);
});

initializeBattleScene();
initializeVineTimeline();
initializeWipeawayScrollGate();