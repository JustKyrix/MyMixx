const toggle = document.querySelector('.navbar-toggle');
const collapse = document.querySelector('.navbar-collapse');
const nav = document.getElementById('navbar');
const h1 = document.querySelector('h1');
const breakpoint = window.matchMedia('(max-width: 991px)');
const body = document.querySelector('body');


toggle.addEventListener('click', () => {
  toggle.classList.toggle('open');
  collapse.classList.toggle('open');
  nav.classList.toggle('nav-bg'); 

  if (collapse.classList.contains('open')) {
    body.style.overflow = 'hidden';
  } else {
    body.style.overflow = 'initial';
    body.style.overflowX = 'hidden';
  }
});

document.addEventListener('DOMContentLoaded', function() {
  function handleBreakpoint(e) {
    if (e.matches) {
      h1.classList.add('h2');
    } else {
      h1.classList.remove('h2');
    }
  }

  // Listen for changes
  breakpoint.addEventListener('change', handleBreakpoint);

  // Run once on load
  handleBreakpoint(breakpoint);

  window.addEventListener('scroll', function() {
    if (window.scrollY > 500) {
      nav.classList.add('sticky');
    } else {
      nav.classList.remove('sticky');
    }
  });
});