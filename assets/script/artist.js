window.addEventListener("scroll", function () {
  const heroImage = document.getElementById("heroImage");
  const scrollY = window.scrollY;
  const maxHeight = 100;
  let opacity = 1 - scrollY / maxHeight;

  if (opacity < 0) opacity = 0;
  heroImage.style.opacity = opacity;
});
