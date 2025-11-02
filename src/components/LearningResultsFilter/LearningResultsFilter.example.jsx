/**
 * Example Usage of LearningResultsFilter Component
 * 
 * This file demonstrates various ways to use the LearningResultsFilter component
 * in a learning results or dashboard page.
 */

import React, { useState } from 'react';
import LearningResultsFilter from './LearningResultsFilter';

/**
 * Basic Example - Simple filter without data fetching
 */
export function BasicExample() {
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedYear, setSelectedYear] = useState('all');

  const handleStatusChange = (status) => {
    console.log('Status changed to:', status);
    setSelectedStatus(status);
  };

  const handleYearChange = (year) => {
    console.log('Year changed to:', year);
    setSelectedYear(year);
  };

  return (
    <div>
      <h2>Learning Results</h2>
      <LearningResultsFilter
        selectedStatus={selectedStatus}
        onStatusChange={handleStatusChange}
        selectedYear={selectedYear}
        onYearChange={handleYearChange}
      />
      <div>
        <p>Current Status: {selectedStatus}</p>
        <p>Current Year: {selectedYear}</p>
      </div>
    </div>
  );
}

/**
 * Example with Mock Data - Shows filtered results based on selection
 */
export function FilteredDataExample() {
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedYear, setSelectedYear] = useState('all');
  const [filteredResults, setFilteredResults] = useState([]);

  // Mock learning results data
  const mockData = [
    {
      id: 1,
      courseName: 'Python Basics',
      status: 'success',
      year: 2025,
      completionDate: '2025-10-15',
    },
    {
      id: 2,
      courseName: 'Web Development',
      status: 'in-progress',
      year: 2025,
      enrollmentDate: '2025-01-10',
    },
    {
      id: 3,
      courseName: 'Data Science 101',
      status: 'enrolled',
      year: 2024,
      enrollmentDate: '2024-11-20',
    },
    {
      id: 4,
      courseName: 'Advanced JavaScript',
      status: 'failed-exam',
      year: 2024,
      completionDate: '2024-08-30',
    },
    {
      id: 5,
      courseName: 'Mobile App Development',
      status: 'success',
      year: 2023,
      completionDate: '2023-06-15',
    },
    {
      id: 6,
      courseName: 'Cloud Computing',
      status: 'in-progress',
      year: 2023,
      enrollmentDate: '2023-09-01',
    },
  ];

  const handleStatusChange = (status) => {
    setSelectedStatus(status);
    applyFilters(status, selectedYear);
  };

  const handleYearChange = (year) => {
    setSelectedYear(year);
    applyFilters(selectedStatus, year);
  };

  const applyFilters = (status, year) => {
    let results = mockData;

    if (status !== 'all') {
      results = results.filter((item) => item.status === status);
    }

    if (year !== 'all') {
      results = results.filter((item) => item.year === parseInt(year, 10));
    }

    setFilteredResults(results);
  };

  // Apply initial filter
  React.useEffect(() => {
    applyFilters(selectedStatus, selectedYear);
  }, []);

  const getStatusLabel = (status) => {
    const labels = {
      enrolled: 'Đã ghi danh',
      'in-progress': 'Đang học',
      'failed-exam': 'Thi thất bại',
      success: 'Thành công',
    };
    return labels[status] || status;
  };

  return (
    <div>
      <h2>Kết quả học tập</h2>
      <LearningResultsFilter
        selectedStatus={selectedStatus}
        onStatusChange={handleStatusChange}
        selectedYear={selectedYear}
        onYearChange={handleYearChange}
      />

      <div style={{ marginTop: '2rem' }}>
        <h3>Results ({filteredResults.length})</h3>
        {filteredResults.length === 0 ? (
          <p>Không tìm thấy kết quả phù hợp</p>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #ccc' }}>
                <th style={{ textAlign: 'left', padding: '1rem' }}>Tên Khóa Học</th>
                <th style={{ textAlign: 'left', padding: '1rem' }}>Trạng Thái</th>
                <th style={{ textAlign: 'left', padding: '1rem' }}>Năm</th>
              </tr>
            </thead>
            <tbody>
              {filteredResults.map((result) => (
                <tr key={result.id} style={{ borderBottom: '1px solid #eee' }}>
                  <td style={{ padding: '1rem' }}>{result.courseName}</td>
                  <td style={{ padding: '1rem' }}>{getStatusLabel(result.status)}</td>
                  <td style={{ padding: '1rem' }}>{result.year}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

/**
 * Example with API Calls - Shows how to integrate with backend
 */
export function APICallExample() {
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedYear, setSelectedYear] = useState('all');
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchLearningResults = async (status, year) => {
    setIsLoading(true);
    try {
      // Replace with your actual API endpoint
      const queryParams = new URLSearchParams();
      if (status !== 'all') queryParams.append('status', status);
      if (year !== 'all') queryParams.append('year', year);

      const response = await fetch(
        `/api/learning-results?${queryParams.toString()}`
      );
      const data = await response.json();
      setResults(data.results || []);
    } catch (error) {
      console.error('Error fetching learning results:', error);
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusChange = (status) => {
    setSelectedStatus(status);
    fetchLearningResults(status, selectedYear);
  };

  const handleYearChange = (year) => {
    setSelectedYear(year);
    fetchLearningResults(selectedStatus, year);
  };

  return (
    <div>
      <h2>Kết quả học tập</h2>
      <LearningResultsFilter
        selectedStatus={selectedStatus}
        onStatusChange={handleStatusChange}
        selectedYear={selectedYear}
        onYearChange={handleYearChange}
      />

      {isLoading && <p>Đang tải...</p>}

      {!isLoading && results.length === 0 && (
        <p>Không tìm thấy kết quả phù hợp</p>
      )}

      {!isLoading && results.length > 0 && (
        <div style={{ marginTop: '2rem' }}>
          <h3>Results ({results.length})</h3>
          {/* Render your results here */}
        </div>
      )}
    </div>
  );
}

/**
 * Example with Custom Styling
 */
export function CustomStyleExample() {
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedYear, setSelectedYear] = useState('all');

  const handleStatusChange = (status) => {
    setSelectedStatus(status);
  };

  const handleYearChange = (year) => {
    setSelectedYear(year);
  };

  return (
    <div>
      <h2>Kết quả học tập</h2>
      <LearningResultsFilter
        selectedStatus={selectedStatus}
        onStatusChange={handleStatusChange}
        selectedYear={selectedYear}
        onYearChange={handleYearChange}
        className="custom-learning-filter"
      />
      <style>{`
        .custom-learning-filter {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-radius: 0.75rem;
          padding: 2rem;
          gap: 3rem;
        }

        .custom-learning-filter .filter-label {
          color: white;
          font-weight: 700;
          text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
        }

        .custom-learning-filter .filter-select {
          border: 2px solid white;
          background-color: rgba(255, 255, 255, 0.95);
          padding: 0.75rem 1rem;
          font-weight: 500;
        }

        .custom-learning-filter .filter-select:focus {
          box-shadow: 0 0 0 3px rgba(255, 255, 255, 0.3);
        }
      `}</style>
    </div>
  );
}

/**
 * Example with React Hooks (useCallback)
 * For use in larger applications with frequent re-renders
 */
export function UseCallbackExample() {
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedYear, setSelectedYear] = useState('all');
  const [results, setResults] = useState([]);

  // Memoize callbacks to prevent unnecessary re-renders of child components
  const handleStatusChange = React.useCallback((status) => {
    console.log('Filtering by status:', status);
    setSelectedStatus(status);
    // Perform API call or data filtering
  }, []);

  const handleYearChange = React.useCallback((year) => {
    console.log('Filtering by year:', year);
    setSelectedYear(year);
    // Perform API call or data filtering
  }, []);

  return (
    <div>
      <h2>Kết quả học tập</h2>
      <LearningResultsFilter
        selectedStatus={selectedStatus}
        onStatusChange={handleStatusChange}
        selectedYear={selectedYear}
        onYearChange={handleYearChange}
      />
    </div>
  );
}

/**
 * Default export - Use the FilteredDataExample for demonstration
 */
export default FilteredDataExample;
