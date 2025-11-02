/**
 * Learning Results Filter Component
 * 
 * Displays filter dropdowns for learning results/progress tracking
 * Features:
 * - Status filter: Enrolled, In Progress, Failed Exam, Success
 * - Year filter: Last 5 years (2025, 2024, 2023, 2022, 2021)
 * - All labels in Vietnamese
 * - Styled dropdown select inputs
 */

import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import './LearningResultsFilter.scss';

/**
 * Status options for learning results
 */
const STATUS_OPTIONS = [
  { value: 'all', label: 'Tất cả' },
  { value: 'enrolled', label: 'Đã ghi danh' },
  { value: 'in-progress', label: 'Đang học' },
  { value: 'failed-exam', label: 'Thi thất bại' },
  { value: 'success', label: 'Thành công' },
];

/**
 * Generate last 5 years options
 */
const getYearOptions = () => {
  const currentYear = new Date().getFullYear();
  const years = [{ value: 'all', label: 'Tất cả' }];
  
  for (let i = 0; i < 5; i++) {
    const year = currentYear - i;
    years.push({ value: year.toString(), label: `Năm ${year}` });
  }
  
  return years;
};

/**
 * LearningResultsFilter component - displays filter controls for learning results
 * Shows status and year filters as styled dropdown selects
 */
const LearningResultsFilter = ({
  onStatusChange,
  onYearChange,
  selectedStatus,
  selectedYear,
  className,
}) => {
  const yearOptions = getYearOptions();

  return (
    <div className={classNames('learning-results-filter', className)}>
      <div className="filter-section">
        <label className="filter-section-label">Lọc theo trạng thái</label>
        <select
          className="filter-dropdown"
          value={selectedStatus}
          onChange={(e) => onStatusChange(e.target.value)}
          aria-label="Lọc theo trạng thái"
        >
          {STATUS_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <div className="filter-section">
        <label className="filter-section-label">Lọc theo năm</label>
        <select
          className="filter-dropdown"
          value={selectedYear}
          onChange={(e) => onYearChange(e.target.value)}
          aria-label="Lọc theo năm"
        >
          {yearOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

LearningResultsFilter.propTypes = {
  /** Callback when status filter changes */
  onStatusChange: PropTypes.func.isRequired,
  /** Callback when year filter changes */
  onYearChange: PropTypes.func.isRequired,
  /** Currently selected status value */
  selectedStatus: PropTypes.string,
  /** Currently selected year value */
  selectedYear: PropTypes.string,
  /** Additional CSS classes */
  className: PropTypes.string,
};

LearningResultsFilter.defaultProps = {
  selectedStatus: 'all',
  selectedYear: 'all',
  className: '',
};

export default LearningResultsFilter;
