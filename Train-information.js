// document.addEventListener("DOMContentLoaded", function () {
//     const trainInput = document.getElementById("train-input");
//     const dropdownList = document.getElementById("train-dropdown-list");
//     const searchButton = document.getElementById("searchButton");
//     const trainNameElement = document.getElementById("train-name");
//     const trainRunsOnElement = document.getElementById("train-runs-on");
//     const trainRoutesElement = document.getElementById("train-routes");

//     let trains = []; // Declare the trains variable

//     // Fetch train data from the API
//     fetch("http://127.0.0.1:8000/trains/")
//         .then(response => response.json())
//         .then(data => {
//             trains = data; // Assign the fetched data to the trains variable
//             populateDropdown(trains);
//         })
//         .catch(error => {
//             console.error("Error fetching train data:", error);
//         });

//     function populateDropdown(trains) {
//         dropdownList.innerHTML = ''; // Clear existing options

//         trains.forEach(train => {
//             const listItem = document.createElement("li");
//             listItem.textContent = train.name;
//             listItem.classList.add("p-2", "cursor-pointer", "hover:bg-gray-100");

//             // Handle selecting an option
//             listItem.addEventListener("click", function () {
//                 trainInput.value = train.name;
//                 dropdownList.style.display = "none";
//             });

//             dropdownList.appendChild(listItem);
//         });
//     }

//     // Filter function
//     trainInput.addEventListener("input", function () {
//         const filter = trainInput.value.toLowerCase();
//         let hasVisibleItems = false;

//         dropdownList.querySelectorAll("li").forEach(function (option) {
//             const text = option.textContent.toLowerCase();
//             if (text.includes(filter)) {
//                 option.style.display = "block";
//                 hasVisibleItems = true;
//             } else {
//                 option.style.display = "none";
//             }
//         });

//         dropdownList.style.display = hasVisibleItems ? "block" : "none";
//     });

//     // Show dropdown when input is clicked or focused
//     trainInput.addEventListener("focus", function () {
//         dropdownList.style.display = "block";
//     });

//     // Hide dropdown if clicked outside
//     document.addEventListener("click", function (e) {
//         if (!e.target.closest(".search-box")) {
//             dropdownList.style.display = "none";
//         }
//     });

//     // Handle search button click
//     searchButton.addEventListener("click", function () {
//         const selectedTrainName = trainInput.value;
//         const selectedTrain = trains.find(train => train.name === selectedTrainName);

//         if (selectedTrain) {
//             displayTrainDetails(selectedTrain);
//         } else {
//             alert("Please select a valid train.");
//         }
//     });

//     function displayTrainDetails(train) {
//         trainNameElement.textContent = `${train.name} (${train.id})`;

//         // Clear existing routes
//         trainRoutesElement.innerHTML = '';
//         trainRunsOnElement.innerHTML = '';

//         // Display runs on
//         train.runs_on.forEach(day => {
//             const dayItem = document.createElement("li");
//             dayItem.textContent = day.day_name.substring(0, 3); // Display first three letters
//             trainRunsOnElement.appendChild(dayItem);
//         });

//         // Display routes
//         train.train_stations.forEach((station, index) => {
//             const routeDiv = document.createElement("div");
//             routeDiv.classList.add("border-b-2", "p-2");
//             const arrivalTime = station.arrival_time;
//             const departureTime = station.departure_time;

//             const halt = computeHalt(arrivalTime, departureTime);
//             const duration = computeDuration(arrivalTime, departureTime);

//             routeDiv.innerHTML = `
//                 <h3>${station.station_name}</h3>
//                 <div class="flex justify-between mb-3">
//                     <h3>Arrival: ${arrivalTime}</h3>
//                     <h3>Halt: ${halt}</h3>
//                     <h3>Departure: ${departureTime}</h3>
//                     <h3>Duration: ${duration}</h3>
//                 </div>
//             `;

