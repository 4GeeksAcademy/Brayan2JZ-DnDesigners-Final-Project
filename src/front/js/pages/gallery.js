import React, { useState, useEffect } from 'react';

export const Gallery = () => {
    const [cardList, setCardList] = useState([]);
    const [imageTitle, setImageTitle] = useState('');
    const [imageCaption, setImageCaption] = useState('');
    const [imageFile, setImageFile] = useState(null);
    const [uploadedImages, setUploadedImages] = useState([]);
    const [selectedImage, setSelectedImage] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [comment, setComment] = useState('');
    const [commentsByImage, setCommentsByImage] = useState({});

    useEffect(() => {
        async function getImageURLs() {
            fetch(localStorage.getItem('backendUrl') + 'api/cards', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.getItem('token'),
                },
            }).then((response) => {
                return response.json();
            }).then((jsonRes) => {
                setCardList(jsonRes);
            });
        }
        getImageURLs();
    }, []);

    useEffect(() => {
        async function getArt() {
            fetch(localStorage.getItem('backendUrl') + 'api/arts', {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
            }).then((response) => {
                return response.json();
            }).then((respJson) => {
                setUploadedImages(respJson);
            });
        }
        getArt();
    }, []);

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            if (file.type === 'image/jpeg' || file.type === 'image/png') {
                setImageFile(file);
            } else {
                alert('Only JPEG and PNG images are allowed.');
            }
        }
    };

    const handleUpload = () => {
        if (!imageTitle || !imageCaption || !imageFile) {
            alert('Please provide a title, caption, and select an image file.');
            return;
        }

        const formData = new FormData();
        formData.append('file', imageFile);
        formData.append('title', imageTitle);
        formData.append('caption', imageCaption);

        fetch(localStorage.getItem('backendUrl') + 'api/upload-art', {
            method: 'POST',
            body: formData,
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('token'),
            },
        })
            .then((response) => response.json())
            .then((data) => {
                if (data.success) {
                    setUploadedImages((prev) => [...prev, {data, caption: imageCaption},]);
                    alert('Art uploaded successfully!');
                } else {
                    alert('Upload failed: ' + data.message);
                }
            })
            .catch((error) => {
                console.error('Error uploading art:', error);
                alert('Error uploading art.');
            });
    };

    const handleImageClick = (image, isCard) => {
        const selectedImage = {
            url: image.imageUrl || image.url,
            filename: image.fileName || image.filename,
            caption: isCard ? null : image.caption,
            id: image.id || image.filename,
        };
        setSelectedImage(selectedImage);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedImage(null);
    };

    const handleCommentChange = (e) => {
        setComment(e.target.value);
    };

    const handleAddComment = () => {
        if (comment.trim() === '') {
            alert('Please enter a comment!');
            return;
        }

        setCommentsByImage((prev) => {
            const updatedComments = {
                ...prev,
                [selectedImage.id]: [...(prev[selectedImage.id] || []), comment],
            };
            return updatedComments;
        });

        setComment('');
    };

    return (
        <div>
            <h1 className="text-center">Gallery</h1>
            <div className="container">
{/* Pills Tab */}
                <ul className="nav nav-pills mb-3 d-flex justify-content-center align-items-center" id="pills-tab" role="tablist">
                    <li className="nav-item" role="presentation">
                        <button
                            className="nav-link"
                            id="pills-home-tab"
                            data-bs-toggle="pill"
                            data-bs-target="#pills-cards"
                            type="button"
                            role="tab"
                            aria-controls="pills-cards"
                            aria-selected="false"
                        >
                            Cards
                        </button>
                    </li>
                    <li className="nav-item" role="presentation">
                        <button
                            className="nav-link"
                            id="pills-art-tab"
                            data-bs-toggle="pill"
                            data-bs-target="#pills-art"
                            type="button"
                            role="tab"
                            aria-controls="pills-profile"
                            aria-selected="false"
                        >
                            Art
                        </button>
                    </li>
                    <li className="nav-item" role="presentation">
                        <button
                            className="nav-link"
                            id="pills-3d-models-tab"
                            data-bs-toggle="pill"
                            data-bs-target="#pills-models"
                            type="button"
                            role="tab"
                            aria-controls="pills-models"
                            aria-selected="false"
                        >
                            3D Models
                        </button>
                    </li>
                </ul>

{/* Tab Content */}
                <div className="tab-content" id="pills-tabContent">
{/* Cards Tab */}
                    <div className="tab-pane fade" id="pills-cards" role="tabpanel" aria-labelledby="pills-home-tab" tabIndex="0">
                        <div className="container mb-0 pb-0">
                            <div className="row row-cols-3">
                                {cardList &&
                                    cardList.map((cardObj) => (
                                        <div
                                            className="col m-0 p-1"
                                            key={cardObj.id}
                                            onClick={() => handleImageClick(cardObj, true)}
                                        >
                                            <h3>{cardObj.filename}</h3>
                                            <img width={200} height={282} src={cardObj.url} alt={cardObj.filename} />
                                        </div>
                                    ))}
                            </div>
                        </div>
                    </div>

{/* Art Tab */}
                    <div className="tab-pane fade" id="pills-art" role="tabpanel" aria-labelledby="pills-art-tab" tabIndex="0">
                        <div className="container d-flex flex-column align-items-center">
{/* Upload Button and Modal */}
                            <button
                                type="button"
                                className="btn btn-success me-2"
                                data-bs-toggle="modal"
                                data-bs-target="#exampleModal"
                            >
                                Upload Art Here
                            </button>

{/* Upload Art Modal */}
                            <div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                                <div className="modal-dialog">
                                    <div className="modal-content" style={{ maxHeight: '800px', overflowY: 'auto' }}>
                                        <div className="modal-header">
                                            <h5 className="modal-title" id="exampleModalLabel">
                                                <strong>Upload New Art</strong>
                                            </h5>
                                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                        </div>
                                        <div className="modal-body">
                                            <div className="mb-3">
                                                <label htmlFor="Title" className="form-label">
                                                    <strong>Title:</strong>
                                                </label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    value={imageTitle}
                                                    onChange={(e) => setImageTitle(e.target.value)}
                                                    placeholder="Add a title for your artwork"
                                                />
                                            </div>
                                            <div className="mb-3">
                                                <label htmlFor="Description" className="form-label">
                                                    <strong>Caption:</strong>
                                                </label>
                                                <textarea
                                                    className="form-control"
                                                    value={imageCaption}
                                                    onChange={(e) => setImageCaption(e.target.value)}
                                                    placeholder="Add a caption for your artwork"
                                                    rows="3"
                                                />
                                            </div>
                                            <input
                                                type="file"
                                                className="form-control"
                                                id="inputArtGroupFile"
                                                accept=".png, .jpeg, .jpg"
                                                onChange={handleFileChange}
                                            />
                                        </div>
                                        <div className="modal-footer">
                                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">
                                                Close
                                            </button>
                                            <button type="button" className="btn btn-primary" onClick={handleUpload}>
                                                Upload
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

{/* Art Gallery */}
                        <div className="container mb-0 pb-0">
                            <div className="row row-cols-3">
                                {uploadedImages &&
                                    uploadedImages.map((art, index) => (
                                        <div
                                            className="col m-0 p-1"
                                            key={index}
                                            onClick={() => handleImageClick(art, false)}
                                        >
                                            <img width={200}  src={art.imageUrl} alt={art.title} />
                                        </div>
                                    ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

{/* Modal to show image and comments */}
{selectedImage && showModal && (
    <div className="modal fade show" style={{ display: 'block' }} tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div className="modal-dialog modal-lg">
            <div className="modal-content" style={{ minHeight: '70vh' }}>
                <div className="modal-header">
                    <h5 className="modal-title" id="exampleModalLabel">
                        {selectedImage.filename}
                    </h5>
                    <button type="button" className="btn-close" onClick={handleCloseModal}></button>
                </div>
                <div className="modal-body d-flex" style={{ overflowY: 'auto', height: '60vh' }}>

{/* Image Section */}
                    <div className="d-flex justify-content-center align-items-center" style={{ flex: '0 0 60%', paddingRight: '15px' }}>
                        <img
                            src={selectedImage.url}
                            alt={selectedImage.filename}
                            style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
                        />
                    </div>

{/* Flex Container for Image and Comment Section */}
                    <div className="d-flex flex-column" style={{ flex: '1', paddingLeft: '15px' }}>
{/* Display caption for art */}
{selectedImage.caption && <p><strong>Caption:</strong> {selectedImage.caption}</p>}

{/* Comments Section */}
                        <div
                            style={{
                                marginTop: '20px',
                                height: '200px',
                                overflowY: 'auto',
                            }}
                        >
                            <h6>Comments:</h6>
                            {commentsByImage[selectedImage.id]?.length > 0 ? (
                                <ul style={{ padding: 0, listStyleType: 'none' }}>
                                    {commentsByImage[selectedImage.id].map((comment, index) => (
                                        <li
                                            key={index}
                                            style={{
                                                wordBreak: 'break-word',
                                                whiteSpace: 'normal',
                                                marginBottom: '10px',
                                                maxWidth: '100%',
                                            }}
                                        >
                                            {comment}
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p>No comments yet.</p>
                            )}
                        </div>

{/* Comment Input */}
                        <div className="mb-3" style={{ marginTop: '20px' }}>
                            <textarea
                                className="form-control"
                                value={comment}
                                onChange={handleCommentChange}
                                placeholder="Add a comment"
                                rows="3"
                            />
                        </div>
                        <button className="btn btn-primary" onClick={handleAddComment}>
                            Add Comment
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
)}
        </div>
    );
};

export default Gallery;
