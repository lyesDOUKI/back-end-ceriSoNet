
function onLogin(io, response)
{   
    console.log("depuis node :nouvel utilisateur");
    io.emit ('notify', response.identifiant);
}

module.exports = {onLogin};