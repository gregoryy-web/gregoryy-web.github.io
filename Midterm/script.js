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
    const { name, id, images, levels, attributes, types, skills, fields } = data;
    const attributeName = attributes[0]?.attribute || 'N/A';
    
    const attrColors = {
        'Vaccine': 'bg-teal text-white',
        'Virus': 'bg-dark text-white',
        'Data': 'bg-info text-white',
        'None': 'bg-secondary text-white'
    };
    const attrClass = attrColors[attributeName] || "bg-secondary text-white";

    // The main container is now fluid (w-100) and height-adjustable
    digimonCardResult.innerHTML = `
        <div class="digimon-detail-view w-100 animate__animated animate__fadeIn">
            <div class="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <span class="badge mb-1" style="background-color: #e9ecef; color: #20c997; border: 1px solid #20c997;">#${String(id).padStart(4, '0')}</span>
                    <h2 class="display-5 fw-bold mb-0" style="color: #0d684d;">${name}</h2>
                </div>
                <button class="btn btn-outline-secondary rounded-pill px-4" onclick="fetchInitialList(currentPage)">
                    <i class="bi bi-arrow-left"></i> Back
                </button>
            </div>

            <div class="row g-4">
                <div class="col-lg-5 col-md-12">
                    <div class="text-center rounded-5 p-4 mb-3" style="background-color: #f0fdfa;">
                        <img src="${images[0]?.href}" alt="${name}" class="img-fluid" style="max-height: 400px; width: auto; filter: drop-shadow(0 10px 15px rgba(32, 201, 151, 0.2));">
                    </div>
                    
                    <!-- NEW: Fields Section -->
                    <div class="fields-container p-3 rounded-4 border bg-light">
                        <h6 class="fw-bold mb-3 text-muted small text-uppercase">Fields / Origins</h6>
                        <div class="d-flex flex-wrap gap-2">
                            ${fields && fields.length ? fields.map(f => `
                                <div class="d-flex align-items-center bg-white border rounded-pill px-3 py-1 shadow-sm">
                                    <img src="${f.image}" alt="${f.field}" style="width: 20px; height: 20px; margin-right: 8px;">
                                    <span class="small fw-bold">${f.field}</span>
                                </div>
                            `).join('') : '<span class="text-muted small">No fields found.</span>'}
                        </div>
                    </div>
                </div>

                <div class="col-lg-7 col-md-12">
                    <div class="row g-2 mb-4">
                        ${renderBadgeCol("LEVEL", levels[0]?.level, 'bg-dark text-white')}
                        ${renderBadgeCol("ATTRIBUTE", attributeName, attrClass)}
                        ${renderBadgeCol("TYPE", types[0]?.type, 'bg-white text-dark border')}
                    </div>

                    <!-- Special Moves: Limited to Top 5 -->
                    <div class="skills-container bg-white border rounded-4 p-4 shadow-sm">
                        <h6 class="fw-bold mb-3 text-uppercase" style="letter-spacing: 1px; color: #20c997;">Special Moves (Top 5)</h6>
                        <div class="move-list">
                            ${skills && skills.length ? skills.slice(0, 5).map(s => `
                                <div class="mb-3 pb-2 border-bottom last-child-border-0">
                                    <div class="fw-bold h6 mb-1" style="color: #0d684d;">${s.skill}</div>
                                    <p class="text-muted mb-0" style="font-size: 0.9rem; white-space: normal;">${s.description || 'No description available.'}</p>
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