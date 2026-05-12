let balance = 5000.00;
let inventory = [];
let currentCase = null;
let isSpinning = false;
let openQuantity = 1;

// --- UPGRADER STATE ---
let upInputs = [];
let upTargets = [];
let upBalance = 0;
const HOUSE_EDGE = 0.10; 

// --- BATTLE STATE ---
let bFormat = 2; // 2, 3, 4
let bMode = 'standard'; // 'standard', 'underdog', 'shared'
let bPlayers = []; 
let bCases = []; 
let bCurrentRound = 0;

const generateStyleImage = (text, hexColor) => {
    const color = hexColor.replace('#', '');
    return `https://placehold.co/200x150/0f172a/${color}?text=${encodeURIComponent(text)}&font=Montserrat`;
};

// ============================================
// BAZA SKRZYNEK (EV + 10% Marży)
// ============================================
const casesData = [
    {
        id: 'cyber_neon',
        name: 'Cyber Neon Case',
        price: 81.90,
        img: generateStyleImage('CYBER NEON', '#00f0ff'),
        items: [
            { name: 'Doppler (Phase 2)', weapon: 'Karambit', price: 11000.00, chance: 0.25, rarity: '#ffd700', wear: 'FN', wearColor: '#eab308', img: generateStyleImage('Karambit', '#ffd700') },
            { name: 'Neon Rider', weapon: 'AK-47', price: 500.00, chance: 2.00, rarity: '#eb4b4b', wear: 'FN', wearColor: '#22c55e', img: generateStyleImage('AK-47', '#eb4b4b') },
            { name: 'Cyber Security', weapon: 'M4A4', price: 150.00, chance: 5.00, rarity: '#d32ce6', wear: 'FN', wearColor: '#22c55e', img: generateStyleImage('M4A4', '#d32ce6') },
            { name: 'Neo-Noir', weapon: 'AWP', price: 130.00, chance: 10.00, rarity: '#d32ce6', wear: 'MW', wearColor: '#3b82f6', img: generateStyleImage('AWP', '#d32ce6') },
            { name: 'Neon Rider', weapon: 'MAC-10', price: 40.00, chance: 20.00, rarity: '#d32ce6', wear: 'MW', wearColor: '#3b82f6', img: generateStyleImage('MAC-10', '#d32ce6') },
            { name: 'Vogue', weapon: 'Glock-18', price: 12.00, chance: 62.75, rarity: '#8847ff', wear: 'FT', wearColor: '#eab308', img: generateStyleImage('Glock-18', '#8847ff') }
        ]
    },
    {
        id: 'awp_masters',
        name: 'AWP Masters Case',
        price: 406.90,
        img: generateStyleImage('AWP MASTERS', '#eb4b4b'),
        items: [
            { name: 'Dragon Lore', weapon: 'AWP', price: 35000.00, chance: 0.10, rarity: '#eb4b4b', wear: 'FT', wearColor: '#eab308', img: generateStyleImage('Dragon Lore', '#eb4b4b') },
            { name: 'Desert Hydra', weapon: 'AWP', price: 8500.00, chance: 0.50, rarity: '#eb4b4b', wear: 'FT', wearColor: '#eab308', img: generateStyleImage('Desert Hydra', '#eb4b4b') },
            { name: 'Fade', weapon: 'AWP', price: 4000.00, chance: 1.50, rarity: '#eb4b4b', wear: 'FN', wearColor: '#22c55e', img: generateStyleImage('Fade', '#eb4b4b') },
            { name: 'Lightning Strike', weapon: 'AWP', price: 2500.00, chance: 3.00, rarity: '#eb4b4b', wear: 'FN', wearColor: '#22c55e', img: generateStyleImage('Lightning Strike', '#eb4b4b') },
            { name: 'Oni Taiji', weapon: 'AWP', price: 1200.00, chance: 5.00, rarity: '#eb4b4b', wear: 'FT', wearColor: '#eab308', img: generateStyleImage('Oni Taiji', '#eb4b4b') },
            { name: 'Asiimov', weapon: 'AWP', price: 500.00, chance: 15.00, rarity: '#eb4b4b', wear: 'FT', wearColor: '#eab308', img: generateStyleImage('Asiimov', '#eb4b4b') },
            { name: 'Chromatic Aberration', weapon: 'AWP', price: 45.00, chance: 25.00, rarity: '#d32ce6', wear: 'FT', wearColor: '#eab308', img: generateStyleImage('Chromatic', '#d32ce6') },
            { name: 'Atheris', weapon: 'AWP', price: 15.00, chance: 49.90, rarity: '#8847ff', wear: 'FT', wearColor: '#eab308', img: generateStyleImage('Atheris', '#8847ff') }
        ]
    },
    {
        id: 'budget_chrome',
        name: 'Budget Chrome Case',
        price: 14.50,
        img: generateStyleImage('CHROME CASE', '#94a3b8'),
        items: [
            { name: 'Vanilla', weapon: 'Navaja Knife', price: 400.00, chance: 0.25, rarity: '#ffd700', wear: 'BS', wearColor: '#ef4444', img: generateStyleImage('Navaja', '#ffd700') },
            { name: 'Printstream', weapon: 'Desert Eagle', price: 150.00, chance: 1.00, rarity: '#eb4b4b', wear: 'FT', wearColor: '#eab308', img: generateStyleImage('Deagle', '#eb4b4b') },
            { name: 'Mecha Industries', weapon: 'M4A1-S', price: 80.00, chance: 4.00, rarity: '#eb4b4b', wear: 'FT', wearColor: '#eab308', img: generateStyleImage('M4A1-S', '#eb4b4b') },
            { name: 'Ice Coaled', weapon: 'AK-47', price: 30.00, chance: 10.00, rarity: '#d32ce6', wear: 'FT', wearColor: '#eab308', img: generateStyleImage('AK-47', '#d32ce6') },
            { name: 'Steel Disruption', weapon: 'Glock-18', price: 10.00, chance: 25.00, rarity: '#8847ff', wear: 'FN', wearColor: '#22c55e', img: generateStyleImage('Glock-18', '#8847ff') },
            { name: 'Lead Conduit', weapon: 'USP-S', price: 3.00, chance: 59.75, rarity: '#4b69ff', wear: 'FT', wearColor: '#eab308', img: generateStyleImage('USP-S', '#4b69ff') }
        ]
    }
];

