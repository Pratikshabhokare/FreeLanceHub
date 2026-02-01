import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { searchJobs, searchFreelancers, getCurrentUser, submitProposal } from '../services/api';
import ProposalForm from '../components/proposals/ProposalForm';
import Navbar from '../components/others/Navbar';
import Footer from '../components/others/Footer';
import './SearchDiscovery.css';

export default function SearchDiscovery() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const initialType = queryParams.get('type') === 'jobs' ? 'jobs' : 'freelancers';

  /* Initialize navigate */
  const navigate = useNavigate();

  const [searchType, setSearchType] = useState(initialType);


  useEffect(() => {
    const type = queryParams.get('type');
    if (type) setSearchType(type === 'jobs' ? 'jobs' : 'freelancers');
  }, [location.search]);
  const [filters, setFilters] = useState({
    searchQuery: '',
    category: '',
    minPrice: '',
    maxPrice: '',
    rating: '',
    experience: '',
    sortBy: 'relevance'
  });

  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Proposal Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);

  const categories = ['Web Development', 'Mobile Apps', 'Design', 'Writing', 'Marketing', 'Data Science'];

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      performSearch();
    }, 500);
    return () => clearTimeout(timeoutId);
  }, [filters.searchQuery, searchType, filters.category]);

  async function performSearch() {
    setLoading(true);
    setError(null);
    try {
      let data = [];
      if (searchType === 'freelancers') {
        data = await searchFreelancers(filters);
      } else {
        data = await searchJobs(filters);
      }
      setResults(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch results");
    } finally {
      setLoading(false);
    }
  }

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  function handleApplyClick(job) {
    const user = getCurrentUser();
    if (!user) {
      alert("Please login to apply for jobs.");
      return;
    }
    if (user.role !== 'FREELANCER') {
      alert("Only freelancers can apply for jobs.");
      return;
    }
    setSelectedJob(job);
    setIsModalOpen(true);
  }

  async function handleProposalSubmit(formData) {
    try {
      const user = getCurrentUser();
      const payload = {
        jobId: formData.jobId,
        bidAmount: formData.bidAmount,
        message: formData.coverLetter
      };

      await submitProposal(user.id, payload);
      alert("Proposal submitted successfully!");
      setIsModalOpen(false);
    } catch (err) {
      console.error(err);
      alert("Failed to submit proposal: " + err.message);
    }
  }

  // Helper for freelancer avatars
  const profileImages = [
    "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop",
    "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop",
    "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop",
    "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&h=200&fit=crop",
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop"
  ];

  return (
    <>
      <Navbar />
      <div className="discovery-container">
        <header className="discovery-header">
          <h1>Find Your Next Big Solution</h1>
          <p>Whether you're looking for top-tier talent or your dream project, we've got you covered.</p>
        </header>

        <div className="discovery-tabs">
          <button
            className={`tab-btn ${searchType === 'freelancers' ? 'active' : ''}`}
            onClick={() => setSearchType('freelancers')}
          >
            <i className="fas fa-user-tie"></i> Find Talent
          </button>
          <button
            className={`tab-btn ${searchType === 'jobs' ? 'active' : ''}`}
            onClick={() => setSearchType('jobs')}
          >
            <i className="fas fa-briefcase"></i> Find Jobs
          </button>
        </div>

        <div className="search-wrapper">
          <i className="fas fa-search search-icon-float"></i>
          <input
            type="text"
            className="search-input"
            placeholder={searchType === 'freelancers' ? 'Search by skills, names or titles...' : 'Search for project keywords...'}
            value={filters.searchQuery}
            onChange={(e) => handleFilterChange('searchQuery', e.target.value)}
          />
        </div>

        <div className="discovery-content">
          <aside className="filters-sidebar">
            <h3><i className="fas fa-sliders-h"></i> Filters</h3>

            <div className="filter-group">
              <label>Category</label>
              <select
                value={filters.category}
                onChange={(e) => handleFilterChange('category', e.target.value)}
              >
                <option value="">All Categories</option>
                {categories.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            <div className="filter-group">
              <label>{searchType === 'freelancers' ? 'Max Hourly Rate ($)' : 'Budget Range ($)'}</label>
              <div className="price-inputs">
                <input type="number" placeholder="Min" value={filters.minPrice} onChange={(e) => handleFilterChange('minPrice', e.target.value)} />
                <input type="number" placeholder="Max" value={filters.maxPrice} onChange={(e) => handleFilterChange('maxPrice', e.target.value)} />
              </div>
            </div>

            <button className="clear-btn" onClick={() => setFilters({ ...filters, searchQuery: '', category: '', minPrice: '', maxPrice: '' })}>
              Reset Filters
            </button>
          </aside>

          <main className="results-main">
            <div className="results-info">
              {loading ? 'Scanning marketplace...' : <>Found <span>{results.length}</span> matching {searchType}</>}
            </div>

            {loading ? (
              <div className="discovery-loader">
                <div className="spinner"></div>
                <p>Loading the best matching results...</p>
              </div>
            ) : (
              <div className="results-list">
                {results.length === 0 && (
                  <div className="no-results-card">
                    <i className="fas fa-search"></i>
                    <h4>No results found</h4>
                    <p>Try adjusting your search criteria or filters.</p>
                  </div>
                )}

                {searchType === 'freelancers' ? (
                  results.map((f, idx) => (
                    <div key={f.id || idx} className="result-card">
                      <div className="card-visual">
                        <img
                          src={profileImages[idx % profileImages.length]}
                          className="freelancer-avatar"
                          alt={f.freelancer?.name}
                        />
                      </div>
                      <div className="card-info">
                        <div className="card-title-meta">
                          <h4>{f.freelancer?.name || 'Talented Professional'}</h4>
                          <span className="talent-status"><i className="fas fa-check-circle"></i> Available</span>
                        </div>
                        <p className="card-description">{f.bio || `Specialized in ${f.title || 'Freelancing'}. Highly experienced specialist with a proven track record of successful projects.`}</p>
                        <div className="card-tags">
                          {(f.skills ? String(f.skills).split(',') : ['Generalist']).map((skill, i) => (
                            <span key={i} className="tag-badge">{skill.trim()}</span>
                          ))}
                        </div>
                      </div>
                      <div className="card-actions">
                        <div className="card-rate">
                          <span className="rate-value">${f.hourlyRate || 25}</span>
                          <span className="rate-label">per hour</span>
                        </div>
                        <div className="card-stats">
                          <i className="fas fa-star"></i> 5.0 (24 reviews)
                        </div>
                        <div className="card-actions-buttons">
                          <button
                            className="btn-outline"
                            onClick={() => navigate(`/profile/${f.freelancerId}`)}
                          >
                            View Profile
                          </button>
                          <button
                            className="btn-primary"
                            onClick={async (e) => {
                              e.stopPropagation();
                              const user = getCurrentUser();
                              if (!user) {
                                alert("Please login to message freelancers.");
                                navigate("/login");
                                return;
                              }
                              // Basic check: prevent messaging yourself
                              if (user.id === f.freelancerId) {
                                alert("You cannot message yourself.");
                                return;
                              }
                              try {
                                // jobId=0 implies general inquiry
                                const { createChat } = await import('../services/api');
                                const chat = await createChat(0, f.freelancerId, user.id);
                                navigate("/messages", { state: { selectedChat: chat } });
                              } catch (err) {
                                console.error(err);
                                alert("Failed to start chat.");
                              }
                            }}
                          >
                            Quick Message
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  results.map((j) => (
                    <div key={j.id} className="result-card">
                      <div className="card-visual">
                        <div className="job-icon-box">
                          <i className="fas fa-laptop-code"></i>
                        </div>
                      </div>
                      <div className="card-info">
                        <div className="card-title-meta">
                          <h4>{j.title}</h4>
                        </div>
                        <p className="card-description">{j.description}</p>
                        <div className="card-tags">
                          <span className="tag-badge"><i className="fas fa-clock"></i> Posted Today</span>
                          <span className="tag-badge"><i className="fas fa-users"></i> {j.proposals || 0} proposals</span>
                        </div>
                      </div>
                      <div className="card-actions">
                        <div className="card-rate">
                          <span className="rate-value">${j.budgetMax || j.budgetMin || j.budget || 'Negotiable'}</span>
                          <span className="rate-label">{j.budgetType || 'Fixed Budget'}</span>
                        </div>
                        <button
                          className="apply-btn"
                          onClick={() => handleApplyClick(j)}
                          disabled={j.status !== 'OPEN'}
                        >
                          {j.status === 'OPEN' ? 'Submit Proposal' : 'Job Closed'}
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </main>
        </div>

        {isModalOpen && selectedJob && (
          <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
            <div className="modal-card" onClick={e => e.stopPropagation()}>
              <h2>Submit Proposal for {selectedJob.title}</h2>
              <ProposalForm
                jobOptions={[selectedJob]}
                initialValue={{ jobId: selectedJob.id }}
                onSubmit={handleProposalSubmit}
                onCancel={() => setIsModalOpen(false)}
              />
            </div>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
}