// "use strict"

// var themeOptionArr = {
// 			typography: '',
// 			version: '',
// 			layout: '',
// 			primary: '',
// 			headerBg: '',
// 			navheaderBg: '',
// 			sidebarBg: '',
// 			sidebarStyle: '',
// 			sidebarPosition: '',
// 			headerPosition: '',
// 			containerLayout: '',
// 			//direction: '',
// 		};



// /* Cookies Function */
// function setCookie(cname, cvalue, exhours)
// 	{
// 		var d = new Date();
// 		d.setTime(d.getTime() + (30*60*1000)); /* 30 Minutes */
// 		var expires = "expires="+ d.toString();
// 		document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
// 	}

// function getCookie(cname)
// 	{

// 		// console.log("document" ,document);
// 		var name = cname + "=";
// 		var decodedCookie = decodeURIComponent(document.cookie);
// 		var ca = decodedCookie.split(';');
// 		for(var i = 0; i <ca.length; i++) {
// 			var c = ca[i];
// 			while (c.charAt(0) == ' ') {
// 				c = c.substring(1);
// 			}
// 			if (c.indexOf(name) == 0) {
// 				return c.substring(name.length, c.length);
// 			}
// 		}
// 		return "";
// 	}

// function deleteCookie(cname)
// 	{
// 		var d = new Date();
// 		d.setTime(d.getTime() + (1)); // 1/1000 second
// 		var expires = "expires="+ d.toString();
// 		//document.cookie = cname + "=1;" + expires + ";path=/";
// 		document.cookie = cname + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT"+";path=/";
// 	}

// function deleteAllCookie(reload = true)
// 	{
// 		jQuery.each(themeOptionArr, function(optionKey, optionValue) {
// 				deleteCookie(optionKey);
// 		});
// 		if(reload){
// 			location.reload();
// 		}
// 	}

// /* Cookies Function END */


// (function($) {

// 	"use strict"

// 	//var direction =  getUrlParams('dir');
// 	var theme =  getUrlParams('theme');

// 	/* Dz Theme Demo Settings  */

// 	var dezThemeSet0 = { /* Default Theme */
// 		typography: "poppins",
// 		version: "light",
// 		layout: "vertical",
// 		primary: "color_1",
// 		headerBg: "color_1",
// 		navheaderBg: "color_1",
// 		sidebarBg: "color_1",
// 		sidebarStyle: "full",
// 		sidebarPosition: "fixed",
// 		headerPosition: "fixed",
// 		containerLayout: "full",
// 	};

// 	var dezThemeSet1 = {
// 		typography: "poppins",
// 		version: "light",
// 		layout: "horizontal",
// 		primary: "color_3",
// 		headerBg: "color_1",
// 		navheaderBg: "color_1",
// 		sidebarBg: "color_3",
// 		sidebarStyle: "full",
// 		sidebarPosition: "fixed",
// 		headerPosition: "fixed",
// 		containerLayout: "full",
// 	};

// 	var dezThemeSet2 = {
// 		typography: "poppins",
// 		version: "light",
// 		layout: "vertical",
// 		primary: "color_12",
// 		headerBg: "color_1",
// 		navheaderBg: "color_12",
// 		sidebarBg: "color_12",
// 		sidebarStyle: "full",
// 		sidebarPosition: "fixed",
// 		headerPosition: "fixed",
// 		containerLayout: "full",
// 	};


// 	var dezThemeSet3 = {
// 		typography: "poppins",
// 		version: "light",
// 		layout: "vertical",
// 		primary: "color_3",
// 		headerBg: "color_2",
// 		navheaderBg: "color_14",
// 		sidebarBg: "color_2",
// 		sidebarStyle: "full",
// 		sidebarPosition: "fixed",
// 		headerPosition: "fixed",
// 		containerLayout: "full",
// 	};

// 	var dezThemeSet4 = {
// 		typography: "poppins",
// 		version: "light",
// 		layout: "vertical",
// 		primary: "color_14",
// 		headerBg: "color_14",
// 		navheaderBg: "color_14",
// 		sidebarBg: "color_1",
// 		sidebarStyle: "full",
// 		sidebarPosition: "fixed",
// 		headerPosition: "fixed",
// 		containerLayout: "full",
// 	};

