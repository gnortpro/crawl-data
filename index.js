
var Crawler = require("crawler");
const https = require("https");

const arrayPush = [];
var c = new Crawler({
  rateLimit: 10000,
  maxConnections: 1,
  // This will be called for each crawled page
  callback: function (error, res, done) {
    if (error) {
      console.log(error);
    } else {
      var $ = res.$;
      // $ is Cheerio by default
      //a lean implementation of core jQuery designed specifically for the server
      // console.log($("img").attr('src'));
      var images = $('.commodity_style_pic a').children('img').map(function () {
        return $(this).attr('src');
      }).get();

      var titles = $('.commodity_title').children('a').map(function () {
        return { title: $(this).text(), url: $(this).attr('href') };
      }).get();

      for (let index = 0; index < titles.length; index++) {
        const element = titles[index];
        element.images = images[index]; // insert image object
        arrayPush.push(element[index]);
      }


      const options = {
        hostname: "dff51c50a2c69ca8138fc80e0e69f5d6.m.pipedream.net",
        port: 443,
        path: "/",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      }
      const req = https.request(options, resp => {
        let data = JSON.stringify(arrayPush);
       
      })
      req.write(JSON.stringify(arrayPush))
      req.end();
    }
    done();
  }
});

// Queue just one URL, with default callback
// c.queue('http://www.amazon.com');

// Queue a list of URLs

c.queue('https://www.goten.com/best-sellers.html?pageIndex=1');
c.queue('https://www.goten.com/best-sellers.html?pageIndex=2');
c.queue('https://www.goten.com/best-sellers.html?pageIndex=3');
c.queue('https://www.goten.com/best-sellers.html?pageIndex=4');
c.queue('https://www.goten.com/best-sellers.html?pageIndex=5');
c.queue('https://www.goten.com/best-sellers.html?pageIndex=6');
c.queue('https://www.goten.com/best-sellers.html?pageIndex=7');


// Queue URLs with custom callbacks & parameters
// c.queue([{
//     uri: 'http://parishackers.org/',
//     jQuery: false,

//     // The global callback won't be called
//     callback: function (error, res, done) {
//         if(error){
//             console.log(error);
//         }else{
//             console.log('Grabbed', res.body.length, 'bytes');
//         }
//         done();
//     }
// }]);

// Queue some HTML code directly without grabbing (mostly for tests)
// c.queue([{
//     html: '<p>This is a <strong>test</strong></p>'
// }]);