// Handle keyboard visibility for mobile devices
document.addEventListener('DOMContentLoaded', function() {
    const bottomNav = document.querySelector('.bottom-nav');
    const inputs = document.querySelectorAll('input, select, textarea');

    // Function to handle focus events
    function handleFocus() {
        bottomNav.classList.add('keyboard-open');
    }

    // Function to handle blur events
    function handleBlur() {
        bottomNav.classList.remove('keyboard-open');
    }

    // Add event listeners to all form inputs
    inputs.forEach(input => {
        input.addEventListener('focus', handleFocus);
        input.addEventListener('blur', handleBlur);
    });

    // Additional handler for iOS devices
    const viewport = document.querySelector('meta[name="viewport"]');
    if (viewport) {
        viewport.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0');
    }
});