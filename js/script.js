const video = document.getElementById("packVideo");
const section = document.querySelector(".video-section");

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
  const cards = document.querySelectorAll("#cardImage");
  cards.forEach(card => {
    card.classList.add("cards-visible");
  });
  
  setTimeout(() => {
    video.classList.add("video-exit");
  }, 800);
});