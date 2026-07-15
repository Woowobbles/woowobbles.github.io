const ORIGIN_X_FINE_TUNE_PX = 1.5;
const ORIGIN_Y_FINE_TUNE_PX = 6;
const STACK_LIFT_MULTIPLIER = 1.2;
const STACK_LIFT_DURATION_MS = 800;
const FAN_OUT_DURATION_MS = 800;
const VIDEO_EXIT_DURATION_MS = 300;
const setsRoot = document.getElementById("setsRoot");

const setsData = {
  baseSetShadowless1st: {
    title: "Base Set | Shadowless 1st Edition",
    subtitle: "Date goes here",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    videoSrc: "images/Base set pack.webm",
    cards: [
      { imgurl: "images/1.1 BS1_Bulb.png", number: "1/3" },
      { imgurl: "images/1.2 BS1_Ivy.png", number: "2/3" },
      { imgurl: "images/1.3 BS1_Ven.png", number: "3/3" }
    ]
  },
    baseSetShadowless: {
    title: "Base Set | Shadowless",
    subtitle: "Date goes here",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    videoSrc: "images/Base set pack.webm",
    cards: [
      { imgurl: "images/1.1 BS1_Bulb.png", number: "1/3" },
      { imgurl: "images/1.2 BS1_Ivy.png", number: "2/3" },
      { imgurl: "images/1.3 BS1_Ven.png", number: "3/3" }
    ]
  }
};

function preventScroll(e) {
  e.preventDefault();
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
  const cardsTitle = section.querySelector(".cards-title");
  const cardsSubtitle = section.querySelector(".cards-subtitle");
  const cardsDescription = section.querySelector(".cards-description");
  const hasVideo = typeof setData.videoSrc === "string" && setData.videoSrc.trim() !== "";

  let played = false;

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
        item.style.transition = "transform 0.6s ease-out";
        item.classList.remove("no-transition");
      });
      cardsContainer.style.visibility = "visible";
    });
  }

  function renderCards() {
    if (hasVideo) {
      video.src = setData.videoSrc;
      video.classList.remove("is-hidden");
    } else {
      video.removeAttribute("src");
      video.classList.add("is-hidden");
    }

    cardsContainer.style.visibility = "hidden";
    cardsContainer.innerHTML = "";
    cardsTitle.textContent = setData.title;
    cardsSubtitle.textContent = setData.subtitle;
    cardsDescription.textContent = setData.description;

    let loadedImages = 0;
    const totalImages = setData.cards.length;

    setData.cards.forEach(card => {
      const item = document.createElement("div");
      item.className = "card-item";

      const img = document.createElement("img");
      img.className = "card-image";
      img.src = card.imgurl;
      img.alt = `${setData.title} card ${card.number}`;
      img.dataset.set = setData.title;
      img.dataset.number = card.number;

      const caption = document.createElement("span");
      caption.className = "card-number";
      caption.textContent = card.number;

      item.appendChild(img);
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

      if (img.complete && img.naturalWidth !== 0) {
        onLoad();
      } else {
        img.addEventListener("load", onLoad);
        img.addEventListener("error", onLoad);
      }
    });
  }

  video.addEventListener("ended", () => {
    document.body.classList.remove("is-locked");
    document.removeEventListener("wheel", preventScroll);
    document.removeEventListener("touchmove", preventScroll);

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

      document.body.classList.add("is-locked");
      document.addEventListener("wheel", preventScroll, { passive: false });
      document.addEventListener("touchmove", preventScroll, { passive: false });
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