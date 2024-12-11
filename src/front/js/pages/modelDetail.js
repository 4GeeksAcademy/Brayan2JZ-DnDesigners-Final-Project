import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

export const ModelDetail = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { id, title, description, image, file } = location.state || {}; // Model details passed as state

    // Function to handle model deletion
    const handleDelete = async () => {
        const confirmDelete = window.confirm("Are you sure you want to delete this model?");
        if (!confirmDelete) return;

        try {
            const response = await fetch(`/api/models/${id}`, {
                method: "DELETE",
            });

            if (!response.ok) {
                throw new Error("Failed to delete the model");
            }

            alert("Model deleted successfully!");
            navigate("/models"); // Redirect back to the models page
        } catch (err) {
            console.error(err);
            alert("There was an error deleting the model.");
        }
    };

    if (!title || !description || !image || !file) {
        return (
            <div className="container my-5 text-center">
                <h1>Model Not Found</h1>
                <p>Sorry, we couldn't find the model you were looking for.</p>
            </div>
        );
    }

    return (
        <div className="container my-5">
            <div className="row">
                <div className="col-md-6">
                    <img src={image} className="img-fluid rounded shadow" alt={title} />
                </div>
                <div className="col-md-6">
                    <h1 className="mb-3">{title}</h1>
                    <p className="lead mb-4">{description}</p>
                    <a href={file} download className="btn btn-primary btn-lg me-2">
                        Download Model
                    </a>
                    <button className="btn btn-danger btn-lg" onClick={handleDelete}>
                        Delete Model
                    </button>
                </div>
            </div>
        </div>
    );
};
