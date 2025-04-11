const SERVER_URL = 'http://localhost:8080/api/v1/';

document.getElementById('form-joke').addEventListener('submit', getAnswer);
document.getElementById('form-wow').addEventListener('submit', async function (e) {
    e.preventDefault();
    document.getElementById('spinner-wow').style.display = 'inline-block';

    const characterName = document.getElementById('wow-character-name').value.toLowerCase();
    const realmName = document.getElementById('wow-realm-name').value.toLowerCase();

    const data = await fetchCharacterProfile("eu", realmName, characterName);

    if (data) {
        document.getElementById("character-info").style.display = "block";
        document.getElementById("char-name").textContent = data.name;
        document.getElementById("char-realm").textContent = data.realm.slug;
        document.getElementById("char-level").textContent = data.level;
    } else {
        document.getElementById("character-info").style.display = "none";
    }

    document.getElementById('spinner-wow').style.display = 'none';
});

async function getAnswer(event) {
    event.preventDefault();

    const URL = `${SERVER_URL}joke?about= + ${document.getElementById('about').value}`;
    const spinner = document.getElementById('spinner1');
    const result = document.getElementById('result');
    result.style.color = "black";

    try {
        spinner.style.display = "block";
        const response = await fetch(URL).then(handleHttpErrors);
        document.getElementById('result').innerText = response.answer;
    } catch (e) {
        result.style.color = "red";
        result.innerText = e.message;
    } finally {
        spinner.style.display = "none";
    }
}

async function getInfo(event) {
    event.preventDefault();

    const URL = `${SERVER_URL}owninfo?question= + ${document.getElementById('the-question').value}`;
    const spinner = document.getElementById('spinner3');
    const result3 = document.getElementById('result3');
    result3.innerText = "";
    result3.style.color = "black";

    try {
        spinner.style.display = "block";
        const reply = await fetch(URL).then(handleHttpErrors);
        document.getElementById('result3').innerHTML = convertToLink(reply.answer);
    } catch (e) {
        result3.style.color = "red";
        result3.innerText = e.message;
    } finally {
        spinner.style.display = "none";
    }

    function convertToLink(str) {
        const urlRegex = /(https?:\/\/[^\s]+)/g;
        return str.replace(urlRegex, function(match) {
            if (match.endsWith('.')) {
                match = match.slice(0, -1); // Remove the trailing dot
            }
            return `<a href="${match}" target="_blank">${match}</a>`;
        });
    }
}

async function handleHttpErrors(res) {
    if (!res.ok) {
        const errorResponse = await res.json();
        const msg = errorResponse.message ? errorResponse.message : "No error details provided";
        throw new Error(msg);
    }
    return res.json();
}

const config = {
    CLIENT_ID: '7fbd0e041c83432a9e1c40da29f82ca7',
    CLIENT_SECRET: 'sV9HIyUuKl7VvNbaBsaD1lCGeN2hZsr3',
};

async function getAccessToken() {
    const response = await fetch("https://eu.battle.net/oauth/token", {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            "Authorization": "Basic " + btoa(`${config.CLIENT_ID}:${config.CLIENT_SECRET}`)
        },
        body: "grant_type=client_credentials"
    });

    if (!response.ok) {
        throw new Error("Failed to get access token");
    }

    const data = await response.json();
    return data.access_token;
}

async function fetchCharacterProfile(region = "eu", realmSlug = "draenor", characterName = "tjyna", namespace = "profile-eu", locale = "en_EU") {
    try {
        const accessToken = await getAccessToken();
        const url = `https://${region}.api.blizzard.com/profile/wow/character/${realmSlug}/${characterName}?namespace=${namespace}&locale=${locale}`;

        const response = await fetch(url, {
            headers: {
                "Authorization": `Bearer ${accessToken}`
            }
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch character data: ${response.status} ${response.statusText}`);
        }

        const characterData = await response.json();
        console.log("Character Profile:", characterData);
        return characterData;
    } catch (error) {
        console.error("Error fetching character profile:", error);
    }
}

const realms = [
    { name: 'Aerie Peak', slug: 'aerie-peak' },
    { name: 'Aggramar', slug: 'aggramar' },
    { name: 'Al\'Akir', slug: 'al-akir' },
    // Additional realms...
];

async function populateRealmDropdown() {
    const realmDropdown = document.getElementById('wow-realm-name');
    realmDropdown.innerHTML = ''; // Clear existing options

    const defaultOption = document.createElement('option');
    defaultOption.value = '';
    defaultOption.textContent = 'Select Realm';
    realmDropdown.appendChild(defaultOption);

    realms.forEach((realm) => {
        const option = document.createElement('option');
        option.value = realm.slug;
        option.textContent = realm.name;
        realmDropdown.appendChild(option);
    });
}

function showSuggestions(value) {
    const resultsContainer = document.getElementById('autocomplete-results');
    resultsContainer.innerHTML = '';
    const filteredRealms = realms.filter(realm => realm.name.toLowerCase().includes(value.toLowerCase()));

    if (filteredRealms.length > 0) {
        resultsContainer.style.display = 'block';
        filteredRealms.forEach(realm => {
            const div = document.createElement('div');
            div.textContent = realm.name;
            div.addEventListener('click', function () {
                document.getElementById('wow-realm-name').value = realm.name;
                resultsContainer.style.display = 'none';
            });
            resultsContainer.appendChild(div);
        });
    } else {
        resultsContainer.style.display = 'none';
    }
}

document.getElementById('wow-realm-name').addEventListener('input', function () {
    const value = this.value;
    if (value.length > 0) {
        showSuggestions(value);
    } else {
        document.getElementById('autocomplete-results').style.display = 'none';
    }
});

document.addEventListener('click', function (event) {
    if (!event.target.closest('#wow-realm-name')) {
        document.getElementById('autocomplete-results').style.display = 'none';
    }
});

populateRealmDropdown(); // Populate the dropdown on page load

async function askAboutCharacter(event) {
    event.preventDefault();

    const question = document.getElementById('wow-question').value;
    const characterName = document.getElementById('wow-character-name').value.toLowerCase();
    const realmName = document.getElementById('wow-realm-name').value.toLowerCase();

    const spinner = document.getElementById('spinner-wow-chat');
    const resultDiv = document.getElementById('wow-chat-result');
    resultDiv.innerText = "";
    resultDiv.style.color = "black";

    try {
        spinner.style.display = "block";

        const character = await fetchCharacterProfile("eu", realmName, characterName);
        if (!character) throw new Error("Kunne ikke hente karakterdata");

        const response = await fetch(`${SERVER_URL}wowchat`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                question: question,
                character: character
            })
        }).then(handleHttpErrors);

        resultDiv.innerText = response.answer;

    } catch (e) {
        resultDiv.style.color = "red";
        resultDiv.innerText = e.message;
    } finally {
        spinner.style.display = "none";
    }
}
