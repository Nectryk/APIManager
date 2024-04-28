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

async function sendRequest() {
    let methodSelected = document.getElementById('method').value;
    let url = document.getElementById('url').value;
    const responseDisplay = document.getElementById('response');
    const body = document.getElementById('request-body').value;
    const headersUser = getHeaders();

    let conf;

    switch(methodSelected){
        case "GET":
            conf = {
                method: methodSelected
            }
            console.log("get")
            break;
        case "HEAD":
            conf = {
                method: methodSelected
            }
            console.log("head")
            break;
        case "POST":
            conf = {
                method: methodSelected,
                body: JSON.stringify(body),
            }
            console.log("post")
            break;
        case "PUT":
            conf = {
                method: methodSelected,
                body: JSON.stringify(body),
            }
            console.log("put")
            break;
        case "DELETE":
            conf = {
                method: methodSelected
            }
            console.log("delete")
            break;
        default:
            break;
    }

    if(headersUser) {
        conf["headers"] = new Headers(headersUser);
    }
    console.log(conf)
    try {
        console.log(conf);
        const response = await fetch(url, conf)
        if (!response.ok) {
                alert(`HTTP ERROR: ${response.status}`);
        }
        
        const data = await response.json();
            
        responseDisplay.value = JSON.stringify(data, null, 2);
    } catch(error) {
        responseDisplay.value = error;
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
        console.log(key)
        console.log(value)

        if (key && value) {
            headers[key] = value;
        }
    });
    return headers;
}

