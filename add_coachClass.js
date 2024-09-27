document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('coach-class-form').addEventListener('submit', async function(event) {
        event.preventDefault(); // Prevent the default form submission
        
        const classTitle = document.getElementById('classTitle').value.trim(); // Capture the value

        // Check if classTitle is empty after trimming whitespace
        if (!classTitle) {
            showToast('Class title cannot be empty.', 'error');
            return; // Exit early if the input is invalid
        }

        // Prepare the data to be sent
        const data = {
            coach_name: classTitle // Ensure this key matches your backend
        };
        console.log('Data being sent:', data); // Debugging: log the data

        try {
            const response = await fetch('http://127.0.0.1:8000/coach-classes/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            });

            const jsonResponse = await response.json(); // Get response JSON
            if (response.ok) {
                console.log('Success:', jsonResponse);
                showToast('Coach class added successfully!', 'success');
                document.getElementById('coach-class-form').reset(); // Reset the form
            } else {
                // Handle validation errors and display message in toast
                let errorMessage = 'Failed to add coach class.';
                
                if (jsonResponse.coach_name && Array.isArray(jsonResponse.coach_name)) {
                    // Extract error message from array if exists
                    errorMessage = jsonResponse.coach_name[0] || errorMessage;
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
