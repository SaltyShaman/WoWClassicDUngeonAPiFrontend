import {sendQuestion} from "./indexAPI.js";


console.log("javascript filen er med");

document.getElementById('question-form').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent the form from reloading the page
    document.getElementById("button").onclick = handleQuestion
    // Retrieve the question entered in the textarea
    var question = document.getElementById('question-input').value;

    // Check if the question is not empty
    if (question.trim() !== "") {
        console.log("User's question:", question);
        // You can add logic to handle the question, like fetching a joke or answer
    } else {
        alert("Please enter a question before submitting.");
    }
});

async function handleQuestion(event) {
    event.preventDefault(); // Prevent the form from reloading the page

    const question = document.getElementById('question-input').value;

    if (question.trim() !== "") {
        console.log("User's question:", question);
        const response = await sendQuestion(question);

        if (response) {
            console.log('Question sent successfully!');
            // Display the response (for example, show a joke or answer):
            console.log('Response:', response);
        } else {
            console.error('Failed to send the question');
        }
    } else {
        alert("Please enter a question before submitting.");
    }
}