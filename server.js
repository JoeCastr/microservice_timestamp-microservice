// server.js
// where your node app starts

// init project
var express = require('express');
var app = express();

// enable CORS (https://en.wikipedia.org/wiki/Cross-origin_resource_sharing)
// so that your API is remotely testable by FCC 
var cors = require('cors');
app.use(cors({optionsSuccessStatus: 200}));  // some legacy browsers choke on 204

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

// I need a function to validate the date
function isHumanDate(entry) {
  let isTextNumber = isNaN(Number(entry))
  let isValidTextDate = typeof Date.parse(entry) === 'number'
  return (isTextNumber && isValidTextDate)
}

  //A 4 digit number is a valid ISO-8601 for the beginning of that year
  //5 digits or more must be a unix time

function isInvalidStringDate(entry) {
  let isNotUnix = parseInt(entry).length < 5
  let entryDate = new Date(Number(entry));
  return (isNotUnix && Date.parse(entryDate) === 0);
}

function isUnixTime(entry) {
  return (typeof entry === 'number' && entry > 0);
}

function isUndefined(entry) {
  return (!entry)
}


// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function (req, res) {
  res.sendFile(__dirname + '/views/index.html');
});


// your first API endpoint... 
app.get("/api/hello", function (req, res) {
  res.json({greeting: 'hello API'});
});

app.get("/api/timestamp/:date?", (req, res) => {
  let date = req.params.date;

  if (isUndefined(date)) {
    let unix = Date.now();
    let utc = (new Date(unix)).toUTCString();

    res.json({
      "unix": unix,
      "utc": utc
    })
  } else if (isInvalidStringDate(date)) {
    res.json({
      error: "Invalid Date"
    })
  } else if (isUnixTime(Number(date))) {
    let unixDateDateObj = new Date(Number(date));
    let unixDateDateObjToUnix = unixDateDateObj.getTime();

    res.json({
      "unix": unixDateDateObjToUnix,
      "utc": unixDateDateObj.toUTCString()
    })
  } else if (isHumanDate(date)) {
    let unix = Date.parse(date)
    let utc = (new Date(date)).toUTCString();

    res.json({
      "unix": unix,
      "utc": utc
    })
  }
})


// listen for requests :)
var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});