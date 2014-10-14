var request = require('request');
var Stats = require('fast-stats').Stats;
var fs = require('fs');

function GBPEUR() {
request.get({
    url: 'https://api-fxpractice.oanda.com/v1/candles?instrument=GBP_USD&count=720&candleFormat=bidask&granularity=H1&dailyAlignment=0&alignmentTimezone=America%2FNew_York',
    'auth': {
        'bearer': '288b00b15a621d41699d496e287d1982-898404c2a1ffe97c68ef6d97e95eeb0f'
    },
    json: true
}, function(err, res, gu) {
    request.get({
        url: 'https://api-fxpractice.oanda.com/v1/candles?instrument=EUR_USD&count=720&candleFormat=bidask&granularity=H1&dailyAlignment=0&alignmentTimezone=America%2FNew_York',
        'auth': {
            'bearer': '288b00b15a621d41699d496e287d1982-898404c2a1ffe97c68ef6d97e95eeb0f'
        },
        json: true
    }, function(err, res, eu) {
        var GBPCloseAsk = [];
        for (var i in gu.candles) {
            GBPCloseAsk.push(gu.candles[i].closeAsk);
        }
        var EURCloseBid = [];
        for (var j in eu.candles) {
            EURCloseBid.push(eu.candles[j].closeBid);
        }
        var GBPAskEURBidDiff = new Stats();
        for (var k in gu.candles) {
            GBPAskEURBidDiff.push(GBPCloseAsk[k] - EURCloseBid[
                k]);
        }
        var GBPAskEURBidMean = GBPAskEURBidDiff.amean();
        var GBPAskEURBidStdDiv = GBPAskEURBidDiff.stddev();
        var GBPCloseBid = [];
        for (var l in gu.candles) {
            GBPCloseBid.push(gu.candles[l].closeAsk);
        }
        var EURCloseAsk = [];
        for (var m in eu.candles) {
            EURCloseBid.push(eu.candles[m].closeBid);
        }
        var GBPBidEURAskDiff = new Stats();
        for (var n in gu.candles) {
            GBPAskEURBidDiff.push(GBPCloseAsk[n] - EURCloseBid[
                n]);
        }
        var GBPBidEURAskMean = GBPAskEURBidDiff.amean();
        var GBPBidEURAskStdDiv = GBPAskEURBidDiff.stddev();
        request.get({
            url: 'https://api-fxpractice.oanda.com/v1/prices?instruments=GBP_USD%2CEUR_USD',
            'auth': {
                'bearer': '288b00b15a621d41699d496e287d1982-898404c2a1ffe97c68ef6d97e95eeb0f'
            },
            json: true
        }, function(err, res, current) {
            var currentGBPAsk = current.prices[0].ask;
            var currentGBPBid = current.prices[0].bid;
            var currentEURAsk = current.prices[1].ask;
            var currentEURBid = current.prices[1].bid;
            var currentGBPAskEURBidDiff = currentGBPAsk -
                currentEURBid;
            var currentGBPAskEURBidStdDiv = (
                    currentGBPAskEURBidDiff -
                    GBPAskEURBidMean) /
                GBPAskEURBidStdDiv;
            var currentGBPBidEURAskDiff = currentGBPBid -
                currentEURAsk;
            var currentGBPBidEURAskStdDiv = (
                    currentGBPBidEURAskDiff -
                    GBPBidEURAskMean) /
                GBPBidEURAskStdDiv;
            var logString = (new Date() + "," +
                currentGBPAsk + "," + currentEURBid +
                "," + currentGBPAskEURBidDiff + "," +
                currentGBPAskEURBidStdDiv + "," +
                currentGBPBid + "," + currentEURAsk +
                "," + currentGBPBidEURAskDiff + "," +
                currentGBPBidEURAskStdDiv);
            processInput(logString)
        })
    });
});
}

 GBPEUR();

function processInput(text) {
    fs.open('log.txt', 'a', function(e, id) {
        fs.write(id, text + "\n", null, 'utf8', function() {
            fs.close(id, function() {
                console.log('file is updated');
            });
        });
    });
}