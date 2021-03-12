const fs = require("fs");
const express = require("express");
const { json } = require("express");
const app = express();

app.use(express.json());

//define all of the helper functions

function read(path) {
    return fs.readFileSync(path).toString();
}
function write(path, data) {
    fs.writeFileSync(path, data);
}


//This is the main page
app.get("/", function(req, res) {
    res.end(read('public/html/index.html'));
})
//This is the media page
app.get("/media/", function(req, res) {
    res.end(read("public/html/media.html"));
})
//This is the score page
app.get("/score/", function(req, res) {
    res.end(read("public/html/score.html"));
})
//This is the competitions page
app.get("/competitions/", function(req, res) {
    res.end(read("public/html/competitions.html"));
})
//This is the statistics page
app.get("/stats/", function(req, res) {
    res.end(read("public/html/stats.html"));
})
//This is the register page
app.get("/register", function(req, res) {
    res.end(read("public/html/register.html"));
})
//This is the login page
app.get("/login", function(req, res) {
    res.end(read("public/html/login.html"));
})
//This is the increase score page
app.get("/apply", function(req, res) {
    res.end(read("public/html/apply.html"))
})


//These are all of the css and javascript files

app.get("/css/media.css", function(req, res) {
    res.end(read("public/css/media.css"));
})
app.get("/css/competitions.css", function(req, res) {
    res.end(read("public/css/competitions.css"))
})
app.get("/css/score.css", function(req, res) {
    res.end(read("public/css/score.css"));
})
app.get("/css/stats.css", function(req, res) {
    res.end(read("public/css/stats.css"));
})





//These are all of the database files


app.get("/api/databases/groups", function(req, res) {
    res.end(read("databases/groups.json"));
})
app.post("/api/databases/competitions", function(req, res) {
    let competitions = JSON.parse(read("databases/competitions.json"));
    let username = req.body.username;
    let activeCompetitions = [];

    for (let i = 0; i < competitions.length; i++) {
        for (let j = 0; j < competitions[i].participants.length; j++) {
            if (username === competitions[i].participants[j].username) {
                activeCompetitions.push(competitions[i]);
            }
        }
    }
    res.end(JSON.stringify(activeCompetitions));
})

//post to the database files

app.post("/api/databases/groups/newmessage", function(req, res) {
    let groups = read("databases/groups.json");
    let message = req.body
    groups = JSON.parse(groups);

    for (let i = 0; i < groups.length; i++) {
        if (groups[i].name === message.group) {
            groups[i].messages.push({
                username: message.username,
                content: message.content
            })
        }
    }
    write("databases/groups.json", JSON.stringify(groups, null, 2));
    res.end();
})

//return the total score and statistics of the player

app.post("/api/databases/users/score", function(req, res) {
    let users = JSON.parse(read("databases/users.json"));

    for (let i = 0; i < users.length; i++) {
        if (users[i].username === req.body.username) {
            res.end(JSON.stringify({score: users[i].score}));
        }
    }
    res.end("no user")
})

app.post("/api/databases/users/increasescore", function(req, res) {
    let users = JSON.parse(read("databases/users.json"));
    let competitions = JSON.parse(read("databases/competitions.json"));
    let username = req.body.username;


    //Deal with the users
    for (let i = 0; i < users.length; i++) {
        if (users[i].username == username) {
            users[i].score ++;
        }
    }

    //Deal with the competitions
    for (let i = 0; i < competitions.length; i ++) {
        for (let j = 0; j < competitions[i].participants.length; j++) {
            if (competitions[i].participants[j].username == username) {
                competitions[i].participants[j].score ++;
            }
        }
    }
    //Write the updates into the files
    write("databases/users.json", JSON.stringify(users, null, 2));
    write("databases/competitions.json", JSON.stringify(competitions, null, 2));
    res.end();
})


//Login/register

app.post("/api/databases/newacount", function(req, res) {
    let users = read("databases/users.json");
    users = JSON.parse(users);

    //Check to see if the acount already exist
    for (let i = 0; i < users.length; i++) {
        if (req.body.username === users[i].username) {
            res.end("Already Existing Acount");
            return;
        }
    }
    //If not create a new one
    users.push({
        username: req.body.username,
        password: req.body.password,
        score: 0
    });
    write("databases/users.json", JSON.stringify(users, null, 2));
    res.end("Successfully registered an acount");
})
//Join a competition
app.post("/api/databases/joinCompetition", function(req, res) {
    let competitions = JSON.parse(read("databases/competitions.json"));
    let message = req.body;
    console.log(message);
    for (let i = 0; i < competitions.length; i++) {
        if (competitions[i].description.name === message.competition) {
            competitions[i].participants.push({
                username: message.username,
                score: 0,
                won: false
            })
        }
    }
    write("databases/competitions.json", JSON.stringify(competitions, null, 2));
    res.end();
})


app.post("/api/databases/login", function(req, res) {
    let users = JSON.parse(read("databases/users.json"));
    //Check to see if there is and acount that fits the password and username
    for (let i = 0; i < users.length; i++) {
        if (users[i].username === req.body.username && users[i].password === req.body.password) {
            res.end("success");
            return;
        }
    }
    res.end("fail");
})


//route for all image assests



//This is where we listen on port 3000
app.listen(3000, function() {
    console.log("listening on port 3000");
});





