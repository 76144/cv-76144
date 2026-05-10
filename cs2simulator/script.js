// STAN APLIKACJI
let balance = 100.00;
let inventory = [];
let currentCase = null;
let isSpinning = false; // Zapobiega klikaniu podczas animacji

// BAZA DANYCH (Teraz skrzynki mają dokładne szanse w %)
const casesData = [
    {
        id: 'case1',
        name: 'Dreams & Nightmares Case',
        price: 15.00,
        img: 'https://placehold.co/150x150/1e293b/fff?text=Dreams\nCase',
        items: [
            // Szanse sumują się do 100%
            { name: 'AK-47 | Nightwish', price: 450, chance: 0.64, rarity: 'var(--red)', img: 'https://placehold.co/150x100/1e293b/fff?text=AK47\nNightwish' },
            { name: 'MP9 | Starlight Protector', price: 120, chance: 3.2, rarity: 'var(--pink)', img: 'https://placehold.co/150x100/1e293b/fff?text=MP9' },
            { name: 'Dual Berettas | Melondrama', price: 80, chance: 3.2, rarity: 'var(--pink)', img: 'https://placehold.co/150x100/1e293b/fff?text=Dualies' },
            { name: 'FAMAS | Rapid Eye', price: 30, chance: 15.98, rarity: 'var(--purple)', img: 'https://placehold.co/150x100/1e293b/fff?text=FAMAS' },
            { name: 'M4A1-S | Night Terror', price: 25, chance: 15.98, rarity: 'var(--purple)', img: 'https://placehold.co/150x100/1e293b/fff?text=M4A1-S' },
            { name: 'USP-S | Ticket to Hell', price: 10, chance: 20.33, rarity: 'var(--blue)', img: 'https://placehold.co/150x100/1e293b/fff?text=USP-S' },
            { name: 'MAC-10 | Ensnared', price: 5, chance: 20.33, rarity: 'var(--blue)', img: 'https://placehold.co/150x100/1e293b/fff?text=MAC-10' },
            { name: 'Five-SeveN | Scrawl', price: 2, chance: 20.34, rarity: 'var(--blue)', img: 'https://placehold.co/150x100/1e293b/fff?text=Five-SeveN' }
        ]
    },
    {
        id: 'case2',
        name: 'Chroma 2 Case',
        price: 5.00,
        img: 'https://placehold.co/150x150/1e293b/fff?text=Chroma 2\nCase',
        items: [
            { name: 'M4A1-S | Hyper Beast', price: 300, chance: 0.64, rarity: 'var(--red)', img: 'https://placehold.co/150x100/1e293b/fff?text=M4A1-S\nHyper' },
            { name: 'MAC-10 | Neon Rider', price: 80, chance: 3.2, rarity: 'var(--pink)', img: 'https://placehold.co/150x100/1e293b/fff?text=MAC-10\nNeon' },
            { name: 'AK-47 | Elite Build', price: 15, chance: 15.98, rarity: 'var(--purple)', img: 'https://placehold.co/150x100/1e293b/fff?text=AK47\nElite' },
            { name: 'Desert Eagle | Bronze Deco', price: 2, chance: 80.18, rarity: 'var(--blue)', img: 'https://placehold.co/150x100/1e293b/fff?text=Deagle' }
        ]
    }
];

// POBIERANIE ELEMENTÓW
const balanceEl = document.getElementById('balance');
const casesGrid = document.getElementById('casesGrid');
const inventoryGrid = document.getElementById('inventoryGrid');
const totalValueEl = document.getElementById('totalValue');
const rouletteStrip = document.getElementById('rouletteStrip');

// ZARZĄDZANIE WIDOKAMI (SPA)
function switchTab(tabId) {
    if (isSpinning) return; // Zablokuj zmianę zakładki podczas kręcenia ruletki
    document.querySelectorAll('.view').forEach(view => view.classList.remove('active'));
    document.getElementById(`view-${tabId}`).classList.add('active');
    if(tabId === 'inventory') renderInventory();
}

// INICJALIZACJA STRONY
function init() {
    updateBalance();
    
    // Generowanie skrzynek na stronie głównej
    casesData.forEach(c => {
        const card = document.createElement('div');
        card.className = 'case-card';
        card.onclick = () => setupCaseOpening(c);
        card.innerHTML = `
            <img src="${c.img}" class="case-img">
            <h3>${c.name}</h3>
            <p style="color: #22c55e; font-weight: bold;">${c.price.toFixed(2)} zł</p>
        `;
        casesGrid.appendChild(card);
    });
}

function updateBalance() {
    balanceEl.innerText = balance.toFixed(2);
}

// WIDOK OTWIERANIA KONKRETNEJ SKRZYNKI
function setupCaseOpening(caseObj) {
    currentCase = caseObj;
    document.getElementById('openingCaseName').innerText = caseObj.name;
    document.getElementById('openingCasePrice').innerText = caseObj.price.toFixed(2);
    
    const btn = document.getElementById('openCaseBtn');
    btn.onclick = () => spinRoulette();
    
    // Pokazywanie zawartości skrzynki (szanse i itemy) na dole
    const contentsGrid = document.getElementById('caseContentsGrid');
    contentsGrid.innerHTML = '';
    caseObj.items.forEach(item => {
        contentsGrid.innerHTML += `
            <div class="item-card" style="border-bottom-color: ${item.rarity}">
                <img src="${item.img}" class="skin-img">
                <span style="font-size: 12px; color: #94a3b8;">Szanse: ${item.chance}%</span>
                <h4>${item.name}</h4>
                <p>${item.price.toFixed(2)} zł</p>
            </div>
        `;
    });

    // Reset ruletki wizualnie
    rouletteStrip.style.transition = 'none';
    rouletteStrip.style.transform = 'translateX(0)';
    rouletteStrip.innerHTML = ''; 

    switchTab('opening');
}

