/**
 *
 * Project: cloud-demonstrator
 * Project Page: https://github.com/tseiman/cloud-demonstrator
 * Author: Thomas Schmidt
 * Date: 2020
 * 
 * the main App of the WebService.
 * It instanciates all modules required (frontend App, Frontend WS, Backend upstream).
 * It configures also the console log.
 *
 **/

 "use strict";

const chalk = require('chalk');
const config = require('config');

const backendConf = config.get('backend');


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
var ws = require('./frontend-ws');
var EventBroker = require('./eventBroker');

var backendUpstream = require('./backend-app-upstream');
var backendDownstream = require('./backend-app-downstream');
var eventBroker = new EventBroker();

/* ==== Here the backend OAuthAuthenticated Service starts ===== */


backendUpstream.setup(eventBroker);


backendDownstream.setup(eventBroker);

/* =============== Here the frontend Service starts ============ */

frontend.setup();

/* =============== Starting WebSocket for frontend ============ */

ws.setup(eventBroker);
