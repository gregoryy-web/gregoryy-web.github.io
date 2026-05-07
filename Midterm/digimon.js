export function renderDigimonListHtml(list, pageInfo, currentPage) {
    let navHtml = '';
    if (pageInfo && pageInfo.totalPages > 1) {
        navHtml = `
            <div class="d-flex justify-content-between mb-4">
                <button class="btn prevBtnInst btn-info btn-sm rounded-pill text-white" ${pageInfo.currentPage === 0 ? 'disabled' : ''}>
                    &laquo; Prev Sector
                </button>
                <span class="text-muted small">Sector ${pageInfo.currentPage + 1}</span>
                <button class="btn nextBtnInst btn-info btn-sm rounded-pill text-white" ${pageInfo.currentPage >= pageInfo.totalPages - 1 ? 'disabled' : ''}>
                    Next Sector &raquo;
                </button>
            </div>`;
    }

    const listHtml = list.map(digimonItem => `
        <div class="digiCard d-flex align-items-center justify-content-between p-3 rounded-4 bg-white mb-3 shadow-sm" 
             onclick="searchByNameApi('${digimonItem.name}')" role="button" 
             style="cursor:pointer; border-left: 8px solid #5390a4;">
            <div class="flex-grow-1 ps-2">
                <div class="text-muted small fw-bold">#${String(digimonItem.id).padStart(4, '0')}</div>
                <h2 class="h5 fw-bold mb-1 text-dark">${digimonItem.name}</h2>
                <span class="badge bg-info" style="font-size: 0.6rem;">DIGIMON</span>
            </div>
            <div style="width: 80px; height: 80px; background: #f8f9fa; border-radius: 15px; overflow: hidden; display: flex; align-items: center; justify-content: center;">
                <img src="${digimonItem.image}" alt="${digimonItem.name}" style="width: 80%; object-fit: contain;">
            </div>
        </div>
    `).join('');

    return `<div class="container-fluid">${navHtml}<div>${listHtml}</div>${navHtml}</div>`;
}

export function renderSingleDetailHtml(data) {
    const { name, id, images, levels, types, skills, fields, attributes } = data;

    const skillsHtml = skills?.map(skillItem => `
        <div class="mb-3 border-bottom pb-2">
            <div class="text-info fw-bold">${skillItem.skill}</div>
            <small class="text-muted d-block">${skillItem.description || 'No data available.'}</small>
        </div>
    `).join('') || 'No special moves recorded.';

    const fieldsHtml = fields?.map(fieldItem => `
        <img src="${fieldItem.image}" title="${fieldItem.field}" class="me-1" style="width: 30px;">
    `).join('') || '';

    return `
        <div class="animate__animated animate__fadeIn">
            <div class="text-center mb-4">
                <h1 class="fw-bold text-info">${name}</h1>
                <span class="badge bg-dark border border-info">ID: #${String(id).padStart(4, '0')}</span>
            </div>

            <div class="row justify-content-center">
                <div class="col-md-8">
                    <div class="card bg-white p-4 rounded-5 text-center mb-4 shadow">
                        <img src="${images?.[0]?.href}" class="img-fluid mx-auto" style="max-height: 300px;">
                    </div>

                    <div class="row g-2 mb-4">
                        <div class="col-6">
                            <div class="p-2 bg-dark text-white rounded text-center small">
                                <div class="text-muted" style="font-size: 0.6rem;">LEVEL</div>
                                <b>${levels?.[0]?.level || 'N/A'}</b>
                            </div>
                        </div>
                        <div class="col-6">
                            <div class="p-2 bg-info text-white rounded text-center small">
                                <div class="text-white-50" style="font-size: 0.6rem;">ATTRIBUTE</div>
                                <b>${attributes?.[0]?.attribute || 'N/A'}</b>
                            </div>
                        </div>
                    </div>

                    <div class="card bg-white p-4 rounded-4 shadow-sm mb-4">
                        <h5 class="fw-bold border-bottom pb-2 mb-3">Special Moves</h5>
                        <div class="skillsList text-start">
                            ${skillsHtml}
                        </div>
                    </div>

                    <div class="fieldsContainer p-3 rounded-4 text-center">
                        <div class="text-muted small mb-2">Digital Fields</div>
                        ${fieldsHtml}
                    </div>
                </div>
            </div>
        </div>`;
}