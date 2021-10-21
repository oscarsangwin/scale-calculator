const burgerIcon = document.querySelector('.burger')
let navOpen = false;
function toggleResponsive() {
    if (navOpen) {
        closeResponsiveNav();
    } else {
        openResponsiveNav();
    };
};
function closeResponsiveNav() {
    // Close responsive nav
    navOpen = false;
    burgerIcon.style.transform = '';
    document.querySelectorAll('.burger div').forEach(elem => {
        elem.style.backgroundColor = '#ffffff';
    });
    document.querySelector('nav').style.display = '';
};
function openResponsiveNav() {
    // Open responsive nav
    navOpen = true;
    burgerIcon.style.transform = 'scaleY(1.1)';
    document.querySelectorAll('.burger div').forEach(elem => {
        elem.style.backgroundColor = '#629deb';
    });
    document.querySelector('nav').style.display = 'flex';
};