var nameInput = document.getElementById("ProductName");
var priceInput = document.getElementById("ProductPrice");
var categoryInput = document.getElementById("ProductCategory");
var descInput = document.getElementById("ProductDescription");
var fileInput = document.getElementById("ProductFile");
var addBtn = document.getElementById("addBtn");
var updateBtn = document.getElementById("updateBtn");
var searchInput = document.getElementById("search");
var productsContainer = document.getElementById("productsContainer");

var products = JSON.parse(localStorage.getItem("products")) || [];
var currentIndex = null;

displayProducts(products);

// ===== Add =====
addBtn.addEventListener("click", function () {
  if (!validateInputs(true)) return;

  var reader = new FileReader();
  reader.onload = function () {
    products.push({
      name: nameInput.value.trim(),
      price: Number(priceInput.value),
      category: categoryInput.value.trim(),
      description: descInput.value.trim(),
      image: reader.result,
    });
    saveProducts();
    displayProducts(products);
    clearForm();
  };
  reader.readAsDataURL(fileInput.files[0]);
});

// ===== Update =====
function setupUpdate(index) {
  currentIndex = index;
  var product = products[index];

  nameInput.value = product.name;
  priceInput.value = product.price;
  categoryInput.value = product.category;
  descInput.value = product.description;

  addBtn.classList.add("d-none");
  updateBtn.classList.remove("d-none");
  window.scrollTo({ top: 0, behavior: "smooth" });
}

updateBtn.addEventListener("click", function () {
  if (!validateInputs(false)) return;

  var product = products[currentIndex];
  product.name = nameInput.value.trim();
  product.price = Number(priceInput.value);
  product.category = categoryInput.value.trim();
  product.description = descInput.value.trim();

  // Change the image only if a new one was selected
  if (fileInput.files.length > 0) {
    var reader = new FileReader();
    reader.onload = function () {
      product.image = reader.result;
      finishUpdate();
    };
    reader.readAsDataURL(fileInput.files[0]);
  } else {
    finishUpdate();
  }
});

function finishUpdate() {
  saveProducts();
  displayProducts(products);
  clearForm();
  currentIndex = null;
  updateBtn.classList.add("d-none");
  addBtn.classList.remove("d-none");
  searchInput.value = "";
}

// ===== Validation =====
function validateInputs(requireFile) {
  if (
    !nameInput.value.trim() ||
    !priceInput.value ||
    !categoryInput.value.trim() ||
    !descInput.value.trim()
  ) {
    alert("Please fill in all fields");
    return false;
  }
  if (Number(priceInput.value) <= 0) {
    alert("Price must be greater than zero");
    return false;
  }
  if (requireFile && fileInput.files.length === 0) {
    alert("Please choose a product image");
    return false;
  }
  return true;
}

// ===== Display =====
function displayProducts(list) {
  if (list.length === 0) {
    productsContainer.innerHTML =
      '<p class="text-center text-muted">No products found</p>';
    return;
  }

  var cartona = "";
  for (var i = 0; i < list.length; i++) {
    var realIndex = products.indexOf(list[i]);
    cartona += `
      <div class="col-md-6 col-lg-4">
        <div class="card h-100 shadow-sm">
          <img src="${list[i].image}" class="card-img-top" alt="${list[i].name}"
               style="height: 220px; object-fit: cover;" />
          <div class="card-body">
            <h5 class="card-title">${list[i].name}</h5>
            <span class="badge bg-info mb-2">${list[i].category}</span>
            <p class="card-text">${list[i].description}</p>
            <p class="fw-bold mb-0">${list[i].price} EGP</p>
          </div>
          <div class="card-footer bg-white border-0 d-flex gap-2">
            <button class="btn btn-outline-warning w-50"
                    onclick="setupUpdate(${realIndex})">Update</button>
            <button class="btn btn-outline-danger w-50"
                    onclick="deleteProduct(${realIndex})">Delete</button>
          </div>
        </div>
      </div>`;
  }
  productsContainer.innerHTML = cartona;
}

// ===== Delete =====
function deleteProduct(index) {
  products.splice(index, 1);
  saveProducts();
  displayProducts(products);
  searchInput.value = "";
}

// ===== Search =====
searchInput.addEventListener("input", function () {
  var term = searchInput.value.trim().toLowerCase();
  var result = [];
  for (var i = 0; i < products.length; i++) {
    if (products[i].name.toLowerCase().includes(term)) {
      result.push(products[i]);
    }
  }
  displayProducts(result);
});

// ===== Helpers =====
function saveProducts() {
  localStorage.setItem("products", JSON.stringify(products));
}

function clearForm() {
  nameInput.value = "";
  priceInput.value = "";
  categoryInput.value = "";
  descInput.value = "";
  fileInput.value = "";
}
