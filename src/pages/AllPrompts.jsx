import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, SlidersHorizontal, ArrowUpDown, ChevronLeft, ChevronRight, RefreshCw, XCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import PromptCard from '../components/PromptCard';
import LoadingSpinner from '../components/LoadingSpinner';
import './AllPrompts.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

const AllPrompts = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // Search & Filter state synced with URL SearchParams for deep linking
  const search = searchParams.get('search') || '';
  const category = searchParams.get('category') || 'All';
  const aiTool = searchParams.get('aiTool') || 'All';
  const difficulty = searchParams.get('difficulty') || 'All';
  const sortBy = searchParams.get('sortBy') || 'latest';
  const page = parseInt(searchParams.get('page') || '1');

  const [prompts, setPrompts] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [totalPrompts, setTotalPrompts] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Available Filter Options
  const categories = ['All', 'Coding', 'Writing', 'Marketing', 'Graphics & Image', 'Idea Generation', 'System Assistant', 'Other'];
  const aiTools = ['All', 'ChatGPT', 'Gemini', 'Claude', 'Midjourney', 'Stable Diffusion', 'Other'];
  const difficulties = ['All', 'Beginner', 'Intermediate', 'Pro'];

  useEffect(() => {
    const fetchPrompts = async () => {
      try {
        setLoading(true);
        // Build query string
        const params = new URLSearchParams();
        if (search) params.append('search', search);
        if (category && category !== 'All') params.append('category', category);
        if (aiTool && aiTool !== 'All') params.append('aiTool', aiTool);
        if (difficulty && difficulty !== 'All') params.append('difficulty', difficulty);
        if (sortBy) params.append('sortBy', sortBy);
        params.append('page', page.toString());
        params.append('limit', '6'); // 6 per page to verify pagination

        const response = await fetch(`${API_URL}/prompts?${params.toString()}`);
        if (response.ok) {
          const data = await response.json();
          setPrompts(data.prompts);
          setTotalPages(data.totalPages);
          setTotalPrompts(data.totalPrompts);
        }
      } catch (error) {
        console.error('Error fetching prompts catalog:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPrompts();
  }, [search, category, aiTool, difficulty, sortBy, page]);

  // Update query params helper
  const updateQueryParam = (key, value) => {
    const newParams = new URLSearchParams(searchParams);
    if (value && value !== 'All' && value !== '') {
      newParams.set(key, value);
    } else {
      newParams.delete(key);
    }
    newParams.set('page', '1'); // Reset page to 1 on filter change
    setSearchParams(newParams);
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    const newParams = new URLSearchParams(searchParams);
    if (value) {
      newParams.set('search', value);
    } else {
      newParams.delete('search');
    }
    newParams.set('page', '1');
    setSearchParams(newParams);
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      const newParams = new URLSearchParams(searchParams);
      newParams.set('page', newPage.toString());
      setSearchParams(newParams);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const clearFilters = () => {
    setSearchParams(new URLSearchParams());
  };

  return (
    <div className="prompts-page-container">
      {/* Search and Filters Header */}
      <section className="catalog-header">
        <div className="catalog-title-col">
          <span className="section-subtitle">Catalog</span>
          <h1>Explore Prompts</h1>
          <p className="catalog-count-text">Showing {totalPrompts} verified AI prompts</p>
        </div>

        {/* Search Input */}
        <div className="catalog-search-bar glass-panel">
          <Search className="search-icon" />
          <input
            type="text"
            placeholder="Search prompt, tag, tool..."
            value={search}
            onChange={handleSearchChange}
            className="search-input"
          />
          {search && (
            <button className="clear-search-btn" onClick={() => updateQueryParam('search', '')}>
              Clear
            </button>
          )}
        </div>
      </section>

      {/* Main Catalog Workspace */}
      <div className="catalog-layout">
        {/* Sidebar Filters (Desktop) */}
        <aside className="filters-sidebar glass-panel">
          <div className="sidebar-header">
            <h3><SlidersHorizontal size={16} /> Filters</h3>
            <button className="clear-all-link-btn" onClick={clearFilters}>Reset</button>
          </div>

          {/* AI Tool Filter */}
          <div className="filter-group-widget">
            <h4 className="widget-title">AI Engine</h4>
            <div className="filter-options-list">
              {aiTools.map((tool) => (
                <button
                  key={tool}
                  className={`filter-option-btn ${aiTool === tool ? 'active' : ''}`}
                  onClick={() => updateQueryParam('aiTool', tool)}
                >
                  {tool}
                </button>
              ))}
            </div>
          </div>

          {/* Category Filter */}
          <div className="filter-group-widget">
            <h4 className="widget-title">Category</h4>
            <div className="filter-options-list">
              {categories.map((cat) => (
                <button
                  key={cat}
                  className={`filter-option-btn ${category === cat ? 'active' : ''}`}
                  onClick={() => updateQueryParam('category', cat)}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Difficulty Filter */}
          <div className="filter-group-widget">
            <h4 className="widget-title">Difficulty</h4>
            <div className="filter-options-list">
              {difficulties.map((diff) => (
                <button
                  key={diff}
                  className={`filter-option-btn ${difficulty === diff ? 'active' : ''}`}
                  onClick={() => updateQueryParam('difficulty', diff)}
                >
                  {diff}
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* Content Showcase Area */}
        <main className="catalog-content">
          {/* Sorting Control Header */}
          <div className="sorting-controls-header glass-panel">
            <div className="sorting-info">
              <span>Sort By:</span>
              <div className="sorting-tabs">
                <button
                  className={`sort-tab-btn ${sortBy === 'latest' ? 'active' : ''}`}
                  onClick={() => updateQueryParam('sortBy', 'latest')}
                >
                  Latest
                </button>
                <button
                  className={`sort-tab-btn ${sortBy === 'popular' ? 'active' : ''}`}
                  onClick={() => updateQueryParam('sortBy', 'popular')}
                >
                  Most Popular
                </button>
                <button
                  className={`sort-tab-btn ${sortBy === 'copied' ? 'active' : ''}`}
                  onClick={() => updateQueryParam('sortBy', 'copied')}
                >
                  Most Copied
                </button>
              </div>
            </div>

            {/* Mobile Filters Toggle Button */}
            <button
              className="btn btn-secondary btn-sm mobile-filter-toggle-trigger"
              onClick={() => setShowMobileFilters(true)}
            >
              <SlidersHorizontal size={14} />
              <span>Filters</span>
            </button>
          </div>

          {/* Grid Render */}
          {loading ? (
            <LoadingSpinner />
          ) : prompts.length === 0 ? (
            <div className="no-results-state glass-panel">
              <XCircle size={48} className="no-results-icon" />
              <h3>No matching prompts found</h3>
              <p>Try clearing some search terms or adjusting the sidebar filters.</p>
              <button onClick={clearFilters} className="btn btn-primary btn-sm">
                Clear All Filters
              </button>
            </div>
          ) : (
            <>
              <motion.div
                className="prompts-catalog-grid"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <AnimatePresence mode="popLayout">
                  {prompts.map((prompt) => (
                    <PromptCard key={prompt._id} prompt={prompt} />
                  ))}
                </AnimatePresence>
              </motion.div>

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className="pagination-bar glass-panel">
                  <button
                    className="pagination-arrow"
                    onClick={() => handlePageChange(page - 1)}
                    disabled={page === 1}
                  >
                    <ChevronLeft size={16} />
                  </button>
                  
                  <div className="page-numbers">
                    {[...Array(totalPages)].map((_, idx) => {
                      const pageNum = idx + 1;
                      return (
                        <button
                          key={pageNum}
                          className={`page-num-btn ${page === pageNum ? 'active' : ''}`}
                          onClick={() => handlePageChange(pageNum)}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                  </div>

                  <button
                    className="pagination-arrow"
                    onClick={() => handlePageChange(page + 1)}
                    disabled={page === totalPages}
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
              )}
            </>
          )}
        </main>
      </div>

      {/* Mobile Filters Modal */}
      {showMobileFilters && (
        <div className="mobile-filter-overlay">
          <motion.div
            className="mobile-filter-drawer"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          >
            <div className="drawer-header">
              <h3>Filters</h3>
              <button className="btn btn-secondary btn-sm" onClick={() => setShowMobileFilters(false)}>
                Done
              </button>
            </div>

            <div className="drawer-body">
              {/* AI Tool */}
              <div className="filter-group-widget">
                <h4 className="widget-title">AI Engine</h4>
                <div className="filter-options-list row">
                  {aiTools.map((tool) => (
                    <button
                      key={tool}
                      className={`filter-option-btn ${aiTool === tool ? 'active' : ''}`}
                      onClick={() => updateQueryParam('aiTool', tool)}
                    >
                      {tool}
                    </button>
                  ))}
                </div>
              </div>

              {/* Category */}
              <div className="filter-group-widget">
                <h4 className="widget-title">Category</h4>
                <div className="filter-options-list row">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      className={`filter-option-btn ${category === cat ? 'active' : ''}`}
                      onClick={() => updateQueryParam('category', cat)}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Difficulty */}
              <div className="filter-group-widget">
                <h4 className="widget-title">Difficulty</h4>
                <div className="filter-options-list row">
                  {difficulties.map((diff) => (
                    <button
                      key={diff}
                      className={`filter-option-btn ${difficulty === diff ? 'active' : ''}`}
                      onClick={() => updateQueryParam('difficulty', diff)}
                    >
                      {diff}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default AllPrompts;
