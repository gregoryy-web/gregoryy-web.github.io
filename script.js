document.addEventListener('DOMContentLoaded', () => {
    const navButtons = document.querySelectorAll('.navbtn');

    navButtons.forEach(button => {
        button.addEventListener('click', function() {
            const page = this.getAttribute('data-page');
            const targetId = this.getAttribute('data-target');
            const display = document.getElementById(targetId);

            if (!display) return;

            navButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');

            // Updated path to include the 'contents' folder
            fetch(`./contents/${page}.html`)
                .then(response => {
                    if (!response.ok) throw new Error(`Could not find ${page}.html`);
                    return response.text();
                })
                .then(data => {
                    display.innerHTML = data;
                })
                .catch(err => {
                    console.error(err);
                    display.innerHTML = `
                        <div class="text-center p-5">
                            <p class="text-danger"><strong>Error:</strong> Cannot find <code>${page}.html</code></p>
                            <p class="small text-muted">Check your 'contents' folder.</p>
                        </div>`;
                });
        });
    });

    // Auto-load the About page on startup
    const defaultBtn = document.querySelector('[data-page="about"]');
    if (defaultBtn) defaultBtn.click();
});