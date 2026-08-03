import { BrowserRouter, Routes, Route } from "react-router-dom";

import Layout from "./components/Layout";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Jobs from "./pages/Jobs";
import JobApprovals from "./pages/JobApprovals";
import Associates from "./pages/Associates";
import Profiles from "./pages/Profiles";
import Notifications from "./pages/Notifications";
import CreateJob from "./pages/CreateJob";
import UploadJob from "./pages/UploadJob";
import SponsoredJobs from "./pages/SponsoredJobs";

export default function App() {
    return (
        <BrowserRouter>
            <Routes>

                <Route path="/" element={<Login />} />

                <Route element={<Layout />}>

                    <Route path="/dashboard" element={<Dashboard />} />

                    <Route path="/jobs" element={<Jobs />} />

                    <Route path="/job-approvals" element={<JobApprovals />} />

                    <Route path="/associates" element={<Associates />} />

                    <Route path="/profiles" element={<Profiles />} />

                    <Route path="/notifications" element={<Notifications />} />

                    <Route path="/create-job" element={<CreateJob />} />

                    <Route path="/upload-job" element={<UploadJob />} />

                    <Route path="/sponsored-jobs" element={<SponsoredJobs />} />

                </Route>

            </Routes>
        </BrowserRouter>
    );
}