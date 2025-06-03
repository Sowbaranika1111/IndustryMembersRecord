import React, { useState } from 'react';
import API from '../api';

const SearchBatchmate = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);

  const handleSearch = async () => {
    const res = await API.get(`/batchmates/search?name=${query}`);
    setResults(res.data);
  };

  return (
    <div>
      <h2>Search Batchmates</h2>
      <input
        type="text"
        placeholder="Enter name"
        value={query}
        onChange={e => setQuery(e.target.value)}
      />
      <button onClick={handleSearch}>Search</button>

      <ul>
        {results.map(b => (
          <li key={b._id}>{b.name} — {b.primarySkill}</li>
        ))}
      </ul>
    </div>
  );
};

export default SearchBatchmate;
