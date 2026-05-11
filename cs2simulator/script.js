let balance = 1000.00;
let inventory = [];
let currentCase = null;
let isSpinning = false;
let openQuantity = 1;

// Funkcja generująca stylowe grafiki zastępcze, skoro omijamy Steam
const generateStyleImage = (text, hexColor) => {
    // Usunięcie # z koloru
    const color = hexColor.replace('#', '');
    return `https://placehold.co/200x150/0f172a/${color}?text=${encodeURIComponent(text)}&font=Montserrat`;
};

// BAZA DANYCH
const casesData = [
    {
        id: 'neon',
        name: 'Neon Strike Case',
        price: 15.00,
        img: generateStyleImage('NEON CASE', '#00f0ff'),
        items: [
            { name: 'Cyberpunk', weapon: 'Karambit', price: 5500.00, chance: 0.260, rarity: '#ffd700', wear: 'FN', wearColor: '#eab308', img: generateStyleImage('Karambit', '#ffd700') },
            { name: 'Laser', weapon: 'AK-47', price: 250.00, chance: 0.640, rarity: '#eb4b4b', wear: 'MW', wearColor: '#3b82f6', img: generateStyleImage('AK-47', '#eb4b4b') },
            { name: 'Overdrive', weapon: 'M4A4', price: 180.00, chance: 0.640, rarity: '#eb4b4b', wear: 'FT', wearColor: '#eab308', img: generateStyleImage('M4A4', '#eb4b4b') },
            { name: 'Synthwave', weapon: 'AWP', price: 75.00, chance: 3.200, rarity: '#d32ce6', wear: 'FT', wearColor: '#eab308', img: generateStyleImage('AWP', '#d32ce6') },
            { name: 'Glitch', weapon: 'Glock-18', price: 30.00, chance: 3.200, rarity: '#d32ce6', wear: 'BS', wearColor: '#ef4444', img: generateStyleImage('Glock', '#d32ce6') },
            { name: 'Neon Rider', weapon: 'MAC-10', price: 12.00, chance: 15.980, rarity: '#8847ff', wear: 'FT', wearColor: '#eab308', img: generateStyleImage('MAC-10', '#8847ff') },
            { name: 'Matrix', weapon: 'USP-S', price: 8.50, chance: 15.980, rarity: '#8847ff', wear: 'MW', wearColor: '#3b82f6', img: generateStyleImage('USP-S', '#8847ff') },
            { name: 'Circuit', weapon: 'P250', price: 1.50, chance: 60.100, rarity: '#4b69ff', wear: 'FT', wearColor: '#eab308', img: generateStyleImage('P250', '#4b69ff') },
            { name: 'Byte', weapon: 'MP9', price: 1.10, chance: 60.100, rarity: '#4b69ff', wear: 'FT', wearColor: '#eab308', img: generateStyleImage('MP9', '#4b69ff') }
        ]
    },
    {
        id: 'dark',
        name: 'Dark Matter Case',
        price: 12.00,
        img: generateStyleImage('DARK CASE', '#8a2be2'),
        items: [
            { name: 'Void', weapon: 'Butterfly', price: 8000.00, chance: 0.260, rarity: '#ffd700', wear: 'FN', wearColor: '#eab308', img: generateStyleImage('Butterfly', '#ffd700') },
            { name: 'Abyss', weapon: 'Desert Eagle', price: 150.00, chance: 0.640, rarity: '#eb4b4b', wear: 'FN', wearColor: '#22c55e', img: generateStyleImage('Deagle', '#eb4b4b') },
            { name: 'Phantom', weapon: 'M4A1-S', price: 55.00, chance: 3.200, rarity: '#d32ce6', wear: 'FT', wearColor: '#eab308', img: generateStyleImage('M4A1-S', '#d32ce6') },
            { name: 'Shadow', weapon: 'CZ75', price: 8.00, chance: 15.980, rarity: '#8847ff', wear: 'MW', wearColor: '#3b82f6', img: generateStyleImage('CZ75', '#8847ff') },
            { name: 'Dust', weapon: 'Nova', price: 0.80, chance: 79.920, rarity: '#4b69ff', wear: 'BS', wearColor: '#ef4444', img: generateStyleImage('Nova', '#4b69ff') }
        ]
    }
];

