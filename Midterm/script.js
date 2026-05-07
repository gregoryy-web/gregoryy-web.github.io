import { renderDigimonListHtml, renderSingleDetailHtml } from './digimon.js';

const searchSubmitBtn = document.getElementById('searchSubmitBtn');
const clearBtn = document.getElementById('clearBtn');
const digimonSearchInput = document.getElementById('digimonSearchInput');
const digimonCardResult = document.getElementById('digimonCardResult');
const homeBtn = document.getElementById('homeBtn');

window.currentPage = 0;
const pageSize = 10;
const apiBase = 'https://digi-api.com/api/v1/digimon';
let debounceTimer;

window.searchByNameApi = searchByNameApi;
window.fetchInitialList = fetchInitialList;

function debounceSearch(callback, delay = 300) {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(callback, delay);
}

async function fetchInitialList(page = 0, nameFilter = '') {
    renderLoading();
    try {
        let url = `${apiBase}?page=${page}&pageSize=${pageSize}`;
        if (nameFilter) {
            url += `&name=${encodeURIComponent(nameFilter)}`;
        }

        const response = await fetch(url);
        if (!response.ok) throw new Error("Connection Lost. Digital World unreachable.");
        
        const data = await response.json();
        
        if (!data.content || data.content.length === 0) {
            renderError(`No units found matching "${nameFilter}"`);
            return;
        }

        window.currentPage = data.pageable.currentPage;
        renderDigimonList(data.content, data.pageable, nameFilter);
    } catch (error) {
        renderError(error.message);
    }
}


async function searchByNameApi(term) {
    if (!term) {
        fetchInitialList(0);
        return;
    }
    renderLoading();
    window.scrollTo({ top: 0, behavior: 'smooth' });
    try {
        const response = await fetch(`${apiBase}/${encodeURIComponent(term.trim())}`);
        if (!response.ok) throw new Error(`Unit "${term}" not found.`);
        const data = await response.json();
        renderSingleDetailCard(data); 
    } catch (error) {
        renderError(error.message);
    }
}

function renderDigimonList(list, pageInfo = null, currentSearchTerm = '') {
    const statusContainer = document.querySelector('.resultsContainer .position-sticky .dark-glass');
    if (statusContainer) {
        statusContainer.innerHTML = `
            <span class="text-muted small me-2">Status:</span>
            <span class="text-success small fw-bold">Online</span>
        `;
    }

    const sectionTitle = document.querySelector('.resultsContainer .h2');
    if (sectionTitle) sectionTitle.innerText = "Digimon Units";

    digimonCardResult.innerHTML = renderDigimonListHtml(list, pageInfo, window.currentPage);
    
    document.querySelectorAll('.prevBtnInst').forEach(b => {
        b.onclick = () => fetchInitialList(window.currentPage - 1, currentSearchTerm);
    });
    document.querySelectorAll('.nextBtnInst').forEach(b => {
        b.onclick = () => fetchInitialList(window.currentPage + 1, currentSearchTerm);
    });
}

function renderSingleDetailCard(data) {
    const statusContainer = document.querySelector('.resultsContainer .position-sticky .dark-glass');
    if (statusContainer) {
        statusContainer.innerHTML = `
            <div onclick="resetApp()" style="cursor:pointer">
                <i class="fa fa-home text-info me-1"></i>
                <span class="text-info small fw-bold">Return Home</span>
            </div>
        `;
    }


    const sectionTitle = document.querySelector('.resultsContainer .h2');
    if (sectionTitle) sectionTitle.innerText = "Unit Analysis";

    digimonCardResult.innerHTML = renderSingleDetailHtml(data);
}

function renderLoading() { 
    digimonCardResult.innerHTML = `
        <div class="text-center p-5">
            <div class="spinner-border text-info"></div>
            <p class="text-info mt-2" style="letter-spacing: 2px; font-size: 0.8rem;">SCANNING NETWORK...</p>
        </div>`; 
}

function renderError(msg) { 
    digimonCardResult.innerHTML = `
        <div class="alert alert-dark border-danger text-danger text-center shadow mx-auto animate__animated animate__shakeX" style="max-width: 400px; background: rgba(220, 53, 69, 0.1);">
            <i class="fa fa-exclamation-triangle mb-2"></i><br>
            ${msg}
            <br><button class="btn btn-sm btn-outline-danger mt-3 rounded-pill" onclick="resetApp()">Reboot System</button>
        </div>`; 
}

const resetApp = () => {
    digimonSearchInput.value = '';
    fetchInitialList(0);
};

digimonSearchInput.addEventListener('input', (e) => {
    const term = e.target.value.trim();
    debounceSearch(() => fetchInitialList(0, term));
});

searchSubmitBtn.addEventListener('click', () => {
    searchByNameApi(digimonSearchInput.value.trim());
});

if (clearBtn) clearBtn.addEventListener('click', resetApp);
if (homeBtn) homeBtn.onclick = resetApp;

fetchInitialList(0);
window.resetApp = resetApp; 
window.searchByNameApi = searchByNameApi;
window.fetchInitialList = fetchInitialList;