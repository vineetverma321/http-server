import { Request, Response } from "express"
import { UserNotAuthenticatedError, UserForbiddenError, NotFoundError, BadRequestError } from './errors.js'
import { findUser } from '../db/queries/users.js'
import { checkPasswordHash, makeJWT, makeRefreshToken, getBearerToken} from '../auth.js'
import { revokeToken } from "../db/queries/tokens.js"
import { config} from '../config.js'
import { getUserFromRefreshToken } from "../db/queries/tokens.js"

export async function handleLogin (req: Request, res: Response) {
const user = await findUser(req.body.email)
    if (!user) {
        throw new UserNotAuthenticatedError("Incorrect email or password")
    }
    const succ_login = await checkPasswordHash(req.body.password, user.password)
    if (!succ_login) {
        throw new UserNotAuthenticatedError("Incorrect email or password")
    }

    // let expiry: number = req.body.expiresInSeconds
    // if (!expiry || expiry > 3600) {
    //     expiry = 3600
    // }

    const {password, ...clean_user} = user
    const token_received = makeJWT(user.id, 3600, config.secret);
    const refresh_obj = makeRefreshToken(user.id);
    console.log("logged in", clean_user)
    // (clean_user as any).token = token_rec

    res.status(200).json({id: clean_user.id,
        createdAt: clean_user.createdAt,
        updatedAt: clean_user.updatedAt,
        email: clean_user.email,
        isChirpyRed: clean_user.isChirpyRed, token: token_received, refreshToken: refresh_obj})
}

export async function handleRevoke (req: Request, res: Response) {
    const refresh_token = getBearerToken(req)
    const revoked = await revokeToken(refresh_token)
    res.status(204).json({message: "token revoked"})
}

export async function handleRefresh (req: Request, res: Response) {
        const refresh_token = getBearerToken(req)
        
        const userId = await getUserFromRefreshToken(refresh_token)
        if (!userId) {
            throw new UserNotAuthenticatedError("invalid refresh token")
        }
    
        const new_token = makeJWT(userId, 3600, config.secret)
    
        res.status(200).json({token: new_token})
}