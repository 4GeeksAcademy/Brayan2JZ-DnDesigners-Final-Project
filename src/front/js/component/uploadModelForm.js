import React, { useState } from "react";

export const UploadModelForm = ({ onClose, onUpload }) => {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [image, setImage] = useState(null);
    const [file, setFile] = useState(null);

    // Use BACKEND_URL from environment variables
    const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:3001";
    const variableID = localStorage.getItem("userId")
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!file) {
            alert("Please select a file to upload.");
            return;
        }

        const CHUNK_SIZE = 5 * 1024 * 1024; // 5 MB per chunk
        const totalChunks = Math.ceil(file.size / CHUNK_SIZE);

        for (let i = 0; i < totalChunks; i++) {
            const chunk = file.slice(i * CHUNK_SIZE, (i + 1) * CHUNK_SIZE);
            const formData = new FormData();
            formData.append("chunk", chunk);
            formData.append("chunkIndex", i);
            formData.append("totalChunks", totalChunks);
            formData.append("title", title);
            formData.append("description", description);
            formData.append("userId", variableID);
            // Add image only once (on the first chunk upload)
            if (image && i === 0) {
                formData.append("image", image);
            }
            console.log(formData, "form data")
            try {
                // Upload each chunk to the backend
                const response = await fetch(
                    `${BACKEND_URL}/api/models/upload-chunk`, // Dynamic backend URL
                    {
                        method: "POST",
                        body: formData,
                    }
                );

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(
                        errorData.error || `Failed to upload chunk ${i + 1}/${totalChunks}`
                    );
                }

                console.log(`Uploaded chunk ${i + 1} of ${totalChunks}`);
            } catch (error) {
                console.error(error);
                alert(`An error occurred while uploading chunk ${i + 1}: ${error.message}`);
                return; // Stop further uploads if a chunk fails
            }
        }

        alert("File upload completed successfully!");
        onUpload(); // Trigger parent component's upload handler
        onClose(); // Close the modal
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className="mb-3">
                <label className="form-label">Title</label>
                <input
                    type="text"
                    className="form-control"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                />
            </div>
            <div className="mb-3">
                <label className="form-label">Description</label>
                <textarea
                    className="form-control"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                ></textarea>
            </div>
            <div className="mb-3">
                <label className="form-label">Image</label>
                <input
                    type="file"
                    className="form-control"
                    onChange={(e) => setImage(e.target.files[0])}
                />
            </div>
            <div className="mb-3">
                <label className="form-label">File</label>
                <input
                    type="file"
                    className="form-control"
                    onChange={(e) => setFile(e.target.files[0])}
                    required
                />
            </div>
            <button type="submit" className="btn btn-success me-2">
                Upload
            </button>
            <button type="button" className="btn btn-secondary" onClick={onClose}>
                Cancel
            </button>
        </form>
    );
};
