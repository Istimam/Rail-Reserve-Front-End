const container = document.getElementById('container');
const registerBtn = document.getElementById('register');
const loginBtn = document.getElementById('login');
registerBtn.addEventListener('click', () => {
    container.classList.add("active");
});

loginBtn.addEventListener('click', () => {
    container.classList.remove("active");
});

// NID and dob verification
document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById('registerForm');
    const verifyButton = document.getElementById('verifyButton');
    let captchaCompleted = false;

    function validateForm() {
        const mobileNumber = document.getElementById('mobileNumber').value.trim();
        const nidNumber = document.getElementById('nidNumber').value.trim();
        const dob = document.getElementById('dob').value.trim();
    
        // Check if all inputs and CAPTCHA are filled
        const allFieldsFilled = mobileNumber && nidNumber && dob && captchaCompleted;
    
        // Enable or disable the button based on whether all fields and CAPTCHA are filled
        verifyButton.disabled = !allFieldsFilled;
    
        // Update button styles based on its state
        if (allFieldsFilled) {
            console.log("All fields are filled, and CAPTCHA is completed");
            verifyButton.style.backgroundColor = '#166b09'; // Set to green when all fields are filled
        } else {
            console.log("Please fill all the fields and complete the CAPTCHA");
            verifyButton.style.backgroundColor = '#bbbdbb'; // Set to gray when fields are not filled
        }
    }
    
    // Attach the validateForm function to input fields and CAPTCHA
    document.getElementById('mobileNumber').addEventListener('input', validateForm);
    document.getElementById('nidNumber').addEventListener('input', validateForm);
    document.getElementById('dob').addEventListener('input', validateForm);

    // CAPTCHA callback function when CAPTCHA is completed
    window.captchaVerified = function() {
        captchaCompleted = true;
        validateForm(); // Revalidate form to check all conditions
    };

    // CAPTCHA callback function when CAPTCHA expires or is reset
    window.captchaExpired = function() {
        captchaCompleted = false;
        validateForm(); // Revalidate form to check all conditions
    };
    
    // Initial check
    validateForm();
    
    form.addEventListener('submit', (e) => {
        e.preventDefault(); // Prevent the form from submitting traditionally
        
        const captchaResponse = grecaptcha.getResponse();
        
        if (captchaResponse.length === 0) {
            console.error("Captcha not completed");
            return; // Stop form submission if captcha is not completed
        }

        const fd = new FormData(e.target);
        const mobileNumber = fd.get('mobileNumber');
        const nidNumber = fd.get('nidNumber');
        const dob = fd.get('dob');

        // Clear previous error messages
        document.getElementById('mobileNumberError').textContent = '';
        document.getElementById('nidNumberError').textContent = '';
        document.getElementById('dobError').textContent = '';

        // Check if the mobile number or NID number already exists
        fetch(`https://rail-reserve-back-end.onrender.com/users/?mobile=${encodeURIComponent(mobileNumber)}&nid=${encodeURIComponent(nidNumber)}`)
        .then(response => response.json())
        .then(existenceData => {
            console.log("User existence check response:", existenceData);

            // Determine if the mobile or NID exists
            const mobileExists = existenceData.some(user => user.phone_no === mobileNumber);
            const nidExists = existenceData.some(user => user.nid_number === nidNumber);

            if (!mobileExists && !nidExists) {
                // Proceed with NID validation if both are unique
                fetch(`http://127.0.0.1:8000/NID/list/`)
                .then(response => response.json())
                .then(nidData => {
                    console.log("NID validation response:", nidData);

                    const nidMatch = nidData.results.find(nid => 
                        nid.id_number === nidNumber && nid.id_date_of_birth === dob
                    );

                    if (nidMatch) {
                        console.log("NID and Date of Birth matched successfully");
                        // Encoding the parameters to handle special characters
                        const queryParams = new URLSearchParams({
                            nid: nidNumber,
                            mobile: mobileNumber
                        }).toString();
                        // Redirect or proceed as needed
                        window.location.href = `/Rail_Reserve%20Front-End/registrationForm.html?${queryParams}`;
                    } else {
                        console.error("NID and Date of Birth didn't match");
                        document.getElementById('nidNumberError').textContent = "NID number and Date of Birth didn't match";
                    }
                })
                .catch(err => {
                    console.error("Error during NID validation:", err);
                    document.getElementById('nidNumberError').textContent = "An error occurred during NID validation.";
                });
            } else {
                console.error("Mobile number or NID number already exists");
                if (mobileExists) {
                    document.getElementById('mobileNumberError').textContent = "Mobile number already exists.";
                }
                if (nidExists) {
                    document.getElementById('nidNumberError').textContent = "NID number already exists.";
                }
            }
        })
        .catch(err => {
            console.error("Error during user existence check:", err);
            document.getElementById('mobileNumberError').textContent = "An error occurred during uniqueness check.";
            document.getElementById('nidNumberError').textContent = "An error occurred during uniqueness check.";
        });

    });
});

