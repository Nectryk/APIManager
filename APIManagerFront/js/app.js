document.addEventListener('DOMContentLoaded', function() {
    toggleRequestBodyVisibility();
});

document.getElementById('method').addEventListener('change', toggleRequestBodyVisibility);

document.getElementById('send').addEventListener('click', sendRequest);

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

