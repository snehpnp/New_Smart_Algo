import styled from "styled-components";
import { FaRupeeSign, FaEye, FaEdit } from "react-icons/fa";
import Content from "../../../Components/Dashboard/Content/Content";
import ToastButton from "../../../Components/ExtraComponents/Alert_Toast";
import { useState } from "react";
import { BadgeCheck } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { Get_All_Plans } from "../../../ReduxStore/Slice/Admin/GroupServiceSlice";
import { Find_One_User } from "../../../ReduxStore/Slice/Admin/AdminSlice";

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
  const [GetAllPlans, setAllPlans] = useState({ loading: true, data: [] });
  const [PlanId, setPlanId] = useState(null);

  useEffect(() => {
    data_1();
    GetAllPlansData();
  }, []);

  const handleViewClick = (plan) => {
    setSelectedPlan(plan);
  };

  const handleModalClose = () => {
    setSelectedPlan(null);
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
  let servicegivenmonth = localStorage.getItem("servicegivenmonth");
  const user_id = JSON.parse(localStorage.getItem("user_details")).user_id;
  const gotodashboard = JSON.parse(localStorage.getItem("gotodashboard"));
  const GoToDahboard_id = JSON.parse(localStorage.getItem("user_details_goTo"));

  
  const SetPlan = (index) => {
    if (servicegivenmonth === 0) {
      return null;
    }

    // Define the ranges
    const ranges = [
      { min: 1, max: 2, index: 0 },
      { min: 3, max: 5, index: 1 },
      { min: 6, max: 11, index: 2 },
      { min: 12, max: 12, index: 3 },
    ];

    // Find the matching range for the given month and index
    const matchedRange = ranges.find(
      (range) =>
        servicegivenmonth >= range.min &&
        servicegivenmonth <= range.max &&
        range.index === index
    );

    // Return BadgeCheck if the range matches, otherwise return null
    return matchedRange ? <BadgeCheck style={{ color: "green" }} /> : null;
  };

  const data_1 = async () => {
    await dispatch(Find_One_User({ id: gotodashboard ? GoToDahboard_id.user_id :user_id }))
      .unwrap()
      .then((response) => {
        if (response.status) {
          setPlanId(response.data[0].plan_id);
        }
      });
  };

  return (
    <>
      <Content
        Page_title="Plans"
        button_status={false}
        route="/admin/groupservices/add"
      >
        <div style={styles.container}>
          {GetAllPlans.data &&
            GetAllPlans.data.map((plan, index) =>
              plan._id.toString() != PlanId ? null : (
                <Card key={index}>
                  <img src={plan.image} alt={plan.name} style={styles.image} />
                  <h2 style={styles.title}>
                    {plan.name} {SetPlan(index)}
                  </h2>
                  <h4 style={styles.subtitle}>{plan.title}</h4>
                  <p style={styles.description}>{plan.description}</p>
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
                  </div>
                </Card>
              )
            )}
        </div>
      </Content>
      <ToastButton />

      {selectedPlan && (
        <Modal open={!!selectedPlan} onClick={handleModalClose}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <CloseButton onClick={handleModalClose}>×</CloseButton>
            <img
              src={selectedPlan.image}
              alt={selectedPlan.name}
              style={modalStyles.image}
            />
            <h2>{selectedPlan.name}</h2>
            <h4>{selectedPlan.title}</h4>
            <p>{selectedPlan.description}</p>
            <div style={modalStyles.prices}>
              <p>
                Monthly <FaRupeeSign /> {selectedPlan.prices.monthly}
              </p>
              <p>
                Quarterly <FaRupeeSign /> {selectedPlan.prices.quarterly}
              </p>
              <p>
                Half-Yearly <FaRupeeSign /> {selectedPlan.prices.halfYearly}
              </p>
              <p>
                Yearly <FaRupeeSign /> {selectedPlan.prices.yearly}
              </p>
            </div>
          </ModalContent>
        </Modal>
      )}
    </>
  );
};

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
    flexWrap: "nowrap",
    overflowX: "auto",
    padding: "5px",
    gap: "20px",
  },
  image: {
    width: "100%",
    height: "150px",
    objectFit: "cover",
    borderRadius: "8px",
    marginBottom: "15px",
  },
  title: {
    fontSize: "1.5rem",
    margin: "10px 0",
    color: "#333",
    fontWeight: "bold",
  },
  subtitle: {
    fontSize: "1.2rem",
    margin: "5px 0",
  },
  description: {
    fontSize: "1rem",
    margin: "10px 0",
  },
  prices: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    margin: "10px 0",
    color: "#555",
    padding: "0",
    listStyle: "none",
  },
  priceItem: {
    margin: "5px 0",
  },
  buttonContainer: {
    marginTop: "15px",
    display: "flex",
    textAlign: "center",
    justifyContent: "center",
    alignItems: "center",
  },
};

export default ServicesList;
