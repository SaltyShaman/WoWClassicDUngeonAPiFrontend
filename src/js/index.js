const SERVER_URL = 'http://localhost:8080/api/v1/';

const config = {
    CLIENT_ID: '7fbd0e041c83432a9e1c40da29f82ca7',
    CLIENT_SECRET: 'sV9HIyUuKl7VvNbaBsaD1lCGeN2hZsr3',
};

document.getElementById('form-joke').addEventListener('submit', getAnswer);
// document.getElementById('form-answer').addEventListener('submit', getInfo);
document.getElementById('form-wow').addEventListener('submit', getWoWCharacterInfo); // New form to fetch WoW data

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

//WoW API

async function loadConfig() {
    const response = await fetch('config.json');
    const config = await response.json();

    console.log(config.CLIENT_ID);  // 'your-client-id'
    console.log(config.CLIENT_SECRET);  // 'your-client-secret'
}

loadConfig();

// Fetching WoW Character Info (New code)
async function getWoWCharacterInfo(event) {
    event.preventDefault();

    const characterName = document.getElementById('wow-character-name').value; // e.g., Bobbymcbobs
    const realmName = document.getElementById('wow-realm-name').value; // e.g., Pyrewood Village
    const region = 'eu'; // Change to 'us', 'eu', etc., depending on region

    const URL = `https://eu.api.blizzard.com/profile/wow/character/${realmName}/${characterName}?namespace=profile-${region}&locale=en_US&access_token=${config.CLIENT_ID}`;

    const spinner = document.getElementById('spinner-wow');
    const resultWow = document.getElementById('result-wow');
    resultWow.innerText = "";
    resultWow.style.color = "black";

    try {
        spinner.style.display = "block";
        const response = await fetch(URL).then(handleHttpErrors);
        // Display the character info
        resultWow.innerText = `Character: ${response.name}, Level: ${response.level}, Class: ${response.character_class.name}`;
    } catch (e) {
        resultWow.style.color = "red";
        resultWow.innerText = e.message;
    } finally {
        spinner.style.display = "none";
    }
}
