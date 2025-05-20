import express, { Request, Response, NextFunction } from "express";

export async function handleReadiness(_: Request, res: Response) {
    res.set({
        "Content-Type":"text/plain; charset=utf-8"
    })
    res.status(200).send("OK")
}