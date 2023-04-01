import { Request, Response } from 'express';
import { IRestController, ITemplateController } from './Structure';
import { ObjectType } from './data-source';
import {IndexController} from "./controller/IndexController";
import {LoginTemplate} from "./controller/LoginTemplate";

interface IRoute
{
    route: string;
    method: string;
    controller: any;
    action: string;
}

export const Routes = [
    {
        controller: IndexController,
        action: 'get',
        method: 'get',
        route: '/'
    },
    {
        controller: LoginTemplate,
        action: 'get',
        method: 'get',
        route: '/login'
    },
    {
        controller: LoginTemplate,
        action: 'post',
        method: 'post',
        route: '/login'
    }
];
