import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import bodyParser from 'body-parser';
import jwt from 'jsonwebtoken';
import { generateAccessToken,generateRefreshToken } from './controller/tokenController.js';
const app = express();

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.listen(5001, () => {
    console.log(`validator Listening on port 5001`);
  });

const access_token:string = "itShouldBeSecret"
let refresh_token:string = "thisAlso"


function validateToken(req: Request, res: Response, next: NextFunction) {
    // Get token from request header
    const authHeader = req.body.headers["authorization"];
    console.log(authHeader)
    if (typeof authHeader === "string") {
        const token = authHeader.split(" ")[1];
        
        if (token == null) {
            // res.sendStatus(400).
            res.json("Token not present");
        } else {
            jwt.verify(token, access_token, (err, user) => {
                if (err) {
                    // res.status(403).
                    const rToken = req.body.headers["refreshToken"].split(" ")[1]
                    console.log(rToken)
                    jwt.verify(rToken, refresh_token, (error:jwt.VerifyErrors | null,user:string | jwt.JwtPayload | undefined) => {
                        if (error){
                            res.json("Token invalid")
                        }
                        else{
                            console.log("creat new",req.body.headers["email"],rToken)
                            const accessToken = generateAccessToken({ user: req.body.headers["email"] })
                            const refreshToken = generateRefreshToken({ user: req.body.headers["email"] })
                                //generate new accessToken and refreshTokens
                            res.json({ accessToken: accessToken, refreshToken: refreshToken })
                        }
                    });
                } else {
                    // req.user = user;
                    // next(); Proceed to the next action in the calling function
                    res.json("Token valid")
                }
            }); // End of jwt.verify()
        }
    } else {
        // res.sendStatus(400)
        res.json("Authorization header is missing or in an invalid format");
    }
}

app.post("/validator",validateToken)