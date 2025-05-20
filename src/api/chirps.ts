import type {Request, Response } from 'express'
import { UserNotAuthenticatedError, UserForbiddenError, NotFoundError, BadRequestError } from './errors'
import { getChirp, getAllChirps, createChirp, deleteChirp} from '../db/queries/chirps.js'
import { config } from '../config.js'
import { validateJWT, getBearerToken } from '../auth.js'
import { eq, and, SQL } from 'drizzle-orm'
import { chirps } from '../db/schema.js'


export function validate_chirp (req: Request, res: Response) {
    // try {
        if (!req.body || !req.body.body || !req.body.userId){
            throw new BadRequestError("Missing chirp elements")
        }
        if (req.body.body.length > 140 ) {
            // res.status(400).json({
            //     "error": "Chirp is too long"
            // })
            throw new BadRequestError("Chirp is too long. Max length is 140")
            // return
        }
        let temp_array: any = []
        for (let word of req.body.body.split(" ")) {
            if (word.toLowerCase() === "kerfuffle" || word.toLowerCase() === "sharbert" || word.toLowerCase() === "fornax") {
                word = "****"
            }
            temp_array.push(word)
        }
        let req_clean: any = {}
        req_clean.body = temp_array.join(" ")
        req_clean.userId = req.body.userId

        return req_clean
    // }
    // catch (error) {
    //     res.status(400).json({
    //         "error": "Something went wrong"
    //     })
    //     return
    // }
}

export async function handlerChirpsGet (req: Request, res: Response) {
    const chirpID = req.params.chirpID
    const chirp = await getChirp(chirpID)
    if (!chirp) {
        throw new NotFoundError("chirp not found")
    }
    res.status(200).json(chirp)
}

export async function handlerChirpsGetAll (req: Request, res: Response) {
    
    let authorIdQuery = req.query.authorId
    let filters: SQL[] = []
    if (authorIdQuery && typeof authorIdQuery === "string") {
        filters.push(eq(chirps.userId, authorIdQuery))
    }
    let sort_order = "asc"
    let sort_order_query = req.query.sort
    if (sort_order_query === "desc") {
        sort_order = sort_order_query
    }

    const chirps_list = await getAllChirps(filters, sort_order)

    res.status(200).json(chirps_list)
}

// export async function handleAllChirpsByAuthor (req: Request, res: Response) {
//     let authorId = ""
//     let authorIdQuery = req.query.authorId
//     if (typeof authorIdQuery === "string") {
//         authorId = authorIdQuery
//     }
//     console.log(authorId)
//     const chirps_list = await getAllChirpsByAuthor(authorId)
//     res.status(200).json(chirps_list)
// }

export async function handleChirpCreation (req: Request, res: Response) {
    const token = getBearerToken(req)
    const userID = validateJWT(token, config.secret)
    req.body.userId = userID
    const req_clean = validate_chirp(req, res);
    const created_chirp = await createChirp(req_clean)
    if (!created_chirp) {
        res.status(500).json({error:"chirp not created"})
    return
    }   
    res.status(201).json(created_chirp)
}

export async function handlerChirpDelete(req: Request, res: Response) {
    const chirp = await getChirp(req.params.chirpID)
    console.log(chirp)
    if (!chirp) {
        throw new NotFoundError("chirp not found")
    }
    const token = getBearerToken(req)
    const userID = validateJWT(token, config.secret)
    console.log(userID)
    if (userID !== chirp.userId) {
        throw new UserForbiddenError("user and chirp do not match")
    }
    const deleted = await deleteChirp(req.params.chirpID)
    if (!deleted) {
        throw new Error("Unable to delete")
    }
    res.status(204).send("successfully deleted")
}