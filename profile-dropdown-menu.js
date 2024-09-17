document.addEventListener('DOMContentLoaded', function () {
    // Get the elements
    const userMenuButton = document.getElementById('user-menu-button');
    if (!userMenuButton) {
        console.error("Element with ID 'user-menu-button' not found.");
        return;
    }

    // Manually select the dropdown menu by ID or class
    const dropdownMenu = document.getElementById('dropdown-menu');
    if (!dropdownMenu) {
        console.error("Dropdown menu element not found.");
        return;
    }

    // Initially hide the dropdown menu
    dropdownMenu.classList.add('hidden');

    // Toggle the dropdown menu visibility when the button is clicked
    userMenuButton.addEventListener('click', function (event) {
        event.stopPropagation();
        dropdownMenu.classList.toggle('hidden');
    });

    // Hide the dropdown menu when clicking outside of it
    document.addEventListener('click', function (event) {
        if (!userMenuButton.contains(event.target) && !dropdownMenu.contains(event.target)) {
            dropdownMenu.classList.add('hidden');
        }
    });
});
