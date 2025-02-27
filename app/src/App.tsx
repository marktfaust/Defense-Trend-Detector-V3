import Header from "./components/elements/Header";
import RagAgentAPI from "./components/elements/RagAgentAPI";
import SocialFooter from "./components/elements/SocialFooter";
import CrawlSection from "./components/sections/CrawlSection";
import RagSection from "./components/sections/RagSection";

const App = () => {
  return (
    <div className="max-w-5xl mx-auto p-4">
      <Header />
      <RagSection />
      <RagAgentAPI />
      <CrawlSection />
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
