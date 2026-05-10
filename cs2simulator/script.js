let balance = 1000.00;
let inventory = [];
let currentCase = null;
let isSpinning = false;
let openQuantity = 1;

// FUNKCJA ZABEZPIECZAJĄCA ZDJĘCIA: 
// Jeśli link ze Steam nie zadziała, podstawi ładny, wygenerowany obrazek.
const getFallbackImage = (text) => `https://placehold.co/150x100/1e293b/06b6d4?text=${encodeURIComponent(text)}`;

// BAZA DANYCH Z REALNĄ EKONOMIĄ CS2 I OFICJALNYMI SZANSAMI (%)
const casesData = [
    {
        id: 'revolution',
        name: 'Revolution Case',
        price: 12.50, // Realna cena: Klucz (10.50) + Skrzynka (2.00)
        img: 'https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXU5A1PIYQNqhpOSV-fRPasw8rsRVx4MwFo5_T3eAQ3i6DMIW0X7ojiw9WIwaP3Y-OEwT8GvZYn07mS8Y2h3Qy1qkNlYjj3cNDBdlJvNQ6HqVPqwvCv28EzB2M/200fx185f',
        items: [
            // Złote / Kosy / Rękawiczki (0.26%) - OGROMNY ZYSK
            { name: 'Vice', weapon: 'Sport Gloves', price: 4500.00, chance: 0.260, rarity: '#ffd700', wear: 'FT', wearColor: '#eab308', img: 'https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpovbSsLQJf2PLacDBA5ciJlY20kPb5Prrukm5X_cNx2rDHoInw2Qaw_UJsZGuhd4LDegZsNwrT-VG7l-3phJ-_vprNmnI2viIi-z-DyP2h82gC/200fx185f' },
            // Czerwone / Covert (0.64%) - ZYSK
            { name: 'Head Shot', weapon: 'AK-47', price: 180.00, chance: 0.320, rarity: '#eb4b4b', wear: 'FT', wearColor: '#eab308', img: 'https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpot7HxfDhjxszJegJN6dUilY2GmvLLPr7Vn35cppR02uHDooygi1Ky_xFpYG70JNSSdlRoaA6C_AC7lOm911Lr7Z_OySM16D5iuyiPV10XMA/200fx185f' },
            { name: 'Temukau', weapon: 'M4A4', price: 160.00, chance: 0.320, rarity: '#eb4b4b', wear: 'FT', wearColor: '#eab308', img: 'https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpou-6kejhz2v_Nfz5H_uO1gb-Gw_alIITfn2xZ_Isp273CpdWg2lGw8kBtZWjzLNKUdVRsZw7S_Vi3kry81MLvvMnJzyFjs3Mg4XmPn0GygB9PaLdxxavJeQ9U9w/200fx185f' },
            // Różowe / Classified (3.20%) - NIEWIELKI ZYSK
            { name: 'Duality', weapon: 'AWP', price: 60.00, chance: 1.066, rarity: '#d32ce6', wear: 'FT', wearColor: '#eab308', img: 'https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpot621FAR17P7NdTRH-t26q4yCkP_gfe_Uwz1X7MhwjO3D84ii3w3g-hA5MTiiIdTHdAc9YV-F8gO_xe281JfptcuYmydkuiMj-z-DyB1sSjFv/200fx185f' },
            { name: 'Wild Child', weapon: 'UMP-45', price: 25.00, chance: 1.066, rarity: '#d32ce6', wear: 'MW', wearColor: '#3b82f6', img: 'https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpoo7e1f1Hf0vH3ZDBH_8uJloiCg_b4Pq7Uk2tV-5VwgbvTpNym0ALj-kVuZzyhcIacdQU6YwnQqVW-xe-618e478idziBguD5iuyj4yvWNAQ/200fx185f' },
            { name: 'Neoqueen', weapon: 'P90', price: 20.00, chance: 1.068, rarity: '#d32ce6', wear: 'FT', wearColor: '#eab308', img: 'https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpopoL1FBRw7P7NYjV9-N24q42KqOXxP7Pcl38H7JFw3O_Hpom33gHk8kA6Ym2gcoCQIwdqMA7UrwTvw73n1JO4vMnBzncwv3Mj-z-DyPPqVp5O/200fx185f' },
            // Fioletowe / Restricted (15.98%) - STRATA
            { name: 'Emphorosaur-S', weapon: 'M4A1-S', price: 8.50, chance: 5.326, rarity: '#8847ff', wear: 'FT', wearColor: '#eab308', img: 'https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpou-6kejhjxszJemkV09K_k4iYmfbLP7LWnn8f65Nw2-qSp9im2Fbm-EE-amjxdYSdIFA8Nl6G8wa9krjt15ftupXKyiQ3inMj-z-DyB-yP68q/200fx185f' },
            { name: 'Umbral Rabbit', weapon: 'Glock-18', price: 5.20, chance: 5.326, rarity: '#8847ff', wear: 'FT', wearColor: '#eab308', img: 'https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgposbaqKAxf0v73fwJP7c-lq4aPmvXLNqjXl2hU-sF-3urA9tz30QLt8kJtNmCgINSWI1I_Y1uG8lS8wrvn08S0vZuazXFlsndwe2O2Mg/200fx185f' },
            { name: 'Sakkaku', weapon: 'MAC-10', price: 4.80, chance: 5.328, rarity: '#8847ff', wear: 'MW', wearColor: '#3b82f6', img: 'https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpou7umdzZfxczJTid8_dG5goGIm-v_NoTck29Y_cg_0-qXrImj2QbkqRY9N2vzLtfJdlU6YQ2CrFTtwezshZK6vZ7MzSJnuilysSvemxGz0RhPO-A8m7XAHg1cK3Q/200fx185f' },
            // Niebieskie / Mil-Spec (79.92%) - DUŻA STRATA (Zapychacze skrzynek)
            { name: 'Featherweight', weapon: 'MP9', price: 1.20, chance: 19.98, rarity: '#4b69ff', wear: 'FT', wearColor: '#eab308', img: 'https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpou6ryFA957PvBdTVL-9y4kZSKm_v1MoTHkjlV-spz2LHE9or32Qbk-xVoMmyncNKUdVM-aFzVqAPqlrnujJDutMmbmCRgvyNzsHvVyhCx1QYMMLLyC1p1/200fx185f' },
            { name: 'Fragments', weapon: 'SCAR-20', price: 0.80, chance: 19.98, rarity: '#4b69ff', wear: 'MW', wearColor: '#3b82f6', img: 'https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpoo3m1FBRp3_bGcjhQ09-jq5WYh-TxI7TUqWNU6dNoxOuSrYmt31Xh8kM9MjqhdoTHegZvaAnV_AC9kry5hsft752cmHNls3Mj-z-DyG284L4w/200fx185f' },
            { name: 'Re.built', weapon: 'P250', price: 0.75, chance: 19.98, rarity: '#4b69ff', wear: 'FT', wearColor: '#eab308', img: 'https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpopujwezhz3_bGcjhQ09-jq5WYh-TxI4Tck29Y_cg_iLyTpNSgjQKwrxVvN2H0JoDDJQY3NVHWrVbqwezn1sS8usydmicwuz5iuyiPBVf5u0U/200fx185f' },
            { name: 'Cyberforce', weapon: 'SG 553', price: 0.60, chance: 19.98, rarity: '#4b69ff', wear: 'FT', wearColor: '#eab308', img: 'https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpopb3wflFf0v33fzxU9eO6nYeDg_XwNbrXlzhV_8F40ruVrYnx3QXt-BVtZGyiLNDGIAM-ZV2GrAW9lLzogMO8vcjMz3F9-n51S3RSmW0/200fx185f' }
        ]
    },
    {
        id: 'dreams',
        name: 'Dreams & Nightmares',
        price: 15.00,
        img: 'https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXU5A1PIYQNqhpOSV-fRPasw8rsRVx4MwFo5_T3eAQ3i6DMIW0X7ojiw9WIwaP3Y-OEwT8GvZYn07mS8Y2h3Qy1qkNlYjj3cNDBdlJvNQ6HqVPqwvCv28EzB2M/200fx185f',
        items: [
            { name: 'Lore', weapon: 'Butterfly Knife', price: 9500.00, chance: 0.260, rarity: '#ffd700', wear: 'FT', wearColor: '#eab308', img: 'https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpovbSsLQJf0ebcZThQ6tCvq4GFqP_xMq3I2GoBsMIi3r2To4rz0QXs_RBsZm2iIY-SdwdrZFvR_wLqley8hp-07pzOmGwj5He84Z9HSA/200fx185f' },
            { name: 'Nightwish', weapon: 'AK-47', price: 210.00, chance: 0.640, rarity: '#eb4b4b', wear: 'MW', wearColor: '#3b82f6', img: 'https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpot7HxfDhjxszJemkV092lnYmGmOHLM7zAhm5u5cB1g_zMu4r33QawqEE4YzjycIWWdVJsMl-D_VHsx-_o0cW6vc7KzSNnvCR0uCqJl0Cx1wYMMLI6gG2wBA/200fx185f' },
            { name: 'Melondrama', weapon: 'Dual Berettas', price: 35.00, chance: 3.200, rarity: '#d32ce6', wear: 'FT', wearColor: '#eab308', img: 'https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpos7asPwJfxu_JdDhW-tzil4mOqP_wNr_Vn35cpsdz3O_Do4im3VDsqENrMWDwIdXHcVU9aQ7SqVm4k-_qgsO9uZ3KmnY17iMn432Olwv3308x221IHg/200fx185f' },
            { name: 'Ticket to Hell', weapon: 'USP-S', price: 9.00, chance: 15.980, rarity: '#8847ff', wear: 'FT', wearColor: '#eab308', img: 'https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpoo6m1FBRp3_bGcjhQ09-jq5WYh8j_OrfdqWhe5sN4mOTE8bP4jVC9vh5yZzumcdOUIFI5YgvR-we_wu_vgJK6tZjOmHM3viIi-z-DyBBz_2Yl/200fx185f' },
            { name: 'Scrawl', weapon: 'Five-SeveN', price: 0.80, chance: 39.960, rarity: '#4b69ff', wear: 'FT', wearColor: '#eab308', img: 'https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgposLOzLhRlxfbGTi5N08y7mYS0lPL8MrXUl2hU-sF-j_qQoN3w3A23qRBsYWDzLYHGIwc4MAvTrAToxua9gpPouMmcmHpgsiY8pSGKq2wW/200fx185f' },
            { name: 'Ensnared', weapon: 'MAC-10', price: 0.60, chance: 39.960, rarity: '#4b69ff', wear: 'FT', wearColor: '#eab308', img: 'https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpou7umdzZf0vL3dzxG6eOmgZODqP_xMq3I2GlV-Nd_jO-R9IqhjlGxrUFkNTinJ9OSdQZsNAqCrlTqwenpgMO7vZXIyiMw6Sdz7HiLy0G0hAYMMLKV4B7eFQ/200fx185f' }
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
        // TUTA JEST ZABEZPIECZENIE: onerror="this.src='...'"
        card.innerHTML = `
            <img src="${c.img}" class="case-img" onerror="this.src='${getFallbackImage(c.name)}'">
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
                <img src="${item.img}" class="content-img" onerror="this.src='${getFallbackImage(item.weapon)}'">
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
                <img src="${item.img}" onerror="this.src='${getFallbackImage(item.weapon)}'">
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
                    <img src="${displayItem.img}" onerror="this.src='${getFallbackImage(displayItem.weapon)}'">
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
                        <img src="${item.img}" onerror="this.src='${getFallbackImage(item.weapon)}'">
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
            <img src="${item.img}" class="content-img" onerror="this.src='${getFallbackImage(item.weapon)}'">
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