// LOGIKA LOSOWANIA (Weighted Random)
function getRolledItem(items) {
    const rand = Math.random() * 100;
    let cumulative = 0;
    for (let item of items) {
        cumulative += item.chance;
        if (rand <= cumulative) return item;
    }
    return items[items.length - 1]; // Fallback
}

// ANIMACJA RULETKI
function spinRoulette() {
    if (balance < currentCase.price) {
        alert("Brak wystarczających środków!");
        return;
    }
    
    balance -= currentCase.price;
    updateBalance();
    
    isSpinning = true;
    const btn = document.getElementById('openCaseBtn');
    btn.disabled = true;

    // Wylosuj przedmiot, który wygra
    const wonItem = getRolledItem(currentCase.items);

    // Generujemy pasek 70 losowych przedmiotów do animacji
    rouletteStrip.innerHTML = '';
    const totalItemsInStrip = 70;
    const winningIndex = 55; // Wygrywający item będzie na 55 pozycji

    for (let i = 0; i < totalItemsInStrip; i++) {
        // Zwykły losowy przedmiot dla zapychacza lub wygrany na pozycji 55
        let displayItem = (i === winningIndex) ? wonItem : currentCase.items[Math.floor(Math.random() * currentCase.items.length)];
        
        rouletteStrip.innerHTML += `
            <div class="roulette-item" style="border-bottom-color: ${displayItem.rarity}">
                <img src="${displayItem.img}">
                <span>${displayItem.name}</span>
            </div>
        `;
    }

    // Wymuszamy na przeglądarce narysowanie elementów bez animacji
    rouletteStrip.style.transition = 'none';
    rouletteStrip.style.transform = 'translateX(0)';
    rouletteStrip.offsetHeight; // trigger reflow

    // Szerokość pojedynczego elementu = 150px
    // Zatrzymujemy się na wygranym indexie (55), przesunięte o połowę ekranu żeby był na środku
    // Dodajemy mały randomowy offset, żeby nie stawało idealnie w tym samym pikselu
    const itemWidth = 150;
    const containerWidth = document.querySelector('.roulette-container').offsetWidth;
    const randomOffset = Math.floor(Math.random() * 100) - 50; // -50 do 50px
    const stopPosition = (winningIndex * itemWidth) - (containerWidth / 2) + (itemWidth / 2) + randomOffset;

    // Odpalamy animację
    rouletteStrip.style.transition = 'transform 6s cubic-bezier(0.15, 0.05, 0.1, 1)';
    rouletteStrip.style.transform = `translateX(-${stopPosition}px)`;

    // Po 6.5 sekundach (gdy animacja się skończy)
    setTimeout(() => {
        isSpinning = false;
        btn.disabled = false;
        
        // Dodaj wygraną do ekwipunku z unikalnym ID
        inventory.push({ ...wonItem, uniqueId: Date.now() + Math.random() });
        
        // Dodaj wartość do balansu z lekkim opóźnieniem
        setTimeout(() => alert(`Wylosowałeś: ${wonItem.name} (${wonItem.price.toFixed(2)} zł)`), 200);
        
    }, 6500);
}

// LOGIKA EKWIPUNKU I SPRZEDAŻY
function renderInventory() {
    inventoryGrid.innerHTML = '';
    
    // Liczenie łącznej wartości
    const total = inventory.reduce((sum, item) => sum + item.price, 0);
    totalValueEl.innerText = total.toFixed(2) + ' zł';

    // Jeśli pusto
    if(inventory.length === 0) {
        inventoryGrid.innerHTML = '<p style="color: #94a3b8; grid-column: 1/-1; text-align: center;">Twój ekwipunek jest pusty.</p>';
        return;
    }

    // Renderowanie z odwróconą kolejnością (najnowsze u góry)
    [...inventory].reverse().forEach(item => {
        const card = document.createElement('div');
        card.className = 'item-card';
        card.style.borderBottomColor = item.rarity;
        card.innerHTML = `
            <img src="${item.img}" class="skin-img">
            <h4>${item.name}</h4>
            <p style="color: #22c55e;">${item.price.toFixed(2)} zł</p>
            <button class="sell-btn" onclick="sellItem('${item.uniqueId}', ${item.price})">Sprzedaj</button>
        `;
        inventoryGrid.appendChild(card);
    });
}

// Sprzedaż pojedyncza
window.sellItem = function(uniqueId, price) {
    // Usuń z tablicy
    inventory = inventory.filter(item => item.uniqueId !== uniqueId);
    // Dodaj kasę
    balance += price;
    updateBalance();
    // Odśwież widok
    renderInventory();
}

// Sprzedaż wszystkich
window.sellAll = function() {
    if (inventory.length === 0) return;
    
    const total = inventory.reduce((sum, item) => sum + item.price, 0);
    balance += total;
    inventory = [];
    
    updateBalance();
    renderInventory();
    alert(`Sprzedano wszystko za ${total.toFixed(2)} zł!`);
}

// Start aplikacji
init();
