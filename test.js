// script.js
// document.addEventListener('DOMContentLoaded', () => {
//     const stationsContainer = document.getElementById('stations-container');
//     const addStationButton = document.getElementById('add-station-button');
//     const trainForm = document.getElementById('train-form');
//     let stationCount = 0;

//     function addStationField() {
//         stationCount++;
//         const stationGroup = document.createElement('div');
//         stationGroup.className = 'station-group';
//         stationGroup.innerHTML = `
//             <input type="text" name="station-name-${stationCount}" placeholder="Station Name" required>
//             <input type="time" name="arrival-time-${stationCount}" required>
//             <input type="time" name="departure-time-${stationCount}" required>
//             <button type="button" class="remove-btn">x</button>
//         `;
//         stationsContainer.appendChild(stationGroup);

//         // Add event listener for the remove button
//         const removeButton = stationGroup.querySelector('.remove-btn');
//         removeButton.addEventListener('click', () => {
//             stationGroup.remove();
//         });
//     }

//     addStationButton.addEventListener('click', addStationField);

//     trainForm.addEventListener('submit', (event) => {
//         event.preventDefault();
//         const formData = new FormData(trainForm);
//         const stations = [];
        
//         for (let i = 1; i <= stationCount; i++) {
//             const stationName = formData.get(`station-name-${i}`);
//             const arrivalTime = formData.get(`arrival-time-${i}`);
//             const departureTime = formData.get(`departure-time-${i}`);
//             if (stationName && arrivalTime && departureTime) {
//                 stations.push({ 
//                     station_name: stationName, 
//                     arrival_time: arrivalTime, 
//                     departure_time: departureTime 
//                 });
//             }
//         }
        
//         const trainData = {
//             name: formData.get('train-name'),
//             stations: stations
//         };

//         fetch('http://127.0.0.1:8000/api/trains/', {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json'
//             },
//             body: JSON.stringify(trainData)
//         })
//         .then(response => response.json())
//         .then(data => {
//             console.log('Success:', data);
//         })
//         .catch((error) => {
//             console.error('Error:', error);
//         });
//     });
// });
document.addEventListener('DOMContentLoaded', () => {
  const dropdownBtn = document.getElementById('dropdown-btn');
  const dropdownMenu = document.getElementById('dropdown-menu');
  const coachList = document.getElementById('coach-list');
  const selectAllCheckbox = document.getElementById('select-all');

  console.log('JavaScript loaded'); // Check if this log appears

  // Function to fetch coach data and populate the dropdown
  function fetchCoachClasses() {
      fetch('http://127.0.0.1:8000/coach-class/')
          .then(response => response.json())
          .then(data => {
              console.log('Fetched data:', data); // Check fetched data
              populateDropdown(data);
          })
          .catch(error => {
              console.error('Error fetching coach classes:', error);
          });
  }

  // Function to populate the dropdown with checkboxes and labels
  function populateDropdown(coachClasses) {
      coachList.innerHTML = ''; // Clear previous options
      coachClasses.forEach(coach => {
          const li = document.createElement('li');
          li.classList.add('flex', 'items-center', 'px-4', 'py-2', 'hover:bg-green-100', 'cursor-pointer');

          const label = document.createElement('label');
          label.classList.add('flex', 'items-center', 'cursor-pointer', 'w-full');

          const checkbox = document.createElement('input');
          checkbox.type = 'checkbox';
          checkbox.value = coach.id;
          checkbox.classList.add('form-checkbox', 'h-4', 'w-4', 'text-indigo-600', 'border-gray-300', 'rounded');

          // Add event listener to update "Select All" when individual checkbox is clicked
          checkbox.addEventListener('change', updateSelectAllCheckbox);

          const span = document.createElement('span');
          span.textContent = coach.name;
          span.classList.add('ml-2', 'text-gray-700');

          label.appendChild(checkbox);
          label.appendChild(span);

          li.appendChild(label);
          coachList.appendChild(li);
      });
  }

  // Function to select or deselect all checkboxes
  function selectAllOptions() {
      console.log('Select All checkbox changed');
      const checkboxes = coachList.querySelectorAll('input[type="checkbox"]');
      checkboxes.forEach(checkbox => {
          checkbox.checked = selectAllCheckbox.checked;
      });
  }

  // Function to update "Select All" checkbox based on individual checkbox state
  function updateSelectAllCheckbox() {
      const checkboxes = coachList.querySelectorAll('input[type="checkbox"]');
      const allChecked = Array.from(checkboxes).every(checkbox => checkbox.checked);
      const someChecked = Array.from(checkboxes).some(checkbox => checkbox.checked);

      if (allChecked) {
          selectAllCheckbox.checked = true;
          selectAllCheckbox.indeterminate = false;
      } else if (someChecked) {
          selectAllCheckbox.checked = false;
          selectAllCheckbox.indeterminate = true;
      } else {
          selectAllCheckbox.checked = false;
          selectAllCheckbox.indeterminate = false;
      }
  }

  // Toggle dropdown visibility on button click
  dropdownBtn.addEventListener('click', (event) => {
      event.preventDefault();
      console.log('Dropdown button clicked');
      dropdownMenu.classList.toggle('hidden');
      // Directly manipulate style for debugging
      // if (dropdownMenu.classList.contains('hidden')) {
      //     dropdownMenu.style.display = 'none';
      // } else {
      //     dropdownMenu.style.display = 'block';
      // }
  });
  
  // Select/Deselect all on "Select All" checkbox toggle
  selectAllCheckbox.addEventListener('change', selectAllOptions);

  // Close dropdown if clicked outside
  document.addEventListener('click', (event) => {
      if (!dropdownBtn.contains(event.target) && !dropdownMenu.contains(event.target)) {
          dropdownMenu.classList.add('hidden');
      }
  });

  // Prevent reloading when clicking inside the dropdown
  dropdownMenu.addEventListener('click', (event) => {
      event.stopPropagation();
  });

  // Fetch coach classes when the page loads
  fetchCoachClasses();
});
  
  