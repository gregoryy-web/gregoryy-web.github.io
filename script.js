document.addEventListener('DOMContentLoaded', () => {
    const themeToggle = document.getElementById('theme-toggle');
    const themeToggleMobile = document.getElementById('theme-toggle-mobile');
    const htmlElement = document.documentElement;

    const setTheme = (theme) => {
        htmlElement.setAttribute('data-bs-theme', theme);
        localStorage.setItem('theme', theme);
        
        const icon = theme === 'dark' ? 'bi-sun-fill' : 'bi-moon-stars-fill';
        
        [themeToggle, themeToggleMobile].forEach(btn => {
            if(btn) btn.innerHTML = `<i class="bi ${icon}"></i>`;
        });
    };

    const savedTheme = localStorage.getItem('theme') || 'light';
    setTheme(savedTheme);


    [themeToggle, themeToggleMobile].forEach(btn => {
        if(btn) {
            btn.addEventListener('click', () => {
                const currentTheme = htmlElement.getAttribute('data-bs-theme');
                setTheme(currentTheme === 'dark' ? 'light' : 'dark');
            });
        }
    });

    const navButtons = document.querySelectorAll('.navbtn');

    navButtons.forEach(button => {
        button.addEventListener('click', function() {
            const page = this.getAttribute('data-page');
            const targetId = this.getAttribute('data-target');
            const display = document.getElementById(targetId);

            if (!display) return;

            document.querySelectorAll(`.navbtn[data-target="${targetId}"]`).forEach(btn => {
                btn.classList.remove('active');
            });
            this.classList.add('active');

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

    const defaultButtons = document.querySelectorAll('[data-page="about"]');
    defaultButtons.forEach(btn => btn.click());
});