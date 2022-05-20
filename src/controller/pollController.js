import { ObjectId } from "mongodb";
import dayjs from "dayjs";
import db from "../db.js";

/*----------- Requisições da ENQUETE -----------*/

export async function postPoll(req, res){
    const { title, expireAt } = req.body;
    let expireDate;

    try{
        if(title === ""){
            res.sendStatus(422);
            return;
        }
        if(expireAt === ""){
            expireDate = dayjs().add(30, "day").format("YYYY-MM-DD HH:mm");
        }
    
        await db.collection("polls").insertOne({title, expireAt: expireDate});
    
        res.sendStatus(201);//Criado
    }
    catch{
        res.sendStatus(500);
    }
}

export async function getPoll(req, res){
    try{
        const polls = await db.collection("polls").find().toArray();

        res.send(polls);
    }
    catch{
        res.sendStatus(500);
    }
}

/*----------- Requisição da rota de OPÇÕES -----------*/

export async function postChoice(req, res){
    const { title, poolId } = req.body;
    const currentDay = dayjs().format("YYYY-MM-DD HH:mm");

    try{
        const poll = await db.collection("polls").findOne({
            _id: new ObjectId(poolId)
        });
        if(!poll){
            return res.sendStatus(404);
        }
        if(title === ""){
            return res.sendStatus(422);
        }
        const isTitleExists = await db.collection("choices").findOne({ title });
        if(isTitleExists){
            return res.sendStatus(409);
        }

        if(poll.expireAt < currentDay){
            return res.sendStatus(403);
        }

        await db.collection("choices").insertOne({ title, poolId });
        res.sendStatus(201);
    }
    catch{
        res.sendStatus(500);
    }
}

/*----------- Requisições das OPÇÕES da ENQUETE -----------*/

export async function getChoice(req, res){
    const { id } = req.params;

    try{
        const choices = await db.collection("choices").find({ poolId: id }).toArray();
        if(!choices){
            return res.sendStatus(404);
        }

        res.send(choices);
    }
    catch{
        res.sendStatus(500);
    }
}

/*----------- Requisição de registro de voto -----------*/

export async function registerVote(req, res){
    const { id } = req.params;
    const currentDay = dayjs().format("YYYY-MM-DD HH:mm");
    
    try{
        const choice = await db.collection("choices")
        .findOne({ _id: new ObjectId(id) });
        if(!choice){
            return res.sendStatus(404);
        }
        const poll = await db.collection("polls")
        .findOne({ _id: new ObjectId(choice.poolId) });
        if(poll.expireAt < currentDay){
            return res.sendStatus(403);
        }

        const vote = {
            createdAt: dayjs().format("YYYY-MM-DD HH:mm"),
            choiceId: new ObjectId(id)
        };

        await db.collection("votes").insertOne(vote);
        res.sendStatus(201);

    }
    catch{
        res.sendStatus(500);
    }
}

/*----------- Requisição de resultados -----------*/

export async function getPollResult(req, res){
    const { id } = req.params;
    let arrayVotes, higherVotes, positionChosen;
    let higher = Number.NEGATIVE_INFINITY;

    try{
        const poll = await db.collection("polls")
        .findOne({ _id: new ObjectId(id) });
        if(!poll){
            return res.sendStatus(404);
        }
        const choices = await db.collection("choices")
        .find({ poolId: id }).toArray();
        for(let i = 0; i < choices.length; i++){
            arrayVotes = await db.collection("votes").find({ choiceId: new ObjectId(choices[i]._id) }).toArray();
            if(arrayVotes.length > higher){
                higher = arrayVotes.length;
                higherVotes = arrayVotes;
                positionChosen = i;
            }
        }
        
        const mostChosen = choices[positionChosen];

        const pollResult = {
            _id: poll._id,
            title: poll.title,
            expireAt: poll.expireAt,
            result: {
                title: mostChosen.title,
                votes: higher
            }
        };

        res.send(pollResult).status(200);
    }
    catch{
        res.sendStatus(500);
    }
}