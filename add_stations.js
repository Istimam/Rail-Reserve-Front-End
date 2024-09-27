document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('add-station-form').addEventListener('submit', async function(event) {
        event.preventDefault(); // Prevent the default form submission
        
        const classTitle = document.getElementById('stationTitle').value.trim(); // Capture the value

        // Check if classTitle is empty after trimming whitespace
        if (!classTitle) {
            showToast('Station Name cannot be empty.', 'error');
            return; // Exit early if the input is invalid
        }

        // Prepare the data to be sent
        const data = {
            name: classTitle // Ensure this key matches your backend
        };
        console.log('Data being sent:', data); // Debugging: log the data

        try {
            const response = await fetch('http://127.0.0.1:8000/stations/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            });

            const jsonResponse = await response.json(); // Get response JSON
            if (response.ok) {
                console.log('Success:', jsonResponse);
                showToast('Station added successfully!', 'success');
                document.getElementById('add-station-form').reset(); // Reset the form
            } else {
                // Handle validation errors and display message in toast
                let errorMessage = 'Failed to add Station.';
                
                if (jsonResponse.name && Array.isArray(jsonResponse.name)) {
                    // Extract error message from array if exists
                    errorMessage = jsonResponse.name[0] || errorMessage;
                }
                
                console.error('Error:', jsonResponse);
                showToast(errorMessage, 'error'); // Display the specific error message
            }
        } catch (error) {
            console.error('Error:', error);
            showToast('An error occurred. Please try again.', 'error');
        }
    });
});
