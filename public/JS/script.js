// ============================================
// LOADING SCREEN
// ============================================
window.addEventListener('load', () => {
    setTimeout(() => {
        document.getElementById('loader').classList.add('hidden');
        startTyping();
        runTerminalSimulation();
    }, 1800);
});

// ============================================
// MATRIX RAIN
// ============================================
const canvas = document.getElementById('matrix-bg');
const ctx = canvas.getContext('2d');
function resizeCanvas() { canvas.width = window.innerWidth; canvas.height = window.innerHeight; }
resizeCanvas();
window.addEventListener('resize', resizeCanvas);
const chars = 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789ABCDEF{}[]<>/\\|';
const charArray = chars.split('');
const fontSize = 14;
let columns = Math.floor(canvas.width / fontSize);
let drops = Array(columns).fill(1);
function drawMatrix() {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#00ff41';
    ctx.font = fontSize + 'px monospace';
    for (let i = 0; i < drops.length; i++) {
        const text = charArray[Math.floor(Math.random() * charArray.length)];
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);
        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) drops[i] = 0;
        drops[i]++;
    }
}
setInterval(drawMatrix, 50);
window.addEventListener('resize', () => { columns = Math.floor(canvas.width / fontSize); drops = Array(columns).fill(1); });

// ============================================
// TYPING EFFECT
// ============================================
const typingPhrases = ['> Deploying local AI infrastructure...', '> All data stays on your machine.', '> No cloud. No tracking. No telemetry.', '> $ ollama run llama3.2', '> System ready. Awaiting input...', '> GPU acceleration: ENABLED', '> Connection: OFFLINE // SECURE'];
let phraseIndex = 0, charIndex = 0, isDeleting = false;
const typingEl = document.getElementById('typingText');
function startTyping() {
    const current = typingPhrases[phraseIndex];
    if (isDeleting) { typingEl.textContent = current.substring(0, charIndex - 1); charIndex--; } 
    else { typingEl.textContent = current.substring(0, charIndex + 1); charIndex++; }
    let speed = isDeleting ? 30 : 60;
    if (!isDeleting && charIndex === current.length) { speed = 2000; isDeleting = true; } 
    else if (isDeleting && charIndex === 0) { isDeleting = false; phraseIndex = (phraseIndex + 1) % typingPhrases.length; speed = 500; }
    setTimeout(startTyping, speed);
}

// ============================================
// NAVBAR SCROLL
// ============================================
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
    const sections = document.querySelectorAll('section[id]');
    const scrollPos = window.scrollY + 100;
    sections.forEach(section => {
        const top = section.offsetTop, height = section.offsetHeight, id = section.getAttribute('id');
        if (scrollPos >= top && scrollPos < top + height) {
            document.querySelectorAll('.nav-links a').forEach(link => {
                link.classList.toggle('active', link.getAttribute('href') === '#' + id);
            });
        }
    });
});

// ============================================
// OS TABS
// ============================================
document.querySelectorAll('.os-tab').forEach(tab => {
    tab.addEventListener('click', () => {
        document.querySelectorAll('.os-tab').forEach(t => t.classList.remove('active'));
        document.querySelectorAll('.os-content').forEach(c => c.classList.remove('active'));
        tab.classList.add('active');
        document.getElementById(tab.dataset.tab).classList.add('active');
    });
});

// ============================================
// COPY CODE
// ============================================
function copyCode(btn) {
    const codeBlock = btn.closest('.code-block');
    const code = codeBlock.querySelector('.code-content').textContent;
    navigator.clipboard.writeText(code).then(() => {
        btn.textContent = 'Copied!'; btn.classList.add('copied');
        setTimeout(() => { btn.textContent = 'Copy'; btn.classList.remove('copied'); }, 2000);
    });
}

// ============================================
// MODALS
// ============================================
document.getElementById('loginBtn').addEventListener('click', () => { window.location.href = 'login.html'; });
document.getElementById('registerBtn').addEventListener('click', () => { window.location.href = 'login.html'; });
function closeModal(id) { document.getElementById(id).classList.remove('active'); }
function switchModal(from, to) { closeModal(from); setTimeout(() => document.getElementById(to).classList.add('active'), 200); }
document.querySelectorAll('.modal-overlay').forEach(overlay => overlay.addEventListener('click', (e) => { if (e.target === overlay) overlay.classList.remove('active'); }));
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') document.querySelectorAll('.modal-overlay').forEach(m => m.classList.remove('active')); });

