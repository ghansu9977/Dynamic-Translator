import React, { useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

export default function CodeSnippets({ apiKey }) {
  const [activeTab, setActiveTab] = useState('react');

  const reactCode = `import { useState } from 'react';

export default function TranslateComponent() {
  const [translated, setTranslated] = useState([]);

  const handleTranslate = async () => {
    const res = await fetch('https://translater-free-api.onrender.com/api/v1/translate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': '${apiKey}'
      },
      body: JSON.stringify({
        texts: ["Hello world", "Welcome to my app"],
        targetLanguage: "hi"
      })
    });
    const data = await res.json();
    setTranslated(data.translations);
  };

  return <button onClick={handleTranslate}>Translate</button>;
}`;

  const nodeCode = `const fetch = require('node-fetch');

async function translateText() {
  const response = await fetch('https://translater-free-api.onrender.com/api/v1/translate', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': '${apiKey}'
    },
    body: JSON.stringify({
      texts: ["Hello world"],
      targetLanguage: "es"
    })
  });

  const data = await response.json();
  console.log(data.translations);
}
translateText();`;

  const pythonCode = `import requests

url = "https://translater-free-api.onrender.com/api/v1/translate"
headers = {
    "Content-Type": "application/json",
    "x-api-key": "${apiKey}"
}
data = {
    "texts": ["Hello world", "How are you?"],
    "targetLanguage": "fr"
}

response = requests.post(url, headers=headers, json=data)
print(response.json()['translations'])`;

  const phpCode = `<?php
$url = 'https://translater-free-api.onrender.com/api/v1/translate';
$data = array('texts' => array('Hello world'), 'targetLanguage' => 'de');

$options = array(
    'http' => array(
        'header'  => "Content-Type: application/json\\r\\nx-api-key: ${apiKey}\\r\\n",
        'method'  => 'POST',
        'content' => json_encode($data)
    )
);

$context  = stream_context_create($options);
$result = file_get_contents($url, false, $context);
$response = json_decode($result, true);
print_r($response['translations']);
?>`;

  const flutterCode = `import 'dart:convert';
import 'package:http/http.dart' as http;

Future<List<String>> translateTexts() async {
  final response = await http.post(
    Uri.parse('https://translater-free-api.onrender.com/api/v1/translate'),
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': '${apiKey}',
    },
    body: jsonEncode({
      'texts': ["Hello world"],
      'targetLanguage': "hi",
    }),
  );

  return List<String>.from(jsonDecode(response.body)['translations']);
}`;

  const curlCode = `curl -X POST https://translater-free-api.onrender.com/api/v1/translate \\
  -H "Content-Type: application/json" \\
  -H "x-api-key: ${apiKey}" \\
  -d '{"texts": ["Hello world"], "targetLanguage": "hi"}'`;

  return (
    <section id="docs" class="scroll-mt-28">
      <div class="text-center mb-10">
        <h2 class="text-3xl font-bold text-white mb-3">💻 Easy 1-Minute Integration</h2>
        <p class="text-slate-400">Connect your mobile or web app with standard HTTP requests in any language.</p>
      </div>

      <div class="glass-card rounded-2xl overflow-hidden shadow-2xl border border-slate-700 max-w-4xl mx-auto">
        {/* Mac Window Header */}
        <div className="bg-slate-900/80 px-4 py-3 flex items-center border-b border-slate-800">
          <div className="flex gap-2 min-w-[60px]">
            <div className="w-3 h-3 rounded-full bg-rose-500"></div>
            <div className="w-3 h-3 rounded-full bg-amber-500"></div>
            <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
          </div>
          <div className="flex gap-6 ml-6 overflow-x-auto whitespace-nowrap scrollbar-hide flex-1">
            <button 
              onClick={() => setActiveTab('react')}
              className={`text-xs font-semibold tracking-wider uppercase transition ${activeTab === 'react' ? 'text-indigo-400' : 'text-slate-500 hover:text-slate-300'}`}
            >
              React.js
            </button>
            <button 
              onClick={() => setActiveTab('node')}
              className={`text-xs font-semibold tracking-wider uppercase transition ${activeTab === 'node' ? 'text-indigo-400' : 'text-slate-500 hover:text-slate-300'}`}
            >
              Node.js
            </button>
            <button 
              onClick={() => setActiveTab('python')}
              className={`text-xs font-semibold tracking-wider uppercase transition ${activeTab === 'python' ? 'text-indigo-400' : 'text-slate-500 hover:text-slate-300'}`}
            >
              Python
            </button>
            <button 
              onClick={() => setActiveTab('php')}
              className={`text-xs font-semibold tracking-wider uppercase transition ${activeTab === 'php' ? 'text-indigo-400' : 'text-slate-500 hover:text-slate-300'}`}
            >
              PHP
            </button>
            <button 
              onClick={() => setActiveTab('flutter')}
              className={`text-xs font-semibold tracking-wider uppercase transition ${activeTab === 'flutter' ? 'text-indigo-400' : 'text-slate-500 hover:text-slate-300'}`}
            >
              Flutter
            </button>
            <button 
              onClick={() => setActiveTab('curl')}
              className={`text-xs font-semibold tracking-wider uppercase transition ${activeTab === 'curl' ? 'text-indigo-400' : 'text-slate-500 hover:text-slate-300'}`}
            >
              cURL
            </button>
          </div>
        </div>

        <div className="p-4 bg-slate-950 text-sm overflow-x-auto">
          {activeTab === 'react' && (
            <SyntaxHighlighter language="javascript" style={vscDarkPlus} customStyle={{ background: 'transparent', margin: 0 }}>
              {reactCode}
            </SyntaxHighlighter>
          )}
          {activeTab === 'node' && (
            <SyntaxHighlighter language="javascript" style={vscDarkPlus} customStyle={{ background: 'transparent', margin: 0 }}>
              {nodeCode}
            </SyntaxHighlighter>
          )}
          {activeTab === 'python' && (
            <SyntaxHighlighter language="python" style={vscDarkPlus} customStyle={{ background: 'transparent', margin: 0 }}>
              {pythonCode}
            </SyntaxHighlighter>
          )}
          {activeTab === 'php' && (
            <SyntaxHighlighter language="php" style={vscDarkPlus} customStyle={{ background: 'transparent', margin: 0 }}>
              {phpCode}
            </SyntaxHighlighter>
          )}
          {activeTab === 'flutter' && (
            <SyntaxHighlighter language="dart" style={vscDarkPlus} customStyle={{ background: 'transparent', margin: 0 }}>
              {flutterCode}
            </SyntaxHighlighter>
          )}
          {activeTab === 'curl' && (
            <SyntaxHighlighter language="bash" style={vscDarkPlus} customStyle={{ background: 'transparent', margin: 0 }}>
              {curlCode}
            </SyntaxHighlighter>
          )}
        </div>
      </div>
    </section>
  );
}
