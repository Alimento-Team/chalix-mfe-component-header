# Learning Results Filter Component

## Overview

The `LearningResultsFilter` component provides a clean, accessible way to filter learning results/progress data in Vietnamese. It includes two dropdown filters:

1. **Status Filter** - Filter by enrollment/completion status
2. **Year Filter** - Filter by year (last 5 years)

All labels and options are in Vietnamese as requested.

## Status Options

- **Tất cả trạng thái** (All statuses) - Default option to show all
- **Đã ghi danh** (Enrolled) - Shows enrolled status
- **Đang học** (In Progress) - Shows in progress status
- **Thi thất bại** (Failed Exam) - Shows failed exam status
- **Thành công** (Success) - Shows successful completions

## Year Options

- **Tất cả năm** (All years) - Default option to show all years
- **Năm [current year]** (Year XXXX) - Shows current year and last 4 years

The year options are dynamically generated based on the current date, always showing the last 5 years including the current year.

## Installation & Usage

### Basic Usage

```jsx
import React, { useState } from 'react';
import { LearningResultsFilter } from '@chalix/frontend-component-header';

function LearningResultsPage() {
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedYear, setSelectedYear] = useState('all');

  const handleStatusChange = (status) => {
    setSelectedStatus(status);
    // Fetch/filter data based on status
  };

  const handleYearChange = (year) => {
    setSelectedYear(year);
    // Fetch/filter data based on year
  };

  return (
    <div>
      <LearningResultsFilter
        selectedStatus={selectedStatus}
        onStatusChange={handleStatusChange}
        selectedYear={selectedYear}
        onYearChange={handleYearChange}
      />
      {/* Your learning results content here */}
    </div>
  );
}

export default LearningResultsPage;
```

### Props

| Prop             | Type     | Required | Default | Description                                                                       |
| ---------------- | -------- | -------- | ------- | --------------------------------------------------------------------------------- |
| `onStatusChange` | function | Yes      | -       | Callback function when status filter changes. Receives the selected status value. |
| `onYearChange`   | function | Yes      | -       | Callback function when year filter changes. Receives the selected year value.     |
| `selectedStatus` | string   | No       | 'all'   | The currently selected status value                                               |
| `selectedYear`   | string   | No       | 'all'   | The currently selected year value                                                 |
| `className`      | string   | No       | ''      | Additional CSS classes to apply to the container                                  |

### Advanced Usage with Redux/State Management

```jsx
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { LearningResultsFilter } from '@chalix/frontend-component-header';
import { setStatusFilter, setYearFilter, fetchLearningResults } from './store/learningResultsSlice';

function LearningResultsPage() {
  const dispatch = useDispatch();
  const { statusFilter, yearFilter } = useSelector(state => state.learningResults);

  const handleStatusChange = (status) => {
    dispatch(setStatusFilter(status));
    dispatch(fetchLearningResults({ status, year: yearFilter }));
  };

  const handleYearChange = (year) => {
    dispatch(setYearFilter(year));
    dispatch(fetchLearningResults({ status: statusFilter, year }));
  };

  return (
    <LearningResultsFilter
      selectedStatus={statusFilter}
      onStatusChange={handleStatusChange}
      selectedYear={yearFilter}
      onYearChange={handleYearChange}
    />
  );
}

export default LearningResultsPage;
```

## Styling

The component comes with built-in SCSS styling. The main classes you might want to override are:

```scss
// Main container
.learning-results-filter {
  display: flex;
  gap: 2rem;
  padding: 1.5rem;
  background-color: #f5f5f5;
  border-radius: 0.5rem;
  margin-bottom: 1.5rem;
}

// Filter group (status/year pair)
.filter-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  min-width: 200px;
}

// Label styling
.filter-label {
  font-size: 0.875rem;
  font-weight: 600;
  color: #333;
}

// Select dropdown styling
.filter-select {
  padding: 0.5rem 0.75rem;
  border: 1px solid #ccc;
  border-radius: 0.375rem;
  font-size: 0.875rem;
}
```

### Custom Styling Example

