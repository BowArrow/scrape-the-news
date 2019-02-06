const db = require("../models");

module.exports = function(app) {
    app.get("/scrape", function(req, res) {
        axios.get("https://news.google.com/?hl=en-US&gl=US&ceid=US:en").then(function(response) {
            const $ = cheerio.load(response.data);
            // .each through element on page for data
            $("main c-wiz div").each(function(i, element) {
                let result = {}
                result.image = $(this)
                    .children("img")
                    .attr("src");
                result.title = $(this)
                    .children("h3")
                    .text();
                result.link = "https://google.com" + $(this)
                    .children("a")
                    .attr("href");

                db.Article.create(result)
                    .then(function(dbArticle) {
                        console.log(dbArticle);
                    })
                    .catch(function(err) {
                        console.log(err);
                    })
            })


            //create an article in mongoDB


            res.send("Scrape Complete")
        });
    });
}