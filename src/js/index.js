const SERVER_URL = 'http://localhost:8080/api/v1/';

// Call the fetchRealms function when the page loads or on a specific event

document.getElementById('form-joke').addEventListener('submit', getAnswer);
// document.getElementById('form-answer').addEventListener('submit', getInfo);
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
    // Prevent the form from reloading the page.
    event.preventDefault();

    const URL = `${SERVER_URL}joke?about= + ${document.getElementById('about').value}`
    const spinner = document.getElementById('spinner1');
    const result = document.getElementById('result');
    result.style.color = "black";

    try {
        spinner.style.display = "block";
        const response = await fetch(URL).then(handleHttpErrors)
        document.getElementById('result').innerText = response.answer;
    } catch (e) {
        result.style.color = "red";
        result.innerText = e.message;
    }
    finally {
        spinner.style.display = "none";
    }
}


async function getInfo(event) {
    // Prevent the form from reloading the page.
    event.preventDefault();

    const URL = `${SERVER_URL}owninfo?question= + ${document.getElementById('the-question').value}`
    const spinner = document.getElementById('spinner3');
    const result3 = document.getElementById('result3');
    result3.innerText = ""
    result3.style.color = "black";
    try {
        spinner.style.display = "block";
        const reply = await fetch(URL).then(handleHttpErrors)
        document.getElementById('result3').innerHTML = convertToLink(reply.answer)
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
        const msg = errorResponse.message ? errorResponse.message : "No error details provided"
        throw new Error(msg)
    }
    return res.json()
}

// WoW API credentials
const config = {
    CLIENT_ID: '7fbd0e041c83432a9e1c40da29f82ca7',
    CLIENT_SECRET: 'sV9HIyUuKl7VvNbaBsaD1lCGeN2hZsr3',
};

// Get access token from Blizzard
async function getAccessToken() {
    // Sending a POST request to Blizzard's OAuth endpoint to retrieve the access token
    const response = await fetch("https://eu.battle.net/oauth/token", {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            "Authorization": "Basic " + btoa(`${config.CLIENT_ID}:${config.CLIENT_SECRET}`)
        },
        body: "grant_type=client_credentials" // request type for getting an access token
    });

    // If the response is not OK (status code other than 200), throw an error
    if (!response.ok) {
        throw new Error("Failed to get access token");
    }

    // Parse the response as JSON and extract the access token
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

