import React, { useEffect, useState } from 'react';
import API from '../api.jsx';
import { useParams, useNavigate } from 'react-router-dom';

const EditBatchmate = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: '', primarySkill: '' });

  useEffect(() => {
    API.get('/batchmates')
      .then(res => {
        const found = res.data.find(b => b._id === id);
        if (found) setFormData(found);
      });
  }, [id]);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await API.put(`/batchmates/${id}`, formData);
    navigate('/');
  };

  return (
    <div>
      <h2>Edit Batchmate</h2>
      <form onSubmit={handleSubmit}>
        <input
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
        />
        <input
          name="primarySkill"
          value={formData.primarySkill}
          onChange={handleChange}
          required
        />
        <button type="submit">Save</button>
      </form>
    </div>
  );
};

export default EditBatchmate;
