export function getEndgameArr(data) {
    const rows = data.split(';');
    const arr = rows.map(row => row.split(','));
    
    return arr; 
}

export function getDropdown(arr) {
    var select = document.getElementById("endgame-selector"); 

    for (var i = 0; i < arr.length; i++) { 
        var option = document.createElement("option"); 
        option.value = i + 1; 
        option.innerHTML = (i + 1) + ". " + arr[i].title; 
        select.appendChild(option); 
    }

    select.value = "1"; 
}



