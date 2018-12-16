const express = require('express')
const app = express();
const request = require('request');
const cheerio = require('cheerio');
app.get('/api/:name', function (req, res) {
    let name = req.params.name;
    let url = `https://onoffmix.com/event/main?s=${name}`
    let base = "https://onoffmix.com"
    let newurl;
    let result = {
        title: [],
        emptypeople: [],
        date: [],
    }
    let ddd = []
    request(url, function (err, response, body) {
        var j = 0;
        const $ = cheerio.load(body);
        for (var i = 1; i < 100; i++) {

            let titleArr = $(`#content > div > section.event_main_area > ul > li:nth-child(` + String(i) + `) > article > a > div.event_info_area > div.title_area > h5`)
            let peopleArr = $(`#content > div > section.event_main_area > ul > li:nth-child(` + String(i) + `) > article > a > div.event_state_area > span`)
            let link = $(`#content > div > section.event_main_area > ul > li:nth-child(` + String(i) + `) > article > a`)
            if (titleArr[0] == undefined && link[0] == undefined && peopleArr[0] == undefined)
                break
            result.title.push(titleArr[0].attribs.title)
            ddd.push(base + link[0].attribs.href)
            if (peopleArr[0].children[0].data == undefined) {
                let peopleArr = $(`#content > div > section.event_main_area > ul > li:nth-child(` + String(i) + `) > article > a > div.event_state_area > span>strong`)
                result.emptypeople.push(peopleArr[0].children[0].data)
            }
            else{
                result.emptypeople.push(peopleArr[0].children[0].data)
            }
            request(ddd[j], function (err, response, body) {
                console.log(ddd[j])
                const $ = cheerio.load(body);
                let date = $('#content > div.content_wrapping.max_width_area > section.event_summary > div.right_area > ul > li:nth-child(1) > p')
                result.date.push(date[0].children[0].data)
                console.log(date[0].children[0].data)
            })
            //내일 해야하는것 : result.date 부분 날짜비교
            j += 1;
        }
        setTimeout(function () {
            console.log(result)
            res.json(result)
        }, 2000)
    })
})

app.listen(3000, function () {
    console.log('ad')
})