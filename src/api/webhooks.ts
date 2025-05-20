import { Request, Response } from 'express'
import { getAPIKey } from '../auth.js'
import { config } from '../config.js'
import { turnChirpyRed } from '../db/queries/users.js'
import { BadRequestError, NotFoundError } from './errors.js'

export async function handleWebhook(req: Request, res: Response) {
    const apiKey = getAPIKey(req)
    if (apiKey !== config.polkaKey) {
        res.status(401).send("incorrect key")
    }
    if (req.body.event !== "user.upgraded") {
        res.status(204).send("incorrect event")
    } else 
    {
        const chirpyred = await turnChirpyRed(req.body.data.userId)
        if (!chirpyred) {
            throw new NotFoundError("User can't be found")
        }
        res.status(204).json({})
    }
}