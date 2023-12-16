
function onLogin(io, response)
{   
    
    io.emit ('notify', response.identifiant);
}
function onLogout(io, response)
{   
    
    io.emit ('logout',response);
}
function onLike(io, response)
{
    
    io.emit ('like',response);
}
function onComment(io, response)
{
    
    io.emit ('comment',response);
}
function onAddPost(io, response)
{
    
    io.emit ('addPost',response);
}
function onSharePost(io, response)
{
    
    io.emit ('sharePost',response);
}
function onFirstConnect(io, response)
{
    
    io.emit ('firstConnect',response);
}
module.exports = {onLogin, onLogout, onLike, onComment, onAddPost, onFirstConnect, onSharePost};