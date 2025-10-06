// Sample products data structure
let productsData = {};

// Function to load JSON data
async function loadProductsData() {
    try {
        const response = await fetch('js/product_list.json');
        productsData = await response.json();
        console.log('Products data loaded successfully');
        
        // Initialize your page after data is loaded
        initializePage();
    } catch (error) {
        console.error('Error loading products data:', error);
    }
}

// Initialize your page after data is loaded
function initializePage() {
    console.log(productsData);
    showCategories();
}

// DOM elements
const landingPage = document.getElementById("landingPage");
const productsPage = document.getElementById("productsPage");
const breadcrumb = document.getElementById("breadcrumb");
const categoryGrid = document.getElementById("categoryGrid");
const productGrid = document.getElementById("productGrid");
const details = document.getElementById("details");
const detailName = document.getElementById("detailName");
const detailImg = document.getElementById("detailImg");
const detailDesc = document.getElementById("detailDesc");
const detailFeatures = document.getElementById("detailFeatures");
const detailSpecifications = document.getElementById("detailSpecifications");
const detailApplications = document.getElementById("detailApplications");
const detailDeployments = document.getElementById("detailDeployments");
const detailDocuments = document.getElementById("detailDocuments");

// Navigation state
let currentCategory = null;
let currentProduct = null;

// Show products page with animation
function showProducts() {
  landingPage.style.transform = "translateY(-100vh)";
  setTimeout(() => {
    landingPage.style.display = "none";
    productsPage.style.display = "block";
    setTimeout(() => {
      productsPage.style.opacity = "1";
    }, 50);
    showCategories();
  }, 800);
}

// Go back to landing page
function goBackToLanding() {
  productsPage.style.opacity = "0";
  setTimeout(() => {
    productsPage.style.display = "none";
    landingPage.style.display = "flex";
    setTimeout(() => {
      landingPage.style.transform = "translateY(0)";
    }, 50);
  }, 800);
}

// Show products in a category
function showProductsInCategory(categoryName) {
  currentCategory = categoryName;
  currentProduct = null;

  breadcrumb.innerHTML = `
    <a onclick="showCategories()">Products</a> <i class="fas fa-chevron-right"></i> 
    <span>${categoryName}</span>
  `;

  categoryGrid.style.display = "none";
  details.style.display = "none";

  productGrid.style.display = "grid";
  productGrid.innerHTML = "";

  const existingBackButton = document.querySelector("#back-button");
  if (!existingBackButton) {
    const backButton = document.createElement("div");
    backButton.className = "back-button";
    backButton.id = "back-button";
    backButton.innerHTML = `<i class="fas fa-arrow-left"></i> Back to Products`;
    backButton.onclick = showCategories;
    productGrid.parentNode.insertBefore(backButton, productGrid);
  } else {
    existingBackButton.style.display = "block";
  }

  // Create product cards
  Object.keys(productsData[categoryName]).forEach(productName => {
    if (productName === "image" || productName === "desc") return;

    const product = productsData[categoryName][productName];
    if (!product) return;

    const productCard = document.createElement("div");
    productCard.className = "product";

    // Behavior: DOCX or PDF card vs normal product
    if (product.pdf || product.docx) {
      const file = product.pdf || product.docx;
      const isDocx = (product.docx && product.docx.toLowerCase().endsWith('.docx')) || 
                    (product.pdf && product.pdf.toLowerCase().endsWith('.docx'));
      const isPdf = (product.pdf && product.pdf.toLowerCase().endsWith('.pdf'));
      
      if (isDocx) { 
        // For DOCX files, open in preview modal
        productCard.onclick = () => showDocxPreviewModal(productName, file);
      } else if (isPdf) {
        // For PDF files, open in PDF preview modal
        productCard.onclick = () => showPdfPreviewModal(productName, file);
      }
    } else {
      productCard.onclick = () => showProductDetails(categoryName, productName);
    }

    // Card template - Show image for PDF/DOCX files
    productCard.innerHTML = `
      <div class="product-img">
        ${
          product.pdf && product.pdf.toLowerCase().endsWith('.pdf')
            ? `<img src="${product.img || 'img/pdf-icon.png'}" alt="${productName}" onerror="this.style.display='none'; this.parentNode.innerHTML='<i class=\\'fas fa-file-pdf\\' style=\\'font-size:64px; color:#e63946; display:flex; align-items:center; justify-content:center; width:100%; height:100%;\\'></i>';">
              <i class="fas fa-file-pdf pdf-fallback" style="font-size:64px; color:#e63946; display:none; align-items:center; justify-content:center; width:100%; height:100%;"></i>`
            : (product.pdf && product.pdf.toLowerCase().endsWith('.docx')) || product.docx
            ? `<img src="${product.img || 'img/docx-icon.png'}" alt="${productName}" onerror="this.style.display='none'; this.parentNode.innerHTML='<i class=\\'fas fa-file-word\\' style=\\'font-size:64px; color:#2b579a; display:flex; align-items:center; justify-content:center; width:100%; height:100%;\\'></i>';">
              <i class="fas fa-file-word docx-fallback" style="font-size:64px; color:#2b579a; display:none; align-items:center; justify-content:center; width:100%; height:100%;"></i>`
            : `<img src="${product.image || productsData[categoryName].image}" alt="${productName}">`
        }
      </div>
      <div class="product-info">
        <h3>${product.name || productName}</h3>
        <p class="product-desc">${
          product.pdf || product.docx
            ? product.desc || "Click to view document"
            : (product.describe ? (Array.isArray(product.describe) ? product.describe[0].substring(0, 150) + "..." : product.describe.substring(0, 150) + "...") : "")
        }</p>
        ${
          product.pdf && product.pdf.toLowerCase().endsWith('.pdf')
            ? `<button class="btn btn-primary"><i class="fas fa-eye"></i> Preview PDF</button>`
            : (product.pdf && product.pdf.toLowerCase().endsWith('.docx')) || product.docx
            ? `<button class="btn btn-primary"><i class="fas fa-eye"></i> Preview Document</button>`
            : `<button class="btn btn-primary" onclick="event.stopPropagation(); showProductDetails('${categoryName}', '${productName}')">
                <i class="fas fa-info-circle"></i> Learn More
              </button>`
        }
      </div>
    `;

    productGrid.appendChild(productCard);
  });
}

