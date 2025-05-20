import {hash, compare} from 'bcrypt'
// import {verify} from 'jsonwebtoken'
// import * as jwt from 'jsonwebtoken';
import { Request, Response } from 'express';
// import pkg from 'jsonwebtoken'
// const {sign, verify} = pkg
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const jwt = require('jsonwebtoken'); 
import * as crypto from 'crypto';
import { createRefreshToken } from './db/queries/tokens.js'
import { UserNotAuthenticatedError, UserForbiddenError, NotFoundError, BadRequestError } from './api/errors.js'

type payload = {'iss': string, 'sub': string, 'iat': number, 'exp': number}
const TOKEN_ISSUER = "chirpy"

export async function hashPassword (password: string): Promise<string> {
    return await hash(password, 10)
}

export async function checkPasswordHash (password: string, hash: string) {
    return await compare(password, hash)
}

export function makeJWT(userID: string, expiresIn: number, secret: string): string {
    const now = Math.floor(Date.now() / 1000)
    
    const act_payload: payload = {
        iss: "chirpy",
        sub: userID,
        iat: now,
        exp: now + expiresIn
    }
    return jwt.sign(act_payload, secret,{ algorithm: "HS256" })
}

export function validateJWT(tokenString: string, secret: string): string {
    let deco_payload: payload
    try {
        deco_payload = jwt.verify(tokenString, secret)
    }
    catch (err) {
        throw new UserNotAuthenticatedError("token")
    }

    if (deco_payload.iss !== TOKEN_ISSUER) {
        throw new UserNotAuthenticatedError("Invalid issuer");
      }

    if (!deco_payload.sub) {
        throw new UserNotAuthenticatedError("no user ID in token")
    }
    return deco_payload.sub.toString()
}

export function getBearerToken(req: Request): string {
    const token = req.header('Authorization')?.replace("Bearer ","")
    if (!token) {
        throw new UserNotAuthenticatedError("No token provided")
    }
    return token
}

export function makeRefreshToken (userId: string): string {
    const createdAt = new Date()
    const expiresAt = new Date(createdAt.getTime() + 60 * 24 * 60 * 60 * 1000)
    const refresh_obj = {
        token: crypto.randomBytes(32).toString('hex'),
        userId: userId,
        expiresAt: expiresAt
    }
    createRefreshToken(refresh_obj)
    return refresh_obj.token
} 

export function getAPIKey(req: Request) {
    const apiKey = req.header('Authorization')?.replace("ApiKey ","")
    if (!apiKey) {
        throw new UserNotAuthenticatedError("No apiKey provided")
    }
    return apiKey
}