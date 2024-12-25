import React, { useState, useEffect } from 'react';
import { Typography, TextField, Button, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { CSSTransition } from 'react-transition-group';
import Content from '../../../Components/Dashboard/Content/Content';
import { GET_ALL_FAQ_DATA, Delete_faq } from '../../../ReduxStore/Slice/Superadmin/ApiCreateInfoSlice';

import AddFaqModal from './Addfaq';
import { useDispatch } from 'react-redux';

const FaqAccordion = () => {
    const dispatch = useDispatch();
    const [expandedIndex, setExpandedIndex] = useState(-1);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterOption, setFilterOption] = useState('all'); // Default filter option
    const [roleOption, setRoleOption] = useState('ALL'); // Default role option
    const [addModalOpen, setAddModalOpen] = useState(false);
    const [faqData, setFaqData] = useState([]);
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [editModalData, setEditModalData] = useState({});

    // Function to fetch FAQs
    const fetchFaqData = async () => {
        try {
            const response = await dispatch(GET_ALL_FAQ_DATA({})).unwrap();
            if (response.status) {
                setFaqData(response.data);
            }
        } catch (error) {
            console.error('Failed to fetch FAQ data:', error);
        }
    };

    const deleteFaq = async (faqId) => {
        try {
            const response = await dispatch(Delete_faq({ faqId })).unwrap();
            if (response.status) {
                fetchFaqData(); // Refresh FAQ list
            }
        } catch (error) {
            console.error('Failed to delete FAQ:', error);
        }
    };

    useEffect(() => {
        fetchFaqData();
    }, []);

    const toggleAccordion = (index) => {
        setExpandedIndex((prevIndex) => (prevIndex === index ? -1 : index));
    };

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };

    const openEditModal = (faq) => {
        setEditModalData(faq);
        setEditModalOpen(true);
    };

    const filteredFaqs = faqData.filter((faq) => {
        const matchesSearch = faq.question.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilter = filterOption === 'all' || filterOption === faq.type;
        const matchesRole = roleOption === 'ALL' || roleOption === faq.Role;

        return matchesSearch && matchesFilter && matchesRole;
    });

    return (
        <Content Page_title="Frequently Asked Questions" Filter_tab button_status={false}>
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
                <FormControl variant="outlined" style={{ minWidth: 200, marginRight: '1rem' }}>
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
                <FormControl variant="outlined" style={{ minWidth: 200, marginRight: '1rem' }}>
                    <InputLabel id="role-label">Role</InputLabel>
                    <Select
                        labelId="role-label"
                        id="role-select"
                        value={roleOption}
                        onChange={(e) => setRoleOption(e.target.value)}
                        label="Role"
                    >
                        <MenuItem value="ALL">ALL</MenuItem>
                        <MenuItem value="ADMIN">ADMIN</MenuItem>
                        <MenuItem value="EMPLOYEE">EMPLOYEE</MenuItem>
                        <MenuItem value="USER">USER</MenuItem>
                    </Select>
                </FormControl>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={() => setAddModalOpen(true)}
                >
                    Add FAQ
                </Button>
            </div>
            <div
                style={{
                    backgroundColor: '#fff',
                    boxShadow: '0px 60px 56px -12px rgba(9, 40, 163, 0.05)',
                    borderRadius: '2.5rem',
                    width: '100%',
                    maxWidth: '75rem',
                    padding: '3rem',
                    margin: 'auto',
                    marginTop: '0rem',
                }}
            >
                {filteredFaqs.length === 0 ? (
                    <Typography variant="body1">No FAQs found.</Typography>
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
                                <div>
                                    <Button
                                        variant="outlined"
                                        color="primary"
                                        onClick={() => openEditModal(faq)}
                                        style={{ marginRight: '1rem' }}
                                    >
                                        Edit
                                    </Button>
                                    <Button
                                        variant="outlined"
                                        color="secondary"
                                        onClick={() => {
                                            if (window.confirm('Are you sure you want to delete this FAQ?')) {
                                                deleteFaq(faq._id);
                                            }
                                        }}
                                    >
                                        Delete
                                    </Button>
                                </div>
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
                                        height: expandedIndex === index ? 'auto' : '0',
                                        transition: 'height 0.4s ease-in-out',
                                    }}
                                >
                                    <Typography style={{ padding: '2rem 0' }}>{faq.answer}</Typography>
                                    {faq.img1 && (
                                        <div style={{ marginTop: '1rem' }}>
                                            <img src={faq.img1} alt="FAQ" style={{ maxWidth: '100%', height: 'auto' }} />
                                        </div>
                                    )}
                                </div>
                            </CSSTransition>
                        </div>
                    ))
                )}
            </div>
            <AddFaqModal open={addModalOpen} onClose={() => setAddModalOpen(false)} mode="add" />
            <AddFaqModal
                open={editModalOpen}
                onClose={() => setEditModalOpen(false)}
                mode="edit"
                initialValues={editModalData}
            />
        </Content>
    );
};

export default FaqAccordion;
