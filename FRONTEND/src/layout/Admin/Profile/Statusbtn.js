import React from 'react';

const StatusButton = ({ status,type }) => {
  // Define styles for each status


  const getStatusStyle = () => {
  
  if(type == 1){
    switch (status) {
      case '0':
        return { backgroundColor: 'orange', color: 'white' };
      case '1':
        return { backgroundColor: 'blue', color: 'white' };
      case '2':
        return { backgroundColor: 'green', color: 'white' };
      default:
        return { backgroundColor: 'grey', color: 'white' };
    }
  }else{
    switch (status) {
      case '0':
        return { backgroundColor: 'orange', color: 'white' };
      case '1':
        return { backgroundColor: 'red', color: 'white' };
      case '2':
        return { backgroundColor: 'green', color: 'white' };
      default:
        return { backgroundColor: 'grey', color: 'white' };
    }
  }
  };

  return (
    <button style={{ ...getStatusStyle(), border: 'none', padding: '10px 20px', borderRadius: '5px', cursor: 'pointer' }}>
      { type == 1 ? status == 0 ? "Panding" : status == 1 ?"In Progress" : status == 2 ? "Successfully" :"-":status == 0 ? "Panding" : status == 1 ?"Reject" : status == 2 ? "Successfully" :"-"}
    </button>
  );
};

export default StatusButton;
