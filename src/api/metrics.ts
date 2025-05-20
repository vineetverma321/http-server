import type {Request, Response, NextFunction} from 'express'
import {config} from '../config.js'
import {resetTable} from '../db/queries/reset.js'

export async function metricHandler (req: Request, res: Response) {
    res.set({
        "Content-Type":"text/html; charset=utf-8"
})
    res.send(`
        <html>
        <body>
            <h1>Welcome, Chirpy Admin</h1>
            <p>Chirpy has been visited ${config.fileserverHits} times!</p>
        </body>
        <html>`)
}

export async function metricReset (req: Request, res: Response) {
    if (config.platform !== "dev") {
        res.status(403).json({"error": "wrong environment"})
        return
    }

    await resetTable()
    config.fileserverHits = 0
    res.send(`Hits: ${config.fileserverHits}`)
}