$(function(){

    $('#collapseOne').on('show', function () {
	$(this).parent().find('.accordion-toggle').html('<i class="icon-eye-close"></i> Hide code:');
    }).on('hide', function() {
	$(this).parent().find('.accordion-toggle').html('<i class="icon-eye-open"></i> View code:');
    });

    $(".tabbable a").bind("click", function(e){

	e.preventDefault();
	var index = $(this).parent().index();

	$('.gist-container').hide();
	$('.gist-container').eq(index).show();

	$(".tabbable li").removeClass("active");
	$(this).parent().addClass("active");

	//$('#collapseOne').collapse('hide');

	$("iframe").attr("src", $(this).attr("href"));
	$("iframe").css("height", $(this).data("width"));

    });

    $("#buttonsPanel button").bind("click", function(e){

	e.preventDefault();

	$('#buttonsPanel button').removeClass('active').removeClass('btn-primary').addClass('btn-inverse');
	$(this).addClass('active').removeClass('btn-inverse').addClass('btn-primary');

	var code = $(this).data('page');

	$('.page').each( function(i, page){
	    if( code == $(page).data('page') ){
		$(page).fadeIn('slow');
	    }
	    else{
		$(page).hide();
	    }
	});

	//  console.log($(this).data('page'));

    });

    $('#btnDonate').bind('click', function(e){
	$('#formDonate').submit();
    });

    //$('.btn-group .btn:eq(1)').trigger('click');

    $(window).scroll(function() {
	if($(this).scrollTop() != 0) {
	    $('#wrapperBackTop').fadeIn();
	} else {
	    $('#wrapperBackTop').fadeOut();
	}
    });

    $('#wrapperBackTop').click(function() {
	$('body,html').animate({scrollTop:0},200);
    });

});


