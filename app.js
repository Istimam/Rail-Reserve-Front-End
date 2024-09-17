document.addEventListener("DOMContentLoaded", function() {
    // Admin setting for number of days available to select from today
    const maxDays = 3; // Example: Admin allows selecting from the next 3 days

    // Initialize Flatpickr on the input field
    const datePicker = flatpickr("#datePicker", {
        dateFormat: "d-M-Y",  // Format of the selected date with short month name
        minDate: "today",     // Disable past dates
        maxDate: new Date().fp_incr(maxDays) // Set the maximum selectable date
    });

    // Add event listener to the calendar icon
    const calendarIcon = document.querySelector('.calendar-icon');
    calendarIcon.addEventListener('click', function() {
        datePicker.open(); // Opens the Flatpickr calendar
    });

    // Class selection
    const classInput = document.getElementById('class-input');
    const dropdownList = document.getElementById('dropdown-list');
    const icon = document.getElementById('dropdown-icon');
    
    // Fetch and populate coach classes
    fetch('https://rail-reserve-back-end.onrender.com/coach-class/')
        .then(response => response.json())
        .then(data => {
            dropdownList.innerHTML = '';
            data.forEach(coachClass => {
                const li = document.createElement('li');
                li.textContent = coachClass.name;
                li.className = 'p-2 cursor-pointer hover:bg-green-100';
                dropdownList.appendChild(li);

                li.addEventListener('click', function() {
                    classInput.value = coachClass.name; // Set input box value
                    dropdownList.classList.add('hidden'); // Hide dropdown after selection
                    icon.classList.remove('rotate-180'); // Reset icon rotation
                });
            });
        })
        .catch(error => {
            console.error('Error fetching coach classes:', error);
        });

    // Toggle dropdown visibility and icon rotation
    classInput.addEventListener('click', function() {
        dropdownList.classList.toggle('hidden');
        icon.classList.toggle('rotate-180'); // Rotate icon on click
    });

    // Hide dropdown when clicking outside
    document.addEventListener('click', function(event) {
        if (!classInput.contains(event.target) && !dropdownList.contains(event.target)) {
            dropdownList.classList.add('hidden'); // Hide dropdown
            icon.classList.remove('rotate-180'); // Reset icon rotation
        }
    });

    // checking all the boxes are populated 
    function checkInputs() {
        const fromInput = document.getElementById('input-box-from').value.trim();
        const toInput = document.getElementById('input-box-to').value.trim();
        const dateInput = document.getElementById('datePicker').value.trim();
        const classInput = document.getElementById('class-input').value.trim();
        const searchButton = document.getElementById('searchButton');
    
        // Check if all inputs are non-empty
        const allFieldsFilled = fromInput && toInput && dateInput && classInput;
    
        // Enable or disable the button based on whether all fields are filled
        searchButton.disabled = !allFieldsFilled;
    
        // Update button styles based on its state
        if (allFieldsFilled) {
            searchButton.classList.remove('bg-gray-300');
            searchButton.classList.add('bg-green-500');
        } else {
            searchButton.classList.add('bg-gray-300');
            searchButton.classList.remove('bg-green-500');
        }
    }
    
    // Attach the checkInputs function to input fields
    document.getElementById('input-box-from').addEventListener('input', checkInputs);
    document.getElementById('input-box-to').addEventListener('input', checkInputs);
    document.getElementById('datePicker').addEventListener('input', checkInputs);
    document.getElementById('class-input').addEventListener('input', checkInputs);
    
    
});