// FUNKCJA: Płynne odliczanie pieniędzy
function animateValue(obj, start, end, duration) {
    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        // Easing wychodzący (zwalnia pod koniec)
        const easeOut = 1 - Math.pow(1 - progress, 3);
        const currentVal = start + (end - start) * easeOut;
        obj.innerHTML = currentVal.toFixed(2);
        if (progress < 1) {
            window.requestAnimationFrame(step);
        } else {
            obj.innerHTML = end.toFixed(2); // Upewnienie się, że kończy idealnie
        }
    };
    window.requestAnimationFrame(step);
}

let lastBalance = balance;
function updateBalanceDisplay() {
    const balanceEl = document.getElementById('balance');
    animateValue(balanceEl, lastBalance, balance, 800);
    lastBalance = balance;
}

function switchTab(tabId) {
    if (isSpinning) return;
    document.querySelectorAll('.view').forEach(view => {
        view.classList.remove('active');
        // Reset animacji żeby działały po każdym wejściu
        const animatedElements = view.querySelectorAll('.fade-in, .stagger-animate');
        animatedElements.forEach(el => {
            el.style.animation = 'none';
            el.offsetHeight; /* trigger reflow */
            el.style.animation = null; 
        });
    });
    document.getElementById(`view-${tabId}`).classList.add('active');
    if(tabId === 'inventory') renderInventory();
}

function init() {
    updateBalanceDisplay();
    const casesGrid = document.getElementById('casesGrid');
    casesGrid.innerHTML = '';
    
    casesData.forEach(c => {
        const card = document.createElement('div');
        card.className = 'case-card';
        card.onclick = () => setupCaseOpening(c);
        card.innerHTML = `
            <img src="${c.img}" class="case-img">
            <h3>${c.name}</h3>
            <p>${c.price.toFixed(2)} zł</p>
        `;
        casesGrid.appendChild(card);
    });
}

window.setQuantity = function(q, btnElement) {
    if (isSpinning) return;
    openQuantity = q;
    
    document.querySelectorAll('.multi-open button').forEach(b => b.classList.remove('active'));
    btnElement.classList.add('active');
    document.getElementById('openingCasePriceBtn').innerText = (currentCase.price * openQuantity).toFixed(2);
}

function setupCaseOpening(caseObj) {
    currentCase = caseObj;
    setQuantity(1, document.querySelector('.multi-open button')); 

    document.getElementById('openingCaseName').innerText = `💠 ${caseObj.name}`;
    document.getElementById('openingCasePriceStr').innerText = `${caseObj.price.toFixed(2)}zł`;
    
    document.getElementById('openCaseBtn').onclick = () => spinRoulette();
    
    const contentsGrid = document.getElementById('caseContentsGrid');
    contentsGrid.innerHTML = '';
    caseObj.items.forEach(item => {
        contentsGrid.innerHTML += `
            <div class="content-card" style="border-top-color: ${item.rarity}; box-shadow: 0 5px 15px ${item.rarity}20;">
                <div class="badge-wear" style="background: ${item.wearColor}">${item.wear}</div>
                <div class="badge-chance">${item.chance.toFixed(3)}%</div>
                <img src="${item.img}" class="content-img">
                <div class="content-info">
                    <p class="content-name">${item.name}</p>
                    <p class="content-weapon">${item.weapon}</p>
                    <div class="content-price">${item.price.toFixed(2)}zł</div>
                </div>
            </div>
        `;
    });

    document.getElementById('rouletteStrip').style.display = 'flex';
    document.getElementById('rouletteSelector').style.display = 'block';
    document.getElementById('fastOpenResults').style.display = 'none';
    document.getElementById('rouletteStrip').style.transition = 'none';
    document.getElementById('rouletteStrip').style.transform = 'translateX(0)';
    document.getElementById('rouletteStrip').innerHTML = ''; 

    switchTab('opening');
}

