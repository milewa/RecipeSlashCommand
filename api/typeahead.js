var key = require('./key.js');
var request = require('request');
var _ = require('underscore');


// The Type Ahead API.
module.exports = function(req, res) {
  var term = req.query.text.trim();
  if (!term) {
    res.json([{
      title: '<i>(enter a search term)</i>',
      text: ''
    }]);
    return;
  }

  //Takes the search term and finds a list of recipes 
   request({
    url: 'http://food2fork.com/api/search',
    qs: {
	  key:key,
      q: term
    },
    gzip: true,
    json: true,
    timeout: 10 * 1000
  }, function(err, response) {
    if (err || response.statusCode !== 200 || !response.body || !response.body.recipes) {
      res.status(500).send('Error');
      return;
    }

	//Displays images and text of the recipes
    var results = _.chain(response.body.recipes)
      .reject(function(recipleInfo) {
        return !recipleInfo || !recipleInfo.image_url;
      })
      .map(function(recipleInfo) {
        return {
		  title: '<p>' + recipleInfo.title + '</\p>' + '<image style="height:75px;width=75px" src="' + recipleInfo.image_url + '">',
          text:   recipleInfo.f2f_url
        };
      })
      .value();

    if (results.length === 0) {
      res.json([{
        title: '<i>(no results)</i>',
        text: ''
      }]);
    } else {
      res.json(results);
    }
  });
};
