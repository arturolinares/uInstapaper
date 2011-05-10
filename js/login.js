/**
 *
 * User: alinares
 * Date: 11-ene-2011
 * Time: 11:04:40
 * To change this template use File | Settings | File Templates.
 */
uInstaLogin =
{
    xhr: null,

    auth: function()
    {
        var username = widget.preferences.username;
        var password = widget.preferences.password;
        var iUrl = 'https://www.instapaper.com/api/authenticate';

        var data = 'username=' + username + '&password=' + password;
        data = data.replace('+', '%2B');
        uInstaLogin.xhr = new XMLHttpRequest();
        uInstaLogin.xhr.onreadystatechange = uInstaLogin.addChangedStateListener;
        uInstaLogin.xhr.open("GET", iUrl + '?' + data, true);
        uInstaLogin.xhr.send(null);
    },

    addChangedStateListener: function(e)
    {
        if (uInstaLogin.xhr)
        {
            if (uInstaLogin.xhr.readyState == 4){
                if (uInstaLogin.xhr.status == 200) uInstaLogin.loginListener();
                else uInstaLogin.errorListener();
            }

        }
    },

    loginListener: null,
    errorListener: null
};
