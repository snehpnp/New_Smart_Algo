import React, { useState } from "react";

const DataTable = () => {
    // Initial data state
    const [data, setData] = useState([
        { id: 1, name: "Item 1", isChecked: false },
        { id: 2, name: "Item 2", isChecked: false },
        { id: 3, name: "Item 3", isChecked: false },
        { id: 4, name: "Item 4", isChecked: false },
        { id: 5, name: "Item 5", isChecked: false },
        { id: 6, name: "Item 6", isChecked: false },
        { id: 7, name: "Item 7", isChecked: false },
        { id: 8, name: "Item 8", isChecked: false },
        { id: 9, name: "Item 9", isChecked: false },
        { id: 10, name: "Item 10", isChecked: false },


        // aur bhi data yahan add kar sakte hain
    ]);

    // Checkbox toggle function
    const handleCheckboxChange = (id) => {
        // Update the `isChecked` status for the selected row
        const updatedData = data.map((item) =>
            item.id === id ? { ...item, isChecked: !item.isChecked } : item
        );

        // Checked rows ko upar le aane ke liye data ko reorder karen
        const sortedData = [
            ...updatedData.filter((item) => item.isChecked),  // Checked rows
            ...updatedData.filter((item) => !item.isChecked), // Unchecked rows
        ];

        setData(sortedData);
    };

    return (
        <div>
        <div className="content-body">
          <div className="container-fluid">
        <table>
            <thead>
                <tr>
                    <th>Checkbox</th>
                    <th>Item Name</th>
                </tr>
            </thead>
            <tbody>
                {data.map((item) => (
                    <tr key={item.id}>
                        <td>
                            <input
                                type="checkbox"
                                checked={item.isChecked}
                                onChange={() => handleCheckboxChange(item.id)}
                            />
                        </td>
                        <td>{item.name}</td>
                    </tr>
                ))}
            </tbody>
        </table>
        </div>
        </div>
        </div>
    );
};

export default DataTable;
