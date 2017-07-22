var key = require('./key.js');
var request = require('request');
var _ = require('underscore');


// The API that returns the in-email representation.
module.exports = function(req, res) {
  var term = req.query.text.trim();
  if (/^http:\/\/food2fork\.com\/\S+/.test(term)) {
	var tokens = term.split("/");
    handleIdString(tokens[tokens.length - 1], req, res);
  } else {
    // Else, if the user was typing fast and press enter before the /typeahead API can respond,
    // Mixmax will just send the text to the /resolver API (for performance). Handle that here.
    handleSearchString(term, req, res);
  }
};

function handleIdString(id, req, res) {
  //Takes the id string of the selected image and posts the image which links to the food2fork database webpage
  request({
    url: 'http://food2fork.com/api/get/',
    qs: {
      key: key,
      rId: id
    },
    gzip: true,
    json: true,
    timeout: 15 * 1000
  }, function(err, response) {
    if (err) {
      res.status(500).send('Error');
      return;
    }
    var recipleInfo = response.body.recipe;
	var title = '<p>' + recipleInfo.title + '</\p>';
	var html = '<a href="' + recipleInfo.f2f_url + '"><img style="height:200px;width:200px" src="' + recipleInfo.image_url + '"></\a>';
    res.json({
      body: title + html
        // Add raw:true if you're returning content that you want the user to be able to edit
    });
  });
}

function handleSearchString(term, req, res) {
  //If the user doesn't select an image or hits enter on an empty string, will pull the most popular trending recipe to display
  //If there is a string entered, but no image selected, will be the most popular recipe using the returned results otherwise
  //if the string is empty will be the most popular trending overall recipe
  request({
    url: 'http://food2fork.com/api/search',
    qs: {
      key: key,
      q: term
    },
    gzip: true,
    json: true,
    timeout: 15 * 1000
  }, function(err, response) {
    if (err || response.statusCode !== 200 || !response.body || !response.body.recipes) {
      res.status(500).send('Error');
      return;
    }

    var recipleInfo = response.body.recipes[0];
	var title = '<p>' + recipleInfo.title + '</\p>';
	var html = '<a href="' + recipleInfo.f2f_url + '"><img style="height:200px;width:200px" src="' + recipleInfo.image_url + '"></\a>';
    res.json({
      body: title + html
        // Add raw:true if you're returning content that you want the user to be able to edit
    });
  });
}