// Hardcoded EU realms from WoWpedia (you can expand this list with more realms as needed)
const realms = [
    { name: 'Aerie Peak', slug: 'aerie-peak' },
    { name: 'Aggramar', slug: 'aggramar' },
    { name: 'Al\'Akir', slug: 'al-akir' },
    { name: 'Alonsus', slug: 'alonsus' },
    { name: 'Anachronos', slug: 'anachronos' },
    { name: 'Anub\'arak', slug: 'anubarak' },
    { name: 'Argent Dawn', slug: 'argent-dawn' },
    { name: 'Balnazzar', slug: 'balnazzar' },
    { name: 'Bloodfeather', slug: 'bloodfeather' },
    { name: 'Blade\'s Edge', slug: 'blades-edge' },
    { name: 'Bladefist', slug: 'bladefist' },
    { name: 'Bronzebeard', slug: 'bronzebeard' },
    { name: 'Burning Steppes', slug: 'burning-steppes' },
    { name: 'Chromaggus', slug: 'chromaggus' },
    { name: 'Crushridge', slug: 'crushridge' },
    { name: 'Darkspear', slug: 'darkspear' },
    { name: 'Darksorrow', slug: 'darksorrow' },
    { name: 'Dentarg', slug: 'dentarg' },
    { name: 'Dragonmaw', slug: 'dragonmaw' },
    { name: 'Drak\'thul', slug: 'drakthul' },
    { name: 'Exodar', slug: 'exodar' },
    { name: 'Genjuros', slug: 'genjuros' },
    { name: 'Hakkar', slug: 'hakkar' },
    { name: 'Hellscream', slug: 'hellscream' },
    { name: 'Karazhan', slug: 'karazhan' },
    { name: 'Kilrogg', slug: 'kilrogg' },
    { name: 'Kor\'gall', slug: 'korgall' },
    { name: 'Laughing Skull', slug: 'laughing-skull' },
    { name: 'Lightbringer', slug: 'lightbringer' },
    { name: 'Magtheridon', slug: 'magtheridon' },
    { name: 'Malygos', slug: 'malygos' },
    { name: 'Moonglade', slug: 'moonglade' },
    { name: 'Nordrassil', slug: 'nordrassil' },
    { name: 'Outland', slug: 'outland' },
    { name: 'Quel\'Thalas', slug: 'quelthalas' },
    { name: 'Ragnaros', slug: 'ragnaros' },
    { name: 'Runetotem', slug: 'runetotem' },
    { name: 'Scarshield Legion', slug: 'scarshield-legion' },
    { name: 'Shattered Halls', slug: 'shattered-halls' },
    { name: 'Shattered Hand', slug: 'shattered-hand' },
    { name: 'Shadowsong', slug: 'shadowsong' },
    { name: 'Silvermoon', slug: 'silvermoon' },
    { name: 'Skullcrusher', slug: 'skullcrusher' },
    { name: 'Spinebreaker', slug: 'spinebreaker' },
    { name: 'Stormrage', slug: 'stormrage' },
    { name: 'Stormreaver', slug: 'stormreaver' },
    { name: 'Stormscale', slug: 'stormscale' },
    { name: 'Sylvanas', slug: 'sylvanas' },
    { name: 'Taren Mill', slug: 'tarren-mill' },
    { name: 'Terenas', slug: 'terenas' },
    { name: 'The Maelstrom', slug: 'the-maelstrom' },
    { name: 'The Venture Co', slug: 'the-venture-co' },
    { name: 'Thunderhorn', slug: 'thunderhorn' },
    { name: 'Turalyon', slug: 'turalyon' },
    { name: 'Twisting Nether', slug: 'twisting-nether' },
    { name: 'Vashj', slug: 'vashj' },
    { name: 'Vek\'nilash', slug: 'veknilash' },
    { name: 'Wildhammer', slug: 'wildhammer' },
    { name: 'Xavius', slug: 'xavius' },
    { name: 'Zenedar', slug: 'zenedar' }
];


async function populateRealmDropdown() {
    const realmDropdown = document.getElementById('wow-realm-name');
    realmDropdown.innerHTML = ''; // Clear existing options

    // Add default "Select Realm" option
    const defaultOption = document.createElement('option');
    defaultOption.value = '';
    defaultOption.textContent = 'Select Realm';
    realmDropdown.appendChild(defaultOption);

    // Add each realm from the hardcoded list
    realms.forEach((realm) => {
        const option = document.createElement('option');
        option.value = realm.slug;  // Use the slug for value
        option.textContent = realm.name;  // Display realm name
        realmDropdown.appendChild(option);
    });

    // Optional: Call your autocomplete/search function here if needed
}

function showSuggestions(value) {
    const resultsContainer = document.getElementById('autocomplete-results');
    resultsContainer.innerHTML = ''; // Clear previous results
    const filteredRealms = realms.filter(realm => realm.name.toLowerCase().includes(value.toLowerCase()));

    if (filteredRealms.length > 0) {
        resultsContainer.style.display = 'block'; // Show the results
        filteredRealms.forEach(realm => {
            const div = document.createElement('div');
            div.textContent = realm.name;
            div.addEventListener('click', function () {
                document.getElementById('wow-realm-name').value = realm.name;  // Set the input value to the clicked realm name
                resultsContainer.style.display = 'none';  // Hide the results after selection
            });
            resultsContainer.appendChild(div);
        });
    } else {
        resultsContainer.style.display = 'none';  // Hide if no results
    }
}

// Event listener for typing in the input field
document.getElementById('wow-realm-name').addEventListener('input', function () {
    const value = this.value;
    if (value.length > 0) {
        showSuggestions(value);  // Show matching results
    } else {
        document.getElementById('autocomplete-results').style.display = 'none';  // Hide results if input is empty
    }
});

// Close suggestions if clicked outside
document.addEventListener('click', function (event) {
    if (!event.target.closest('#wow-realm-name')) {
        document.getElementById('autocomplete-results').style.display = 'none';
    }
});

populateRealmDropdown(); // Populate the dropdown on page load
