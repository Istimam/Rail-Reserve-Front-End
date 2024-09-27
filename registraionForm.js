document.addEventListener('DOMContentLoaded', async () => {
    const params = new URLSearchParams(window.location.search);
    const nidNo = params.get('nid');
    const mobileNo = params.get('mobile');

    const signUpBtn = document.getElementById('signUpBtn');
    const fullNameField = document.getElementById('full-name');
    const emailField = document.getElementById('email');
    const mobileField = document.getElementById('mobile');
    const nidField = document.getElementById('nid');
    const postalCodeField = document.getElementById('postcode');
    const dobField = document.getElementById('dob');
    const addressField = document.getElementById('address');
    const passwordField = document.getElementById('password');
    const confirmPasswordField = document.getElementById('confirm_password');
    // Function to fetch NID data based on NID number
    async function fetchNIDData(nidNumber) {
        try {
            const response = await fetch('http://127.0.0.1:8000/NID/list/');
            const data = await response.json();
            return data.results.find(nid => nid.id_number === nidNumber);
        } catch (error) {
            console.error('Error fetching NID data:', error);
            return null;
        }
    }

    // Function to pre-fill the form if NID data is found
    async function preFillForm(nidNo) {
        const nidData = await fetchNIDData(nidNo);
        if (nidData) {
            fullNameField.value = nidData.id_name;
            mobileField.value = mobileNo;
            nidField.value = nidData.id_number;
            // postalCodeField.value = ''; // Add logic if postal code is part of NID data
            dobField.value = nidData.id_date_of_birth;
            // addressField.value = nidData.id_address;

            // Make fields read-only
            fullNameField.readOnly = true;
            mobileField.readOnly = true;
            nidField.readOnly = true;
            // postalCodeField.readOnly = true;
            dobField.readOnly = true;
            // addressField.readOnly = true;
        }
    }

    // Validate form fields
    function validateForm() {
        const fullName = fullNameField.value.trim();
        const email = emailField.value.trim();
        const phone_no = mobileField.value.trim();
        const nidNumber = nidField.value.trim();
        const postcode = postalCodeField.value.trim();
        const date_of_birth = dobField.value.trim();
        const address = addressField.value.trim();
        const password = passwordField.value.trim();
        const password2 = confirmPasswordField.value.trim();
    
        // Check if all fields are filled and if passwords match
        const allFieldsFilled = fullName && email && phone_no && nidNumber && postcode && date_of_birth && address && password && password2 && password === password2;

        // Enable/disable button based on validation
        signUpBtn.disabled = !allFieldsFilled;

        // Change button color based on validation status
        signUpBtn.style.backgroundColor = allFieldsFilled ? '#166b09' : '#bbbdbb';
    }

    // Initial form validation and pre-fill if params are present
    if (nidNo && mobileNo) {
        await preFillForm(nidNo);
    }

    // Add event listeners to validate form
    document.querySelectorAll('#full-name, #email, #mobile, #nid, #postcode, #dob, #address, #password, #confirm-password').forEach(input => {
        input.addEventListener('input', validateForm);
    });

    // Initial check in case form is pre-filled
    validateForm();
});

// creating an account 
// document.addEventListener("DOMContentLoaded", function() {
//     const form = document.getElementById("registerForm");
//     const signUpBtn = document.getElementById("signUpBtn");

//     form.addEventListener('submit', function(e) {
//         e.preventDefault();

//         const formData = new FormData(form);

//         // Convert formData to a plain object for easier manipulation if necessary
//         const formObject = {};
//         formData.forEach((value, key) => {
//             formObject[key] = value;
//         })
//         console.log('Payload Data:', formObject);
//         fetch('http://127.0.0.1:8000/register/',{
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json'
//             },
//             body: JSON.stringify(formObject)
//         })
//         .then(response => response.json())
//         .then(data => {
//             console.log("Registration successful:", data);
//         })
//         .catch(err => {
//             console.error("Error registering:", err);
//             // Display error message to user
//         });
//     });
// });

document.addEventListener("DOMContentLoaded", function() {
    const form = document.getElementById("registerForm");

    form.addEventListener('submit', function(e) {
        e.preventDefault();

        const formData = new FormData(form);

        // Convert formData to a plain object
        const formObject = {};
        formData.forEach((value, key) => {
            formObject[key] = value;
        });

        console.log('Payload Data:', formObject);

        // Send the form data to the backend
        fetch('http://127.0.0.1:8000/register/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formObject)
        })
        .then(response => response.json())
        .then(data => {
            // Show success toast
            showToast("Check your mail for the Confirmation Link");

            // Redirect to login after a delay
            setTimeout(() => {
                window.location.href = '/Rail_Reserve%20Front-End/login.html'; // Update this URL to your login page
            }, 3000); // Redirect after 3 seconds
        })
        .catch(err => {
            console.error("Error registering:", err);
            showToast("Error occurred during registration. Please try again.", 'error');
        });
    });
});
