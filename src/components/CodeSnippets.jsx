import React, { useState } from 'react';

export default function CodeSnippets() {
  const [activeTab, setActiveTab] = useState('flutter');

  return (
    <section id="docs" class="scroll-mt-28">
      <div class="text-center mb-10">
        <h2 class="text-3xl font-bold text-white mb-3">💻 Easy 1-Minute Integration</h2>
        <p class="text-slate-400">Connect your mobile or web app with standard HTTP requests.</p>
      </div>

      <div class="glass-card rounded-2xl p-6 md:p-8 border border-slate-800">
        <div class="flex gap-4 border-b border-slate-800 pb-4 mb-6">
          <button 
            onClick={() => setActiveTab('flutter')}
            class={`text-sm font-bold pb-2 transition ${activeTab === 'flutter' ? 'text-indigo-400 border-b-2 border-indigo-500' : 'text-slate-400 hover:text-slate-200'}`}
          >
            Flutter (Dart)
          </button>
          <button 
            onClick={() => setActiveTab('node')}
            class={`text-sm font-bold pb-2 transition ${activeTab === 'node' ? 'text-indigo-400 border-b-2 border-indigo-500' : 'text-slate-400 hover:text-slate-200'}`}
          >
            Node.js / JS
          </button>
          <button 
            onClick={() => setActiveTab('curl')}
            class={`text-sm font-bold pb-2 transition ${activeTab === 'curl' ? 'text-indigo-400 border-b-2 border-indigo-500' : 'text-slate-400 hover:text-slate-200'}`}
          >
            cURL
          </button>
        </div>

        {activeTab === 'flutter' && (
          <pre class="bg-slate-950 p-4 rounded-xl text-emerald-400 font-mono text-xs overflow-x-auto">
{`import 'dart:convert';
import 'package:http/http.dart' as http;

Future<Map<String, dynamic>> translateTexts(List<String> texts, String targetLang) async {
  final response = await http.post(
    Uri.parse('https://translater-free-api.onrender.com/api/v1/translate'),
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': 'YOUR_API_KEY_HERE',
    },
    body: jsonEncode({
      'texts': texts,
      'targetLanguage': targetLang,
    }),
  );

  return jsonDecode(response.body)['translations'];
}`}
          </pre>
        )}

        {activeTab === 'node' && (
          <pre class="bg-slate-950 p-4 rounded-xl text-emerald-400 font-mono text-xs overflow-x-auto">
{`const response = await fetch('https://translater-free-api.onrender.com/api/v1/translate', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'x-api-key': 'YOUR_API_KEY_HERE'
  },
  body: JSON.stringify({
    texts: ["Hello world", "Welcome to my app"],
    targetLanguage: "hi"
  })
});

const data = await response.json();
console.log(data.translations);`}
          </pre>
        )}

        {activeTab === 'curl' && (
          <pre class="bg-slate-950 p-4 rounded-xl text-emerald-400 font-mono text-xs overflow-x-auto">
{`curl -X POST https://translater-free-api.onrender.com/api/v1/translate \\
  -H "Content-Type: application/json" \\
  -H "x-api-key: YOUR_API_KEY_HERE" \\
  -d '{"texts": ["Hello world"], "targetLanguage": "hi"}'`}
          </pre>
        )}
      </div>
    </section>
  );
}
