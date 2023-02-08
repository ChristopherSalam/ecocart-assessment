import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import path from 'path';

import * as middlewares from './middlewares';
import api from './api';
import MessageResponse from './interfaces/MessageResponse';

require('dotenv').config();

const app = express();

app.use(morgan('dev'));
app.use(helmet());
app.use(cors());
app.use(express.json());

app.get<{}, MessageResponse>('/', api)

app.use(middlewares.notFound);
app.use(middlewares.errorHandler);

export default app;
