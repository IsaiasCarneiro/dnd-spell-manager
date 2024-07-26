// Importa os módulos do Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js";
import { getDatabase, ref, set, get, update, remove } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-database.js";

// Sua configuração do Firebase
const firebaseConfig = {
  apiKey: "SUA_API_KEY",
  authDomain: "SEU_AUTH_DOMAIN",
  databaseURL: "SUA_DATABASE_URL",
  projectId: "SEU_PROJECT_ID",
  storageBucket: "SEU_STORAGE_BUCKET",
  messagingSenderId: "SEU_MESSAGING_SENDER_ID",
  appId: "SEU_APP_ID"
};

// Inicialize o Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

// Código para gerenciar perfis e magias usando Firebase
const profileForm = document.getElementById('profile-form');
const profileSelect = document.getElementById('profile-select');
const deleteProfileBtn = document.getElementById('delete-profile-btn');
const form = document.getElementById('spell-form');
const spellList = document.getElementById('spells');
const filterClass = document.getElementById('filter-class');
let currentProfile = '';

async function loadProfiles() {
    const profilesRef = ref(database, 'profiles');
    const snapshot = await get(profilesRef);
    const profiles = snapshot.val() || {};
    profileSelect.innerHTML = '<option value="">Selecione um perfil</option>';
    for (const [key, profile] of Object.entries(profiles)) {
        const option = document.createElement('option');
        option.value = key;
        option.textContent = profile.name;
        profileSelect.appendChild(option);
    }
}

async function saveSpells() {
    if (currentProfile) {
        const spellsRef = ref(database, `profiles/${currentProfile}/spells`);
        await set(spellsRef, spells);
    }
}

async function loadSpells() {
    if (currentProfile) {
        const spellsRef = ref(database, `profiles/${currentProfile}/spells`);
        const snapshot = await get(spellsRef);
        spells = snapshot.val() || [];
        renderSpells();
    }
}

async function addProfile(name) {
    const profilesRef = ref(database, 'profiles');
    const newProfileRef = ref(database, `profiles/${name}`);
    await set(newProfileRef, { name });
}

async function deleteProfile(profile) {
    const profileRef = ref(database, `profiles/${profile}`);
    await remove(profileRef);
}

profileForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const profileName = document.getElementById('profile-name').value;
    if (!currentProfile) {
        await addProfile(profileName);
        loadProfiles();
        profileSelect.value = profileName;
        currentProfile = profileName;
        loadSpells();
    }
    profileForm.reset();
});

profileSelect.addEventListener('change', (e) => {
    currentProfile = e.target.value;
    if (currentProfile) {
        loadSpells();
    } else {
        spells = [];
        renderSpells();
    }
});

deleteProfileBtn.addEventListener('click', async () => {
    if (currentProfile) {
        await deleteProfile(currentProfile);
        currentProfile = '';
        profileSelect.value = '';
        loadProfiles();
        spells = [];
        renderSpells();
    }
});

form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('spell-name').value;
    const className = document.getElementById('spell-class').value;
    spells.push({ name, class: className });
    form.reset();
    renderSpells();
    saveSpells();
});

spellList.addEventListener('click', (e) => {
    if (e.target.classList.contains('delete-btn')) {
        const index = e.target.dataset.index;
        spells.splice(index, 1);
        renderSpells();
        saveSpells();
    }
});

filterClass.addEventListener('change', renderSpells);

loadProfiles();
