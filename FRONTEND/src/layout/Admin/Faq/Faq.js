import React, { useState, useEffect } from 'react';
import { Typography, TextField, Button, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { CSSTransition } from 'react-transition-group';
import Content from '../../../Components/Dashboard/Content/Content';
import { GET_ALL_FAQ_DATA } from '../../../ReduxStore/Slice/Superadmin/ApiCreateInfoSlice';

import { useDispatch } from "react-redux";
const FaqAccordion = () => {
    const dispatch = useDispatch()
    const [expandedIndex, setExpandedIndex] = useState(-1);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterOption, setFilterOption] = useState('all'); // Default filter option
    const [brokerOption, setBrokerOption] = useState('');
    const [faqData, SetfaqData] = useState([]);


    const GetFaqData = async (id) => {
        await dispatch(GET_ALL_FAQ_DATA({})).unwrap()
            .then((response) => {
                if (response.status) {
                    SetfaqData(response.data)
                }
                else {
                }
            }).catch((err) => {
                return;
            })


    }
    useEffect(() => {
        GetFaqData()
    }, []);

    const toggleAccordion = (index) => {
        setExpandedIndex((prevIndex) =>
            prevIndex === index ? -1 : index
        );
    };

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };




    const filteredFaqs = faqData.filter((faq) => {
        const matchesSearch = faq.question.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilter = filterOption === 'all' || filterOption === faq.type;

        return matchesSearch && matchesFilter;
    });




    return (
        <Content
            Page_title={'Frequently Asked Questions'}
            Filter_tab={true}
            button_status={false}
        >
            <div
                style={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    marginBottom: '1rem',
                    alignItems: 'center',
                }}
            >
                <div style={{ flexGrow: 1, marginRight: '1rem' }}>
                    <TextField
                        label="Search FAQ"
                        variant="outlined"
                        value={searchTerm}
                        onChange={handleSearchChange}
                        fullWidth
                    />
                </div>
                <FormControl
                    variant="outlined"
                    style={{ minWidth: 200, marginRight: '1rem' }}
                >
                    <InputLabel id="filter-label">Filter By</InputLabel>
                    <Select
                        labelId="filter-label"
                        id="filter-select"
                        value={filterOption}
                        onChange={(e) => setFilterOption(e.target.value)}
                        label="Filter By"
                    >
                        <MenuItem value="all">All FAQs</MenuItem>
                        <MenuItem value="software">Software FAQs</MenuItem>
                        <MenuItem value="mt4">MT-4 FAQs</MenuItem>
                        <MenuItem value="api">Api Login With Broker FAQs</MenuItem>
                        <MenuItem value="trade">Trade Issue FAQs</MenuItem>
                    </Select>
                </FormControl>

            </div>

            <div
                style={{
                    backgroundColor: '#fff',
                    boxShadow:
                        '0px 60px 56px -12px rgba(9, 40, 163, 0.05)',
                    borderRadius: '2.5rem',
                    width: '100%',
                    maxWidth: '75rem',
                    padding: '3rem',
                    margin: 'auto',
                    marginTop: '0rem',
                }}
            >
                {filteredFaqs.length === 0 ? (
                    <Typography variant="body1">
                        No FAQs found.
                    </Typography>
                ) : (
                    filteredFaqs.map((faq, index) => (
                        <div
                            key={index}
                            className="accordion"
                            style={{
                                borderBottom: '0.1rem solid #dae1f5',
                                paddingBottom: '2rem',
                                marginBottom: '3rem',
                            }}
                        >
                            <div
                                className="accordion__header"
                                style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    cursor: 'pointer',
                                }}
                                onClick={() => toggleAccordion(index)}
                            >
                                <Typography
                                    variant="h2"
                                    style={{
                                        fontSize: '1.6rem',
                                        fontWeight: '500',
                                        color: '#242e4c',
                                    }}
                                >
                                    {faq.question}
                                </Typography>
                                <span
                                    className="accordion__icon"
                                    style={{
                                        backgroundColor: '#FF4B4B',
                                        width: '2.2rem',
                                        height: '2.2rem',
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        borderRadius: '50%',
                                        color: '#fff',
                                        flexShrink: 0,
                                    }}
                                >
                                    <i
                                        className={`ri ${expandedIndex === index
                                            ? 'ri-subtract-line'
                                            : 'ri-add-line'
                                            }`}
                                    >
                                        +
                                    </i>
                                </span>
                            </div>
                            <CSSTransition
                                in={expandedIndex === index}
                                timeout={300}
                                classNames="accordion__content"
                                unmountOnExit
                            >
                                <div
                                    className="accordion__content"
                                    style={{
                                        overflow: 'hidden',
                                        height:
                                            expandedIndex === index
                                                ? 'auto'
                                                : '0',
                                        transition:
                                            'height 0.4s ease-in-out',
                                    }}
                                >
                                    <Typography
                                        style={{
                                            padding: '2rem 0',
                                        }}
                                    >
                                        {faq.answer}
                                    </Typography>


                                    {faq.answer1 && (<Typography
                                        style={{
                                            padding: '2rem 0',
                                        }}
                                    >
                                        {faq.answer1}
                                    </Typography>)}

                                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                                        {faq.img1 && (
                                            <div style={{ marginTop: '1rem' }}>
                                                <img
                                                    src={faq.img1}
                                                    alt="FAQ Image"
                                                    style={{
                                                        maxWidth: '100%',
                                                        height: 'auto',
                                                    }}
                                                />
                                            </div>
                                        )}


                                        {faq.img2 && (
                                            <div style={{ marginTop: '1rem' }}>
                                                <img
                                                    src={faq.img2}
                                                    alt="FAQ Image"
                                                    style={{
                                                        maxWidth: '100%',
                                                        height: 'auto',
                                                    }}
                                                />
                                            </div>
                                        )}
                                    </div>


                                </div>
                            </CSSTransition>
                        </div>
                    ))
                )}
            </div>
        </Content>
    );
};

export default FaqAccordion;
