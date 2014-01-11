### Cryptsy Order Inspector - Desktop notifications for Cryptsy ###
-------------------------------------------------------------------

A small app which keeps track of your orders and notifies you about new or missing (fulfilled/canceled) orders. 

Written in [node-webkit] [7], so it should be cross platform. Unfortunately, I only have a Win32 machine to test it, so if you have any problems running it on another platform, don't hesitate to file a bug. Somebody else might be able to help you.

### Instructions ###

Prerequisites

1. [Node.js] [8] (npm is required in order to install dependencies)
2. [Node-webkit] [9] (for running the app)

After you've installed the above follow these steps.

1. Download the zip archive and unzip it somewhere on your machine, or clone the repo.
2. Navigate to the folder where you extracted the code.
3. Execute "npm install" and let it download all the dependencies (currently only EJS is needed).
4. Execute "/path/to/nodewebkit/nw.exe ./" while you are in the project's folder.

That's it. 

The first time you run the app, you'll be asked for your public/private Cryptsy keys. These are needed in order to connect to Cryptsy through their API. You can find them on the Cryptsy site, by clicking on your username at the top right corner of the screen and selecting Settings. Scroll down to the section titled "API Keys". Enter anything for a seed value and press "Generate New Key". Then, copy and paste your public and private keys to Cryptsy Order Inspector.

If you find this app useful, and you feel like donating some coins, my Cryptsy trade key is

    73c3f01f9d8a2ff26ec4604d884ff37386790075

Thanks :)

### About ###

This software uses [jQuery] [1], [jQuery UI] [2], [Aristo theme for jQuery UI] [3], [Alertify.js] [4], [EJS] [5] and [moment.js] [10]. Desktop notifications inspired by [nw-desktop-notifications] [6]

[1]: http://jquery.com/ "jQuery"
[2]: http://jqueryui.com/ "jQuery UI"
[3]: https://github.com/taitems/Aristo-jQuery-UI-Theme "Aristo Theme"
[4]: http://fabien-d.github.io/alertify.js/ "Alertify.js"
[5]: http://embeddedjs.com/ "EJS"
[6]: https://github.com/robrighter/nw-desktop-notifications "nw-desktop-notifications"
[7]: https://github.com/rogerwang/node-webkit "node-webkit"
[8]: http://nodejs.org/ "Node.js"
[9]: https://github.com/rogerwang/node-webkit#downloads "Node-webkit downloads"
[10]: http://momentjs.com/ "moment.js"
