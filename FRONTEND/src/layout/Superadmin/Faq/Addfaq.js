// import Modal from "@mui/material/Modal";
// import Box from "@mui/material/Box";
// import Typography from "@mui/material/Typography";
// import TextField from "@mui/material/TextField";
// import Button from "@mui/material/Button";
// import FormControl from "@mui/material/FormControl";
// import InputLabel from "@mui/material/InputLabel";
// import Select from "@mui/material/Select";
// import MenuItem from "@mui/material/MenuItem";
// import { useFormik } from "formik";
// import * as yup from "yup";
// import { useDispatch } from "react-redux";
// import {
//   ADD_FAQ,
//   UPDATE_FAQ,
// } from "../../../ReduxStore/Slice/Superadmin/ApiCreateInfoSlice"; // Assuming you have an update action
// import { useEffect } from "react";

// const AddFaqModal = ({ open, onClose, mode, initialValues }) => {
//   const dispatch = useDispatch();

//   // Validation schema
//   const validationSchema = yup.object({
//     question: yup.string().required("Question is required"),
//     answer: yup.string().required("Answer is required"),
//     category: yup.string().required("Category is required"),
//   });

//   // Formik setup
//   const formik = useFormik({
//     initialValues: {
//       question: initialValues ? initialValues?.question : "",
//       answer: initialValues ? initialValues?.answer : "",
//       answer1: initialValues ? initialValues?.answer1 : "",
//       category: initialValues ? initialValues?.category : "",
//       Role: initialValues ? initialValues?.Role : "",
//       image1: null,
//       image2: null,
//     },
//     validationSchema,
//     onSubmit: async (values, { resetForm }) => {
//       try {
//         const image1 = values?.image1
//           ? await fileToBase64(values?.image1)
//           : null;
//         const image2 = values?.image2
//           ? await fileToBase64(values?.image2)
//           : null;

//         if (mode === "add") {
//           await dispatch(
//             ADD_FAQ({
//               question: values.question,
//               answer: values.answer,
//               answer1: values.answer1,
//               type: values.category,
//               Role: values.Role,
//               image1: image1,
//               image2: image2,
//             })
//           ).unwrap();

//           window.location.reload();
//         } else if (mode === "edit" && initialValues) {
//           await dispatch(
//             UPDATE_FAQ({
//               id: initialValues._id,
//               question: values.question,
//               answer: values.answer,
//               answer1: values.answer1,
//               type: values.category,
//               Role: values.Role,
//               image1: image1,
//               image2: image2,
//             })
//           ).unwrap();
//           window.location.reload();
//         }

//         onClose();
//         resetForm();
//       } catch (error) {
//         return;
//       }
//     },
//   });

//   // Function to convert file to base64
//   const fileToBase64 = (file) => {
//     return new Promise((resolve, reject) => {
//       const reader = new FileReader();
//       reader.readAsDataURL(file);
//       reader.onload = () => resolve(reader.result);
//       reader.onerror = (error) => reject(error);
//     });
//   };

//   useEffect(() => {
//     if (initialValues) {
//       formik.setValues({
//         question: initialValues.question,
//         answer: initialValues.answer,
//         answer1: initialValues.answer1,
//         category: initialValues.type,
//         Role: initialValues.Role,
//         image1: null,
//         image2: null,
//       });
//     }
//   }, [initialValues]);

