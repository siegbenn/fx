var request = require('request');
var Stats = require('fast-stats').Stats;
var fs = require('fs');

function getstddiv(cur1, cur2) {
var cur1 = cur1;
var cur2 = cur2;
request.get({
    url: 'https://api-fxpractice.oanda.com/v1/candles?instrument='+cur1+'&count=168&candleFormat=bidask&granularity=H1&dailyAlignment=0&alignmentTimezone=America%2FNew_York',
    'auth': {
        'bearer': '288b00b15a621d41699d496e287d1982-898404c2a1ffe97c68ef6d97e95eeb0f'
    },
    json: true
}, function(err, res, gu) {
    request.get({
        url: 'https://api-fxpractice.oanda.com/v1/candles?instrument='+cur2+'&count=168&candleFormat=bidask&granularity=H1&dailyAlignment=0&alignmentTimezone=America%2FNew_York',
        'auth': {
            'bearer': '288b00b15a621d41699d496e287d1982-898404c2a1ffe97c68ef6d97e95eeb0f'
        },
        json: true
    }, function(err, res, eu) {
        var Cur1CloseAsk = [];
        for (var i in gu.candles) {
            Cur1CloseAsk.push(gu.candles[i].closeAsk);
        }
        var Cur2CloseBid = [];
        for (var j in eu.candles) {
            Cur2CloseBid.push(eu.candles[j].closeBid);
        }
        var Cur1AskCur2BidDiff = new Stats();
        for (var k in gu.candles) {
            Cur1AskCur2BidDiff.push(Cur1CloseAsk[k] - Cur2CloseBid[
                k]);
        }
        var Cur1AskCur2BidMean = Cur1AskCur2BidDiff.amean();
        var Cur1AskCur2BidStdDiv = Cur1AskCur2BidDiff.stddev();
        var Cur1CloseBid = [];
        for (var l in gu.candles) {
            Cur1CloseBid.push(gu.candles[l].closeAsk);
        }
        var Cur2CloseAsk = [];
        for (var m in eu.candles) {
            Cur2CloseBid.push(eu.candles[m].closeBid);
        }
        var Cur1BidCur2AskDiff = new Stats();
        for (var n in gu.candles) {
            Cur1AskCur2BidDiff.push(Cur1CloseAsk[n] - Cur2CloseBid[
                n]);
        }
        var Cur1BidCur2AskMean = Cur1AskCur2BidDiff.amean();
        var Cur1BidCur2AskStdDiv = Cur1AskCur2BidDiff.stddev();
        request.get({
            url: 'https://api-fxpractice.oanda.com/v1/prices?instruments='+cur1+'%2C'+cur2,
            'auth': {
                'bearer': '288b00b15a621d41699d496e287d1982-898404c2a1ffe97c68ef6d97e95eeb0f'
            },
            json: true
        }, function(err, res, current) {
            var currentCur1Ask = current.prices[0].ask;
            var currentCur1Bid = current.prices[0].bid;
            var currentCur2Ask = current.prices[1].ask;
            var currentCur2Bid = current.prices[1].bid;
            var currentCur1AskCur2BidDiff = currentCur1Ask -
                currentCur2Bid;
            var currentCur1AskCur2BidStdDiv = (
                    currentCur1AskCur2BidDiff -
                    Cur1AskCur2BidMean) /
                Cur1AskCur2BidStdDiv;
            var currentCur1BidCur2AskDiff = currentCur1Bid -
                currentCur2Ask;
            var currentCur1BidCur2AskStdDiv = (
                    currentCur1BidCur2AskDiff -
                    Cur1BidCur2AskMean) /
                Cur1BidCur2AskStdDiv;
            var logString = (new Date() + "," +
                currentCur1Ask + "," + currentCur2Bid +
                "," + currentCur1AskCur2BidDiff + "," + Cur1AskCur2BidMean + "," +
                currentCur1AskCur2BidStdDiv + "," +
                currentCur1Bid + "," + currentCur2Ask +
                "," + currentCur1BidCur2AskDiff + "," + Cur1BidCur2AskMean + "," +
                currentCur1BidCur2AskStdDiv);
            processInput(logString, cur1, cur2)
        })
    });
});
}

getstddiv("EUR_USD", "NZD_USD"); // 0.92
getstddiv("AUD_JPY", "AUD_CHF"); // 0.95
getstddiv("EUR_JPY", "CHF_JPY"); // 0.94
getstddiv("AUD_USD", "NZD_USD"); // 0.71
getstddiv("GBP_JPY", "CAD_JPY"); // 0.98
getstddiv("EUR_CAD", "EUR_GBP"); // 0.93



function processInput(text, cur1, cur2) {
    var filename = cur1+"_"+cur2+'.csv';
    fs.open(filename, 'a', function(e, id) {
        fs.write(id, text + "\n", null, 'utf8', function() {
            fs.close(id, function() {
                console.log(filename+' was updated.');
            });
        });
    });
}