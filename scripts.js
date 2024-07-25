document.addEventListener('DOMContentLoaded', () => {
    const profileForm = document.getElementById('profile-form');
    const profileSelect = document.getElementById('profile-select');
    const deleteProfileBtn = document.getElementById('delete-profile-btn');
    const form = document.getElementById('spell-form');
    const spellList = document.getElementById('spells');
    const filterClass = document.getElementById('filter-class');
    let currentProfile = '';

    // Carregar perfis
    function loadProfiles() {
        const profiles = Object.keys(localStorage).filter(key => key.startsWith('profile-'));
        profileSelect.innerHTML = '<option value="">Selecione um perfil</option>';
        profiles.forEach(profile => {
            const option = document.createElement('option');
            option.value = profile;
            option.textContent = profile.replace('profile-', '');
            profileSelect.appendChild(option);
        });
    }

    // Salvar magias para o perfil atual
    function saveSpells() {
        if (currentProfile) {
            localStorage.setItem(currentProfile, JSON.stringify(spells));
        }
    }

    // Carregar magias para o perfil atual
    function loadSpells() {
        if (currentProfile) {
            const savedSpells = JSON.parse(localStorage.getItem(currentProfile) || '[]');
            spells = savedSpells;
            renderSpells();
        }
    }

    // Renderizar magias
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

    // Manipular o envio do formulário de perfil
    profileForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const profileName = document.getElementById('profile-name').value;
        const profileKey = `profile-${profileName}`;
        if (!localStorage.getItem(profileKey)) {
            localStorage.setItem(profileKey, JSON.stringify([]));
            loadProfiles();
            profileSelect.value = profileKey;
            currentProfile = profileKey;
            loadSpells();
        }
        profileForm.reset();
    });

    // Manipular a seleção do perfil
    profileSelect.addEventListener('change', (e) => {
        currentProfile = e.target.value;
        if (currentProfile) {
            loadSpells();
        } else {
            spells = [];
            renderSpells();
        }
    });

    // Manipular a exclusão de perfil
    deleteProfileBtn.addEventListener('click', () => {
        if (currentProfile) {
            localStorage.removeItem(currentProfile);
            currentProfile = '';
            profileSelect.value = '';
            loadProfiles();
            spells = [];
            renderSpells();
        }
    });

    // Manipular o envio do formulário de magia
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('spell-name').value;
        const className = document.getElementById('spell-class').value;
        spells.push({ name, class: className });
        form.reset();
        renderSpells();
        saveSpells();
    });

    // Manipular a exclusão de magia
    spellList.addEventListener('click', (e) => {
        if (e.target.classList.contains('delete-btn')) {
            const index = e.target.dataset.index;
            spells.splice(index, 1);
            renderSpells();
            saveSpells();
        }
    });

    // Manipular a filtragem de magias
    filterClass.addEventListener('change', renderSpells);

    // Inicializar perfis
    loadProfiles();
});
