import fetch from "node-fetch"
import express, { query } from 'express'
import fs from 'fs'

let file = 'log.txt'
fs.writeFileSync(file, '')

function funcD() {
    let d = new Date()
    return d.getHours() + ":" + d.getMinutes() + ": "
}

const app = express()

app.set('view engine', 'pug')
app.set('views', './views')
app.get('/', (req, res) => {
    res.redirect("/see_country_universities");
})

app.get('/see_country_universities', (req, res) => {
    console.log(funcD() + 'Getting country name to search universities...\n')
    fs.appendFileSync(file, funcD() + 'Getting country name to search universities...\n')

    res.render("search_uni_form");
})

app.get('/search_university', (req, res) => {
    console.log(funcD() + 'Getting university name to search web page address...\n')
    fs.appendFileSync(file, funcD() + 'Getting university name to search web page address...\n')

    res.render("search_web_form");
})

app.get('/search_uni', (req, res) => {
    let url = "http://universities.hipolabs.com/search?country="
    url += req.query.name

    console.log(funcD() + 'Getting all universities in ' + req.query.name + '\n')
    fs.appendFileSync(file, funcD() + 'Getting all universities in ' + req.query.name + '\n')


    let settings = { method: "Get" };
    if (!url.includes('favicon.ico')) {
        fetch(url, settings)
            .then(res => res.json())
            .then((json) => {
                for (let i = 0; i < json.length; i++) {
                    delete json[i].domains
                    delete json[i].alpha_two_code
                    delete json[i].web_pages
                    delete json[i].country
                }

                console.log(funcD() + 'Total Universities: ' + json.length + '\n')
                fs.appendFileSync(file, funcD() + 'Total Universities: ' + json.length + '\n')

                let data = JSON.stringify(json)
                console.log(funcD() + 'Universities in ' + req.query.name + ": " + data + '\n')
                fs.appendFileSync(file, funcD() + 'Universities in ' + req.query.name + ": " + data + '\n')
            
                if (json.length > 0)
                    res.render('uni_list', { country: req.query.name.toUpperCase(), total: json.length, universities: json })
                else
                    res.render('error')
            });
    }
})

app.get('/search_web', (req, res) => {
    let url = "http://universities.hipolabs.com/search?name="
    url += req.query.uname

    console.log(funcD() + 'Getting web address of ' + req.query.uname + '\n')
    fs.appendFileSync(file, funcD() + 'Getting web address of ' + req.query.uname + '\n')

    let settings = { method: "Get" };
    if (!url.includes('favicon.ico')) {
        fetch(url, settings)
            .then(res => res.json())
            .then((json) => {
                console.log(funcD() + 'Web address of ' + req.query.uname + ": " + json[0].web_pages + '\n')
                fs.appendFileSync(file, funcD() + 'Web address of ' + req.query.uname + ": " + json[0].web_pages + '\n')

                if (json.length > 0)
                    res.render('web_list', { univ: req.query.name, universities: json })
                else
                    res.render('error')

            });
    }
})

app.listen('8888', () => {
    console.log(funcD() + 'Listening to Port 8888...\n')
    fs.appendFileSync(file, funcD() + 'Listening to Port 8888...\n')
})

