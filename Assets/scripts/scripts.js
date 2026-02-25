const toggle   = document.querySelector('.navbar-toggle');
const collapse = document.querySelector('.navbar-collapse');

toggle.addEventListener('click', () => {
  toggle.classList.toggle('open');
  collapse.classList.toggle('open');
});

document.addEventListener('DOMContentLoaded', function() {
  const nav = document.getElementById('navbar');
  const waveBg = document.querySelector('.nav-wave');

  window.addEventListener('scroll', function() {
    if (window.scrollY > 500) {
      nav.classList.add('sticky', 'nav-bg');
      waveBg.style.display = 'none';
    } else {
      nav.classList.remove('sticky', 'nav-bg');
      waveBg.style.display = 'block';
    }
  });
});