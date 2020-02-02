"use strict";

const chalk = require('chalk');


function labelColorizer(options) {
    return (inp) => {
        const label = inp.slice(options.labelPrefix.length, -options.labelSuffix.length).toLowerCase();
        return typeof options.colorFuncs[label] === 'function' ? options.colorFuncs[label](inp) : inp;
    };
}
require('console-stamp')(console, {
    pattern: 'dd/mm/yyyy HH:MM:ss.l',
    colors: {
        label: labelColorizer({
            labelPrefix: "[",
            labelSuffix: "]",
            colorFuncs: {
                log: chalk.blue,
                dir: chalk.blue,
                info: chalk.green,
                warn: chalk.yellow,
                assert: chalk.magenta,
                error: chalk.red,
            }
        }),
        metadata : labelColorizer({
            labelPrefix: "[",
            labelSuffix: "]",
            colorFuncs: {
                log: chalk.blue,
                dir: chalk.blue,
                info: chalk.green,
                warn: chalk.yellow,
                assert: chalk.magenta,
                error: chalk.red,
            }
        }),
        stamp : labelColorizer({
            labelPrefix: "[",
            labelSuffix: "]",
            colorFuncs: {
                log: chalk.blue,
                dir: chalk.blue,
                info: chalk.green,
                warn: chalk.yellow,
                assert: chalk.magenta,
                error: chalk.red,
            }
        })


    },
});

var frontend = require('./frontend-app');
var backend = require('./backend-app');
var ws = require('./frontend-ws');
var EventBroker = require('./eventBroker');

var eventBroker = new EventBroker();

/* ==== Here the backend OAuthAuthenticated Service starts ===== */


backend.setup(eventBroker);

/* =============== Here the frontend Service starts ============ */

frontend.setup();

/* =============== Starting WebSocket for frontend ============ */

ws.setup(eventBroker);
