import styled from "styled-components";
import { FaRupeeSign, FaEye, FaEdit } from "react-icons/fa";
import Content from "../../../../Components/Dashboard/Content/Content";
import ToastButton from "../../../../Components/ExtraComponents/Alert_Toast";
import { useState } from "react";

import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import {
  Get_All_Plans,
  Edit_Plans,
} from "../../../../ReduxStore/Slice/Admin/GroupServiceSlice";

import { DeletePlan } from "../../../../ReduxStore/Slice/Admin/userSlice";

import Swal from "sweetalert2";

// Styled Components
const Card = styled.div`
  border: 1px solid #ccc;
  border-radius: 10px;
  width: 300px; /* Reduced width for better horizontal scrolling */
  padding: 15px;y
  background-color: #fff;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  text-align: center;
  transition: transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out,
    background-color 0.3s ease-in-out, color 0.3s ease-in-out;
  cursor: pointer;
  position: relative;
  overflow: hidden;

  &:hover {
    background-color: #5f30e2;
    color: #fff;
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.2);
  }

  &:hover h2,
  &:hover h4,
  &:hover p {
    color: #fff;
  }
`;

const Modal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: #fff;
  border-radius: 8px;
  width: 600px;
  padding: 20px;
  position: relative;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  display: grid;
  gap: 20px;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  background: none;
  border: none;
  font-size: 20px;
  color: #333;
  cursor: pointer;
  &:hover {
    color: #e74c3c;
  }
`;

const Heading = styled.h2`
  grid-column: span 2;
  margin: 0;
  padding-bottom: 15px;
  border-bottom: 2px solid #f0f0f0;
  font-size: 1.5em;
  color: #333;
`;

const FieldContainer = styled.div`
  margin-bottom: 15px;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
  color: #555;
`;

const Input = styled.input`
  width: 100%;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-sizing: border-box;
`;

const Textarea = styled.textarea`
  width: 100%;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-sizing: border-box;
`;

const Button = styled.button`
  padding: 10px 15px;
  font-size: 1rem;
  color: #fff;
  background-color: ${(props) => (props.primary ? "#007BFF" : "#28a745")};
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin: 5px;
  transition: background-color 0.3s ease-in-out;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background-color: ${(props) => (props.primary ? "#0056b3" : "#218838")};
  }

  svg {
    margin-right: 5px;
  }
