document.addEventListener("DOMContentLoaded", () => {

    const navButtons = document.querySelectorAll(".navbtn");

    navButtons.forEach(button => {
        button.addEventListener("click", () => {

            const pageName = button.dataset.page;
            const targetId = button.dataset.target;
            const targetDiv = document.getElementById(targetId);

            // remove active from all
            navButtons.forEach(btn => btn.classList.remove("active"));

            // add active to buttons with same page
            document.querySelectorAll(`.navbtn[data-page="${pageName}"]`)
                .forEach(btn => btn.classList.add("active"));

            if (!targetDiv) return;

            targetDiv.innerHTML = `<div class="spinner-border spinner-border-sm"></div>`;

            fetch(`contents/${pageName}.html`)
                .then(res => res.text())
                .then(data => {
                    targetDiv.innerHTML = data;
                })
                .catch(() => {
                    targetDiv.innerHTML = `<p class="text-danger">Content not found.</p>`;
                });

        });
    });

    // auto load about
    document.querySelectorAll('.navbtn[data-page="about"]').forEach(btn => btn.click());

});