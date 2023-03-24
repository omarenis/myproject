import {Request, Response} from "express";

export class LoginTemplate{
    async get(request: Request, response: Response, next: Function)
    {
        response.render('login.html');
    }
}
