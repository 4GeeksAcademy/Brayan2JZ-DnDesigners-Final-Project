import React from "react";
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
import injectContext from "./store/appContext";

import { Navbar } from "./component/navbar";
import { Gallery } from "./pages/gallery";
import { Tags } from "./pages/tags"
import { Footer } from "./component/footer";



//create your first component
const Layout = () => {
    //the basename is used when your project is published in a subdirectory and not in the root of the domain
    // you can set the basename on the .env file located at the root of this project, E.g: BASENAME=/react-hello-webapp/
    const basename = process.env.BASENAME || "";

    if(!process.env.BACKEND_URL || process.env.BACKEND_URL == "") return <BackendURL/ >;

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
                        <Route element={<h1>Not found!</h1>} />
                    </Routes>
                    <Footer />
                </ScrollToTop>
            </BrowserRouter>
        </div>
    );
};

export default injectContext(Layout);
