import React, { useState } from 'react';
import { Form, InputGroup, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const SearchComponent = ({ onClose, searchSource = 'header' }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    performSearch();
  };

  const performSearch = () => {
    const trimmedSearch = searchTerm.trim();
    if (trimmedSearch) {
      trackEvent('search_query', {
        query: trimmedSearch,
        source: searchSource,
        timestamp: new Date().toISOString()
      });
      
      navigate(`/search?query=${encodeURIComponent(trimmedSearch)}`);
      if (onClose) onClose();
    }
  };

  return (
    <div style={{ position: 'relative', width: '100%' }}>
      <Form onSubmit={handleSearchSubmit}>
        <InputGroup>
          <Form.Control
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            autoFocus
            data-track="search_input"
          />
          <Button
            variant="primary"
            onClick={performSearch}
            data-track="search_submit"
          >
            Search
          </Button>
          {onClose && (
            <Button variant="link" onClick={onClose} style={{ marginLeft: '8px' }}>
              ✖
            </Button>
          )}
        </InputGroup>
      </Form>
    </div>
  );
};

export default SearchComponent;