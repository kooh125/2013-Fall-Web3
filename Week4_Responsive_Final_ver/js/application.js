// stick to the buttom
$(document).ready(sizeContent);
$(window).resize(sizeContent);
function sizeContent() {
	$('#optin').css('top', $(window).height() - 150 + 'px');
}

$(document).ready(function() {
	//snap to viewport
	function resizePages() {
		var h = $(window).height();
		var height  =  h < 600 ? 600 : h;
		$('section').css('height',height);
		$('firstSection').css('height',height*0.98);
	}

	var scrollElement = 'html, body';
	//resize
	$(window).resize(function(e) {
		resizePages();
	});
	resizePages();
});