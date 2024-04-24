document.addEventListener('DOMContentLoaded', function() {
    toggleRequestBodyVisibility();
});

document.getElementById('method').addEventListener('change', toggleRequestBodyVisibility);

function toggleRequestBodyVisibility() {
    let method = document.getElementById('method').value;
    const bodyContainer = document.getElementById('request-body-container');
    if(method == "post" || method == "put"){
        bodyContainer.style.display = 'block';
    } else {
        bodyContainer.style.display = 'none';
    }
}