const siteStoreItems = [];
casesData.forEach(caseObj => {
    caseObj.items.forEach(item => {
        if(!siteStoreItems.find(i => i.name === item.name && i.weapon === item.weapon)) {
            siteStoreItems.push({...item, storeId: item.name + item.weapon});
        }
    });
});
siteStoreItems.sort((a, b) => b.price - a.price);

function generateSafeId() { return 'item_' + Date.now().toString() + '_' + Math.random().toString(36).substring(2, 9); }

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

    const upSlider = document.getElementById('up-slider');
    if (upSlider) {
        upSlider.max = balance;
        if (parseFloat(upSlider.value) > balance) {
            upSlider.value = balance;
            updateUpgrader(); 
        }
    }
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
    if(tabId === 'battle') { initBattleCreator(); }
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

function getRolledItem(items) {
    const rand = Math.random() * 100;
    let cumulative = 0;
    for (let item of items) { cumulative += item.chance; if (rand <= cumulative) return item; }
    return items[items.length - 1]; 
}

// ============================================
// SYSTEM OTWIERANIA SKRZYNEK (SINGLE)
// ============================================
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

// ============================================
// SYSTEM UPGRADERA
// ============================================
window.clearUpInputs = function() { upInputs = []; updateUpgrader(); renderUpgraderInvs(); }
window.clearUpTargets = function() { upTargets = []; updateUpgrader(); renderUpgraderInvs(); }

window.toggleUpInput = function(uniqueId) {
    if(upInputs.find(i => i.uniqueId === uniqueId)) upInputs = upInputs.filter(i => i.uniqueId !== uniqueId);
    else { const item = inventory.find(i => i.uniqueId === uniqueId); if(item) upInputs.push(item); }
    updateUpgrader(); renderUpgraderInvs();
}
window.toggleUpTarget = function(storeId) {
    const item = siteStoreItems.find(i => i.storeId === storeId);
    if(item) upTargets.push({...item, tempId: Math.random()});
    updateUpgrader(); renderUpgraderInvs();
}

