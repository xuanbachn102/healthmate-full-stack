import Parser from 'rss-parser';

const parser = new Parser({
  customFields: {
    item: [
      ['media:content', 'mediaContent'],
      ['media:thumbnail', 'mediaThumbnail'],
      ['description', 'description'],
    ]
  }
});

// Vietnamese health news RSS feeds
const RSS_FEEDS = [
  {
    name: 'VnExpress Sức khỏe',
    url: 'https://vnexpress.net/rss/suc-khoe.rss',
    source: 'VnExpress'
  },
  {
    name: 'Sức khỏe & Đời sống',
    url: 'https://suckhoedoisong.vn/rss/trang-chu.rss',
    source: 'SKĐS'
  },
  {
    name: 'Dân trí Sức khỏe',
    url: 'https://dantri.com.vn/suc-khoe.rss',
    source: 'Dân trí'
  },
  {
    name: 'Tuổi Trẻ Sức khỏe',
    url: 'https://tuoitre.vn/rss/suc-khoe.rss',
    source: 'Tuổi Trẻ'
  }
];

/**
 * Extract image from RSS item
 */
function extractImage(item) {
  // Try media:content
  if (item.mediaContent && item.mediaContent.$) {
    return item.mediaContent.$.url;
  }

  // Try media:thumbnail
  if (item.mediaThumbnail && item.mediaThumbnail.$) {
    return item.mediaThumbnail.$.url;
  }

  // Try enclosure
  if (item.enclosure && item.enclosure.url) {
    return item.enclosure.url;
  }

  // Try to extract from description/content
  if (item.description) {
    const imgMatch = item.description.match(/<img[^>]+src="([^">]+)"/);
    if (imgMatch) {
      return imgMatch[1];
    }
  }

  if (item.content) {
    const imgMatch = item.content.match(/<img[^>]+src="([^">]+)"/);
    if (imgMatch) {
      return imgMatch[1];
    }
  }

  // Default placeholder
  return 'https://via.placeholder.com/400x250?text=Health+News';
}

/**
 * Clean HTML from description
 */
function cleanDescription(html) {
  if (!html) return '';

  // Remove HTML tags
  let text = html.replace(/<[^>]*>/g, ' ');

  // Decode HTML entities
  text = text
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");

  // Remove extra whitespace
  text = text.replace(/\s+/g, ' ').trim();

  // Limit length
  if (text.length > 200) {
    text = text.substring(0, 197) + '...';
  }

  return text;
}

/**
 * Fetch news from a single RSS feed
 */
async function fetchFromFeed(feed) {
  try {
    const data = await parser.parseURL(feed.url);

    return data.items.slice(0, 10).map(item => ({
      title: item.title || 'No title',
      description: cleanDescription(item.description || item.contentSnippet || ''),
      link: item.link || '#',
      pubDate: item.pubDate || item.isoDate || new Date().toISOString(),
      source: feed.source,
      image: extractImage(item),
      guid: item.guid || item.link || Math.random().toString()
    }));
  } catch (error) {
    console.error(`Error fetching from ${feed.name}:`, error.message);
    return [];
  }
}

/**
 * Fetch health news from all RSS feeds
 */
export const fetchHealthNews = async (limit = 20) => {
  try {
    // Fetch from all feeds in parallel
    const results = await Promise.all(
      RSS_FEEDS.map(feed => fetchFromFeed(feed))
    );

    // Flatten and combine all results
    const allNews = results.flat();

    // Sort by date (newest first)
    allNews.sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate));

    // Return limited results
    return {
      success: true,
      data: allNews.slice(0, limit),
      total: allNews.length
    };

  } catch (error) {
    console.error('Error fetching health news:', error);
    return {
      success: false,
      message: 'Failed to fetch health news',
      error: error.message
    };
  }
};

/**
 * Fetch news from specific source
 */
export const fetchNewsBySource = async (sourceName) => {
  try {
    const feed = RSS_FEEDS.find(f => f.source === sourceName);

    if (!feed) {
      return {
        success: false,
        message: 'Source not found'
      };
    }

    const news = await fetchFromFeed(feed);

    return {
      success: true,
      data: news,
      source: sourceName
    };

  } catch (error) {
    console.error('Error fetching news by source:', error);
    return {
      success: false,
      message: 'Failed to fetch news',
      error: error.message
    };
  }
};

/**
 * Get available news sources
 */
export const getNewsSources = () => {
  return {
    success: true,
    data: RSS_FEEDS.map(feed => ({
      name: feed.name,
      source: feed.source
    }))
  };
};
