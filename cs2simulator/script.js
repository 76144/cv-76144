let balance = 1000.00;
let inventory = [];
let currentCase = null;
let isSpinning = false;
let openQuantity = 1;

// --- UPGRADER STATE (TABLICE) ---
let upInputs = [];
let upTargets = [];
let upBalance = 0;
const HOUSE_EDGE = 0.05; // 5% marża

const generateStyleImage = (text, hexColor) => {
    const color = hexColor.replace('#', '');
    return `https://placehold.co/200x150/0f172a/${color}?text=${encodeURIComponent(text)}&font=Montserrat`;
};

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

const siteStoreItems = [];
casesData.forEach(caseObj => {
    caseObj.items.forEach(item => {
        if(!siteStoreItems.find(i => i.name === item.name && i.weapon === item.weapon)) {
            // Dodajemy sztuczne id dla sklepu, zeby latwiej identyfikowac wiele takich samych przedmiotow
            siteStoreItems.push({...item, storeId: item.name + item.weapon});
        }
    });
});
siteStoreItems.sort((a, b) => b.price - a.price);

function generateSafeId() {
    return 'item_' + Date.now().toString() + '_' + Math.random().toString(36).substring(2, 9);
}

function animateValue(obj, start, end, duration) {
    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        const easeOut = 1 - Math.pow(1 - progress, 3);
        const currentVal = start + (end - start) * easeOut;
        obj.innerHTML = currentVal.toFixed(2);
        if (progress < 1) window.requestAnimationFrame(step);
        else obj.innerHTML = end.toFixed(2);
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
        const animatedElements = view.querySelectorAll('.fade-in, .stagger-animate');
        animatedElements.forEach(el => { el.style.animation = 'none'; el.offsetHeight; el.style.animation = null; });
    });
    document.getElementById(`view-${tabId}`).classList.add('active');
    if(tabId === 'inventory') renderInventory();
    if(tabId === 'upgrader') { renderUpgraderInvs(); updateUpgrader(); }
}

function init() {
    updateBalanceDisplay();
    const casesGrid = document.getElementById('casesGrid');
    casesGrid.innerHTML = '';
    casesData.forEach(c => {
        const card = document.createElement('div');
        card.className = 'case-card';
        card.onclick = () => setupCaseOpening(c);
        card.innerHTML = `<img src="${c.img}" class="case-img"><h3>${c.name}</h3><p>${c.price.toFixed(2)} zł</p>`;
        casesGrid.appendChild(card);
    });
}

