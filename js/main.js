var nwgui = require("nw.gui");
var EJS = require("ejs");
var moment = require("moment");
var CryptsyAPI = require("cryptsy").CryptsyAPI;
var Settings = require("settings").Settings;

var settings = new Settings();
var cryptsy = null;
var past_orders = null;

nwgui.Window.get().on('close', function() {
	forceCloseAllNotifications();
	this.close(true);
});

setLoaderText("Loading...");
settings.load("settings.json", function (err) {
	if(err)
	{
		showCryptsyKeysForm(null, loginCallback);
		return;
	}

	initCryptsy();
});

function loginCallback(login, privateKey, publicKey)
{
	if(!login)
	{
		nwgui.App.quit();
		return;
	}

	settings.setKeys(publicKey, privateKey);
	settings.save("settings.json", function () {});

	initCryptsy();
}

function initCryptsy()
{
	setLoaderText("Logging in...");
	cryptsy = new CryptsyAPI(settings.getPublicKey(), settings.getPrivateKey());
	cryptsy.updateUserInfo(function (err, info) {
		if(err)
		{
			showCryptsyKeysForm("Login failed. Check your keys", loginCallback);
			return;
		}

		alertify.success("Logged in successfully");
		setLoaderText("Reading active markets...");
		cryptsy.updateActiveMarkets(function (err, markets) {
			if(err)
			{
				alertify.error("Failed to read active markets.");
				return;
			}

			initUI();
		});
	});
}

function initUI()
{
	setLoaderText("Initializing...");
	initTabs();
	initCryptsyOpenOrdersTab();
	initSettingsTab();

	updateOpenOrdersTab();

	hideLoader();
}

function initCryptsyOpenOrdersTab()
{
	addTab("openorders", "Cryptsy Open Orders", ajax_load, false);
	activateTab(0);
}

function initSettingsTab()
{
	addTab("settings", "Settings", ajax_load, false);
	EJS.renderFile("ejs/settings.ejs", {settings: settings}, function (err, html) {
		setTabHTML("settings", html);

		$("#save_settings").button();
		$("#save_settings").on("click", function () {
			var publicKey = $("#public_key").val();
			var privateKey = $("#private_key").val();
			var updateInterval = $("#update_interval").val();

			settings.setUpdateInterval(updateInterval);
			settings.setKeys(publicKey, privateKey);
			settings.save("settings.json", function (err) {
				if(err)
				{
					alertify.error("Failed to save settings. Try again.");
					return;
				}

				nwgui.Window.get().reload();
			});
		});
	});
}

function updateOpenOrdersTab()
{
	console.log("updateOpenOrdersTab()");
	if(cryptsy === null)
	{
		showCryptsyKeysForm(null, loginCallback);
		return;
	}

	cryptsy.updateActiveMarkets(function (err, markets) {
		if(err)
		{
			alertify.error(err);
			return;
		}

		cryptsy.updateOpenOrders(function (err, orders) {
			if(err)
			{
				alertify.error(err);
				return;
			}

			// Assign the corresponding market to each order...
			for(var iOrder = 0;iOrder < orders.length;++iOrder)
			{
				orders[iOrder].market = cryptsy.getMarketWithID(orders[iOrder].marketid);
				orders[iOrder].quantity += " "  + orders[iOrder].market.primary_currency_code;
				orders[iOrder].total += " " + orders[iOrder].market.secondary_currency_code;
			}

			// Update the tabs html with the current orders.
			EJS.renderFile("ejs/open_orders_table.ejs", {orders: orders}, function (err, html) {
				setTabHTML("openorders", html);

				$("#server_time").html("Last update: " + moment().format("YYYY-MM-DD HH:mm:ss"));

				// Check which orders have been added/removed.
				if(past_orders != null)
				{
					diffOrders(past_orders, orders, showNewOrderNotification);
					diffOrders(orders, past_orders, showMissingOrderNotification);
				}
				past_orders = orders;

				// Update again in X msecs
				setTimeout(updateOpenOrdersTab, settings.getUpdateInterval());
			});
		});
	});
}

function diffOrders(prevOrders, newOrders, callback)
{
	for(var iOrder = 0;iOrder < newOrders.length;++iOrder)
	{
		if(!orderExists(prevOrders, newOrders[iOrder]))
			callback(newOrders[iOrder]);
	}
}

function orderExists(orderList, order)
{
	for(var iOrder = 0;iOrder < orderList.length;++iOrder)
	{
		if(orderList[iOrder].orderid == order.orderid)
			return true;
	}

	return false;
}

function showNewOrderNotification(order)
{
	var params = {
		title: "New order " + order.orderid,
		message: order.ordertype + " " + order.quantity + " @ " + order.price + " " + order.market.secondary_currency_code + " each",
		icon_url: "images/check.png",
		auto_close_after: 0
	};

	notify(params, function() {
		// TODO: Do something on click.
	});
}

function showMissingOrderNotification(order)
{
	var params = {
		title: "Missing order " + order.orderid,
		message: order.ordertype + " " + order.quantity + " @ " + order.price + " " + order.market.secondary_currency_code + " each",
		icon_url: "images/cross.png",
		auto_close_after: 0
	};

	notify(params, function() {
		// TODO: Do something on click.
	});
}