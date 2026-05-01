// 1. Select the counter element from your HTML
const counter = document.querySelector("#counter");

async function updateCounter() {
    // 2. Your specific API Gateway URL with the /visit resource added
    const apiUrl = "https://uizk0ln0mj.execute-api.us-east-1.amazonaws.com/prod/visit";

    try {
        // 3. We send a POST request to trigger the Lambda atomic update
        let response = await fetch(apiUrl, {
            method: 'POST'
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        // 4. Parse the JSON response from your Lambda
        let data = await response.json();
        
        // 5. Update the UI with the value returned from DynamoDB
        // This assumes your Lambda returns: {"count": "value"}
        counter.innerHTML = data.count;
        
    } catch (error) {
        // Log errors to the console for SRE-style debugging
        console.error("Could not fetch the visitor counter:", error);
        
        // Fallback message if the API is unreachable
        counter.innerHTML = "Offline";
    }
}

// 6. Execute the function as soon as the script loads
updateCounter();