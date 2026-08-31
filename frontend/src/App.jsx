import {
    BrowserRouter,
    Routes,
    Route,
    Navigate,
} from "react-router-dom";
import MyJobs from "./pages/MyJobs";

import { useAuth } from "./context/AuthContext";
import Register from "./pages/Register";
import CreateAssociateAccount from "./pages/CreateAssociateAccount";
import Layout from "./components/Layout";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Jobs from "./pages/Jobs";
import JobApprovals from "./pages/JobApprovals";
import Associates from "./pages/Associates";
import AssociateAccountSetup from "./pages/AssociateAccountSetup";
import Profiles from "./pages/Profiles";
import Notifications from "./pages/Notifications";
import CreateJob from "./pages/CreateJob";
import UploadJob from "./pages/UploadJob";
import SponsoredJobs from "./pages/SponsoredJobs";

function ProtectedRoute({ children }) {
    const { isAuthenticated, loading } = useAuth();

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!isAuthenticated) {
        return <Navigate to="/" replace />;
    }

    return children;
}

export default function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Login />} />

                <Route
                    path="/register"
                    element={<Register />}

                />
                <Route
                    path="/create-associate-account"
                    element={<CreateAssociateAccount />}
                />
                <Route
                    path="/associate-account-setup"
                    element={<AssociateAccountSetup />}
                />
                <Route
                    element={
                        <ProtectedRoute>
                            <Layout />
                        </ProtectedRoute>
                    }
                >
                    <Route
                        path="/dashboard"
                        element={<Dashboard />}
                    />

                    <Route
                        path="/jobs"
                        element={<Jobs />}
                    />

                    <Route
                        path="/job-approvals"
                        element={<JobApprovals />}
                    />

                    <Route
                        path="/associates"
                        element={<Associates />}
                    />

                    <Route
                        path="/profiles"
                        element={<Profiles />}
                    />

                    <Route
                        path="/notifications"
                        element={<Notifications />}
                    />

                    {/* <Route
                        path="/create-job"
                        element={<CreateJob />}
                    /> */}

                    <Route
                        path="/create-sponsored-job"
                        element={<CreateJob sponsored={true} />}
                    />

                    <Route
                        path="/upload-job"
                        element={<UploadJob />}
                    />
                    <Route
                        path="/my-jobs"
                        element={<MyJobs />}
                    />
                    <Route
                        path="/sponsored-jobs"
                        element={<SponsoredJobs />}
                    />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}