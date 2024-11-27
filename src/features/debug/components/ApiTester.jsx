import { useState } from 'react';

export const ApiTester = () => {
  const [endpoint, setEndpoint] = useState('/api/v1/auth/login');
  const [method, setMethod] = useState('POST');
  const [requestBody, setRequestBody] = useState('{\n  "email": "",\n  "password": ""\n}');
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);

  const handleTest = async () => {
    try {
      setError(null);
      setResponse(null);

      const options = {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include'
      };

      if (method !== 'GET') {
        options.body = requestBody;
      }

      console.log('Making request:', {
        endpoint,
        method,
        options
      });

      const res = await fetch(endpoint, options);
      const data = await res.json();

      setResponse({
        status: res.status,
        headers: Object.fromEntries(res.headers.entries()),
        data
      });
    } catch (err) {
      console.error('API test error:', err);
      setError(err.message);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow">
      <h2 className="text-xl font-bold mb-4">API Route Tester</h2>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Endpoint</label>
          <input
            type="text"
            value={endpoint}
            onChange={(e) => setEndpoint(e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Method</label>
          <select
            value={method}
            onChange={(e) => setMethod(e.target.value)}
            className="w-full p-2 border rounded"
          >
            <option>GET</option>
            <option>POST</option>
            <option>PUT</option>
            <option>DELETE</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Request Body (JSON)</label>
          <textarea
            value={requestBody}
            onChange={(e) => setRequestBody(e.target.value)}
            rows={5}
            className="w-full p-2 border rounded font-mono text-sm"
          />
        </div>

        <button
          onClick={handleTest}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Send Request
        </button>

        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded">
            <h3 className="font-medium text-red-800 mb-2">Error</h3>
            <pre className="text-red-600 text-sm">{error}</pre>
          </div>
        )}

        {response && (
          <div className="p-4 bg-gray-50 border rounded">
            <h3 className="font-medium mb-2">Response</h3>
            <pre className="text-sm whitespace-pre-wrap overflow-auto">
              {JSON.stringify(response, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
};