const { isObjectIdOrHexString } = require("mongoose");

class LiveGames {
    constructor () {
        this.games = [];
    }
    addGame(pin, hostId, quizData){
        let game = {pin, hostId, quizData,currentQuestion:0, members:[]};
        this.games.push(game);
        console.log(this.games)
        return game;
    }
    removeGame(hostId){
        let game = this.getGame(hostId);
        
        if(game){
            this.games = this.games.filter((game) => game.hostId !== hostId);
        }
        return game;
    }
    getGame(hostId,pin){

        return this.games.filter((game) => game.pin.replace(/\s/g, "") == String(pin) || game.pin == String(pin)  ||game.hostId === hostId)[0]

    }

    addPlayer(playerInfo,playerId) {
        let game = this.getGame(0,playerInfo.gamePin)
        game.members.push({playerId,nickname:playerInfo.nickname,points:0, answers:[]})

        return game
    }

    editPlayer(provisionalId,playerId){

        let foundPlayer = false
        let gamePin 
       
        this.games.forEach(game =>{

            let p = game.members.filter((member) => member.playerId == provisionalId)
            if (p && p.length === 1) {
                p[0].playerId = playerId
                foundPlayer = p[0]
                gamePin = game.pin
            }

        })

        return {foundPlayer,gamePin}
    }

    endGame(game) {

        let K = this.getGame(game.hostId)

        if (K) {

             

        }

    }

}

module.exports = {LiveGames};