// Show DOCX preview using Google Docs Viewer
function showDocxPreviewModal(productName, fileUrl) {
  // Create modal if it doesn't exist
  let modal = document.getElementById('docxPreviewModal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'docxPreviewModal';
    modal.className = 'modal docx-preview-modal';
    modal.innerHTML = `
      <div class="modal-content">
        <div class="modal-header">
          <h3>${productName}</h3>
          <span class="close-modal">&times;</span>
        </div>
        <div class="modal-body">
          <div class="preview-container">
            <div class="preview-loading">
              <i class="fas fa-spinner fa-spin" style="font-size: 48px; color: #2b579a; margin-bottom: 20px;"></i>
              <p>Loading document preview...</p>
            </div>
            <iframe class="preview-frame" style="display: none; width: 100%; height: 600px; border: none; border-radius: 8px;"></iframe>
            <div class="preview-error" style="display: none; text-align: center; padding: 40px;">
              <i class="fas fa-exclamation-triangle" style="font-size: 48px; color: #e74c3c; margin-bottom: 20px;"></i>
              <h4>Preview Not Available</h4>
              <p>Unable to load document preview. You can still download the document.</p>
            </div>
          </div>
          <div class="modal-actions" style="margin-top: 20px; display: flex; gap: 10px; justify-content: center;">
            <button class="btn btn-secondary" onclick="closeDocxPreviewModal()">
              <i class="fas fa-times"></i> Close
            </button>
            <button class="btn btn-primary" id="downloadDocxBtn">
              <i class="fas fa-download"></i> Download
            </button>
          </div>
        </div>
      </div>
    `;
    document.body.appendChild(modal);

    // Close modal when clicking X or outside
    modal.querySelector('.close-modal').onclick = closeDocxPreviewModal;
    modal.onclick = function(event) {
      if (event.target === modal) {
        closeDocxPreviewModal();
      }
    };
  }

  // Update modal content
  modal.querySelector('h3').textContent = productName;
  const downloadBtn = modal.querySelector('#downloadDocxBtn');
  downloadBtn.onclick = () => downloadDocx(fileUrl, productName);

  // Show modal
  modal.style.display = 'block';
  document.body.style.overflow = 'hidden';

  // Load Google Docs Viewer
  loadGoogleDocsPreview(fileUrl, modal);
}

