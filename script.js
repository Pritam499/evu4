let parent = document.querySelector(".parent_div")
let productArr;
let searchTimer;
function debouncing() {
    clearTimeout(searchTimer);
    searchTimer = setTimeout(function () {
        let currentSearchInput = document.getElementById("search").value.trim();
        if (currentSearchInput) {
            filteTitle(currentSearchInput);
            showSuggestions(currentSearchInput);
        } else {
            document.getElementById("suggestions").innerHTML = "";
        }
    }, 300);
}

async function fetchData() {
    let response = await fetch('https://practise-423b8-default-rtdb.firebaseio.com/.json');
    let data = await response.json();

    // Convert data to an array if it is an object
    productArr = data ? Object.values(data) : [];

    console.log(productArr);
    displayProduct(productArr);
}

fetchData()

function displayProduct(arr) {
    let child_div = ""
    arr.forEach(ele => {

        // let pc = setTimeout(() => {
        //     console.log(ele.price)
        //     return ele.strikePrice
        // }, 2000);
        let img
        if ((typeof ele.images) != "object") {
            img = ele.images
        }
        else {
            img = "https://dummyimage.com/700x400/000/fff"
        }

        child_div += `
        <div class="child_div">
            <div class="img">
                <img src="${img}"
                    alt="${ele.title}">
            </div>
            <h3 class="title">${ele.title}</h3>
            <p class="desc">${ele.description}</p>
            <p class="price">Price: ${ele.price} <span class="st_price">$${ele.strikePrice}</span></p>
            <p class="qty">Quantity: ${ele.quantity}</p>
            <p class="category">Category: ${ele.category}</p>
            <button class="cart" onclick = "addToCart(${ele.id})">Add to cart </button>
            <button class="cart" onclick = "delete_product(${ele.id})">Delete Product </button>
        </div>
        `

    });

    parent.innerHTML = child_div
}



function filteTitle(search_input) {
    console.log(search_input);
    let filter_title = productArr.filter((ele) => {
        if (typeof ele.title !== 'string') {
            console.error("Invalid title format:", ele);
            return false;
        }
        return ele.title.includes(search_input);
    });
    console.log(filter_title);
    displayProduct(filter_title);
}

let category_sort = document.querySelector("#category_sort")
let price_sort = document.querySelector("#price_sort")


category_sort.addEventListener("change", category_sort_func)
price_sort.addEventListener("change", price_sort_func)

function category_sort_func() {
    let sort_arr = productArr.filter((ele) => category_sort.value == ele.category)
    console.log(sort_arr)
    displayProduct(sort_arr)
}

function price_sort_func() {
    let sort_arr
    if (price_sort.value == "htl") {
        sort_arr = productArr.sort((a, b) => b.price - a.price)
    }
    else if (price_sort.value == "lth") {
        sort_arr = productArr.sort((a, b) => a.price - b.price)
    }
    console.log(sort_arr)
    displayProduct(sort_arr)
}

function addToCart(id) {
    console.log(id)
}

function showSuggestions(search_input) {
    let suggestionsBox = document.getElementById("suggestions");
    let filteredArr = productArr.filter(ele => ele.title && ele.title.toLowerCase().includes(search_input.toLowerCase()));
    suggestionsBox.innerHTML = "";

    if (filteredArr.length > 0) {
        filteredArr.forEach(ele => {
            let suggestionItem = document.createElement("li");
            let br = document.createElement("br")
            suggestionItem.textContent = ele.title;
            suggestionItem.onclick = () => {
                document.getElementById("search").value = ele.title;
                suggestionsBox.innerHTML = "";
                filteTitle(ele.title);
            };
            suggestionsBox.appendChild(suggestionItem);
        });
    } else {
        let noResults = document.createElement("li");
        noResults.textContent = "No suggestions found";
        suggestionsBox.appendChild(noResults);
    }
}


// Add to Cart Function 
var cartArr = JSON.parse(localStorage.getItem("cart")) || []
function addToCart(id) {
    let product = productArr.find((ele) => {
        return ele.id == id
    })
    let isPresnt = cartArr.find((ele) => {
        return ele.id == id
    })
    if (isPresnt) {
        product.quantity = product.quantity + 1
        alert("Product are already added into the cart")
    }
    else {
        product.quantity = 1
        cartArr.push(product)
        alert("Product are added into the cart")
    }

    localStorage.setItem("cart", JSON.stringify(cartArr))
}
console.log(cartArr)


// Delete Product from firebase 
async function delete_product(id) {
    if (!confirm("Are you sure?")) return;
    console.log(id);
    const requestOpt = {
        method: "DELETE",
        redirect: "follow"
    };
    try {
        let response = await fetch('https://practise-423b8-default-rtdb.firebaseio.com/${id}.json', requestOpt);
        let res = await response.json();
        alert("Product was Deleted");
        console.log(res);

        fetchData();
    } catch (error) {
        console.log(error);
    }
}