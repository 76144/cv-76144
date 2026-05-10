let balance = 1000.00;
let inventory = [];
let currentCase = null;
let isSpinning = false;
let openQuantity = 1; // Zmienna do obsługi wielu skrzynek

// BAZA DANYCH Z PRAWDZIWYMI ZDJĘCIAMI ZE STEAM
const casesData = [
    {
        id: 'nature',
        name: 'Nature Case',
        price: 2.30,
        img: 'https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXU5A1PIYQNqhpOSV-fRPasw8rsQEl9Jg9SpIW1Kgx00vHKeWwS74ywwdLcz6-tZuzRzjMF68Ymi7CTrd7xiVG180E_N2zzJYSWIw9pZw/200fx185f', // Zastępcza skrzynka Chroma
        items: [
            { name: 'Atheris', weapon: 'AWP', price: 73.72, chance: 0.100, rarity: '#eb4b4b', wear: 'WW', wearColor: '#f59e0b', img: 'https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpot621FAR17PLfYQJD_9W7m5a0mvLwOq7c2G5SvcYkiLqYrYit2wXnqRVsZ2r3II_AJ1Q8aAnV_ALqk7jsgJHp7pydwGwj5Hce1vM_/200fx185f' },
            { name: 'Ice Coaled', weapon: 'AK-47', price: 29.05, chance: 1.000, rarity: '#d32ce6', wear: 'BS', wearColor: '#ef4444', img: 'https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpot7HxfDhjxszJemkV08y5nY6fqPv9NLPF2DwEuMQn2rnEptz2iVLt-BdkamH2J9OQd1I5aAvZ_1Xok-jn18Xv75-bzSB9-n51rA9aXqc/200fx185f' },
            { name: 'Chemical Green', weapon: 'PP-Bizon', price: 20.52, chance: 1.000, rarity: '#d32ce6', wear: 'BS', wearColor: '#ef4444', img: 'https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpotWPyaA_xrqvOaCdOwN24mZSVqfbnNrfXlwH1N2vUo4K4jDqu-EVkZDumLNTDJgE7YluCrlS-wb261sLpuJnAznIx-z-DyLw9z4Vb/200fx185f' },
            { name: 'Nuclear Garden', weapon: 'Glock-18', price: 10.77, chance: 5.000, rarity: '#8847ff', wear: 'BS', wearColor: '#ef4444', img: 'https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgposbaqKAxf0v73cC9b49-zlZWSqPv9NLPF2DwDsJN12bHHoYij3QK280E_ZmDzJoDGIQA_Zw2F_we2x7_o0MO0uJ_LznA3vyIm-z-DyDC2-6Ld/200fx185f' },
            { name: 'Emphorosaur-S', weapon: 'M4A1-S', price: 6.69, chance: 2.000, rarity: '#8847ff', wear: 'MW', wearColor: '#3b82f6', img: 'https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpou-6kejhjxszJemkV09K_k4iYmfbLP7LWnn8f65Nw2-qSp9im2Fbm-EE-amjxdYSdIFA8Nl6G8wa9krjt15ftupXKyiQ3inMj-z-DyB-yP68q/200fx185f' },
            { name: 'Pit Viper', weapon: 'AWP', price: 6.05, chance: 2.000, rarity: '#8847ff', wear: 'BS', wearColor: '#ef4444', img: 'https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpot621FAR17PB3OQJD_9W7m5a0n_L1JaKfzzgA7MByi-uToY723Fbj-0Y4MmGmItCWcwNqMw2FqVW5wevv15a9vJrAyCEx7HJwtn_D30vgXSEHnS4/200fx185f' },
            { name: 'Jungle Slipstream', weapon: 'M4A4', price: 1.10, chance: 88.900, rarity: '#4b69ff', wear: 'FT', wearColor: '#eab308', img: 'https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpou-6kejhoyszMfjxW09--m5qCnfvxMIfBmlRc7cF4n-SPrtz32wLk-EBsZGH0ddDAdVRrNA6Cq1Hvk-_r0JK4upTN1zI97Q8H1bE_/200fx185f' }
        ]
    }
];

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

// Obsługa przycisków wielokrotnego wyboru (1, 2, 3, 5, 10)
window.setQuantity = function(q, btnElement) {
    if (isSpinning) return;
    openQuantity = q;
    
    // Zmiana kolorów przycisków
    document.querySelectorAll('.multi-open button').forEach(b => b.classList.remove('active'));
    btnElement.classList.add('active');
    
    // Aktualizacja ceny na przycisku
    document.getElementById('openingCasePriceBtn').innerText = (currentCase.price * openQuantity).toFixed(2);
}

function setupCaseOpening(caseObj) {
    currentCase = caseObj;
    
    // Reset ilości do 1 za każdym wejściem
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

    // Reset ruletki
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

// Funkcja generująca super-bezpieczne ID jako czysty tekst (zapobiega bugowi ze sprzedażą)
function generateSafeId() {
    return 'item_' + Date.now().toString() + '_' + Math.random().toString(36).substring(2, 9);
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

    // OTWIERANIE 1 SKRZYNKI (Zwykła animacja)
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
        }, 6500);

    } 
    // HURTOWE OTWIERANIE (Szybki tryb bez paska ruletki)
    else {
        document.getElementById('rouletteStrip').style.display = 'none';
        document.getElementById('rouletteSelector').style.display = 'none';
        const fastContainer = document.getElementById('fastOpenResults');
        fastContainer.style.display = 'flex';
        fastContainer.innerHTML = '';

        let wonItems = [];
        
        // Losowanie
        for(let i=0; i < openQuantity; i++) {
            const wonItem = getRolledItem(currentCase.items);
            wonItems.push(wonItem);
            inventory.push({ ...wonItem, uniqueId: generateSafeId() });
        }

        // Pokazanie z efektem opóźnienia, żeby fajnie "wskakiwały" (popIn)
        wonItems.forEach((item, index) => {
            setTimeout(() => {
                fastContainer.innerHTML += `
                    <div class="fast-open-item" style="border-bottom-color: ${item.rarity}">
                        <img src="${item.img}">
                    </div>
                `;
            }, index * 100); // Każdy item pojawia się o 0.1s później
        });

        // Odblokowanie po tym jak wskoczą wszystkie
        setTimeout(() => {
            isSpinning = false;
            btn.disabled = false;
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

// Funkcja teraz bezpiecznie porównuje i usuwa
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
