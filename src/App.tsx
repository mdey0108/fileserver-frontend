import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import FileManager from './components/FileManager';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-gray-100 p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Abnormal File Vault</h1>
        <FileManager />
      </div>
    </QueryClientProvider>
  );
}

export default App;