const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const connection = require("./database/database");
const Pergunta = require("./database/Pergunta");
const Resposta = require("./database/Resposta");

connection.authenticate()
    .then(()=>{
        console.log("authenticated"); 
    }).catch((msgErro)=>{
        console.log(msgErro);
    })
//view engeni EJS
app.set('view engine','ejs');
app.use(express.static('public'));
//BodyParser
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.get('/', (req,res)=>{
    Pergunta.findAll({raw: true, order:[
        ['id','DESC']
    ]}).then(perguntas =>{
        res.render('index',{
            perguntas:perguntas
        });
    });
});

app.get('/perguntar',(req,res)=>{
    res.render('perguntar')
});

app.post('/save',(req,res)=>{
    var title = req.body.Title;
    var description = req.body.Description;

    Pergunta.create({
        title:title,
        description:description
    }).then(() =>{
        res.redirect('/');
    });
});

app.get('/pergunta/:id',(req,res)=>{
    var id = req.params.id;
    Pergunta.findOne({
        where:{id:id}
    }).then(pergunta =>{
        if(pergunta != undefined){
            Resposta.findAll({
                where:{perguntaId: pergunta.id},
                order:[['id','DESC']]
            }).then(respostas =>{
                res.render('pergunta',{
                    pergunta:pergunta,
                    respostas: respostas
                });
            });
        }else{
            res.redirect('/');
        }
    });
});

app.post('/responder',(req,res) =>{
    var body = req.body.body;
    var perguntaId = req.body.pergunta;
    Resposta.create({
        body:body,
        perguntaId:perguntaId
    }).then(()=>{
        res.redirect('/pergunta/' + perguntaId);
    });
});

app.listen(3434,()=>{
    console.log("app ligado ");
});