function getRolledItem(items) {
    const rand = Math.random() * 100;
    let cumulative = 0;
    for (let item of items) {
        cumulative += item.chance;
        if (rand <= cumulative) return item;
    }
    return items[items.length - 1]; 
}

function generateSafeId() {
    return 'item_' + Date.now().toString() + '_' + Math.random().toString(36).substring(2, 9);
}

function showResultModal(wonItems, totalCost) {
    const modal = document.getElementById('resultModal');
    const itemsContainer = document.getElementById('modalItems');
    const summary = document.getElementById('modalSummary');

    itemsContainer.innerHTML = '';
    let totalValue = 0;

    wonItems.forEach((item, index) => {
        totalValue += item.price;
        // Dodany delay (animacja pojawiania się po kolei)
        itemsContainer.innerHTML += `
            <div class="modal-item" style="border-bottom-color: ${item.rarity}; animation-delay: ${index * 0.1}s">
                <img src="${item.img}">
                <p>${item.weapon}</p>
                <p style="color: #94a3b8; font-size: 11px; margin: 0 0 5px 0;">${item.name}</p>
                <span>${item.price.toFixed(2)} zł</span>
            </div>
        `;
    });

    const profit = totalValue - totalCost;
    let profitText = '';
    let profitColor = '';

    if (profit > 0) {
        profitText = `JESTEŚ NA PLUS +${profit.toFixed(2)} zł! 🚀`;
        profitColor = 'var(--accent-green)'; 
    } else if (profit < 0) {
        profitText = `STRATA ${Math.abs(profit).toFixed(2)} zł. 📉`;
        profitColor = 'var(--accent-red)'; 
    } else {
        profitText = `WYSZEDŁEŚ NA ZERO. ⚖️`;
        profitColor = 'var(--text-muted)'; 
    }

    summary.innerHTML = `
        <p style="color: var(--text-muted)">Wydano: <b style="color: var(--accent-red)">${totalCost.toFixed(2)} zł</b></p>
        <p style="color: var(--text-muted)">Zdobyto: <b style="color: var(--accent-green)">${totalValue.toFixed(2)} zł</b></p>
        <div style="margin-top: 15px; padding-top: 15px; border-top: 1px solid rgba(255,255,255,0.1);">
            <p style="color: ${profitColor}; font-size: 20px; font-weight: bold; font-family: 'Rajdhani', sans-serif;">${profitText}</p>
        </div>
    `;

    modal.classList.add('active');
}

window.closeModal = function() {
    document.getElementById('resultModal').classList.remove('active');
}

