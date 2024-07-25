document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('spell-form');
    const spellList = document.getElementById('spells');
    const filterClass = document.getElementById('filter-class');

    let spells = [];

    function renderSpells() {
        spellList.innerHTML = '';
        const filter = filterClass.value;
        spells
            .filter(spell => filter === 'Todos' || spell.class === filter)
            .forEach((spell, index) => {
                const li = document.createElement('li');
                li.innerHTML = `
                    ${spell.name} (${spell.class})
                    <button class="delete-btn" data-index="${index}">Excluir</button>
                `;
                spellList.appendChild(li);
            });
    }

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('spell-name').value;
        const className = document.getElementById('spell-class').value;
        spells.push({ name, class: className });
        form.reset();
        renderSpells();
    });

    spellList.addEventListener('click', (e) => {
        if (e.target.classList.contains('delete-btn')) {
            const index = e.target.dataset.index;
            spells.splice(index, 1);
            renderSpells();
        }
    });

    filterClass.addEventListener('change', renderSpells);
});
