import React, { useEffect, useState } from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { Card, Grid, Typography, TextField, Button } from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AllPosts = () => {
  const [post, setPost] = useState([]);
  const [keyword, setKeyword] = useState("");
  const navigate = useNavigate();

  const fetchPosts = async (searchKeyword = "") => {
    try {
      const url = searchKeyword
        ? `http://localhost:8080/jobposts/keyword/${searchKeyword}`
        : `http://localhost:8080/jobposts`;
      const response = await axios.get(url);
      setPost(response.data);
    } catch (err) {
      console.error("Error fetching posts:", err);
    }
  };

  useEffect(() => {
    fetchPosts(); // fetch all posts initially
  }, []);

  const handleEdit = (id) => {
    navigate("/edit", { state: { id } });
  };

  const handleDelete = (id) => {
    async function deletePost() {
      await axios.delete(`http://localhost:8080/jobpost/${id}`);
      fetchPosts(keyword); // refresh after deletion
    }
    deletePost();
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchPosts(keyword); // call API with keyword
  };

  return (
    <>
      {/* Search Bar */}
      <form
        onSubmit={handleSearch}
        style={{ display: "flex", justifyContent: "center", margin: "2%" }}
      >
        <TextField
          label="Search jobs..."
          variant="outlined"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          sx={{ width: "40%" }}
        />
        <Button
          type="submit"
          variant="contained"
          sx={{ marginLeft: 2 }}
        >
          Search
        </Button>
      </form>

      {/* Job Posts */}
      <Grid container spacing={2} sx={{ margin: "2%" }}>
        {post.length > 0 ? (
          post.map((p) => (
            <Grid key={p.postId} item xs={12} md={6} lg={4}>
              <Card
                sx={{
                  padding: "3%",
                  overflow: "hidden",
                  width: "84%",
                  backgroundColor: "#ADD8E6",
                }}
              >
                <Typography
                  variant="h5"
                  sx={{ fontSize: "2rem", fontWeight: "600", fontFamily: "sans-serif" }}
                >
                  {p.postProfile}
                </Typography>
                <Typography
                  sx={{ color: "#585858", marginTop: "2%", fontFamily: "cursive" }}
                  variant="body"
                >
                  Description: {p.postDesc}
                </Typography>
                <br />
                <br />
                <Typography variant="h6" sx={{ fontFamily: "unset", fontSize: "400" }}>
                  Experience: {p.reqExperience} years
                </Typography>
                <Typography sx={{ fontFamily: "serif", fontSize: "400" }} gutterBottom variant="body">
                  Skills:
                </Typography>
                {p.postTechStack.map((s, i) => (
                  <Typography variant="body" gutterBottom key={i}>
                    {s} .
                  </Typography>
                ))}
                <DeleteIcon onClick={() => handleDelete(p.postId)} sx={{ cursor: "pointer" }} />
                <EditIcon onClick={() => handleEdit(p.postId)} sx={{ cursor: "pointer", marginLeft: 1 }} />
              </Card>
            </Grid>
          ))
        ) : (
          <Typography variant="h6" sx={{ margin: "auto", marginTop: 4 }}>
            No posts found
          </Typography>
        )}
      </Grid>
    </>
  );
};

export default AllPosts;
