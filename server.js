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

const CIMP = {
    enc: function (value, key) {
        return cryptoJS.AES.encrypt(value, key).toString();
    },
    dec: function (value, key) {
        return cryptoJS.AES.decrypt(value, key).toString(cryptoJS.enc.Utf8);
    }
}

app.post('/account/signin', async function(req, res){
    const user = await User.findOne({
        username: req.body.username_si
    });

    if (user) {
        const pwC = await bcrypt.compare(req.body.password_si, user.password);
        if (!pwC) {
            res.status(405).type('application/json').send({eCode: '405xWP'});
            return;
        }

        
        let userObj = {
            username: user.username,
            pkiy: CIMP.dec(user.pkiy, req.body.password_si)
        }

        const accessToken = jwt.sign(userObj, process.env.jwt_normal_key);

        const sessionToken = crypto.randomUUID();
        let date = new Date();
        const sessionObj = {
            time: date,
            token: sessionToken,
            UAG: req.headers['user-agent'],
            lastActivity: date,
            expires: date.setDate(date.getDate() + 7),
            origin: req.headers['origin']
        }
        user.sessions.push(CIMP.enc(JSON.stringify(sessionObj), userObj.pkiy));
        await user.save();

        userObj = {
            username: user.username,
            sessions: user.sessions
        }
        
        res.status(200).type('application/json').send({eCode: '200xSSI', jwt: accessToken, user: userObj, session: sessionToken});
    }
    else{
        res.status(404).type('application/json').send({eCode: '404xUNF'});
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
        user.pkiy = CIMP.enc(pkiy, req.body.password_su);

        let houseObj = {
            name: 'Default house',
            description: 'The default house. Automatically created.',
            rooms: {
                name: 'Default room',
                description: 'The default room. Automatically created.',
                shelfs: {
                    name: 'Default shelf',
                    description: 'The default shelf. Automatically created.'
                }
            }
        }
        user.houses.push(CIMP.enc(JSON.stringify(houseObj), pkiy));
        await user.save();

        res.status(200).type('application/json').send({eCode: '200xSSU'});
    } else {
        res.status(405).type('application/json').send({eCode: '405xUAU'});
    }
});
app.post('/account/load', accountOnly, async function(req, res) {
    const user = req.user;

    let uObj = {
        username: user.username,
    }
    res.status(200).type('application/json').send({eCode: '200xSAL', user: uObj});
});
app.post('/account/delete', accountOnly, async function(req, res){
    let user = req.user;
    if (user.username != req.body.da_username) {
        res.status(405).type('application/json').send({eCode: '405xWU'});
        return;
    }
    const pwC = await bcrypt.compare(req.body.da_password, user.password);

    if(!pwC){
        res.status(405).type('application/json').send({eCode: '405xWP'});
        return;
    }
    await User.deleteOne({ username: user.username });
    res.status(200).type('application/json').send({eCode: '200xSAD'});
});
app.post('/account/changepassword', accountOnly, async function(req, res){
    let user = req.user;
    const pwC = await bcrypt.compare(req.body.cpc_password, user.password);

    if(!pwC){
        res.status(405).type('application/json').send({eCode: '405xWP'});
        return;
    }

    user.pkiy = CIMP.enc(CIMP.dec(user.pkiy, req.body.cpc_password), req.body.cpn_password);

    const hash = await bcrypt.hash(req.body.cpn_password, 10);
    user.password = hash;

    await user.save();
    res.status(405).type('application/json').send({eCode: '200xSPC'});
});
app.post('/account/changeusername', accountOnly, async function(req, res){
    let user = req.user;
    const pwC = await bcrypt.compare(req.body.cu_password, user.password);

    if(!pwC){
        res.status(405).type('application/json').send({eCode: '405xWP'});
        return;
    }

    const existAlready = await User.findOne({ username: req.body.cu_username });
    if (existAlready) {
        res.status(405).type('application/json').send({eCode: '405xUAU'});
        return;
    }

    user.username = req.body.cu_username;

    await user.save();
    res.status(200).type('application/json').send({eCode: '200xSUC'});
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
    let accessToken = req.body.jwt;
    let sessionToken = req.body.session;
    if (!accessToken || !sessionToken) {
        res.status(403).type('application/json').send({eCode: '403xBA'});
        return;
    }

    jwt.verify(accessToken, process.env.jwt_normal_key, async function (error, data) {
        if (error) {
            res.status(403).type('application/json').send({eCode: '403xIAT'});
            return;
        }

        const user = await User.findOne({username: data.username});

        if (!user) {
            res.status(404).type('application/json').send({eCode: '404xUNF'});
            return;
        }

        let i = 0;
        let decrypted = JSON.parse(CIMP.dec(user.sessions[i], data.pkiy));
        while (i < user.sessions.length && decrypted.token != sessionToken) {
            i++;
            if (i < user.sessions.length) {
                decrypted = JSON.parse(CIMP.dec(user.sessions[i], data.pkiy));
            }
        }
        
        const now = new Date();
        if (i == user.sessions.length || now > decrypted.expires) {
            res.status(403).type('application/json').send({eCode: '403xIST'});
            return;
        }

        req.user = user;
        req.jwt = data;
        
        next();
    });
}

async function cors(req, res, next) {
    res.set(
        {
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