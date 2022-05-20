import { Router } from "express";
import { postPoll, getPoll, postChoice, getChoice, registerVote, getPollResult } from "../controller/pollController.js";

const pollRouter = Router();

//Faz a postagem da enquete
pollRouter.post("/poll", postPoll);
pollRouter.get("/poll", getPoll);
//Faz a postagem de uma opção
pollRouter.post("/choice", postChoice);
//Pega a lista de opções de 1 enquete
pollRouter.get("/poll/:id/choice", getChoice);
pollRouter.post("/choice/:id/vote", registerVote);
pollRouter.get("/poll/:id/result", getPollResult);


export default pollRouter;