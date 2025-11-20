import Layout from "./Layout.jsx";

import Landing from "./Landing";

import Onboarding from "./Onboarding";

import Home from "./Home";

import Matches from "./Matches";

import Likes from "./Likes";

import Profile from "./Profile";

import ChooseType from "./ChooseType";

import RegisterWoman from "./RegisterWoman";

import RegisterMan from "./RegisterMan";

import Chat from "./Chat";

import ProfileView from "./ProfileView";

import RoseCheckout from "./RoseCheckout";

import Report from "./Report";

import Verification from "./Verification";

import MonthlySupport from "./MonthlySupport";

import ModerationDashboard from "./ModerationDashboard";

import SafeMeeting from "./SafeMeeting";

import RestartPlan from "./RestartPlan";

import ValuesQuestionnaire from "./ValuesQuestionnaire";

import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';

const PAGES = {

    Landing: Landing,

    Onboarding: Onboarding,

    Home: Home,

    Matches: Matches,

    Likes: Likes,

    Profile: Profile,

    ChooseType: ChooseType,

    RegisterWoman: RegisterWoman,

    RegisterMan: RegisterMan,

    Chat: Chat,

    ProfileView: ProfileView,

    RoseCheckout: RoseCheckout,

    Report: Report,

    Verification: Verification,

    MonthlySupport: MonthlySupport,

    ModerationDashboard: ModerationDashboard,

    SafeMeeting: SafeMeeting,

    RestartPlan: RestartPlan,

    ValuesQuestionnaire: ValuesQuestionnaire,

}

function _getCurrentPage(url) {
    if (url.endsWith('/')) {
        url = url.slice(0, -1);
    }
    let urlLastPart = url.split('/').pop();
    if (urlLastPart.includes('?')) {
        urlLastPart = urlLastPart.split('?')[0];
    }

    const pageName = Object.keys(PAGES).find(page => page.toLowerCase() === urlLastPart.toLowerCase());
    return pageName || Object.keys(PAGES)[0];
}

// Create a wrapper component that uses useLocation inside the Router context
function PagesContent() {
    const location = useLocation();
    const currentPage = _getCurrentPage(location.pathname);
    
    return (
        <Layout currentPageName={currentPage}>
            <Routes>

                    <Route path="/" element={<Landing />} />


                <Route path="/Landing" element={<Landing />} />

                <Route path="/Onboarding" element={<Onboarding />} />
                
                <Route path="/Home" element={<Home />} />
                
                <Route path="/Matches" element={<Matches />} />
                
                <Route path="/Likes" element={<Likes />} />
                
                <Route path="/Profile" element={<Profile />} />
                
                <Route path="/ChooseType" element={<ChooseType />} />
                
                <Route path="/RegisterWoman" element={<RegisterWoman />} />
                
                <Route path="/RegisterMan" element={<RegisterMan />} />
                
                <Route path="/Chat" element={<Chat />} />
                
                <Route path="/ProfileView" element={<ProfileView />} />
                
                <Route path="/RoseCheckout" element={<RoseCheckout />} />

                <Route path="/Report" element={<Report />} />

                <Route path="/Verification" element={<Verification />} />

                <Route path="/MonthlySupport" element={<MonthlySupport />} />

                <Route path="/ModerationDashboard" element={<ModerationDashboard />} />

                <Route path="/SafeMeeting" element={<SafeMeeting />} />

                <Route path="/RestartPlan" element={<RestartPlan />} />

                <Route path="/ValuesQuestionnaire" element={<ValuesQuestionnaire />} />

            </Routes>
        </Layout>
    );
}

export default function Pages() {
    return (
        <Router>
            <PagesContent />
        </Router>
    );
}