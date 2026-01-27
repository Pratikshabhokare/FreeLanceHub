import { useState, useEffect } from 'react';
import { searchJobs, searchFreelancers, getCurrentUser, submitProposal } from '../services/api';
import ProposalForm from '../components/proposals/ProposalForm';

export default function SearchDiscovery() {
  const [searchType, setSearchType] = useState('freelancers');
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

  // Mock data for dropdowns (could be fetched from backend)
  const categories = ['Web Development', 'Mobile Apps', 'Design', 'Writing', 'Marketing', 'Data Science'];
  const experienceLevels = ['Entry Level', 'Intermediate', 'Expert'];
  const sortOptions = ['Relevance', 'Newest', 'Price: Low to High', 'Price: High to Low', 'Rating'];

  useEffect(() => {
    // Debounce search to avoid too many requests
    const timeoutId = setTimeout(() => {
      performSearch();
    }, 500);
    return () => clearTimeout(timeoutId);
  }, [filters.searchQuery, searchType]);

  async function performSearch() {
    setLoading(true);
    setError(null);
    try {
      let data = [];
      if (searchType === 'freelancers') {
        // Backend search by skills and filters
        data = await searchFreelancers(filters);
      } else {
        // Backend search by keyword and filters
        data = await searchJobs(filters);
      }
      setResults(data || []);
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
      // Construct payload expected by backend Logic
      const payload = {
        jobId: formData.jobId,
        bidAmount: formData.bidAmount,
        message: formData.coverLetter // Mapping coverLetter to message
      };

      await submitProposal(user.id, payload);
      alert("Proposal submitted successfully!");
      setIsModalOpen(false);
      setSelectedJob(null);
    } catch (err) {
      console.error(err);
      alert("Failed to submit proposal: " + err.message);
    }
  }

  // Helper to map API data to UI format
  const mappedResults = results.map(item => {
    if (searchType === 'freelancers') {
      // Freelancer Map
      return {
        id: item.freelancer?.id,
        name: item.freelancer?.name || 'Unknown',
        title: item.title || 'Freelancer',
        rate: item.hourlyRate || 0,
        rating: 5.0, // Mock for now
        reviews: 0, // Mock for now
        category: 'General', // Mock
        experience: item.experience + ' Years',
        image: `https://ui-avatars.com/api/?name=${encodeURIComponent(item.freelancer?.name || 'F')}&background=random`,
        skills: item.skills
      };
    } else {
      // Job Map
      return {
        id: item.id,
        title: item.title,
        budget: item.budgetMax ? `${item.budgetMin} - ${item.budgetMax}` : item.budgetMin,
        category: 'General',
        posted: 'Recently',
        proposals: 0, // Mock
        category: 'General',
        posted: 'Recently',
        proposals: 0, // Mock
        description: item.description,
        status: item.status
      };
    }
  });

  return (
    <div style={{
      maxWidth: '1400px',
      margin: '0 auto',
      padding: '20px',
      fontFamily: '"Inter", sans-serif'
    }}>
      {/* Header */}
      <div style={{ marginBottom: '30px' }}>
        <h1 style={{ fontSize: '2.5em', margin: '0 0 10px 0', color: '#111827' }}>
          Search & Discovery
        </h1>
        <p style={{ color: '#6b7280', fontSize: '1.1em' }}>
          Find the perfect freelancer or project for your needs
        </p>
      </div>

      {/* Search Type Toggle */}
      <div style={{
        display: 'flex',
        gap: '10px',
        marginBottom: '30px',
        background: 'white',
        padding: '6px',
        borderRadius: '12px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        width: 'fit-content'
      }}>
        <button
          onClick={() => setSearchType('freelancers')}
          style={{
            padding: '10px 24px',
            background: searchType === 'freelancers' ? '#10b981' : 'transparent',
            color: searchType === 'freelancers' ? 'white' : '#6b7280',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '1em',
            fontWeight: '600',
            transition: 'all 0.2s'
          }}
        >
          🧑‍💼 Talent
        </button>
        <button
          onClick={() => setSearchType('jobs')}
          style={{
            padding: '10px 24px',
            background: searchType === 'jobs' ? '#10b981' : 'transparent',
            color: searchType === 'jobs' ? 'white' : '#6b7280',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '1em',
            fontWeight: '600',
            transition: 'all 0.2s'
          }}
        >
          💼 Jobs
        </button>
      </div>

      {/* Main Search Bar */}
      <div style={{
        background: 'white',
        padding: '20px',
        borderRadius: '16px',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        marginBottom: '30px'
      }}>
        <input
          type="text"
          placeholder={searchType === 'freelancers' ? 'Search by skills (e.g. Java, React)...' : 'Search for jobs...'}
          value={filters.searchQuery}
          onChange={(e) => handleFilterChange('searchQuery', e.target.value)}
          style={{
            width: '100%',
            padding: '16px 20px',
            fontSize: '1.1em',
            border: '2px solid #e5e7eb',
            borderRadius: '12px',
            outline: 'none',
            transition: 'border 0.2s'
          }}
          onFocus={(e) => e.target.style.borderColor = '#10b981'}
          onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
        />
      </div>

      {/* Filters and Results Layout */}
      <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: '30px' }}>
        {/* Filters Sidebar (Visual only for now as backend filtering is basic) */}
        <div>
          <div style={{
            background: 'white',
            padding: '25px',
            borderRadius: '16px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            position: 'sticky',
            top: '20px'
          }}>
            <h3 style={{ marginTop: 0, fontSize: '1.25em', color: '#111827', marginBottom: 20 }}>Filters</h3>
            {/* Category Filter */}
            <div style={{ marginBottom: '25px' }}>
              <label style={{ display: 'block', fontWeight: '600', marginBottom: '10px', color: '#4b5563' }}>
                Category
              </label>
              <select
                value={filters.category}
                onChange={(e) => handleFilterChange('category', e.target.value)}
                style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
                <option value="">All Categories</option>
                {categories.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            {/* Price Range */}
            <div style={{ marginBottom: '25px' }}>
              <label style={{ display: 'block', fontWeight: '600', marginBottom: '10px', color: '#4b5563' }}>
                {searchType === 'freelancers' ? 'Max Hourly Rate ($)' : 'Budget Range ($)'}
              </label>
              <div style={{ display: 'flex', gap: 10 }}>
                <input
                  type="number"
                  placeholder="Min"
                  value={filters.minPrice}
                  onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                  style={{ width: '50%', padding: '8px', borderRadius: 6, border: '1px solid #e5e7eb' }}
                />
                <input
                  type="number"
                  placeholder="Max"
                  value={filters.maxPrice}
                  onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                  style={{ width: '50%', padding: '8px', borderRadius: 6, border: '1px solid #e5e7eb' }}
                />
              </div>
            </div>
            <button
              onClick={() => setFilters({ ...filters, searchQuery: '' })}
              style={{
                width: '100%',
                padding: '12px',
                background: '#f3f4f6',
                color: '#374151',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: '600'
              }}
            >
              Clear Search
            </button>
          </div>
        </div>

        {/* Results Area */}
        <div>
          <div style={{ marginBottom: '20px' }}>
            <h3 style={{ margin: 0, color: '#111827' }}>
              {loading ? 'Searching...' : `${results.length} results found`}
            </h3>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {loading && <div>Loading...</div>}
            {!loading && mappedResults.length === 0 && (
              <div style={{ padding: 40, textAlign: 'center', color: '#6b7280', background: 'white', borderRadius: 12 }}>
                No results found. Try a different query.
              </div>
            )}
            {!loading && searchType === 'freelancers' ? (
              // Freelancer Cards
              mappedResults.map(freelancer => (
                <div
                  key={freelancer.id}
                  style={{
                    background: 'white',
                    padding: '25px',
                    borderRadius: '16px',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                    transition: 'all 0.2s',
                    cursor: 'pointer',
                    border: '1px solid transparent'
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1)';
                    e.currentTarget.style.borderColor = '#10b981';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)';
                    e.currentTarget.style.borderColor = 'transparent';
                  }}
                >
                  <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                    <img
                      src={freelancer.image}
                      alt={freelancer.name}
                      style={{ width: '80px', height: '80px', borderRadius: '50%', objectFit: 'cover' }}
                    />
                    <div style={{ flex: 1 }}>
                      <h4 style={{ margin: '0 0 4px 0', fontSize: '1.25em', color: '#111827' }}>
                        {freelancer.name}
                      </h4>
                      <p style={{ margin: '0 0 10px 0', color: '#059669', fontWeight: '600' }}>
                        {freelancer.title}
                      </p>
                      <p style={{ fontSize: '0.9em', color: '#4b5563', margin: 0 }}>
                        Skills: {freelancer.skills}
                      </p>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '1.5em', fontWeight: 'bold', color: '#111827' }}>
                        ${freelancer.rate}<span style={{ fontSize: '0.6em', color: '#6b7280' }}>/hr</span>
                      </div>
                      <div style={{ marginTop: 5, fontSize: '0.9em', color: '#4b5563' }}>
                        {freelancer.experience} Exp
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              // Job Cards
              !loading && mappedResults.map(job => (
                <div
                  key={job.id}
                  style={{
                    background: 'white',
                    padding: '25px',
                    borderRadius: '16px',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                    transition: 'all 0.2s',
                    cursor: 'pointer',
                    border: '1px solid transparent'
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1)';
                    e.currentTarget.style.borderColor = '#10b981';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)';
                    e.currentTarget.style.borderColor = 'transparent';
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                    <div style={{ flex: 1 }}>
                      <h4 style={{ margin: '0 0 8px 0', fontSize: '1.25em', color: '#111827' }}>
                        {job.title}
                      </h4>
                      <p style={{ color: '#4b5563', fontSize: '0.95em', marginBottom: 15, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                        {job.description}
                      </p>
                      <div style={{ display: 'flex', gap: '15px', fontSize: '0.9em', color: '#6b7280' }}>
                        <span style={{ fontWeight: 600, color: '#059669' }}>💰 ${job.budget}</span>
                        <span>📂 {job.category}</span>
                      </div>
                    </div>
                    <button
                      disabled={job.status !== 'OPEN'}
                      style={{
                        padding: '10px 20px',
                        background: job.status === 'OPEN' ? '#10b981' : '#9ca3af',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        cursor: job.status === 'OPEN' ? 'pointer' : 'not-allowed',
                        fontSize: '0.9em',
                        fontWeight: '600'
                      }}>
                      {job.status === 'OPEN' ? 'Apply' : 'Closed'}
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Proposal Modal */}
      {isModalOpen && selectedJob && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000
        }}
          onClick={() => setIsModalOpen(false)}
        >
          <div style={{
            background: 'white',
            padding: '20px',
            borderRadius: '16px',
            maxWidth: '600px',
            width: '95%',
            maxHeight: '90vh',
            overflowY: 'auto'
          }}
            onClick={e => e.stopPropagation()}
          >
            <h2 style={{ marginTop: 0, color: '#111827' }}>Submit Proposal: {selectedJob.title}</h2>
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
  );
}