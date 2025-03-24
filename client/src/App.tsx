import { Switch, Route } from "wouter";
import { Toaster } from "@/components/ui/toaster";
import ProfilePage from "@/pages/ProfilePage";
import SkillsetOverviewPage from "@/pages/SkillsetOverviewPage";
import TechnicalExpertisePage from "@/pages/TechnicalExpertisePage";
import SkillsExplorer from "@/pages/SkillsExplorer";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={ProfilePage} />
      <Route path="/skillset-overview" component={SkillsetOverviewPage} />
      <Route path="/technical-expertise" component={TechnicalExpertisePage} />
      <Route path="/skills-explorer" component={SkillsExplorer} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <>
      <Router />
      <Toaster />
    </>
  );
}

export default App;
