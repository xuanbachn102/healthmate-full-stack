import express from 'express';
import { getHealthNews, getNewsBySource, getSources } from '../controllers/newsController.js';

const newsRouter = express.Router();

// Get all health news
newsRouter.get('/', getHealthNews);

// Get available news sources
newsRouter.get('/sources', getSources);

// Get news by specific source
newsRouter.get('/source/:sourceName', getNewsBySource);

export default newsRouter;
