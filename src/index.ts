import * as express from "express"
import * as bodyParser from "body-parser"
import * as nunjucks from "nunjucks";
import {Request, Response} from "express"
import {AppDataSource} from "./data-source"
import {Routes} from "./routes"
import * as path from "path";
import * as Session from "express-session";
import * as connectRedis from "connect-redis";
import * as redis from 'redis';
import Flash from  'connect-flash';
const {configure} = require('dotenv');
configure();
AppDataSource.initialize().then(async () => {

    // create express app
    const app = express();
    app.set('trust proxy', 1);
    const RedisStore = connectRedis(Session);
    const redisClient = redis.createClient({});
    redisClient.on('error', function (err) {
        console.log('Could not establish a connection with redis. ' + err);
    });
    redisClient.on('connect', function (err) {
        let env = nunjucks.configure(path.join(__dirname, 'views'), {
            autoescape: true,
            express: app
        }).addFilter('json', JSON.stringify);
        app.use(bodyParser.json());
        app.set('engine', env);
        app.use(express.static(path.join(__dirname, 'static')));
        app.use(function (req, res, next) {
            let engine = res.app.get('engine');
            let config = req.app.get('config');
            engine.addGlobal('config', config);
            engine.addGlobal('request', req);
            next();
        });
        app.use(Session({
            store: new RedisStore({client: redisClient}),
            secret: process.env.REDIS_SECRET_KEY,
            resave: false,
            saveUninitialized: false,
            cookie: {
                secure: false, // if true only transmit cookie over https
                httpOnly: false, // if true prevent client side JS from reading the cookie
                maxAge: 1000 * 60 * 10 // session max age in miliseconds
            }
        }));
        app.use(Flash());
        // register express routes from defined application routes
        Routes.forEach(route => {
            app[route.method](route.route, (req: Request, res: Response, next: Function) => {
                const result = new (route.controller)()[route.action](req, res, next);
                if (result instanceof Promise) {
                    result.then((result) => result !== null && result !== undefined ? res.send(result) : undefined);
                } else if (result !== null && result !== undefined) {
                    res.json(result)
                }
            })
        })

        // setup express app here
        // ...

        // start express server
        app.listen(3000)


        console.log("Express server has started on port 3000. Open http://localhost:3000/users to see results")
    });
}).catch(error => console.log(error))
