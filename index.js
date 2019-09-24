const axios = require('axios')
const cheerio = require('cheerio')
const express = require('express')
const app = express();
const cors = require('cors')
app.use(cors());

app.get('/news',(req,res)=>{
    getNews(req.query.keyword).then(news=>{
        res.json(news)
    })
})

async function getNews(keyword){
    let queryKeyword = keyword.replace(/ /g,"+")
    let res = await axios.get('https://ec.ltn.com.tw/search?keyword='+queryKeyword)
    const $ = cheerio.load(res.data);
    let news = [];
    $('ul.list').find('li').slice(0, 5).each((i,e)=>{
        news.push({
            date:$(e).find('span').text(),
            title:$(e).find('p').text(),
            context:$(e).find('small').text(),
            link:$(e).find('a').attr('href')
        })
    })
    return news
}

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Example app listening on port ${port}`));