//init dotenv
require('dotenv').config()

//init app
const express = require('express');
const app = express();

//database
const mongoose = require('mongoose');
mongoose.connect(`mongodb+srv://${process.env.dbUsername}:${process.env.dbPassword}@shelfiecluster.cow3v5m.mongodb.net/?retryWrites=true&w=majority`).then(function () {
    app.listen(process.env.PORT);
});

//bodyparser
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: true}));

//cookieparser
const cookieParser = require('cookie-parser');
app.use(cookieParser());

//auth
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const User = require('./models/user');

app.use(express.static(__dirname + '/public'));

app.post('/signin', async function(req, res){
    const user = await User.findOne({
        username: req.body.username_si
    });

    if (user) {
        const pwC = await bcrypt.compare(req.body.password_si, user.password);
        if (!pwC) {
            res.status(404).send('WRONG PASSWORD');
            return;
        }

        const token = crypto.randomUUID();
        // console.log(req.headers.cookie);
        const tokenObj = {
            date: Date(),
            userAgent: req.headers['user-agent'],
            token: token
        }
        user.tokens.push(tokenObj);

        await user.save();

        res.cookie("session", token).redirect('/portal');
    }
    else{
        res.status(404).send('USER NOT FOUND');
        return;
    }
});

app.post('/signup', async function(req, res){
    if (req.body.username_su && req.body.password_su) {
        const user = new User();
        const existAlready = await User.findOne({ username: req.body.username_su });
        if (!existAlready) {
            user.username = req.body.username_su;

            const hash = await bcrypt.hash(req.body.password_su, 10);
            user.password = hash;

            user.houses.push({ name: 'Default house', description: 'The default house. Automatically created.', rooms: { name: 'Default room', description: 'The default room. Automatically created.', shelfs: { name: 'Default shelf', description: 'The default shelf. Automatically created.' } } });
            await user.save();
            res.redirect('/account');
        } else {
            res.status(404).send('USERNAME IS ALREADY USED');
        }
    } else {
        res.status(404).send('USERNAME AND/OR PASSWORD IS EMPTY');
    }
});

app.get('/load', accountOnly, async function(req, res){
    const user = await req.user;
    res.type('application/json').send(JSON.stringify(user));
});

app.post('/new-house', accountOnly, async function(req, res){
    const user = req.user;

    user.houses.push({
        name: req.body.nh_name,
        description: req.body.nh_description
    });
    await user.save();
    res.redirect('/portal');
});

app.post('/new-room', accountOnly, async function(req, res){
    const user = req.user;
    
    let i = 0;
    while (i < user.houses.length && user.houses[i].name != req.body.nr_house) {
        i++;
    }

    if (i == user.houses.length) {
        res.status(404).send('ERROR');
        return;
    }

    user.houses[i].rooms.push({
        name: req.body.nr_name,
        description: req.body.nr_description
    });
    
    await user.save();
    res.redirect('/portal');
});

app.post('/new-shelf', accountOnly, async function(req, res){
    const user = req.user;

    let i = 0;
    while (i < user.houses.length && user.houses[i].name != req.body.ns_house) {
        i++;
    }
    if (i == user.houses.length) {
        res.status(404).send('ERROR');
        return;
    }

    let j = 0;
    while (j < user.houses[i].rooms.length && user.houses[i].rooms[j].name != req.body.ns_room) {
        j++;
    }
    if (j == user.houses[i].rooms.length) {
        res.status(404).send('ERROR');
        return;
    }

    user.houses[i].rooms[j].shelfs.push({
        name: req.body.ns_name,
        description: req.body.ns_description
    });

    await user.save();
    res.redirect('/portal');
});

app.post('/new-book', accountOnly, async function(req, res){
    const user = req.user;

    // let i = 0;
    // while (i < user.houses.length && user.houses[i].name != req.body.ns_house) {
    //     i++;
    // }
    // if (i == user.houses.length) {
    //     res.status(404).send('ERROR');
    //     return;
    // }
    // let house = user.houses[i];

    // let j = 0;
    // while (j < house.rooms.length && house.rooms[j].name != req.body.ns_room) {
    //     j++;
    // }
    // if (j == house.rooms.length) {
    //     res.status(404).send('ERROR');
    //     return;
    // }
    // let room = house.rooms[j];

    // let k = 0;
    // while (k < rooms.shelfs.length && rooms.shelfs[k].name != req.body.ns_shelf) {
    //     k++;
    // }
    // if (k == user.houses[i].rooms.length) {
    //     res.status(404).send('ERROR');
    //     return;
    // }
    // let shelf = room.shelfs[k];

    // console.log(req.body.nb_pinned);
    if (req.body.nb_pinned) {
        pinned = true;
    } else {
        pinned = false;
    }

    user.books.push({
        writer: req.body.nb_writer,
        title: req.body.nb_title,
        description: req.body.nb_description,
        type: req.body.nb_type,
        publisher: req.body.nb_publisher,
        yearOfPublication: req.body.nb_yearOfPublication,
        notes: req.body.nb_notes,
        house: req.body.nb_house,
        room: req.body.nb_room,
        shelf: req.body.nb_shelf,
        pinned: pinned
    });

    await user.save();
    res.redirect('/portal');
});