// Load document in Google Docs Viewer
function loadGoogleDocsPreview(fileUrl, modal) {
  const iframe = modal.querySelector('.preview-frame');
  const loading = modal.querySelector('.preview-loading');
  const error = modal.querySelector('.preview-error');

  // Show loading, hide others
  loading.style.display = 'block';
  iframe.style.display = 'none';
  error.style.display = 'none';

  // Google Docs Viewer URL
  const googleDocsViewerUrl = `https://docs.google.com/gview?url=${encodeURIComponent(fileUrl)}&embedded=true`;

  iframe.src = googleDocsViewerUrl;
  
  iframe.onload = function() {
    loading.style.display = 'none';
    iframe.style.display = 'block';
  };

  iframe.onerror = function() {
    loading.style.display = 'none';
    error.style.display = 'block';
  };
}

// Show PDF preview modal
function showPdfPreviewModal(productName, fileUrl) {
  let modal = document.getElementById('pdfPreviewModal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'pdfPreviewModal';
    modal.className = 'modal pdf-preview-modal';
    modal.innerHTML = `
      <div class="modal-content">
        <div class="modal-header">
          <h3>${productName}</h3>
          <span class="close-modal">&times;</span>
        </div>
        <div class="modal-body">
          <div class="preview-container">
            <div class="preview-loading">
              <i class="fas fa-spinner fa-spin" style="font-size: 48px; color: #e63946; margin-bottom: 20px;"></i>
              <p>Loading PDF preview...</p>
            </div>
            <iframe class="preview-frame" style="display: none; width: 100%; height: 600px; border: none; border-radius: 8px;"></iframe>
            <div class="preview-error" style="display: none; text-align: center; padding: 40px;">
              <i class="fas fa-exclamation-triangle" style="font-size: 48px; color: #e74c3c; margin-bottom: 20px;"></i>
              <h4>PDF Preview Not Available</h4>
              <p>Unable to load PDF preview. You can still download the PDF.</p>
            </div>
          </div>
          <div class="modal-actions" style="margin-top: 20px; display: flex; gap: 10px; justify-content: center;">
            <button class="btn btn-secondary" onclick="closePdfPreviewModal()">
              <i class="fas fa-times"></i> Close
            </button>
            <button class="btn btn-primary" id="downloadPdfBtn">
              <i class="fas fa-download"></i> Download PDF
            </button>
          </div>
        </div>
      </div>
    `;
    document.body.appendChild(modal);

    modal.querySelector('.close-modal').onclick = closePdfPreviewModal;
    modal.onclick = function(event) {
      if (event.target === modal) {
        closePdfPreviewModal();
      }
    };
  }

  // Update modal content
  modal.querySelector('h3').textContent = productName;
  const downloadBtn = modal.querySelector('#downloadPdfBtn');
  downloadBtn.onclick = () => downloadPdf(fileUrl, productName);

  // Show modal
  modal.style.display = 'block';
  document.body.style.overflow = 'hidden';

  // Load PDF in iframe
  loadPdfPreview(fileUrl, modal);
}

// Load PDF in iframe for preview
function loadPdfPreview(fileUrl, modal) {
  const iframe = modal.querySelector('.preview-frame');
  const loading = modal.querySelector('.preview-loading');
  const error = modal.querySelector('.preview-error');

  // Show loading, hide others
  loading.style.display = 'block';
  iframe.style.display = 'none';
  error.style.display = 'none';

  // Set iframe source to the PDF file
  iframe.src = fileUrl;
  
  iframe.onload = function() {
    loading.style.display = 'none';
    iframe.style.display = 'block';
  };

  iframe.onerror = function() {
    loading.style.display = 'none';
    error.style.display = 'block';
  };
}

// Close modals
function closeDocxPreviewModal() {
  const modal = document.getElementById('docxPreviewModal');
  if (modal) {
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
    // Clear iframe source to stop loading
    const iframe = modal.querySelector('.preview-frame');
    iframe.src = '';
  }
}

function closePdfPreviewModal() {
  const modal = document.getElementById('pdfPreviewModal');
  if (modal) {
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
    // Clear iframe source to stop loading
    const iframe = modal.querySelector('.preview-frame');
    iframe.src = '';
  }
}

