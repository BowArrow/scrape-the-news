const db = require("../models");
const axios = require("axios");
const cheerio = require("cheerio")

module.exports = function(app) {
    app.get("/", function(req, res){
        db.Article.find({})
            .then(function(result){
                res.render("index", result);
            })
    })
    app.get("/scrape", function(req, res) {
        axios.get("https://news.google.com/?hl=en-US&gl=US&ceid=US:en").then(function(response) {
            const $ = cheerio.load(response.data);
            // .each through element on page for data
            $("article h3").each(function(i, element) {
                let result = {}
                let upDiv = $(this).parent().parent().parent().parent();
                result.image = upDiv.find("figure img").attr("src");
                result.title = $(this)
                    .find("span")
                    .text();
                result.link = "https://google.com" + $(this)
                    .find("a")
                    .attr("href");
                result.summary = $(this)
                    .parent()
                    .find("p")
                    .text();
                console.log(result)
                db.Article.create(result)
                    .then(function(dbArticle) {
                        console.log(dbArticle);
                    })
                    .catch(function(err) {
                        console.log(err);
                    })
            })


            //create an article in mongoDB


            res.redirect("/")
        });
    });
}