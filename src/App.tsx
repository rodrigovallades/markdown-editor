import { useState } from 'react';
import { MarkdownEditor } from './components/remirror';

const initialMarkdown = `# A small Markdown editor

Write and format content with the toolbar, or use Markdown shortcuts like **bold**, lists, and headings.

Select some text to add a link, or use the table button to insert a table.`;

const alternateMarkdown = `## A fresh start

This content was loaded from outside the editor.

- Markdown is the source of truth
- Changes are serialized live`;

export default function App() {
  const [markdown, setMarkdown] = useState(initialMarkdown);

  return (
    <main className="app-shell">
      <header className="app-header">
        <span className="eyebrow">Remirror + React + Vite</span>
        <h1>Markdown editor</h1>
        <p>A minimal working copy of the edupass-frontend editor, with tables and a live Markdown output.</p>
      </header>

      <div className="demo-grid">
        <section className="panel">
          <div className="panel-heading">
            <h2>Editor</h2>
            <span>⌘/Ctrl + Enter to save · Esc to discard</span>
          </div>
          <MarkdownEditor
            markdown={markdown}
            onChange={setMarkdown}
            onSave={() => window.alert('Saved Markdown')}
            onDiscard={() => window.alert('Discard shortcut pressed')}
            placeholder="Start writing…"
          />
        </section>

        <section className="panel">
          <div className="panel-heading">
            <h2>Markdown output</h2>
            <span>Live</span>
          </div>
          <pre className="markdown-output">{markdown}</pre>
          <div className="demo-actions">
            <button type="button" onClick={() => setMarkdown(initialMarkdown)}>Reset example</button>
            <button type="button" onClick={() => setMarkdown(alternateMarkdown)}>Load external content</button>
          </div>
        </section>
      </div>
    </main>
  );
}
