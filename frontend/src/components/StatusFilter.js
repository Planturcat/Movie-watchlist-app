import React from 'react';

const StatusFilter = ({ currentFilter, onFilterChange }) => {
const filters = [
{ key: 'all', label: 'All Movies' },
{ key: 'unwatched', label: 'Unwatched' },
{ key: 'watched', label: 'Watched' },
];
return (
<div className="status-filter">
<span className="filter-label">Filter by status:</span>
<div className="filter-buttons">
{filters.map(filter => (
<button
key={filter.key}
onClick={() => onFilterChange(filter.key)}
className={`filter-button ${currentFilter === filter.key ? 'active' : ''}`}
>
{filter.label}
</button>
))}
</div>
</div>
);
};
export default StatusFilter;