```jsx
<LearningResultsFilter
  selectedStatus={selectedStatus}
  onStatusChange={handleStatusChange}
  selectedYear={selectedYear}
  onYearChange={handleYearChange}
  className="custom-filters"
/>
```

```scss
.custom-filters {
  background-color: #ffffff;
  padding: 2rem;
  gap: 3rem;
  
  .filter-label {
    font-weight: 700;
    color: #005a9c;
  }
  
  .filter-select {
    border: 2px solid #005a9c;
    padding: 0.75rem 1rem;
  }
}
```

## Accessibility Features

- Proper `for` attributes linking labels to inputs
- Semantic HTML with `<select>` and `<label>` elements
- Focus visible states with blue outline and shadow
- Disabled state styling and cursor changes
- Screen reader compatible

## Integration with Dashboard

To integrate with the main Chalix dashboard, the component can be placed above course listings or in a separate learning results tab:

```jsx
// In dashboard/_dashboard_navigation_courses.html or dashboard-main.jsx

<div class="my-courses chalix-my-courses" id="my-courses">
  <LearningResultsFilter
    selectedStatus={selectedStatus}
    onStatusChange={handleStatusChange}
    selectedYear={selectedYear}
    onYearChange={handleYearChange}
  />
  
  {/* Your course/results listing below */}
  <ul class="listing-courses">
    {/* Course items */}
  </ul>
</div>
```

## Vietnamese Translation Keys

The component uses the following translation keys:

- `learningResults.filter.label.status` - "Lọc theo trạng thái"
- `learningResults.filter.label.year` - "Lọc theo năm"
- `learningResults.filter.status.all` - "Tất cả trạng thái"
- `learningResults.filter.status.enrolled` - "Đã ghi danh"
- `learningResults.filter.status.inProgress` - "Đang học"
- `learningResults.filter.status.failedExam` - "Thi thất bại"
- `learningResults.filter.status.success` - "Thành công"
- `learningResults.filter.year.all` - "Tất cả năm"
- `learningResults.filter.year.label` - "Năm {year}"

These keys are defined in:
- Source: `chalix-translations/translations/frontend-app-admin-portal/src/i18n/transifex_input.json`
- Vietnamese: `chalix-translations/translations/frontend-app-admin-portal/src/i18n/messages/vi.json`

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Performance Considerations

- The year options are computed dynamically on component render (minimal performance impact)
- Consider memoizing the callback functions if used in larger applications:

```jsx
const handleStatusChange = useCallback((status) => {
  setSelectedStatus(status);
  // dispatch or fetch logic
}, []);

const handleYearChange = useCallback((year) => {
  setSelectedYear(year);
  // dispatch or fetch logic
}, []);
```

## Testing Example

```jsx
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import LearningResultsFilter from './LearningResultsFilter';

describe('LearningResultsFilter', () => {
  it('calls onStatusChange when status dropdown changes', () => {
    const handleStatusChange = jest.fn();
    const handleYearChange = jest.fn();

    render(
      <LearningResultsFilter
        onStatusChange={handleStatusChange}
        onYearChange={handleYearChange}
      />
    );

    const statusSelect = screen.getByLabelText('Lọc theo trạng thái');
    fireEvent.change(statusSelect, { target: { value: 'success' } });

    expect(handleStatusChange).toHaveBeenCalledWith('success');
  });

  it('calls onYearChange when year dropdown changes', () => {
    const handleStatusChange = jest.fn();
    const handleYearChange = jest.fn();

    render(
      <LearningResultsFilter
        onStatusChange={handleStatusChange}
        onYearChange={handleYearChange}
      />
    );

    const yearSelect = screen.getByLabelText('Lọc theo năm');
    fireEvent.change(yearSelect, { target: { value: '2023' } });

    expect(handleYearChange).toHaveBeenCalledWith('2023');
  });
});
```

## File Structure

```
src/components/LearningResultsFilter/
├── LearningResultsFilter.jsx      # Main component
├── LearningResultsFilter.scss     # Styles
└── README.md                      # This file
```

## Related Components

- `ChalixHeaderWithUserPopup` - Main header component with user menu
- `UserPopup` - User dropdown menu

## Support

For issues or questions about this component, please contact the Alimento-Team or refer to the main repository documentation.
