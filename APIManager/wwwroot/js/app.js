const API_SERVER = "http://localhost:5234/"; 

document.addEventListener('DOMContentLoaded', function() {
    toggleRequestBodyVisibility();
});

document.getElementById('method').addEventListener('change', toggleRequestBodyVisibility);

document.getElementById('send').addEventListener('click', sendRequest);

document.getElementById('add-header').addEventListener('click', addHeader);

function toggleRequestBodyVisibility() {
    let method = document.getElementById('method').value;
    const bodyContainer = document.getElementById('request-body-container');
    if(method === "POST" || method === "PUT"){
        bodyContainer.style.display = 'block';
    } else {
        bodyContainer.style.display = 'none';
    }
}

function buildApiUrl(endpoint) {
    return `${API_SERVER}${endpoint}`;
}

async function sendRequest() {
    let urlUser = document.getElementById('url').value;
    if (!urlUser) {
        alert("Introduce una URL");
        return;
    }
    let methodSelected = document.getElementById('method').value;
    const responseDisplay = document.getElementById('response');
    const bodyRequestUser = document.getElementById('request-body').value;
    const headersUser = getHeaders();
    const serverURL = buildApiUrl("api/proxy/makeRequest");

    let body = JSON.stringify({
        url: urlUser,
        body: bodyRequestUser,
        headers: headersUser,
        method: methodSelected,
    });
    
    let conf = {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: body,
    }


    try {
        const response = await fetch(serverURL, conf);
        if (!response.ok) {
            throw new Error(`HTTP ERROR: ${response.status}`);
        }

        const data = await response.json();
        responseDisplay.value = JSON.stringify(data, null, 2);
    } catch (error) {
        console.error('Error:', error);
        responseDisplay.value = `Error: ${error.message}`;
    }
}

function addHeader() {
    let headersParent = document.getElementById('headers');
    let newHeader = document.createElement('div');

    newHeader.className = 'header-pair row mt-3';
    newHeader.innerHTML = '<div class="col-sm-3 header-key-container"><input type="text" placeholder="Header Key" class="header-key form-control bg-dark text-white"></div><div class="col-sm-3 header-value-container"><input type="text" placeholder="Header Value" class="header-value form-control bg-dark text-white"></div><div class="col-sm-3"><button type="button" class="btn btn-danger" onclick="removeHeader(this)">🗑</button></div>';
    headersParent.append(newHeader);
}

function removeHeader(button) {
    button.parentElement.parentElement.remove();
}

function getHeaders() {
    const headers = {}
    const headersPair = document.querySelectorAll('.header-pair');
    headersPair.forEach(pair => {
        const key = pair.querySelector('.header-key-container').querySelector('.header-key').value.trim();
        const value = pair.querySelector('.header-value-container').querySelector('.header-value').value.trim();
        
        if (key && value) {
            headers[key] = value;
        }
    });
    return headers;
}

