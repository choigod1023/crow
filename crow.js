const express = require('express')
const app = express();
const request = require('request');
const cheerio = require('cheerio');
var mongoose = require('mongoose');
var autoIncrement = require('mongoose-auto-increment');
var db = mongoose.connection;


app.get('/api/:name', function (req, res) {
    let name = req.params.name;
    
    let url = `https://onoffmix.com/event/main/?c=${name}`
    let base = "https://onoffmix.com"
    let hash1, hash2, hash3, hash4, hash5
    let hash = {
        info: []
    }
    let result = {
        info: []
    }
    let ddd = []
    console.log(url)
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
    ddd.push("https://onoffmix.com/event/93998","https://onoffmix.com/event/142090","https://onoffmix.com/event/119300","https://onoffmix.com/event/147627","https://onoffmix.com/event/139054")
    setTimeout(function () {
        for (var j = 0; j < ddd.length; j++) {

            let datetmp;
            let own;
            request(ddd[j], function (err, response, body) {
                const $ = cheerio.load(body);
                let titleArr = $(`#content > div.content_wrapping.max_width_area > section.event_summary > div.right_area > h3`)
                let peopleArr = $(`#content > div.content_wrapping.max_width_area > section.event_summary > div.right_area > ul > li:nth-child(3) > p > span.available > span`)
                let image = $('#content > div.content_wrapping.max_width_area > section.event_summary > div.left_area > div.event_thumbnail.main_thumbnail > img')
                let date = $('#content > div.content_wrapping.max_width_area > section.event_summary > div.right_area > ul > li:nth-child(1) > p')
                let iframe = $('#eventDetail > iframe')
                let hashtag1 = $('#content > div.content_wrapping.max_width_area > section.event_summary > div.right_area > div.tags > a:nth-child(' + String(1) + ')')
                let hashtag2 = $('#content > div.content_wrapping.max_width_area > section.event_summary > div.right_area > div.tags > a:nth-child(' + String(2) + ')')
                let hashtag3 = $('#content > div.content_wrapping.max_width_area > section.event_summary > div.right_area > div.tags > a:nth-child(' + String(3) + ')')
                let hashtag4 = $('#content > div.content_wrapping.max_width_area > section.event_summary > div.right_area > div.tags > a:nth-child(' + String(4) + ')')
                let hashtag5 = $('#content > div.content_wrapping.max_width_area > section.event_summary > div.right_area > div.tags > a:nth-child(' + String(5) + ')')
                let owner = $('#hostInfo > li.host_name > a')
                if (hashtag1[0] !== undefined)
                    hash1 = hashtag1[0].children[0].data.split("#")[1]
                if (hashtag2[0] !== undefined)
                    hash2 = hashtag2[0].children[0].data.split("#")[1]
                if (hashtag3[0] !== undefined)
                    hash3 = hashtag3[0].children[0].data.split("#")[1]
                if (hashtag4[0] !== undefined)
                    hash4 = hashtag4[0].children[0].data.split("#")[1]
                if (hashtag5[0] !== undefined)
                    hash5 = hashtag5[0].children[0].data.split("#")[1]
                else
                    hash5 = undefined
                if(owner[0]!==undefined)
                    own = owner[0].children[0].data
                else
                    own = "본 모임은 종료된 모임입니다."
                hash.info.push({
                    temp1: hash1,
                    temp2: hash2,
                    temp3: hash3,
                    temp4: hash4,
                    temp5: hash5
                })
                if (date[0].children[0].data.split("~ ")[1].indexOf(" (") != -1) {
                    datetmp = date[0].children[0].data.split("~ ")[1].split(" (")[0].replace(".", "-").replace(".", "-")
                }
                else {
                    datetmp = date[0].children[0].data.split(" ~")[0].split(" (")[0].replace(".", "-").replace(".", "-")
                }
                result.info.push({
                    name: titleArr[0].attribs.title,
                    img: image[0].attribs.src,
                    content: titleArr[0].attribs.title,
                    date: {
                        startDate: date[0].children[0].data.split(" ~")[0].split(" (")[0].replace(".", "-").replace(".", "-"),
                        endDate: datetmp
                    },
                    tags: [{
                        "color":"blue",
                        "text":"온오프믹스",
                    },
                    {
                        "color": "green",
                        "text": "외부대회",
                    }],
                    owner: own,
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
    }, 5000)

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

        for (var i = 0; hash.info[i] !== undefined; i++) {
            let hashtagging = []
            hashtagging.push(hash.info[i].temp1, hash.info[i].temp2, hash.info[i].temp3, hash.info[i].temp4, hash.info[i].temp5)
            for (var j = 0; j < hashtagging.length; j++) {
                if (hashtagging[j] === undefined)
                    break
                else if (hashtagging[j].indexOf("초등") != -1 || hashtagging[j].indexOf("중등") != -1 || hashtagging[j].indexOf("고등") != -1 || hashtagging[j].indexOf("대학") != -1) {
                    result.info[i].tags.push({
                        "color": "red",
                        "text": hashtagging[j]
                    })
                }
                else if (hashtagging[j].indexOf("해커톤") != -1 || hashtagging[j].indexOf("공모전") != -1 || hashtagging[j].indexOf("캠프") != -1) {
                    result.info[i].tags.push({
                        "color": "orange",
                        "text": hashtagging[j]
                    })
                }

                else {
                    result.info[i].tags.push({
                        "color": "grey",
                        "text": hashtagging[j]
                    })
                }
            }
        }
        const mongodb = require("mongodb");
        const uri = "mongodb+srv://andy:8CcdLiVD9PlMAdfj@thisismongodb-lk0as.mongodb.net/dicon?retryWrites=true"
        const client = new mongodb.MongoClient(uri, { useNewUrlParser: true });
        client.connect(err => {
            const collection = client.db("dicon").collection("contestdatas");
            console.log(result.info)
            collection.dropIndexes();
            collection.insertMany(result.info,function(err,data){
                console.log(err);
            })
            client.close();
        });
        res.json(result)

    }, 12000)
})

app.listen(3003, function () {
    console.log('ad')
})