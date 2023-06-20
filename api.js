import { getEndgameArr, getDropdown } from './service.js'

export async function fetchEndgame(id) {
    try { 
        const res = await axios.get(`http://localhost:3000/api/endgames/id=${id}`);
        const data = res.data;  
        const arr = getEndgameArr(data);  

        return arr; 
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

export async function fetchList() {
    try {
        const res = await axios.get('http://localhost:3000/api/endgames/titles'); 
        const data = res.data; 
        getDropdown(data); 
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

