let balance = 1000.00;
let inventory = [];
let currentCase = null;
let isSpinning = false;
let openQuantity = 1;

// BAZA DANYCH - UŻYWAMY SELF-HOSTOWANYCH PLIKÓW Z FOLDERU /IMG
const casesData = [
    {
        id: 'revolution',
        name: 'Revolution Case',
        price: 12.50,
        img: 'img/case_revolution.png', // Relatywna ścieżka do Twojego folderu
        items: [
            // Czerwone
            { name: 'Head Shot', weapon: 'AK-47', price: 180.00, chance: 0.640, rarity: '#eb4b4b', wear: 'FT', wearColor: '#eab308', img: 'img/ak47_headshot.png' },
            { name: 'Temukau', weapon: 'M4A4', price: 160.00, chance: 0.640, rarity: '#eb4b4b', wear: 'FT', wearColor: '#eab308', img: 'img/m4a4_temukau.png' },
            // Różowe
            { name: 'Duality', weapon: 'AWP', price: 60.00, chance: 3.200, rarity: '#d32ce6', wear: 'FT', wearColor: '#eab308', img: 'img/awp_duality.png' },
            // Niebieskie
            { name: 'Featherweight', weapon: 'MP9', price: 1.20, chance: 95.52, rarity: '#4b69ff', wear: 'FT', wearColor: '#eab308', img: 'img/mp9_featherweight.png' }
        ]
    }
];

// Cała reszta logiki pozostaje bez zmian

function switchTab(tabId) {
    if (isSpinning) return;
    document.querySelectorAll('.view').forEach(view => view.classList.remove('active'));
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

    document.getElementById('openingCaseName').innerText = `👑 ${caseObj.name}`;
    document.getElementById('openingCasePriceStr').innerText = `${caseObj.price.toFixed(2)}zł`;
    
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

    wonItems.forEach(item => {
        totalValue += item.price;
        itemsContainer.innerHTML += `
            <div class="modal-item" style="border-bottom-color: ${item.rarity}">
                <img src="${item.img}">
                <p>${item.weapon} | ${item.name}</p>
                <span>${item.price.toFixed(2)} zł</span>
            </div>
        `;
    });

    const profit = totalValue - totalCost;
    let profitText = '';
    let profitColor = '';

    if (profit > 0) {
        profitText = `Jesteś na plus ${profit.toFixed(2)} zł! 🤑`;
        profitColor = '#22c55e'; 
    } else if (profit < 0) {
        profitText = `Jesteś stratny ${Math.abs(profit).toFixed(2)} zł. 📉`;
        profitColor = '#ef4444'; 
    } else {
        profitText = `Wyszedłeś na zero. ⚖️`;
        profitColor = '#94a3b8'; 
    }

    summary.innerHTML = `
        <p>Wydano na klucze/skrzynki: <b style="color: #ef4444">${totalCost.toFixed(2)} zł</b></p>
        <p>Wartość zdobytych przedmiotów: <b style="color: #22c55e">${totalValue.toFixed(2)} zł</b></p>
        <p style="color: ${profitColor}; font-size: 18px; font-weight: bold; margin-top: 15px;">${profitText}</p>
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
    updateBalance();
    
    isSpinning = true;
    const btn = document.getElementById('openCaseBtn');
    btn.disabled = true;

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

        const itemWidth = 150; 
        const containerWidth = document.querySelector('.roulette-window').offsetWidth;
        const randomOffset = Math.floor(Math.random() * 120) - 60; 
        const stopPosition = (winningIndex * itemWidth) - (containerWidth / 2) + (itemWidth / 2) + randomOffset;

        rouletteStrip.style.transition = 'transform 6s cubic-bezier(0.15, 0.05, 0.1, 1)';
        rouletteStrip.style.transform = `translateX(-${stopPosition}px)`;

        setTimeout(() => {
            isSpinning = false;
            btn.disabled = false;
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
                    <div class="fast-open-item" style="border-bottom-color: ${item.rarity}">
                        <img src="${item.img}">
                    </div>
                `;
            }, index * 100); 
        });

        setTimeout(() => {
            isSpinning = false;
            btn.disabled = false;
            showResultModal(wonItems, totalCost);
        }, wonItems.length * 100 + 500);
    }
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

document.addEventListener('DOMContentLoaded', init);