// === OTWIERANIE SKRZYNEK ===
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
    
    const contentsGrid = document.getElementById('caseContentsGrid');
    contentsGrid.innerHTML = '';
    caseObj.items.forEach(item => {
        contentsGrid.innerHTML += `
            <div class="content-card" style="border-top-color: ${item.rarity}; box-shadow: 0 5px 15px ${item.rarity}20;">
                <div class="badge-wear" style="background: ${item.wearColor}">${item.wear}</div>
                <div class="badge-chance">${item.chance.toFixed(3)}%</div>
                <img src="${item.img}" class="content-img">
                <div class="content-info"><p class="content-name">${item.name}</p><p class="content-weapon">${item.weapon}</p><div class="content-price">${item.price.toFixed(2)}zł</div></div>
            </div>`;
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
    for (let item of items) { cumulative += item.chance; if (rand <= cumulative) return item; }
    return items[items.length - 1]; 
}

function spinRoulette() {
    const totalCost = currentCase.price * openQuantity;
    if (balance < totalCost) return alert("Brak środków!");
    balance -= totalCost; updateBalanceDisplay();
    isSpinning = true;
    const btn = document.getElementById('openCaseBtn');
    btn.disabled = true; btn.innerHTML = 'LOSOWANIE...';

    if (openQuantity === 1) {
        document.getElementById('fastOpenResults').style.display = 'none';
        document.getElementById('rouletteStrip').style.display = 'flex';
        document.getElementById('rouletteSelector').style.display = 'block';
        const wonItem = getRolledItem(currentCase.items);
        const rouletteStrip = document.getElementById('rouletteStrip');
        rouletteStrip.innerHTML = '';
        const totalItemsInStrip = 70; const winningIndex = 55;
        for (let i = 0; i < totalItemsInStrip; i++) {
            let displayItem = (i === winningIndex) ? wonItem : currentCase.items[Math.floor(Math.random() * currentCase.items.length)];
            rouletteStrip.innerHTML += `<div class="roulette-item" style="border-bottom-color: ${displayItem.rarity}"><img src="${displayItem.img}"></div>`;
        }
        rouletteStrip.style.transition = 'none'; rouletteStrip.style.transform = 'translateX(0)'; rouletteStrip.offsetHeight; 
        const stopPosition = (winningIndex * 160) - (document.querySelector('.roulette-window').offsetWidth / 2) + 80 + (Math.floor(Math.random() * 100) - 50);
        rouletteStrip.style.transition = 'transform 6s cubic-bezier(0.1, 0, 0.1, 1)';
        rouletteStrip.style.transform = `translateX(-${stopPosition}px)`;
        setTimeout(() => {
            isSpinning = false; btn.disabled = false;
            btn.innerHTML = `Otwórz za <span id="openingCasePriceBtn">${(currentCase.price * openQuantity).toFixed(2)}</span>zł`;
            inventory.push({ ...wonItem, uniqueId: generateSafeId() });
            showResultModal([wonItem], totalCost);
        }, 6500);
    } else {
        document.getElementById('rouletteStrip').style.display = 'none';
        document.getElementById('rouletteSelector').style.display = 'none';
        const fastContainer = document.getElementById('fastOpenResults');
        fastContainer.style.display = 'flex'; fastContainer.innerHTML = '';
        let wonItems = [];
        for(let i=0; i < openQuantity; i++) {
            const wonItem = getRolledItem(currentCase.items); wonItems.push(wonItem);
            inventory.push({ ...wonItem, uniqueId: generateSafeId() });
        }
        wonItems.forEach((item, index) => {
            setTimeout(() => { fastContainer.innerHTML += `<div class="fast-open-item" style="border-bottom-color: ${item.rarity};"><img src="${item.img}"></div>`; }, index * 120); 
        });
        setTimeout(() => {
            isSpinning = false; btn.disabled = false;
            btn.innerHTML = `Otwórz za <span id="openingCasePriceBtn">${(currentCase.price * openQuantity).toFixed(2)}</span>zł`;
            showResultModal(wonItems, totalCost);
        }, wonItems.length * 120 + 800);
    }
}

// === SYSTEM UPGRADERA (WIELE PRZEDMIOTÓW) ===

window.clearUpInputs = function() { upInputs = []; updateUpgrader(); renderUpgraderInvs(); }
window.clearUpTargets = function() { upTargets = []; updateUpgrader(); renderUpgraderInvs(); }

window.toggleUpInput = function(uniqueId) {
    if(upInputs.find(i => i.uniqueId === uniqueId)) {
        upInputs = upInputs.filter(i => i.uniqueId !== uniqueId);
    } else {
        const item = inventory.find(i => i.uniqueId === uniqueId);
        if(item) upInputs.push(item);
    }
    updateUpgrader(); renderUpgraderInvs();
}

window.toggleUpTarget = function(storeId) {
    const item = siteStoreItems.find(i => i.storeId === storeId);
    if(item) {
        upTargets.push({...item, tempId: Math.random()}); // Pozwala dodać wiele tych samych itemow
    }
    updateUpgrader(); renderUpgraderInvs();
}

window.renderUpgraderInvs = function() {
    const uInv = document.getElementById('up-user-inv');
    const sInv = document.getElementById('up-store-inv');
    uInv.innerHTML = ''; sInv.innerHTML = '';

    if(inventory.length === 0) {
        uInv.innerHTML = '<p class="text-muted" style="grid-column: 1/-1; text-align: center;">Brak przedmiotów.</p>';
    } else {
        [...inventory].reverse().forEach(item => {
            const isSelected = upInputs.some(i => i.uniqueId === item.uniqueId);
            const card = document.createElement('div');
            card.className = `content-card ${isSelected ? 'selected-input' : ''}`;
            card.style.borderTopColor = item.rarity;
            card.innerHTML = `<img src="${item.img}"> <div class="content-info"><p class="content-name">${item.weapon}</p><div class="content-price">${item.price.toFixed(2)}zł</div></div>`;
            card.onclick = () => toggleUpInput(item.uniqueId);
            uInv.appendChild(card);
        });
    }

    siteStoreItems.forEach(item => {
        const count = upTargets.filter(i => i.storeId === item.storeId).length;
        const card = document.createElement('div');
        card.className = `content-card ${count > 0 ? 'selected-target' : ''}`;
        card.style.borderTopColor = item.rarity;
        card.innerHTML = `
            ${count > 0 ? `<div class="badge-chance" style="background:var(--accent-purple); color:white;">x${count}</div>` : ''}
            <img src="${item.img}"> <div class="content-info"><p class="content-name">${item.weapon}</p><div class="content-price">${item.price.toFixed(2)}zł</div></div>`;
        card.onclick = () => toggleUpTarget(item.storeId);
        sInv.appendChild(card);
    });
}

window.updateUpgrader = function() {
    const slider = document.getElementById('up-slider');
    upBalance = parseFloat(slider.value) || 0;
    document.getElementById('up-slider-val').innerText = upBalance;

    const inSlot = document.getElementById('up-input-slot');
    if(upInputs.length > 0) {
        inSlot.innerHTML = upInputs.map(i => `<img src="${i.img}" class="mini-skin" style="border-color:${i.rarity}">`).join('');
        inSlot.style.borderColor = 'var(--accent-cyan)';
    } else {
        inSlot.innerHTML = '+'; inSlot.style.borderColor = 'var(--glass-border)';
    }

    const outSlot = document.getElementById('up-target-slot');
    if(upTargets.length > 0) {
        outSlot.innerHTML = upTargets.map(i => `<img src="${i.img}" class="mini-skin" style="border-color:${i.rarity}">`).join('');
        outSlot.style.borderColor = 'var(--accent-purple)';
    } else {
        outSlot.innerHTML = '+'; outSlot.style.borderColor = 'var(--glass-border)';
    }

    const totalInput = upInputs.reduce((sum, i) => sum + i.price, 0) + upBalance;
    const targetPrice = upTargets.reduce((sum, i) => sum + i.price, 0);

    document.getElementById('up-input-price').innerText = totalInput.toFixed(2) + ' zł';
    document.getElementById('up-target-price').innerText = targetPrice.toFixed(2) + ' zł';

    let chance = 0;
    if(targetPrice > 0 && totalInput > 0) chance = (totalInput / targetPrice) * (1 - HOUSE_EDGE) * 100;
    chance = Math.min(Math.max(chance, 0), 80); 

    const wheelRing = document.getElementById('up-wheel'); // TYLKO OBRĘCZ
    document.getElementById('up-chance-text').innerText = chance.toFixed(2) + '%';
    document.getElementById('up-ratios').innerText = `Wkład: ${totalInput.toFixed(2)} / Cel: ${targetPrice.toFixed(2)}`;

    wheelRing.style.transition = 'none';
    wheelRing.style.transform = 'rotate(0deg)';

    if(chance > 0) {
        wheelRing.style.background = `conic-gradient(var(--accent-green) 0% ${chance}%, rgba(255,255,255,0.05) ${chance}% 100%)`;
        wheelRing.style.boxShadow = `0 0 40px rgba(0, 255, 136, 0.3)`;
    } else {
        wheelRing.style.background = `conic-gradient(rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.05) 100%)`;
        wheelRing.style.boxShadow = `0 0 40px rgba(0, 0, 0, 0.5)`;
    }
}

window.autoPickTarget = function(multiplier) {
    const totalInput = upInputs.reduce((sum, i) => sum + i.price, 0) + upBalance;
    if(totalInput === 0) return alert('Wybierz swój wkład lub dodaj dopłatę!');
    const desiredTargetValue = totalInput * multiplier;
    const validItems = siteStoreItems.filter(i => i.price >= desiredTargetValue).sort((a,b) => a.price - b.price);
    
    if(validItems.length > 0) {
        upTargets = [{...validItems[0], tempId: Math.random()}];
        updateUpgrader(); renderUpgraderInvs();
    } else {
        alert(`Brak przedmiotu o wartości min. ${desiredTargetValue.toFixed(2)} zł!`);
    }
}

window.spinUpgrader = function() {
    if(upInputs.length === 0 && upBalance === 0) return alert('Wybierz wkład!');
    if(upTargets.length === 0) return alert('Wybierz cele!');
    
    const totalInput = upInputs.reduce((sum, i) => sum + i.price, 0) + upBalance;
    const targetPrice = upTargets.reduce((sum, i) => sum + i.price, 0);
    if(balance < upBalance) return alert('Brak środków na dopłatę!');

    let chance = (totalInput / targetPrice) * (1 - HOUSE_EDGE) * 100;
    chance = Math.min(Math.max(chance, 0), 80);
    if(chance <= 0) return alert('Szansa za mała!');

    // Zabranie srodków graczowi
    balance -= upBalance;
    const inputIds = upInputs.map(i => i.uniqueId);
    inventory = inventory.filter(i => !inputIds.includes(i.uniqueId)); 
    updateBalanceDisplay();
    
    isSpinning = true;
    const btn = document.getElementById('up-btn');
    btn.disabled = true; btn.innerText = "ULEPSZANIE...";

    const roll = Math.random() * 100; 
    const isWin = roll <= chance;

    const winDegrees = (chance / 100) * 360; 
    let stopDegree = 0;
    if(isWin) stopDegree = 2 + Math.random() * (Math.max(1, winDegrees - 4));
    else stopDegree = winDegrees + 2 + Math.random() * (358 - winDegrees - 4);

    const spinDeg = 2160 + (360 - stopDegree); 
    const wheelRing = document.getElementById('up-wheel');
    wheelRing.style.transition = 'transform 7s cubic-bezier(0.1, 0, 0.05, 1)';
    wheelRing.style.transform = `rotate(${spinDeg}deg)`;

    setTimeout(() => {
        const modal = document.getElementById('resultModal');
        const modalTitle = document.getElementById('modalTitle');
        const itemsContainer = document.getElementById('modalItems');
        const summary = document.getElementById('modalSummary');
        
        itemsContainer.innerHTML = upTargets.map(t => `<div class="modal-item" style="border-bottom-color: ${t.rarity}"><img src="${t.img}"><p>${t.weapon}</p></div>`).join('');

        if(isWin) {
            upTargets.forEach(t => inventory.push({...t, uniqueId: generateSafeId()}));
            modalTitle.innerText = "NIESAMOWITE!"; modalTitle.style.color = "var(--accent-green)";
            summary.innerHTML = `<p class="text-muted">Szansa: <b style="color: white">${chance.toFixed(2)}%</b></p><p style="color: var(--accent-green); font-size: 22px; font-weight: bold; margin-top:15px;">Ulepszenie powiodło się!</p>`;
        } else {
            modalTitle.innerText = "PRZEGRANA..."; modalTitle.style.color = "var(--accent-red)";
            itemsContainer.innerHTML = itemsContainer.innerHTML.replace(/style="/g, 'style="box-shadow: inset 0 0 30px rgba(255,0,0,0.5); filter: grayscale(100%); ');
            summary.innerHTML = `<p class="text-muted">Szansa: <b style="color: white">${chance.toFixed(2)}%</b></p><p style="color: var(--accent-red); font-size: 22px; font-weight: bold; margin-top:15px;">Wkład przepadł.</p>`;
        }
        
        modal.classList.add('active');
        isSpinning = false; btn.disabled = false; btn.innerText = "ULEPSZ SKINY";
        upInputs = []; upTargets = [];
        document.getElementById('up-slider').value = 0;
        updateUpgrader(); renderUpgraderInvs(); renderInventory();
    }, 7500); 
}

// === EKWIPUNEK I SPRZEDAŻ ===
function renderInventory() {
    const inventoryGrid = document.getElementById('inventoryGrid');
    inventoryGrid.innerHTML = '';
    const total = inventory.reduce((sum, item) => sum + item.price, 0);
    const totalValEl = document.getElementById('totalValue');
    animateValue(totalValEl, parseFloat(totalValEl.innerText) || 0, total, 800);
    totalValEl.innerText = total.toFixed(2) + ' zł';

    if(inventory.length === 0) return inventoryGrid.innerHTML = '<p class="text-muted" style="grid-column: 1/-1; text-align: center; margin-top: 40px; font-size: 18px;">Ekwipunek jest pusty.</p>';

    [...inventory].reverse().forEach((item, index) => {
        const card = document.createElement('div');
        card.className = 'content-card';
        card.style.borderTopColor = item.rarity;
        card.style.animation = `slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) ${index * 0.05}s backwards`;
        card.innerHTML = `<div class="badge-wear" style="background: ${item.wearColor}">${item.wear}</div><img src="${item.img}"><div class="content-info"><p class="content-name">${item.name}</p><p class="content-weapon">${item.weapon}</p><div class="content-price" style="margin-bottom: 15px;">${item.price.toFixed(2)}zł</div><button class="sell-btn" onclick="sellItem('${item.uniqueId}', ${item.price})">SPRZEDAJ</button></div>`;
        inventoryGrid.appendChild(card);
    });
}

window.sellItem = function(uniqueId, price) { inventory = inventory.filter(item => item.uniqueId !== uniqueId); balance += price; updateBalanceDisplay(); renderInventory(); }
window.sellAll = function() { if(inventory.length === 0) return; balance += inventory.reduce((sum, item) => sum + item.price, 0); inventory = []; updateBalanceDisplay(); renderInventory(); }
window.closeModal = function() { document.getElementById('resultModal').classList.remove('active'); }

document.addEventListener('DOMContentLoaded', init);