// Download functions
function downloadDocx(fileUrl, productName) {
  const link = document.createElement('a');
  link.href = fileUrl;
  link.download = `${productName}.docx`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

function downloadPdf(fileUrl, productName) {
  const link = document.createElement('a');
  link.href = fileUrl;
  link.download = `${productName}.pdf`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// Show product details with tab system
function showProductDetails(categoryName, productName) {
  currentCategory = categoryName;
  currentProduct = productName;
  const product = productsData[categoryName][productName];

  // Function to check if data is valid (not "No data found")
  const isValidData = (data) => {
    if (!data) return false;
    if (Array.isArray(data)) {
      return data.length > 0 && !data.every(item => 
        item === "No data found"
      );
    }
    return data !== "No data found" && !data.toLowerCase().includes('no data');
  };

  // Check which tabs have valid data
  const hasFeatures = product.features && isValidData(product.features);
  const hasSpecifications = product.specification && isValidData(product.specification);
  const hasApplications = product.applications && isValidData(product.applications);
  const hasDeployments = product.deployments && isValidData(product.deployments);
  const hasEventsAwards = product['Event and Awards'] && isValidData(product['Event and Awards']);
  const hasPartners = product.tot_partners && isValidData(product.tot_partners);
  const hasVideo = product.Video && isValidData(product.Video);
  const hasDocuments = product.Document && isValidData(product.Document);

  // Determine which tab should be active by default
  let defaultActiveTab = '';
  const legacyProductsWithPartners = ['RAX', 'MAX', 'AN-RAX'];
  
  // Priority order for active tab
  if (legacyProductsWithPartners.includes(productName) && hasPartners) {
    defaultActiveTab = 'partnersTab';
  } else if (hasFeatures) {
    defaultActiveTab = 'featuresTab';
  } else if (hasSpecifications) {
    defaultActiveTab = 'specificationsTab';
  } else if (hasApplications) {
    defaultActiveTab = 'applicationsTab';
  } else if (hasDeployments) {
    defaultActiveTab = 'deploymentsTab';
  } else if (hasEventsAwards) {
    defaultActiveTab = 'eventsAwardsTab';
  } else if (hasVideo) {
    defaultActiveTab = 'videoTab';
  } else if (hasDocuments) {
    defaultActiveTab = 'documentsTab';
  }

  breadcrumb.innerHTML = `
    <a onclick="showCategories()">Products</a> <i class="fas fa-chevron-right"></i> 
    <a onclick="showProductsInCategory('${categoryName}')">${categoryName}</a> <i class="fas fa-chevron-right"></i> 
    <span>${productName}</span>
  `;

  productGrid.style.display = "none";
  const backButton = document.querySelector("#back-button");
  if (backButton) backButton.style.display = "none";

  details.style.display = "block";
  
  // Create tab system structure
  details.innerHTML = `
    <div class="product-header">
      <div class="back-button" onclick="showProductsInCategory('${categoryName}')">
        <i class="fas fa-arrow-left"></i> Back to Sub Products
      </div>
      <h1 id="detailName">${productName}</h1>
      <div class="product-meta">
        <img id="detailImg" src="${product.image || productsData[categoryName].image}" alt="${productName}">
        <div class="product-description" id="detailDesc">
          ${product.describe ? (Array.isArray(product.describe) ? product.describe[0] : product.describe) : ''}
        </div>
      </div>
    </div>

    ${defaultActiveTab ? `
      <div class="details-tabs">
        ${hasFeatures ? `<button class="tab-button ${defaultActiveTab === 'featuresTab' ? 'active' : ''}" onclick="switchTab('featuresTab')">
          <i class="fas fa-star"></i> Features
        </button>` : ''}
        
        ${hasSpecifications ? `<button class="tab-button ${defaultActiveTab === 'specificationsTab' ? 'active' : ''}" onclick="switchTab('specificationsTab')">
          <i class="fas fa-info-circle"></i> Specifications
        </button>` : ''}
        
        ${hasApplications ? `<button class="tab-button ${defaultActiveTab === 'applicationsTab' ? 'active' : ''}" onclick="switchTab('applicationsTab')">
          <i class="fas fa-check-circle"></i> Applications
        </button>` : ''}
        
        ${hasDeployments ? `<button class="tab-button ${defaultActiveTab === 'deploymentsTab' ? 'active' : ''}" onclick="switchTab('deploymentsTab')">
          <i class="fas fa-location-arrow"></i> Deployments
        </button>` : ''}
        
        ${hasEventsAwards ? `<button class="tab-button ${defaultActiveTab === 'eventsAwardsTab' ? 'active' : ''}" onclick="switchTab('eventsAwardsTab')">
          <i class="fas fa-trophy"></i> Events & Awards
        </button>` : ''}
        
        ${hasPartners ? `<button class="tab-button ${defaultActiveTab === 'partnersTab' ? 'active' : ''}" onclick="switchTab('partnersTab')">
          <i class="fas fa-handshake"></i> TOT Partners
        </button>` : ''}
        
        ${hasVideo ? `<button class="tab-button ${defaultActiveTab === 'videoTab' ? 'active' : ''}" onclick="switchTab('videoTab')">
          <i class="fas fa-video"></i> Video
        </button>` : ''}
        
        ${hasDocuments ? `<button class="tab-button ${defaultActiveTab === 'documentsTab' ? 'active' : ''}" onclick="switchTab('documentsTab')">
          <i class="fas fa-file-alt"></i> Documents
        </button>` : ''}
      </div>

      <!-- Tab Contents -->
      <div class="tab-content-container">
        ${hasFeatures ? `
          <div id="featuresTab" class="tab-content ${defaultActiveTab === 'featuresTab' ? 'active' : ''} tab-content-full">
            <h3><i class="fas fa-check"></i> Features</h3>
            <ul>
              ${product.features.map(f => `<li> ${f}</li>`).join('')}
            </ul>
          </div>
        ` : ''}

        ${hasSpecifications ? `
          <div id="specificationsTab" class="tab-content ${defaultActiveTab === 'specificationsTab' ? 'active' : ''} tab-content-full">
            <h3><i class="fas fa-info-circle"></i> Specifications</h3>
            <ul>
              ${product.specification.map(s => `<li> ${s}</li>`).join('')}
            </ul>
          </div>
        ` : ''}

        ${hasApplications ? `
          <div id="applicationsTab" class="tab-content ${defaultActiveTab === 'applicationsTab' ? 'active' : ''} tab-content-full">
            <h3><i class="fas fa-check-circle"></i> Applications</h3>
            <ul>
              ${product.applications.map(a => `<li>${a}</li>`).join('')}
            </ul>
          </div>
        ` : ''}

        ${hasDeployments ? `
          <div id="deploymentsTab" class="tab-content ${defaultActiveTab === 'deploymentsTab' ? 'active' : ''} tab-content-full">
            <h3><i class="fas fa-location-arrow"></i> Deployments</h3>
            <div class="deployments-content">
              ${product.deployments.map(deployment => `
                <div class="deployment-item">
                  ${deployment.includes('<br>') ? deployment : `<p>${deployment}</p>`}
                </div>
              `).join('')}
            </div>
          </div>
        ` : ''}

        ${hasEventsAwards ? `
          <div id="eventsAwardsTab" class="tab-content ${defaultActiveTab === 'eventsAwardsTab' ? 'active' : ''} tab-content-full">
            <h3><i class="fas fa-trophy"></i> Events & Awards</h3>
            <div class="events-awards-content">
              ${product['Event and Awards'].map(item => `
                <div class="event-award-item">${item}</div>
              `).join('')}
            </div>
          </div>
        ` : ''}

        ${hasPartners ? `
          <div id="partnersTab" class="tab-content ${defaultActiveTab === 'partnersTab' ? 'active' : ''} tab-content-full">
            <h3><i class="fas fa-handshake"></i> TOT Partners</h3>
            <div class="partners-grid">
              ${product.tot_partners.map(partner => `
                <div class="partner-card">
                  <img src="${partner.image_url}" alt="${partner.alt_text}" 
                       onerror="this.style.display='none'; this.parentNode.innerHTML='<div class=\\'partner-placeholder\\'><i class=\\'fas fa-building\\'></i><span>${partner.alt_text}</span></div>';">
                </div>
              `).join('')}
            </div>
          </div>
        ` : ''}

        ${hasVideo ? `
          <div id="videoTab" class="tab-content ${defaultActiveTab === 'videoTab' ? 'active' : ''} tab-content-full">
            <h3><i class="fas fa-video"></i> Video</h3>
            <div class="video-content">
              ${product.Video.map(video => {
                // Extract YouTube embed URL
                const youtubeEmbedRegex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/embed\/|youtu\.be\/)([a-zA-Z0-9_-]+)/;
                const youtubeWatchRegex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]+)/;
                
                let embedUrl = '';
                
                // Check for embed URL
                const embedMatch = video.match(youtubeEmbedRegex);
                if (embedMatch) {
                  embedUrl = `https://www.youtube.com/embed/${embedMatch[1]}`;
                } else {
                  // Check for watch URL
                  const watchMatch = video.match(youtubeWatchRegex);
                  if (watchMatch) {
                    embedUrl = `https://www.youtube.com/embed/${watchMatch[1]}`;
                  } else {
                    // If no YouTube URL found, show the text as is
                    return `<div class="video-text">${video}</div>`;
                  }
                }
                
                return `
                  <div class="video-container">
                    <iframe 
                      src="${embedUrl}" 
                      frameborder="0" 
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                      allowfullscreen>
                    </iframe>
                  </div>
                `;
              }).join('')}
            </div>
          </div>
        ` : ''}

        ${hasDocuments ? `
          <div id="documentsTab" class="tab-content ${defaultActiveTab === 'documentsTab' ? 'active' : ''} tab-content-full">
            <h3><i class="fas fa-file-alt"></i> Documents</h3>
            <ul>
              ${product.Document.map(doc => {
                const urlMatch = doc.match(/(https?:\/\/[^\s]+|[^ ]+\.(pdf|docx))/i);
                const url = urlMatch ? getAbsoluteUrl(urlMatch[0]) : '#';
                const displayText = doc.replace(urlMatch ? urlMatch[0] : '', '').trim() || 'Document';
                const lowerUrl = url.toLowerCase();
                const isDocx = lowerUrl.endsWith('.docx');
                const isPdf = lowerUrl.endsWith('.pdf');
                
                if (isDocx) {
                  return `<li><a href="javascript:void(0)" onclick="showDocxPreviewModal('${productName}', '${url}')">${displayText}</a></li>`;
                } else if (isPdf) {
                  return `<li><a href="javascript:void(0)" onclick="showPdfPreviewModal('${productName}', '${url}')">${displayText}</a></li>`;
                } else {
                  return `<li><a href="${url}" target="_blank" rel="noopener">${displayText}</a></li>`;
                }
              }).join('')}
            </ul>
          </div>
        ` : ''}
      </div>
    ` : `
      <div class="no-tabs-message">
        <i class="fas fa-info-circle"></i>
        <h3>No additional information available</h3>
        <p>There is no detailed information available for this product.</p>
      </div>
    `}
  `;

  details.scrollIntoView({ behavior: 'smooth' });
}


// Tab switching function
function switchTab(tabId) {
  // Hide all tab contents
  document.querySelectorAll('.tab-content').forEach(tab => {
    tab.classList.remove('active');
  });
  
  // Remove active class from all tab buttons
  document.querySelectorAll('.tab-button').forEach(button => {
    button.classList.remove('active');
  });
  
  // Show selected tab content
  const activeTab = document.getElementById(tabId);
  if (activeTab) {
    activeTab.classList.add('active');
  }
  
  // Activate clicked tab button
  event.currentTarget.classList.add('active');
  
  // Scroll to top of tab content
  activeTab.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function getAbsoluteUrl(fileUrl) {
  if (fileUrl.startsWith('http://') || fileUrl.startsWith('https://')) {
    return fileUrl;
  }
  return window.location.origin + '/' + fileUrl;
}


// Show categories
function showCategories() {
  currentCategory = null;
  currentProduct = null;

  breadcrumb.innerHTML = '<a onclick="showCategories()">Products</a>';

  productGrid.style.display = "none";
  details.style.display = "none";
  const backButton = document.querySelector("#back-button");
  if (backButton) backButton.style.display = "none";

  categoryGrid.style.display = "grid";
  categoryGrid.innerHTML = "";

  Object.keys(productsData).forEach(categoryName => {
    const category = document.createElement("div");
    category.className = "category";
    category.onclick = () => showProductsInCategory(categoryName);

    category.innerHTML = `
      <div class="category-img">
        <img src="${productsData[categoryName].image}" alt="${categoryName}">
      </div>
      <div class="category-info">
        <h3>${categoryName}</h3>
        <p class="category-desc">Explore ${Object.keys(productsData[categoryName]).length - 1} products in this category</p>
        <button class="btn btn-primary" onclick="event.stopPropagation(); showProductsInCategory('${categoryName}')">
          <i class="fas fa-eye"></i> View Products
        </button>
      </div>
    `;
    categoryGrid.appendChild(category);
  });
}

// Accordion
function activatePanel(panelId) {
  document.querySelectorAll('.accordion-panel').forEach(panel => {
    panel.classList.remove('active');
  });
  const activePanel = document.getElementById(panelId);
  if (activePanel) activePanel.classList.add('active');
}

// Hide details and go back
function hideDetails() {
  details.style.display = "none";
  details.innerHTML = ""; // Clear tab content
  if (currentCategory && currentProduct) {
    productGrid.style.display = "grid";
    productGrid.scrollIntoView({ behavior: 'smooth' });
  } else if (currentCategory) {
    showProductsInCategory(currentCategory);
  } else {
    showCategories();
  }
}

// Initialize page
document.addEventListener('DOMContentLoaded', function() {
  loadProductsData();
});