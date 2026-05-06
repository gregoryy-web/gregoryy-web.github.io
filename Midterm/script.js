const searchSubmitBtn = document.getElementById('searchSubmitBtn');
const clearBtn = document.getElementById('clearBtn');
const digimonSearchInput = document.getElementById('digimonSearchInput');
const digimonCardResult = document.getElementById('digimonCardResult');
const typeFilter = document.getElementById('typeFilter');
const homeBtn = document.getElementById('homeBtn');

let currentPage = 0;
const pageSize = 10;
const apiBase = 'https://digi-api.com/api/v1/digimon';

async function fetchInitialList(page = 0) {
    renderLoading();
    try {
        const response = await fetch(`${apiBase}?page=${page}&pageSize=${pageSize}`);
        if (!response.ok) throw new Error("Server error");
        
        const data = await response.json();
        currentPage = data.pageable.currentPage;
        
        renderDigimonList(data.content, data.pageable);
    } catch (error) {
        renderError("Failed to load Digimon data. Please check your connection.");
    }
}

async function searchByNameApi(term) {
    renderLoading();
    try {
        const response = await fetch(`${apiBase}/${term}`);
        if (!response.ok) throw new Error(`Digimon "${term}" not found.`);
        
        const data = await response.json();
        renderSingleDetailCard(data); 
    } catch (error) {
        renderError(error.message);
    }
}

function renderDigimonList(list, pageInfo = null) {
    digimonCardResult.innerHTML = '';
    if (!list || !list.length) {
        renderError("No Digimon found.");
        return;
    }

    const listHtml = list.map(digimon => `
        <div class="digi-card d-flex align-items-center p-3 rounded-4 shadow-sm bg-white mb-3" 
             onclick="searchByNameApi('${digimon.name}')" role="button" style="cursor:pointer; border-left: 5px solid #20c997;">
            <span class="text-secondary fw-bold me-4">#${String(digimon.id).padStart(4, '0')}</span>
            <h3 class="h5 fw-bold mb-0 flex-grow-1 text-dark">${digimon.name}</h3>
            <div class="img-container rounded-4 p-2 bg-light">
                <img src="${digimon.image}" alt="${digimon.name}" style="width: 50px; height: 50px; object-fit: contain;">
            </div>
        </div>
    `).join('');
    
    digimonCardResult.innerHTML = listHtml;

    if (pageInfo && pageInfo.totalPages > 1) {
        renderPaginationControls(pageInfo);
    }
}

function renderPaginationControls(pageInfo) {
    const { currentPage, totalPages } = pageInfo;
    const navHtml = `
        <div class="d-flex justify-content-between align-items-center mt-4 mb-5">
            <button class="btn btn-outline-teal px-4 rounded-pill" id="prevBtn" ${currentPage === 0 ? 'disabled' : ''} style="border-color: #20c997; color: #20c997;">
                Previous
            </button>
            <span class="fw-bold text-muted small">Page ${currentPage + 1} of ${totalPages}</span>
            <button class="btn btn-teal px-4 rounded-pill" id="nextBtn" ${currentPage >= totalPages - 1 ? 'disabled' : ''} style="background-color: #20c997; color: white; border: none;">
                Next
            </button>
        </div>
    `;
    digimonCardResult.insertAdjacentHTML('beforeend', navHtml);

    document.getElementById('prevBtn').onclick = () => fetchInitialList(currentPage - 1);
    document.getElementById('nextBtn').onclick = () => fetchInitialList(currentPage + 1);
}

function renderSingleDetailCard(data) {
    const { name, id, images, levels, attributes, types, skills } = data;
    const attributeName = attributes[0]?.attribute || 'N/A';
    
    const attrColors = {
        'Vaccine': 'bg-teal text-white',
        'Virus': 'bg-dark text-white',
        'Data': 'bg-info text-white',
        'None': 'bg-secondary text-white'
    };
    const attrClass = attrColors[attributeName] || "bg-secondary text-white";

    digimonCardResult.innerHTML = `
        <div class="digimon-detail-view d-flex flex-column h-100 animate__animated animate__fadeIn" style="overflow: hidden; max-height: 550px;">
            <div class="d-flex justify-content-between align-items-start mb-3">
                <div>
                    <span class="badge mb-1" style="background-color: #e9ecef; color: #20c997; border: 1px solid #20c997;">#${String(id).padStart(4, '0')}</span>
                    <h2 class="display-6 fw-bold mb-0" style="color: #0d684d;">${name}</h2>
                </div>
                <button class="btn btn-sm rounded-pill" onclick="fetchInitialList(currentPage)" style="background-color: #f8f9fa; border: 1px solid #dee2e6;">
                    <i class="bi bi-arrow-left"></i> Back
                </button>
            </div>

            <div class="row g-3 flex-grow-1">
                <div class="col-md-5 text-center d-flex align-items-center justify-content-center rounded-5 p-3" style="background-color: #f0fdfa;">
                    <img src="${images[0]?.href}" alt="${name}" class="img-fluid" style="max-height: 280px; filter: drop-shadow(0 10px 15px rgba(32, 201, 151, 0.2));">
                </div>

                <div class="col-md-7 d-flex flex-column">
                    <div class="row g-2 mb-3">
                        ${renderBadgeCol("LEVEL", levels[0]?.level, 'bg-dark text-white')}
                        ${renderBadgeCol("ATTRIBUTE", attributeName, attrClass)}
                        ${renderBadgeCol("TYPE", types[0]?.type, 'bg-white text-dark border')}
                    </div>

                    <div class="skills-container bg-white border rounded-4 p-3 flex-grow-1 shadow-sm" style="overflow: hidden;">
                        <h6 class="fw-bold mb-2 text-uppercase" style="letter-spacing: 1px; color: #20c997;">Special Moves (Top 5)</h6>
                        <div style="font-size: 0.8rem;">
                            ${skills.length ? skills.slice(0, 5).map(s => `
                                <div class="mb-2 pb-1 border-bottom last-child-border-0">
                                    <div class="fw-bold" style="color: #0d684d;">${s.skill}</div>
                                    <p class="text-muted mb-0 text-truncate">${s.description || 'No data found.'}</p>
                                </div>
                            `).join('') : '<p class="text-muted">No moves recorded.</p>'}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

function renderBadgeCol(label, value, cssClass) {
    const finalClass = cssClass.includes('bg-teal') ? '' : cssClass;
    const customStyle = cssClass.includes('bg-teal') ? 'style="background-color: #20c997; color: white;"' : '';

    return `
        <div class="col-4">
            <small class="text-muted fw-bold d-block mb-1" style="font-size: 0.6rem;">${label}</small>
            <div class="badge ${finalClass} w-100 py-2 text-truncate" ${customStyle}>${value || 'N/A'}</div>
        </div>`;
}

function renderLoading() {
    digimonCardResult.innerHTML = `<div class="text-center p-5"><div class="spinner-border" style="color: #20c997;"></div><p class="text-muted mt-2">Syncing with Digital World...</p></div>`;
}

function renderError(message) {
    digimonCardResult.innerHTML = `<div class="alert alert-light border-danger text-danger text-center shadow-sm">${message}</div>`;
}

searchSubmitBtn.addEventListener('click', () => {
    const term = digimonSearchInput.value.trim();
    if (term) searchByNameApi(term);
});

homeBtn.addEventListener('click', () => {
    digimonSearchInput.value = '';
    fetchInitialList(0);
});

if (clearBtn) {
    clearBtn.addEventListener('click', () => {
        digimonSearchInput.value = '';
        fetchInitialList(0);
    });
}

fetchInitialList(0);