// ============================================
// LOGIN/REGISTER HANDLERS
// ============================================
function handleLogin() {
    const user = document.getElementById('loginUser').value, pass = document.getElementById('loginPass').value, status = document.getElementById('loginStatus');
    if (!user || !pass) { status.className = 'login-status error'; status.textContent = '> ERROR: Credentials required'; return; }
    status.className = 'login-status'; status.style.color = 'var(--orange)'; status.textContent = '> Authenticating...';
    setTimeout(() => { status.style.color = 'var(--cyan)'; status.textContent = '> Verifying hash...'; setTimeout(() => { status.className = 'login-status success'; status.textContent = '> ACCESS GRANTED // Welcome, ' + user; setTimeout(() => { closeModal('loginModal'); document.getElementById('loginUser').value = ''; document.getElementById('loginPass').value = ''; status.textContent = ''; }, 2000); }, 800); }, 600);
}
document.getElementById('loginPass').addEventListener('keydown', (e) => { if (e.key === 'Enter') handleLogin(); });

function handleRegister() {
    const user = document.getElementById('regUser').value, pass = document.getElementById('regPass').value, confirm = document.getElementById('regConfirm').value, status = document.getElementById('registerStatus');
    if (!user || !document.getElementById('regEmail').value || !pass) { status.className = 'login-status error'; status.textContent = '> ERROR: All fields required'; return; }
    if (pass !== confirm) { status.className = 'login-status error'; status.textContent = '> ERROR: Passwords do not match'; return; }
    status.className = 'login-status'; status.style.color = 'var(--orange)'; status.textContent = '> Generating access token...';
    setTimeout(() => { status.style.color = 'var(--cyan)'; status.textContent = '> Encrypting credentials...'; setTimeout(() => { status.className = 'login-status success'; status.textContent = '> TOKEN GENERATED // Access granted for ' + user; setTimeout(() => { closeModal('registerModal'); document.getElementById('regUser').value = ''; document.getElementById('regEmail').value = ''; document.getElementById('regPass').value = ''; document.getElementById('regConfirm').value = ''; status.textContent = ''; }, 2000); }, 800); }, 600);
}
document.getElementById('regConfirm').addEventListener('keydown', (e) => { if (e.key === 'Enter') handleRegister(); });

// ============================================
// SCROLL REVEAL
// ============================================
const observer = new IntersectionObserver((entries) => { entries.forEach(entry => { if (entry.isIntersecting) entry.target.classList.add('visible'); }); }, { threshold: 0.1 });
document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

// ============================================
// TERMINAL SIMULATION
// ============================================
function runTerminalSimulation() {
    const terminal = document.getElementById('terminalOutput'); if (!terminal) return;
    const lines = [
        { text: '$ initializing ollama connection...', class: 'dim-line', delay: 500 },
        { text: '[OK] Service running on 127.0.0.1:11434', class: 'success-line', delay: 800 },
        { text: '[OK] GPU detected: NVIDIA RTX 4070 (8GB VRAM)', class: 'success-line', delay: 600 },
        { text: '[INFO] Pulling model: llama3.2...', class: 'info-line', delay: 1000 },
        { text: '  ████████████████████████████████ 100%', class: 'success-line', delay: 1500 },
        { text: '[OK] Model downloaded successfully (2.0 GB)', class: 'success-line', delay: 400 },
        { text: '[INFO] Starting inference engine...', class: 'info-line', delay: 800 },
        { text: '[OK] Model loaded in 1.2s', class: 'success-line', delay: 600 },
        { text: '[WARN] Temperature set to 0.8 (default)', class: 'warn-line', delay: 400 },
        { text: '[OK] System ready. Awaiting input.', class: 'success-line', delay: 600 },
        { text: '', class: '', delay: 200 },
        { text: '>>> Type your message or press Enter to begin.', class: 'info-line', delay: 500 }
    ];
    let totalDelay = 0;
    lines.forEach(line => { totalDelay += line.delay; setTimeout(() => { const div = document.createElement('div'); div.className = 'line ' + line.class; div.textContent = line.text; terminal.appendChild(div); terminal.scrollTop = terminal.scrollHeight; }, totalDelay); });
}

// ============================================
// CONSOLE EASTER EGG
// ============================================
console.log('%c[AiCrime]', 'color: #00ff41; font-size: 24px; font-weight: bold; text-shadow: 0 0 10px #00ff41;');
console.log('%c> System initialized. All inference is local.', 'color: #00ffff; font-size: 12px;');
console.log('%c> No data leaves your machine.', 'color: #00ff41; font-size: 12px;');