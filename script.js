// script.js

// State
let messages = [];
let nextId = 1;

const avatarColors = [
    { bg: '#103629', text: '#2CD46E' },
    { bg: '#242446', text: '#A18DFD' },
    { bg: '#082C3C', text: '#52BEE8' },
    { bg: '#34271F', text: '#C89E80' },
    { bg: '#311624', text: '#F2A7B4' }
];
let selectedAvatarColor = avatarColors[0];

// SVG Icons
const svgs = {
    sent: `<svg viewBox="0 0 11 14" width="11" height="14" class="tick-grey"><path fill="currentColor" d="M9.36 2.054l-6.19 8.212a.324.324 0 0 1-.498.037l-2.48-2.316a.428.428 0 0 0-.594.02l-.428.444a.345.345 0 0 0 .016.495l3.208 2.998c.147.137.376.12.502-.047L9.932 2.656a.355.355 0 0 0-.05-.51l-.424-.34a.372.372 0 0 0-.498.046z"/></svg>`,
    delivered: `<svg viewBox="0 0 16 15" width="16" height="15" class="tick-grey"><path fill="currentColor" d="M15.01 3.316l-.478-.372a.365.365 0 0 0-.51.063L8.666 9.879a.32.32 0 0 1-.484.033l-.358-.325a.319.319 0 0 0-.484.032l-.378.483a.418.418 0 0 0 .036.541l1.32 1.266c.143.14.361.125.484-.033l6.272-8.048a.366.366 0 0 0-.064-.512zm-4.1 0l-.478-.372a.365.365 0 0 0-.51.063L4.566 9.879a.32.32 0 0 1-.484.033L1.891 7.769a.366.366 0 0 0-.515.006l-.423.433a.364.364 0 0 0 .006.514l3.258 3.185c.143.14.361.125.484-.033l6.272-8.048a.365.365 0 0 0-.063-.51z"/></svg>`,
    read: `<svg viewBox="0 0 16 15" width="16" height="15" class="tick-blue"><path fill="currentColor" d="M15.01 3.316l-.478-.372a.365.365 0 0 0-.51.063L8.666 9.879a.32.32 0 0 1-.484.033l-.358-.325a.319.319 0 0 0-.484.032l-.378.483a.418.418 0 0 0 .036.541l1.32 1.266c.143.14.361.125.484-.033l6.272-8.048a.366.366 0 0 0-.064-.512zm-4.1 0l-.478-.372a.365.365 0 0 0-.51.063L4.566 9.879a.32.32 0 0 1-.484.033L1.891 7.769a.366.366 0 0 0-.515.006l-.423.433a.364.364 0 0 0 .006.514l3.258 3.185c.143.14.361.125.484-.033l6.272-8.048a.365.365 0 0 0-.063-.51z"/></svg>`,
    forwarded: `<svg viewBox="0 0 24 24"><path fill="currentColor" d="M10 9V5l9 7-9 7v-4.1c-5 0-8.5 1.6-11 5.1 1-5 4-10 11-11z"/></svg>`,
    deleted: `<svg viewBox="0 0 24 24" height="24" width="24" preserveAspectRatio="xMidYMid meet" fill="none"><path fill="currentColor" fill-rule="evenodd" d="M7.76 6.43a7 7 0 0 1 9.81 9.81l-9.81-9.8Zm-1.4 1.43a7 7 0 0 0 9.79 9.79l-9.8-9.8ZM12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18Z" clip-rule="evenodd"></path></svg>`
};

// DOM Elements
const waContactName = document.getElementById('wa-contact-name');
const waContactStatus = document.getElementById('wa-contact-status');
const waAvatarFallback = document.getElementById('wa-avatar-fallback');
const waAvatarImg = document.getElementById('wa-avatar-img');
const waAvatarContainer = waAvatarFallback.parentElement;

const inputContactName = document.getElementById('contact-name-input');
const inputContactStatus = document.getElementById('contact-status-input');
const inputProfileUpload = document.getElementById('profile-upload');

const msgControlList = document.getElementById('messages-control-list');
const waChatBody = document.getElementById('wa-chat-body');

