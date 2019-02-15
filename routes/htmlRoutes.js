const db = require("../models");
const axios = require("axios");
const cheerio = require("cheerio")

module.exports = function (app) {
    app.get("/", function (req, res) {
        db.Article.find({})
            .then(function (result) {
                console.log(result)
                res.render("index", {
                    data: result
                });
            })
    })
    app.get("/remove", function (req, res) {
        db.Article.remove({}, function(err) {
            console.log("collection removed");
        });
        res.redirect("/scrape")
    })
    app.get("/scrape", function (req, res) {
        axios.get("https://news.google.com/?hl=en-US&gl=US&ceid=US:en").then(function (response) {
            const $ = cheerio.load(response.data);
            // .each through element on page for data
            $("article h3").each(function (i, element) {
                let result = {}
                let upDiv = $(this).parent().parent().parent().parent();
                result.image = upDiv.find("figure img").attr("src");
                result.title = $(this)
                    .find("span")
                    .text();
                result.link = "https://news.google.com" + $(this)
                    .find("a")
                    .attr("href")
                    .substr(1);
                result.summary = $(this)
                    .parent()
                    .find("p")
                    .text();
                // console.log(result)
                db.Article.create(result)
                    .then(function (dbArticle) {
                        // console.log(dbArticle);
                    })
                    .catch(function (err) {
                        console.log(err);
                    })
            })


            //create an article in mongoDB


            res.redirect("/")
        });
    });
}