import React, { useContext, useEffect } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import ScrollToTop from "./component/scrollToTop";
import { BackendURL } from "./component/backendURL";

import { Demo } from "./pages/demo";
import { Single } from "./pages/single";
import { Home } from "./pages/home";
import { CharacterImageCreator } from "./pages/makeImage";
import { ItemImageCreator } from "./pages/makeImage_item";
import { SpellImageCreator } from "./pages/makeImage_spell";
import { UserHome } from "./pages/userHome";
import { FavoritesPage } from "./pages/favoritesPage";
import injectContext from "./store/appContext";

import { Navbar } from "./component/navbar";
import { Gallery } from "./pages/gallery";
import { Tags } from "./pages/tags";
import { Models } from "./pages/models"; // Import the Models page
import { ModelDetail } from "./pages/modelDetail"; // Import the ModelDetail page
import { Footer } from "./component/footer";
import { Context } from "./store/appContext";
import { Profile } from "./pages/profile";

//create your first component
const Layout = () => {
    //the basename is used when your project is published in a subdirectory and not in the root of the domain
    // you can set the basename on the .env file located at the root of this project, E.g: BASENAME=/react-hello-webapp/
    const basename = process.env.BASENAME || "";

    // Create token logout here

    if (!process.env.BACKEND_URL || process.env.BACKEND_URL == "") return <BackendURL />;
    const backendUrl = "https://laughing-space-winner-69vqxv9qrjj934rw-3001.app.github.dev/";
    const { store, actions } = useContext(Context);

    return (
        <div>
            <BrowserRouter basename={basename}>
                <ScrollToTop>
                    <Navbar />
                    <Routes>
                        <Route element={<Home />} path="/" />
                        <Route element={<UserHome />} path="/user"/>
                        <Route element={<Demo />} path="/demo" />
                        <Route element={<Single />} path="/single/:theid" />
                        <Route element={<Gallery />} path="/gallery" />
                        <Route element={<CharacterImageCreator />} path="/charimageCreator" />
                        <Route element={<ItemImageCreator />} path="/itemimageCreator" />
                        <Route element={<SpellImageCreator />} path="/spellimageCreator" />
                        <Route element={<Tags />} path="/tags" />
                        <Route element={<Models />} path="/models" /> {/* New Models page route */}
                        <Route element={<ModelDetail />} path="/model/:id" /> {/* New ModelDetail page route */}
                        <Route element={<Profile />} path="/profile/:id" />
                        <Route element={<FavoritesPage />} path="/favorites"/>
                        <Route element={<h1>Not found!</h1>} />
                    </Routes>
                    <Footer />
                </ScrollToTop>
            </BrowserRouter>
        </div>
    );
};

export default injectContext(Layout);
