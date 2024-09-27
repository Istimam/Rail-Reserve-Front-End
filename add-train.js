document.addEventListener('DOMContentLoaded', () => {
    const stationsContainer = document.getElementById('stations-container');
    const addStationButton = document.getElementById('add-station-button');
    let stations = [];
    let stationCount = 0;
    let usedStations = new Set();

    // Fetch station data from the API
    fetch('http://127.0.0.1:8000/stations/')
        .then(response => response.json())
        .then(data => {
            stations = data;  // Save the fetched station data
        })
        .catch(error => console.error('Error fetching stations:', error));

    // Function to add station input fields
    function addStationField() {
        stationCount++;
        const stationGroup = document.createElement('div');
        stationGroup.className = 'station-group';
        stationGroup.innerHTML = `
            <input type="text" id="station-name-${stationCount}" name="station-name-${stationCount}" placeholder="Station Name" required autocomplete="off">
            <ul id="station-suggestions-${stationCount}" class="suggestions"></ul>
            <input type="time" name="arrival-time-${stationCount}" required>
            <input type="time" name="departure-time-${stationCount}" required>
            <button type="button" class="remove-btn">x</button>
        `;
        stationsContainer.appendChild(stationGroup);

        const stationInput = stationGroup.querySelector(`#station-name-${stationCount}`);
        const suggestionsBox = stationGroup.querySelector(`#station-suggestions-${stationCount}`);

        // Add event listener for station input to show suggestions
        stationInput.addEventListener('input', () => showSuggestions(stationInput, suggestionsBox));
        stationInput.addEventListener('focus', () => showSuggestions(stationInput, suggestionsBox));

        // Add event listener for station removal
        const removeBtn = stationGroup.querySelector('.remove-btn');
        removeBtn.addEventListener('click', () => {
            const stationName = stationInput.value;
            if (stationName) {
                usedStations.delete(stationName);  // Remove from used stations
            }
            stationGroup.remove();
            stationCount--;
        });

        // Initialize the used stations set
        updateUsedStations();
    }

    addStationButton.addEventListener('click', addStationField);

    // Function to update the used stations set
    function updateUsedStations() {
        usedStations.clear();
        const allInputs = document.querySelectorAll('input[id^="station-name-"]');
        allInputs.forEach(input => {
            const value = input.value.trim();
            if (value) {
                usedStations.add(value);
            }
        });
    }

    // Function to show autocomplete suggestions
    function showSuggestions(inputElement, suggestionsBox) {
        updateUsedStations();  // Update the used stations

        // Hide all other suggestions
        document.querySelectorAll('.suggestions').forEach(box => {
            if (box !== suggestionsBox) {
                box.innerHTML = '';  // Clear other suggestion boxes
            }
        });

        // Make sure only the current suggestions box is visible
        suggestionsBox.style.display = 'block';

        const query = inputElement.value.toLowerCase();

        // Filter available stations based on the input value and remove used stations from the list
        const filteredStations = stations.filter(station =>
            station.name.toLowerCase().includes(query) && !usedStations.has(station.name)
        );

        // Clear previous suggestions
        suggestionsBox.innerHTML = '';

        // Create a suggestion item for each matching station
        filteredStations.forEach(station => {
            const suggestionItem = document.createElement('li');
            suggestionItem.textContent = station.name;
            suggestionItem.classList.add('suggestion-item');

            // Add event listener for when a suggestion is clicked
            suggestionItem.addEventListener('click', () => {
                inputElement.value = station.name;  // Set the selected station name in the input
                usedStations.add(station.name);  // Add to used stations
                suggestionsBox.innerHTML = '';  // Clear suggestions once a station is selected
                suggestionsBox.style.display = 'none';  // Hide suggestions after selection
            });

            suggestionsBox.appendChild(suggestionItem);
        });
    }

    // Hide suggestions when clicking outside the input fields
    document.addEventListener('click', (event) => {
        if (!event.target.closest('.station-group input')) {
            document.querySelectorAll('.suggestions').forEach(box => {
                box.innerHTML = '';  // Clear all suggestion boxes
            });
        }
    });
});

// collecting station data 
// function collectStationData() {
//     const stationGroups = document.querySelectorAll('.station-group');
//     const stationData = [];
//     stationGroups.forEach((stationGroup, index) => {
//         const stationName = stationGroup.querySelector(`input[name="station-name-${index + 1}"]`).value.trim();
//         const arrivalTime = stationGroup.querySelector(`input[name="arrival-time-${index + 1}"]`).value;
//         const departureTime = stationGroup.querySelector(`input[name="departure-time-${index + 1}"]`).value;

