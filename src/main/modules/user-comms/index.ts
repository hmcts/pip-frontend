import express, { NextFunction, Request, Response } from 'express';
import { UserCommService } from '../../service/UserCommService';

const CACHE_TTL_MS = 60_000;

const userCommService = new UserCommService();
let cache: { expires: number; messages: Promise<{ message: string }[]> } | undefined;

export class UserComms {
    public enableFor(app: express.Express): void {
        app.use(async (req: Request, res: Response, next: NextFunction) => {
            if (req.method !== 'GET') {
                return next();
            }

            try {
                if (!cache || cache.expires < Date.now()) {
                    cache = {
                        expires: Date.now() + CACHE_TTL_MS,
                        messages: userCommService.getUserComms().then(comms => comms.allUsersType),
                    };
                }
                res.locals.allUsersComms = await cache.messages;
            } catch {
                cache = undefined;
                res.locals.allUsersComms = [];
            }
            next();
        });
    }
}
