let currentProductId;
let currentImageIndex = {};

// Function to get the product ID from the URL
function getProductId() {
    const params = new URLSearchParams(window.location.search);
    return params.get('id');
}

// Function to display the product details and images
function displayProduct() {
    const productId = getProductId();
    currentProductId = productId;
    const product = products.find(p => p.id == productId);

    if (product) {
        // Populate product details
        document.getElementById('product-title').innerText = product.title;
        document.getElementById('product-description').innerText = product.description;
        document.getElementById('product-price').innerText = `Price: $${product.price.toFixed(2)}`;
        document.getElementById('product-strike-price').innerText = `Strike Price: $${product.strikePrice.toFixed(2)}`;
        document.getElementById('product-quantity').innerText = product.quantity;
        document.getElementById('product-category').innerText = product.category;
        document.getElementById('average-rating').innerText = '4.5';

        // Initialize the image slider
        product.images.forEach((image, index) => {
            const img = document.createElement('img');
            img.src = image || 'https://via.placeholder.com/400x300';
            img.alt = product.title;
            img.style.display = index === 0 ? 'block' : 'none';
            img.id = `image-${productId}`; // Use the product ID to set unique IDs for images
            document.getElementById('product-images').appendChild(img);
        });

        currentImageIndex[productId] = 0; // Initialize index
    } else {
        document.getElementById('product-title').innerText = 'Product not found';
    }
}


// Function to update the displayed image
function updateImage() {
    const product = products.find(p => p.id == currentProductId);
    const images = document.getElementById('product-images').getElementsByTagName('img');
    for (let i = 0; i < images.length; i++) {
        images[i].style.display = (i === currentImageIndex[currentProductId]) ? 'block' : 'none'; // Show the current image
    }
}

// Call the displayProduct function when the page loads
window.onload = function() {
    displayProduct();
};