// 	var dezThemeSet5 = {
// 		typography: "poppins",
// 		version: "light",
// 		layout: "vertical",
// 		primary: "color_10",
// 		headerBg: "color_1",
// 		navheaderBg: "color_10",
// 		sidebarBg: "color_10",
// 		sidebarStyle: "mini",
// 		sidebarPosition: "fixed",
// 		headerPosition: "fixed",
// 		containerLayout: "full",
// 	};
// 	var dezThemeSet6 = {
// 		typography: "poppins",
// 		version: "light",
// 		layout: "horizontal",
// 		primary: "color_5",
// 		headerBg: "color_5",
// 		navheaderBg: "color_5",
// 		sidebarBg: "color_1",
// 		sidebarStyle: "compact",
// 		sidebarPosition: "fixed",
// 		headerPosition: "fixed",
// 		containerLayout: "full",
// 	};
// 	var dezThemeSet7 = {
// 		typography: "poppins",
// 		version: "light",
// 		layout: "horizontal",
// 		primary: "color_6",
// 		headerBg: "color_1",
// 		navheaderBg: "color_6",
// 		sidebarBg: "color_1",
// 		sidebarStyle: "full",
// 		sidebarPosition: "fixed",
// 		headerPosition: "fixed",
// 		containerLayout: "full",
// 	  };

// 	  var dezThemeSet8 = {
// 		typography: "poppins",
// 		version: "light",
// 		layout: "vertical",
// 		primary: "color_9",
// 		headerBg: "color_1",
// 		navheaderBg: "color_9",
// 		sidebarBg: "color_9",
// 		sidebarStyle: "mini",
// 		sidebarPosition: "fixed",
// 		headerPosition: "fixed",
// 		containerLayout: "boxed",
// 	  };

// 	function themeChange(theme){
// 		var themeSettings = {};
// 		themeSettings = eval('dezThemeSet'+theme);

// 		dezSettingsOptions = themeSettings;
// 		/* For Screen Resize */
// 		new dezSettings(themeSettings);
// 		setThemeInCookie(themeSettings);
// 	}

// 	function setThemeInCookie(themeSettings)
// 	{
// 		jQuery.each(themeSettings, function(optionKey, optionValue) {
// 			setCookie(optionKey,optionValue);
// 		});
// 	}

// 	function setThemeLogo() {
// 		var logo = getCookie('logo_src');
// 		var logo2 = getCookie('logo_src2');
// 		if(logo != ''){
// 			jQuery('.nav-header .logo-abbr').attr("src", logo);
// 		}
// 		if(logo2 != ''){
// 			jQuery('.nav-header .logo-compact, .nav-header .brand-title').attr("src", logo2);
// 		}
// 	}

// 	function setThemeOptionOnPage()
// 	{
// 		if(getCookie('version') != '')
// 		{
// 			jQuery.each(themeOptionArr, function(optionKey, optionValue) {

// 				// console.log("themeOptionArr[optionKey]" ,optionKey);
// 				// console.log("dezSettingsOptions" ,dezSettingsOptions[optionKey]);
// 				var optionData = getCookie(optionKey);
// 				themeOptionArr[optionKey] = (optionData != '')?optionData:dezSettingsOptions[optionKey];
// 			});
// 			// console.log(themeOptionArr);
// 			dezSettingsOptions = themeOptionArr;
// 			new dezSettings(dezSettingsOptions);

// 			setThemeLogo();
// 		}
// 	}

// 	jQuery(document).on('click', '.dz_theme_demo', function(){
// 		var demoTheme = jQuery(this).data('theme');

// 		themeChange(demoTheme, 'ltr');
// 	});


// 	jQuery(document).on('click', '.dz_theme_demo_rtl', function(){
// 		var demoTheme = jQuery(this).data('theme');
// 		themeChange(demoTheme, 'rtl');
// 	});


// 	jQuery(window).on('load', function(){
// 		//direction = (direction != undefined)?direction:'ltr';
// 		if(theme != undefined){
// 			themeChange(theme);

// 			/* Activate demo */
// 			jQuery('.dz-demo-bx').removeClass('demo-active');
// 			jQuery('[data-theme="'+theme+'"]').parent().parent().addClass('demo-active');

// 		}else if(getCookie('version') == ''){
// 				themeChange(0);

// 		}

// 		/* Set Theme On Page From Cookie */
// 		setThemeOptionOnPage();

// 	});


// })(jQuery);