app.post('/delete-book', accountOnly, async function(req, res){
    // console.log(req.body.objectID);
    const user = req.user;

    // let book = await User.findById(req.body.objectID);

    let i = 0;
    while (i < user.books.length && user.books[i]._id != req.body.objectID) {
        i++;
    }

    // console.log(user.books[i]);

    user.books.splice(i, 1);
    
    await user.save();
    res.redirect('/portal');
    // res.redirect('/');
});

app.post('/edit-book', accountOnly, async function(req, res){
    const user = req.user;

    // console.log('req.body.objectID: ', req.body.eb_objectID);

    let pinned = "";
    if (req.body.eb_pinned) {
        pinned = true;
    } else {
        pinned = false;
    }
    
    let i = 0;
    while (i <= user.books.length-1 && user.books[i]._id != req.body.eb_objectID) {
        i++;
    }
    if (i == user.books.length) {
        res.send('ERROR');
        return;
    }
    // console.log('ID found: ', user.books[i]._id);

    user.books[i] = {
        writer: req.body.eb_writer,
        title: req.body.eb_title,
        description: req.body.eb_description,
        type: req.body.eb_type,
        publisher: req.body.eb_publisher,
        yearOfPublication: req.body.eb_yearOfPublication,
        notes: req.body.eb_notes,
        house: req.body.eb_house,
        room: req.body.eb_room,
        shelf: req.body.eb_shelf,
        pinned: pinned
    };

    await user.save();

    res.redirect('/portal');
});

app.get('/valid-account', accountOnly, function(req, res){
    let user = req.user;
    let obj = {
        valid: true,//im not sure its required
        user: user
    }
    res.type('application/json').send(JSON.stringify(obj));
});

app.get('/delete-account', accountOnly, async function(req, res){
    let user = req.user;
    await User.deleteOne({ username: user.username });
    res.status(200).redirect('/');
});

app.post('/delete-token', accountOnly, async function(req, res){
    let user = req.user;

    let i = 0;
    while (i < user.tokens.length && user.tokens[i]._id != req.body.objectID) {
        i++;
    }
    if (i == user.tokens.length) {
        res.status(404).send('ERROR');
        return;
    }


    user.tokens.splice(i, 1);
    await user.save();

    res.status(200).redirect('/account');
});

app.post('/clear-tokens', async function(req, res){
    if (process.env.tokenAuth) {
        if (process.env.tokenAuth == req.headers.tokenauth) {
            let collection = await User.find();
            // console.log(collection);
            for (let i = 0; i < collection.length; i++) {
                let tokens = collection[i].tokens;
                for (let j = 0; j < tokens.length; j++) {
                    const element = tokens[j];

                    let now = Date.now();
                    let then = element.date.getTime();

                    if ((now - then) * 1000 * 60 * 60 * 24 > 7) {
                        await User.findByIdAndDelete(element._id);
                    }
                }
            }
            res.status(200).send();
        }
        else {
            // console.log('req.headers.tokenAuth: ', req.headers.tokenAuth);
            console.log('THERE WAS AN ERROR WHILE TRING TO CLEAR TOKENS.');
            res.status(500).send();
        }
    }
    else {
        res.send("HMMM");
    }
});

async function accountOnly(req, res, next) {
    const token = req.cookies.session;
    if (!token) {
        res.status(403).redirect('/account');
        return;
    }

    let collection = await User.find();

    let i = 0;
    let noToken = true;
    while (i < collection.length && noToken) {
        let tokens = collection[i].tokens;
        let j = 0;
        while (j < tokens.length && tokens[j].token != token) {
            j++;
        }
        if (j <tokens.length) {
            noToken = false;
        }
        else {
            i++;
        }
    }

    const user = collection[i];

    if (user) {
        req.user = user;
        next();
    } else {
        res.status(403).redirect('/account');
    }
}

app.get('*', function(req, res){
    res.status(404).redirect('/404.html');
});