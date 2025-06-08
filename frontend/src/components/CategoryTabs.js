import React from 'react';
import { Nav } from 'react-bootstrap';
import axios from 'axios';

const CategoryTabs = ({ categories, activeCategory, onCategoryChange }) => {
  return (
    <Nav variant="tabs" defaultActiveKey="all" className="mb-4">
      <Nav.Item>
        <Nav.Link 
          eventKey="all" 
          active={activeCategory === 'all'}
          onClick={() => onCategoryChange('all')}
        >
          All Products
        </Nav.Link>
      </Nav.Item>
      {categories.map(category => (
        <Nav.Item key={category}>
          <Nav.Link 
            eventKey={category} 
            active={activeCategory === category}
            onClick={() => onCategoryChange(category)}
          >
            {category}
          </Nav.Link>
        </Nav.Item>
      ))}
    </Nav>
  );
};

export default CategoryTabs;