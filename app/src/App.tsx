import DocsButton from "./components/buttons/DocsButton";
import RefreshDatabaseButton from "./components/buttons/RefreshDatabaseButton";
import ResetDatabaseButton from "./components/buttons/ResetDatabaseButton";
import FileUpload from "./components/elements/FileUpload";
import Header from "./components/elements/Header";
import RagAgentAPI from "./components/elements/RagAgentAPI";
import ResponseDetails from "./components/elements/ResponseDetails";
import SubmitQueryForm from "./components/elements/SubmitQueryForm";

const App = () => {
  return (
    <div className="max-w-5xl mx-auto p-4">
      <Header />

      <div className="flex flex-row gap-8">
        {/* Left Column */}
        <SubmitQueryForm />

        {/* Right Column */}
        <div className="w-1/2 bg-slate-50 p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4 text-slate-700">
            Database Controls
          </h2>
          <div className="space-y-4">
            <RefreshDatabaseButton />
            <ResetDatabaseButton />
            <FileUpload />
            <DocsButton />
          </div>
        </div>
      </div>

      <ResponseDetails />
      <RagAgentAPI />
    </div>
  );
};

export default App;
