import React from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import LoginPage from "../pages/LoginPage";
import '../index.css';  
import Background from '../components/Background';
import SignUp from "../pages/SignUp";
import Home from "../pages/Home";
import UploadingPhotos from "../pages/UploadingPhotos";
import Delete from "../pages/Delete";
import Settings from "../pages/Settings";
import MessagePage from "../pages/MessagePage";
import SingleMesssage from "../pages/SingleMesssage";
import Friends from "../pages/Friends";

const AppRoutes: React.FC = () => {
	return (
		<>
			<Background />
			<header className="header">
				<Router>
					<Routes>
						<Route path="/" element={<Navigate to="/LoginPage" replace />} />
						<Route path="/LoginPage" element={<LoginPage />} />
						<Route path="/SignUp" element={<SignUp />} />
						<Route path="/Home" element={<Home />} />
						<Route path="/UploadingPhotos" element={<UploadingPhotos />} />
						<Route path="/Delete" element={<Delete />} />
						<Route path="/Settings" element={<Settings />} />
						<Route path="/MessagePage" element={<MessagePage />} />
						<Route path="/SingleMessage" element={<SingleMesssage />} />
						<Route path="/Friends" element={<Friends />} />
					</Routes>
				</Router>
			</header>
		</>
	);
};

export default AppRoutes;
