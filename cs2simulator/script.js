let balance = 1000.00;
let inventory = [];
let currentCase = null;
let isSpinning = false;

// BAZA SKRZYNEK
const casesData = [
    {
        id: 'nature',
        name: 'Nature Case',
        price: 2.30,
        img: 'https://placehold.co/150x150/1e293b/06b6d4?text=Nature\nCase',
        items: [
            { name: 'Green Energy', weapon: 'AWP', price: 73.72, chance: 0.100, rarity: '#eb4b4b', wear: 'WW', wearColor: '#f59e0b', img: 'https://placehold.co/150x100/1e293b/fff?text=AWP' },
            { name: 'Ice Coaled', weapon: 'AK-47', price: 29.05, chance: 1.000, rarity: '#d32ce6', wear: 'BS', wearColor: '#ef4444', img: 'https://placehold.co/150x100/1e293b/fff?text=AK-47' },
            { name: 'Chemical Green', weapon: 'PP-Bizon', price: 20.52, chance: 1.000, rarity: '#d32ce6', wear: 'BS', wearColor: '#ef4444', img: 'https://placehold.co/150x100/1e293b/fff?text=Bizon' },
            { name: 'Nuclear Garden', weapon: 'Glock-18', price: 10.77, chance: 5.000, rarity: '#8847ff', wear: 'BS', wearColor: '#ef4444', img: 'https://placehold.co/150x100/1e293b/fff?text=Glock-18' },
            { name: 'Emphorosaur-S', weapon: 'M4A1-S', price: 6.69, chance: 2.000, rarity: '#8847ff', wear: 'MW', wearColor: '#3b82f6', img: 'https://placehold.co/150x100/1e293b/fff?text=M4A1-S' },
            { name: 'Atheris', weapon: 'AWP', price: 2.50, chance: 5.000, rarity: '#4b69ff', wear: 'FN', wearColor: '#22c55e', img: 'https://placehold.co/150x100/1e293b/fff?text=AWP' },
            { name: 'Jungle Slipstream', weapon: 'M4A4', price: 1.10, chance: 85.900, rarity: '#4b69ff', wear: 'FT', wearColor: '#eab308', img: 'https://placehold.co/150x100/1e293b/fff?text=M4A4' }
        ]
    },
    {
        id: 'rain',
        name: 'Rain Case',
        price: 3.10,
        img: 'https://placehold.co/150x150/1e293b/3b82f6?text=Rain\nCase',
        items: [
            { name: 'Water Elemental', weapon: 'Glock-18', price: 25.00, chance: 2.000, rarity: '#d32ce6', wear: 'FN', wearColor: '#22c55e', img: 'https://placehold.co/150x100/1e293b/fff?text=Glock' },
            { name: 'Blue Laminate', weapon: 'AK-47', price: 15.00, chance: 8.000, rarity: '#8847ff', wear: 'MW', wearColor: '#3b82f6', img: 'https://placehold.co/150x100/1e293b/fff?text=AK-47' },
            { name: 'Cyanospatter', weapon: 'CZ75-Auto', price: 2.00, chance: 90.000, rarity: '#4b69ff', wear: 'FT', wearColor: '#eab308', img: 'https://placehold.co/150x100/1e293b/fff?text=CZ75' }
        ]
    }
];

// ZMIANA ZAKŁADEK (Poprawiona, żeby na 100% ukrywała inne strony)
function switchTab(tabId) {
    if (isSpinning) return;
    
    // Ukryj wszystkie sekcje
    document.querySelectorAll('.view').forEach(view => {
        view.classList.remove('active');
    });
    
    // Pokaz wybrana
    document.getElementById(`view-${tabId}`).classList.add('active');
    
    if(tabId === 'inventory') renderInventory();
}

