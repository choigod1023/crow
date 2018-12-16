const express = require('express')
const app = express();
const request = require('request');
const cheerio = require('cheerio');
app.get('/api/:name',function(req,res){
    let name = req.params.name;
    console.log(name)
    let url = `https://onoffmix.com/event/main?s=${name}`
    console.log(url)
    request(url,function(err,response,body){
        let result ={
            title :[],
            people : [],
        } 
        let resultArr = [];
        const $ = cheerio.load(body);
        let titleArr = $("#content > div > section.event_main_area > ul > li:nth-child(3) > article > a > div.event_info_area > div.title_area > h5")
        let peopleArr = $("#content > div > section.event_main_area > ul > li:nth-child(3) > article > a > div.event_state_area > span > strong")
        result.title.push(titleArr[0].attribs.title)
        result.people.push(Number(peopleArr[0].children[0].data))
        res.json(result)
    })
})

app.listen(3000,function(){
    console.log('ad')
})