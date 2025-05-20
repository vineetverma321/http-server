import { Request, Response, NextFunction } from 'express'
import {config} from '../config.js'
import {BadRequestError, UserNotAuthenticatedError, UserForbiddenError, NotFoundError} from "./errors.js"

export function middlewareLogResponses (req: Request, res: Response, next: NextFunction) {
    (res as any).on('finish', ()=> {
        const resCode: any = res.statusCode
        if (resCode >= 300) {
            console.log(`[NON-OK] ${req.method} ${req.url} - Status: ${resCode}`)
        }
    })
    next()
}

export function middlewareMetricsInc (req: Request, res: Response, next: NextFunction) {
    config.fileserverHits += 1
    next()
}

export function errHandler (err: Error, _: Request, res:Response, __: NextFunction) {
  if (err instanceof BadRequestError) {
    res.status(400).json({"error":err.message})
  } else
  if (err instanceof UserNotAuthenticatedError) {
    res.status(401).json({"error":err.message})
  } else
  if (err instanceof UserForbiddenError) {
    res.status(403).json({"error":err.message})
  } else
  if (err instanceof NotFoundError) {
    res.status(404).json({"error":err.message})
  }
  
  if (res.statusCode >= 500) {
    res.status(500).json({"error": err.message})
  }
}
