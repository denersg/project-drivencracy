import dayjs from "dayjs";
import chalk from "chalk";

const styled = chalk.hex("#F76916");//LARANJA

// console.log(
//     "\n\n",
//     styled.bold( dayjs().add(30, "day").format("DD-MM-YYYY -- HH:mm:ss") ),
//     "\n\n"
// )


/* ------------------------------------------------------------------------------------------------------------------------ */


// ------------- IMPRIMINDO NO FORMATO DESEJADO (pra não precisar de 'split' ou 'join') -------------

// console.log("\n\n======== Formato desejado para inserir no campo 'expireAt' no projeto ========\n\n")

// console.log(
//     "\n\n",
//     styled.bold( dayjs().add(30, "day").format("YYYY-MM-DD HH:mm") ),
//     "\n\n"
// )



/* ------------------------------------------------------------------------------------------------------------------------ */

/* É essa validação que eu devo fazer */
const poll = {
    title: "Qual a sua linguagem favorita?",
    expireAt: "" 
}

if(poll.expireAt === ""){
    poll.expireAt = dayjs().add(30, "day").format("YYYY-MM-DD HH:mm");
}

console.log(poll.expireAt)