const SERVER_URL = 'http://localhost:8080/api/v1/';


document.getElementById('form-wow-chat').addEventListener('submit', askAboutCharacter);

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


//ChatGPT and Blizzard
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

        const response = await fetch(`http://localhost:8080/api/wowchat`, {
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

