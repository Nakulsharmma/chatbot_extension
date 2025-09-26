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
    xhr.open('GET', 'js/product_list,json', true);
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
    // Now you can use productsData anywhere in your code
    console.log(productsData);
    
    // Example: Render categories
    renderCategories();
}

// Example function using the loaded data
function renderCategories() {
    const categoryGrid = document.getElementById('categoryGrid');
    
    Object.keys(productsData).forEach(categoryName => {
        // Create category cards using productsData[categoryName]
        const categoryCard = document.createElement('div');
        categoryCard.innerHTML = `
            <h3>${categoryName}</h3>
            <p>${Object.keys(productsData[categoryName]).length} products</p>
        `;
        categoryGrid.appendChild(categoryCard);
    });
}

// Call this when your page loads
document.addEventListener('DOMContentLoaded', function() {
    loadProductsData(); // or loadProductsDataXHR()
});

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
      // Slide up the landing page
      landingPage.style.transform = "translateY(-100vh)";
      
      // After animation completes, show products page
      setTimeout(() => {
        landingPage.style.display = "none";
        productsPage.style.display = "block";
        
        // Fade in products page
        setTimeout(() => {
          productsPage.style.opacity = "1";
        }, 50);
        
        // Show categories
        showCategories();
      }, 800);
    }

    // Go back to landing page
    function goBackToLanding() {
      // Fade out products page
      productsPage.style.opacity = "0";
      
      // After fade out, show landing page
      setTimeout(() => {
        productsPage.style.display = "none";
        landingPage.style.display = "flex";
        
        // Reset landing page position
        setTimeout(() => {
          landingPage.style.transform = "translateY(0)";
        }, 50);
      }, 800);
    }

// Show products in a category
function showProductsInCategory(categoryName) {
  currentCategory = categoryName;
  currentProduct = null;
  
  // Update breadcrumb
  breadcrumb.innerHTML = `
    <a onclick="showCategories()">Products</a> <i class="fas fa-chevron-right"></i> 
    <span>${categoryName}</span>
  `;
  
  // Hide category grid and details
  categoryGrid.style.display = "none";
  details.style.display = "none";
  
  // Show product grid
  productGrid.style.display = "grid";
  productGrid.innerHTML = "";
  
  // Add back button - ONLY on sub-category page (product grid)
  const existingBackButton = document.querySelector("#back-button");
  if (!existingBackButton) {
    const backButton = document.createElement("div");
    backButton.className = "back-button";
    backButton.id = "back-button";
    backButton.innerHTML = `<i class="fas fa-arrow-left"></i> Back to Product`;
    backButton.onclick = showCategories;
    productGrid.parentNode.insertBefore(backButton, productGrid);
  } else {
    existingBackButton.style.display = "block";
  }
  
  // Create product cards
  Object.keys(productsData[categoryName]).forEach(productName => {
    if (productName === "image") return; // Skip category image key
    const product = productsData[categoryName][productName];
    const productCard = document.createElement("div");
    productCard.className = "product";
    productCard.onclick = () => showProductDetails(categoryName,productName);
    productCard.innerHTML = `
      <div class="product-img">
        <img src="${productsData[categoryName].image}" alt="${productName}">
      </div>
      <div class="product-info">
        <h3>${productName}</h3>
        <p class="product-desc">${product.describe[0].substring(0, 150)}...</p>
        <button class="btn btn-primary" onclick="showProductDetails('${categoryName}', '${productName}')">
          <i class="fas fa-info-circle"></i> Learn More
        </button>
      </div>
    `;
    productGrid.appendChild(productCard);
  });
}

