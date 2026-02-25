const toggle   = document.querySelector('.navbar-toggle');
const collapse = document.querySelector('.navbar-collapse');

toggle.addEventListener('click', () => {
  toggle.classList.toggle('open');
  collapse.classList.toggle('open');
});