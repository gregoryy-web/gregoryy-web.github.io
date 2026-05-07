export function renderDigimonListHtml(list, pageInfo, currentPage) {
    let navHtml = '';
    if (pageInfo && pageInfo.totalPages > 1) {
        navHtml = `
            <div class="paginationContainer d-flex justify-content-between align-items-center p-2 p-md-3 mb-4 bg-white rounded-4 shadow-sm border" style="min-height: 80px;">
                <button class="btn btn-outline-teal rounded-pill prevBtnInst fw-bold d-flex align-items-center justify-content-center px-3" 
                    ${pageInfo.currentPage === 0 ? 'disabled' : ''} 
                    style="border-width: 2px; border-color: #20c997; color: #20c997; min-height: 45px; flex-shrink: 0;">
                    <i class="bi bi-arrow-left-circle-fill"></i>
                    <span class="d-none d-sm-inline ms-2">Prev</span>
                </button>
                
                <div class="text-center px-2 flex-grow-1">
                    <span class="d-block text-muted text-uppercase fw-bold" style="font-size: 0.6rem; letter-spacing: 1px;">Page</span>
                    <span class="fw-bold text-dark" style="font-size: 0.9rem;">${pageInfo.currentPage + 1} / ${pageInfo.totalPages}</span>
                </div>
                
                <button class="btn btn-teal rounded-pill nextBtnInst fw-bold shadow d-flex align-items-center justify-content-center px-3" 
                    ${pageInfo.currentPage >= pageInfo.totalPages - 1 ? 'disabled' : ''} 
                    style="background-color: #20c997; color: white; border: none; min-height: 45px; flex-shrink: 0;">
                    <span class="d-none d-sm-inline me-2">Next</span> 
                    <i class="bi bi-arrow-right-circle-fill"></i>
                </button>
            </div>
        `;
    }

    const listHtml = list.map(d => `
        <div class="digiCard d-flex align-items-center p-2 p-sm-3 rounded-4 shadow-sm bg-white mb-3 border" 
             onclick="searchByNameApi('${d.name}')" role="button" 
             style="cursor:pointer; border-left: 6px solid #20c997 !important; transition: transform 0.2s; min-height: 90px;">
            
            <div class="me-3 d-none d-md-block" style="flex-shrink: 0; min-width: 70px;">
                <div class="text-muted fw-bold" style="font-size: 0.65rem; text-transform: uppercase;">Index</div>
                <div class="fw-bold text-dark" style="font-size: 1.1rem;">#${String(d.id).padStart(4, '0')}</div>
            </div>
            
            <div class="flex-grow-1" style="min-width: 0;">
                <h2 class="fw-bold mb-0 text-dark text-truncate" style="font-size: clamp(1rem, 4vw, 1.6rem); line-height: 1.2;">
                    ${d.name}
                </h2>
                <div class="mt-1 d-md-none">
                    <span class="badge rounded-pill bg-light text-teal border" style="color: #20c997; font-size: 0.7rem;">
                        #${String(d.id).padStart(4, '0')}
                    </span>
                </div>
            </div>
            
            <div class="imgContainer rounded-3 p-1 bg-light border ms-2" 
                 style="width: 60px; height: 60px; flex-shrink: 0; display: flex; align-items: center; justify-content: center;">
                <img src="${d.image}" alt="${d.name}" style="max-width: 100%; max-height: 100%; object-fit: contain;">
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
    
    const attrColors = {
        'Vaccine': 'background-color: #20c997; color: white;',
        'Virus': 'background-color: #dc3545; color: white;',
        'Data': 'background-color: #0dcaf0; color: white;',
        'None': 'background-color: #6c757d; color: white;'
    };
    const attrStyle = attrColors[attributeName] || "background-color: #6c757d; color: white;";

    return `
        <div class="digimonDetailView container-fluid px-2 animate__animated animate__fadeIn">
            <div class="text-center mb-3 mb-md-4">
                <span class="badge mb-2 px-3 py-2" style="background-color: #f8f9fa; color: #20c997; border: 2px solid #20c997; font-size: 0.8rem; font-weight: 800;">
                    ID: #${String(id).padStart(4, '0')}
                </span>
                <h1 class="h2 fw-bold mb-0" style="color: #0d684d; letter-spacing: -1px;">${name}</h1>
            </div>

            <div class="row justify-content-center">
                <div class="col-12 col-md-10 col-lg-8">
                    <div class="text-center rounded-5 p-3 p-md-5 mb-4 shadow-sm border bg-white" 
                         style="background-image: radial-gradient(circle, #f0fdfa 0%, #ffffff 100%);">
                        <img src="${images?.[0]?.href}" alt="${name}" class="img-fluid" 
                             style="max-height: 250px; width: auto; filter: drop-shadow(0 10px 15px rgba(32, 201, 151, 0.2));">
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
                        <h5 class="fw-bold mb-3 text-uppercase" style="font-size: 0.9rem; color: #20c997;">Special Moves</h5>
                        <div class="moveList">
                            ${skills?.length ? skills.slice(0, 5).map(s => `
                                <div class="mb-3 pb-2 border-bottom">
                                    <div class="fw-bold mb-1" style="color: #0d684d; font-size: 1rem;">${s.skill}</div>
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