`;
const ServicesList = () => {
  const dispatch = useDispatch();

  const [selectedPlan, setSelectedPlan] = useState(null);
  const [editPlan, setEditPlan] = useState(null);
  const [GetAllPlans, setAllPlans] = useState({ loading: true, data: [] });

  useEffect(() => {
    GetAllPlansData();
  }, []);

  const handleViewClick = (plan) => {
    setSelectedPlan(plan);
  };

  const handleEditClick = (plan) => {
    setEditPlan(plan);
  };

  const handleModalClose = () => {
    setSelectedPlan(null);
    setEditPlan(null);
  };

  const GetAllPlansData = async () => {
    await dispatch(Get_All_Plans())
      .unwrap()
      .then((response) => {
        if (response.status) {
          setAllPlans({
            loading: false,
            data: response.data,
          });
        }
      });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    dispatch(Edit_Plans(editPlan))
      .unwrap()
      .then((response) => {
        if (response.status) {
          GetAllPlansData();

          handleModalClose();
        }
      });
  };

  const DeletePlanApi = (plan) => {
    dispatch(DeletePlan({ req: { id: plan._id } }))
      .unwrap()
      .then((response) => {
        if (response.status) {
          Swal.fire({
            icon: "success",
            title: "Plan Deleted Successfully",
            showConfirmButton: false,
            timer: 1500,
          });
          GetAllPlansData();

          handleModalClose();
        } else {
          Swal.fire({
            icon: "error",
            title: response.msg,
            showConfirmButton: false,
            timer: 1500,
          });
        }
      });
  };

  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 10;

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = selectedPlan
    ? selectedPlan.users.slice(indexOfFirstUser, indexOfLastUser)
    : [];

  const totalPages = Math.ceil(
    (selectedPlan?.users.length || 0) / usersPerPage
  );

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  return (
    <>
      <Content
        Page_title="Plans"
        button_status={true}
        route="/admin/plan/add"
        button_title="Add Plan"
      >
        <div className="row" style={styles.container}>
          {GetAllPlans.data &&
            GetAllPlans.data.map((plan, index) => (
              <Card key={index} className="col-3">
                <img src={plan.image} alt={plan.name} style={styles.image} />
                <h2 style={styles.title}>{plan.name}</h2>
                <h4 style={styles.subtitle}>{plan.title}</h4>
                <p style={styles.description} title={plan.description}>
                  {plan.description}
                </p>

                <div style={styles.prices}>
                  <p style={styles.priceItem}>
                    Monthly <FaRupeeSign /> {plan.prices.monthly}
                  </p>
                  <p style={styles.priceItem}>
                    Quarterly <FaRupeeSign /> {plan.prices.quarterly}
                  </p>
                  <p style={styles.priceItem}>
                    Half-Yearly <FaRupeeSign /> {plan.prices.halfYearly}
                  </p>
                  <p style={styles.priceItem}>
                    Yearly <FaRupeeSign /> {plan.prices.yearly}
                  </p>
                </div>

                <div style={styles.buttonContainer}>
                  <Button primary onClick={() => handleViewClick(plan)}>
                    <FaEye /> View
                  </Button>
                  <Button onClick={() => handleEditClick(plan)}>
                    <FaEdit /> Edit
                  </Button>
                  <Button primary onClick={() => DeletePlanApi(plan)}>
                    {/*  Add Delete */}
                    Delete
                  </Button>
                </div>
              </Card>
            ))}
        </div>
      </Content>
      <ToastButton />

      {/* Modal for Full-Screen View */}
      {selectedPlan && (
        <Modal open={!!selectedPlan} onClick={handleModalClose}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <CloseButton onClick={handleModalClose}>×</CloseButton>
            <div>
              <div style={{ maxHeight: "450px", overflowY: "auto" }}>
                <table
                  className="table table-bordered"
                  style={{ width: "100%", borderCollapse: "collapse" }}
                >
                  <thead>
                    <tr>
                      <th
                        style={{
                          border: "1px solid #ddd",
                          padding: "8px",
                          color: "black",
                        }}
                      >
                        Id
                      </th>
                      <th
                        style={{
                          border: "1px solid #ddd",
                          padding: "8px",
                          color: "black",
                        }}
                      >
                        Plan Title
                      </th>
                    </tr>
                  </thead>
                 {currentUsers ? <tbody>
                    {currentUsers.map((user, index) => (
                      <tr key={index}>
                        <td
                          style={{ border: "1px solid #ddd", padding: "8px" }}
                        >
                          {indexOfFirstUser + index + 1}
                        </td>
                        <td
                          style={{ border: "1px solid #ddd", padding: "8px" }}
                        >
                          {user}
                        </td>
                      </tr>
                    ))}
                  </tbody> 
                :
                 
                  <tbody>
                    <tr>
                      <td 
                        colSpan="2"
                        style={{ border: "1px solid #ddd", padding: "8px" }}
                      >
                        No data available
                      </td>
                    </tr>
                  </tbody>

                }
                </table>
              </div>
              <div>
                <button onClick={handlePrev} disabled={currentPage === 1}>
                  Previous
                </button>
                <button
                  onClick={handleNext}
                  disabled={currentPage === totalPages}
                >
                  Next
                </button>
              </div>
            </div>
          </ModalContent>
        </Modal>
      )}

      {/* Modal for Editing Plan */}
      {editPlan && (
        <Modal open={!!editPlan} onClick={handleModalClose}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <CloseButton onClick={handleModalClose}>×</CloseButton>
            <Heading>Edit Plan</Heading>
            <div className="row">
              <FieldContainer className="col-lg-6">
                <Label htmlFor="name">Name:</Label>
                <Input
                  type="text"
                  id="name"
                  value={editPlan.name}
                  onChange={(e) =>
                    setEditPlan({ ...editPlan, name: e.target.value })
                  }
                />
              </FieldContainer>
              <FieldContainer className="col-lg-6">
                <Label htmlFor="title">Title:</Label>
                <Input
                  type="text"
                  id="title"
                  value={editPlan.title}
                  onChange={(e) =>
                    setEditPlan({ ...editPlan, title: e.target.value })
                  }
                />
              </FieldContainer>

              <FieldContainer className="col-lg-6">
                <Label htmlFor="monthly">Monthly Price:</Label>
                <Input
                  type="number"
                  id="monthly"
                  value={editPlan.prices.monthly}
                  onChange={(e) =>
                    setEditPlan({
                      ...editPlan,
                      prices: { ...editPlan.prices, monthly: e.target.value },
                    })
                  }
                />
              </FieldContainer>
              <FieldContainer className="col-lg-6">
                <Label htmlFor="quarterly">Quarterly Price:</Label>
                <Input
                  type="number"
                  id="quarterly"
                  value={editPlan.prices.quarterly}
                  onChange={(e) =>
                    setEditPlan({
                      ...editPlan,
                      prices: { ...editPlan.prices, quarterly: e.target.value },
                    })
                  }
                />
              </FieldContainer>
              <FieldContainer className="col-lg-6">
                <Label htmlFor="halfYearly">Half-Yearly Price:</Label>
                <Input
                  type="number"
                  id="halfYearly"
                  value={editPlan.prices.halfYearly}
                  onChange={(e) =>
                    setEditPlan({
                      ...editPlan,
                      prices: {
                        ...editPlan.prices,
                        halfYearly: e.target.value,
                      },
                    })
                  }
                />
              </FieldContainer>
              <FieldContainer className="col-lg-6">
                <Label htmlFor="yearly">Yearly Price:</Label>
                <Input
                  type="number"
                  id="yearly"
                  value={editPlan.prices.yearly}
                  onChange={(e) =>
                    setEditPlan({
                      ...editPlan,
                      prices: { ...editPlan.prices, yearly: e.target.value },
                    })
                  }
                />
              </FieldContainer>

              <FieldContainer className="col-lg-12">
                <Label htmlFor="description">Description:</Label>
                <Textarea
                  id="description"
                  value={editPlan.description}
                  onChange={(e) =>
                    setEditPlan({ ...editPlan, description: e.target.value })
                  }
                />
              </FieldContainer>

              <Button type="submit" onClick={handleSubmit}>
                Save Changes
              </Button>
            </div>
          </ModalContent>
        </Modal>
      )}
    </>
  );
};

// Modal Styles
const modalStyles = {
  image: {
    width: "100%",
    height: "auto",
    maxWidth: "250px", // Fixed width same as card
    maxHeight: "150px", // Fixed height same as card
    objectFit: "cover",
    borderRadius: "8px",
    marginBottom: "15px",
  },
  prices: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    color: "#555",
    padding: "0",
    listStyle: "none",
  },
};

const styles = {
  container: {
    display: "flex",
    flexWrap: "nowrap", // Changed to nowrap for horizontal scrolling
    overflowX: "auto", // Enable horizontal scrolling
    padding: "5px",
    gap: "20px",
  },
  image: {
    width: "100%",
    height: "auto",
    maxWidth: "250px",
    maxHeight: "150px",
    objectFit: "cover",
    borderRadius: "8px",
    marginBottom: "15px",
  },
  title: {
    fontSize: "1.25rem",
    color: "#333",
    margin: "10px 0",
  },
  subtitle: {
    fontSize: "1rem",
    color: "#555",
    margin: "5px 0",
  },
  description: {
    fontSize: "0.9rem",
    color: "#777",
    marginBottom: "15px",
    overflow: "hidden", // Hide overflowing text
    textOverflow: "ellipsis", // Show "..." when the text overflows
    whiteSpace: "nowrap", // Prevent text wrapping
    cursor: "pointer", // Change cursor to indicate it's interactive
  },
  prices: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "5px",
    fontSize: "1rem",
    color: "#333",
  },
  priceItem: {
    margin: "5px 0",
    display: "flex",
    alignItems: "center",
    gap: "5px",
  },
  buttonContainer: {
    display: "flex",
    justifyContent: "space-around",
    marginTop: "15px",
  },
};

export default ServicesList;
