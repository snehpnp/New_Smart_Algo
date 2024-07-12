import React, { useState } from 'react';
import {
    Typography,
    TextField,
    Button,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
} from '@mui/material';
import { CSSTransition } from 'react-transition-group';
import Content from '../../../Components/Dashboard/Content/Content';
import { faqData } from './Daqdata'; // Assuming faqData is imported from Daqdata.js

const FaqAccordion = () => {
    const [expandedIndex, setExpandedIndex] = useState(-1);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterOption, setFilterOption] = useState('all'); // Default filter option
    const [brokerOption, setBrokerOption] = useState('');

    const toggleAccordion = (index) => {
        setExpandedIndex((prevIndex) =>
            prevIndex === index ? -1 : index
        );
    };

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };

    const handleFilterChange = (event) => {
        const value = event.target.value;
        setFilterOption(value);
        // Reset brokerOption when filter changes
        setBrokerOption('');
    };

    const handleBrokerChange = (event) => {
        setBrokerOption(event.target.value);
    };

    const filteredFaqs = faqData.filter((faq) => {
        // Filter by search term
        const matchesSearch = faq.question
            .toLowerCase()
            .includes(searchTerm.toLowerCase());

        // Filter by selected option
        if (filterOption === 'all') {
            return matchesSearch;
        } else if (filterOption === 'trade') {
            return (
                matchesSearch &&
                faq.answer
                    .toLowerCase()
                    .includes('trade') // Example condition for 'Trade Issue FAQs'
            );
        } else {
            return false;
        }
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
                        onChange={handleFilterChange}
                        label="Filter By"
                    >
                        <MenuItem value="all">All FAQs</MenuItem>
                        <MenuItem value="software">Software FAQs</MenuItem>
                        <MenuItem value="mt4">MT-4 FAQs</MenuItem>
                        <MenuItem value="api">Api Login With Broker FAQs</MenuItem>
                        <MenuItem value="trade">Trade Issue FAQs</MenuItem>
                    </Select>
                </FormControl>
                {filterOption === 'trade' && (
                    <FormControl
                        variant="outlined"
                        style={{ minWidth: 200 }}
                    >
                        <InputLabel id="broker-label">Select Broker</InputLabel>
                        <Select
                            labelId="broker-label"
                            id="broker-select"
                            value={brokerOption}
                            onChange={handleBrokerChange}
                            label="Select Broker"
                        >
                            <MenuItem value="broker1">Broker 1</MenuItem>
                            <MenuItem value="broker2">Broker 2</MenuItem>
                            <MenuItem value="broker3">Broker 3</MenuItem>
                        </Select>
                    </FormControl>
                )}
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
                                        className={`ri ${
                                            expandedIndex === index
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
                                    {faq.image && (
                                        <div style={{ marginTop: '1rem' }}>
                                            <img
                                                src={faq.image}
                                                alt="FAQ Image"
                                                style={{
                                                    maxWidth: '100%',
                                                    height: 'auto',
                                                }}
                                            />
                                        </div>
                                    )}
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
