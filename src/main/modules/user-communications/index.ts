import express, { NextFunction, Request, Response } from 'express';
import { UserCommunicationService } from '../../service/UserCommunicationService';

const CACHE_TTL_MS = 60_000;

const userCommunicationService = new UserCommunicationService();
let cache: { expires: number; messages: Promise<{ message: string; welshMessage: string; }[]> } | undefined;

export class UserCommunications {
    public enableFor(app: express.Express): void {
        app.use(async (req: Request, res: Response, next: NextFunction) => {
            if (req.method !== 'GET') {
                return next();
            }

            try {
                if (!cache || cache.expires < Date.now()) {
                    cache = {
                        expires: Date.now() + CACHE_TTL_MS,
                        messages: userCommunicationService.groupCommunicationMessages()
                            .then(comms => comms.allUsersType),
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
