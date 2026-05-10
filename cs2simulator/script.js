// Stan portfela
let balance = 100.00;

// Baza przedmiotów
const skins = [
    { name: 'AWP | Dragon Lore', price: 12000, rarity: '#eb4b4b' }, // Czerwony
    { name: 'M4A4 | Howl', price: 8000, rarity: '#eb4b4b' },      // Czerwony
    { name: 'AK-47 | Redline', price: 150, rarity: '#d32ce6' },   // Różowy
    { name: 'USP-S | Cyrex', price: 40, rarity: '#4b69ff' },      // Fioletowy
    { name: 'Glock-18 | Water Elemental', price: 15, rarity: '#4b69ff' }
];

// Baza skrzynek (ikony zastępcze)
const cases = [
    { id: 1, name: 'Nature Case', price: 2.30, img: 'https://cdn-icons-png.flaticon.com/512/860/860803.png' },
    { id: 2, name: 'Rain Case', price: 3.10, img: 'https://cdn-icons-png.flaticon.com/512/860/860803.png' },
    { id: 3, name: 'Desert Case', price: 12.10, img: 'https://cdn-icons-png.flaticon.com/512/860/860803.png' },
    { id: 4, name: 'Grave Case', price: 16.10, img: 'https://cdn-icons-png.flaticon.com/512/860/860803.png' }
];

// Pobieranie elementów z HTML
const balanceEl = document.getElementById('balance');
const casesGrid = document.getElementById('casesGrid');
const inventoryGrid = document.getElementById('inventoryGrid');

// Funkcja aktualizująca portfel na ekranie
function updateBalance() {
    balanceEl.innerText = balance.toFixed(2);
}

// Funkcja generująca skrzynki w HTML
function initCases() {
    cases.forEach(c => {
        // Tworzymy "klocek" dla każdej skrzynki
        const card = document.createElement('div');
        card.className = 'case-card';
        // HTML dla pojedynczej skrzynki (zmienia kolory zastępczych ikon filtrem hue-rotate)
        card.innerHTML = `
            <img src="${c.img}" alt="${c.name}" style="filter: hue-rotate(${c.id * 80}deg)">
            <h4>${c.name}</h4>
            <p style="color: #94a3b8; font-size: 14px; margin-bottom: 15px;">${c.price.toFixed(2)} zł</p>
            <button onclick="openCase(${c.price})">OTWÓRZ</button>
        `;
        // Dodajemy na stronę
        casesGrid.appendChild(card);
    });
}

// Funkcja otwierająca skrzynkę (podpięta pod przyciski)
window.openCase = function(price) {
    if (balance >= price) {
        // Odejmujemy pieniądze
        balance -= price;
        updateBalance();

        // Proste losowanie przedmiotu (1 z puli "skins")
        const randomIndex = Math.floor(Math.random() * skins.length);
        const wonSkin = skins[randomIndex];
        
        // Tworzymy kartę dla ekwipunku
        const itemCard = document.createElement('div');
        itemCard.className = 'item-card';
        itemCard.style.borderBottomColor = wonSkin.rarity; // Pasek rzadkości na dole
        itemCard.innerText = wonSkin.name;
        
        // Dodajemy na sam początek ekwipunku (prepend)
        inventoryGrid.prepend(itemCard);
        
        // Powiadomienie (na razie proste okienko)
        alert(`Udało się! Wylosowałeś: ${wonSkin.name}`);
    } else {
        alert("Niestety, brakuje Ci środków. (Odśwież stronę, by zresetować kasę!)");
    }
}

// Uruchamiamy funkcje po załadowaniu skryptu
initCases();
updateBalance();