window.renderUpgraderInvs = function() {
    const uInv = document.getElementById('up-user-inv');
    const sInv = document.getElementById('up-store-inv');
    const userSortOrder = document.getElementById('sort-user').value;
    const storeSortOrder = document.getElementById('sort-store').value;

    uInv.innerHTML = ''; sInv.innerHTML = '';

    if(inventory.length === 0) {
        uInv.innerHTML = '<p class="text-muted" style="grid-column: 1/-1; text-align: center;">Brak przedmiotów.</p>';
    } else {
        let sortedUserInv = [...inventory];
        if(userSortOrder === 'desc') sortedUserInv.sort((a,b) => b.price - a.price);
        else sortedUserInv.sort((a,b) => a.price - b.price);

        sortedUserInv.forEach(item => {
            const isSelected = upInputs.some(i => i.uniqueId === item.uniqueId);
            const card = document.createElement('div');
            card.className = `content-card ${isSelected ? 'selected-input' : ''}`;
            card.style.borderTopColor = item.rarity;
            card.innerHTML = `<img src="${item.img}"> <div class="content-info"><p class="content-name">${item.weapon}</p><div class="content-price">${item.price.toFixed(2)}zł</div></div>`;
            card.onclick = () => toggleUpInput(item.uniqueId);
            uInv.appendChild(card);
        });
    }

    let sortedStoreItems = [...siteStoreItems];
    if(storeSortOrder === 'desc') sortedStoreItems.sort((a,b) => b.price - a.price);
    else sortedStoreItems.sort((a,b) => a.price - b.price);

    sortedStoreItems.forEach(item => {
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

    const wheelRing = document.getElementById('up-wheel');
    document.getElementById('up-chance-text').innerText = chance.toFixed(2) + '%';
    document.getElementById('up-ratios').innerText = `Wkład: ${totalInput.toFixed(2)} / Cel: ${targetPrice.toFixed(2)}`;

    wheelRing.style.transition = 'none';
    wheelRing.style.transform = 'rotate(0deg)';

    if(chance > 0) {
        wheelRing.style.background = `conic-gradient(var(--accent-green) 0% ${chance}%, transparent ${chance}% 100%)`;
        document.getElementById('up-wheel-container').style.boxShadow = `0 0 40px rgba(0, 255, 136, 0.3)`;
    } else {
        wheelRing.style.background = `transparent`;
        document.getElementById('up-wheel-container').style.boxShadow = `0 0 40px rgba(0, 0, 0, 0.5)`;
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

// ============================================
// SYSTEM CASE BATTLE
// ============================================

const botNames = ["Bot Bartek", "Bot Dawid", "Bot Kacper", "Bot Matrix", "Bot Snajper"];

window.setBattleMode = function(mode, btnElement) {
    bMode = mode;
    document.querySelectorAll('.battle-mode-btn').forEach(b => b.classList.remove('active'));
    btnElement.classList.add('active');
}

function initBattleCreator() {
    bCases = [];
    document.getElementById('battle-creator').style.display = 'block';
    document.getElementById('battle-active').style.display = 'none';
    changeBattleFormat();
    renderBattleAvailableCases();
    renderBattleSelectedCases();
}

window.changeBattleFormat = function() {
    bFormat = parseInt(document.getElementById('battle-format-select').value);
    bPlayers = [{type: 'player', name: 'TY', avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=You', total: 0, items: []}];
    renderBattleSlots();
}

window.renderBattleSlots = function() {
    const container = document.getElementById('battle-slots-container');
    container.innerHTML = '';
    
    for(let i=0; i < bFormat; i++) {
        const slot = document.createElement('div');
        slot.className = 'b-player-slot';
        
        if(bPlayers[i]) {
            slot.innerHTML = `
                <img src="${bPlayers[i].avatar}">
                <p class="font-bold m-0">${bPlayers[i].name}</p>
                ${i !== 0 ? `<button class="b-remove-bot" onclick="removeBot(${i})">X</button>` : ''}
            `;
        } else {
            slot.classList.add('empty');
            slot.innerHTML = `<span style="font-size:30px">+</span><p class="m-0 text-sm">Dodaj Bota</p>`;
            slot.onclick = () => addBot(i);
        }
        container.appendChild(slot);
    }
}

window.addBot = function(index) {
    const randomName = botNames[Math.floor(Math.random() * botNames.length)];
    bPlayers[index] = {
        type: 'bot', 
        name: randomName, 
        avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${Math.random()}`, 
        total: 0, 
        items: []
    };
    renderBattleSlots();
}

window.removeBot = function(index) {
    bPlayers[index] = null;
    renderBattleSlots();
}

function renderBattleAvailableCases() {
    const container = document.getElementById('b-available-cases');
    container.innerHTML = '';
    casesData.forEach(c => {
        const card = document.createElement('div');
        card.className = 'b-case-card';
        card.innerHTML = `<img src="${c.img}"><h4>${c.name}</h4><p class="text-sm">${c.price.toFixed(2)} zł</p>`;
        card.onclick = () => {
            if(bCases.length < 20) {
                bCases.push(c);
                renderBattleSelectedCases();
            } else { alert("Maksymalnie 20 skrzynek!"); }
        };
        container.appendChild(card);
    });
}

function renderBattleSelectedCases() {
    const container = document.getElementById('b-selected-cases');
    const totalCostSpan = document.getElementById('b-total-cost');
    const btnCostSpan = document.getElementById('b-btn-cost');
    const countSpan = document.getElementById('b-cases-count');

    container.innerHTML = '';
    let cost = 0;

    if(bCases.length === 0) {
        container.innerHTML = '<p class="text-muted text-sm w-full text-center mt-8">Brak skrzynek. Dodaj je z listy poniżej.</p>';
    } else {
        bCases.forEach((c, index) => {
            cost += c.price;
            const mc = document.createElement('div');
            mc.className = 'b-mini-case';
            mc.innerHTML = `<img src="${c.img}">`;
            mc.onclick = () => { bCases.splice(index, 1); renderBattleSelectedCases(); }
            container.appendChild(mc);
        });
    }

    totalCostSpan.innerText = cost.toFixed(2);
    btnCostSpan.innerText = cost.toFixed(2);
    countSpan.innerText = bCases.length;
}

window.startBattle = function() {
    if(bCases.length === 0) return alert("Musisz wybrać co najmniej 1 skrzynkę!");
    for(let i=0; i < bFormat; i++) {
        if(!bPlayers[i]) return alert("Musisz zapełnić wszystkie sloty graczami (botami)!");
    }

    const totalCost = bCases.reduce((sum, c) => sum + c.price, 0);
    if(balance < totalCost) return alert("Nie masz wystarczających środków na tę bitwę!");

    // Pobranie kasy tylko za gracza
    balance -= totalCost;
    updateBalanceDisplay();

    // Inicjalizacja areny
    document.getElementById('battle-creator').style.display = 'none';
    document.getElementById('battle-active').style.display = 'block';
    document.getElementById('b-active-mode-label').innerText = `[Tryb: ${bMode.toUpperCase()}]`;
    document.getElementById('b-finish-btn').classList.add('hidden');
    
    bCurrentRound = 0;
    document.getElementById('b-total-rounds').innerText = bCases.length;
    
    const iconsContainer = document.getElementById('b-round-icons');
    iconsContainer.innerHTML = bCases.map((c, i) => `<img src="${c.img}" class="b-round-icon ${i===0 ? 'active' : ''}" id="b-icon-${i}">`).join('');

    renderBattleArena();
    
    setTimeout(() => { playBattleRound(); }, 1000);
}

function renderBattleArena() {
    const arena = document.getElementById('battle-arena');
    arena.innerHTML = '';
    
    bPlayers.forEach((p, i) => {
        const col = document.createElement('div');
        col.className = 'battle-col';
        col.innerHTML = `
            <div class="b-col-header" id="b-header-${i}">
                <img src="${p.avatar}">
                <p class="m-0 font-bold">${p.name}</p>
                <h3 class="m-0 text-green" id="b-total-${i}">0.00 zł</h3>
            </div>
            <div class="vert-roulette">
                <div class="vert-crosshair"></div>
                <div class="vert-roulette-strip" id="b-strip-${i}"></div>
            </div>
            <div class="b-inventory" id="b-inv-${i}"></div>
        `;
        arena.appendChild(col);
    });
}

function playBattleRound() {
    if(bCurrentRound >= bCases.length) {
        finishBattle();
        return;
    }

    document.getElementById('b-current-round').innerText = bCurrentRound + 1;
    document.querySelectorAll('.b-round-icon').forEach(el => el.classList.remove('active'));
    document.getElementById(`b-icon-${bCurrentRound}`).classList.remove('done');
    document.getElementById(`b-icon-${bCurrentRound}`).classList.add('active');

    const currentCaseObj = bCases[bCurrentRound];
    const itemsToGenerate = 50;
    const winningIndex = 40;

    let roundWinners = []; // Zbiera wygrane itemy dla kazdego gracza

    bPlayers.forEach((p, i) => {
        const strip = document.getElementById(`b-strip-${i}`);
        strip.innerHTML = '';
        strip.style.transition = 'none';
        strip.style.transform = 'translateY(0)';

        const wonItem = getRolledItem(currentCaseObj.items);
        roundWinners.push(wonItem);

        for(let j=0; j < itemsToGenerate; j++) {
            let displayItem = (j === winningIndex) ? wonItem : currentCaseObj.items[Math.floor(Math.random() * currentCaseObj.items.length)];
            strip.innerHTML += `
                <div class="vert-item" style="border-bottom-color: ${displayItem.rarity}">
                    <img src="${displayItem.img}">
                    <span>${displayItem.weapon}</span>
                </div>
            `;
        }
    });

    // Wymuszenie reflow
    document.getElementById(`b-strip-0`).offsetHeight;

    // Odpalenie animacji (Pionowo)
    bPlayers.forEach((p, i) => {
        const strip = document.getElementById(`b-strip-${i}`);
        const itemHeight = 150;
        const containerHeight = 350; 
        
        const randomOffset = Math.floor(Math.random() * 80) - 40;
        const stopPosition = (winningIndex * itemHeight) - (containerHeight / 2) + (itemHeight / 2) + randomOffset;

        strip.style.transition = 'transform 5s cubic-bezier(0.1, 0, 0.1, 1)';
        strip.style.transform = `translateY(-${stopPosition}px)`;
    });

    // Po animacji (5s) + 0.5s przerwy
    setTimeout(() => {
        bPlayers.forEach((p, i) => {
            const wonItem = roundWinners[i];
            p.total += wonItem.price;
            p.items.push({...wonItem, uniqueId: generateSafeId()});
            
            document.getElementById(`b-total-${i}`).innerText = p.total.toFixed(2) + ' zł';
            
            const invContainer = document.getElementById(`b-inv-${i}`);
            invContainer.innerHTML = `
                <div class="b-inventory-item" style="border-left-color: ${wonItem.rarity}">
                    <img src="${wonItem.img}">
                    <div class="details"><p>${wonItem.weapon}</p><span>${wonItem.name}</span></div>
                    <div class="price">${wonItem.price.toFixed(2)}zł</div>
                </div>
            ` + invContainer.innerHTML;
        });

        document.getElementById(`b-icon-${bCurrentRound}`).classList.remove('active');
        document.getElementById(`b-icon-${bCurrentRound}`).classList.add('done');

        bCurrentRound++;
        setTimeout(() => { playBattleRound(); }, 1000);
    }, 5500);
}

function finishBattle() {
    let winningTotal;
    
    // Obliczanie wartości wygrywającej w zależności od trybu
    if (bMode === 'underdog') {
        winningTotal = Math.min(...bPlayers.map(p => p.total));
    } else { // Dla Standard i Shared max jest punktem odniesienia
        winningTotal = Math.max(...bPlayers.map(p => p.total));
    }
    
    const winners = bPlayers.filter(p => p.total === winningTotal);
    const isPlayerWinner = winners.some(w => w.type === 'player');

    let allBattleItems = [];
    let grandTotal = 0;
    
    bPlayers.forEach(p => {
        allBattleItems = allBattleItems.concat(p.items);
        grandTotal += p.total;
    });

    // Pokoloruj wszystkich jeśli Shared, w przeciwnym razie tylko zwycięzców
    if (bMode === 'shared') {
        bPlayers.forEach((p, i) => document.getElementById(`b-header-${i}`).classList.add('winner'));
    } else {
        bPlayers.forEach((p, i) => {
            if(p.total === winningTotal) document.getElementById(`b-header-${i}`).classList.add('winner');
        });
    }

    const finishBtn = document.getElementById('b-finish-btn');
    finishBtn.classList.remove('hidden');

    // ROZLICZENIE: Tryb Shared (Każdy zgarnia po równo w gotówce)
    if (bMode === 'shared') {
        const splitValue = grandTotal / bFormat;
        balance += splitValue;
        updateBalanceDisplay();
        setTimeout(() => alert(`Tryb SHARED: Wartość wszystkich dropów to ${grandTotal.toFixed(2)} zł. Każdy gracz otrzymuje po ${splitValue.toFixed(2)} zł do salda!`), 500);
        return;
    }

    // ROZLICZENIE: Tryby Standard / Underdog
    if(isPlayerWinner) {
        allBattleItems.forEach(item => inventory.push(item));
        renderInventory();
        setTimeout(() => alert(`WYGRAŁEŚ BITEWĘ (${bMode.toUpperCase()})! Cała pula trafia do Twojego ekwipunku!`), 500);
    } else {
        setTimeout(() => alert(`Przegrałeś (${bMode.toUpperCase()}). Przedmioty zabiera ${winners[0].name}`), 500);
    }
}

window.exitBattle = function() {
    switchTab('battle'); 
}

// === WYNIKI I OKIENKA ===
window.showResultModal = function(wonItems, totalCost) {
    const modal = document.getElementById('resultModal');
    const itemsContainer = document.getElementById('modalItems');
    const summary = document.getElementById('modalSummary');
    const modalTitle = document.getElementById('modalTitle');

    itemsContainer.innerHTML = '';
    let totalValue = 0;

    wonItems.forEach((item, index) => {
        totalValue += item.price;
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
    let profitText = ''; let profitColor = '';

    if (profit > 0) {
        profitText = `JESTEŚ NA PLUS +${profit.toFixed(2)} zł! 🚀`; profitColor = 'var(--accent-green)'; 
        modalTitle.innerText = "WYGRANA!"; modalTitle.style.color = "var(--accent-green)";
    } else if (profit < 0) {
        profitText = `STRATA ${Math.abs(profit).toFixed(2)} zł. 📉`; profitColor = 'var(--accent-red)'; 
        modalTitle.innerText = "SŁABY DROP..."; modalTitle.style.color = "var(--accent-red)";
    } else {
        profitText = `WYSZEDŁEŚ NA ZERO. ⚖️`; profitColor = 'var(--text-muted)'; 
        modalTitle.innerText = "ZWROT KOSZTÓW"; modalTitle.style.color = "var(--text-muted)";
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

// === EKWIPUNEK ===
window.renderInventory = function() {
    const inventoryGrid = document.getElementById('inventoryGrid');
    const sortOrder = document.getElementById('sort-main-inv').value;
    
    inventoryGrid.innerHTML = '';
    const total = inventory.reduce((sum, item) => sum + item.price, 0);
    const totalValEl = document.getElementById('totalValue');
    animateValue(totalValEl, parseFloat(totalValEl.innerText) || 0, total, 800);
    totalValEl.innerText = total.toFixed(2) + ' zł';

    if(inventory.length === 0) return inventoryGrid.innerHTML = '<p class="text-muted" style="grid-column: 1/-1; text-align: center; margin-top: 40px; font-size: 18px;">Ekwipunek jest pusty.</p>';

    let sortedInventory = [...inventory];
    if (sortOrder === 'desc') { sortedInventory.sort((a, b) => b.price - a.price); } 
    else { sortedInventory.sort((a, b) => a.price - b.price); }

    sortedInventory.forEach((item, index) => {
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
