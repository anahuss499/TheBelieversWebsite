// PDF Library Management
class BookLibrary {
    constructor() {
        this.books = [
            {
                id: 'at-tawhid',
                title: 'Kitaab At-Tawhid',
                author: 'Imam Muhammad ibn Abdul-Wahhab',
                description: 'The Book of Monotheism - A foundational Islamic text on the concept of Tawhid.',
                fileName: 'at-tawhid.pdf',
                pages: null
            },
            {
                id: 'sahih-bukhari',
                title: 'Sahih Al-Bukhari',
                author: 'Imam Al-Bukhari',
                description: 'One of the most authentic collections of Hadith (Prophetic traditions).',
                fileName: 'sahih-bukhari.pdf',
                pages: null
            },
            {
                id: 'riyad-as-salihin',
                title: 'Riyad As-Salihin',
                author: 'Imam An-Nawawi',
                description: 'The Gardens of the Righteous - A collection of Quranic verses and Hadith.',
                fileName: 'riyad-as-salihin.pdf',
                pages: null
            }
        ];

        this.currentPdf = null;
        this.currentPageNum = 1;
        this.totalPages = 0;
        this.pdfDoc = null;

        this.init();
    }

    init() {
        this.setupPdfWorker();
        this.renderBooks();
        this.setupEventListeners();
    }

    setupPdfWorker() {
        // Set up PDF.js worker
        if (typeof pdfjsLib !== 'undefined') {
            pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
        }
    }

    renderBooks() {
        const container = document.getElementById('booksContainer');
        const emptyState = document.getElementById('emptyState');

        if (!container) return;

        // Check if any books actually exist in the /books/ directory
        // For now, render all books (user will add PDFs to /books/ folder)
        if (this.books.length === 0) {
            emptyState.style.display = 'block';
            container.innerHTML = '';
            return;
        }

        container.innerHTML = this.books.map(book => `
            <div class="book-card">
                <div class="book-icon">📖</div>
                <h3 class="book-title">${this.escapeHtml(book.title)}</h3>
                <p class="book-author">by ${this.escapeHtml(book.author)}</p>
                <p class="book-description">${this.escapeHtml(book.description)}</p>
                <div class="book-meta">
                    <span>PDF Document</span>
                </div>
                <div class="book-actions">
                    <button class="book-btn download" onclick="bookLibrary.downloadBook('${book.fileName}')">
                        <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"/>
                        </svg>
                        Download
                    </button>
                    <button class="book-btn view" onclick="bookLibrary.viewBook('${book.id}', '${this.escapeHtml(book.title)}', '${book.fileName}')">
                        <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                            <circle cx="12" cy="12" r="3"/>
                        </svg>
                        View
                    </button>
                </div>
            </div>
        `).join('');

        emptyState.style.display = 'none';
    }

    downloadBook(fileName) {
        const filePath = `books/${fileName}`;
        
        // Create a temporary anchor element to trigger download
        const link = document.createElement('a');
        link.href = filePath;
        link.download = fileName;
        
        // Append to body, click, and remove
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        // Show notification
        this.showNotification(`Downloading ${fileName}...`);
    }

    async viewBook(bookId, bookTitle, fileName) {
        const modal = document.getElementById('pdfModal');
        const titleEl = document.getElementById('pdfTitle');
        const canvas = document.getElementById('pdf-canvas');
        
        if (!modal || !titleEl || !canvas) return;

        titleEl.textContent = bookTitle;
        this.currentPdf = {id: bookId, title: bookTitle, fileName};
        this.currentPageNum = 1;

        // Show modal
        modal.classList.add('active');

        try {
            const filePath = `books/${fileName}`;
            
            // Load PDF
            this.pdfDoc = await pdfjsLib.getDocument(filePath).promise;
            this.totalPages = this.pdfDoc.numPages;

            // Render first page
            await this.renderPage(1);
        } catch (error) {
            console.error('Error loading PDF:', error);
            this.showNotification('Error loading PDF file. Make sure it exists in the /books/ folder.');
            modal.classList.remove('active');
        }
    }

    async renderPage(pageNum) {
        if (!this.pdfDoc) return;

        try {
            const page = await this.pdfDoc.getPage(pageNum);
            const canvas = document.getElementById('pdf-canvas');
            const ctx = canvas.getContext('2d');
            
            // Set canvas size based on page size
            const viewport = page.getViewport({ scale: 1.5 });
            canvas.width = viewport.width;
            canvas.height = viewport.height;

            // Render page
            await page.render({
                canvasContext: ctx,
                viewport: viewport
            }).promise;

            this.currentPageNum = pageNum;
        } catch (error) {
            console.error('Error rendering page:', error);
        }
    }

    setupEventListeners() {
        // Close PDF modal
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closePdfViewer();
            }
        });

        // Close on modal background click
        const modal = document.getElementById('pdfModal');
        if (modal) {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    this.closePdfViewer();
                }
            });
        }
    }

    closePdfViewer() {
        const modal = document.getElementById('pdfModal');
        if (modal) {
            modal.classList.remove('active');
        }
        this.pdfDoc = null;
        this.currentPageNum = 1;
    }

    addBook(book) {
        this.books.push(book);
        this.renderBooks();
    }

    removeBook(bookId) {
        this.books = this.books.filter(b => b.id !== bookId);
        this.renderBooks();
    }

    showNotification(message) {
        // Create a simple notification
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            bottom: 2rem;
            right: 2rem;
            background: #2dd414;
            color: #000;
            padding: 1rem 1.5rem;
            border-radius: 0.75rem;
            font-weight: 600;
            z-index: 10001;
            box-shadow: 0 8px 20px rgba(45, 212, 20, 0.4);
            animation: slideIn 0.3s ease;
        `;
        notification.textContent = message;
        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// Initialize library when DOM is ready
let bookLibrary;
document.addEventListener('DOMContentLoaded', () => {
    bookLibrary = new BookLibrary();
});

// Global function for closing PDF viewer
function closePdfViewer() {
    if (bookLibrary) {
        bookLibrary.closePdfViewer();
    }
}

// Add animations for notifications
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }

    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);
