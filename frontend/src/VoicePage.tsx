import React, { useState } from 'react';
import { VoiceInput } from './types';

const VoicePage: React.FC = () => {
  const [voiceInput, setVoiceInput] = useState<VoiceInput>({ text: '', isSpeaking: false });

  const speakText = (text: string) => {
    if ('speechSynthesis' in window && !voiceInput.isSpeaking) {
      const utter = new SpeechSynthesisUtterance(text);
      utter.lang = 'vi-VN';
      utter.onstart = () => setVoiceInput({ ...voiceInput, isSpeaking: true });
      utter.onend = () => setVoiceInput({ ...voiceInput, isSpeaking: false });
      window.speechSynthesis.speak(utter);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (voiceInput.text.trim() && !voiceInput.isSpeaking) {
      speakText(voiceInput.text);
    }
  };

  return (
    <div className="flex h-screen bg-gray-100 items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4 text-center">Tính năng Giọng nói</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            value={voiceInput.text}
            onChange={(e) => setVoiceInput({ ...voiceInput, text: e.target.value })}
            className="border rounded-lg p-2 w-full"
            placeholder="Nhập văn bản để nghe..."
            disabled={voiceInput.isSpeaking}
          />
          <button
            type="submit"
            className={`w-full bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 ${voiceInput.isSpeaking ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={voiceInput.isSpeaking}
          >
            {voiceInput.isSpeaking ? 'Đang phát...' : 'Phát giọng nói'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default VoicePage;