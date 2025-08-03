import React, { useState, useEffect, useRef } from 'react';
import './index';
import { ChatMessage, ScheduleEvent } from './types';
import VoicePage from './VoicePage';

const App: React.FC = () => {
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isScheduleVisible, setIsScheduleVisible] = useState(false);
  const [scheduleEvent, setScheduleEvent] = useState<ScheduleEvent>({ title: '', datetime: '' });
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isVoicePage, setIsVoicePage] = useState(false); // Điều hướng trang
  const chatboxRef = useRef<HTMLDivElement>(null);

  const API_ENDPOINT = 'http://localhost:8000';

  const renderChat = () => {
    if (!chatboxRef.current) return;
    chatboxRef.current.innerHTML = '';
    chatHistory.forEach((msg) => {
      const div = document.createElement('div');
      div.className = `chat-bubble flex items-start space-x-2 p-3 rounded-lg mb-2 max-w-[80%] ${
        msg.sender === 'user' ? 'ml-auto bg-blue-100 text-gray-900' : 'mr-auto bg-gray-200 text-gray-900'
      } ${isDarkMode ? 'dark:bg-gray-700 dark:text-white' : ''}`;
      div.innerHTML = `<span class="avatar text-2xl">${msg.sender === 'user' ? '👤' : '🤖'}</span><span class="flex-1">${msg.text}</span>`;
      if (chatboxRef?.current) chatboxRef.current.appendChild(div);
    });
    chatboxRef.current.scrollTop = chatboxRef.current.scrollHeight;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const text = inputValue.trim();
    if (!text) return;
    setChatHistory([...chatHistory, { sender: 'user', text }]);
    setInputValue('');
    renderChat();

    try {
      const response = await fetch(`${API_ENDPOINT}/ask`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      });
      const data = await response.json();
      const reply = data.reply;
      setChatHistory([...chatHistory, { sender: 'bot', text: reply }]);
      renderChat();
    } catch (error) {
      setChatHistory([...chatHistory, { sender: 'bot', text: 'Không thể kết nối backend.' }]);
      renderChat();
    }
  };

  const handleScheduleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!scheduleEvent.title || !scheduleEvent.datetime) return;
    const currentTime = new Date().toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' });
    alert(`Đã tạo lịch hẹn: ${scheduleEvent.title} lúc ${scheduleEvent.datetime} (Thời gian: ${currentTime})`);
    setScheduleEvent({ title: '', datetime: '' });
    setIsScheduleVisible(false);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowedTypes = ['text/plain', 'application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    const maxSize = 5 * 1024 * 1024;
    if (!allowedTypes.includes(file.type) || file.size > maxSize) {
      alert('Chỉ hỗ trợ các định dạng .txt, .pdf, .docx với kích thước tối đa 5MB!');
      e.target.value = '';
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      const attachBtn = document.querySelector('.attach-btn') as HTMLButtonElement;
      attachBtn.disabled = true;
      attachBtn.style.opacity = '0.5';

      const response = await fetch(`${API_ENDPOINT}/upload`, {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();
      setChatHistory([...chatHistory, { sender: 'bot', text: data.message || 'Tải file lên thành công!' }]);
      renderChat();
      e.target.value = '';
    } catch (error) {
      setChatHistory([...chatHistory, { sender: 'bot', text: `Lỗi khi tải file lên: ${error}` }]);
      renderChat();
    } finally {
      const attachBtn = document.querySelector('.attach-btn') as HTMLButtonElement;
      attachBtn.disabled = false;
      attachBtn.style.opacity = '1';
    }
  };

  useEffect(() => {
    renderChat();
  }, [chatHistory, isDarkMode]);

  return (
    <div className={`flex h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-gray-100'}`}>
      <aside className={`sidebar w-16 sm:w-64 ${isDarkMode ? 'bg-gray-900' : 'bg-gray-800'} text-white p-4`}>
        <button
          id="sidebar-home"
          className={`w-full text-left p-2 rounded ${!isVoicePage && !isScheduleVisible ? 'bg-gray-700' : 'hover:bg-gray-700'}`}
          onClick={() => {
            setIsVoicePage(false);
            setIsScheduleVisible(false);
          }}
        >
          Chat
        </button>
        <button
          id="sidebar-voice"
          className={`w-full text-left p-2 rounded ${isVoicePage ? 'bg-gray-700' : 'hover:bg-gray-700'}`}
          onClick={() => {
            setIsVoicePage(true);
            setIsScheduleVisible(false);
          }}
        >
          Giọng nói
        </button>
        <button
          id="sidebar-schedule"
          className={`w-full text-left p-2 rounded ${isScheduleVisible ? 'bg-gray-700' : 'hover:bg-gray-700'}`}
          onClick={() => {
            setIsVoicePage(false);
            setIsScheduleVisible(true);
          }}
        >
          Schedule
        </button>
      </aside>
      <main className="flex-1 p-4">
        <div className="flex justify-end mb-2">
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className={`px-4 py-2 rounded ${isDarkMode ? 'bg-gray-600' : 'bg-blue-500'} text-white`}
          >
            {isDarkMode ? 'Light Mode' : 'Dark Mode'}
          </button>
        </div>
        {isVoicePage ? (
          <VoicePage />
        ) : isScheduleVisible ? (
          <form id="schedule-form" className="mt-4 space-y-2" onSubmit={handleScheduleSubmit}>
            <input
              id="event-title"
              type="text"
              value={scheduleEvent.title}
              onChange={(e) => setScheduleEvent({ ...scheduleEvent, title: e.target.value })}
              className={`border rounded-lg p-2 w-full ${isDarkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-black'}`}
              placeholder="Tiêu đề"
            />
            <input
              id="event-datetime"
              type="datetime-local"
              value={scheduleEvent.datetime}
              onChange={(e) => setScheduleEvent({ ...scheduleEvent, datetime: e.target.value })}
              className={`border rounded-lg p-2 w-full ${isDarkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-black'}`}
            />
            <button type="submit" className="bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 w-full">
              Tạo lịch
            </button>
          </form>
        ) : (
          <>
            <div id="chatbox" ref={chatboxRef} className={`bg-white rounded-lg shadow-md p-4 max-h-[80vh] overflow-y-auto ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}></div>
            <form id="chat-form" className="mt-4 flex space-x-2" onSubmit={handleSubmit}>
              <input
                id="chat-input"
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                className={`border rounded-lg p-2 flex-1 ${isDarkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-black'}`}
                onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSubmit(e as any)}
              />
              <input id="file-input" type="file" className="hidden" onChange={handleFileUpload} />
              <button type="submit" className="bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600">
                Gửi
              </button>
              <button
                type="button"
                className="attach-btn bg-gray-500 text-white p-2 rounded-lg hover:bg-gray-600"
                onClick={() => document.getElementById('file-input')?.click()}
              >
                📎
              </button>
            </form>
          </>
        )}
      </main>
    </div>
  );
};

export default App;