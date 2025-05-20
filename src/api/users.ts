import { Request, Response } from 'express'
import { getBearerToken, hashPassword, validateJWT, getAPIKey } from '../auth.js'
import { createUser, updateUser, turnChirpyRed } from '../db/queries/users.js'
import { config } from '../config.js'
import { BadRequestError, NotFoundError } from './errors.js'

export async function handleUsers(req: Request, res: Response) {
    if (!req.body || !req.body.email || !req.body.password) {
            throw new BadRequestError("incorrect parameters")
        }
        const hashed_pwd = await hashPassword(req.body.password)
        const created_user = await createUser({email:req.body.email, password: hashed_pwd})
        if (!created_user) {
            res.status(500).json({error:"user not created"})
            return
        }
    
        res.status(201).json(created_user)
}

export async function handleUserUpdate(req: Request, res: Response) {
    const access_token = getBearerToken(req)
    if (!access_token) {
        res.status(401)
    }
    console.log("got token: ", req)
    const userID = validateJWT(access_token, config.secret)
    if (!userID) {
        res.status(401)
    }
    console.log("got userID: ", userID)
    // const {pwd, mail} = req.body
    // console.log(pwd, mail)
    const hashed_pwd = await hashPassword(req.body.password)
    console.log("got hashed pwd: ", hashed_pwd)
    const updated_user = await updateUser(userID, hashed_pwd, req.body.email)
    console.log("got user updated: ", updated_user)
    res.status(200).json(updated_user)
}