//   return (
//     <Modal
//       open={open}
//       onClose={onClose}
//       aria-labelledby="add-faq-modal"
//       aria-describedby="add-faq-modal-description"
//     >
//       <Box
//         sx={{
//           position: "absolute",
//           top: "50%",
//           left: "50%",
//           transform: "translate(-50%, -50%)",
//           width: 600,
//           bgcolor: "background.paper",
//           boxShadow: 24,
//           p: 4,
//         }}
//       >
//         <Typography variant="h6">
//           {mode === "add" ? "Add New FAQ" : "Edit FAQ"}
//         </Typography>
//         <form onSubmit={formik.handleSubmit}>
//           <TextField
//             id="question"
//             name="question"
//             label="Question"
//             variant="outlined"
//             fullWidth
//             value={formik.values.question}
//             onChange={formik.handleChange}
//             error={formik.touched.question && Boolean(formik.errors.question)}
//             helperText={formik.touched.question && formik.errors.question}
//             style={{ marginBottom: "1rem" }}
//           />
//           <TextField
//             id="answer"
//             name="answer"
//             label="Answer"
//             variant="outlined"
//             multiline
//             rows={2}
//             fullWidth
//             value={formik.values.answer}
//             onChange={formik.handleChange}
//             error={formik.touched.answer && Boolean(formik.errors.answer)}
//             helperText={formik.touched.answer && formik.errors.answer}
//             style={{ marginBottom: "1rem" }}
//           />
//           {/* Additional Answer1 Field */}
//           <TextField
//             id="answer1"
//             name="answer1"
//             label="Answer1"
//             variant="outlined"
//             multiline
//             rows={2}
//             fullWidth
//             value={formik.values.answer1}
//             onChange={formik.handleChange}
//             error={formik.touched.answer1 && Boolean(formik.errors.answer1)}
//             helperText={formik.touched.answer1 && formik.errors.answer1}
//             style={{ marginBottom: "1rem" }}
//           />
//           {/* Dropdown for Category */}
//           <FormControl
//             variant="outlined"
//             fullWidth
//             style={{ marginBottom: "1rem" }}
//           >
//             <InputLabel id="category-label">Category</InputLabel>
//             <Select
//               id="category"
//               name="category"
//               labelId="category-label"
//               value={formik.values.category}
//               onChange={formik.handleChange}
//               label="Category"
//               error={formik.touched.category && Boolean(formik.errors.category)}
//             >
//               <MenuItem value="">Select Category</MenuItem>
//               <MenuItem value="software">Software</MenuItem>
//               <MenuItem value="mt4">MT-4</MenuItem>
//               <MenuItem value="api">API Login with Broker</MenuItem>
//               <MenuItem value="trade">Trade Issue</MenuItem>
//             </Select>
//           </FormControl>

//           {/* Dropdown for Role  */}
//           <FormControl
//             variant="outlined"
//             fullWidth
//             style={{ marginBottom: "1rem" }}
//           >
//             <InputLabel id="Role-label">Role</InputLabel>
//             <Select
//               id="Role"
//               name="Role"
//               labelId="Role-label"
//               value={formik.values.Role}
//               onChange={formik.handleChange}
//               label="Role"
//               error={formik.touched.Role && Boolean(formik.errors.Role)}
//             >
//               <MenuItem value="ALL">ALL</MenuItem>
//               <MenuItem value="ADMIN">ADMIN</MenuItem>
//               <MenuItem value="EMPLOYEE">EMPLOYEE</MenuItem>
//               <MenuItem value="USER">USER</MenuItem>
//             </Select>
//           </FormControl>

//           <div
//             style={{
//               display: "flex",
//               alignItems: "center",
//               justifyContent: "space-between",
//             }}
//           >
//             <input
//               id="image1"
//               name="image1"
//               type="file"
//               onChange={(e) =>
//                 formik.setFieldValue("image1", e.target.files[0])
//               }
//               style={{ marginBottom: "1rem" }}
//             />
//             <input
//               id="image2"
//               name="image2"
//               type="file"
//               onChange={(e) =>
//                 formik.setFieldValue("image2", e.target.files[0])
//               }
//               style={{ marginBottom: "1rem" }}
//             />
//           </div>

//           <Button
//             type="submit"
//             variant="contained"
//             color="primary"
//             style={{ marginRight: "1rem" }}
//           >
//             {mode === "add" ? "Add FAQ" : "Update FAQ"}
//           </Button>
//           <Button variant="contained" onClick={onClose}>
//             Cancel
//           </Button>
//         </form>
//       </Box>
//     </Modal>
//   );
// };

