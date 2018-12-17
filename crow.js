const express = require('express')
const app = express();
const request = require('request');
const cheerio = require('cheerio');

function sleep(delay) {
    var start = new Date().getTime();
    while (new Date().getTime() < start + delay);
}

app.get('/api/:name', function (req, res) {
    let name = req.params.name;
    let url = `https://onoffmix.com/event/main?s=${name}`
    let base = "https://onoffmix.com"
    let newurl;
    let result = {
        title: [],
        emptypeople: [],
        date: [],
        ciimg: [],
        desimg:[],
    }
    let ddd = []
    let lll = []
    request(url, function (err, response, body) {
        var j = 0;
        const $ = cheerio.load(body);
        for (var i = 1; i < 100; i++) {

            let titleArr = $(`#content > div > section.event_main_area > ul > li:nth-child(` + String(i) + `) > article > a > div.event_info_area > div.title_area > h5`)
            let peopleArr = $(`#content > div > section.event_main_area > ul > li:nth-child(` + String(i) + `) > article > a > div.event_state_area > span`)
            let link = $(`#content > div > section.event_main_area > ul > li:nth-child(` + String(i) + `) > article > a`)
            let image = $('#content > div > section.event_main_area > ul > li:nth-child(' + String(i) + ') > article > a > div.event_thumbnail > img')
            if (titleArr[0] == undefined && link[0] == undefined && peopleArr[0] == undefined)
                break
            result.title.push(titleArr[0].attribs.title)
            ddd.push(base + link[0].attribs.href)
            lll.push(base + link[0].attribs.href + '/content')
            result.ciimg.push(image[0].attribs.src)
            if (peopleArr[0].children[0].data == undefined) {
                let peopleArr = $(`#content > div > section.event_main_area > ul > li:nth-child(` + String(i) + `) > article > a > div.event_state_area > span>strong`)
                result.emptypeople.push(peopleArr[0].children[0].data)
            } else {
                result.emptypeople.push(peopleArr[0].children[0].data)
            }
            request(ddd[j], function (err, response, body) {
                const $ = cheerio.load(body);
                let date = $('#content > div.content_wrapping.max_width_area > section.event_summary > div.right_area > ul > li:nth-child(1) > p')
                let iframe = $('#eventDetail > iframe')
                result.date.push(date[0].children[0].data)
                request(base + iframe[0].attribs.src, function (err, response, body) {
                    console.log(body)
                    const $ = cheerio.load(body);
                    let images = $('body > img')
                    console.log(images[0])
                    if(images[0] != undefined)
                        result.desimg.push(images[0].attribs.src)
                    
                })
            })
            j += 1;
        }
        setTimeout(function () {
            let tmp = []
            let resstr
            for (var i = 0; i < result.date.length; i++) {
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
            for (var i = 0; i <= tmp.length; i++) {
                for (var j = 0; j < i; j++) {
                    let temp, temp2;
                    if (tmp[i] < tmp[j]) {
                        temp2 = result.date[i];
                        temp = tmp[i];
                        result.date[i] = result.date[j];
                        tmp[i] = tmp[j];
                        result.date[j] = temp2;
                        tmp[j] = temp;
                    }
                }
            }
            console.log(tmp)
            res.json(result)
        }, 13000)
    })
})

app.listen(3000, function () {
    console.log('ad')
})