function init() {
    updateBalance();
    const casesGrid = document.getElementById('casesGrid');
    casesGrid.innerHTML = '';
    
    casesData.forEach(c => {
        const card = document.createElement('div');
        card.className = 'case-card';
        card.onclick = () => setupCaseOpening(c);
        card.innerHTML = `
            <img src="${c.img}" class="case-img">
            <h3>${c.name}</h3>
            <p style="color: var(--accent); font-weight: bold;">${c.price.toFixed(2)} zł</p>
        `;
        casesGrid.appendChild(card);
    });
}

function updateBalance() {
    document.getElementById('balance').innerText = balance.toFixed(2);
}

function setupCaseOpening(caseObj) {
    currentCase = caseObj;
    document.getElementById('openingCaseName').innerText = `👑 ${caseObj.name}`;
    document.getElementById('openingCasePriceStr').innerText = `${caseObj.price.toFixed(2)}zł`;
    document.getElementById('openingCasePriceBtn').innerText = caseObj.price.toFixed(2);
    
    document.getElementById('openCaseBtn').onclick = () => spinRoulette();
    
    const contentsGrid = document.getElementById('caseContentsGrid');
    contentsGrid.innerHTML = '';
    caseObj.items.forEach(item => {
        contentsGrid.innerHTML += `
            <div class="content-card" style="border-top-color: ${item.rarity}">
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

    const rouletteStrip = document.getElementById('rouletteStrip');
    rouletteStrip.style.transition = 'none';
    rouletteStrip.style.transform = 'translateX(0)';
    rouletteStrip.innerHTML = ''; 

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
    rouletteStrip.offsetHeight; // trigger reflow

    const itemWidth = 150; 
    const containerWidth = document.querySelector('.roulette-window').offsetWidth;
    const randomOffset = Math.floor(Math.random() * 120) - 60; 
    const stopPosition = (winningIndex * itemWidth) - (containerWidth / 2) + (itemWidth / 2) + randomOffset;

    rouletteStrip.style.transition = 'transform 6s cubic-bezier(0.15, 0.05, 0.1, 1)';
    rouletteStrip.style.transform = `translateX(-${stopPosition}px)`;

    setTimeout(() => {
        isSpinning = false;
        btn.disabled = false;
        inventory.push({ ...wonItem, uniqueId: Date.now() + Math.random() });
    }, 6500);
}

function renderInventory() {
    const inventoryGrid = document.getElementById('inventoryGrid');
    inventoryGrid.innerHTML = '';
    
    const total = inventory.reduce((sum, item) => sum + item.price, 0);
    document.getElementById('totalValue').innerText = total.toFixed(2) + ' zł';

    if(inventory.length === 0) {
        inventoryGrid.innerHTML = '<p style="color: #94a3b8; grid-column: 1/-1; text-align: center; margin-top: 20px;">Twój ekwipunek jest pusty.</p>';
        return;
    }

    [...inventory].reverse().forEach(item => {
        const card = document.createElement('div');
        card.className = 'content-card';
        card.style.borderTopColor = item.rarity;
        card.innerHTML = `
            <div class="badge-wear" style="background: ${item.wearColor}">${item.wear}</div>
            <img src="${item.img}" class="content-img">
            <div class="content-info">
                <p class="content-name">${item.name}</p>
                <p class="content-weapon">${item.weapon}</p>
                <div class="content-price" style="margin-bottom: 10px;">${item.price.toFixed(2)}zł</div>
                <button class="sell-btn" onclick="sellItem('${item.uniqueId}', ${item.price})">Sprzedaj</button>
            </div>
        `;
        inventoryGrid.appendChild(card);
    });
}

window.sellItem = function(uniqueId, price) {
    inventory = inventory.filter(item => item.uniqueId !== uniqueId);
    balance += price;
    updateBalance();
    renderInventory();
}

window.sellAll = function() {
    if (inventory.length === 0) return;
    const total = inventory.reduce((sum, item) => sum + item.price, 0);
    balance += total;
    inventory = [];
    updateBalance();
    renderInventory();
}

// Uruchom stronę startową po załadowaniu
document.addEventListener('DOMContentLoaded', init);
