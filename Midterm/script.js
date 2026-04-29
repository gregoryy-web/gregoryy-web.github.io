const searchSubmitBtn = document.getElementById('searchSubmitBtn');
const clearBtn = document.getElementById('clearBtn');
const digimonSearchInput = document.getElementById('digimonSearchInput');
const digimonCardResult = document.getElementById('digimonCardResult');
const typeFilter = document.getElementById('typeFilter');
const homeBtn = document.getElementById('homeBtn');

let currentDigimonList = [];
const API_BASE = 'https://digi-api.com/api/v1/digimon';

async function fetchInitialList() {
    renderLoading();
    try {
        const response = await fetch(`${API_BASE}?pageSize=20`);
        if (!response.ok) throw new Error("Server error");
        const data = await response.json();
        currentDigimonList = data.content;
        renderDigimonList(currentDigimonList);
    } catch (error) {
        renderError("Failed to load Digimon data. Please check your connection.");
    }
}

async function handleSearch() {
    const searchTerm = digimonSearchInput.value.toLowerCase().trim();
    
    if (!searchTerm) {
        renderDigimonList(currentDigimonList);
        return;
    }

    searchByNameAPI(searchTerm);
}

async function searchByNameAPI(term) {
    renderLoading();
    try {
        const response = await fetch(`${API_BASE}/${term}`);
        if (!response.ok) throw new Error(`Digimon "${term}" not found.`);
        
        const data = await response.json();
        renderSingleDetailCard(data);
    } catch (error) {
        renderError(error.message);
    }
}

function renderLoading() {
    digimonCardResult.innerHTML = `
        <div class="text-center p-5">
            <div class="spinner-border text-danger" role="status"></div>
            <p class="mt-2 text-muted">Searching the Digital World...</p>
        </div>`;
}

function renderError(message) {
    digimonCardResult.innerHTML = `
        <div class="alert alert-danger mx-auto text-center shadow-sm" style="max-width: 400px;">
            <i class="bi bi-exclamation-triangle-fill me-2"></i> ${message}
        </div>`;
}

function renderDigimonList(list) {
    digimonCardResult.innerHTML = '';
    if (!list.length) {
        renderError("No Digimon found matching those criteria.");
        return;
    }

    const listHtml = list.map(digimon => `
        <div class="digi-card d-flex align-items-center p-3 rounded-4 shadow-sm bg-white mb-3" 
             onclick="searchByNameAPI('${digimon.name}')" role="button">
            <span class="text-secondary fw-bold me-4">#${String(digimon.id).padStart(4, '0')}</span>
            <h3 class="h5 fw-bold mb-0 flex-grow-1">${digimon.name}</h3>
            <div class="img-container rounded-4 p-2 bg-light">
                <img src="${digimon.image}" alt="${digimon.name}" loading="lazy" style="width: 50px; height: 50px; object-fit: contain;">
            </div>
        </div>
    `).join('');
    
    digimonCardResult.innerHTML = listHtml;
}

function renderSingleDetailCard(data) {
    const { name, id, images, levels, attributes, types, skills } = data;
    const attributeName = attributes[0]?.attribute || 'N/A';
    
    const attrColors = {
        'Vaccine': 'bg-info text-dark',
        'Virus': 'bg-danger text-white',
        'Data': 'bg-success text-white',
        'None': 'bg-secondary text-white'
    };
    const attrClass = attrColors[attributeName] || "bg-secondary";

    digimonCardResult.innerHTML = `
        <div class="digimon-detail-card p-4 rounded-5 shadow-lg bg-white border-0 mx-auto animate__animated animate__fadeIn" style="max-width: 450px;">
            <div class="text-center mb-2">
                <span class="text-muted fw-bold small">#${String(id).padStart(4, '0')}</span>
                <h2 class="display-6 fw-bold mb-0">${name}</h2>
                <hr class="mx-auto w-25 my-3 opacity-10">
            </div>
            <div class="text-center py-3">
                <img src="${images[0]?.href}" alt="${name}" class="img-fluid" style="max-height: 200px;">
            </div>
            <div class="row g-2 text-center mb-4 mt-2">
                ${renderBadgeCol("LEVEL", levels[0]?.level, 'bg-dark')}
                ${renderBadgeCol("ATTRIBUTE", attributeName, attrClass)}
                ${renderBadgeCol("TYPE", types[0]?.type, 'bg-light text-dark border')}
            </div>
            <div class="bg-light p-3 rounded-4">
                <h6 class="fw-bold mb-2 small text-uppercase">Special Moves</h6>
                <div class="custom-scroll" style="max-height: 150px; overflow-y: auto; font-size: 0.85rem;">
                    ${skills.length ? skills.map(s => `
                        <div class="mb-2">
                            <strong class="text-primary">${s.skill}</strong>
                            <p class="text-muted mb-0">${s.description || 'No description available.'}</p>
                        </div>
                    `).join('') : '<p class="text-muted italic">No moves listed.</p>'}
                </div>
            </div>
        </div>
    `;
}

function renderBadgeCol(label, value, cssClass) {
    return `
        <div class="col-4">
            <small class="text-muted fw-bold d-block mb-1" style="font-size: 0.65rem;">${label}</small>
            <div class="badge ${cssClass} w-100 py-2 text-truncate">${value || 'N/A'}</div>
        </div>`;
}

searchSubmitBtn.addEventListener('click', handleSearch);

digimonSearchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') handleSearch();
});

homeBtn.addEventListener('click', () => {
    digimonSearchInput.value = '';
    if(typeFilter) typeFilter.value = '';
    fetchInitialList();
});

if (clearBtn) {
    clearBtn.addEventListener('click', () => {
        digimonSearchInput.value = '';
        if(typeFilter) typeFilter.value = '';
        renderDigimonList(currentDigimonList);
    });
}

fetchInitialList();