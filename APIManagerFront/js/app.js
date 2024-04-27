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
    console.log(body)

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
    newHeader.innerHTML = '<div class="col-sm-3"><input type="text" placeholder="Header Key" class="header-key form-control bg-dark text-white"></div><div class="col-sm-3"><input type="text" placeholder="Header Value" class="header-value form-control bg-dark text-white"></div><div class="col-sm-3"><button type="button" class="btn btn-danger" onclick="removeHeader(this)">🗑</button></div>';
    headersParent.append(newHeader);
}

function removeHeader(button) {
    button.parentElement.parentElement.remove();
}