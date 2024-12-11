import React, { useState } from "react";
import { ModelView } from "../component/modelView"; // Import the ModelView component
import { UploadModelForm } from "../component/uploadModelForm"; // Import the UploadModelForm component

export const Models = () => {
    // Initial sample data for models
    const initialModels = [
        { id: 1, title: "Dragon Pawn", image: "https://cdn.thingiverse.com/renders/a9/50/90/e1/c1/393e99692a609936da0911dea2c7ea2b_display_large.jpg", description: "A mighty dragon for your adventures." },
        { id: 2, title: "Wandering Knight", image: "https://cdn.thingiverse.com/renders/d0/2c/9c/f3/ff/b3b622eaf113603bb7e847b3166e4abc_display_large.jpg", description: "A brave knight to guard the realm." },
        { id: 3, title: "Orc Warrior", image: "https://cdn.thingiverse.com/assets/d3/e0/18/1d/b8/large_display_orc_swordsman_base.png", description: "An orc ready for battle." },
        { id: 4, title: "Elven Mage", image: "https://cdn.thingiverse.com/renders/2e/2a/8e/10/45/836b71aba0b94d92bec85274b08f1056_display_large.jpg", description: "A wise mage with arcane powers." },
        { id: 5, title: "Elf Archer", image: "https://cdn.thingiverse.com/assets/2d/01/bd/d8/73/large_display_FemaleArcher.png", description: "An elf archer with deadly precision." },
        { id: 6, title: "D20 (20 Sided Die)", image: "https://cdn.thingiverse.com/renders/49/f3/6b/fe/8a/D20Treb_display_large.jpg", description: "A 20 Sided Die" },
    ];

    const [models, setModels] = useState(initialModels); // Combine static and dynamic models
    const [showModal, setShowModal] = useState(false);

    // Function to handle adding a new model
    const handleUpload = (newModel) => {
        setModels([...models, { id: models.length + 1, ...newModel }]); // Assign a unique ID and update the list
    };

    return (
        <div className="container my-5">
            <h1 className="text-center mb-4">3D Models</h1>
            <div className="row">
                {models.map((model) => (
                    <div key={model.id} className="col-md-4 mb-4">
                        <ModelView model={model} />
                    </div>
                ))}
            </div>
            {/* Add Upload Button */}
            <div className="text-center mt-5">
                <button
                    className="btn btn-primary btn-lg"
                    onClick={() => setShowModal(true)}
                >
                    Upload Model
                </button>
            </div>

            {/* Upload Model Modal */}
            {showModal && (
                <div className="modal show d-block" tabIndex="-1" role="dialog">
                    <div className="modal-dialog" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Upload New Model</h5>
                                <button
                                    type="button"
                                    className="btn-close"
                                    aria-label="Close"
                                    onClick={() => setShowModal(false)}
                                ></button>
                            </div>
                            <div className="modal-body">
                                <UploadModelForm
                                    onClose={() => setShowModal(false)}
                                    onUpload={handleUpload}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Add the "More will be added" message */}
            <div className="text-center mt-5">
                <h2>More will be added soon!</h2>
            </div>
        </div>
    );
};
