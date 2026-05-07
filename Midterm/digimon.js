export function renderDigimonListHtml(list, pageInfo, currentPage) {
    let navHtml = '';
    if (pageInfo && pageInfo.totalPages > 1) {
        navHtml = `
            <div class="paginationContainer d-flex justify-content-between align-items-center mb-4 px-1">
                <button class="btn prevBtnInst fw-bold rounded-pill shadow-sm px-3 py-2" 
                    ${pageInfo.currentPage === 0 ? 'disabled' : ''} 
                    style="background-color: #5390a4; color: white; border: none; min-width: 100px; font-size: 0.85rem;">
                    Prev Page
                </button>
                
                <button class="btn nextBtnInst fw-bold rounded-pill shadow-sm px-3 py-2" 
                    ${pageInfo.currentPage >= pageInfo.totalPages - 1 ? 'disabled' : ''} 
                    style="background-color: #5390a4; color: white; border: none; min-width: 100px; font-size: 0.85rem;">
                    Next Page
                </button>
            </div>
        `;
    }

    const listHtml = list.map(d => `
        <div class="digiCard d-flex align-items-center justify-content-between p-3 rounded-5 shadow-sm bg-white mb-3 border-0" 
             onclick="searchByNameApi('${d.name}')" role="button" 
             style="cursor:pointer; transition: transform 0.2s; min-height: 120px; border-left: 8px solid #5390a4 !important;">
            
            <div class="flex-grow-1 ps-2" style="min-width: 0;">
                <div class="text-muted fw-bold mb-1" style="font-size: 0.75rem; letter-spacing: 0.5px;">
                    No ${String(d.id).padStart(4, '0')}
                </div>
                <h2 class="fw-bold mb-2 text-dark text-truncate" style="font-size: 1.4rem; letter-spacing: -0.5px;">
                    ${d.name}
                </h2>
                <div class="d-flex gap-2">
                    <span class="badge rounded-pill px-3 py-1" style="background-color: #5390a4; font-size: 0.7rem; font-weight: 600;">
                        Digimon
                    </span>
                </div>
            </div>
            
            <div class="ms-3 shadow-sm" 
                 style="width: 100px; height: 100px; flex-shrink: 0; border-radius: 25px; 
                        background-color: #f1f8fa; 
                        display: flex; align-items: center; justify-content: center; overflow: hidden; border: 2px solid #5390a4;">
                <img src="${d.image}" alt="${d.name}" style="width: 75%; height: 75%; object-fit: contain; filter: drop-shadow(0 4px 4px rgba(0,0,0,0.05));">
            </div>
        </div>
    `).join('');

    return `
        <div class="digimonAppWrapper container-fluid py-2 px-2 px-md-3" style="max-width: 800px; overflow-x: hidden;">
            ${navHtml}
            <div class="digimonListGrid">${listHtml}</div>
            ${navHtml}
        </div>
    `;
}

export function renderSingleDetailHtml(data) {
    const { name, id, images, levels, attributes, types, skills, fields } = data;
    const attributeName = attributes?.[0]?.attribute || 'N/A';
    // Accent color updated to match search engine teal
    const attrStyle = "background-color: #5390a4; color: white;";

    return `
        <div class="digimonDetailView container-fluid px-2 animate__animated animate__fadeIn">
            <div class="text-center mb-3 mb-md-4">
                <span class="badge mb-2 px-3 py-2" style="background-color: #f8f9fa; color: #5390a4; border: 2px solid #5390a4; font-size: 0.8rem; font-weight: 800;">
                    ID: #${String(id).padStart(4, '0')}
                </span>
                <h1 class="h2 fw-bold mb-0" style="color: #2c4a54; letter-spacing: -1px;">${name}</h1>
            </div>

            <div class="row justify-content-center">
                <div class="col-12 col-md-10 col-lg-8">
                    <div class="text-center rounded-5 p-3 p-md-5 mb-4 shadow-sm border bg-white" 
                         style="background-image: radial-gradient(circle, #f4f9fb 0%, #ffffff 100%);">
                        <img src="${images?.[0]?.href}" alt="${name}" class="img-fluid" 
                             style="max-height: 250px; width: auto; filter: drop-shadow(0 10px 15px rgba(83, 144, 164, 0.2));">
                    </div>

                    <div class="row gx-2 gy-2 mb-4">
                        ${renderBadgeCol("Level", levels?.[0]?.level, 'background-color: #212529; color: white;')}
                        ${renderBadgeCol("Attribute", attributeName, attrStyle)}
                        ${renderBadgeCol("Type", types?.[0]?.type, 'background-color: white; color: #212529; border: 2px solid #dee2e6;')}
                    </div>

                    <div class="fieldsContainer p-3 rounded-4 border bg-white shadow-sm mb-4 text-center">
                        <h6 class="fw-bold mb-3 text-muted text-uppercase" style="font-size: 0.7rem; letter-spacing: 1px;">Fields</h6>
                        <div class="d-flex flex-wrap gap-2 justify-content-center">
                            ${fields?.length ? fields.map(f => `
                                <div class="d-flex align-items-center bg-light border rounded-pill px-2 py-1 shadow-sm">
                                    <img src="${f.image}" alt="${f.field}" style="width: 18px; height: 18px; margin-right: 5px;">
                                    <span style="font-size: 0.75rem;" class="fw-bold text-dark">${f.field}</span>
                                </div>
                            `).join('') : '<span class="text-muted small">None</span>'}
                        </div>
                    </div>

                    <div class="skillsContainer bg-white border rounded-4 p-3 p-md-4 shadow-sm">
                        <h5 class="fw-bold mb-3 text-uppercase" style="font-size: 0.9rem; color: #5390a4;">Special Moves</h5>
                        <div class="moveList">
                            ${skills?.length ? skills.slice(0, 5).map(s => `
                                <div class="mb-3 pb-2 border-bottom">
                                    <div class="fw-bold mb-1" style="color: #2c4a54; font-size: 1rem;">${s.skill}</div>
                                    <p class="text-secondary mb-0" style="font-size: 0.85rem; line-height: 1.4;">
                                        ${s.description || 'No description available.'}
                                    </p>
                                </div>
                            `).join('') : '<p class="text-muted small">No moves recorded.</p>'}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

function renderBadgeCol(label, value, customStyle) {
    return `
        <div class="col-4">
            <small class="text-muted fw-bold d-block mb-1 text-center" style="font-size: 0.6rem; text-transform: uppercase;">${label}</small>
            <div class="badge w-100 py-2 shadow-sm text-truncate d-block rounded-3" 
                 style="${customStyle} font-size: 0.7rem; font-weight: 700;">
                ${value || 'N/A'}
            </div>
        </div>`;
}