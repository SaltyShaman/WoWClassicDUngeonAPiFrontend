
const baseBackendUrl = "http://localhost:8080/api";



async function sendQuestion(question) {
    try {
        const response = await fetch(`${baseBackendUrl}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ question })
        });

        // Check if the response is ok
        if (response.ok) {
            const data = await response.json();  // Parse the response if it’s JSON
            console.log('Question successfully sent!');
            return data;  // Return the response data (e.g., joke or answer)
        } else {
            console.log('Failed to send question');
            return false;
        }
    } catch (error) {
        console.error('Error occurred when sending the question:', error);
        return false;
    }
}

export {sendQuestion};