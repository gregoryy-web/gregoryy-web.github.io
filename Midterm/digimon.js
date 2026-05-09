export function renderDigimonListHtml(list, pageInfo, currentPage) {
    let navHtml = '';
    if (pageInfo && pageInfo.totalPages > 1) {
        navHtml = `
            <div class="d-flex justify-content-between mb-4">
                <button class="btn prevBtnInst btn-info btn-sm rounded-pill text-white" ${pageInfo.currentPage === 0 ? 'disabled' : ''}>
                    &laquo; Prev Sector
                </button>
                <span class="text-secondary small">Sector ${pageInfo.currentPage + 1}</span>
                <button class="btn nextBtnInst btn-info btn-sm rounded-pill text-white" ${pageInfo.currentPage >= pageInfo.totalPages - 1 ? 'disabled' : ''}>
                    Next Sector &raquo;
                </button>
            </div>`;
    }

    const listHtml = list.map(digimonItem => `
        <div class="digiCard digi-card-dynamic d-flex align-items-center justify-content-between p-3 rounded-4 mb-3 shadow-sm border border-secondary border-opacity-10" 
             onclick="searchByNameApi('${digimonItem.name}')" role="button" 
             style="cursor:pointer; border-left: 8px solid #0ea5e9 !important;">
            <div class="flex-grow-1 ps-2">
                <div class="small fw-bold opacity-50">#${String(digimonItem.id).padStart(4, '0')}</div>
                <h2 class="h5 fw-bold mb-1">${digimonItem.name}</h2>
                <span class="badge bg-info" style="font-size: 0.6rem;">DIGIMON</span>
            </div>
            <div class="image-holder" style="width: 80px; height: 80px; border-radius: 12px; overflow: hidden; display: flex; align-items: center; justify-content: center; background: rgba(255,255,255,0.05);">
                <img src="${digimonItem.image}" alt="${digimonItem.name}" style="width: 85%; object-fit: contain;">
            </div>
        </div>
    `).join('');

    return `<div class="container-fluid">${navHtml}<div>${listHtml}</div>${navHtml}</div>`;
}

export function renderSingleDetailHtml(data) {
    const { name, id, images, levels, types, skills, fields, attributes } = data;

    const skillsHtml = skills?.map(skillItem => `
        <div class="mb-3 p-3 rounded-3 skill-box" style="border-left: 5px solid #0ea5e9;">
            <div class="d-flex justify-content-between align-items-center mb-1">
                <span class="fw-bold text-info" style="font-size: 1.1rem; letter-spacing: 0.5px;">${skillItem.skill}</span>
                <span class="badge rounded-pill bg-dark text-white shadow-sm" style="font-size: 0.65rem;">ATTACK</span>
            </div>
            <p class="mb-0 fw-medium opacity-75" style="font-size: 0.85rem; line-height: 1.5;">
                ${skillItem.description || 'No specialized data recorded for this maneuver.'}
            </p>
        </div>
    `).join('') || '<div class="text-center py-3">No special moves found.</div>';

    const fieldsHtml = fields?.map(fieldItem => `
        <div class="d-inline-block p-1 field-badge rounded-2 shadow-sm border border-secondary border-opacity-25">
            <img src="${fieldItem.image}" title="${fieldItem.field}" style="width: 32px; height: 32px; object-fit: contain;">
        </div>
    `).join('') || '';

    return `
        <div class="animate__animated animate__fadeIn">
            <button class="btn btn-outline-info btn-sm rounded-pill mb-3 d-xl-none" onclick="fetchInitialList(0)">
                <i class="fa fa-chevron-left me-2"></i>Back to List
            </button>

            <div class="text-center mb-4">
                <h1 class="fw-bold text-info display-5 mb-1">${name}</h1>
                <span class="badge bg-dark border border-info px-4 py-2 rounded-pill shadow">ID: #${String(id).padStart(4, '0')}</span>
            </div>

            <div class="row justify-content-center">
                <div class="col-md-11 col-lg-9">
                    <div class="card detail-main-card p-4 rounded-5 text-center mb-4 shadow-lg border-0">
                        <img src="${images?.[0]?.href}" class="img-fluid mx-auto" style="max-height: 350px; filter: drop-shadow(0 15px 25px rgba(0,0,0,0.15));">
                    </div>

                    <div class="row g-3 mb-4">
                        <div class="col-6">
                            <div class="p-3 bg-dark text-white rounded-4 text-center shadow border border-secondary border-opacity-25">
                                <div class="text-info fw-bold mb-1" style="font-size: 0.7rem; letter-spacing: 1.5px;">LEVEL</div>
                                <div class="h5 mb-0 fw-bold">${levels?.[0]?.level || 'UNKNOWN'}</div>
                            </div>
                        </div>
                        <div class="col-6">
                            <div class="p-3 bg-info text-white rounded-4 text-center shadow border border-info border-opacity-25">
                                <div class="text-white fw-bold mb-1" style="font-size: 0.7rem; letter-spacing: 1.5px; opacity: 0.8;">ATTRIBUTE</div>
                                <div class="h5 mb-0 fw-bold">${attributes?.[0]?.attribute || 'NONE'}</div>
                            </div>
                        </div>
                    </div>

                    <div class="fields-container-dynamic p-3 rounded-4 text-center shadow-sm mb-4 border border-secondary border-opacity-10">
                        <div class="fw-bold small mb-3 opacity-75" style="letter-spacing: 2px; font-size: 0.75rem;">DIGITAL FIELDS</div>
                        <div class="d-flex justify-content-center flex-wrap gap-3">${fieldsHtml}</div>
                    </div>

                    <div class="card detail-moves-card p-4 rounded-4 shadow-lg mb-4 border-0">
                        <div class="d-flex align-items-center mb-4 border-bottom border-secondary border-opacity-25 pb-2">
                            <i class="fa fa-crosshairs text-info me-2 h4 mb-0"></i>
                            <h4 class="fw-bold mb-0" style="letter-spacing: 1px;">Special Moves</h4>
                        </div>
                        <div class="skillsList text-start">${skillsHtml}</div>
                    </div>
                </div>
            </div>
        </div>`;
}