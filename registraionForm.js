
// document.addEventListener('DOMContentLoaded', () => {
//     // Mobile menu toggle
//     const menuButton = document.querySelector('#menu-button');
//     const mobileMenu = document.querySelector('#mobile-menu');
//     menuButton.addEventListener('click', () => {
//       mobileMenu.classList.toggle('hidden');
//     });
//   });
// alert("Hello! I am an alert box!");

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
    const confirmPasswordField = document.getElementById('confirm-password');

    // Function to fetch NID data based on NID number
    async function fetchNIDData(nidNumber) {
        try {
            const response = await fetch('https://rail-reserve-back-end.onrender.com/NID/list/');
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
        const mobileNumber = mobileField.value.trim();
        const nidNumber = nidField.value.trim();
        const postalCode = postalCodeField.value.trim();
        const dob = dobField.value.trim();
        const address = addressField.value.trim();
        const password = passwordField.value.trim();
        const confirmPassword = confirmPasswordField.value.trim();

        // Check if all fields are filled and if passwords match
        const allFieldsFilled = fullName && email && mobileNumber && nidNumber && postalCode && dob && address && password && confirmPassword && password === confirmPassword;

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
document.addEventListener("DOMContentLoaded", function() {
    const form = document.getElementById("registerForm");
    const signUpBtn = document.getElementById("signUpBtn");

    form.addEventListener('submit', function(e) {
        e.preventDefault();

        const formData = new FormData(form);

        // Convert formData to a plain object for easier manipulation if necessary
        const formObject = {};
        formData.forEach((value, key) => {
            formObject[key] = value;
        })

        fetch('https://rail-reserve-back-end.onrender.com/register/',{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formObject)
        })
        .then(response => response.json())
        .then(data => {
            console.log("Registration successful:", data);
        })
        .catch(err => {
            console.error("Error registering:", err);
            // Display error message to user
        });
    });
});