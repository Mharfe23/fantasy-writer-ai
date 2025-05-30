
import type { Book } from "@/pages/Book";

export const generatePDF = async (book: Book): Promise<void> => {
  // Create a new window with the book content for printing
  const printWindow = window.open('', '_blank');
  
  if (!printWindow) {
    throw new Error('Unable to open print window');
  }
  
  // Generate HTML content for the PDF
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>${book.title}</title>
      <style>
        @media print {
          body { margin: 0; }
          .page-break { page-break-before: always; }
        }
        
        body {
          font-family: 'Times New Roman', serif;
          line-height: 1.6;
          color: #333;
          max-width: 800px;
          margin: 0 auto;
          padding: 20px;
        }
        
        .cover {
          text-align: center;
          padding: 100px 0;
          page-break-after: always;
        }
        
        .cover h1 {
          font-size: 3em;
          margin-bottom: 20px;
          color: #2c3e50;
        }
        
        .cover .author {
          font-size: 1.5em;
          color: #7f8c8d;
          margin-bottom: 40px;
        }
        
        .cover .divider {
          width: 100px;
          height: 3px;
          background: #bdc3c7;
          margin: 40px auto;
        }
        
        .chapter {
          margin-bottom: 60px;
          page-break-inside: avoid;
        }
        
        .chapter-number {
          font-size: 1.2em;
          color: #3498db;
          font-weight: bold;
          margin-bottom: 20px;
        }
        
        .chapter-content {
          display: flex;
          gap: 30px;
          align-items: flex-start;
        }
        
        .chapter-text {
          flex: 1;
          font-size: 1.1em;
          line-height: 1.8;
        }
        
        .chapter-image {
          width: 300px;
          flex-shrink: 0;
        }
        
        .chapter-image img {
          width: 100%;
          height: auto;
          border-radius: 8px;
          box-shadow: 0 4px 8px rgba(0,0,0,0.1);
        }
        
        .page-number {
          text-align: center;
          margin-top: 40px;
          color: #95a5a6;
          font-size: 0.9em;
        }
        
        .end-page {
          text-align: center;
          padding: 100px 0;
          page-break-before: always;
        }
        
        .end-divider {
          width: 100px;
          height: 3px;
          background: #bdc3c7;
          margin: 40px auto 20px auto;
        }
        
        @media screen {
          body {
            background: #f8f9fa;
            padding: 40px 20px;
          }
          
          .cover, .chapter, .end-page {
            background: white;
            padding: 40px;
            margin-bottom: 20px;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
          }
        }
      </style>
    </head>
    <body>
      <!-- Cover page -->
      <div class="cover">
        <h1>${book.title}</h1>
        <div class="author">by ${book.author}</div>
        <div class="divider"></div>
        <div style="color: #95a5a6; font-size: 0.9em;">
          Created on ${book.createdAt.toLocaleDateString()}
        </div>
      </div>
      
      <!-- Chapters -->
      ${book.paragraphs.map((paragraph, index) => `
        <div class="chapter">
          <div class="chapter-number">Chapter ${index + 1}</div>
          <div class="chapter-content">
            <div class="chapter-text">
              ${paragraph.text}
            </div>
            ${paragraph.imageUrl ? `
              <div class="chapter-image">
                <img src="${paragraph.imageUrl}" alt="Chapter ${index + 1} illustration" />
              </div>
            ` : ''}
          </div>
          <div class="page-number">${index + 1}</div>
        </div>
      `).join('')}
      
      <!-- End page -->
      <div class="end-page">
        <div class="end-divider"></div>
        <h2>The End</h2>
        <p style="color: #95a5a6; margin-top: 20px;">
          Created with AI Book Creator
        </p>
      </div>
    </body>
    </html>
  `;
  
  printWindow.document.write(htmlContent);
  printWindow.document.close();
  
  // Wait for images to load before printing
  printWindow.onload = () => {
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 1000);
  };
};
