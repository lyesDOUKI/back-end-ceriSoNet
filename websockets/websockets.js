
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
function onComment(io, response)
{
    console.log("depuis node :nouvel utilisateur");
    console.log("response : " + response);
    io.emit ('comment',response);
}
function onAddPost(io, response)
{
    console.log("depuis node :add post");
    console.log("response : " + response);
    io.emit ('addPost',response);
}
function onFirstConnect(io, response)
{
    console.log("depuis node :nouvel utilisateur");
    io.emit ('firstConnect',response);
}
module.exports = {onLogin, onLogout, onLike, onComment, onAddPost, onFirstConnect};