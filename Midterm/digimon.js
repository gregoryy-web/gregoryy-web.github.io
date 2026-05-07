export function renderDigimonListHtml(list, pageInfo, currentPage) {
    let navHtml = '';
    if (pageInfo && pageInfo.totalPages > 1) {
        navHtml = `
            <div class="d-flex justify-content-between align-items-center py-2 px-1">
                <button class="btn btn-outline-teal btn-sm px-3 rounded-pill prevBtnInst" ${pageInfo.currentPage === 0 ? 'disabled' : ''} style="border-color: #20c997; color: #20c997;">Prev</button>
                <span class="fw-bold text-muted" style="font-size: 0.75rem;">Page ${pageInfo.currentPage + 1} of ${pageInfo.totalPages}</span>
                <button class="btn btn-teal btn-sm px-3 rounded-pill nextBtnInst" ${pageInfo.currentPage >= pageInfo.totalPages - 1 ? 'disabled' : ''} style="background-color: #20c997; color: white; border: none;">Next</button>
            </div>
        `;
    }

    const listHtml = list.map(d => `
        <div class="digi-card d-flex align-items-center p-2 p-sm-3 rounded-3 shadow-sm bg-white mb-2" 
             onclick="searchByNameApi('${d.name}')" role="button" style="cursor:pointer; border-left: 4px solid #20c997; transition: transform 0.2s;">
            
            <span class="text-secondary fw-bold me-3" style="min-width: 50px; font-size: 0.85rem;">#${String(d.id).padStart(4, '0')}</span>
            
            <h3 class="fw-bold mb-0 flex-grow-1 text-dark text-truncate" style="font-size: 1rem;">${d.name}</h3>
            
            <div class="img-container rounded-2 p-1 bg-light border ms-2">
                <img src="${d.image}" alt="${d.name}" style="width: 40px; height: 40px; object-fit: contain;">
            </div>
        </div>
    `).join('');

    return navHtml + `<div class="digimon-list-container">${listHtml}</div>` + navHtml;
}

export function renderSingleDetailHtml(data) {
    const { name, id, images, levels, attributes, types, skills, fields } = data;
    const attributeName = attributes?.[0]?.attribute || 'N/A';
    
    const attrColors = {
        'Vaccine': 'bg-teal text-white',
        'Virus': 'bg-dark text-white',
        'Data': 'bg-info text-white',
        'None': 'bg-secondary text-white'
    };
    const attrClass = attrColors[attributeName] || "bg-secondary text-white";

    return `
        <div class="digimon-detail-view w-100 animate__animated animate__fadeIn">
            <div class="text-center mb-3">
                <span class="badge mb-1" style="background-color: #e9ecef; color: #20c997; border: 1px solid #20c997; font-size: 0.7rem;">#${String(id).padStart(4, '0')}</span>
                <h2 class="fw-bold mb-0" style="color: #0d684d; font-size: 1.75rem;">${name}</h2>
            </div>

            <div class="row justify-content-center g-0">
                <div class="col-12">
                    <div class="text-center rounded-4 p-3 mb-3" style="background-color: #f0fdfa;">
                        <img src="${images?.[0]?.href}" alt="${name}" class="img-fluid" style="max-height: 250px; filter: drop-shadow(0 8px 12px rgba(32, 201, 151, 0.2));">
                    </div>

                    <div class="row g-2 mb-3 px-1">
                        ${renderBadgeCol("level", levels?.[0]?.level, 'bg-dark text-white')}
                        ${renderBadgeCol("attribute", attributeName, attrClass)}
                        ${renderBadgeCol("type", types?.[0]?.type, 'bg-white text-dark border')}
                    </div>

                    <div class="fields-container p-2 rounded-4 border bg-light mb-3">
                        <h6 class="fw-bold mb-2 text-muted text-uppercase text-center" style="font-size: 0.65rem;">Fields</h6>
                        <div class="d-flex flex-wrap gap-2 justify-content-center">
                            ${fields?.length ? fields.map(f => `
                                <div class="d-flex align-items-center bg-white border rounded-pill px-2 py-1 shadow-sm">
                                    <img src="${f.image}" alt="${f.field}" style="width: 14px; height: 14px; margin-right: 5px;">
                                    <span style="font-size: 0.65rem;" class="fw-bold">${f.field}</span>
                                </div>
                            `).join('') : '<span class="text-muted small">N/A</span>'}
                        </div>
                    </div>

                    <div class="skills-container bg-white border rounded-4 p-3 shadow-sm">
                        <h6 class="fw-bold mb-3 text-uppercase text-center" style="letter-spacing: 1px; color: #20c997; font-size: 0.8rem;">Special Moves</h6>
                        <div class="move-list">
                            ${skills?.length ? skills.slice(0, 5).map(s => `
                                <div class="mb-2 pb-2 border-bottom">
                                    <div class="fw-bold mb-1" style="color: #0d684d; font-size: 0.9rem;">${s.skill}</div>
                                    <p class="text-muted mb-0" style="font-size: 0.75rem; line-height: 1.3;">${s.description || 'No description available.'}</p>
                                </div>
                            `).join('') : '<p class="text-muted text-center" style="font-size: 0.8rem;">No moves recorded.</p>'}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

function renderBadgeCol(label, value, cssClass) {
    const isTeal = cssClass.includes('bg-teal');
    const finalClass = isTeal ? '' : cssClass;
    const customStyle = isTeal ? 'style="background-color: #20c997; color: white;"' : '';

    return `
        <div class="col-4">
            <small class="text-muted fw-bold d-block mb-1 text-center" style="font-size: 0.55rem; text-transform: uppercase;">${label}</small>
            <div class="badge ${finalClass} w-100 py-2 text-truncate d-block" ${customStyle} style="font-size: 0.65rem;">${value || 'N/A'}</div>
        </div>`;
}