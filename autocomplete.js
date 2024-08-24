let availableKeywords = [];

// Fetch station data from the API
fetch('https://rail-reserve-back-end.onrender.com/stations/')
    .then(response => {
        console.log('Response Status:', response.status); // Log status code
        if (!response.ok) {
            throw new Error(`Network response was not ok: ${response.statusText}`);
        }
        return response.json();
    })
    .then(data => {
        // Log the data received from the API
        console.log('Data received:', data);

        // Map the station names into the availableKeywords array
        availableKeywords = data.map(station => station.name);
        console.log('Available Keywords:', availableKeywords);
    })
    .catch(error => {
        console.error('Error fetching station data:', error);
    });

const resultBoxFrom = document.querySelector(".result-box-from");
const inputBoxFrom = document.getElementById("input-box-from");

const resultBoxTo = document.querySelector(".result-box-to");
const inputBoxTo = document.getElementById("input-box-to");

inputBoxFrom.onkeyup = function () {
    let result = [];
    let input = inputBoxFrom.value;
    if (input.length) {
        result = availableKeywords.filter((keyword) => {
            return keyword.toLowerCase().includes(input.toLowerCase()) && keyword !== inputBoxTo.value;
        });
    }
    display(result, resultBoxFrom);
};

inputBoxTo.onkeyup = function () {
    let result = [];
    let input = inputBoxTo.value;
    if (input.length) {
        result = availableKeywords.filter((keyword) => {
            return keyword.toLowerCase().includes(input.toLowerCase()) && keyword !== inputBoxFrom.value;
        });
    }
    display(result, resultBoxTo);
};

function display(result, resultBox) {
    if (result.length) {
        const content = result.map((list) => {
            return `<li onclick='selectInput(this, "${resultBox.className}")'>${list}</li>`;
        }).join('');
        resultBox.innerHTML = `<ul>${content}</ul>`;
        resultBox.style.display = 'block';  // Show result box
    } else {
        resultBox.innerHTML = '';
        resultBox.style.display = 'none';  // Hide result box when no results
    }
}

function selectInput(list, resultBoxClass) {
    if (resultBoxClass.includes('result-box-from')) {
        inputBoxFrom.value = list.innerHTML;
        resultBoxFrom.style.display = 'none';  // Hide the 'From' result box
    } else if (resultBoxClass.includes('result-box-to')) {
        inputBoxTo.value = list.innerHTML;
        resultBoxTo.style.display = 'none';  // Hide the 'To' result box
    }
}

// Hide the list when clicking outside the input or list
document.addEventListener('click', function(event) {
    if (!inputBoxFrom.contains(event.target) && !resultBoxFrom.contains(event.target)) {
        resultBoxFrom.style.display = 'none';  // Hide 'From' result box
    }
    if (!inputBoxTo.contains(event.target) && !resultBoxTo.contains(event.target)) {
        resultBoxTo.style.display = 'none';  // Hide 'To' result box
    }
});
