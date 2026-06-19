const documents = [
    {
        id: 'win-cmd',
        title: 'Windows Commands',
        fileUrl: 'pdfs/Windows_Commands.pdf'
    },
    {
        id: 'xss-2020',
        title: 'XSS Cheat Sheet 2020 edition',
        fileUrl: 'pdfs/XSS_Cheat_Sheet_2020_ed.pdf'
    },
    {
        id: 'sqli',
        title: 'SQL Injecion',
        fileUrl: 'pdfs/SQL_Injecion.pdf'
    },
    {
        id: 'docker-cli',
        title: 'Docker CLI Reference',
        description: 'Containers, Images, Networks, and Volumes cheat sheet.',
        fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
        size: '215 KB'
    },
    {
        id: 'linux-commands',
        title: 'Linux Command Line',
        description: 'File operations, process management, and system info.',
        fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
        size: '1.2 MB'
    }
];

// DOM Elements
const listView = document.getElementById('list-view');
const viewerView = document.getElementById('viewer-view');
const docList = document.getElementById('doc-list');
const viewerTitle = document.getElementById('viewer-title');
const pdfContainer = document.getElementById('pdf-container');
const themeToggleBtn = document.getElementById('theme-toggle');
const iconSun = document.getElementById('icon-sun');
const iconMoon = document.getElementById('icon-moon');

/**
 * 2. Render List Dokumen
 */
function renderDocumentList() {
    docList.innerHTML = '';
    documents.forEach(doc => {
        const item = document.createElement('div');
        item.className = 'doc-list-item';
        item.onclick = () => navigateToDocument(doc.id);
        
        item.innerHTML = `
            <div class="doc-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                    <polyline points="14 2 14 8 20 8"></polyline>
                    <line x1="16" y1="13" x2="8" y2="13"></line>
                    <line x1="16" y1="17" x2="8" y2="17"></line>
                    <polyline points="10 9 9 9 8 9"></polyline>
                </svg>
            </div>
            <div class="doc-title">${doc.title}</div>
        `;
        docList.appendChild(item);
    });
}

/**
 * 3. Routing & Navigation Logic (Single Page App Behavior)
 */
function navigateToDocument(id) {
    const doc = documents.find(d => d.id === id);
    if (!doc) return;

    // Update URL parameters without reloading
    try {
        const url = new URL(window.location);
        url.searchParams.set('doc', id);
        window.history.pushState({ docId: id }, '', url);
    } catch (e) {
        console.warn('History API diblokir di lingkungan pratinjau ini.');
    }

    showViewer(doc);
}

function navigateHome() {
    // Remove 'doc' param from URL
    try {
        const url = new URL(window.location);
        url.searchParams.delete('doc');
        window.history.pushState({}, '', url);
    } catch (e) {
        console.warn('History API diblokir di lingkungan pratinjau ini.');
    }

    showList();
}

function showViewer(doc) {
    // Update UI
    listView.style.display = 'none';
    viewerView.style.display = 'flex';
    viewerTitle.textContent = doc.title;
    
    // Set up iframe viewer
    pdfContainer.innerHTML = `
        <iframe 
            src="${doc.fileUrl}#toolbar=0&navpanes=0&scrollbar=1" 
            title="${doc.title}"
            loading="lazy">
            <p>Your browser does not support PDFs. 
            <a href="${doc.fileUrl}">Download the PDF</a>.</p>
        </iframe>
    `;
}

function showList() {
    listView.style.display = 'block';
    viewerView.style.display = 'none';
    pdfContainer.innerHTML = ''; // Clear iframe memory
}

function handleRoute() {
    const urlParams = new URLSearchParams(window.location.search);
    const docId = urlParams.get('doc');
    
    if (docId) {
        const doc = documents.find(d => d.id === docId);
        if (doc) {
            showViewer(doc);
        } else {
            navigateHome();
        }
    } else {
        showList();
    }
}

// Listen to browser Back/Forward buttons
window.addEventListener('popstate', handleRoute);

/**
 * 4. Theme Management (Dark Mode)
 */
function initTheme() {
    // Check local storage or system preference
    let savedTheme = null;
    try {
        savedTheme = localStorage.getItem('cheatsheetTheme');
    } catch (e) {
        console.warn('Akses localStorage diblokir di lingkungan pratinjau ini.');
    }
    
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
        setTheme('dark');
    } else {
        setTheme('light');
    }
}

function setTheme(theme) {
    if (theme === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
        iconMoon.classList.add('hidden');
        iconSun.classList.remove('hidden');
        try { localStorage.setItem('cheatsheetTheme', 'dark'); } catch(e) {}
    } else {
        document.documentElement.removeAttribute('data-theme');
        iconSun.classList.add('hidden');
        iconMoon.classList.remove('hidden');
        try { localStorage.setItem('cheatsheetTheme', 'light'); } catch(e) {}
    }
}

themeToggleBtn.addEventListener('click', () => {
    const isDark = document.documentElement.hasAttribute('data-theme');
    setTheme(isDark ? 'light' : 'dark');
});

/**
 * 5. Initialization
 */
renderDocumentList();
initTheme();
handleRoute();
