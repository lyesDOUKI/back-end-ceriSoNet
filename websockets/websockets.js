
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
function onLike(io, response)
{
    console.log("depuis node :nouvel utilisateur");
    console.log("response : " + response);
    io.emit ('like',response);
}
module.exports = {onLogin, onLogout, onLike};