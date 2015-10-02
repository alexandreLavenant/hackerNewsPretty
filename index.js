/* jshint laxcomma : true, loopfunc : true */

var hacker	  	= require('./lib/hackerLib')
	, fs	  	= require('fs')
	, express 	= require('express')
	, app	  	= express()
	, server  	= require('http').Server(app)
	, ejs	  	= require('ejs')
	, shot	  	= require('webshot')
	, shotPath	= "./public/images/articles/"
	, port	  	= 8080
	;

// set the view engine to ejs
app.set('view engine', 'ejs');

//resources (favicon, js and css)
app.use(express.static('public'));

// index page
app.get('/', function(req, res)
{
	console.log('new user');
	hacker.news(75, 9, function(err, articles)
	{
		var promises = [];

		for(var i=0, l=articles.length; i<l; ++i)
		{
			(function(i)
			{
				promises.push(
					new Promise(function(resolve, reject)
					{
						fs.stat(shotPath+articles[i].id+".png", function(err, stats)
						{
							if(err)
							{
								console.log('taking screenshot: ', articles[i].link);
								shot(articles[i].link, shotPath+articles[i].id+'.png', {screenSize: {width: 300, height: 300}}, function(error)
								{
									if (!error)
									{
										console.log('screenshot saved: ', articles[i].link);
										resolve();
									}
									else
									{
										console.error("Can't taking screenshot, bad url : ",articles[i].link);
										resolve();
									}
								});
							}
							else
							{
								console.log('screenshot already saved');
								resolve();
							}
						});
					})
				);
			}(i));
		}

		if(!err)
		{
			Promise.all(promises)
			.then(function()
			{
				res.render('hacker', { articles : articles });
			});
		}
		else
		{
			console.error(err);
		}
	});
});

app.get('/clean', function(req, res)
{
	var promises = [];

	fs.readdir(shotPath, function(err, files)
	{
		for(var i=0, l=files.length; i<l; ++i)
		{
			(function(i)
			{
				promises.push(
					new Promise(function(resolve,reject)
					{
						fs.stat(shotPath+files[i], function(err, stats)
						{
							var currentDate = Date.now()
								, fileDate = new Date(stats.birthtime).getTime()+108e5 // 3 hours late
								;

							if(currentDate > fileDate)
							{
								fs.unlink(shotPath+files[i], function(err)
								{
									if(err)
									{
										reject(err);
									}
									else
									{
										resolve('remove screenshot ',files[i]);
									}
								});
							}
							else
							{
								resolve(null);
							}
						});
					})
				);
			}(i));
		}

		Promise.all(promises)
		.then(function(results)
		{
			var numRemoved = 0;
			for(var i=0, l=results.length; i<l; ++i)
			{
				if(results[i]) numRemoved++;
			}
			res.send('removed '+numRemoved+' files');
		})
		.catch(function(error)
		{
			console.error(error);
		});
	});
});

server.listen(port);
console.log('server listen on '+port);
