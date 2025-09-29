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

// Alternative method if you prefer using XMLHttpRequest
function loadProductsDataXHR() {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', 'js/product_list.json', true);
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4 && xhr.status === 200) {
            productsData = JSON.parse(xhr.responseText);
            console.log('Products data loaded successfully');
            initializePage();
        }
    };
    xhr.send();
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
    if (product.pdf || product.doc) {
      const file = product.pdf || product.doc;
      productCard.onclick = () => window.open(file, "_blank");
    } else {
      productCard.onclick = () => showProductDetails(categoryName, productName);
    }


    // Card template
    productCard.innerHTML = `
      <div class="product-img">
        ${
          product.pdf
            ? `<i class="fas fa-file-pdf" style="font-size:64px; color:#e63946; display:flex; align-items:center; justify-content:center; width:100%; height:100%;"></i>`
            : product.doc
            ? `<i class="fas fa-file-word" style="font-size:64px; color:#2b579a; display:flex; align-items:center; justify-content:center; width:100%; height:100%;"></i>`
            : `<img src="${product.image || productsData[categoryName].image}" alt="${productName}">`
        }
      </div>
      <div class="product-info">
        <h3>${product.name || productName}</h3>
        <p class="product-desc">${
          product.pdf || product.doc
            ? product.desc || "Click to view document"
            : (product.describe ? product.describe[0].substring(0, 150) + "..." : "")
        }</p>
        ${
          product.pdf || product.doc
            ? `<button class="btn btn-primary"><i class="fas ${product.pdf ? 'fa-file-pdf' : 'fa-file-word'}"></i> Open Document</button>`
            : `<button class="btn btn-primary" onclick="event.stopPropagation(); showProductDetails('${categoryName}', '${productName}')">
                <i class="fas fa-info-circle"></i> Learn More
              </button>`
        }
      </div>
    `;


    productGrid.appendChild(productCard);
  });
}

// Show product details
// Show product details
function showProductDetails(categoryName, productName) {
  currentCategory = categoryName;
  currentProduct = productName;
  const product = productsData[categoryName][productName];

  breadcrumb.innerHTML = `
    <a onclick="showCategories()">Products</a> <i class="fas fa-chevron-right"></i> 
    <a onclick="showProductsInCategory('${categoryName}')">${categoryName}</a> <i class="fas fa-chevron-right"></i> 
    <span>${productName}</span>
  `;

  productGrid.style.display = "none";
  const backButton = document.querySelector("#back-button");
  if (backButton) backButton.style.display = "none";

  details.style.display = "block";
  detailName.textContent = productName;
  detailImg.src = product.img || productsData[categoryName].image;
  detailDesc.innerHTML = product.describe ? product.describe[0] : "";

  // Clear previous content
  detailFeatures.innerHTML = "";
  detailSpecifications.innerHTML = "";
  detailApplications.innerHTML = "";
  detailDeployments.innerHTML = "";
  detailDocuments.innerHTML = "";

  if (product.features) {
    detailFeatures.innerHTML = `
      <ul>${product.features.map(f => `<li><i class="fas fa-check"></i> ${f}</li>`).join('')}</ul>
    `;
  }

  if (product.specification) {
    detailSpecifications.innerHTML = `
      <ul>${product.specification.map(s => `<li><i class="fas fa-info-circle"></i> ${s}</li>`).join('')}</ul>
    `;
  }

  if (product.application) {
    detailApplications.innerHTML = `
      <ul>${product.application.map(a => `<li><i class="fas fa-check-circle"></i> ${a}</li>`).join('')}</ul>
    `;
  }

  if (product.Deployments) {
    detailDeployments.innerHTML = `
      <ul>${product.Deployments.map(d => `<li><i class="fas fa-location-arrow"></i> ${d}</li>`).join('')}</ul>
    `;
  }

  // FIXED: Properly handle document links
  if (product.Document && product.Document.length > 0) {
    detailDocuments.innerHTML = `
      <ul>
        ${product.Document.map(doc => {
          // Extract URL from the document string
          const urlMatch = doc.match(/(https?:\/\/[^\s]+)/);
          const url = urlMatch ? urlMatch[0] : '#';
          const displayText = doc.replace(url, '').trim() || 'Document';
          
          return `<li><i class="fas fa-external-link-alt"></i> <a href="${url}" target="_blank">${displayText}</a></li>`;
        }).join('')}
      </ul>
    `;
  }

  activatePanel('featuresPanel');
  details.scrollIntoView({ behavior: 'smooth' });
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