//         if (stationName && arrivalTime && departureTime) {
//             stationData.push({
//                 station_name: stationName,
//                 arrival_time: arrivalTime,
//                 departure_time: departureTime
//             });
//         }
//     });
//     return stationData;
// }
function collectStationData() {
    const stationGroups = document.querySelectorAll('.station-group');
    const stationData = [];

    stationGroups.forEach(stationGroup => {
        // Directly access the inputs from the station group container
        const stationName = stationGroup.querySelector('input[name^="station-name"]').value.trim();
        const arrivalTime = stationGroup.querySelector('input[name^="arrival-time"]').value;
        const departureTime = stationGroup.querySelector('input[name^="departure-time"]').value;

        // Ensure all fields are filled
        if (stationName && arrivalTime && departureTime) {
            stationData.push({
                station_name: stationName,
                arrival_time: arrivalTime,
                departure_time: departureTime
            });
        }
    });
    // console.log('Station Data:', stationData);
    return stationData;
}

const apiUrl = 'http://127.0.0.1:8000/coach-classes/'; // API URL
let selectedClasses = []; // Array to store selected values
let dropdownOpen = false; // Track dropdown state

// Function to toggle the dropdown visibility
function toggleDropdown(event) {
    event.preventDefault(); // Prevent button from reloading page
    const dropdownMenu = document.getElementById('dropdownMenu');
    dropdownOpen = !dropdownOpen; // Toggle dropdown state
    dropdownMenu.classList.toggle('hidden', !dropdownOpen);
}

// Fetch data from API and populate the dropdown options
async function fetchClasses() {
    try {
        const response = await fetch(apiUrl);
        const data = await response.json();

        const dropdownOptions = document.getElementById('dropdownOptions');
        dropdownOptions.innerHTML = ''; // Clear any existing options

        data.forEach((item) => {
            const li = document.createElement('li');
            li.innerHTML = `
                <label class="inline-flex items-center">
                    <input type="checkbox" class="form-checkbox" value="${item.coach_name}" onchange="handleSelectChange(this)">
                    <span class="ml-2">${item.coach_name}</span>
                </label>
            `;
            dropdownOptions.appendChild(li);
        });
    } catch (error) {
        console.error('Error fetching coach classes:', error);
    }
}

// Handle checkbox selection
function handleSelectChange(checkbox) {
    const value = checkbox.value;
    if (checkbox.checked) {
        selectedClasses.push(value);
    } else {
        selectedClasses = selectedClasses.filter((item) => item !== value);
    }
    console.log('Selected Classes:', selectedClasses);
}

// Close the dropdown if clicked outside
document.addEventListener('click', function(event) {
    const dropdownMenu = document.getElementById('dropdownMenu');
    const dropdownButton = document.getElementById('dropdownButton');
    
    // If click is outside dropdown and button, close the dropdown
    if (!dropdownButton.contains(event.target) && !dropdownMenu.contains(event.target)) {
        dropdownMenu.classList.add('hidden');
        dropdownOpen = false;
    }
});

// Fetch and populate dropdown on page load
window.onload = function() {
    fetchClasses();
};
// Data collecting choosen coach class data 
function collectSelectedClasses() {
    // Collect all checked checkboxes in the dropdown
    const selectedClasses = [];
    const checkboxes = document.querySelectorAll('#dropdownOptions input[type="checkbox"]:checked');

    checkboxes.forEach(checkbox => {
        selectedClasses.push(checkbox.nextElementSibling.textContent.trim()); // Add the value of the checked checkbox to the array
    });

    return selectedClasses;
}
// Function to get selected days
function getSelectedDays(weekList) {
    const checkboxes = weekList.querySelectorAll('input[type="checkbox"]'); // Get all checkboxes
    const selectedDays = [];

    checkboxes.forEach(checkbox => {
        if (checkbox.checked) {
            selectedDays.push(checkbox.value); // Add the value (day name) of the checked checkbox to the array
        }
    });

    return selectedDays; // Return an array of selected day names
}

