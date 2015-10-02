/* jshint laxcomma:true, loopfunc:true*/

var request		= require('request')
	,cheerio	= require('cheerio')
	,url = "https://news.ycombinator.com/"
	/**
	 * open the news from hackerNews website
	 * @param  {number} minimumScore is the minimum score to do
	 * @param  {number} limitArticle, number of articles needed
	 * @return {object} articles with title, date, score and links
	 */
	,news = function(minimumScore, limitArticle, callback)
	{
		//get the content of hackerNews website
		request(url, function(error, response, body)
		{
			var articles	= [];

			if (!error && response.statusCode == 200)
			{
				var $ = cheerio.load(body);

				$('span.deadmark').each(function(index, element)
				{
					var  scoreStr	= $(this).parent().parent().next().find('.score').text()
						, score		= parseInt(scoreStr,10)
						;

					if (score >= minimumScore && articles.length < limitArticle)
					{
						var id 		= $(this).parent().parent().next().find('.score').attr('id').replace('score_','')
							, title = $(this).next().text()
							, link 	= $(this).next().attr('href')
							, date 	= $(this).parent().parent().next().find('.score').next().next().text()
							;

						articles.push({id : id, link : link, title : title, score : score, date : date});
					}
				})
				;
				callback(error, articles);
			}
		})
		;
	}
	;

exports.news = news;
