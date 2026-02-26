const tabs = document.querySelectorAll('.konfigurator-tab');
const panels = document.querySelectorAll('.konfigurator-panel');

tabs.forEach(tab => {
    tab.addEventListener('click', () => {
        // remove active from all tabs and panels
        tabs.forEach(t => t.classList.remove('active'));
        panels.forEach(p => p.classList.remove('active'));

        // add active to clicked tab and matching panel
        tab.classList.add('active');
        document.querySelector(`.konfigurator-panel[data-panel="${tab.dataset.tab}"]`).classList.add('active');
    });
});