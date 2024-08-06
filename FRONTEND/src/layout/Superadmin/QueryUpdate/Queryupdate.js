import React, { useEffect,useState } from 'react';
import Content from "../../../Components/Dashboard/Content/Content";
import { UPDATE_QUERY_PANEL} from '../../../ReduxStore/Slice/Superadmin/SuperAdminSlice'
import { useDispatch } from 'react-redux';

// Styles
const cardContainerStyle = {
    display: 'flex',
    justifyContent: 'space-around',  // Adjusted to create space between the cards
    alignItems: 'center',
    flexDirection: 'row',  // Adjusted to align the cards horizontally
};

const cardStyle = {
    border: '1px solid #ccc',
    borderRadius: '8px',
    padding: '20px',
    width: '300px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    margin: '0 10px 20px',
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

const addButtonStyle = {
    padding: '10px',
    background: '#008CBA',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    marginTop: '10px',
};

const submitButtonStyle = {
    padding: '10px',
    background: '#4CAF50',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    marginTop: '10px',
};

const QueryUpdate = () => {
    // const [data, setData] = useState([{}]);
    // const [loading1, setLoading1] = useState(false);
    // const [error1, setError1] = useState(null);
    // const [collectionName1, setCollectionName1] = useState('');

    // const [loading2, setLoading2] = useState(false);
    // const [error2, setError2] = useState(null);
    // const [collectionName2, setCollectionName2] = useState('');
    // const [getPipeline, setPipeline] = useState('');
    // const [getViewName, setViewName] = useState('');

    // const [refresh, setrefresh] = useState(false);


    // const dispatch = useDispatch();


    // const handleAddInput = (setData) => {
    //     setData([...data, {}]);
    // };

    // const handleInputChange = (index, inputType, value, setData) => {
    //     const newData = [...data];
    //     newData[index][inputType] = value;
    //     setData(newData);
    // };

    // const handleQuerySubmit = async (setData, setLoading, setError, collectionName) => {
    //     setLoading(true);
    //     setError(null);

    //     function arrayToObject(array) {
    //         return array.reduce((obj, item) => {
    //             obj[item.key] = item.value;
    //             return obj;
    //         }, {});
    //     }

    //     const convertedObject = arrayToObject(data);


    //     try {
            
    //         if (collectionName == "") {
    //             alert("Please Enter Collection Name")
    //             return
    //         }
    //         if (convertedObject == "") {
    //             alert("Please Enter query")
    //             return
    //         }



    //         let data = {
    //             "collection_name": collectionName,
    //             "query": convertedObject
    //         }


    //             await dispatch(UPDATE_QUERY_PANEL(data)).unwrap()
    //                 .then((response) => {
    //                     if(response.status){
                            
    //                         setrefresh(!refresh)
    //                     }else{
                            
    //                     }
    //                 })
            


    //        } catch (error) {
    //         setError('An error occurred while updating the data.');
   
    //     } finally {
    //         setLoading(false);
    //     }
    // };

    // const createView = () => {
    
    //     alert("Create View =>")
    // }


    // useEffect(() => {
        
    // }, [refresh])




    return (
        <Content Page_title="Query Update">
            {/* <div style={cardContainerStyle}> */}
                {/* <div className='card1' style={cardStyle}>

                    <h2 style={titleStyle}>Collection Update</h2>
                    <label>Collection Name</label>
                    <input
                        type="text"
                        style={largerInputStyle}
                        placeholder="Enter Collection Name..."
                        value={collectionName1 || ''}
                        onChange={(e) => setCollectionName1(e.target.value)}
                    />
                    {data.map((item, i) => (
                        <div key={i}>
                            <h6 style={titleStyle}>Query {i + 1}</h6>
                            <div key={i}>
                                <input
                                    type="text"
                                    style={largerInputStyle}
                                    placeholder={`Enter key`}
                                    value={item.key || ''}
                                    onChange={(e) => handleInputChange(i, 'key', e.target.value, setData)}
                                />
                                <input
                                    type="text"
                                    style={largerInputStyle}
                                    placeholder={`Enter value`}
                                    value={item.value || ''}
                                    onChange={(e) => handleInputChange(i, 'value', e.target.value, setData)}
                                />
                            </div>
                        </div>
                    ))}
                    <button style={addButtonStyle} onClick={() => handleAddInput(setData)}>
                        Add Pair
                    </button>
                    <button style={submitButtonStyle} onClick={() => handleQuerySubmit(setData, setLoading1, setError1, collectionName1)} disabled={loading1}>
                        {loading1 ? 'Submitting...' : 'Submit'}
                    </button>
                    {error1 && <div style={{ color: 'red', textAlign: 'center' }}>{error1}</div>}
                </div> */}

                {/* <div className='card2' style={cardStyle}>

                    <h2 style={titleStyle}>View Create</h2>
                    <label>View Name</label>
                    <input
                        type="text"
                        style={largerInputStyle}
                        placeholder="Enter View Name..."
                        value={getViewName || ''}
                        onChange={(e) => setViewName(e.target.value)}
                    />
                    <label>Collection Name</label>
                    <input
                        type="text"
                        style={largerInputStyle}
                        placeholder="Enter Collection Name..."
                        value={collectionName2 || ''}
                        onChange={(e) => setCollectionName2(e.target.value)}
                    />
                    <label>Pipeline</label>
                    <input
                        type="text"
                        style={largerInputStyle}
                        placeholder="Enter Pipeline..."
                        value={getPipeline || ''}
                        onChange={(e) => setPipeline(e.target.value)}
                    />
                    <button style={submitButtonStyle} onClick={() => createView()} disabled={loading2}>
                        {loading2 ? 'Submitting...' : 'Submit'}
                    </button>
                    {error2 && <div style={{ color: 'red', textAlign: 'center' }}>{error2}</div>}
                </div> */}
            {/* </div> */}
        </Content>
    );
};

export default QueryUpdate;