function spinRoulette() {
    const totalCost = currentCase.price * openQuantity;

    if (balance < totalCost) {
        alert("Brak wystarczających środków!");
        return;
    }
    
    balance -= totalCost;
    updateBalanceDisplay();
    
    isSpinning = true;
    const btn = document.getElementById('openCaseBtn');
    btn.disabled = true;
    btn.innerHTML = 'LOSOWANIE...';

    if (openQuantity === 1) {
        document.getElementById('fastOpenResults').style.display = 'none';
        document.getElementById('rouletteStrip').style.display = 'flex';
        document.getElementById('rouletteSelector').style.display = 'block';

        const wonItem = getRolledItem(currentCase.items);
        const rouletteStrip = document.getElementById('rouletteStrip');
        rouletteStrip.innerHTML = '';
        
        const totalItemsInStrip = 70;
        const winningIndex = 55;

        for (let i = 0; i < totalItemsInStrip; i++) {
            let displayItem = (i === winningIndex) ? wonItem : currentCase.items[Math.floor(Math.random() * currentCase.items.length)];
            rouletteStrip.innerHTML += `
                <div class="roulette-item" style="border-bottom-color: ${displayItem.rarity}">
                    <img src="${displayItem.img}">
                </div>
            `;
        }

        rouletteStrip.style.transition = 'none';
        rouletteStrip.style.transform = 'translateX(0)';
        rouletteStrip.offsetHeight; 

        const itemWidth = 160; // 150px szerokosci + margin
        const containerWidth = document.querySelector('.roulette-window').offsetWidth;
        const randomOffset = Math.floor(Math.random() * 100) - 50; 
        const stopPosition = (winningIndex * itemWidth) - (containerWidth / 2) + (itemWidth / 2) + randomOffset;

        rouletteStrip.style.transition = 'transform 6s cubic-bezier(0.1, 0, 0.1, 1)'; // Bardzo płynne zwalnianie
        rouletteStrip.style.transform = `translateX(-${stopPosition}px)`;

        setTimeout(() => {
            isSpinning = false;
            btn.disabled = false;
            btn.innerHTML = `Otwórz za <span id="openingCasePriceBtn">${(currentCase.price * openQuantity).toFixed(2)}</span>zł`;
            inventory.push({ ...wonItem, uniqueId: generateSafeId() });
            showResultModal([wonItem], totalCost);
        }, 6500);

    } 
    else {
        document.getElementById('rouletteStrip').style.display = 'none';
        document.getElementById('rouletteSelector').style.display = 'none';
        const fastContainer = document.getElementById('fastOpenResults');
        fastContainer.style.display = 'flex';
        fastContainer.innerHTML = '';

        let wonItems = [];
        
        for(let i=0; i < openQuantity; i++) {
            const wonItem = getRolledItem(currentCase.items);
            wonItems.push(wonItem);
            inventory.push({ ...wonItem, uniqueId: generateSafeId() });
        }

        wonItems.forEach((item, index) => {
            setTimeout(() => {
                fastContainer.innerHTML += `
                    <div class="fast-open-item" style="border-bottom-color: ${item.rarity}; box-shadow: 0 0 20px ${item.rarity}40;">
                        <img src="${item.img}">
                    </div>
                `;
            }, index * 120); 
        });

        setTimeout(() => {
            isSpinning = false;
            btn.disabled = false;
            btn.innerHTML = `Otwórz za <span id="openingCasePriceBtn">${(currentCase.price * openQuantity).toFixed(2)}</span>zł`;
            showResultModal(wonItems, totalCost);
        }, wonItems.length * 120 + 800);
    }
}

function renderInventory() {
    const inventoryGrid = document.getElementById('inventoryGrid');
    inventoryGrid.innerHTML = '';
    
    const total = inventory.reduce((sum, item) => sum + item.price, 0);
    // Animacja przy zmianie total value
    const totalValEl = document.getElementById('totalValue');
    animateValue(totalValEl, parseFloat(totalValEl.innerText) || 0, total, 800);
    totalValEl.innerText = total.toFixed(2) + ' zł';

    if(inventory.length === 0) {
        inventoryGrid.innerHTML = '<p style="color: var(--text-muted); grid-column: 1/-1; text-align: center; margin-top: 40px; font-size: 18px;">Twój ekwipunek jest pusty. Otwórz skrzynkę, aby coś zdobyć!</p>';
        return;
    }

    [...inventory].reverse().forEach((item, index) => {
        const card = document.createElement('div');
        card.className = 'content-card';
        card.style.borderTopColor = item.rarity;
        card.style.boxShadow = `0 5px 15px ${item.rarity}20`;
        // Dodanie opóźnienia do animacji dla każdego elementu
        card.style.animation = `slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) ${index * 0.05}s backwards`;
        
        card.innerHTML = `
            <div class="badge-wear" style="background: ${item.wearColor}">${item.wear}</div>
            <img src="${item.img}" class="content-img">
            <div class="content-info">
                <p class="content-name">${item.name}</p>
                <p class="content-weapon">${item.weapon}</p>
                <div class="content-price" style="margin-bottom: 15px;">${item.price.toFixed(2)}zł</div>
                <button class="sell-btn" onclick="sellItem('${item.uniqueId}', ${item.price})">SPRZEDAJ</button>
            </div>
        `;
        inventoryGrid.appendChild(card);
    });
}

window.sellItem = function(uniqueId, price) {
    inventory = inventory.filter(item => item.uniqueId !== uniqueId);
    balance += price;
    updateBalanceDisplay();
    renderInventory();
}

