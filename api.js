import { getEndgameArr } from './service.js'

export async function fetchData(id) {
    try { 
        const res = await axios.get(`http://localhost:3000/api/endgames/id=${id}`);
        const data = res.data;  
        const arr = getEndgameArr(data);  

        return arr; 
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

export function genDropDown() {
    var select = document.getElementById("endgame-selector"); 
    var parties = ["Mod", "S", "MP", "FP", "C", "SD", "KD", "F!", "V"]; 
    for (var i = 0; i < parties.length; i++) { 
        var option = document.createElement("option"); 
        option.value = parties[i]; 
        option.innerHTML = parties[i]; 
        select.appendChild(option); 
    }
}