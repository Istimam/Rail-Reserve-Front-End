document.addEventListener("DOMContentLoaded", function () {
    const trainInput = document.getElementById("train-input");
    const dropdownList = document.getElementById("train-dropdown-list");

    // Fetch train data from the API
    fetch("https://rail-reserve-back-end.onrender.com/trains/")
        .then(response => response.json())
        .then(data => {
            populateDropdown(data);
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

    // Re-populate the dropdown when the input is clicked
    trainInput.addEventListener("click", function () {
        // Re-populate the dropdown to show all items if the input is clicked
        dropdownList.querySelectorAll("li").forEach(function (option) {
            option.style.display = "block";
        });
        dropdownList.style.display = "block";
    });

    // Hide dropdown if clicked outside
    document.addEventListener("click", function (e) {
        if (!e.target.closest(".search-box")) {
            dropdownList.style.display = "none";
        }
    });
});
