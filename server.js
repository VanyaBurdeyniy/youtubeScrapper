var jsdom = require("jsdom");
var Crawler = require("crawler");
var url = require('url');
var express = require('express');
var mongoose = require('mongoose');
var db = mongoose.connect('mongodb://localhost:27017/youtubeScrapper');

var expressServer = require('./config/express');
var app = expressServer();

app.use(express.static(__dirname + '/public'));

var passport = require('./config/passport')();

var pageCount = 1;

var c = new Crawler({
    maxConnections : 10,
    callback : function (error, result, $) {
        $('a').each( function(index, a) {
            var toQueueUrl = $(a).attr('href');
            c.queue(toQueueUrl);
        });
    }
});


var channelsWithCountry = [];
app.post('/getcountries', function(req, res) {
    console.log(req.body);
    youtubeSearch('https://www.youtube.com/channel/' + req.body[0].id.channelId + '/about', req.body);
});

/**************************************
 ****** https://www.youmagine.com ******
 ***************************************/

function youtubeSearch(url, channels) {
    if (channels[0]) {
        c.queue([{
            uri: url,
            jQuery: false,
            callback: function(error, result) {
                jsdom.env(
                    result.body,
                    ["./jquery.js"],
                    function(err, window) {
                        // console.log(window.$('.country-inline').text());
                        channels[0].country = window.$('.country-inline').text();
                        channelsWithCountry.push(channels[0]);
                        // channels.splice(0, 1);
                        delete channels[0];
                        if (channels[0]) {
                            youtubeSearch('https://www.youtube.com/channel/' + channels[0].id.channelId + '/about', channels);
                        } else {
                            console.log(channelsWithCountry);
                        }
                    }
                );
            }
        }]);
    } else {
        // console.log(channelsWithCountry);
    }
}
/*
 * Steal content from https://www.youmagine.com
 * */
function getContentFromYouMaginePage() {
    c.queue([{
        uri: allLinksToPages[count],
        jQuery: false,
        callback: function(error, result) {

            if (allLinksToPages.length == 0) {
                if (isGetAllLinks) {
                    arrayCount += 1;
                    youMaginePageCount++;
                    youMagineGetAll('https://www.youmagine.com/designs/latest?page=' + youMaginePageCount);
                } else {
                    return console.log('-----------------------\n' +
                        'Done!');
                }
            } else {
                jsdom.env(
                    result.body,
                    ["./jquery.js"],
                    function(err, window) {
                        var documentId,
                            pageUrl = allLinksToPages[count],
                            description = window.$('#information').find('.description').text(),
                            title = window.$('.design-title').text();

                        window.$.each(window.$("#documents").find('.document'), function(i, v) {
                            if (window.$(v).find('.meta').find('.file-info').text().match('STL')) {
                                if (documentId) { documentId = documentId + ', ' + host + window.$(v).find('.download').attr('href'); }
                                else { documentId = host + window.$(v).find('.download').attr('href'); }
                            }
                        });
                        window.$.each(window.$('#js-carousel').find('.images').find('.image'), function(i, v) {
                            var src = window.$(v).css('background-image');
                            src = src.replace('"', '');
                            src = src.replace('url(', '');
                            src = src.replace(')', '');
                            googleTablesData.push({
                                'imageUrl': 'https://www.youmagine.com' + src,
                                'title':title,
                                'description':description,
                                'pageUrl':pageUrl,
                                'documentId':documentId
                            });
                            if (src.match('jpg') || src.match('JPG')) {

                            }
                        });

                        if (googleTablesData.length > 0) {
                            Content.insertMany(googleTablesData);
                            googleTablesData = [];
                            if (allLinksToPages.length > 0) {
                                allLinksToPages.splice(0, 1);
                                getContentFromYouMaginePage();
                            } else {
                                return console.log('-----------------------\n' +
                                    'Done!');
                            }
                        } else {
                            console.log(allLinksToPages.length);
                            googleTablesData = [];
                            if (allLinksToPages.length > 0) {
                                allLinksToPages.splice(0, 1);
                                getContentFromYouMaginePage();
                            } else {
                                return console.log('-----------------------\n' +
                                    'Done!');
                            }
                        }
                    }
                );
            }
        }
    }]);
}

app.listen(3000);
console.log('app listen on port 3000');