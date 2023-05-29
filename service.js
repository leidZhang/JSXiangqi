export function getEndgameArr(data) {
    const rows = data.split(';');
    const arr = rows.map(row => row.split(','));

    return arr; 
}

