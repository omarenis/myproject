import {Request, Response} from 'express';
export class IndexController
{
    async get(request: Request, response: Response)
    {
        return response.render('public/interfaces/index.html');
    }
}
