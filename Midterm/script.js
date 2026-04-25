const searchSubmitBtn = document.getElementById('searchSubmitBtn');
const digimonSearchInput = document.getElementById('digimonSearchInput');
const digimonCardResult = document.getElementById('digimonCardResult');

async function fetchDigimonData() {
    const searchTerm = digimonSearchInput.value.toLowerCase().trim();
    if (!searchTerm) return;

    digimonCardResult.innerHTML = `<div class="spinner-border text-primary" role="status"></div>`;

    try {
        const response = await fetch(`https://digi-api.com/api/v1/digimon/${searchTerm}`);
        if (!response.ok) throw new Error("Digimon not found");

        const data = await response.json();
        renderDigimonCard(data);
    } catch (error) {
        digimonCardResult.innerHTML = `<div class="alert alert-danger">${error.message}</div>`;
    }
}

function renderDigimonCard(data) {
    // Destructure everything including skills
    const { name, id, images, levels, attributes, types, fields, skills } = data;

    // Logic: Color-code the attribute badge
    const attributeName = attributes[0]?.attribute || 'N/A';
    let attrClass = "bg-secondary"; 
    if (attributeName === 'Vaccine') attrClass = "bg-info text-dark";
    if (attributeName === 'Virus') attrClass = "bg-danger text-white";
    if (attributeName === 'Data') attrClass = "bg-success text-white";

    // Build the Card HTML in one single template literal
    digimonCardResult.innerHTML = `
        <div class="digimon-card text-center shadow border-0 card p-4" style="width: 24rem; border-radius: 15px;">
            <div class="id-badge text-muted small">#${id}</div>
            <h2 class="digimon-name fw-bold border-bottom pb-2">${name}</h2>
            
            <div class="my-3">
                <img src="${images[0]?.href}" alt="${name}" class="digimon-image img-fluid" style="max-height: 200px;">
            </div>

            <div class="row g-0 mt-4 text-center">
                <div class="col-4 px-1">
                    <small class="text-uppercase fw-bold d-block mb-1" style="font-size: 0.7rem;">Level</small>
                    <div class="bg-secondary text-white rounded py-1 px-2 d-inline-block w-100 shadow-sm" style="font-size: 0.85rem;">
                        ${levels[0]?.level || 'N/A'}
                    </div>
                </div>
                <div class="col-4 px-1">
                    <small class="text-uppercase fw-bold d-block mb-1" style="font-size: 0.7rem;">Attribute</small>
                    <div class="${attrClass} rounded py-1 px-2 d-inline-block w-100 shadow-sm" style="font-size: 0.85rem;">
                        ${attributeName}
                    </div>
                </div>
                <div class="col-4 px-1">
                    <small class="text-uppercase fw-bold d-block mb-1" style="font-size: 0.7rem;">Type</small>
                    <div class="bg-light text-dark border rounded py-1 px-2 d-inline-block w-100 shadow-sm" style="font-size: 0.85rem;">
                        ${types[0]?.type || 'N/A'}
                    </div>
                </div>
            </div>

            <div class="mt-4 text-start">
                <p class="small fw-bold mb-2 border-bottom">Special Moves</p>
                <div class="skills-scroll" style="max-height: 120px; overflow-y: auto;">
                    <ul class="list-group list-group-flush" id="skillListContainer" style="font-size: 0.8rem;">
                        </ul>
                </div>
            </div>

            <div class="field-tray mt-4">
                <p class="field-section-title small fw-bold mb-2">Fields</p>
                <div id="fieldIconList" class="d-flex justify-content-center gap-2"></div>
            </div>
        </div>
    `;

    // 1. Inject Skill Items
    const skillListContainer = document.getElementById('skillListContainer');
    if (skills && skills.length > 0) {
        skills.forEach(skillItem => {
            const li = document.createElement('li');
            li.className = 'list-group-item bg-transparent px-0 py-1 border-0';
            li.innerHTML = `<strong class="text-primary">${skillItem.skill}:</strong> <span class="text-muted">${skillItem.description || 'No data.'}</span>`;
            skillListContainer.appendChild(li);
        });
    } else {
        skillListContainer.innerHTML = `<li class="list-group-item border-0 text-muted">No skills found.</li>`;
    }

    // 2. Inject Field Icons
    const fieldIconList = document.getElementById('fieldIconList');
    if (fields && fields.length > 0) {
        fields.forEach(fieldItem => {
            const icon = document.createElement('img');
            icon.src = fieldItem.image;
            icon.style.width = "32px";
            icon.title = fieldItem.field;
            fieldIconList.appendChild(icon);
        });
    } else {
        fieldIconList.innerHTML = `<span class="text-muted small">None</span>`;
    }
}

// Global Event Listeners
searchSubmitBtn.addEventListener('click', fetchDigimonData);
digimonSearchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') fetchDigimonData();
});