window.sellAll = function() {
    if (inventory.length === 0) return;
    const total = inventory.reduce((sum, item) => sum + item.price, 0);
    balance += total;
    inventory = [];
    updateBalanceDisplay();
    renderInventory();
}

document.addEventListener('DOMContentLoaded', init);

// --- ZACHOWAJ BAZĘ DANYCH (casesData), PŁYNNE ODLICZANIE (animateValue) I INNE FUNKCJE Z POPRZEDNIEJ WERSJI ---

// === SEKCJA UPGRADER (DODAJ TO NA KOŃCU PLIKU) ===

let upInput = null;
let upTarget = null;
let upBalance = 0;
const HOUSE_EDGE = 0.05; // 5% prowizji serwera - Matematyka kasynowa

// Ekstrakcja wszystkich dostępnych skinów z bazy jako asortyment "Sklepu"
const siteStoreItems = [];
casesData.forEach(caseObj => {
    caseObj.items.forEach(item => {
        // Unikamy duplikatów w sklepie
        if(!siteStoreItems.find(i => i.name === item.name && i.weapon === item.weapon)) {
            siteStoreItems.push(item);
        }
    });
});
// Sortowanie sklepu od najdroższego
siteStoreItems.sort((a, b) => b.price - a.price);

// Przebudowa switchTab aby renderował upgrader przy wejściu
const originalSwitchTab = switchTab; // Zachowujemy oryginalną funkcję
switchTab = function(tabId) {
    originalSwitchTab(tabId);
    if(tabId === 'upgrader') {
        renderUpgraderInvs();
        updateUpgrader(); // Odśwież UI
    }
}

function renderUpgraderInvs() {
    const uInv = document.getElementById('up-user-inv');
    const sInv = document.getElementById('up-store-inv');
    uInv.innerHTML = ''; sInv.innerHTML = '';

    // Renderowanie ekwipunku gracza w lewej kolumnie
    if(inventory.length === 0) {
        uInv.innerHTML = '<p class="text-muted" style="grid-column: 1/-1; text-align: center;">Brak przedmiotów. Otwórz skrzynki!</p>';
    } else {
        [...inventory].reverse().forEach(item => {
            const card = document.createElement('div');
            card.className = 'content-card';
            card.style.borderTopColor = item.rarity;
            card.innerHTML = `<img src="${item.img}"> <div class="content-info"><p class="content-name">${item.weapon}</p><div class="content-price">${item.price.toFixed(2)}zł</div></div>`;
            card.onclick = () => { 
                upInput = item; 
                updateUpgrader(); 
                window.scrollTo({ top: 0, behavior: 'smooth' }); // Wróć na górę po kliknięciu
            };
            uInv.appendChild(card);
        });
    }

    // Renderowanie sklepu (celów) w prawej kolumnie
    siteStoreItems.forEach(item => {
        const card = document.createElement('div');
        card.className = 'content-card';
        card.style.borderTopColor = item.rarity;
        card.innerHTML = `<img src="${item.img}"> <div class="content-info"><p class="content-name">${item.weapon}</p><div class="content-price">${item.price.toFixed(2)}zł</div></div>`;
        card.onclick = () => { 
            upTarget = item; 
            updateUpgrader();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        };
        sInv.appendChild(card);
    });
}

