import {Request, Response} from  'express';
import PersonInterface from "../entityInterfaces/PersonInterface";
import {login} from "../services/LoginService";
import {Person} from "../entity/Person";
export class LoginTemplate
{
    constructor() {
    }
    async get(request: Request, response: Response, next: Function): Promise<void>{
        return response.render('public/login.html');
    }

    async post(request, response: Response, next: Function): Promise<void> {
        try {
            const result: Person  = await  login(request.body.email, request.body.password);
        }catch (err) {
            request.flash('error', err.message);
        }
        response.render('public/screens/login.html');
    }
}
