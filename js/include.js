/**
 *
 * User: alinares
 * Date: 03-dic-2010
 * Time: 11:36:02
 * To change this template use File | Settings | File Templates.
 */

uInstapaper =
{
    addUrl: 'https://www.instapaper.com/api/add',

    toolbarButton: null,

    init: function()
    {
        var ToolbarUIItemProperties =
        {
            disabled: false,
            title: "Send to Instapaper",
            icon: "icons/icon.png",
            badge: {
                display: "none",
                textContent: "12",
                color: "white",
                backgroundColor: "rgba(211, 0, 4, 1)"
            }
        };

        uInstapaper.toolbarButton = opera.contexts.toolbar.createItem(ToolbarUIItemProperties);

        opera.contexts.toolbar.addItem(uInstapaper.toolbarButton);

        uInstapaper.checkReady();
        uInstapaper.setupListeners();
    },

    setupListeners: function()
    {
        addEventListener('storage', uInstapaper.onStorageUpdatedListener, true);
        uInstapaper.toolbarButton.onclick = uInstapaper.onButtonClickListener;
    },

    onStorageUpdatedListener: function()
    {
        uInstapaper.checkReady();
    },

    onButtonClickListener: function()
    {
        uInstapaper.add();
    },

    // we have everything we need to do a login
    isReady : function ()
    {
        return widget.preferences.username
                && widget.preferences.username.length > 0;
    },

    // show a warning in the badge if we don't have a user/pass
    checkReady: function()
    {
        if (!uInstapaper.isReady())
        {
            uInstapaper.showError('Enter your Instapaper username and password in the extension options page');
        }
        else
        {
            uInstapaper.hideError();
        }
    },

    showError: function(error_message)
    {
        uInstapaper.toolbarButton.badge.display = 'block';
        uInstapaper.toolbarButton.badge.textContent = '!';
        uInstapaper.toolbarButton.title = error_message;
    },

    hideError: function()
    {
        uInstapaper.toolbarButton.badge.display = 'none';
    },

    showTimedError: function(msg, time)
    {
        time = time || 3000;
        uInstapaper.showError(msg);
        setTimeout(uInstapaper.hideError, time);
    },

    add: function()
    {
        var username = widget.preferences.username;
        var password = widget.preferences.password;
        var iUrl = uInstapaper.addUrl;

        var data = 'username=' + username + '&'
                + 'password=' + password + '&'
                + 'url=' + opera.extension.tabs.getFocused().url.replace(/https?:\/\//, '');
        data = data.replace('+', '%2B');
        uInstapaper.xhr = new XMLHttpRequest();
        uInstapaper.xhr.onreadystatechange = uInstapaper.addChangedStateListener;
        uInstapaper.xhr.open("GET", iUrl + '?' + data, true);
        uInstapaper.xhr.send(null);
    },

    addSuccess: function()
    {
        uInstapaper.toolbarButton.icon = 'icons/saved.png';
        setTimeout(function()
        {
            uInstapaper.toolbarButton.icon = 'icons/icon.png';
        }, 3000);
    },

    addChangedStateListener: function(e)
    {
        if (uInstapaper.xhr)
        {
            if (uInstapaper.xhr.readyState == 4)
            {
                if (uInstapaper.xhr.status == 201)
                {
                    uInstapaper.hideError();
                    uInstapaper.addSuccess();
                }
                else
                {
                    if (uInstapaper.xhr.status == 400)
                    {
                        opera.postError('uInstapaper:add:Missing argument!');
                    }
                    else
                    {
                        if (uInstapaper.xhr.status == 403)
                        {
                            uInstapaper.showError('Invalid username or password!');
                        }
                        else
                        {
                            uInstapaper.showTimedError('An error ocurred while trying to add the url.', 3000);
                        }
                    }
                }
            }
            else
            {
                uInstapaper.hideError();
            }
        }
    }

}
        ;



