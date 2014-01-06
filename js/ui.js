var ajax_load = "<table id='loading_progress' style='padding-top:10px;margin:0 auto;'><tr><td><img src='images/ajax_load.gif' alt='loading' width='32' height='32' /></td><td>Please wait...</td></tr></table>";

function showCryptsyKeysForm(msg, callback)
{
	if(msg)
		$("#cryptsy_keys_form_msg").html(msg).show();
	else
		$("#cryptsy_keys_form_msg").hide();

	$("#cryptsy_keys_form").dialog({
    height: 350,
    width: 500,
    modal: true,
    buttons: {
			"Login": function() {
				var privateKey = $("#private_key").val();
				var publicKey = $("#public_key").val();
				$(this).dialog("close");

				return callback(true, privateKey, publicKey);
			},
			Cancel: function() {
				$(this).dialog("close");
				return callback(false, null, null);				
			}
		},
    close: function() {
		}
	});
}

function setLoaderText(msg)
{
	$("#loader_text").html(msg);
}

function hideLoader()
{
	$("#loader").fadeOut(400);
}

function initTabs()
{
	window.tabs = $("#tabs").tabs({
		collapsible: false
	});

	// close icon: removing the tab on click
	window.tabs.delegate("span.ui-icon-close", "click", function() {
		var panelId = $(this).closest("li").remove().attr("aria-controls");
		$("#" + panelId).remove();
		window.tabs.tabs("refresh");
	});
}

function addTab(tabID, label, contents, hasCloseButton)
{
	var TAB_TITLE_TEMPLATE = "<li><a href='#{href}'>#{label}</a></li>";
	var TAB_TITLE_TEMPLATE_CLOSE = "<li><a href='#{href}'>#{label}</a> <span class='ui-icon ui-icon-close' role='presentation'>Remove Tab</span></li>";
	var tabTemplate = hasCloseButton == true ? TAB_TITLE_TEMPLATE_CLOSE : TAB_TITLE_TEMPLATE; 

	var id = "tabs-" + tabID;
	var li = $(tabTemplate.replace(/#\{href\}/g, "#" + id).replace(/#\{label\}/g, label));

	window.tabs.find(".ui-tabs-nav").append(li);
	window.tabs.append("<div id='" + id + "'>" + contents + "</div>");
	window.tabs.tabs("refresh");

	$("#" + id).css('padding-left','0px');
	$("#" + id).css('padding-right','0px');
}

function setTabHTML(tabID, html)
{
	$("#tabs-" + tabID).html(html);
}

function activateTab(tabID)
{
	window.tabs.tabs({ active: tabID });
}
