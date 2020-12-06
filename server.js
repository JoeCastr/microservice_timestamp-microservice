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

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function (req, res) {
  res.sendFile(__dirname + '/views/index.html');
});


// your first API endpoint... 
app.get("/api/hello", function (req, res) {
  res.json({greeting: 'hello API'});
});

app.get("/api/timestamp/:date?", (req, res) => {
  // my date will be entered by the user like so: 1993-10-12

  // if the input date string is invalid
  // // api returns an object {error : "Invalid Date"}

  // an empty date parameter should return the current time in a JSON object
  // with a "unix" key
  // with a "utc" key
  let date;
  let validity = req.params.date;
  let unixTimestamp;
  let dateObj;
  let utcString;

  if (validity && validity.length > 0) {                      // is date a string with a length greater than 0 ? If it's empty, theres no length
    date = req.params.date;
    validity = new Date(date);

    if (Date.parse(validity)) {                               // checks if 'date' is a valid date
      unixTimestamp = new Date(date);
      dateObj = new Date(unixTimestamp * 1000);
      utcString = dateObj.toUTCString()

      res.json({
        "unix": unixTimestamp,
        "utc": utcString
      });
    } else {                                             // if date is a string but NOT a valid date, then return this instead
      res.json({ error: "Invalid Date" });
    }
  } else {                  // here I handle the empty string, so I need to return the current time. The reutrn object requires a 'unix' and 'utc' key
    unixTimestamp = new Date().getTime() / 1000;
    dateObj = new Date(unixTimestamp * 1000);
    utcString = dateObj.toUTCString();

    res.json({
      "unix": unixTimestamp,
      "utc": utcString
    });
  }
})


// listen for requests :)
var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
