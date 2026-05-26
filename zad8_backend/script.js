document.addEventListener('DOMContentLoaded', function() {
    const btnTheme = document.getElementById('btn-theme');
    const themeLink = document.getElementById('theme-link');

    const savedTheme = localStorage.getItem('user_theme');
    if (savedTheme && themeLink) {
        themeLink.setAttribute('href', savedTheme);
    }

    if (btnTheme && themeLink) {
        btnTheme.addEventListener('click', function() {
            let currentTheme = themeLink.getAttribute('href');
            let newTheme = (currentTheme === 'red.css') ? 'green.css' : 'red.css';
            
            themeLink.setAttribute('href', newTheme);
            localStorage.setItem('user_theme', newTheme);
        });
    }

    const btnToggleProjects = document.getElementById('btn-toggle-projects');
    const sectionProjects = document.getElementById('sekcja-projekty');

    if (btnToggleProjects && sectionProjects) {
        btnToggleProjects.addEventListener('click', function() {
            sectionProjects.style.display = (sectionProjects.style.display === 'none') ? 'block' : 'none';
        });
    }

    const form = document.getElementById('contactForm');
    const successMessage = document.getElementById('success-message');

    if (form) {
        form.addEventListener('submit', function(event) {
            event.preventDefault();
            if (successMessage) successMessage.style.display = 'none';

            let isValid = true;
            
            document.querySelectorAll('.error-message').forEach(err => err.textContent = '');
            document.querySelectorAll('input, textarea').forEach(inp => inp.classList.remove('input-error'));

            const values = {
                imie: document.getElementById('imie').value.trim(),
                nazwisko: document.getElementById('nazwisko').value.trim(),
                email: document.getElementById('email').value.trim(),
                wiadomosc: document.getElementById('wiadomosc').value.trim()
            };

            const containsNumber = /\d/;
            const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

            if (values.imie === '') {
                showError('imie', 'Pole imię jest wymagane.');
            } else if (containsNumber.test(values.imie)) {
                showError('imie', 'Imię nie może zawierać cyfr!');
            }

            if (values.nazwisko === '') {
                showError('nazwisko', 'Pole nazwisko jest wymagane.');
            } else if (containsNumber.test(values.nazwisko)) {
                showError('nazwisko', 'Nazwisko nie może zawierać cyfr!');
            }

            if (values.email === '') {
                showError('email', 'Pole e-mail jest wymagane.');
            } else if (!validEmail.test(values.email)) {
                showError('email', 'Podaj poprawny adres e-mail.');
            }

            if (values.wiadomosc === '') {
                showError('wiadomosc', 'Wpisz wiadomość.');
            }

            function showError(id, msg) {
                document.getElementById('error-' + id).textContent = msg;
                document.getElementById(id).classList.add('input-error');
                isValid = false;
            }

            if (isValid) {
                const dataToSend = {
                    imie: values.imie,
                    nazwisko: values.nazwisko,
                    email: values.email,
                    wiadomosc: values.wiadomosc
                };

                const submitBtn = document.getElementById('btn-submit');
                const originalBtnText = submitBtn.textContent;
                submitBtn.textContent = 'Wysyłanie...';
                submitBtn.disabled = true;

                const endpointURL = 'https://formspree.io/f/mbdbzvbd'; 

                fetch(endpointURL, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(dataToSend)
                })
                .then(response => {
                    if(response.ok) {
                        if (successMessage) successMessage.style.display = 'block';
                        form.reset();
                    } else {
                        alert('Wystąpił błąd po stronie serwera. Sprawdź, czy podałeś poprawny link.');
                    }
                })
                .catch(error => {
                    console.error('Błąd komunikacji:', error);
                    alert('Wystąpił błąd sieci. Spróbuj ponownie.');
                })
                .finally(() => {
                    submitBtn.textContent = originalBtnText;
                    submitBtn.disabled = false;
                });
            }
        });
    }

    fetch('data.json')
        .then(response => response.json())
        .then(data => {
            const listaUmiejetnosci = document.getElementById('lista-umiejetnosci');
            if (listaUmiejetnosci) {
                data.umiejetnosci.forEach(u => {
                    const li = document.createElement('li');
                    li.textContent = u;
                    listaUmiejetnosci.appendChild(li);
                });
            }

            const listaProjekty = document.getElementById('lista-projekty');
            if (listaProjekty) {
                data.projekty.forEach(p => {
                    const li = document.createElement('li');
                    li.innerHTML = `<strong>${p.tytul}</strong>: ${p.opis}`;
                    listaProjekty.appendChild(li);
                });
            }
        })
        .catch(err => console.error('Błąd JSON:', err));

    const btnAddNote = document.getElementById('btn-dodaj-notatke');
    const inputNote = document.getElementById('nowa-notatka');
    const notesList = document.getElementById('lista-notatek');

    function getNotes() {
        const stored = localStorage.getItem('user_notes');
        return stored ? JSON.parse(stored) : [];
    }

    function saveNotes(notes) {
        localStorage.setItem('user_notes', JSON.stringify(notes));
    }

    function renderNotes() {
        if (!notesList) return;
        notesList.innerHTML = '';
        const notes = getNotes();

        notes.forEach((text, index) => {
            const li = document.createElement('li');
            li.style.cssText = 'display:flex; justify-content:space-between; align-items:center; margin-bottom:8px; padding:10px; background:#f3f4f6; border-radius:4px; border:1px solid #e5e7eb;';
            
            const span = document.createElement('span');
            span.textContent = text;
            
            const btnDel = document.createElement('button');
            btnDel.textContent = 'Usuń';
            btnDel.style.cssText = 'padding:4px 8px; background:#ef4444; color:white; border:none; border-radius:4px; cursor:pointer; font-size:0.8em;';
            
            btnDel.onclick = () => {
                const current = getNotes();
                current.splice(index, 1);
                saveNotes(current);
                renderNotes();
            };

            li.appendChild(span);
            li.appendChild(btnDel);
            notesList.appendChild(li);
        });
    }

    if (btnAddNote && inputNote) {
        btnAddNote.addEventListener('click', () => {
            const val = inputNote.value.trim();
            if (val) {
                const current = getNotes();
                current.push(val);
                saveNotes(current);
                inputNote.value = '';
                renderNotes();
            }
        });

        renderNotes();
    }
});
