const container = document.getElementById('container');
const registerBtn = document.getElementById('register');
const loginBtn = document.getElementById('login');

registerBtn.addEventListener('click', () => {
    container.classList.add("active");
});

loginBtn.addEventListener('click', () => {
    container.classList.remove("active");
});

const form = document.querySelector('form');
form.addEventListener('submit', (e) => {
    e.preventDefault(); // Prevent the form from submitting traditionally
    
    const captchaResponse = grecaptcha.getResponse();
    
    if (captchaResponse.length === 0) {
        console.error("Captcha not completed");
        return; // Stop form submission if captcha is not completed
    }

    const fd = new FormData(e.target);
    const params = new URLSearchParams(fd);

    // fetch('http://localhost:3000/upload')
    // .then(response => response.text())
    // .then(data => console.log('Response:', data))
    // .catch(err => console.error('Error:', err));


    fetch('http://localhost:3000/upload', {
        method: "POST",
        body: params,
    })
    .then(res => {
        if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
    })
    .then(data => {
        if (data.captchaSuccess) {
            console.log("Form submitted successfully");
        } else {
            console.error("Form submission failed:", data.error);
        }
    })
    .catch(err => {
        console.error("Error during form submission:", err);
    });
});