// export default AddFaqModal;




import React, { useEffect, useState } from "react";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import { useFormik } from "formik";
import * as yup from "yup";
import { useDispatch } from "react-redux";
import { ADD_FAQ, UPDATE_FAQ } from "../../../ReduxStore/Slice/Superadmin/ApiCreateInfoSlice";
import { Checkbox, ListItemText } from '@mui/material';

const AddFaqModal = ({ open, onClose, mode, initialValues }) => {
  const dispatch = useDispatch();

  // Define the roleArr state
  const [roleArr, setRoleArr] = useState([]);

  // Validation schema
  const validationSchema = yup.object({
    question: yup.string().required("Question is required"),
    answer: yup.string().required("Answer is required"),
    category: yup.string().required("Category is required"),
  });

  // Formik setup
  const formik = useFormik({
    initialValues: {
      question: initialValues ? initialValues?.question : "",
      answer: initialValues ? initialValues?.answer : "",
      answer1: initialValues ? initialValues?.answer1 : "",
      category: initialValues ? initialValues?.category : "",
      Role: roleArr, // Using roleArr to initialize Role
      image1: null,
      image2: null,
    },
    validationSchema,
    onSubmit: async (values, { resetForm }) => {
      try {
        const image1 = values?.image1
          ? await fileToBase64(values?.image1)
          : null;
        const image2 = values?.image2
          ? await fileToBase64(values?.image2)
          : null;

        if (mode === "add") {
          await dispatch(
            ADD_FAQ({
              question: values.question,
              answer: values.answer,
              answer1: values.answer1,
              type: values.category,
              Role: values.Role,
              image1: image1,
              image2: image2,
            })
          ).unwrap();

          window.location.reload();
        } else if (mode === "edit" && initialValues) {
          await dispatch(
            UPDATE_FAQ({
              id: initialValues._id,
              question: values.question,
              answer: values.answer,
              answer1: values.answer1,
              type: values.category,
              Role: values.Role,
              image1: image1,
              image2: image2,
            })
          ).unwrap();
          window.location.reload();
        }

        onClose();
        resetForm();
      } catch (error) {
        return;
      }
      console.log("valies", values);
    },
  });

  // Function to convert file to base64
  const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  useEffect(() => {
    if (initialValues) {
      formik.setValues({
        question: initialValues.question,
        answer: initialValues.answer,
        answer1: initialValues.answer1,
        category: initialValues.type,
        Role: initialValues.Role || [],
        image1: null,
        image2: null,
      });
      setRoleArr(initialValues.Role || []); // Sync roleArr with initial values
    }
  }, [initialValues]);

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="add-faq-modal"
      aria-describedby="add-faq-modal-description"
    >
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 600,
          bgcolor: "background.paper",
          boxShadow: 24,
          p: 4,
        }}
      >
        <Typography variant="h6">
          {mode === "add" ? "Add New FAQ" : "Edit FAQ"}
        </Typography>
        <form onSubmit={formik.handleSubmit}>
          <TextField
            id="question"
            name="question"
            label="Question"
            variant="outlined"
            fullWidth
            value={formik.values.question}
            onChange={formik.handleChange}
            error={formik.touched.question && Boolean(formik.errors.question)}
            helperText={formik.touched.question && formik.errors.question}
            style={{ marginBottom: "1rem" }}
          />
          <TextField
            id="answer"
            name="answer"
            label="Answer"
            variant="outlined"
            multiline
            rows={2}
            fullWidth
            value={formik.values.answer}
            onChange={formik.handleChange}
            error={formik.touched.answer && Boolean(formik.errors.answer)}
            helperText={formik.touched.answer && formik.errors.answer}
            style={{ marginBottom: "1rem" }}
          />
          {/* Additional Answer1 Field */}
          <TextField
            id="answer1"
            name="answer1"
            label="Answer1"
            variant="outlined"
            multiline
            rows={2}
            fullWidth
            value={formik.values.answer1}
            onChange={formik.handleChange}
            error={formik.touched.answer1 && Boolean(formik.errors.answer1)}
            helperText={formik.touched.answer1 && formik.errors.answer1}
            style={{ marginBottom: "1rem" }}
          />
          {/* Dropdown for Category */}
          <FormControl
            variant="outlined"
            fullWidth
            style={{ marginBottom: "1rem" }}
          >
            <InputLabel id="category-label">Category</InputLabel>
            <Select
              id="category"
              name="category"
              labelId="category-label"
              value={formik.values.category}
              onChange={formik.handleChange}
              label="Category"
              error={formik.touched.category && Boolean(formik.errors.category)}
            >
              <MenuItem value="">Select Category</MenuItem>
              <MenuItem value="software">Software</MenuItem>
              <MenuItem value="mt4">MT-4</MenuItem>
              <MenuItem value="api">API Login with Broker</MenuItem>
              <MenuItem value="trade">Trade Issue</MenuItem>
            </Select>
          </FormControl>

          {/* Dropdown for Role  */}
          <FormControl
  variant="outlined"
  fullWidth
  style={{ marginBottom: "1rem" }}
