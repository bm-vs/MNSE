function addPage(page, book) {
	var id, pages = book.turn('pages');

	// Create a new element for this page
	var element = $('<div />', {});

	// Add the page to the flipbook
	if (book.turn('addPage', element, page)) {

		// Add the initial HTML
		// It will contain a loader indicator and a gradient
		element.html('<div class="gradient"></div><div class="loader"></div>');

		// Load the page
		loadPage(page, element);
	}
}

function loadPage(page, pageElement) {
	if (page === 1) {
		
	}
	else if (page % 2 === 0) {
		$(pageElement).load('./pages/page' + page + '.html');
	}
	else {
		$(pageElement).load('./pages/chat.html', function() {
			$(this).children('.chat-container').attr('ref', 'chat-id-' + page);
			new Chat($(this).children('.chat-container'));
		});
	}
	pageElement.find('.loader').remove();
}

// http://code.google.com/p/chromium/issues/detail?id=128488
function isChrome() {
	return navigator.userAgent.indexOf('Chrome')!=-1;
}

// Set the width and height for the viewport
function resizeViewport() {
	var width = $(window).width(),
		height = $(window).height(),
		options = $('.magazine').turn('options');

	$('.magazine').removeClass('animated');

	$('.magazine-viewport').css({
		width: width,
		height: height
	});

	if ($('.magazine').turn('zoom')==1) {
		var bound = calculateBound({
			width: options.width,
			height: options.height,
			boundWidth: Math.min(options.width, width),
			boundHeight: Math.min(options.height, height)
		});

		if (bound.width%2!==0)
			bound.width-=1;

			
		if (bound.width!=$('.magazine').width() || bound.height!=$('.magazine').height()) {

			$('.magazine').turn('size', bound.width, bound.height);

			if ($('.magazine').turn('page')==1)
				$('.magazine').turn('peel', 'br');

			$('.next-button').css({height: bound.height, backgroundPosition: '-38px '+(bound.height/2-32/2)+'px'});
			$('.previous-button').css({height: bound.height, backgroundPosition: '-4px '+(bound.height/2-32/2)+'px'});
		}

		$('.magazine').css({top: -bound.height/2, left: -bound.width/2});
	}

	var magazineOffset = $('.magazine').offset(),
		boundH = height - magazineOffset.top - $('.magazine').height(),
		marginTop = (boundH - $('.thumbnails > div').height()) / 2;

	if (marginTop<0) {
		$('.thumbnails').css({height:1});
	} else {
		$('.thumbnails').css({height: boundH});
		$('.thumbnails > div').css({marginTop: marginTop});
	}

	if (magazineOffset.top<$('.made').height())
		$('.made').hide();
	else
		$('.made').show();

	$('.magazine').addClass('animated');
}

// Number of views in a flipbook
function numberOfViews(book) {
	return book.turn('pages') / 2 + 1;
}

// Current view in a flipbook
function getViewNumber(book, page) {
	return parseInt((page || book.turn('page'))/2 + 1, 10);
}

// Width of the flipbook when zoomed in
function largeMagazineWidth() {
	return 2214;
}

// decode URL Parameters
function decodeParams(data) {
	var parts = data.split('&'), d, obj = {};
	for (var i =0; i<parts.length; i++) {
		d = parts[i].split('=');
		obj[decodeURIComponent(d[0])] = decodeURIComponent(d[1]);
	}
	return obj;
}

// Calculate the width and height of a square within another square
function calculateBound(d) {
	var bound = {width: d.width, height: d.height};
	if (bound.width>d.boundWidth || bound.height>d.boundHeight) {
		var rel = bound.width/bound.height;
		if (d.boundWidth/rel>d.boundHeight && d.boundHeight*rel<=d.boundWidth) {
			bound.width = Math.round(d.boundHeight*rel);
			bound.height = d.boundHeight;
		} else {
			bound.width = d.boundWidth;
			bound.height = Math.round(d.boundWidth/rel);
		}
	}
	return bound;
}