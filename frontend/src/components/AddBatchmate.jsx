import React, { useState } from 'react';
import API from '../api';
import { useNavigate } from 'react-router-dom';

const AddBatchmate = () => {
  const [formData, setFormData] = useState({ name: '', primarySkill: '' });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await API.post('/batchmates', formData);
    navigate('/');
  };

  return (
    <div>
      <h2>Add Batchmate</h2>
      <form onSubmit={handleSubmit}>
        <input
          name="name"
          placeholder="Name"
          value={formData.name}
          onChange={handleChange}
          required
        />
        <input
          name="primarySkill"
          placeholder="Primary Skill"
          value={formData.primarySkill}
          onChange={handleChange}
          required
        />
        <button type="submit">Add</button>
      </form>
    </div>
  );
};

export default AddBatchmate;
