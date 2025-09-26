    const products = [
      { 
        id: 1, 
        name: "OpenData Analytics Platform", 
        desc: "A comprehensive data analysis platform that processes large datasets with advanced machine learning algorithms. Used by research institutions worldwide.", 
        img: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
        badge: "OPEN SOURCE",
        features: [
          "Real-time data processing",
          "Machine learning integration",
          "Interactive visualization tools",
          "Multi-user collaboration",
          "API for external systems"
        ]
      },
    ];

    const grid = document.getElementById("productGrid");
    const details = document.getElementById("details");
    const detailName = document.getElementById("detailName");
    const detailImg = document.getElementById("detailImg");
    const detailDesc = document.getElementById("detailDesc");
    const detailFeatures = document.getElementById("detailFeatures");
    const landingPage = document.getElementById("landingPage");
    const productsPage = document.getElementById("productsPage");

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
        
        // Render products
        renderProducts();
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

    function renderProducts() {
      grid.innerHTML = "";
      grid.style.display = "grid";
      details.style.display = "none";
      
      products.forEach(p => {
        const card = document.createElement("div");
        card.className = "product";
        card.innerHTML = `
          <div class="product-img">
            <img src="${p.img}" alt="${p.name}">
            ${p.badge ? `<div class="product-badge">${p.badge}</div>` : ''}
          </div>
          <div class="product-info">
            <h3>${p.name}</h3>
            <p class="product-desc">${p.desc}</p>
            <button class="btn btn-primary" onclick="showDetails(${p.id})">Learn More <i class="fas fa-arrow-right"></i></button>
          </div>
        `;
        grid.appendChild(card);
      });
    }

    function showDetails(productId) {
      const product = products.find(p => p.id === productId);
      
      grid.style.display = "none";
      details.style.display = "block";
      detailName.textContent = product.name;
      detailImg.src = product.img;
      detailDesc.textContent = product.desc;
      
      // Clear and add features
      detailFeatures.innerHTML = "";
      product.features.forEach(feature => {
        const li = document.createElement("li");
        li.innerHTML = `<i class="fas fa-check"></i> ${feature}`;
        detailFeatures.appendChild(li);
      });
      
      // Scroll to details section
      details.scrollIntoView({ behavior: 'smooth' });
    }

    function hideDetails() {
      details.style.display = "none";
      grid.style.display = "grid";
      
      // Scroll back to top of grid
      grid.scrollIntoView({ behavior: 'smooth' });
    }
