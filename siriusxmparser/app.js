var sucker = require('./sucker.js');
var MongoClient = require('mongodb').MongoClient;


let url = 'mongodb://localhost:27017/siriusxm';

MongoClient.connect(url).then(function(db) {
	console.log('connected like a boss');

	var data = db.collection('data');

	sucker().then(function(channels) {
		let toProcess = channels.length;
		let done = 0;
		let inserted = 0;
		console.log('got my result, size is '+toProcess);

		/*
		so the logic is as follows: 
			iterate over each result
			look for a match w/n a 3 minute time frame
		*/
		let dateFilter = new Date(new Date().getTime() - 5*60000);
		
		channels.forEach(function(channel) {
			channel.timestamp = new Date();
			//console.log(channel);

			data.find({
				'title':channel.title,
				'channel':channel.channel,
				'artist':channel.artist,
				'timestamp':{
					'$gte':dateFilter
				}
			}).toArray(function(err, docs) {
				if(err) console.log('Err', err);
				if(docs && docs.length === 0) {
					data.insert(channel, function(err, result) {
						if(err) throw(err);
						if(!err) {
							inserted++;
							done++;
							if(done === toProcess) {
								db.close();
								console.log('Total inserted: ',inserted);
							}
						}
					});
				} else {
					//console.log('not inserting');
					done++;
					if(done === toProcess) {
						db.close();
						console.log('Total inserted: ',inserted);
					}
				}
			});

		});
	}).catch(function(err) {
		console.log('unhandled error', err);
		db.close();	
	});


}).catch(function(err) {
	console.log('mongodb err', err);
});

