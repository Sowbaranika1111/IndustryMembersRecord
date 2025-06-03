import React, { useEffect, useState } from 'react';
import API from '../api';
import { Link } from 'react-router-dom';

const Home = () => {
  const [batchmates, setBatchmates] = useState([]);

  useEffect(() => {
    API.get('/batchmates')
      .then(res => setBatchmates(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div>
      <h2>All Batchmates</h2>
      <ul>
        {batchmates.map(b => (
          <li key={b._id}>
            {b.name} — {b.primarySkill}
            {' '}| <Link to={`/edit/${b._id}`}>Edit</Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Home;
