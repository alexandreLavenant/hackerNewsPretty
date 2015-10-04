/* jshint laxcomma : true */
var checkReadAticles = function()
{
	var readArticles = typeof localStorage.articles !== "undefined"? JSON.parse(localStorage.articles) : {};

	for(var article in readArticles)
	{
		if(readArticles[article])
		{
			$('button[articleid='+article+']').attr('class', 'btn btn-success btn-block');
			$('#'+article).html('Article Read <i class="fa fa-check"></i>');
		}
	}
}
;

(function($)
{
	$(document).ready(function()
	{

		checkReadAticles();

		$('.btn-block, .img-circle').click(function()
		{
			var articleID = $(this).attr('articleid')
				, readArticles = typeof localStorage.articles !== "undefined"? JSON.parse(localStorage.articles) : {}
				;

			readArticles[articleID] = true;
			localStorage.articles = JSON.stringify(readArticles);
			$('button[articleid='+articleID+']').attr('class', 'btn btn-success btn-block');
			$('button[articleid='+articleID+']').html('Article Read <i class="fa fa-check"></i>');
		});
	});

}(jQuery));
