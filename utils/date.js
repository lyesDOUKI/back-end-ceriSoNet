function getHour(date){
    const heure = date.getHours(); 
    const minute = date.getMinutes();  
    return heure + ":" + minute;
}

function getDate(date){
    const jour = date.getDate(); 
    const mois = date.getMonth()+1; 
    const annee = date.getFullYear(); 
    return annee + "-" + mois + "-" + jour;
}

module.exports = {
    getHour,
    getDate
}