// Implementation of days dropdownMenu 
document.addEventListener('DOMContentLoaded', () => {
    const weekDropdownBtn = document.getElementById('week-dropdown-btn');
    const weekDropdownMenu = document.getElementById('week-dropdown-menu');
    const weekList = document.getElementById('week-list');
    const weekDaysContainer = document.getElementById('week-days');
    const selectAllBtn = document.getElementById('select-all-btn');

    // Fetch days from the "runs-on" API and populate the dropdown
    function fetchWeeks() {
        fetch('http://127.0.0.1:8000/runs-on/')  // Use the updated API URL
            .then(response => response.json())
            .then(data => {
                console.log(data);
                populateWeekDropdown(data);
            })
            .catch(error => {
                console.error('Error fetching runs-on data:', error);
            });
    }

    // Populate the dropdown with week options (as checkboxes)
    function populateWeekDropdown(weeks) {
        weekList.innerHTML = ''; // Clear previous options
        weeks.forEach((week, index) => {
            const li = document.createElement('li');
            li.classList.add('flex', 'items-center', 'px-4', 'py-2', 'hover:bg-green-100', 'cursor-pointer');
            
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.classList.add('mr-2');
            checkbox.value = week.day_name; // Store the day_name directly
            checkbox.id = `week-${index}`;
            checkbox.name = `week-${index}`;
    
            const label = document.createElement('label');
            label.setAttribute('for', `week-${index}`);
            label.textContent = week.day_name; // Display the day_name
    
            li.appendChild(checkbox);
            li.appendChild(label);
            weekList.appendChild(li);
        });
    }
    
    selectAllBtn.addEventListener('click', (event) => {
        event.preventDefault();
        const checkboxes = weekList.querySelectorAll('input[type="checkbox"]');
        const allChecked = [...checkboxes].every(cb => cb.checked);
    
        // Toggle all checkboxes
        checkboxes.forEach(checkbox => {
            checkbox.checked = !allChecked;
        });
    });
    
    // Toggle dropdown visibility on button click
    weekDropdownBtn.addEventListener('click', (event) => {
        event.preventDefault();
        weekDropdownMenu.classList.toggle('hidden');
    });

    // Close dropdown if clicked outside
    document.addEventListener('click', (event) => {
        if (!weekDropdownBtn.contains(event.target) && !weekDropdownMenu.contains(event.target)) {
            weekDropdownMenu.classList.add('hidden');
        }
    });

    // Prevent reloading when clicking inside the dropdown
    weekDropdownMenu.addEventListener('click', (event) => {
        event.stopPropagation();
    });

    // Fetch the "runs-on" data when the page loads
    fetchWeeks();
});



// Implementation of erro handling & Create a new Train object
document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('form');
    const stationsContainer = document.getElementById('stations-container');
    const dropdownOptions = document.getElementById('dropdownOptions');
    const weekList = document.getElementById('week-list');
    const errorContainer = document.createElement('div');

    errorContainer.className = 'error-messages text-red-500 mt-4';
    form.appendChild(errorContainer);

    function validateForm() {
        let isValid = true;
        let errors = [];

        // Check if stations are added
        const stationInputs = document.querySelectorAll('input[id^="station-name-"]');
        const hasStations = [...stationInputs].some(input => input.value.trim() !== '');
        if (!hasStations) {
            errors.push('At least one station must be added.');
        }

        // Check if at least one coach is selected
        const selectedClasses = Array.from(dropdownOptions.querySelectorAll('input[type="checkbox"]:checked'));
        if (selectedClasses.length === 0) {
            errors.push('At least one coach class must be selected.');
        }

        // Check if at least one day is selected
        const selectedDays = Array.from(weekList.querySelectorAll('input[type="checkbox"]:checked'));
        if (selectedDays.length === 0) {
            errors.push('At least one day must be selected.');
        }

        // Show errors if there are any
        errorContainer.innerHTML = '';
        if (errors.length > 0) {
            errors.forEach(error => {
                const errorItem = document.createElement('div');
                errorItem.textContent = error;
                errorContainer.appendChild(errorItem);
            });
            isValid = false; // Set valid to false if there are errors
        }

        return isValid; // Return the validity status
    }

    // Handle form submission
    document.getElementById('train-form').addEventListener('submit', function (event) {
        event.preventDefault(); // Prevent default form submission

        // Step 1: Validate the form
        if (!validateForm()) {
            return; // Exit if validation fails
        }

        // Step 2: Collect form data if validation passes
        const trainName = document.getElementById('train-name').value;
        const stations = collectStationData();  // Function to collect station data
        const selectedClasses = collectSelectedClasses();  // Function to collect coach class data
        const weekList = document.getElementById('week-list');
        const selectedDays = getSelectedDays(weekList);

        // Prepare the train data
        const trainData = {
            name: trainName,
            coach_classes: selectedClasses.map(cls => ({ coach_name: cls })),
            runs_on: selectedDays.map(day => ({ day_name: day })),
            train_stations: stations.map(station => ({
                station_name: station.station_name,
                arrival_time: station.arrival_time,
                departure_time: station.departure_time
            }))
        };
        console.log('Train Data Payload:', trainData);

        // Step 3: Make POST request to the `/trains/` endpoint
        fetch('http://127.0.0.1:8000/trains/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(trainData)
        })
        .then(response => {
            // Check if the response is ok
            if (!response.ok) {
                return response.json().then(error => {
                    throw new Error(error.detail || 'Failed to create train'); // Use error.detail or a default message
                });
            }
            return response.json(); // Return JSON data if response is OK
        })
        .then(data => {
            // Handle successful response
            console.log('Train created successfully:', data);
            alert('Train created successfully!');
        })
        .catch(error => {
            console.error('Error:', error);
            // Show the error message in the error container
            errorContainer.innerHTML = ''; // Clear previous error messages
            const errorItem = document.createElement('div');
            errorItem.textContent = error.message; // Display the specific error from backend
            errorContainer.appendChild(errorItem);
        });
    });
});



