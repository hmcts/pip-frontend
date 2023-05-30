import { infoRequestHandler } from '@hmcts/info-provider';
import express from 'express';

export function getInfo(): express.RequestHandler {
    return infoRequestHandler({
        extraBuildInfo: {
            name: 'court-and-tribunal-hearings-service',
            uptime: process.uptime(),
        },
        info: {},
    });
}