// Modal Elements
const openGuideBtn = document.getElementById('open-guide-btn');
const closeGuideBtn = document.getElementById('close-guide-btn');
const aiGuideModal = document.getElementById('ai-guide-modal');
const aiGuideMarkdown = document.getElementById('ai-guide-markdown');

const aiGuideContent = `# PANDUAN LENGKAP AI AGENT - FAKE CHAT GENERATOR

## 1. STRUKTUR APLIKASI
Aplikasi ini adalah Web-based Fake Chat Generator bergaya WhatsApp Android (Dark Mode).
Dibangun murni menggunakan HTML, CSS (Vanilla), dan Vanilla JavaScript tanpa framework tambahan.
- \`index.html\`: Mengandung layout utama, dibagi menjadi dua panel: Kiri (Kontrol/Input) dan Kanan (Live Preview).
- \`style.css\`: Memuat semua styling. Variabel CSS digunakan di \`:root\` untuk memudahkan kustomisasi tema warna.
- \`script.js\`: Mengelola *state* pesan, logika *rendering*, dan fungsi *export* (via \`html2canvas\`).

## 2. STATE MANAGEMENT (Logika Inti)
Seluruh pesan disimpan dalam satu *array of objects* global bernama \`messages\`.
- Setiap objek memiliki format: \`{ id, type, contentType, text, isDeleted, time, ... }\`.
- Fungsi \`addMessage(type)\` bertugas membuat objek baru dan memasukannya ke \`messages\`.
- Fungsi \`renderApp()\` akan dipanggil setelah setiap perubahan *state*. Fungsi ini akan membersihkan *container* UI (\`waChatBody.innerHTML = ''\`) dan membangun ulang seluruh DOM chat berdasarkan array \`messages\` saat ini.

## 3. LOGIKA RENDERING CHAT
Saat membangun UI chat, perhatikan class CSS yang krusial:
- \`.wa-bubble-in\`: Untuk pesan masuk (kiri).
- \`.wa-bubble-out\`: Untuk pesan keluar (kanan, hijau).
- \`isDeleted\`: Jika *true*, render pesan dihapus dengan ikon trash/blocked.
- **HTML2Canvas Hack**: Elemen penyusun teks pesan menggunakan \`<span>\` (yang diciptakan via \`document.createElement('span')\`) alih-alih \`<div>\` agar \`html2canvas\` tidak mengabaikan spasi dan baris baru (\`<br>\`).
- **Grouping / Chat Tail**: Jika pesan dikirim secara berurutan oleh pengirim yang sama, CSS \`.wa-bubble-wrapper.no-tail\` secara dinamis menghapus ujung segitiga (*tail*) pada chat bubble. Ekor chat hanya muncul pada pesan pertama di setiap urutan berurutan (kecuali dipisah hari).

## 4. SISTEM TEMA AVATAR & REPLY
- Jika foto profil kosong, sistem menggunakan huruf awal nama dengan fallback "S".
- Tersedia 5 skema warna HEX default (berpasangan warna Background dan Teks).
- Tema warna ini tidak hanya mewarnai fallback avatar, tapi **secara dinamis disuntikkan** sebagai \`border-color\` dan teks nama pada UI "*Balas Pesan*" (\`.wa-reply-box\`) via inline styles di JavaScript.

## 5. FITUR EXPORT
- Menggunakan library pihak ketiga \`html2canvas\` (dimuat via CDN).
- Tombol export akan mengambil tangkapan elemen \`.whatsapp-preview\` dan mengunduhnya sebagai file \`.png\`.
- Karena ini adalah elemen DOM yang di-render ke kanvas, hindari CSS kompleks seperti \`filter\` atau elemen eksternal tanpa CORS yang dapat merusak proses render.

## 6. TIPS UNTUK AI SELANJUTNYA
- **JANGAN** pernah mengubah logika dasar \`messages\` array dan struktur \`renderApp()\` yang membangun DOM satu per satu, karena jika rusak akan menghancurkan *event binding* dan layout.
- **JANGAN** menggunakan fungsi \`innerHTML\` untuk memasukkan string langsung ke pembungkus teks (\`wa-bubble-text\`) karena ini akan menghancurkan aturan formatting whitespace yang dibuat untuk \`html2canvas\`. Gunakan \`document.createElement\` dan \`appendChild\` untuk membungkus teks.
- Jika menambah tombol kontrol baru, pastikan mendaftarkan *event listener*-nya di dalam fungsi \`init()\`.
`;

