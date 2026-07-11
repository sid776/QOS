import { Route, Routes } from "react-router-dom";
import DesktopShell from "./components/DesktopShell";
import Home from "./pages/Home";
import Providers from "./pages/Providers";
import Jobs from "./pages/Jobs";
import JobDetail from "./pages/JobDetail";
import Skills from "./pages/Skills";
import SkillDetail from "./pages/SkillDetail";
import Agents from "./pages/Agents";
import AgentWorkbench from "./pages/AgentWorkbench";
import SecurityCenter from "./pages/SecurityCenter";
import Audit from "./pages/Audit";
import Policies from "./pages/Policies";
import Playground from "./pages/Playground";
import UseCases from "./pages/UseCases";
import UseCaseApp from "./useCases/UseCaseApp";
import Guide from "./pages/Guide";
import DevGuide from "./pages/DevGuide";
import Docs from "./pages/Docs";

export default function App() {
  return (
    <DesktopShell>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/guide" element={<Guide />} />
        <Route path="/help" element={<Guide />} />
        <Route path="/dev-guide" element={<DevGuide />} />
        <Route path="/readme" element={<Docs />} />
        <Route path="/readme/:docId" element={<Docs />} />
        <Route path="/docs" element={<Docs />} />
        <Route path="/docs/:docId" element={<Docs />} />
        <Route path="/agent-workbench" element={<AgentWorkbench />} />
        <Route path="/use-cases" element={<UseCases />} />
        <Route path="/use-cases/:useCaseId" element={<UseCaseApp />} />
        <Route path="/playground" element={<Playground />} />
        <Route path="/providers" element={<Providers />} />
        <Route path="/jobs" element={<Jobs />} />
        <Route path="/jobs/:jobId" element={<JobDetail />} />
        <Route path="/skills" element={<Skills />} />
        <Route path="/skills/:skillName" element={<SkillDetail />} />
        <Route path="/agents" element={<Agents />} />
        <Route path="/security" element={<SecurityCenter />} />
        <Route path="/audit" element={<Audit />} />
        <Route path="/policies" element={<Policies />} />
      </Routes>
    </DesktopShell>
  );
}
