var nwgui = require("nw.gui");

var WINDOW_WIDTH = 300;
var WINDOW_HEIGHT = 100;
var ANIMATION_FRAME_DX = 20;
var ANIMATION_FRAME_TIME = 1;

var notificationWindows = [];
var pendingNotifications = [];

function notify(params, callback)
{
	var x = screen.availLeft + screen.availWidth;
	var y = screen.availTop + screen.availHeight - (notificationWindows.length + 1) * (WINDOW_HEIGHT + 10);

	if(y < WINDOW_HEIGHT)
	{
		pendingNotifications.push({params: params, callback: callback});
		return;
	}

	var win = nwgui.Window.open('notification.html', {
		x: x,
		y: y,
		frame: false,
		toolbar: false,
		width: WINDOW_WIDTH,
		height: WINDOW_HEIGHT,
		'always-on-top': true,
		show: false,
		resizable: false
	});

	notificationWindows.push(win);

	win.on('loaded', function() {
		var jqBody = $(win.window.document.body);
		jqBody.find('#closer').click(function() {
			closeNotificationWindow(win);
		});

		jqBody.find("#div_icon").html("<img src='" + params.icon_url + "' />");
		jqBody.find("#div_title").html(params.title);
		jqBody.find("#div_message").html(params.message);

		showNotificationWindow(win);
	});
}

function showNotificationWindow(win)
{
	var targetX = screen.availLeft + screen.availWidth - WINDOW_WIDTH - 10;
	var x = win.x;
	win.show();

	function animate()
	{
		if(x > targetX)
		{
			win.moveBy(-ANIMATION_FRAME_DX, 0);
			x -= ANIMATION_FRAME_DX;
			global.setTimeout(animate, ANIMATION_FRAME_TIME);
		}
	}

	global.setTimeout(animate, 0);
}

function closeNotificationWindow(win)
{
	var targetX = screen.availLeft + screen.availWidth;
	var x = win.x;

	function animate()
	{
		if(x < targetX)
		{
			win.moveBy(ANIMATION_FRAME_DX, 0);
			x += ANIMATION_FRAME_DX;
			global.setTimeout(animate, ANIMATION_FRAME_TIME);
		}
		else
		{
			win.hide();
			win.close();

			var winID = notificationWindows.indexOf(win);
			if(winID != -1)
				notificationWindows.splice(winID, 1);

			fixWindowsYPosition(winID, showPendingNotifications);
		}
	}

	global.setTimeout(animate, 0);
}

function fixWindowsYPosition(firstIndex, callback)
{
	for(var iWindow = firstIndex;iWindow < notificationWindows.length;++iWindow)
	{
		(function (win, id) {
			var targetY = screen.availTop + screen.availHeight - (id + 1) * (WINDOW_HEIGHT + 10);

			function animate()
			{
				if(win.y < targetY)
				{
					win.moveBy(0, 10);
					global.setTimeout(animate, ANIMATION_FRAME_TIME);
				}
				else
					callback();
			}

			global.setTimeout(animate, 0);
		})(notificationWindows[iWindow], iWindow);
	}
}

function showPendingNotifications()
{
	// HACK: Keep all the currently pending notifications in a local array, empty the global array,
	// and call notify again...
	var pi = pendingNotifications;
	pendingNotifications = [];

	for(var iNotification = 0;iNotification < pi.length;++iNotification)
		notify(pi[iNotification].params, pi[iNotification].callback);
}

function forceCloseAllNotifications()
{
	for(var iNotif = 0;iNotif < notificationWindows.length;++iNotif)
		notificationWindows[iNotif].close();
}