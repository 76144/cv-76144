const btnTheme = document.getElementById('btn-theme');
const themeLink = document.getElementById('theme-link');

btnTheme.addEventListener('click', function() {
    if (themeLink.getAttribute('href') === 'red.css') {
        themeLink.setAttribute('href', 'green.css');
    } else {
        themeLink.setAttribute('href', 'red.css');
    }
});

const btnToggleProjects = document.getElementById('btn-toggle-projects');
const sectionProjects = document.getElementById('sekcja-projekty');

btnToggleProjects.addEventListener('click', function() {
    if (sectionProjects.style.display === 'none') {
        sectionProjects.style.display = 'block';
    } else {
        sectionProjects.style.display = 'none';
    }
});
