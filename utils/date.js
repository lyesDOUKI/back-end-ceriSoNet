function getHour(date){
    const heure = date.getHours(); 
    const minute = date.getMinutes(); 
    const seconde = date.getSeconds(); 
    return heure + "h" + minute + "m" + seconde + "s";
}

function getDate(date){
    const jour = date.getDate(); 
    const mois = date.getMonth(); 
    const annee = date.getFullYear(); 
    return jour + "/" + mois + "/" + annee;
}

module.exports = {
    getHour,
    getDate
}