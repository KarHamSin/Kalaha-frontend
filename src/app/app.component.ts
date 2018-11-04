import {Component} from '@angular/core';
import {GameActionService} from '../service/game-action.service';
import * as Stomp from 'stompjs';
import * as SockJS from 'sockjs-client';
import {environment} from '../environments/environment.prod';
import {UserInput} from '../model/user-input';
import {Board} from '../model/board';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent {

    constructor(private gameActionService: GameActionService) {
    }

    private stompClient = null;
    board: Board = new Board();
    joined = false;
    gameStarted= false;
    mail: string;
    player: string;
    selectedIndex: number;

    /* resets current game */
    newGame() {
        const observable = this.gameActionService.newGame();
        observable.subscribe(val => console.log(val));
        this.disconnect();
        this.gameStarted=false;
    }

    joinGame() {
        this.connect();
        let userInput: UserInput = new UserInput();
        userInput.mail=this.mail;
        const observable = this.gameActionService.joinGame(userInput);
        observable.subscribe(val => this.player = JSON.parse(JSON.stringify(val)).player);
    }

    connect(){
        const socket = new SockJS(environment.baseUrl + 'websocket');
        this.stompClient = Stomp.over(socket);

        const _this = this;
        this.stompClient.connect({}, function (frame) {
            _this.setConnected(true);
            console.log('Connected: ' + frame);

            _this.stompClient.subscribe('/topic/board', function (board) {
                _this.gameStarted=true;
                _this.board=JSON.parse(board.body);
            });

        });
    }

    setConnected(connected: boolean) {
        this.joined = connected;
    }

    disconnect() {
        if (this.stompClient != null) {
            this.stompClient.disconnect();
        }

        this.setConnected(false);
        console.log('Disconnected!');
    }

    distributeStones(){
        if(this.board.turn!=this.player){
            alert("Please wait on your turn.")
            return;
        }
        let userInput: UserInput = new UserInput();
        userInput.selectedPitIndex=this.selectedIndex;
        userInput.mail=this.mail;
        this.gameActionService.distributeStones(userInput).subscribe();
        this.setGridToDefaultColor()
    }

    isSelectable(index : number){
        if(this.player=='PLAYERONE'){
            return index < 6;
        }
        if(this.player=='PLAYERTWO'){
            return index > 5;
        }
    }

    setIndexSelection(index: number) {
        if (!this.isSelectable(index)) {
            return;
        }
        this.selectedIndex = index;
        this.setGridToDefaultColor();
        let myDiv = document.getElementById(index+ '');
        myDiv.style.background = 'green';
    }

    setGridToDefaultColor(){
        let x: number;
        for(x=0; x<12; x++){
            let myDiv = document.getElementById(x + '');
            myDiv.style.background = 'lightblue';
        }
    }

}
