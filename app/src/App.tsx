import DocsButton from "./components/buttons/DocsButton";
import RefreshDatabaseButton from "./components/buttons/RefreshDatabaseButton";
import ResetDatabaseButton from "./components/buttons/ResetDatabaseButton";
import FileUpload from "./components/elements/FileUpload";
import Header from "./components/elements/Header";
import RagAgentAPI from "./components/elements/RagAgentAPI";
import ResponseDetails from "./components/elements/ResponseDetails";
import SocialFooter from "./components/elements/SocialFooter";
import SubmitQueryForm from "./components/elements/SubmitQueryForm";
import RagSection from "./components/sections/RagSection";

const App = () => {
  return (
    <div className="max-w-5xl mx-auto p-4">
      <Header />

      {/* <div className="flex flex-row gap-8">
        {/* Left Column */}
        
      
      <RagSection />

      {/* <ResponseDetails /> */}
      <RagAgentAPI />
      <SocialFooter
        personalWebsite="https://marktfaust.com"
        linkedIn="https://linkedin.com/in/marktfaust"
        companyWebsite="https://thebarrax.co"
        github="https://github.com/marktfaust"
        youtube="https://www.youtube.com/@TheBarraxPodcast"
        name="Mark Faust"
        companyName="The Barrax Company"
      />
    </div>
  );
};

export default App;
