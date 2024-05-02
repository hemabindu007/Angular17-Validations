import express, { Router, Request, Response } from 'express';
import userSchema from '../models/userModel'
const router: Router = express.Router();
import bcrypt from 'bcrypt'
import Data from './Data'
import moment from 'moment';

//By default route to get users data
router.get('/', async (req: Request, res: Response) => {
    try {
        const data = await userSchema.find();
        res.json(new Data(200, "All Users Records", data))
    }
    catch (error) {
        res.json(new Data(500, "Internal server error", error))
    }
})
router.get('/allUsers', async (req: Request, res: Response) => {
    try {
        const data = await userSchema.find({}).sort({ name: 1 });
        res.send(new Data(200, "Users found successfully", data))
    }
    catch (error) {
        res.json(new Data(500, "Internal server error", error))
    }
})
router.post('/addUser', async (req: Request, res: Response) => {
    try {
        console.log(req.body)
     const data = new userSchema({
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            email: req.body.email,
            mobile: req.body.mobile,
            role: req.body.role,
            date_of_joining: req.body.date_of_joining,
            date_of_birth: req.body.date_of_birth,
            password: req.body.password,
            emp_code: req.body.emp_code,
            gender: req.body.gender
        });
        data.email = data.email.toLowerCase()
        const salt = await bcrypt.genSalt(10)
        await bcrypt.hash(req.body.password, salt).then(hashedpassword => {
            if (hashedpassword) {
                data.password = hashedpassword;
            }
        })
        await userSchema.create(data)
            .then(Stored => {
                if (Stored && Stored._id) {
                    res.json(new Data(200, "User is added Successfully.", Stored))
                }
            })
            .catch(err => {
                if (err) {
                    // console.log(err);
                    res.json(new Data(400, "User is not added, Please check fields ", err))
                }
            })
    }
    catch (error) {
        // console.log(error);
        res.json(new Data(500, "Internal server error", error))
    }
})
router.get('/byId/:id', async (req: Request, res: Response) => {
    try {
        const id = req.params.id
        const data = await userSchema.find({ _id: id }).sort({ name: 1 });
        if (data) {
            res.json(new Data(200, "User records are found successfully", data))
        }
        else {
            res.json(new Data(400, "Records are not found", null))
        }
    }
    catch (error) {
        res.json(new Data(500, "Internal server error", error))
    }
})
router.put('/updateUser/:id',  async (req: Request, res: Response) => {
    try {
        console.log(req.params.id)
        let updatedUser: any;
        let uId = req.params.id;
        let updatedData = {
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            email: req.body.email,
            mobile: req.body.mobile,
            role: req.body.role,
            date_of_joining: req.body.date_of_joining,
            date_of_birth: req.body.date_of_birth,
            password: req.body.password,
            emp_code: req.body.emp_code,
            gender: req.body.gender
        };
        if (!uId) {
            res.json(new Data(400, "Enter id and data", null))
        }
        else {
            updatedData.email = updatedData.email.toLowerCase()
            updatedUser = await userSchema.findByIdAndUpdate(uId, updatedData, { new: true });
            // res.send(updatedUser)
            if (!updatedUser) {
                res.json(new Data(400, "User not found", null))
            }
            else {
                if (updatedData.password) {
                    const salt = await bcrypt.genSalt(10)
                    await bcrypt.hash(req.body.password, salt).then(hashedpassword => {
                        if (hashedpassword) {
                            updatedUser.password = hashedpassword
                        }
                    })
                    await userSchema.create(updatedUser).then(Stored => {
                        if (Stored) {
                            res.json(new Data(200, "User updated successfully", Stored))
                        }
                    })
                        .catch(err => {
                            if (err) {
                                res.json(new Data(400, "User not found", err))
                            }
                        })
                }
                else {
                    res.json(new Data(200, "User updated successfully", updatedUser))
                }
            }
        }

    }
    catch (error) {
        res.json(new Data(500, "Internal server error", error))
    }
})
export default router;