>
  <InputLabel id="Role-label">Role</InputLabel>
  <Select
    id="Role"
    name="Role"
    labelId="Role-label"
    multiple
    value={Array.isArray(formik.values.Role) ? formik.values.Role : []} // Ensure it's always an array
    onChange={(e) => {
      const value = e.target.value;

      if (value.includes("ALL")) {
        if (formik.values.Role.includes("ALL")) {
          // Deselect "ALL" and clear all selections
          formik.setFieldValue("Role", []);
        } else {
          // Select "ALL" along with all other options
          formik.setFieldValue("Role", ["ALL", "ADMIN", "SUBADMIN", "USER"]);
        }
      } else {
        // If "ALL" is not selected, handle individual selections
        formik.setFieldValue("Role", value);
      }
    }}
    label="Role"
    error={formik.touched.Role && Boolean(formik.errors.Role)}
    renderValue={(selected) => {
      if (Array.isArray(selected)) {
        return selected.join(", ");
      }
      return "";
    }}
  >
    {/* <MenuItem value="ALL">
      <Checkbox
        checked={formik.values.Role.includes("ALL")}
        size="small"
      />
      <ListItemText primary="ALL" style={{ fontSize: '0.875rem' }} />
    </MenuItem> */}
    <MenuItem value="ADMIN">
      <Checkbox
        checked={formik.values.Role.includes("ADMIN")}
        size="small"
      />
      <ListItemText primary="ADMIN" style={{ fontSize: '0.875rem' }} />
    </MenuItem>
              <MenuItem value="SUBADMIN">
      <Checkbox
        checked={formik.values.Role.includes("SUBADMIN")}
        size="small"
      />
      <ListItemText primary="SUBADMIN" style={{ fontSize: '0.875rem' }} />
    </MenuItem>
    <MenuItem value="USER">
      <Checkbox
        checked={formik.values.Role.includes("USER")}
        size="small"
      />
      <ListItemText primary="USER" style={{ fontSize: '0.875rem' }} />
    </MenuItem>
  </Select>
</FormControl>








          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <input
              id="image1"
              name="image1"
              type="file"
              onChange={(e) =>
                formik.setFieldValue("image1", e.target.files[0])
              }
              style={{ marginBottom: "1rem" }}
            />
            <input
              id="image2"
              name="image2"
              type="file"
              onChange={(e) =>
                formik.setFieldValue("image2", e.target.files[0])
              }
              style={{ marginBottom: "1rem" }}
            />
          </div>

          <Button
            type="submit"
            variant="contained"
            color="primary"
            style={{ marginRight: "1rem" }}
          >
            {mode === "add" ? "Add FAQ" : "Update FAQ"}
          </Button>
          <Button variant="contained" onClick={onClose}>
            Cancel
          </Button>
        </form>
      </Box>
    </Modal>
  );
};

export default AddFaqModal;
