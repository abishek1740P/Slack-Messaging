import { useState, useEffect } from 'react';

export default function MessageForm({ onSubmit, defaultText = '' }) {
  const [text, setText] = useState('');

  useEffect(() => {
    setText(defaultText);
  }, [defaultText]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    onSubmit(text);
    setText('');
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 mb-4">
      <input
        type="text"
        className="flex-1 p-2 border rounded"
        placeholder="Enter a message..."
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <button
        type="submit"
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        {defaultText ? 'Update' : 'Send'}
      </button>
    </form>
  );
}
