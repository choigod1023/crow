const express = require('express')
const app = express();
const request = require('request');
const cheerio = require('cheerio');

app.get('/api/:name', function (req, res) {
    let name = req.params.name;
    let url = `https://onoffmix.com/event/main?s=${name}`
    let base = "https://onoffmix.com"
    let result = {
        info: []
    }
    let ddd = []
    request(url, function (err, response, body) {

        const $ = cheerio.load(body);
        for (var i = 1; i < 100; i++) {
            let titleArr = $(`#content > div > section.event_main_area > ul > li:nth-child(` + String(i) + `) > article > a > div.event_info_area > div.title_area > h5`)
            let peopleArr = $(`#content > div > section.event_main_area > ul > li:nth-child(` + String(i) + `) > article > a > div.event_state_area > span`)
            let link = $(`#content > div > section.event_main_area > ul > li:nth-child(` + String(i) + `) > article > a`)

            if (titleArr[0] == undefined && link[0] == undefined && peopleArr[0] == undefined)
                break
            ddd.push(base + link[0].attribs.href)

        }
    })

    setTimeout(function () {

        for (var j = 0; j < ddd.length; j++) {
            let hash = []
            request(ddd[j], function (err, response, body) {
                const $ = cheerio.load(body);
                let titleArr = $(`#content > div.content_wrapping.max_width_area > section.event_summary > div.right_area > h3`)
                let peopleArr = $(`#content > div.content_wrapping.max_width_area > section.event_summary > div.right_area > ul > li:nth-child(3) > p > span.available > span`)
                let image = $('#content > div.content_wrapping.max_width_area > section.event_summary > div.left_area > div.event_thumbnail.main_thumbnail > img')
                let date = $('#content > div.content_wrapping.max_width_area > section.event_summary > div.right_area > ul > li:nth-child(1) > p')
                let iframe = $('#eventDetail > iframe')
                let limit = $('#content > div.content_wrapping.max_width_area > section.event_summary > div.right_area > form > div.group_area > div > p > span.date')
                for (var i = 0; i < ddd.length; i++) {
                    let hashtag = $('#content > div.content_wrapping.max_width_area > section.event_summary > div.right_area > div.tags > a:nth-child(' + String(i) + ')')
                    console.log(hashtag.children)
                }
                result.info.push({
                    name: titleArr[0].attribs.title,
                    img: image[0].attribs.src,
                    content: titleArr[0].attribs.title,
                    date: {
                        startDate: date[0].children[0].data.split(" ~")[0],
                        endDate: date[0].children[0].data.split("~ ")[1]
                    },
                    tag: hash,
                    link: base + iframe[0].attribs.src.split("/content")[0],
                    isJoin: true,
                    isApplicable: true
                })
                // result.ciimg.push()
                // result.site.push(base + iframe[0].attribs.src.split("/content")[0])
                // if (peopleArr[0] == undefined) {
                //     result.emptypeople.push("외부접수")
                // }
                // else {
                //     result.emptypeople.push(peopleArr[0].children[0].data)
                // }
                // result.limitdate.push(limit[0].children[0].data)
            })
        }
    }, 3000)

    setTimeout(function () {
        let tmp = []
        let resstr
        for (var i = 0; i < result.length; i++) {
            if (result.date[i].indexOf(" ~")) {
                str = result.date[i].split(' ~')[0]
            }
            str = str.split(" (")[0]
            str = str.replace(".", "")
            str = str.replace(".", "")
            if (str.length == 7) {
                let tempstr = "0"
                let year = ""
                for (var j = 0; j <= 3; j++) {
                    if (str[j] == undefined)
                        break
                    year += str[j]
                }
                for (var j = 4; j <= 7; j++) {
                    if (str[j] == undefined)
                        break
                    tempstr += str[j]
                }
                resstr = year + tempstr
                var y = resstr.substr(0, 4);
                var m = resstr.substr(4, 2);
                var d = Number(resstr.substr(6, 2));

                var date = new Date(y, m - 1, d);
                tmp[i] = date.setDate(date.getDate() + 1);
            } else {
                var y = str.substr(0, 4);
                var m = str.substr(4, 2);
                var d = Number(str.substr(6, 2));
                var date = new Date(y, m - 1, d);
                tmp[i] = date.setDate(date.getDate() + 1);
            }
        }
        res.json(result)
    }, 10000)
})

app.listen(3000, function () {
    console.log('ad')
})