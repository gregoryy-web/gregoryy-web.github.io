/**
 * UI Component Library for Digimon Cards
 */

export function renderDigimonListHTML(list, pageInfo, currentPage) {
    let navHtml = '';
    if (pageInfo && pageInfo.totalPages > 1) {
        navHtml = `
            <div class="d-flex justify-content-between align-items-center py-3">
                <button class="btn btn-outline-teal px-4 rounded-pill prevBtnInst" ${pageInfo.currentPage === 0 ? 'disabled' : ''} style="border-color: #20c997; color: #20c997;">Previous</button>
                <span class="fw-bold text-muted small">Page ${pageInfo.currentPage + 1} of ${pageInfo.totalPages}</span>
                <button class="btn btn-teal px-4 rounded-pill nextBtnInst" ${pageInfo.currentPage >= pageInfo.totalPages - 1 ? 'disabled' : ''} style="background-color: #20c997; color: white; border: none;">Next</button>
            </div>
        `;
    }

    const listHtml = list.map(d => `
        <div class="digi-card d-flex align-items-center p-3 rounded-4 shadow-sm bg-white mb-2" 
             onclick="searchByNameApi('${d.name}')" role="button" style="cursor:pointer; border-left: 5px solid #20c997;">
            <span class="text-secondary fw-bold me-4">#${String(d.id).padStart(4, '0')}</span>
            <h3 class="h6 fw-bold mb-0 flex-grow-1 text-dark">${d.name}</h3>
            <div class="img-container rounded-3 p-1 bg-light">
                <img src="${d.image}" alt="${d.name}" style="width: 40px; height: 40px; object-fit: contain;">
            </div>
        </div>
    `).join('');

    return navHtml + listHtml + navHtml;
}

export function renderSingleDetailHTML(data) {
    const { name, id, images, levels, attributes, types, skills, fields } = data;
    const attributeName = attributes[0]?.attribute || 'N/A';
    
    const attrColors = {
        'Vaccine': 'bg-teal text-white',
        'Virus': 'bg-dark text-white',
        'Data': 'bg-info text-white',
        'None': 'bg-secondary text-white'
    };
    const attrClass = attrColors[attributeName] || "bg-secondary text-white";

    return `
        <div class="digimon-detail-view w-100 animate__animated animate__fadeIn">
            <div class="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <span class="badge mb-1" style="background-color: #e9ecef; color: #20c997; border: 1px solid #20c997;">#${String(id).padStart(4, '0')}</span>
                    <h2 class="display-5 fw-bold mb-0" style="color: #0d684d;">${name}</h2>
                </div>
                <button class="btn btn-outline-secondary rounded-pill px-4" onclick="fetchInitialList(currentPage)">
                    Back
                </button>
            </div>

            <div class="row g-4">
                <div class="col-lg-5 col-md-12">
                    <div class="text-center rounded-5 p-4 mb-3" style="background-color: #f0fdfa;">
                        <img src="${images[0]?.href}" alt="${name}" class="img-fluid" style="max-height: 350px; filter: drop-shadow(0 10px 15px rgba(32, 201, 151, 0.2));">
                    </div>
                    
                    <div class="fields-container p-3 rounded-4 border bg-light">
                        <h6 class="fw-bold mb-3 text-muted small text-uppercase">Fields / Origins</h6>
                        <div class="d-flex flex-wrap gap-2">
                            ${fields?.length ? fields.map(f => `
                                <div class="d-flex align-items-center bg-white border rounded-pill px-3 py-1 shadow-sm">
                                    <img src="${f.image}" alt="${f.field}" style="width: 20px; height: 20px; margin-right: 8px;">
                                    <span class="small fw-bold">${f.field}</span>
                                </div>
                            `).join('') : '<span class="text-muted small">No fields found.</span>'}
                        </div>
                    </div>
                </div>

                <div class="col-lg-7 col-md-12">
                    <div class="row g-2 mb-4">
                        ${renderBadgeCol("level", levels[0]?.level, 'bg-dark text-white')}
                        ${renderBadgeCol("attribute", attributeName, attrClass)}
                        ${renderBadgeCol("type", types[0]?.type, 'bg-white text-dark border')}
                    </div>

                    <div class="skills-container bg-white border rounded-4 p-4 shadow-sm">
                        <h6 class="fw-bold mb-3 text-uppercase" style="letter-spacing: 1px; color: #20c997;">Special Moves</h6>
                        <div class="move-list">
                            ${skills?.length ? skills.slice(0, 5).map(s => `
                                <div class="mb-3 pb-2 border-bottom">
                                    <div class="fw-bold h6 mb-1" style="color: #0d684d;">${s.skill}</div>
                                    <p class="text-muted mb-0" style="font-size: 0.9rem;">${s.description || 'No description available.'}</p>
                                </div>
                            `).join('') : '<p class="text-muted">No moves recorded.</p>'}
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
            <small class="text-muted fw-bold d-block mb-1" style="font-size: 0.6rem;">${label}</small>
            <div class="badge ${finalClass} w-100 py-2 text-truncate" ${customStyle}>${value || 'N/A'}</div>
        </div>`;
}