import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import bodyParser from 'body-parser';
import jwt from 'jsonwebtoken';

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
    const authHeader = req.headers["authorization"];
    
    if (typeof authHeader === "string") {
        const token = authHeader.split(" ")[1];
        console.log(token);
        
        if (token == null) {
            res.sendStatus(400).send("Token not present");
        } else {
            jwt.verify(token, access_token, (err, user) => {
                if (err) {
                    res.status(403).send("Token invalid");
                } else {
                    // req.user = user;
                    next(); // Proceed to the next action in the calling function
                }
            }); // End of jwt.verify()
        }
    } else {
        res.sendStatus(400).send("Authorization header is missing or in an invalid format");
    }
}