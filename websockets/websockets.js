
function onLogin(io, response)
{   
    console.log("depuis node :nouvel utilisateur");
    io.emit ('notify', response.identifiant);
}
function onLogout(io, response)
{   
    console.log("depuis node :nouvel utilisateur");
    io.emit ('logout',response);
}

module.exports = {onLogin, onLogout};