const express = require("express");
const { nanoid } = require("nanoid");
const fs = require("fs");
const path = require("path");

const app = express();
app.use(express.json());

const DATA_FILES = path.join(__dirname, "urls.json");

function loadUrls() {
    try{
        const data = fs.readFileSync(DATA_FILES, "utf8");
        return JSON.parse(data)
    }catch (err){
        return [];
    }
}

function saveUrls(urls) {
    fs.writeFileSync(DATA_FILES, JSON.stringify(urls, null, 2));
}

app.get("/", (req, res) => {
    res.send("hi to start go to /shorten and give a body {longUrl: 'any link'} then go json file if don't understand just go shorten.http, Omar Belfeki")
})

app.post("/shorten", (req, res) => {
    const {longUrl} = req.body;

    if(!longUrl){
        return res.status(400).json({error: "URL is required"});
    }

    let urls = loadUrls();

    const existing = urls.find(u => u.longUrl === longUrl)
    if(existing) return res.json({shortUrl: `http://localhost:5000/${existing.shortId}`})

    const shortId = nanoid(7);
    urls.push({shortId, longUrl});
    saveUrls(urls);
    res.json({shortUrl: `http://localhost:5000/${existing.shortId}`})
});

app.get("/:shortId", (req, res) => {
    const { shortId } = req.params
    const urls = loadUrls();

    const urlData = urls.find(u => u.shortId === shortId);
    if(urlData){
        return res.redirect(urlData.longUrl);
    }else{
        return res.status(404).json({error: "URL not found"})
    }
})

const PORT = 5000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
