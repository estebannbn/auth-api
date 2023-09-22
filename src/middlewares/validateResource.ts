import {Request, Response, NextFunction} from 'express'
import {AnyZodObject, ZodError} from 'zod'
import logger from "../utils/logger.js";

const validateResource = (schema:AnyZodObject) =>
    (req:Request,res:Response,next:NextFunction) => {
    try {
        schema.parse({
            body: req.body,
            params: req.params,
            query: req.query
        })
        next()
    }catch (error) {
        if(error instanceof ZodError){
            logger.error('Error de validacion');
            return res.status(403).json(
                error.issues.map(issue=>({
                    message: issue.message,
                    path: issue.path
                }))
            )
        }
    }
}