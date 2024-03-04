import React, { useState } from 'react';
import Content from "../../../Components/Dashboard/Content/Content";
import Loader from '../../../Utils/Loader';

const QueryUpdate = () => {
  const [collectionName1, setCollectionName1] = useState('');
  const [queryName1, setQueryName1] = useState('');
  const [collectionName2, setCollectionName2] = useState('');
  const [queryName2, setQueryName2] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleQuerySubmit = async (collectionName, queryName) => {
    setLoading(true);
    setError(null);

    try {
      // Simulating API call to update data
      await dummyApiUpdate(collectionName, queryName);
      console.log(`Dummy API Update for Collection: ${collectionName}, Query: ${queryName}`);
    } catch (error) {
      setError('An error occurred while updating the data.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const dummyApiUpdate = (collectionName, queryName) => {
    // Simulating API call to update data
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Simulating success
        resolve();
        // Simulating an error
        // reject(new Error('API call failed'));
      }, 1000);
    });
  };

  return (
    <Content Page_title="Query Update">
      <div>
        <div style={cardContainerStyle}>
          <div style={cardStyle}>
            <h2 style={titleStyle}>Collection Update</h2>
            <input
              type="text"
              style={largerInputStyle}
              placeholder="Enter Collection Name..."
              value={collectionName1}
              onChange={(e) => setCollectionName1(e.target.value)}
            />
            <input
              type="text"
              style={largerInputStyle}
              placeholder="Enter Query Name..."
              value={queryName1}
              onChange={(e) => setQueryName1(e.target.value)}
            />
            <button
              style={submitButtonStyle}
              onClick={() => handleQuerySubmit(collectionName1, queryName1)}
              disabled={loading}
            >
              {loading ? 'Submitting...' : 'Submit'}
            </button>
          </div>

          <div style={cardStyle}>
            <h2 style={titleStyle}>Collection Create</h2>
            <input
              type="text"
              style={largerInputStyle}
              placeholder="Enter Collection Name..."
              value={collectionName2}
              onChange={(e) => setCollectionName2(e.target.value)}
            />
            <input
              type="text"
              style={largerInputStyle}
              placeholder="Enter Query Name..."
              value={queryName2}
              onChange={(e) => setQueryName2(e.target.value)}
            />
            <button
              style={submitButtonStyle}
              onClick={() => handleQuerySubmit(collectionName2, queryName2)}
              disabled={loading}
            >
              {loading ? 'Submitting...' : 'Submit'}
            </button>
          </div>
        </div>
        {error && <div style={{ color: 'red', textAlign: 'center' }}>{error}</div>}
      </div>
    </Content>
  );
};

// Remaining styles with some adjustments
const cardContainerStyle = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  height: '50vh',
};

const cardStyle = {
  display: 'inline-block',
  border: '1px solid #ccc',
  borderRadius: '8px',
  padding: '20px',
  width: '300px',
  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  margin: '0 10px',
};

const titleStyle = {
  marginBottom: '10px',
};

const largerInputStyle = {
  width: '100%',
  padding: '12px',
  boxSizing: 'border-box',
  marginBottom: '10px',
};

const submitButtonStyle = {
  width: '100%',
  padding: '10px',
  background: '#4CAF50',
  color: 'white',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer',
};

export default QueryUpdate;
