//init dotenv
require('dotenv').config();

//init app
const express = require('express');
const app = express();

//database
const mongoose = require('mongoose');
mongoose.set('strictQuery', true);
mongoose.connect(`mongodb+srv://${process.env.dbUsername}:${process.env.dbPassword}@shelfiecluster.cow3v5m.mongodb.net/?retryWrites=true&w=majority`).then(function () {
    app.listen(process.env.PORT);
    console.log('Magic happens on port ' + process.env.PORT);
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
const cryptoJS = require('crypto-js');
const jwt = require('jsonwebtoken');
const User = require('./models/user');

//domain
const domain = require('./public/domain.json');

app.use(express.json());
app.use(cors);


app.post('/account/signin', async function(req, res){
    const user = await User.findOne({
        username: req.body.username_si
    });

    if (user) {
        const pwC = await bcrypt.compare(req.body.password_si, user.password);
        if (!pwC) {
            res.status(405).type('application/json').send({message: 'Wrong password!'});
            return;
        }

        // await user.save();

        let userObj = {
            username: user.username,
            pkiy: cryptoJS.AES.decrypt(user.pkiy, req.body.password_si).toString(cryptoJS.enc.Utf8)
        }

        const accessToken = jwt.sign(userObj, process.env.jwt_normal_key);

        userObj = {
            username: user.username,
            session_privacy: user.session_privacy,
            sessions: user.sessions
        }

        res.status(200).type('application/json').send({message: '', jwt: accessToken, changeView: 'profile', user: userObj});
    }
    else{
        res.status(404).type('application/json').send({message: 'User not found!'});
        return;
    }
});

app.post('/account/signup', async function(req, res){
    const user = new User();
    const existAlready = await User.findOne({ username: req.body.username_su });
    if (!existAlready) {
        user.username = req.body.username_su;

        const hash = await bcrypt.hash(req.body.password_su, 10);
        user.password = hash;
        pkiy = crypto.randomBytes(64).toString('hex');
        user.pkiy = cryptoJS.AES.encrypt(pkiy, req.body.password_su).toString();

        user.session_privacy = {IP: false, UAG: true, time: true};

        user.houses.push({ name: 'Default house', description: 'The default house. Automatically created.', rooms: { name: 'Default room', description: 'The default room. Automatically created.', shelfs: { name: 'Default shelf', description: 'The default shelf. Automatically created.' } } });
        await user.save();

        res.status(200).type('application/json').send({message: '', changeView: 'sign-in'});
    } else {
        res.status(405).type('application/json').send({message: 'Username already used!'});
    }
});
app.get('/account/load', accountOnly, async function(req, res){
    const user = await User.findOne({username: req.user.username});

    let uObj = {
        username: user.username,
        session_privacy: user.session_privacy
    }
    res.status(200).type('application/json').send({user: uObj});
});
/*
app.get('/portal/load', cors, accountOnly, async function(req, res){
    const user = await req.user;
    res.type('application/json').send(JSON.stringify(user));
});
*/
/*
app.post('/portal/newhouse', accountOnly, async function(req, res){
    if (!req.body.nh_name) {
        res.send('A NAME IS ESSENTIAL');
        return;
    }

    const user = req.user;

    user.houses.push({
        name: req.body.nh_name,
        description: req.body.nh_description
    });
    await user.save();
    res.redirect('/portal');
});
*/
/*
app.post('/portal/newroom', cors, accountOnly, async function(req, res){
    if (!req.body.nr_name) {
        res.send('A NAME IS ESSENTIAL');
        return;
    }

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
*/
/*
app.post('/portal/newshelf', cors, accountOnly, async function(req, res){
    if (!req.body.ns_name) {
        res.send('A NAME IS ESSENTIAL');
        return;
    }

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
*/
/*
app.post('/portal/newbook', cors, accountOnly, async function(req, res){
    if (!req.body.nb_title) {
        res.send('A TITLE IS ESSENTIAL');
        return;
    }

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
*/
/*
app.post('/portal/deletebook', cors, accountOnly, async function(req, res){
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
*/
/*
app.post('/portal/editbook', cors, accountOnly, async function(req, res){
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
*/
/*
app.post('/account/deleteaccount', cors, accountOnly, async function(req, res){
    let user = req.user;
    if (user.username != req.body.da_username) {
        res.send('WRONG USERNAME');
        return;
    }
    const pwC = await bcrypt.compare(req.body.da_password, user.password);

    if(!pwC){
        res.send('WRONG PASSWORD');
        return;
    }
    await User.deleteOne({ username: user.username });
    res.status(200).redirect('/');
});
*/
/*
app.post('/account/changepassword', cors, accountOnly, async function(req, res){
    let user = req.user;
    const pwC = await bcrypt.compare(req.body.cp_currentPassword, user.password);

    if(!pwC){
        res.send('WRONG PASSWORD');
        return;
    }
    if (!req.body.cp_newPassword) {
        res.send('WRONG NEW PASSWORD');
        return;
    }
    const hash = await bcrypt.hash(req.body.cp_newPassword, 10);
    user.password = hash;
    user.tokens.splice(0, user.tokens.length);

    await user.save();
    res.redirect('/account');
});
*/
/*
app.post('/account/changeusername', cors, accountOnly, async function(req, res){
    let user = req.user;
    const pwC = await bcrypt.compare(req.body.cu_password, user.password);

    if(!pwC){
        res.send('WRONG PASSWORD');
        return;
    }

    const existAlready = await User.findOne({ username: req.body.cu_username });
    if (existAlready) {
        res.send('USERNAME IS ALREADY USED');
        return;
    }
    if (!req.body.cu_username) {
        res.send("USERNAME CAN'T BE EMPTY");
        return;
    }
    user.username = req.body.cu_username;
    user.tokens.splice(0, user.tokens.length);

    await user.save();
    res.redirect('/account');
});
*/
/*
app.post('/account/deletetoken', cors, accountOnly, async function(req, res){
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
*/
async function accountOnly(req, res, next) {
    let accessToken = req.headers['authorization'];
    if (!accessToken) {
        res.status(403).type('application/json').send({redirected: '?account&v=sign-in'});
        return;
    }
    accessToken = req.headers['authorization'].split(' ')[1];
    if (!accessToken) {
        res.status(403).type('application/json').send({redirected: '?account&v=sign-in'});
        return;
    }

    jwt.verify(accessToken, process.env.jwt_normal_key, async function (error, data) {
        if (error) {
            res.status(403).type('application/json').send({redirected: '?account&v=sign-in'});
            return;
        }

        const userExist = await User.findOne({username: data.username});

        if (!userExist) {
            res.status(404).type('application/json').send({redirected: '?account&v=sign-in'});
            return;
        }

        req.user = data;
        next();
    });
}

async function cors(req, res, next) {
    res.set(
        {
            // 'Access-Control-Allow-Origin': `*`,
            'Access-Control-Allow-Origin': `${domain.origin}`,
            'Access-Control-Allow-Credentials': true,
            'Access-Control-Allow-Headers': '*',
            'Allow': 'GET, POST'
        }
    );
    next();
}

app.get('*', cors, function(req, res){
    res.status(404).type('application/json').send({message: `Action ${req.url} not found.`});
});