// Initial Setup
function init() {
    // Bind Profile inputs
    inputContactName.addEventListener('input', updateProfile);
    inputContactStatus.addEventListener('input', updateProfile);
    inputProfileUpload.addEventListener('change', updateProfilePic);
    
    // Bind Modal
    openGuideBtn.addEventListener('click', () => {
        aiGuideMarkdown.textContent = aiGuideContent;
        aiGuideModal.style.display = 'flex';
    });
    closeGuideBtn.addEventListener('click', () => {
        aiGuideModal.style.display = 'none';
    });
    // Close modal on outside click
    aiGuideModal.addEventListener('click', (e) => {
        if (e.target === aiGuideModal) aiGuideModal.style.display = 'none';
    });
    
    // Bind Add Buttons
    document.getElementById('add-date-btn').addEventListener('click', () => addMessage('date'));
    document.getElementById('add-incoming-btn').addEventListener('click', () => addMessage('in'));
    document.getElementById('add-outgoing-btn').addEventListener('click', () => addMessage('out'));
    document.getElementById('add-del-in-btn').addEventListener('click', () => addMessage('del-in'));
    document.getElementById('add-del-out-btn').addEventListener('click', () => addMessage('del-out'));
    
    // Bind Color Picker
    document.querySelectorAll('.color-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.color-btn').forEach(b => b.classList.remove('selected'));
            btn.classList.add('selected');
            const idx = parseInt(btn.getAttribute('data-idx'));
            selectedAvatarColor = avatarColors[idx];
            updateProfile();
        });
    });
    
    // Bind Export
    document.getElementById('export-btn').addEventListener('click', exportToPNG);

    updateProfile();
}

function updateProfile() {
    waContactName.textContent = inputContactName.value || ' ';
    waContactStatus.textContent = inputContactStatus.value || ' ';
    
    if (!waAvatarImg.src || waAvatarImg.style.display === 'none') {
        const initial = inputContactName.value ? inputContactName.value.charAt(0).toUpperCase() : 'S';
        waAvatarFallback.textContent = initial;
        waAvatarContainer.style.backgroundColor = selectedAvatarColor.bg;
        waAvatarContainer.style.color = selectedAvatarColor.text;
    }
}

function updateProfilePic(e) {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(event) {
            waAvatarImg.src = event.target.result;
            waAvatarImg.style.display = 'block';
            waAvatarFallback.style.display = 'none';
        };
        reader.readAsDataURL(file);
    } else {
        waAvatarImg.style.display = 'none';
        waAvatarFallback.style.display = 'block';
    }
}

