import React, { useEffect, useState } from "react";
import { Typography, TextField, Button, Paper, Box } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

const initial = {
  postId: "",
  postProfile: "",
  reqExperience: 0,
  postTechStack: [],
  postDesc: "",
};

const Edit = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [form, setForm] = useState(initial);
  const [currId] = useState(location.state.id);

  const skillSet = [
    "Javascript",
    "Java",
    "Python",
    "Django",
    "Rust"
  ];

  useEffect(() => {
    const fetchInitialPosts = async (id) => {
      const response = await axios.get(`http://localhost:8080/jobpost/${id}`);
      setForm(response.data);
    };
    fetchInitialPosts(currId);
  }, [currId]);

  const handleChange = (e) => {
    const value = e.target.value;
    const isChecked = e.target.checked;

    if (isChecked) {
      setForm({ ...form, postTechStack: [...form.postTechStack, value] });
    } else {
      setForm({
        ...form,
        postTechStack: form.postTechStack.filter((skill) => skill !== value),
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .put("http://localhost:8080/jobpost", form)
      .then((resp) => {
        console.log("Updated:", resp.data);
        navigate("/"); // navigate after successful update
      })
      .catch((error) => {
        console.error("Error updating:", error);
      });
  };

  return (
    <Paper sx={{ padding: "1%" }} elevation={0}>
      <Typography sx={{ margin: "3% auto" }} align="center" variant="h5">
        Edit Job Post
      </Typography>
      <form autoComplete="off" noValidate onSubmit={handleSubmit}>
        <Box sx={{ display: "flex", justifyContent: "center", flexDirection: "column" }}>
          <TextField
            type="number"
            sx={{ width: "50%", margin: "2% auto" }}
            onChange={(e) => setForm({ ...form, postId: Number(e.target.value) })}
            label="Post ID"
            variant="outlined"
            value={form.postId}
          />
          <TextField
            type="text"
            sx={{ width: "50%", margin: "2% auto" }}
            required
            onChange={(e) => setForm({ ...form, postProfile: e.target.value })}
            label="Job-Profile"
            variant="outlined"
            value={form.postProfile}
          />
          <TextField
            type="number"
            sx={{ width: "50%", margin: "2% auto" }}
            required
            onChange={(e) => setForm({ ...form, reqExperience: Number(e.target.value) })}
            label="Years of Experience"
            variant="outlined"
            value={form.reqExperience}
          />
          <TextField
            type="text"
            sx={{ width: "50%", margin: "2% auto" }}
            required
            multiline
            rows={4}
            onChange={(e) => setForm({ ...form, postDesc: e.target.value })}
            label="Job Description"
            variant="outlined"
            value={form.postDesc}
          />

          <Box sx={{ margin: "1% auto" }}>
            <h3>Required Skills</h3>
            <ul>
              {skillSet.map((name, index) => (
                <li key={index}>
                  <input
                    type="checkbox"
                    id={`custom-checkbox-${index}`}
                    value={name}
                    checked={form.postTechStack.includes(name)}
                    onChange={handleChange}
                  />
                  <label htmlFor={`custom-checkbox-${index}`}>{name}</label>
                </li>
              ))}
            </ul>
          </Box>

          <Button
            sx={{ width: "50%", margin: "2% auto" }}
            variant="contained"
            type="submit"
          >
            Update
          </Button>
        </Box>
      </form>
    </Paper>
  );
};

export default Edit;
