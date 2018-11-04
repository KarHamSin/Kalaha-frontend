import {Injectable} from '@angular/core';
import {environment} from '../environments/environment';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {UserInput} from '../model/user-input';


@Injectable({
    providedIn: 'root'
})
export class GameActionService {

    constructor(private httpClient: HttpClient) {
    }

    newGame(): Observable<JSON> {
        const url = environment.baseUrl + 'newGame';
        return this.httpClient.get<JSON>(url);
    }

    joinGame(userInput: UserInput): Observable<JSON> {
        const url = environment.baseUrl + 'joingame';
        return this.httpClient.post<JSON>(url, userInput);
    }

    startGame(): Observable<JSON> {
        const url = environment.baseUrl + 'startgame';
        return this.httpClient.get<JSON>(url);
    }

    distributeStones(userInput: UserInput): Observable<JSON> {
        console.log(userInput);
        const url = environment.baseUrl + 'distributestones';
        return this.httpClient.post<JSON>(url, userInput);
    }

}