// Główna funkcja aktualizująca UI Upgradera
window.updateUpgrader = function() {
    const slider = document.getElementById('up-slider');
    upBalance = parseFloat(slider.value) || 0;
    document.getElementById('up-slider-val').innerText = upBalance;

    // Aktualizacja ikon
    const inSlot = document.getElementById('up-input-slot');
    if(upInput) {
        inSlot.innerHTML = `<img src="${upInput.img}">`;
        inSlot.style.borderColor = upInput.rarity;
    } else {
        inSlot.innerHTML = '+';
        inSlot.style.borderColor = 'var(--glass-border)';
    }

    const outSlot = document.getElementById('up-target-slot');
    if(upTarget) {
        outSlot.innerHTML = `<img src="${upTarget.img}">`;
        outSlot.style.borderColor = upTarget.rarity;
    } else {
        outSlot.innerHTML = '+';
        outSlot.style.borderColor = 'var(--glass-border)';
    }

    const totalInput = (upInput?.price || 0) + upBalance;
    const targetPrice = upTarget?.price || 0;

    document.getElementById('up-input-price').innerText = totalInput.toFixed(2) + ' zł';
    document.getElementById('up-target-price').innerText = targetPrice.toFixed(2) + ' zł';

    // OBLICZANIE SZANSY (Matematyka backendowa przeniesiona na front)
    let chance = 0;
    if(targetPrice > 0 && totalInput > 0) {
        chance = (totalInput / targetPrice) * (1 - HOUSE_EDGE) * 100;
    }
    
    // Zabezpieczenie UX: Nie pozwalamy na szansę większą niż 80%, to psuje ekonomię gier hazardowych
    chance = Math.min(Math.max(chance, 0), 80); 

    // Rysowanie koła ruletki przy użyciu conic-gradient
    const wheel = document.getElementById('up-wheel');
    document.getElementById('up-chance-text').innerText = chance.toFixed(2) + '%';
    document.getElementById('up-ratios').innerText = `Wkład: ${totalInput.toFixed(2)} / Cel: ${targetPrice.toFixed(2)}`;

    // Reset animacji koła
    wheel.style.transition = 'none';
    wheel.style.transform = 'rotate(0deg)';

    // Jeśli jest jakakolwiek szansa, wypełnij koło na zielono od 0deg do X%
    if(chance > 0) {
        wheel.style.background = `conic-gradient(var(--accent-green) 0% ${chance}%, rgba(255,255,255,0.05) ${chance}% 100%)`;
        wheel.style.boxShadow = `0 0 40px rgba(0, 255, 136, 0.3)`;
    } else {
        wheel.style.background = `conic-gradient(rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.05) 100%)`;
        wheel.style.boxShadow = `0 0 40px rgba(0, 0, 0, 0.5)`;
    }
}

// Funkcja mnożników - Automatycznie szuka skina o wartości X razy wyższej
window.autoPickTarget = function(multiplier) {
    const totalInput = (upInput?.price || 0) + upBalance;
    if(totalInput === 0) return alert('Najpierw wybierz swój wkład lub dodaj dopłatę z salda!');
    
    const desiredTargetValue = totalInput * multiplier;
    
    // Znajdź pierwszy przedmiot, którego cena jest równa lub większa wymaganemu targetowi
    // Omijamy przedmioty zbyt tanie
    const validItems = siteStoreItems.filter(i => i.price >= desiredTargetValue).sort((a,b) => a.price - b.price);
    
    if(validItems.length > 0) {
        upTarget = validItems[0]; // Wybierz najbliższy wymogom
        updateUpgrader();
    } else {
        alert(`Brak przedmiotu w sklepie o wartości minimum ${desiredTargetValue.toFixed(2)} zł!`);
    }
}

