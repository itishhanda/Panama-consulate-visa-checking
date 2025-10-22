import { JSDOM } from 'jsdom';
import fs from 'fs';
import path from 'path';

// Map markdown files to their HTML counterparts
const contentMap = {
  'index.md': 'index.html',
  'tourist-visa.md': 'tourist-visa.html', 
  'special-transit-visa.md': 'special-transit-visa.html',
  'transit-visa.md': 'transit-visa.html'
};

// Function to convert markdown-like content to HTML
function markdownToHTML(content) {
  return content
    .replace(/^### (.*$)/gim, '<h3>$1</h3>')
    .replace(/^## (.*$)/gim, '<h2>$1</h2>')
    .replace(/^# (.*$)/gim, '<h1>$1</h1>')
    .replace(/\*\*(.*)\*\*/gim, '<strong>$1</strong>')
    .replace(/\*(.*)\*/gim, '<em>$1</em>')
    .replace(/^- (.*$)/gim, '<li>$1</li>')
    .replace(/(<li>.*<\/li>)/gims, '<ul>$1</ul>')
    .replace(/\n\n/gim, '</p><p>')
    .replace(/\n/gim, '<br>')
    .replace(/<p><\/p>/gim, '');
}

// Process each markdown file
for (const [mdFile, htmlFile] of Object.entries(contentMap)) {
  try {
    const mdPath = path.join('./content', mdFile);
    const htmlPath = `./${htmlFile}`;
    
    // Read markdown content
    const mdContent = fs.readFileSync(mdPath, 'utf8');
    const htmlContent = markdownToHTML(mdContent);
    
    // Read HTML file
    const html = fs.readFileSync(htmlPath, 'utf8');
    const dom = new JSDOM(html);
    const document = dom.window.document;
    
    // Find and update content area (you may need to adjust the selector)
    const contentArea = document.querySelector('.container') || document.body;
    
    // Clear existing content and insert new content
    contentArea.innerHTML = `
      <a href="index.html" class="back-button">← Back to Visa Check Tool</a>
      ${htmlContent}
    `;
    
    // Write updated HTML back
    fs.writeFileSync(htmlPath, dom.serialize());
    
    console.log(`✅ Updated ${htmlFile} from ${mdFile}`);
  } catch (error) {
    console.error(`❌ Error processing ${mdFile}:`, error.message);
  }
}

console.log('🎉 Content update completed!');
