const express = require('express');
require('dotenv/config');


const app = express();
const PORT = process.env.PORT;
const url = process.env.URL;

const puppeteer = require('puppeteer');


app.get('/', async(req, res) => {
    try{
        (async () => {
            const browser = await puppeteer.launch({
                "dumpio": true,
                "headless": true,
                "executablePath": '/usr/bin/chromium',
                "args": [
                    '--disable-setuid-sandbox',
                    '--no-sandbox',
                    '--disable-gpu',
                ]
            })
            const page = await browser.newPage();

            await page.goto(url);
            

            const movies = await page.evaluate(() => {
                let data = []
                let elements = document.querySelectorAll('html.scriptsOn body#styleguide-v2.fixed div#wrapper div#root.redesign div#pagecontent.pagecontent div#content-2-wide.redesign div#main div.article.listo.nm div.list.detail div.list_item');
                for(element of elements){
                    data.push({
                        img : element.querySelector('img').src,
                        title : element.querySelector('td.overview-top a').text.trim(),
                        time : element.querySelector('p.cert-runtime-genre time')?.textContent.trim(),
                        description : element.querySelector('td.overview-top div.outline')?.textContent.trim()

                    })
                }

                return data;
            });
            
            console.log({ movies : movies});
            await browser.close();
            return res.json({movies: movies});
        })();

    }catch(err){
        console.log(err);
    }
});

app.listen(PORT, () => {
    console.log(`Server started in port ${PORT}`);
});