// Time Helper
function formatWhatsAppDate(dateStr, lastDateStr) {
    if (!dateStr || !lastDateStr) return "Hari Ini";
    const d = new Date(dateStr + "T00:00:00");
    const lastD = new Date(lastDateStr + "T00:00:00");
    const diffDays = Math.round((lastD - d) / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return "Hari Ini";
    if (diffDays === 1) return "Kemarin";
    if (diffDays > 1 && diffDays < 7) {
        const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
        return days[d.getDay()];
    }
    const months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
    return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
}

function updateDateMessage(id, newDateStr) {
    const msgIndex = messages.findIndex(m => m.id === id);
    if (msgIndex === -1) return;
    if (!newDateStr) {
        renderControls();
        return;
    }
    let prevDate = null;
    for (let i = msgIndex - 1; i >= 0; i--) {
        if (messages[i].type === 'date' && messages[i].rawDate) { prevDate = messages[i].rawDate; break; }
    }
    let nextDate = null;
    for (let i = msgIndex + 1; i < messages.length; i++) {
        if (messages[i].type === 'date' && messages[i].rawDate) { nextDate = messages[i].rawDate; break; }
    }
    if (prevDate && newDateStr < prevDate) {
        alert("Tanggal tidak boleh sebelum tanggal bubble sebelumnya!");
        renderControls();
        return;
    }
    if (nextDate && newDateStr > nextDate) {
        alert("Tanggal tidak boleh sesudah tanggal bubble selanjutnya!");
        renderControls();
        return;
    }
    messages[msgIndex].rawDate = newDateStr;
    renderApp();
}

function getCurrentTimeFormatted() {
    const d = new Date();
    return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
}

function timeToMinutes(timeStr) {
    if(!timeStr) return 0;
    const parts = timeStr.split(':');
    return parseInt(parts[0]) * 60 + parseInt(parts[1]);
}

function getLastTime() {
    for (let i = messages.length - 1; i >= 0; i--) {
        if (messages[i].type !== 'date' && messages[i].time) {
            return messages[i].time;
        }
    }
    return getCurrentTimeFormatted();
}

function getPrevTimeInList(index) {
    for (let i = index - 1; i >= 0; i--) {
        if (messages[i].type !== 'date' && messages[i].time) {
            return messages[i].time;
        }
    }
    return null;
}

// Manage Messages
function addMessage(btnType) {
    const isDeleted = btnType.startsWith('del-');
    let baseType = btnType;
    let contentType = 'text';

    if (btnType.includes('-in') || btnType === 'in') {
        baseType = 'in';
    } else if (btnType.includes('-out') || btnType === 'out') {
        baseType = 'out';
    } else if (btnType === 'date') {
        baseType = 'date';
    }

    const newMsg = {
        id: 'msg_' + (nextId++),
        type: baseType,
        contentType: contentType,
        text: baseType === 'date' ? 'Hari Ini' : (isDeleted ? (baseType === 'in' ? 'Pesan ini dihapus' : 'Anda menghapus pesan ini') : (baseType === 'in' ? 'Pesan baru' : 'Balasan saya')),
        isDeleted: isDeleted,
        isForwarded: false,
        replyTo: ''
    };
    
    if (baseType === 'date') {
        let lastRaw = new Date().toISOString().split('T')[0];
        for (let i = messages.length - 1; i >= 0; i--) {
            if (messages[i].type === 'date' && messages[i].rawDate) {
                lastRaw = messages[i].rawDate;
                break;
            }
        }
        newMsg.rawDate = lastRaw;
    } else {
        newMsg.time = getLastTime();
    }
    if (baseType === 'out') {
        newMsg.status = 'read';
    }
    
    // Otomatisasi Centang Biru
    if (baseType === 'in') {
        messages.forEach(m => {
            if (m.type === 'out') m.status = 'read';
        });
    }

    messages.push(newMsg);
    renderApp();
}

function deleteMessage(id) {
    messages = messages.filter(m => m.id !== id);
    renderApp();
}

// Render Control Panel
function renderApp() {
    renderControls();
    renderPreview();
}

function renderControls() {
    msgControlList.innerHTML = '';
    
    messages.forEach((msg, index) => {
        const item = document.createElement('div');
        item.className = 'msg-ctrl-item';
        
        let title = '';
        if (msg.type === 'date') title = '📅 Date Bubble';
        else if (msg.type === 'in' && msg.isDeleted) title = '🗑️ Masuk (Dihapus)';
        else if (msg.type === 'out' && msg.isDeleted) title = '🗑️ Keluar (Dihapus)';
        else if (msg.type === 'in') title = '📥 Pesan Masuk';
        else if (msg.type === 'out') title = '📤 Pesan Keluar';
        
        item.innerHTML = `
            <div class="msg-ctrl-header">
                <span>${title}</span>
                <button class="del-btn" onclick="deleteMessage('${msg.id}')">Hapus</button>
            </div>
        `;
        
        const row = document.createElement('div');
        row.className = 'msg-ctrl-row';
        
        // Content Switch
        if (msg.type === 'date') {
            const dateWrapper = document.createElement('div');
            dateWrapper.className = 'form-group';
            dateWrapper.style.flex = '2';
            dateWrapper.innerHTML = `<label>Tanggal</label>`;
            const dateInput = document.createElement('input');
            dateInput.type = 'date';
            dateInput.value = msg.rawDate || '';
            dateInput.addEventListener('change', (e) => {
                updateDateMessage(msg.id, e.target.value);
            });
            dateWrapper.appendChild(dateInput);
            row.appendChild(dateWrapper);
        } else {
            // Options Row (Forwarded, Reply)
            if (!msg.isDeleted) {
                const optionsRow = document.createElement('div');
                optionsRow.className = 'msg-ctrl-row';
                optionsRow.style.marginBottom = '10px';
                
                // Reply Dropdown
                const replyWrapper = document.createElement('div');
                replyWrapper.className = 'form-group';
                replyWrapper.style.flex = '2';
                replyWrapper.style.marginBottom = '0';
                let optionsHtml = `<option value="">-- Balas Pesan --</option>`;
                messages.forEach(m => {
                    if (m.type !== 'date' && m.id !== msg.id && !m.isDeleted) {
                        const sender = m.type === 'in' ? (inputContactName.value || 'Contact') : 'Anda';
                        const snippet = m.text.substring(0, 20) + (m.text.length > 20 ? '...' : '');
                        optionsHtml += `<option value="${m.id}" ${msg.replyTo === m.id ? 'selected' : ''}>${sender}: ${snippet}</option>`;
                    }
                });
                replyWrapper.innerHTML = `
                    <select>${optionsHtml}</select>
                `;
                replyWrapper.querySelector('select').addEventListener('change', (e) => {
                    msg.replyTo = e.target.value;
                    renderPreview();
                });
                optionsRow.appendChild(replyWrapper);
                
                // Forwarded Checkbox
                const fwdWrapper = document.createElement('div');
                fwdWrapper.className = 'form-group';
                fwdWrapper.style.display = 'flex';
                fwdWrapper.style.alignItems = 'center';
                fwdWrapper.style.gap = '5px';
                fwdWrapper.style.marginBottom = '0';
                fwdWrapper.innerHTML = `
                    <input type="checkbox" ${msg.isForwarded ? 'checked' : ''} id="fwd_${msg.id}">
                    <label for="fwd_${msg.id}" style="margin:0; font-weight:normal;">Diteruskan</label>
                `;
                fwdWrapper.querySelector('input').addEventListener('change', (e) => {
                    msg.isForwarded = e.target.checked;
                    renderPreview();
                });
                optionsRow.appendChild(fwdWrapper);
                
                item.appendChild(optionsRow);
            }
            
            // Content Inputs based on contentType
            const contentWrapper = document.createElement('div');
            contentWrapper.style.flex = '2';
            contentWrapper.style.display = 'flex';
            contentWrapper.style.flexDirection = 'column';
            contentWrapper.style.gap = '10px';

            if (msg.contentType === 'img' || msg.contentType === 'vid' || msg.contentType === 'stiker') {
                const label = msg.contentType === 'img' ? 'Upload Gambar' : (msg.contentType === 'vid' ? 'Upload Video Thumbnail' : 'Upload Stiker');
                contentWrapper.innerHTML += `
                    <div class="form-group" style="margin-bottom:0;">
                        <label>${label}</label>
                        <input type="file" accept="image/*" onchange="window.updateMedia('${msg.id}', this.files[0])">
                    </div>
                `;
                if (msg.contentType === 'img' || msg.contentType === 'vid') {
                    contentWrapper.innerHTML += `
                        <div class="form-group" style="margin-bottom:0;">
                            <label>Caption Teks</label>
                            <textarea rows="1" oninput="window.updateMessageText('${msg.id}', this.value)">${msg.text}</textarea>
                        </div>
                    `;
                }
                if (msg.contentType === 'vid') {
                    contentWrapper.innerHTML += `
                        <div class="form-group" style="margin-bottom:0;">
                            <label>Durasi Video (Contoh: 0.15)</label>
                            <input type="text" value="${msg.vidDuration || '0.15'}" oninput="window.updateMessageVidDuration('${msg.id}', this.value)">
                        </div>
                    `;
                }
            } else if (msg.contentType === 'vn') {
                contentWrapper.innerHTML += `
                    <div class="form-group" style="margin-bottom:0;">
                        <label>Durasi VN (Contoh: 0.15)</label>
                        <input type="text" value="${msg.vnDuration || '0.00'}" oninput="window.updateMessageVnDuration('${msg.id}', this.value)">
                    </div>
                `;
            } else {
                contentWrapper.innerHTML += `
                    <div class="form-group" style="margin-bottom:0;">
                        <label>Teks</label>
                        <textarea rows="2" oninput="window.updateMessageText('${msg.id}', this.value)" ${msg.isDeleted ? 'disabled' : ''}>${msg.text}</textarea>
                    </div>
                `;
            }
            row.appendChild(contentWrapper);
            
            // Time & Status
            const timeWrapper = document.createElement('div');
            timeWrapper.className = 'form-group';
            timeWrapper.innerHTML = `
                <label>Waktu</label>
                <input type="time" value="${msg.time}">
                <div class="error-msg">Waktu tidak boleh mundur.</div>
            `;
            const timeInput = timeWrapper.querySelector('input');
            const errorMsg = timeWrapper.querySelector('.error-msg');
            
            timeInput.addEventListener('input', (e) => {
                const newTime = e.target.value;
                const prevTime = getPrevTimeInList(index);
                
                if (prevTime && timeToMinutes(newTime) < timeToMinutes(prevTime)) {
                    timeInput.classList.add('error');
                    errorMsg.style.display = 'block';
                } else {
                    timeInput.classList.remove('error');
                    errorMsg.style.display = 'none';
                    msg.time = newTime;
                    renderPreview();
                }
            });
            row.appendChild(timeWrapper);
            
            if (msg.type === 'out') {
                const statusWrapper = document.createElement('div');
                statusWrapper.className = 'form-group';
                statusWrapper.innerHTML = `
                    <label>Status</label>
                    <select>
                        <option value="sent" ${msg.status === 'sent' ? 'selected' : ''}>Terkirim (Centang 1)</option>
                        <option value="delivered" ${msg.status === 'delivered' ? 'selected' : ''}>Diterima (Centang 2 Abu)</option>
                        <option value="read" ${msg.status === 'read' ? 'selected' : ''}>Dibaca (Centang 2 Biru)</option>
                    </select>
                `;
                const statusSelect = statusWrapper.querySelector('select');
                statusSelect.addEventListener('change', (e) => {
                    msg.status = e.target.value;
                    renderPreview();
                });
                row.appendChild(statusWrapper);
            }
        }
        
        item.appendChild(row);
        msgControlList.appendChild(item);
    });
}

// Render Preview
function renderPreview() {
    waChatBody.innerHTML = '';
    
    let lastDateStr = new Date().toISOString().split('T')[0];
    for (let i = messages.length - 1; i >= 0; i--) {
        if (messages[i].type === 'date' && messages[i].rawDate) {
            lastDateStr = messages[i].rawDate;
            break;
        }
    }
    
    messages.forEach((msg, index) => {
        if (msg.type === 'date') {
            const div = document.createElement('div');
            div.className = 'wa-date';
            div.textContent = formatWhatsAppDate(msg.rawDate, lastDateStr) || msg.text;
            waChatBody.appendChild(div);
        } else {
            const wrapper = document.createElement('div');
            wrapper.className = `wa-bubble-wrapper wa-bubble-wrapper-${msg.type}`;
            
            let showTail = true;
            if (index > 0) {
                const prevMsg = messages[index - 1];
                if (prevMsg.type === msg.type) {
                    showTail = false;
                }
            }
            
            if (!showTail) {
                wrapper.classList.add('no-tail');
            }
            
            const bubble = document.createElement('div');
            bubble.className = `wa-bubble wa-bubble-${msg.type}`;
            
            // Forwarded Indicator
            if (msg.isForwarded && !msg.isDeleted) {
                const fwd = document.createElement('div');
                fwd.className = 'wa-forwarded';
                fwd.innerHTML = `${svgs.forwarded} Diteruskan`;
                bubble.appendChild(fwd);
            }
            
            // Replied Message
            if (msg.replyTo && !msg.isDeleted) {
                const targetMsg = messages.find(m => m.id === msg.replyTo);
                if (targetMsg) {
                    const replyBox = document.createElement('div');
                    replyBox.className = 'wa-reply-box';
                    
                    const isReplyingToMe = (targetMsg.type === 'out');
                    const replyColor = isReplyingToMe ? '#53BDEB' : selectedAvatarColor.text;
                    
                    replyBox.style.borderLeftColor = replyColor;
                    
                    const sender = document.createElement('div');
                    sender.className = 'wa-reply-sender';
                    sender.style.color = replyColor;
                    sender.textContent = isReplyingToMe ? 'Anda' : (inputContactName.value || 'Sayang');
                    
                    const text = document.createElement('div');
                    text.className = 'wa-reply-text';
                    text.textContent = targetMsg.text; 
                    
                    replyBox.appendChild(sender);
                    replyBox.appendChild(text);
                    bubble.appendChild(replyBox);
                }
            }
            
            // Encode html tags for text
            const textContent = document.createElement('span');
            textContent.className = msg.isDeleted ? 'wa-deleted' : 'wa-bubble-text';

            const escapeHtml = (text) => {
                const div = document.createElement('div');
                div.textContent = text;
                return div.innerHTML;
            };

            if (msg.isDeleted) {
                textContent.innerHTML = `${svgs.deleted} ${msg.text}`;
                bubble.appendChild(textContent);
            } else {
                textContent.innerHTML = escapeHtml(msg.text).replace(/\n/g, '<br>');
                bubble.appendChild(textContent);
            }
            
            const meta = document.createElement('span');
            meta.className = 'wa-bubble-meta';
            
            let metaHtml = `<span class="wa-time">${msg.time}</span>`;
            if (msg.type === 'out' && !msg.isDeleted) {
                metaHtml += `<span class="wa-tick">${svgs[msg.status] || svgs.read}</span>`;
            }
            
            meta.innerHTML = metaHtml;
            
            bubble.appendChild(meta);
            
            // For outgoing bubbles, ::after is used for the chat tail,
            // so add a separate clearfix element for the float layout
            if (msg.type === 'out') {
                const clearfix = document.createElement('div');
                clearfix.className = 'wa-bubble-clearfix';
                bubble.appendChild(clearfix);
            }
            
            wrapper.appendChild(bubble);
            waChatBody.appendChild(wrapper);
        }
    });
    
    // Auto scroll to bottom in real app, but for preview let's let it be.
}

// Export Engine
function exportToPNG() {
    const container = document.getElementById('live-preview-container');
    const contactName = inputContactName.value || 'Contact';
    
    // Hide scrollbars if any inside preview
    container.style.overflow = 'visible';
    
    html2canvas(container, {
        scale: 3, // High resolution
        useCORS: true,
        backgroundColor: null
    }).then(canvas => {
        // Revert style
        container.style.overflow = 'hidden';
        
        const imgData = canvas.toDataURL('image/png');
        
        const timestamp = new Date().getTime();
        const fileName = `WA_FakeChat_${contactName.replace(/[^a-z0-9]/gi, '_')}_${timestamp}.png`;
        
        const a = document.createElement('a');
        a.href = imgData;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    }).catch(err => {
        container.style.overflow = 'hidden';
        console.error("Export Error:", err);
        alert("Gagal mengekspor gambar. Pastikan tidak ada masalah keamanan CORS pada browser Anda.");
    });
}

// Start
init();

window.updateMessageText = function(id, val) {
    const msg = messages.find(m => m.id === id);
    if (msg) { msg.text = val; renderPreview(); }
}
window.updateMedia = function(id, file) {
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const msg = messages.find(m => m.id === id);
            if (msg) {
                msg.mediaUrl = e.target.result;
                renderPreview();
            }
        };
        reader.readAsDataURL(file);
    }
}
window.updateMessageVidDuration = function(id, val) {
    const msg = messages.find(m => m.id === id);
    if (msg) { msg.vidDuration = val; renderPreview(); }
}
window.updateMessageVnDuration = function(id, val) {
    const msg = messages.find(m => m.id === id);
    if (msg) { msg.vnDuration = val; renderPreview(); }
}