// Login form submission
// document.getElementById('loginForm').addEventListener('submit', async function(event){
//     event.preventDefault();
//     const phone_no = document.getElementById('phoneNumber').value;
//     const password = document.getElementById('password').value;
//     console.log('Phone number: ' + phone_no + ' Password: ' + password);
//     try {
//         const response = await fetch('http://127.0.0.1:8000/login/',{
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json'
//             },
//             body: JSON.stringify({
//                 phone_no: phone_no, 
//                 password: password
//             })
//         });

//         const data = await response.json();
        
//         if (response.ok) {
//             const token = data.token;
//             const userId = data.user_id;

//             // Store the token and userId securely
            
//             alert('Login successful!');
            
//             // Redirect to another page, e.g., the homepage
//             window.location.href = '/Rail_Reserve%20Front-End/index.html';
            
//         } else {
//             alert('Login failed: ' + (data.detail || 'Unknown error'));
//             console.log(data);
//         }
//     } catch (error) {
//         console.error('Error during login:', error);
//     }
// });
document.getElementById('loginForm').addEventListener('submit', async function(event) {
    event.preventDefault();

    // Get values from form inputs
    const phone_no = document.getElementById('phoneNumber').value;
    const password = document.getElementById('password').value;

    console.log('Phone number: ' + phone_no + ' Password: ' + password);

    try {
        // Send login request to server
        const response = await fetch('http://127.0.0.1:8000/login/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                phone_no: phone_no,
                password: password
            })
        });

        const data = await response.json();

        if (response.ok) {
            // Store the token and user ID in localStorage
            localStorage.setItem('authToken', data.token);
            localStorage.setItem('userId', data.user_id);

            alert('Login successful!');

            // Redirect to the homepage or another page after successful login
            window.location.href = '/Rail_Reserve%20Front-End/index.html';
        } else {
            // If login fails, show the error message returned by the backend
            alert('Login failed: ' + (data.detail || 'Unknown error'));
            console.log(data);
        }
    } catch (error) {
        // Handle any errors that occur during the request
        console.error('Error during login:', error);
        alert('An error occurred. Please try again.');
    }
});

// For authourization 
// const token = localStorage.getItem('authToken');

// fetch('http://127.0.0.1:8000/protected-resource/', {
//     method: 'GET',
//     headers: {
//         'Authorization': `Token ${token}`,  // Include the token in the Authorization header
//         'Content-Type': 'application/json'
//     }
// }).then(response => response.json())
//   .then(data => {
    //       console.log(data);
    //   })
    //   .catch(error => {
        //       console.error('Error fetching protected resource:', error);
        //   });

// For Logout
        // function logout() {
//     localStorage.removeItem('authToken');
//     localStorage.removeItem('userId');
//     alert('Logged out successfully!');
//     window.location.href = '/login.html';  // Redirect to the login page
// }
