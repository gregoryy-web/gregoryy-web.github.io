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

function debounceSearch(callback, delay = 600) {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(callback, delay);
}

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
    if (!term) {
        fetchInitialList(0);
        return;
    }
    renderLoading();
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
    digimonCardResult.innerHTML = renderDigimonListHtml(list, pageInfo, window.currentPage);
    
    document.querySelectorAll('.prevBtnInst').forEach(b => {
        b.onclick = () => fetchInitialList(window.currentPage - 1);
    });
    document.querySelectorAll('.nextBtnInst').forEach(b => {
        b.onclick = () => fetchInitialList(window.currentPage + 1);
    });
}

function renderSingleDetailCard(data) {
    digimonCardResult.innerHTML = renderSingleDetailHtml(data);
}

function renderLoading() { 
    digimonCardResult.innerHTML = `
        <div class="text-center p-5">
            <div class="spinner-border text-info"></div>
            <p class="text-info mt-2">Syncing Data...</p>
        </div>`; 
}

function renderError(msg) { 
    digimonCardResult.innerHTML = `
        <div class="alert alert-dark border-danger text-danger text-center shadow mx-auto" style="max-width: 400px;">
            ${msg}
            <br><button class="btn btn-sm btn-outline-danger mt-2" onclick="fetchInitialList(0)">Reboot System</button>
        </div>`; 
}

const resetApp = () => {
    digimonSearchInput.value = '';
    fetchInitialList(0);
};

digimonSearchInput.addEventListener('input', (e) => {
    debounceSearch(() => searchByNameApi(e.target.value.trim()));
});

searchSubmitBtn.addEventListener('click', () => {
    searchByNameApi(digimonSearchInput.value.trim());
});

if (clearBtn) clearBtn.addEventListener('click', resetApp);
if (homeBtn) homeBtn.onclick = resetApp;

fetchInitialList(0);