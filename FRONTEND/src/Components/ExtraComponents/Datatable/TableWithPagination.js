import React, { useState, useEffect } from 'react';

const CustomTable = ({ data, itemsPerPage }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const maxPage = Math.ceil(data.length / itemsPerPage);

  useEffect(() => {
    setCurrentPage(1);
  }, [data]);

  const handleClick = (page) => {
    if (page < 1) {
      page = 1;
    } else if (page > maxPage) {
      page = maxPage;
    }
    setCurrentPage(page);
  };

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = data.slice(startIndex, endIndex);

  // Calculate the range of page numbers to display
  const pageRange = 5;
  const rangeStart = Math.max(1, currentPage - Math.floor(pageRange / 2));
  const rangeEnd = Math.min(maxPage, rangeStart + pageRange - 1);

  return (
    <div>
      <table className="table table-striped">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
          </tr>
        </thead>
        <tbody>
          {currentData.map((item, index) => (
            <tr key={index}>
              <td>{item.trade_symbol}</td>
              <td>{item.type}</td>
              <td>{item.type}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <nav>
        <ul className="pagination">
          <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
            <button className="page-link" onClick={() => handleClick(1)}>
              First
            </button>
          </li>
          <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
            <button className="page-link" onClick={() => handleClick(currentPage - 1)}>
              Previous
            </button>
          </li>
          {Array.from({ length: rangeEnd - rangeStart + 1 }, (_, i) => (
            <li
              key={rangeStart + i}
              className={`page-item ${currentPage === rangeStart + i ? 'active' : ''}`}
            >
              <button
                className="page-link"
                onClick={() => handleClick(rangeStart + i)}
              >
                {rangeStart + i}
              </button>
            </li>

          ))
          }
          <li className={`page-item ${currentPage === maxPage ? 'disabled' : ''}`}>
            <button className="page-link" onClick={() => handleClick(currentPage + 1)}>
              Next
            </button>
          </li>
          <li className={`page-item ${currentPage === maxPage ? 'disabled' : ''}`}>
            <button className="page-link" onClick={() => handleClick(maxPage)}>
              Last
            </button>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default CustomTable;
