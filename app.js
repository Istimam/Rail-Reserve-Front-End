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
    const input = document.getElementById('class-input');
    const dropdownList = document.getElementById('dropdown-list');
    const icon = document.getElementById('dropdown-icon');

    input.addEventListener('focus', () => {
        dropdownList.classList.remove('hidden');
        icon.classList.add('rotate-180'); // Rotate the icon when focused
    });

    input.addEventListener('blur', () => {
        // Delay the hiding to allow click events on the dropdown items
        setTimeout(() => {
            dropdownList.classList.add('hidden');
            icon.classList.remove('rotate-180'); // Reset the icon when focus is lost
        }, 100);
    });

    // Handle click events on dropdown items
    dropdownList.querySelectorAll('li').forEach(item => {
        item.addEventListener('click', (e) => {
            input.value = e.target.textContent; // Set the input value to the clicked item
            dropdownList.classList.add('hidden'); // Hide the dropdown after selection
            icon.classList.remove('rotate-180');
            checkInputs(); // Check inputs when a class is selected
        });
    });

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
