import express from 'express'
import mongoose from 'mongoose'
import bodyParser from 'body-parser'
import path from 'path'
import multer from 'multer';
import morgan from 'morgan';
import cors from 'cors';
import { Request, Response } from 'express'
import fs from 'fs';
import userRoute from './routes/userRoute'
import userSchema from './models/userModel'
const app = express()

// Middleware
app.use(express.json())
app.use(cors());
app.use(bodyParser.json());
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json())

//DB connection
const uri_prod = `mongodb://localhost:27017/Timesheet-New`
mongoose.connect(uri_prod);
const db = mongoose.connection;
db.on("error", console.error.bind(console, "db connection error: "));
db.once("open", function () { console.log("----MongoDB Connected successfully---"); });

//application routes
app.use('/api/user', userRoute);


const uploadsPath = path.resolve(__dirname, '../uploads');
app.use('/api/uploads', express.static(uploadsPath));

app.get('/api/uploads/:filename', (req, res, next) => {
  const filename = req.params.filename;
  const filePath = path.join(uploadsPath, filename);
  const fileStream = fs.createReadStream(filePath);

  fileStream.on('error', (error) => {
    console.error('Error reading file:', error);
    // Call the next middleware to handle the error globally
    next(error);
  });

  fileStream.pipe(res);
});

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads');
  },
  filename: (req, file, cb) => {
    const extension = path.extname(file.originalname);
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + extension);
  },
});
const upload = multer({ storage });

app.post('/api/upload', upload.single('image'),  async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No image provided' });
    }
    const { originalname, size, path } = req.file;
    let modifiedPath = path.replace('uploads', '');

    //Update the document based on the _id
    const result = await userSchema.updateOne(
      { _id: req.body.userId },
      { $set: { user_image_path: modifiedPath } }
    );
    return res.status(200).json({ message: 'Image uploaded successfully' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server Error nnnnnn', error: error });
  }
});
const serverPort = 8083;
app.listen(serverPort, () => {
  console.log(`Server is running on  ${serverPort}`);
})