// GŁÓWNA LOGIKA LOSOWANIA I ANIMACJI (SYMULACJA PROVABLY FAIR)
window.spinUpgrader = function() {
    if(!upInput && upBalance === 0) return alert('Musisz zaoferować jakiś wkład!');
    if(!upTarget) return alert('Wybierz cel ulepszenia ze sklepu po prawej stronie!');
    
    const totalInput = (upInput?.price || 0) + upBalance;
    const targetPrice = upTarget.price;
    
    if(balance < upBalance) return alert('Nie masz wystarczających środków na dopłatę!');

    // Dokładne wyliczenie szansy (serwer)
    let chance = (totalInput / targetPrice) * (1 - HOUSE_EDGE) * 100;
    chance = Math.min(Math.max(chance, 0), 80);

    if(chance <= 0) return alert('Szansa jest zbyt mała. Dodaj więcej wkładu!');

    // POBRANIE WKŁADU OD GRACZA
    balance -= upBalance;
    if(upInput) {
        inventory = inventory.filter(i => i.uniqueId !== upInput.uniqueId); // Usunięcie użytego skina
    }
    updateBalanceDisplay();
    
    isSpinning = true;
    const btn = document.getElementById('up-btn');
    btn.disabled = true;
    btn.innerText = "KRĘCENIE...";

    // 1. GENEROWANIE WYNIKU (RNG)
    const roll = Math.random() * 100; 
    const isWin = roll <= chance;

    // 2. WYLICZENIE KĄTA DLA ANIMACJI
    const winDegrees = (chance / 100) * 360; // Np. 25% szansy = 90 stopni zielonego pola
    let stopDegree = 0;
    
    if(isWin) {
        // Zatrzymujemy się głęboko w ZIELONEJ STREFIE (od 2 do winDegrees-2)
        stopDegree = 2 + Math.random() * (Math.max(1, winDegrees - 4));
    } else {
        // Zatrzymujemy się głęboko w SZAREJ STREFIE (poza zielonym polem)
        stopDegree = winDegrees + 2 + Math.random() * (358 - winDegrees - 4);
    }

    // Dodajemy 6 pełnych rotacji dla dramaturgii (2160 stopni).
    // Gradient zaczyna od góry. Aby zatrzymać w odpowiednim miejscu kręcąc DIV-em, odejmujemy stopDegree od 360.
    const spinDeg = 2160 + (360 - stopDegree); 

    const wheel = document.getElementById('up-wheel');
    // Ustawiamy niesamowicie płynną fizykę zwalniania (cubic-bezier)
    wheel.style.transition = 'transform 7s cubic-bezier(0.1, 0, 0.05, 1)';
    wheel.style.transform = `rotate(${spinDeg}deg)`;

    // 3. ROZSTRZYGNIĘCIE PO ZAKOŃCZENIU ANIMACJI (7 SEKUND)
    setTimeout(() => {
        const modal = document.getElementById('resultModal');
        const modalTitle = document.getElementById('modalTitle');
        const itemsContainer = document.getElementById('modalItems');
        const summary = document.getElementById('modalSummary');
        
        itemsContainer.innerHTML = `
            <div class="modal-item" style="border-bottom-color: ${upTarget.rarity}">
                <img src="${upTarget.img}">
                <p>${upTarget.weapon}</p>
                <p style="color: #94a3b8; font-size: 11px;">${upTarget.name}</p>
            </div>
        `;

        if(isWin) {
            inventory.push({...upTarget, uniqueId: generateSafeId()});
            modalTitle.innerText = "NIESAMOWITE!";
            modalTitle.style.color = "var(--accent-green)";
            summary.innerHTML = `
                <p style="color: var(--text-muted)">Zaryzykowałeś: <b style="color: white">${totalInput.toFixed(2)} zł</b></p>
                <p style="color: var(--text-muted)">Szansa: <b style="color: white">${chance.toFixed(2)}%</b></p>
                <p style="color: var(--accent-green); font-size: 22px; font-weight: bold; margin-top:15px;">Ulepszenie powiodło się!</p>
            `;
        } else {
            modalTitle.innerText = "PRZEGRANA...";
            modalTitle.style.color = "var(--accent-red)";
            // Czerwony cień jako feedback przegranej
            itemsContainer.innerHTML = itemsContainer.innerHTML.replace('style="', 'style="box-shadow: inset 0 0 30px rgba(255,0,0,0.5); filter: grayscale(100%); ');
            summary.innerHTML = `
                <p style="color: var(--text-muted)">Zaryzykowałeś: <b style="color: white">${totalInput.toFixed(2)} zł</b></p>
                <p style="color: var(--text-muted)">Szansa: <b style="color: white">${chance.toFixed(2)}%</b></p>
                <p style="color: var(--accent-red); font-size: 22px; font-weight: bold; margin-top:15px;">Twój przedmiot przepadł.</p>
            `;
        }
        
        modal.classList.add('active');
        
        // Reset stanu po losowaniu
        isSpinning = false;
        btn.disabled = false;
        btn.innerText = "ULEPSZ SKIN";
        upInput = null;
        upTarget = null;
        document.getElementById('up-slider').value = 0;
        updateUpgrader();
        renderUpgraderInvs();
        renderInventory();
        
    }, 7500); // 7.5s (0.5s przerwy na złapanie tchu przez usera po zatrzymaniu)
}
