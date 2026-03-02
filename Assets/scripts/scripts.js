const toggle = document.querySelector('.navbar-toggle');
const collapse = document.querySelector('.navbar-collapse');
const nav = document.getElementById('navbar');
const h1 = document.querySelector('h1');
const breakpoint = window.matchMedia('(max-width: 991px)');
const body = document.querySelector('body');
const navCartMobile = document.querySelector('.nav-cart-mobile');

toggle.addEventListener('click', () => {
    toggle.classList.toggle('open');
    collapse.classList.toggle('open');
    nav.classList.toggle('nav-bg');

    const icon = toggle.querySelector('i');
    if (collapse.classList.contains('open')) {
        body.style.overflow = 'hidden';
        if (navCartMobile) navCartMobile.style.display = 'none';
        icon.className = 'fa-solid fa-x';
    } else {
        body.style.overflow = 'initial';
        body.style.overflowX = 'hidden';
        if (navCartMobile) navCartMobile.style.removeProperty('display');
        icon.className = 'fa-solid fa-bars';
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

    breakpoint.addEventListener('change', handleBreakpoint);
    handleBreakpoint(breakpoint);

    window.addEventListener('scroll', function() {
        if (window.scrollY > 500) {
            nav.classList.add('sticky');
        } else {
            nav.classList.remove('sticky');
        }
    });
});