import express, { Request, Response, NextFunction } from "express";
import {errHandler, middlewareLogResponses, middlewareMetricsInc} from "./api/middleware.js"
import {metricHandler, metricReset} from './api/metrics.js'
import {handleChirpCreation, handlerChirpsGet, handlerChirpsGetAll, validate_chirp, handlerChirpDelete} from './api/chirps.js'
// import {getRefreshToken, getUserFromRefreshToken, revokeToken} from './db/queries/tokens.js'
// import {createUser, findUser} from './db/queries/users.js'
// import {createChirp, getAllChirps, getChirp} from './db/queries/chirps.js'
// import {hashPassword, checkPasswordHash, makeJWT, getBearerToken, validateJWT, makeRefreshToken} from './auth.js'
import { config } from "./config.js";
import { handleReadiness } from './api/healthz.js'
import { handleLogin, handleRefresh, handleRevoke } from "./api/auth.js";
import { handleUsers, handleUserUpdate } from "./api/users.js";
import { handleWebhook } from './api/webhooks.js'

const app = express();
// const PORT = 8080

app.use(middlewareLogResponses)
app.use(express.json())

app.use('/app', middlewareMetricsInc, express.static('./src/app'));

app.get("/api/healthz", (req, res, next) => {
    Promise.resolve(handleReadiness(req, res)).catch(next)
})
app.get('/admin/metrics', (req, res, next) => {
    Promise.resolve(metricHandler(req, res)).catch(next)
})
app.post('/admin/reset', (req, res, next) => {
    Promise.resolve(metricReset(req, res)).catch(next)
})

app.post('/api/login', (req, res, next) => {
    Promise.resolve(handleLogin(req, res)).catch(next)
})
app.post('/api/refresh', (req, res, next) => {
    Promise.resolve(handleRefresh(req, res)).catch(next)
})
app.post('/api/revoke', (req, res, next) => {
    Promise.resolve(handleRevoke(req, res)).catch(next)
})

app.get('/api/chirps', (req, res, next) => {
    Promise.resolve(handlerChirpsGetAll(req, res)).catch(next)
})
app.get('/api/chirps/:chirpID', (req, res, next) => {
    Promise.resolve(handlerChirpsGet(req, res)).catch(next)
})
// app.get('/api/chirps?authorId=:authorId', (req, res, next) => {
//     Promise.resolve(handleAllChirpsByAuthor(req, res)).catch(next)
// })
// app.post('/api/validate_chirp', validate_chirp)
app.post("/api/chirps", (req, res, next) => {
    Promise.resolve(handleChirpCreation(req, res)).catch(next)
})
app.delete('/api/chirps/:chirpID', (req, res, next) => {
    Promise.resolve(handlerChirpDelete(req, res)).catch(next)
})

app.post('/api/users', (req, res, next) => {
    Promise.resolve(handleUsers(req, res)).catch(next)
})
app.put('/api/users', (req, res, next) => {
    Promise.resolve(handleUserUpdate(req, res)).catch(next)
})

app.post('/api/polka/webhooks', (req, res, next) => {
    Promise.resolve(handleWebhook(req, res)).catch(next)
})

app.use(errHandler)

// app.post('/api/validate_chirp', (req, res) => {
//     validate_chirp(req, res).catch(error => {
//         res.status(500).json({
//             "error": "Server error"
//         });
//     });
// })

app.listen(config.port, ()=> {
    console.log(`Server is listening on port ${config.port}`)
})