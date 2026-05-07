import { renderDigimonListHtml, renderSingleDetailHtml } from './digimon.js';

const searchSubmitBtn = document.getElementById('searchSubmitBtn');
const clearBtn = document.getElementById('clearBtn');
const digimonSearchInput = document.getElementById('digimonSearchInput');
const digimonCardResult = document.getElementById('digimonCardResult');
const homeBtn = document.getElementById('homeBtn');
const mobileHomeBtn = document.getElementById('mobileHomeBtn');

window.currentPage = 0;
const pageSize = 10;
const apiBase = 'https://digi-api.com/api/v1/digimon';

window.searchByNameApi = searchByNameApi;
window.fetchInitialList = fetchInitialList;

async function fetchInitialList(page = 0) {
    renderLoading();
    try {
        const response = await fetch(`${apiBase}?page=${page}&pageSize=${pageSize}`);
        if (!response.ok) throw new Error("Server error");
        
        const data = await response.json();
        window.currentPage = data.pageable.currentPage;
        renderDigimonList(data.content, data.pageable);
    } catch (error) {
        renderError("Failed to sync with Digital World.");
    }
}

async function searchByNameApi(term) {
    if (!term) return;
    renderLoading();
    try {
        const response = await fetch(`${apiBase}/${encodeURIComponent(term.trim())}`);
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

    digimonCardResult.innerHTML = renderDigimonListHtml(list, pageInfo, window.currentPage);

    document.querySelectorAll('.prevBtnInst').forEach(b => {
        b.onclick = () => {
            window.scrollTo(0, 0);
            fetchInitialList(window.currentPage - 1);
        };
    });
    document.querySelectorAll('.nextBtnInst').forEach(b => {
        b.onclick = () => {
            window.scrollTo(0, 0);
            fetchInitialList(window.currentPage + 1);
        };
    });
}

function renderSingleDetailCard(data) {
    digimonCardResult.innerHTML = renderSingleDetailHtml(data);
}

function renderLoading() { 
    digimonCardResult.innerHTML = `
        <div class="text-center p-5">
            <div class="spinner-border" style="color: #20c997;"></div>
            <p class="text-muted mt-2">Syncing with Digital World...</p>
        </div>`; 
}

function renderError(msg) { 
    digimonCardResult.innerHTML = `
        <div class="alert alert-light border-danger text-danger text-center shadow-sm mx-auto" style="max-width: 400px;">
            ${msg}
            <br><button class="btn btn-sm btn-outline-danger mt-2" onclick="fetchInitialList(0)">Go Home</button>
        </div>`; 
}

const resetApp = () => {
    digimonSearchInput.value = '';
    fetchInitialList(0);
};

searchSubmitBtn.addEventListener('click', () => {
    const term = digimonSearchInput.value.trim();
    if (term) searchByNameApi(term);
});

digimonSearchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        const term = digimonSearchInput.value.trim();
        if (term) searchByNameApi(term);
    }
});

if (homeBtn) homeBtn.onclick = resetApp;
if (mobileHomeBtn) mobileHomeBtn.onclick = resetApp;
if (clearBtn) clearBtn.onclick = resetApp;

fetchInitialList(0);