//             trainRoutesElement.appendChild(routeDiv);
//         });
//     }

//     function computeHalt(arrivalTime, departureTime) {
//         const arrivalDate = new Date(`1970-01-01T${arrivalTime}`);
//         const departureDate = new Date(`1970-01-01T${departureTime}`);
    
//         // Calculate halt time in minutes
//         const haltTime = Math.round((departureDate - arrivalDate) / 60000); // Convert ms to minutes and round it
//         return `${haltTime}min`;
//     }
    
//     function computeDuration(arrivalTime, departureTime) {
//         const arrivalDate = new Date(`1970-01-01T${arrivalTime}`);
//         const departureDate = new Date(`1970-01-01T${departureTime}`);
    
//         // Calculate duration in minutes
//         const duration = Math.round((departureDate - arrivalDate) / 60000); // Convert ms to minutes and round it
//         const hours = Math.floor(duration / 60);
//         const minutes = duration % 60;
    
//         // Return formatted duration as "HH:mm"
//         return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}h`;
//     }
// });

document.addEventListener("DOMContentLoaded", function () {
    const trainInput = document.getElementById("train-input");
    const dropdownList = document.getElementById("train-dropdown-list");
    const searchButton = document.getElementById("searchButton");
    const trainNameElement = document.getElementById("train-name");
    const trainRunsOnElement = document.getElementById("train-runs-on");
    const trainRoutesElement = document.getElementById("train-routes");

    let trains = []; // Declare the trains variable

    // Fetch train data from the API
    fetch("http://127.0.0.1:8000/trains/")
        .then(response => response.json())
        .then(data => {
            trains = data; // Assign the fetched data to the trains variable
            populateDropdown(trains);
        })
        .catch(error => {
            console.error("Error fetching train data:", error);
        });

    function populateDropdown(trains) {
        dropdownList.innerHTML = ''; // Clear existing options

        trains.forEach(train => {
            const listItem = document.createElement("li");
            listItem.textContent = train.name;
            listItem.classList.add("p-2", "cursor-pointer", "hover:bg-gray-100");

            // Handle selecting an option
            listItem.addEventListener("click", function () {
                trainInput.value = train.name;
                dropdownList.style.display = "none";
            });

            dropdownList.appendChild(listItem);
        });
    }

    // Filter function
    trainInput.addEventListener("input", function () {
        const filter = trainInput.value.toLowerCase();
        let hasVisibleItems = false;

        dropdownList.querySelectorAll("li").forEach(function (option) {
            const text = option.textContent.toLowerCase();
            if (text.includes(filter)) {
                option.style.display = "block";
                hasVisibleItems = true;
            } else {
                option.style.display = "none";
            }
        });

        dropdownList.style.display = hasVisibleItems ? "block" : "none";
    });

    // Show dropdown when input is clicked or focused
    trainInput.addEventListener("focus", function () {
        dropdownList.style.display = "block";
    });

    // Hide dropdown if clicked outside
    document.addEventListener("click", function (e) {
        if (!e.target.closest(".search-box")) {
            dropdownList.style.display = "none";
        }
    });

    // Handle search button click
    searchButton.addEventListener("click", function () {
        const selectedTrainName = trainInput.value;
        const selectedTrain = trains.find(train => train.name === selectedTrainName);

        if (selectedTrain) {
            displayTrainDetails(selectedTrain);
        } else {
            alert("Please select a valid train.");
        }
    });

    // function displayTrainDetails(train) {
    //     trainNameElement.textContent = `${train.name} (${train.id})`;

    //     // Clear existing routes
    //     trainRoutesElement.innerHTML = '';
    //     trainRunsOnElement.innerHTML = '';

    //     // Display runs on
    //     train.runs_on.forEach(day => {
    //         const dayItem = document.createElement("li");
    //         dayItem.textContent = day.day_name.substring(0, 3); // Display first three letters
    //         trainRunsOnElement.appendChild(dayItem);
    //     });

    //     // Display routes
    //     train.train_stations.forEach((station, index) => {
    //         const routeDiv = document.createElement("div");
    //         routeDiv.classList.add("border-b-2", "p-2");
    //         const arrivalTime = station.arrival_time;
    //         const departureTime = station.departure_time;

    //         const halt = computeHalt(arrivalTime, departureTime);
    //         const duration = computeDuration(arrivalTime, departureTime);

    //         routeDiv.innerHTML = `
    //             <h3 class="">${station.station_name}</h3>
    //             <div class="flex justify-between mb-3">
    //                 <h3>Arrival: ${arrivalTime}</h3>
    //                 <h3>Halt: ${halt}</h3>
    //                 <h3>Departure: ${departureTime}</h3>
    //                 <h3>Duration: ${duration}</h3>
    //             </div>
    //         `;

    //         trainRoutesElement.appendChild(routeDiv);
    //     });
    // }
    function displayTrainDetails(train) {
        trainNameElement.textContent = `${train.name} (${train.id})`;
    
        // Clear existing routes
        trainRoutesElement.innerHTML = '';
        trainRunsOnElement.innerHTML = '';
    
        // All days of the week with their indices
        const allDays = [
            { name: "Sun", index: 0 },
            { name: "Mon", index: 1 },
            { name: "Tue", index: 2 },
            { name: "Wed", index: 3 },
            { name: "Thu", index: 4 },
            { name: "Fri", index: 5 },
            { name: "Sat", index: 6 },
        ];
    
        // Create a Set for faster lookup
        const runningDaysSet = new Set(train.runs_on);
    
        // Display runs on
        allDays.forEach(day => {
            const dayItem = document.createElement("li");
    
            // Check if the day is in the train's runs_on array
            const isRunning = runningDaysSet.has(day.index);
    
            if (isRunning) {
                dayItem.textContent = day.name; // Regular day
            } else {
                dayItem.innerHTML = `<span class="text-red-500 relative inline-block" style="top: -0.3em;">${day.name}<sup>†</sup></span>`; // Not running day with red color and superscript
            }
    
            trainRunsOnElement.appendChild(dayItem);
        });
    
        // Display routes
        train.train_stations.forEach((station) => {
            const routeDiv = document.createElement("div");
            routeDiv.classList.add("border-b-2", "p-2");
            const arrivalTime = station.arrival_time;
            const departureTime = station.departure_time;
    
            const halt = computeHalt(arrivalTime, departureTime);
            const duration = computeDuration(arrivalTime, departureTime);
    
            routeDiv.innerHTML = `
                <h3 class="font-bold text-green-500">${station.station_name}</h3>
                <div class="flex justify-between mb-3">
                    <h3>Arrival: ${arrivalTime}</h3>
                    <h3>Halt: ${halt}</h3>
                    <h3>Departure: ${departureTime}</h3>
                    <h3>Duration: ${duration}</h3>
                </div>
            `;
    
            trainRoutesElement.appendChild(routeDiv);
        });
    }
    
    
    
    function computeHalt(arrivalTime, departureTime) {
        const arrivalDate = new Date(`1970-01-01T${arrivalTime}`);
        const departureDate = new Date(`1970-01-01T${departureTime}`);

        // Calculate halt time in minutes
        const haltTime = Math.round((departureDate - arrivalDate) / 60000); // Convert ms to minutes and round it
        return `${haltTime}min`;
    }

    function computeDuration(arrivalTime, departureTime) {
        const arrivalDate = new Date(`1970-01-01T${arrivalTime}`);
        const departureDate = new Date(`1970-01-01T${departureTime}`);

        // Calculate duration in minutes
        const duration = Math.round((departureDate - arrivalDate) / 60000); // Convert ms to minutes and round it
        const hours = Math.floor(duration / 60);
        const minutes = duration % 60;

        // Return formatted duration as "HH:mm"
        return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}h`;
    }
});

