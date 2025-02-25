import "./App.css";
import DocsButton from "./components/buttons/DocsButton";
import RefreshDatabaseButton from "./components/buttons/RefreshDatabaseButton";
import ResetDatabaseButton from "./components/buttons/ResetDatabaseButton";
import FileUpload from "./components/elements/FileUpload";
import Header from "./components/elements/Header";
import RagAgentAPI from "./components/elements/RagAgentAPI";
import SubmitQueryForm from "./components/elements/SubmitQueryForm";

function App() {
  return (
    <>
      <Header />
      <SubmitQueryForm />
      <RefreshDatabaseButton />
      <ResetDatabaseButton />
      <FileUpload />
      <DocsButton />
      <RagAgentAPI />
    </>
  );
}

export default App;
