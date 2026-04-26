document.addEventListener('DOMContentLoaded', function() {
    const btnTheme = document.getElementById('btn-theme');
    const themeLink = document.getElementById('theme-link');

    if (btnTheme && themeLink) {
        btnTheme.addEventListener('click', function() {
            if (themeLink.getAttribute('href') === 'red.css') {
                themeLink.setAttribute('href', 'green.css');
            } else {
                themeLink.setAttribute('href', 'red.css');
            }
        });
    }

    const btnToggleProjects = document.getElementById('btn-toggle-projects');
    const sectionProjects = document.getElementById('sekcja-projekty');

    if (btnToggleProjects && sectionProjects) {
        btnToggleProjects.addEventListener('click', function() {
            if (sectionProjects.style.display === 'none') {
                sectionProjects.style.display = 'block';
            } else {
                sectionProjects.style.display = 'none';
            }
        });
    }

    const form = document.getElementById('contactForm');
    const successMessage = document.getElementById('success-message');

    if (form) {
        form.addEventListener('submit', function(event) {
            event.preventDefault();
            
            if (successMessage) {
                successMessage.style.display = 'none';
            }

            let isValid = true;

            const inputImie = document.getElementById('imie');
            const inputNazwisko = document.getElementById('nazwisko');
            const inputEmail = document.getElementById('email');
            const inputWiadomosc = document.getElementById('wiadomosc');

            const valImie = inputImie.value.trim();
            const valNazwisko = inputNazwisko.value.trim();
            const valEmail = inputEmail.value.trim();
            const valWiadomosc = inputWiadomosc.value.trim();

            function clearErrors() {
                document.querySelectorAll('.error-message').forEach(err => err.textContent = '');
                document.querySelectorAll('input, textarea').forEach(inp => inp.classList.remove('input-error'));
            }

            function showError(fieldId, message) {
                const errorSpan = document.getElementById('error-' + fieldId);
                const inputField = document.getElementById(fieldId);
                
                if (errorSpan) errorSpan.textContent = message;
                if (inputField) inputField.classList.add('input-error');
                
                isValid = false;
            }

            clearErrors();

            const containsNumber = /\d/;
            const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

            if (valImie === '') {
                showError('imie', 'Pole imię jest wymagane.');
            } else if (containsNumber.test(valImie)) {
                showError('imie', 'Imię nie może zawierać cyfr!');
            }

            if (valNazwisko === '') {
                showError('nazwisko', 'Pole nazwisko jest wymagane.');
            } else if (containsNumber.test(valNazwisko)) {
                showError('nazwisko', 'Nazwisko nie może zawierać cyfr!');
            }

            if (valEmail === '') {
                showError('email', 'Pole e-mail jest wymagane.');
            } else if (!validEmail.test(valEmail)) {
                showError('email', 'Podaj poprawny adres e-mail (np. abc@def.pl).');
            }

            if (valWiadomosc === '') {
                showError('wiadomosc', 'Musisz wpisać wiadomość przed wysłaniem.');
            }

            if (isValid) {
                if (successMessage) {
                    successMessage.style.display = 'block';
                }
                form.reset();
            }
        });
    }
});
