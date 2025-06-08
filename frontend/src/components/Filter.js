import React from 'react';
import { Dropdown } from 'react-bootstrap';
import { FaFilter } from 'react-icons/fa';

const FilterComponent = ({ sortOption, onSortChange }) => {
  const sortOptions = [
    { value: 'default', label: 'Default' },
    { value: 'price-high-low', label: 'Price: High to Low' },
    { value: 'price-low-high', label: 'Price: Low to High' },
    { value: 'rating-high', label: 'Highest Rating' },
    { value: 'newest', label: 'Newest' }
  ];

  return (
    <div className="d-flex justify-content-end mb-3">
      <Dropdown>
        <Dropdown.Toggle variant="outline-secondary" id="dropdown-sort">
          <FaFilter className="me-2" />
          {sortOptions.find(opt => opt.value === sortOption)?.label || 'Sort By'}
        </Dropdown.Toggle>
        <Dropdown.Menu>
          {sortOptions.map((option) => (
            <Dropdown.Item 
              key={option.value}
              active={sortOption === option.value}
              onClick={() => onSortChange(option.value)}
            >
              {option.label}
            </Dropdown.Item>
          ))}
        </Dropdown.Menu>
      </Dropdown>
    </div>
  );
};

export default FilterComponent;