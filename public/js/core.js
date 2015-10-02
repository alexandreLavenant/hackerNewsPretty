/* jshint laxcomma : true */
var checkReadAticles = function()
{
	var readArticles = typeof localStorage.articles !== "undefined"? JSON.parse(localStorage.articles) : {};

	for(var article in readArticles)
	{
		if(readArticles[article])
		{
			$('#'+article).attr('class', 'btn btn-success btn-block');
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

		$('.btn-block').click(function()
		{
			var articleID = $(this).attr('id')
				, readArticles = typeof localStorage.articles !== "undefined"? JSON.parse(localStorage.articles) : {}
				;

			readArticles[articleID] = true;
			localStorage.articles = JSON.stringify(readArticles);
			$(this).attr('class', 'btn btn-success btn-block');
			$(this).html('Article Read <i class="fa fa-check"></i>');
		});
	});

}(jQuery));
