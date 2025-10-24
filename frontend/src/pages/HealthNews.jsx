import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import axios from 'axios';

const HealthNews = () => {
  const { t } = useTranslation();
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSource, setSelectedSource] = useState('all');

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/news?limit=30`);

      if (response.data.success) {
        setNews(response.data.data);
      } else {
        setError('Failed to load news');
      }
    } catch (err) {
      console.error('Error fetching news:', err);
      setError('Unable to fetch health news. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const filterNewsBySource = (source) => {
    setSelectedSource(source);
  };

  const filteredNews = selectedSource === 'all'
    ? news
    : news.filter(item => item.source === selectedSource);

  const sources = ['all', ...new Set(news.map(item => item.source))];

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffHours < 1) {
      return 'Vừa xong';
    } else if (diffHours < 24) {
      return `${diffHours} giờ trước`;
    } else if (diffDays === 1) {
      return 'Hôm qua';
    } else if (diffDays < 7) {
      return `${diffDays} ngày trước`;
    } else {
      return date.toLocaleDateString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    }
  };

  return (
    <div className='min-h-screen py-8 px-4 sm:px-6 lg:px-8'>
      {/* Header */}
      <div className='max-w-7xl mx-auto mb-8'>
        <h1 className='text-3xl font-bold text-gray-900 dark:text-white mb-2'>
          {t('healthNews.title') || 'Tin tức sức khỏe'}
        </h1>
        <p className='text-gray-600 dark:text-gray-300'>
          {t('healthNews.subtitle') || 'Cập nhật tin tức y tế và sức khỏe mới nhất từ các nguồn uy tín'}
        </p>
      </div>

      {/* Source Filter */}
      <div className='max-w-7xl mx-auto mb-6'>
        <div className='flex flex-wrap gap-2'>
          {sources.map(source => (
            <button
              key={source}
              onClick={() => filterNewsBySource(source)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                selectedSource === source
                  ? 'bg-primary text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              {source === 'all' ? 'Tất cả' : source}
            </button>
          ))}
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className='max-w-7xl mx-auto flex justify-center items-center py-20'>
          <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-primary'></div>
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <div className='max-w-7xl mx-auto'>
          <div className='bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6 text-center'>
            <p className='text-red-600 dark:text-red-400'>{error}</p>
            <button
              onClick={fetchNews}
              className='mt-4 px-6 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-all'
            >
              Thử lại
            </button>
          </div>
        </div>
      )}

      {/* News Grid */}
      {!loading && !error && filteredNews.length > 0 && (
        <div className='max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
          {filteredNews.map((item, index) => (
            <a
              key={item.guid || index}
              href={item.link}
              target='_blank'
              rel='noopener noreferrer'
              className='bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1'
            >
              {/* Image */}
              <div className='relative h-48 bg-gray-200 dark:bg-gray-700'>
                <img
                  src={item.image}
                  alt={item.title}
                  className='w-full h-full object-cover'
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/400x250?text=Health+News';
                  }}
                />
                <div className='absolute top-2 right-2 bg-primary text-white text-xs px-3 py-1 rounded-full font-medium'>
                  {item.source}
                </div>
              </div>

              {/* Content */}
              <div className='p-5'>
                <h3 className='text-lg font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2 hover:text-primary transition-colors'>
                  {item.title}
                </h3>

                <p className='text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-3'>
                  {item.description}
                </p>

                <div className='flex items-center justify-between text-xs text-gray-500 dark:text-gray-500'>
                  <span>{formatDate(item.pubDate)}</span>
                  <span className='text-primary hover:underline'>Đọc thêm →</span>
                </div>
              </div>
            </a>
          ))}
        </div>
      )}

      {/* No Results */}
      {!loading && !error && filteredNews.length === 0 && (
        <div className='max-w-7xl mx-auto'>
          <div className='bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-12 text-center'>
            <p className='text-gray-600 dark:text-gray-400 text-lg'>
              Không tìm thấy tin tức nào
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default HealthNews;
