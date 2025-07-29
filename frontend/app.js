// API Endpoint
const API_ENDPOINT = 'http://localhost:8000';

// Chat History Management
let chatHistory = [];

function renderChat() {
    const chatbox = document.getElementById('chatbox');
    if (!chatbox) return;

    chatbox.innerHTML = '';
    chatHistory.forEach((msg) => {
        const div = document.createElement('div');
        div.className = `message ${msg.sender}`;

        if (msg.loading) {
            // Hiển thị hoạt ảnh "Đang suy nghĩ..." với các chấm nhấp nháy
            div.innerHTML = `<span class="thinking-animation">Đang suy nghĩ<span class="dots">...</span></span>`;
        } else {
            div.textContent = msg.text;
        }

        if (msg.loading) div.classList.add('loading');
        chatbox.appendChild(div);
    });

    // Cuộn tự động đến tin nhắn mới nhất
    chatbox.scrollTop = chatbox.scrollHeight;
}

// Xử lý gửi tin nhắn
const chatForm = document.getElementById('chat-form');
if (chatForm) {
    chatForm.onsubmit = async function (e) {
        e.preventDefault();
        const input = document.getElementById('chat-input');
        const text = input.value.trim();

        if (!text) return;

        // Thêm tin nhắn của người dùng
chatHistory.push({ sender: 'user', text });
        renderChat();

        // Thêm trạng thái loading
        chatHistory.push({ sender: 'bot', loading: true });
        renderChat();

        input.value = '';
        try {
            let responseText = '';

            // Kiểm tra nếu câu hỏi liên quan đến tên
            if (text.includes('tên') || text.includes('name')) {
                responseText = 'Mình tên là Grok, không biết mình có thể giúp gì được cho bạn.';
            } else {
                // Gửi yêu cầu đến API nếu không phải câu hỏi về tên
                const response = await fetch(`${API_ENDPOINT}/ask`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ text }),
                });
                if (!response.ok) throw new Error('Lỗi phản hồi từ server');

                const data = await response.json();
                responseText = data.reply || 'Không có phản hồi.';
            }

            // Loại bỏ trạng thái loading và thêm phản hồi
            chatHistory.pop();
            chatHistory.push({ sender: 'bot', text: data.reply });
            renderChat();
        } catch (error) {
            chatHistory.pop();
            chatHistory.push({ sender: 'bot', text: 'Không thể kết nối backend.' });
            renderChat();
        }
    };
}

// Xử lý upload file
const fileInput = document.getElementById('file-input');
const chatInput = document.getElementById('chat-input');

if (fileInput) {
    fileInput.addEventListener('change', async function (e) {
        const file = fileInput.files[0];
        if (!file) return;

        const allowedTypes = [
            'text/plain',
            'application/pdf',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        ];
        const maxSize = 5 * 1024 * 1024;

        if (!allowedTypes.includes(file.type)) {
            alert('Chỉ hỗ trợ các định dạng .txt, .pdf, .docx!');
            fileInput.value = '';
            return;
        }
        if (file.size > maxSize) {
            alert(`Kích thước file tối đa là ${maxSize / 1024 / 1024}MB!`);
            fileInput.value = '';
            return;
        }

        const attachBtn = document.querySelector('.attach-btn');
        attachBtn.disabled = true;
        attachBtn.style.opacity = '0.5';

        const formData = new FormData();
        formData.append('file', file);

        try {
            const res = await fetch(`${API_ENDPOINT}/upload`, {
                method: 'POST',
                body: formData,
            });
            attachBtn.disabled = false;
            attachBtn.style.opacity = '1';

            if (res.ok) {
                const data = await res.json();
                chatHistory.push({
                    sender: 'bot',
                    text: data.message || 'Tải file lên thành công!',
                });
                renderChat();
                fileInput.value = '';
            } else {
                const err = await res.json();
                chatHistory.push({
                    sender: 'bot',
                    text: 'Tải file lên thất bại! ' + (err.error || 'Lỗi không xác định.'),
                });
                renderChat();
                fileInput.value = '';
            }
        } catch (err) {
            chatHistory.push({
                sender: 'bot',
                text: 'Lỗi khi tải file lên: ' + err.message,
            });
            renderChat();
            attachBtn.disabled = false;
            attachBtn.style.opacity = '1';
            fileInput.value = '';
        }
    });
}

// Xử lý input
if (chatInput) {
    chatInput.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            chatForm.requestSubmit();
        } else if (e.key === 'Enter' && e.shiftKey) {
            e.preventDefault();
            chatInput.value += '\n';
        }
    });

    window.addEventListener('DOMContentLoaded', function () {
        chatInput.focus();
    });
}

// Sidebar functionality
const sidebar = document.querySelector('.sidebar');
const sidebarToggle = document.getElementById('sidebar-toggle');
const sidebarHome = document.getElementById('sidebar-home');
const sidebarSchedule = document.getElementById('sidebar-schedule');
const chatContainer = document.querySelector('.chat-container');
const scheduleForm = document.getElementById('schedule-form');

if (sidebarToggle) {
    sidebarToggle.addEventListener('click', () => {
        sidebar.classList.toggle('collapsed');
    });
}

if (sidebarHome && sidebarSchedule && chatContainer && scheduleForm) {
    sidebarHome.addEventListener('click', () => {
        sidebarHome.classList.add('active');
        sidebarSchedule.classList.remove('active');
        chatContainer.style.display = 'flex';
        scheduleForm.style.display = 'none';
        chatInput.focus();
    });

    sidebarSchedule.addEventListener('click', () => {
        sidebarSchedule.classList.add('active');
        sidebarHome.classList.remove('active');
        chatContainer.style.display = 'none';
        scheduleForm.style.display = 'flex';
    });
}