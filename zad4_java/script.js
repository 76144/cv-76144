// 1. ZMIANA MOTYWU
const btnTheme = document.getElementById('btn-theme');
const themeLink = document.getElementById('theme-link');

btnTheme.addEventListener('click', function() {
    // Sprawdzamy, jaki arkusz jest aktualnie podpięty
    if (themeLink.getAttribute('href') === 'red.css') {
        themeLink.setAttribute('href', 'green.css'); // Zmień na zielony
    } else {
        themeLink.setAttribute('href', 'red.css'); // Wróć do czerwonego
    }
});

// 2. UKRYWANIE I POKAZYWANIE SEKCJI PROJEKTY
const btnToggleProjects = document.getElementById('btn-toggle-projects');
const sectionProjects = document.getElementById('sekcja-projekty');

btnToggleProjects.addEventListener('click', function() {
    // Jeśli sekcja jest ukryta (display: none), to ją pokaż. Jeśli widoczna, to ukryj.
    if (sectionProjects.style.display === 'none') {
        sectionProjects.style.display = 'block';
    } else {
        sectionProjects.style.display = 'none';
    }
});
