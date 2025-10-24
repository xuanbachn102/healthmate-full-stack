import { fetchHealthNews, fetchNewsBySource, getNewsSources } from '../services/newsService.js';

/**
 * Get health news from all sources
 * @route GET /api/news
 */
export const getHealthNews = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 20;
    const result = await fetchHealthNews(limit);

    if (result.success) {
      res.json(result);
    } else {
      res.status(500).json(result);
    }
  } catch (error) {
    console.error('Error in getHealthNews controller:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch health news'
    });
  }
};

/**
 * Get health news from specific source
 * @route GET /api/news/source/:sourceName
 */
export const getNewsBySource = async (req, res) => {
  try {
    const { sourceName } = req.params;
    const result = await fetchNewsBySource(sourceName);

    if (result.success) {
      res.json(result);
    } else {
      res.status(404).json(result);
    }
  } catch (error) {
    console.error('Error in getNewsBySource controller:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch news'
    });
  }
};

/**
 * Get list of available news sources
 * @route GET /api/news/sources
 */
export const getSources = async (req, res) => {
  try {
    const result = getNewsSources();
    res.json(result);
  } catch (error) {
    console.error('Error in getSources controller:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get sources'
    });
  }
};