// Show product details
function showProductDetails(categoryName, productName) {
  currentCategory = categoryName;
  currentProduct = productName;
  const product = productsData[categoryName][productName];
  
  // Update breadcrumb
  breadcrumb.innerHTML = `
    <a onclick="showCategories()">Products</a> <i class="fas fa-chevron-right"></i> 
    <a onclick="showProductsInCategory('${categoryName}')">${categoryName}</a> <i class="fas fa-chevron-right"></i> 
    <span>${productName}</span>
  `;
  
  // Hide product grid and back button
  productGrid.style.display = "none";
  const backButton = document.querySelector("#back-button");
  if (backButton) {
    backButton.style.display = "none";
  }
  
  // Show details
  details.style.display = "block";
  detailName.textContent = productName;
  detailImg.src = productsData[categoryName].image;
  detailDesc.innerHTML = product.describe[0];
  
  // Clear previous content
  detailFeatures.innerHTML = "";
  detailSpecifications.innerHTML = "";
  detailApplications.innerHTML = "";
  detailDeployments.innerHTML = "";
  detailDocuments.innerHTML = "";
  
  // Add features section
  if (product.features && product.features.length > 0) {
    detailFeatures.innerHTML = `
      <ul>
        ${product.features.map(feature => `<li><i class="fas fa-check"></i> ${feature}</li>`).join('')}
      </ul>
    `;
  }
  
  // Add specifications section
  if (product.specification && product.specification.length > 0) {
    detailSpecifications.innerHTML = `
      <ul>
        ${product.specification.map(spec => `<li><i class="fas fa-info-circle"></i> ${spec}</li>`).join('')}
      </ul>
    `;
  }
  
  // Add applications section
  if (product.application && product.application.length > 0) {
    detailApplications.innerHTML = `
      <ul>
        ${product.application.map(app => `<li><i class="fas fa-check-circle"></i> ${app}</li>`).join('')}
      </ul>
    `;
  }
  
  // Add deployments section
  if (product.Deployments && product.Deployments.length > 0) {
    detailDeployments.innerHTML = `
      <ul>
        ${product.Deployments.map(deployment => `<li><i class="fas fa-location-arrow"></i> ${deployment}</li>`).join('')}
      </ul>
    `;
  }
  
  // Add documents section
  if (product.Document && product.Document.length > 0) {
    detailDocuments.innerHTML = `
      <ul>
        ${product.Document.map(doc => `<li><i class="fas fa-external-link-alt"></i> <a href="#" target="_blank">${doc}</a></li>`).join('')}
      </ul>
    `;
  }
  
  // Activate first panel by default
  activatePanel('featuresPanel');
  
  // Scroll to details section
  details.scrollIntoView({ behavior: 'smooth' });
}

// Show categories
function showCategories() {
  currentCategory = null;
  currentProduct = null;
  
  // Update breadcrumb
  breadcrumb.innerHTML = '<a onclick="showCategories()">Products</a>';
  
  // Hide product grid, details, and back button
  productGrid.style.display = "none";
  details.style.display = "none";
  const backButton = document.querySelector("#back-button");
  if (backButton) {
    backButton.style.display = "none";
  }
  
  // Show category grid
  categoryGrid.style.display = "grid";
  categoryGrid.innerHTML = "";
  
  // Create category cards
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
        <button class="btn btn-primary" onclick="showProductsInCategory('${categoryName}')">
          <i class="fas fa-eye"></i> View Products
        </button>
      </div>
    `;
    categoryGrid.appendChild(category);
  });
}
    // Activate accordion panel
    function activatePanel(panelId) {
      // Deactivate all panels
      const panels = document.querySelectorAll('.accordion-panel');
      panels.forEach(panel => {
        panel.classList.remove('active');
      });
      
      // Activate the selected panel
      const activePanel = document.getElementById(panelId);
      activePanel.classList.add('active');
    }

    // Hide details and go back to products
    function hideDetails() {
      details.style.display = "none";
      
      if (currentCategory && currentProduct) {
        productGrid.style.display = "grid";
        // Scroll back to top of grid
        productGrid.scrollIntoView({ behavior: 'smooth' });
      } else if (currentCategory) {
        showProductsInCategory(currentCategory);
      } else {
        showCategories();
      }
    }

    // Initialize the page
    document.addEventListener('DOMContentLoaded', function() {
      // Any initialization code if needed
    });