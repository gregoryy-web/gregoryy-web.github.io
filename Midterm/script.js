const searchSubmitBtn = document.getElementById('searchSubmitBtn');
const clearBtn = document.getElementById('clearBtn'); 
const digimonSearchInput = document.getElementById('digimonSearchInput');
const digimonCardResult = document.getElementById('digimonCardResult');
const typeFilter = document.getElementById('typeFilter');
const homeBtn = document.getElementById('homeBtn');

let currentDigimonList = [];


async function fetchInitialList() {
    try {
        const response = await fetch('https://digi-api.com/api/v1/digimon?pageSize=20');
        const data = await response.json();
        currentDigimonList = data.content; 
        renderDigimonList(currentDigimonList);
    } catch (error) {
        console.error("Error fetching initial list:", error);
        digimonCardResult.innerHTML = `<p class="text-danger text-center">Failed to load Digimon data.</p>`;
    }
}

async function handleSearch() {
    const searchTerm = digimonSearchInput.value.toLowerCase().trim();
    const selectedAttribute = typeFilter.value;


    if (searchTerm && !selectedAttribute) {
        searchByNameAPI(searchTerm);
    } else {
        const filtered = currentDigimonList.filter(d => {
            const matchesName = d.name.toLowerCase().includes(searchTerm) || d.id.toString() === searchTerm;
            return matchesName;
        });
        renderDigimonList(filtered);
    }
}


async function searchByNameAPI(term) {
    digimonCardResult.innerHTML = `<div class="text-center p-5"><div class="spinner-border text-danger"></div></div>`;
    try {
        const response = await fetch(`https://digi-api.com/api/v1/digimon/${term}`);
        if (!response.ok) throw new Error("Digimon not found");
        const data = await response.json();
        renderSingleDetailCard(data);
    } catch (error) {
        digimonCardResult.innerHTML = `<div class="alert alert-danger mx-auto" style="max-width: 400px;">${error.message}</div>`;
    }
}


function renderDigimonList(list) {
    digimonCardResult.innerHTML = ''; 
    if (list.length === 0) {
        digimonCardResult.innerHTML = `<p class="text-center mt-4">No Digimon found matching those criteria.</p>`;
        return;
    }

    list.forEach(digimon => {
        const listHtml = `
            <div class="digi-card d-flex align-items-center p-3 rounded-4 shadow-sm bg-white mb-3" 
                 onclick="searchByNameAPI('${digimon.name}')" style="cursor: pointer;">
                <span class="text-secondary fw-bold me-4">No ${String(digimon.id).padStart(4, '0')}</span>
                <h3 class="h5 fw-bold mb-0 flex-grow-1">${digimon.name}</h3>
                <div class="img-container rounded-4 p-2 bg-light">
                    <img src="${digimon.image}" alt="${digimon.name}" style="width: 50px; height: 50px; object-fit: contain;">
                </div>
            </div>`;
        digimonCardResult.insertAdjacentHTML('beforeend', listHtml);
    });
}


function renderSingleDetailCard(data) {
    const { name, id, images, levels, attributes, types, skills } = data;
    const attributeName = attributes[0]?.attribute || 'N/A';
    
    // Logic for Attribute badge colors
    let attrClass = "bg-secondary";
    if (attributeName === 'Vaccine') attrClass = "bg-info text-dark";
    if (attributeName === 'Virus') attrClass = "bg-danger text-white";
    if (attributeName === 'Data') attrClass = "bg-success text-white";

    digimonCardResult.innerHTML = `
        <div class="digimon-detail-card p-4 rounded-5 shadow-lg bg-white border-0 mx-auto" style="max-width: 450px;">
            <div class="text-center mb-2">
                <span class="text-muted fw-bold small">#${String(id).padStart(4, '0')}</span>
                <h2 class="display-6 fw-bold mb-0">${name}</h2>
                <hr class="mx-auto w-25 my-3 opacity-10">
            </div>
            <div class="text-center py-3">
                <img src="${images[0]?.href}" alt="${name}" class="img-fluid" style="max-height: 200px;">
            </div>
            <div class="row g-2 text-center mb-4 mt-2">
                <div class="col-4">
                    <small class="text-muted fw-bold d-block mb-1" style="font-size: 0.65rem;">LEVEL</small>
                    <div class="badge bg-dark w-100 py-2">${levels[0]?.level || 'N/A'}</div>
                </div>
                <div class="col-4">
                    <small class="text-muted fw-bold d-block mb-1" style="font-size: 0.65rem;">ATTRIBUTE</small>
                    <div class="badge ${attrClass} w-100 py-2">${attributeName}</div>
                </div>
                <div class="col-4">
                    <small class="text-muted fw-bold d-block mb-1" style="font-size: 0.65rem;">TYPE</small>
                    <div class="badge bg-light text-dark border w-100 py-2">${types[0]?.type || 'N/A'}</div>
                </div>
            </div>
            <div class="bg-light p-3 rounded-4">
                <h6 class="fw-bold mb-2 small text-uppercase">Special Moves</h6>
                <div style="max-height: 120px; overflow-y: auto; font-size: 0.85rem;">
                    ${skills.map(s => `<p class="mb-1"><strong class="text-primary">${s.skill}:</strong> ${s.description || 'No description.'}</p>`).join('')}
                </div>
            </div>
        </div>
    `;
}

// Event Listeners
searchSubmitBtn.addEventListener('click', handleSearch);
typeFilter.addEventListener('change', handleSearch);
homeBtn.addEventListener('click', () => {
    digimonSearchInput.value = '';
    typeFilter.value = '';
    fetchInitialList();
});
if (clearBtn) {
    clearBtn.addEventListener('click', () => {
        digimonSearchInput.value = '';
        typeFilter.value = '';
        
        // 2. Re-render the original cached list
        renderDigimonList(currentDigimonList);
    });
}

fetchInitialList();