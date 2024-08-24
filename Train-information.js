document.addEventListener('DOMContentLoaded', function() {
    const trainInput = document.getElementById('train-input');
    const dropdownList = document.getElementById('train-dropdown-list');

    // Fetch Train Data
    fetch('https://rail-reserve-back-end.onrender.com/trains/')
        .then(response => response.json())
        .then(data => {
            console.log('API Response:', data); // Confirm the data format

            const trains = data;

            if (Array.isArray(trains)) {
                trains.forEach(train => {
                    const listItem = document.createElement('li');
                    listItem.classList.add('p-2', 'cursor-pointer', 'hover:bg-blue-50');
                    listItem.textContent = train.name;
                    listItem.addEventListener('click', function() {
                        trainInput.value = train.name;
                        dropdownList.classList.add('hidden'); // Hide dropdown on selection
                    });
                    dropdownList.appendChild(listItem);
                });
            } else {
                console.error('Expected an array of trains but got:', trains);
            }
        })
        .catch(error => console.error('Error fetching train data:', error));

    // Toggle Dropdown on Input Click
    trainInput.addEventListener('click', function() {
        dropdownList.classList.toggle('hidden');
    });

    // Hide Dropdown on Outside Click
    document.addEventListener('click', function(event) {
        if (!trainInput.contains(event.target) && !dropdownList.contains(event.target)) {
            dropdownList.classList.add('hidden');
        }
    });
});
