const apiURL = "http://localhost:3000/api";

async function readFile()
{
    filename = document.getElementById("filename-read").value;
    let data = await fetch(`${apiURL}/read?filename=${filename}`);
    let res = await data.json();
    document.getElementById("readFileResponse").textContent = res.content || res.error;
}

async function writeToFile() 
{
    let filename = document.getElementById("filename-write").value;
    let content = document.getElementById("content-write").value;
    let data = await fetch(`${apiURL}/write`, {
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body: JSON.stringify({filename, content})
    });
    let res = await data.json();
    document.getElementById("writeFileResponse").textContent = res.message || res.error;    
}

async function appendToFile() 
{
    let filename = document.getElementById("filename-append").value;
    let content = document.getElementById("content-append").value;
    let data = await fetch(`${apiURL}/append`, {
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body: JSON.stringify({filename, content})
    });
    let res = await data.json();
    document.getElementById("appendFileResponse").textContent = res.message || res.error;  
}

async function renameFile() 
{
    let oldName = document.getElementById("oldFileName").value;
    let newName = document.getElementById("newFileName").value;
    let data = await fetch(`${apiURL}/rename`, {
        method:"PUT",
        headers:{"Content-Type":"application/json"},
        body: JSON.stringify({oldName, newName})
    });
    let res = await data.json();
    document.getElementById("renameFileResponse").textContent = res.message || res.error;
}

async function deleteFile() 
{
    let filename = document.getElementById("filename-delete").value;
    let data = await fetch(`${apiURL}/delete`, {
        method:"DELETE",
        headers:{"Content-Type":"application/json"},
        body: JSON.stringify({filename})
    });
    let res = await data.json();
    document.getElementById("deleteFileResponse").textContent = res.message || res.error;
}