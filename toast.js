function showToast(message, type = 'success') {
    const toastContainer = document.createElement('div');
    toastContainer.classList.add('toast', 'fixed', 'top-5', 'right-5', 'z-50');

    const toast = document.createElement('div');
    toast.classList.add(
        'inline-flex', 'items-center', 'p-4', 
        'mb-4', 'text-sm', 'text-' + (type === 'success' ? 'green' : 'red') + '-700',
        'bg-' + (type === 'success' ? 'green' : 'red') + '-100',
        'rounded-lg', 'shadow', 'w-full', 'max-w-xs'
    );

    const toastMessage = document.createElement('span');
    toastMessage.innerText = message;

    const closeButton = document.createElement('button');
    closeButton.classList.add('ml-3', 'text-gray-500', 'hover:text-gray-700', 'focus:outline-none', 'focus:ring-2', 'focus:ring-gray-500', 'rounded-lg', 'p-1');
    closeButton.innerHTML = '&times;'; // Close button (×)
    closeButton.onclick = () => {
        toastContainer.remove();
    };

    toast.appendChild(toastMessage);
    toast.appendChild(closeButton);
    toastContainer.appendChild(toast);
    document.body.appendChild(toastContainer);

    // Automatically remove the toast after 5 seconds
    setTimeout(() => {
        toastContainer.remove();
    }, 5000);
}

// Export the showToast function for use in other files
if (typeof window !== 'undefined') {
    window.showToast = showToast;
}
