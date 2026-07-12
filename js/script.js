const video = document.getElementById("packVideo");
const section = document.querySelector(".video-section");

let played = false;


// Make sure video is ready
video.addEventListener("loadeddata", () => {

  const observer = new IntersectionObserver(entries => {

    entries.forEach(entry => {

      if (entry.isIntersecting && !played) {

        document.body.classList.add("is-locked");
        document.querySelector(".video-section").classList.add("is-sticky");
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
  setTimeout(() => {
    video.classList.add("video-exit");
  }, 800);

  setTimeout(() => {
    document.body.classList.remove("is-locked");
    document.querySelector(".video-section").classList.remove("is-sticky");
  }, 2200);
});