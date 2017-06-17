const express = require('express');
var bodyParser = require('body-parser')
const app = express();

app.set('port', (process.env.PORT || 3001));

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

var ToneAnalyzerV3 = require('watson-developer-cloud/tone-analyzer/v3');

var tone_analyzer = new ToneAnalyzerV3({url: "https://gateway.watsonplatform.net/tone-analyzer/api", username: "7f240490-e244-45a2-90b4-8a3e11f13089", password: "6iJSZ7uIBYk5", version_date: '2016-05-19'});

// Express only serves static assets in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static('client/build'));
}

app
  .post('/api/watson/tone', function (req, res, next) {
    var feel = req.body.feel;
    tone_analyzer.tone({
      text: feel
    }, function (err, tone) {
      if (err) 
        console.log(err);
      else 
        console.log(JSON.stringify(tone, null, 2));
      }
    );
  });

app.listen(app.get('port'), () => {
  console.log(`Find the server at: http://localhost:${app.get('port')}/`); // eslint-disable-line no-console
});