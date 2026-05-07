export function renderDigimonListHtml(list, pageInfo, currentPage) {
    let navHtml = '';
    if (pageInfo && pageInfo.totalPages > 1) {
        navHtml = `
            <div class="d-flex justify-content-between align-items-center py-4 px-2 mb-4 bg-white rounded-4 shadow-sm border">
                <button class="btn btn-outline-teal btn-lg px-4 rounded-pill prevBtnInst fw-bold" 
                    ${pageInfo.currentPage === 0 ? 'disabled' : ''} 
                    style="border-width: 2px; border-color: #20c997; color: #20c997;">
                    <i class="bi bi-arrow-left-circle-fill"></i> Previous
                </button>
                <div class="text-center">
                    <span class="d-block text-muted text-uppercase fw-bold" style="font-size: 0.7rem; letter-spacing: 2px;">Current Page</span>
                    <span class="fw-black text-dark" style="font-size: 1.4rem;">${pageInfo.currentPage + 1} <small class="text-muted">/</small> ${pageInfo.totalPages}</span>
                </div>
                <button class="btn btn-teal btn-lg px-4 rounded-pill nextBtnInst fw-bold shadow" 
                    ${pageInfo.currentPage >= pageInfo.totalPages - 1 ? 'disabled' : ''} 
                    style="background-color: #20c997; color: white; border: none;">
                    Next <i class="bi bi-arrow-right-circle-fill"></i>
                </button>
            </div>
        `;
    }

    const listHtml = list.map(d => `
        <div class="digi-card d-flex align-items-center p-4 rounded-5 shadow-sm bg-white mb-4 border" 
             onclick="searchByNameApi('${d.name}')" role="button" 
             style="cursor:pointer; border-left: 10px solid #20c997 !important; transition: all 0.3s ease; min-height: 120px;">
            
            <div class="me-4 d-none d-md-block">
                <div class="text-muted fw-bold" style="font-size: 0.8rem; text-transform: uppercase; letter-spacing: 1px;">Index No.</div>
                <div class="fw-black text-dark" style="font-size: 1.5rem;">#${String(d.id).padStart(4, '0')}</div>
            </div>
            
            <div class="flex-grow-1 overflow-hidden">
                <h2 class="fw-black mb-0 text-dark text-truncate" style="font-size: 2.2rem; letter-spacing: -1px;">
                    ${d.name}
                </h2>
                <span class="badge bg-light text-teal d-md-none" style="color: #20c997; border: 1px solid #20c997;">
                    #${String(d.id).padStart(4, '0')}
                </span>
            </div>
            
            <div class="img-container rounded-4 p-2 bg-light border shadow-sm ms-3" 
                 style="width: 110px; height: 110px; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
                <img src="${d.image}" alt="${d.name}" style="width: 100%; height: 100%; object-fit: contain;">
            </div>
        </div>
    `).join('');

    return `
        <div class="digimon-app-wrapper container py-2" style="max-width: 900px;">
            ${navHtml}
            <div class="digimon-list-grid px-2">${listHtml}</div>
            ${navHtml}
        </div>
    `;
}

export function renderSingleDetailHtml(data) {
    const { name, id, images, levels, attributes, types, skills, fields } = data;
    const attributeName = attributes?.[0]?.attribute || 'N/A';
    
    const attrColors = {
        'Vaccine': 'background-color: #20c997; color: white;',
        'Virus': 'background-color: #dc3545; color: white;',
        'Data': 'background-color: #0dcaf0; color: white;',
        'None': 'background-color: #6c757d; color: white;'
    };
    const attrStyle = attrColors[attributeName] || "background-color: #6c757d; color: white;";

    return `
        <div class="digimon-detail-view w-100 animate__animated animate__fadeIn p-1">
            <div class="text-center mb-4">
                <span class="badge mb-2 px-3 py-2" style="background-color: #f8f9fa; color: #20c997; border: 2px solid #20c997; font-size: 0.9rem; font-weight: 800;">
                    ID: #${String(id).padStart(4, '0')}
                </span>
                <h1 class="display-5 fw-black mb-0" style="color: #0d684d; font-weight: 800; letter-spacing: -1px;">${name}</h1>
            </div>

            <div class="row justify-content-center">
                <div class="col-12">
                    <div class="text-center rounded-5 p-4 mb-4 shadow-sm border bg-white" 
                         style="background-image: radial-gradient(circle, #f0fdfa 0%, #ffffff 100%);">
                        <img src="${images?.[0]?.href}" alt="${name}" class="img-fluid" 
                             style="max-height: 350px; filter: drop-shadow(0 12px 24px rgba(32, 201, 151, 0.3));">
                    </div>

                    <div class="row g-3 mb-4 px-1">
                        ${renderBadgeCol("Level", levels?.[0]?.level, 'background-color: #212529; color: white;')}
                        ${renderBadgeCol("Attribute", attributeName, attrStyle)}
                        ${renderBadgeCol("Type", types?.[0]?.type, 'background-color: white; color: #212529; border: 2px solid #dee2e6;')}
                    </div>

                    <div class="fields-container p-3 rounded-4 border bg-white shadow-sm mb-4">
                        <h6 class="fw-bold mb-3 text-muted text-uppercase text-center" style="font-size: 0.8rem; letter-spacing: 2px;">Evolutionary Fields</h6>
                        <div class="d-flex flex-wrap gap-3 justify-content-center">
                            ${fields?.length ? fields.map(f => `
                                <div class="d-flex align-items-center bg-light border rounded-pill px-3 py-2 shadow-sm">
                                    <img src="${f.image}" alt="${f.field}" style="width: 24px; height: 24px; margin-right: 8px;">
                                    <span style="font-size: 0.9rem;" class="fw-bold text-dark">${f.field}</span>
                                </div>
                            `).join('') : '<span class="text-muted">None</span>'}
                        </div>
                    </div>

                    <div class="skills-container bg-white border rounded-4 p-4 shadow-sm">
                        <h5 class="fw-bold mb-4 text-uppercase" style="letter-spacing: 1.5px; color: #20c997;">
                            <i class="bi bi-lightning-fill me-2"></i>Special Moves
                        </h5>
                        <div class="move-list">
                            ${skills?.length ? skills.slice(0, 5).map(s => `
                                <div class="mb-4 pb-3 border-bottom">
                                    <div class="fw-bold mb-2" style="color: #0d684d; font-size: 1.3rem;">${s.skill}</div>
                                    <p class="text-secondary mb-0" style="font-size: 1.1rem; line-height: 1.5;">
                                        ${s.description || 'No description available for this move.'}
                                    </p>
                                </div>
                            `).join('') : '<p class="text-muted text-center">No moves recorded.</p>'}
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
            <small class="text-muted fw-bold d-block mb-2 text-center" style="font-size: 0.75rem; text-transform: uppercase; letter-spacing: 1px;">${label}</small>
            <div class="badge w-100 py-3 shadow-sm text-truncate d-block rounded-3" 
                 style="${customStyle} font-size: 0.9rem; font-weight: 700;">
                ${value || 'N/A'}
            </div>
        </div>`;
}