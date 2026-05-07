import { renderDigimonListHtml, renderSingleDetailHtml } from './digimon.js';

// Element Selectors
const searchSubmitBtn = document.getElementById('searchSubmitBtn');
const clearBtn = document.getElementById('clearBtn');
const digimonSearchInput = document.getElementById('digimonSearchInput');
const digimonCardResult = document.getElementById('digimonCardResult');
const homeBtn = document.getElementById('homeBtn');
const mobileHomeBtn = document.getElementById('mobileHomeBtn');

// Global State
window.currentPage = 0;
const pageSize = 10;
const apiBase = 'https://digi-api.com/api/v1/digimon';
let debounceTimer;

// Expose functions to window so onclick attributes in digimon.js can find them
window.searchByNameApi = searchByNameApi;
window.fetchInitialList = fetchInitialList;

/**
 * Prevents the API from being spammed while typing
 */
function debounceSearch(callback, delay = 500) {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(callback, delay);
}

/**
 * Fetches the paginated list of Digimon
 */
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

/**
 * Fetches specific Digimon by Name or ID
 */
async function searchByNameApi(term) {
    if (!term) {
        fetchInitialList(0);
        return;
    }
    
    renderLoading();
    
    // Smooth transition: scroll to top so user sees the new result 
    // especially important on mobile since the search bar is fixed
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

/**
 * Renders the list view
 */
function renderDigimonList(list, pageInfo = null) {
    digimonCardResult.innerHTML = '';
    
    if (!list || !list.length) {
        renderError("No Digimon found.");
        return;
    }

    digimonCardResult.innerHTML = renderDigimonListHtml(list, pageInfo, window.currentPage);

    // Re-attach pagination listeners after HTML is injected
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

/**
 * Renders the detail view
 */
function renderSingleDetailCard(data) {
    digimonCardResult.innerHTML = renderSingleDetailHtml(data);
}

/**
 * Loading State UI
 */
function renderLoading() { 
    digimonCardResult.innerHTML = `
        <div class="text-center p-5">
            <div class="spinner-border" style="color: #5390a4;"></div>
            <p class="text-muted mt-2">Syncing with Digital World...</p>
        </div>`; 
}

/**
 * Error State UI
 */
function renderError(msg) { 
    digimonCardResult.innerHTML = `
        <div class="alert alert-light border-danger text-danger text-center shadow-sm mx-auto" style="max-width: 400px;">
            ${msg}
            <br><button class="btn btn-sm btn-outline-danger mt-2" onclick="fetchInitialList(0)">Go Home</button>
        </div>`; 
}

/**
 * Resets search and goes back to page 0
 */
const resetApp = () => {
    digimonSearchInput.value = '';
    window.scrollTo(0, 0);
    fetchInitialList(0);
};

// --- Event Listeners ---

// 1. Real-time Search Logic (Name or ID)
digimonSearchInput.addEventListener('input', (e) => {
    const term = e.target.value.trim();
    debounceSearch(() => {
        searchByNameApi(term);
    }, 600);
});

// 2. Manual Search Button
searchSubmitBtn.addEventListener('click', () => {
    const term = digimonSearchInput.value.trim();
    searchByNameApi(term);
});

// 3. Clear Button
if (clearBtn) {
    clearBtn.addEventListener('click', resetApp);
}

// 4. Navigation/Home Buttons
if (homeBtn) homeBtn.onclick = resetApp;
if (mobileHomeBtn) mobileHomeBtn.onclick = resetApp;

// Initial Load
fetchInitialList(0);