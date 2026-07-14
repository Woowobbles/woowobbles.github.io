const video = document.getElementById("packVideo");
const section = document.querySelector(".video-section");
const cardsContainer = document.getElementById("cardsContainer");
const cardsTitle = document.querySelector(".cards-title");
const ORIGIN_X_FINE_TUNE_PX = 1.5;
const ORIGIN_Y_FINE_TUNE_PX = 6;
const STACK_LIFT_MULTIPLIER = 1.2;
const STACK_LIFT_DURATION_MS = 800;
const FAN_OUT_DURATION_MS = 800;
const VIDEO_EXIT_DURATION_MS = 300;

const cardsData = [
  { set: "Base Set | Shadowless 1st Edition", imgurl: "images/1.1 BS1_Bulb.png", number: "1/3" },
  { set: "Base Set | Shadowless 1st Edition", imgurl: "images/1.2 BS1_Ivy.png", number: "2/3" },
  { set: "Base Set | Shadowless 1st Edition", imgurl: "images/1.3 BS1_Ven.png", number: "3/3" },
  { set: "Base Set | Shadowless 1st Edition", imgurl: "images/1.3 BS1_Ven.png", number: "4/3" },
  { set: "Base Set | Shadowless 1st Edition", imgurl: "images/1.2 BS1_Ivy.png", number: "2/3" },
  { set: "Base Set | Shadowless 1st Edition", imgurl: "images/1.3 BS1_Ven.png", number: "3/3" },
  { set: "Base Set | Shadowless 1st Edition", imgurl: "images/1.3 BS1_Ven.png", number: "4/3" }
];

function renderCards() {
  cardsContainer.style.visibility = "hidden";
  cardsContainer.style.visibility = "hidden";
  cardsContainer.innerHTML = "";
  const setNames = [...new Set(cardsData.map(card => card.set))];

  cardsTitle.textContent = setNames.join(", ");

  let loadedImages = 0;
  const totalImages = cardsData.length;

  let loadedImages = 0;
  const totalImages = cardsData.length;

  cardsData.forEach(card => {
    const item = document.createElement("div");
    item.className = "card-item";

    const img = document.createElement("img");
    img.className = "card-image";
    img.src = card.imgurl;
    img.alt = `${card.set} card ${card.number}`;
    img.dataset.set = card.set;
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
        requestAnimationFrame(() => requestAnimationFrame(prepareFanOutCards));
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

function prepareFanOutCards() {
  const items = Array.from(document.querySelectorAll(".card-item"));
  if (items.length === 0) return;

  // Keep the container as a grid and only move cards visually with transform.
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

renderCards();

let played = false;

// Prevent scroll when locked
function preventScroll(e) {
  e.preventDefault();
}

// Make sure video is ready
video.addEventListener("loadeddata", () => {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !played) {
        document.body.classList.add("is-locked");
        document.addEventListener("wheel", preventScroll, { passive: false });
        document.addEventListener("touchmove", preventScroll, { passive: false });
        video.play();
        played = true;
      }
    });
  }, {
    threshold: 0.5
  });

  observer.observe(section);
});

video.addEventListener("ended", () => {
  // Allow scrolling immediately when video ends
  document.body.classList.remove("is-locked");
  document.removeEventListener("wheel", preventScroll);
  document.removeEventListener("touchmove", preventScroll);

  // Animate cards into view
  const cards = document.querySelectorAll(".card-item");
  const cards = document.querySelectorAll(".card-item");
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
    document.body.classList.add("animation-complete");
  }, STACK_LIFT_DURATION_MS + VIDEO_EXIT_DURATION_MS + FAN_OUT_DURATION_MS);
});