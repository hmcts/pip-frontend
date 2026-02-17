import * as path from 'path';
import * as express from 'express';
import * as nunjucks from 'nunjucks';
import fs from 'fs';

export class Nunjucks {
    constructor(public developmentMode: boolean) {
        this.developmentMode = developmentMode;
    }

    enableFor(app: express.Express): void {
        app.set('view engine', 'njk');
        const govUkFrontendPath = path.join(__dirname, '..', '..', '..', '..', 'node_modules', 'govuk-frontend');
        const mojFrontendPath = path.join(
            __dirname,
            '..',
            '..',
            '..',
            '..',
            'node_modules',
            '@ministryofjustice',
            'frontend'
        );
        const env = nunjucks.configure(
            [path.join(__dirname, '..', '..', 'views'), govUkFrontendPath, mojFrontendPath],
            {
                autoescape: true,
                watch: this.developmentMode,
                express: app,
            }
        );

        env.addGlobal('govukRebrand', true);
        env.addGlobal('dynatraceLink', process.env.DYNATRACE_LINK ?? "https://js-cdn.dynatrace.com/jstag/17177a07246/bf24054dsx/7dc5f39eaeee9840_complete.js")

        /* eslint-disable-next-line @typescript-eslint/no-require-imports */
        const njkFilters = require('./njkFilters');
        njkFilters.createFilters(env);
        const gitBranchName = () => {
            try {
                const headFilePath = path.join(__dirname, '../../../../', '.git', 'HEAD');
                const headContents = fs.readFileSync(headFilePath, { encoding: 'utf8' });
                const refPath = headContents.trim().replace('ref: ', '');
                return path.basename(refPath);
            } catch {
                return '';
            }
        };

        app.use((req, res, next) => {
            res.locals.pagePath = req.path;
            res.locals.lng = req['lng'];
            res.locals.branchName = gitBranchName();
            res.locals.env = process.env.NODE_ENV;
            next();
        });
    }
}
