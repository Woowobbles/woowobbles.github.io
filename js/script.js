const video = document.getElementById("packVideo");
const section = document.querySelector(".video-section");
const cardsContainer = document.getElementById("cardsContainer");
const cardsTitle = document.querySelector(".cards-title");

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
  cardsContainer.innerHTML = "";
  const setNames = [...new Set(cardsData.map(card => card.set))];

  cardsTitle.textContent = setNames.join(", ");

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
  const cards = document.querySelectorAll(".card-image");
  cards.forEach(card => {
    card.classList.add("cards-visible");
  });

  setTimeout(() => {
    document.body.classList.add("animation-complete");
  }, 600);

  setTimeout(() => {
    video.classList.add("video-exit");
  }, 800);
});