var productNameInput = document.getElementById('productName');
var productPriceInput = document.getElementById('productPrice');
var productCategoryInput = document.getElementById('productCategory');
var productDescInput = document.getElementById('productDesc');
var productImgInput = document.getElementById('productImg');
var imgPreview = document.getElementById('imgPreview');

productImgInput.addEventListener('change', function () {
  var file = productImgInput.files[0];
  var reader = new FileReader();

  reader.onload = function () {
    imgPreview.src = reader.result;
  };

  reader.readAsDataURL(file);
});

var addBtn = document.getElementById('add-btn');
var updateBtn = document.getElementById('update-btn');
var clearBtn = document.getElementById('clear-btn');

var productSearchInput = document.getElementById('searchInput');

var KEY = 'data';
var productList = [];

if (localStorage.getItem(KEY) !== null) {
  productList = JSON.parse(localStorage.getItem(KEY));

  if (productList.length > 0) {
    clearBtn.disabled = false;
    renderList(productList);
  } else {
    document.getElementById(
      'displayListHTML'
    ).innerHTML = `<h2 class="text-center bg-danger p-3 rounded-3 text-light">List Is Empty</h2>`;
    clearBtn.disabled = true;
  }
} else {
  document.getElementById(
    'displayListHTML'
  ).innerHTML = `<h2 class="text-center bg-danger p-3 rounded-3 text-light">List Is Empty</h2>`;
  clearBtn.disabled = true;
}

function clearList() {
  productList = [];
  localStorage.removeItem(KEY);
  document.getElementById(
    'displayListHTML'
  ).innerHTML = `<h2 class="text-center bg-danger p-3 rounded-3 text-light">List Is Empty</h2>`;
}

const patterns = [
  {
    productName: /^[a-zA-Z0-9 ]{3,100}$/,
    productPrice: /^(0|[1-9]\d*)(\.\d{1,2})?$/,
    productCategory: /^[a-zA-Z ]{3,50}$/,
    productDesc: /^[a-zA-Z0-9 .,!?()\-]{10,500}$/,
  },
];

function validated(elm) {
  var value = elm.value;
  var pattern = patterns[0][elm.id];

  if (pattern.test(value)) {
    elm.classList.remove('is-invalid');
    elm.classList.add('is-valid');
  } else {
    elm.classList.remove('is-valid');
    elm.classList.add('is-invalid');
  }
}

function emptyInputs() {
  productNameInput.value = '';
  productPriceInput.value = '';
  productCategoryInput.value = '';
  productDescInput.value = '';
  productImgInput.value = '';
  imgPreview.src = '';
}

function createProduct() {
  if (
    !productNameInput.value ||
    !productPriceInput.value ||
    !productCategoryInput.value ||
    !productDescInput.value ||
    !productImgInput.files[0]
  ) {
    alert('Invalid Inputs, please fill all fields including image');
    return;
  }

  var reader = new FileReader();

  reader.onload = function () {
    var product = {
      proName: productNameInput.value,
      proPrice: productPriceInput.value,
      proCategory: productCategoryInput.value,
      proDesc: productDescInput.value,
      proImage: reader.result,
    };

    productList.push(product);
    localStorage.setItem(KEY, JSON.stringify(productList));
    renderList(productList);
    emptyInputs();
  };

  reader.readAsDataURL(productImgInput.files[0]);
}

function renderList(list) {
  var displayList = '';

  for (let i = list.length - 1; i >= 0; i--) {
    displayList += `
         <div class="col-md-3">
        <div class="inner rounded-2 overflow-hidden shadow-lg position-relative">
          <span class="badge bg-primary position-absolute top-0 start-0 m-2">${
            list.length - i
          }</span>

          <img src="${list[i].proImage}" class="w-100 p-2" alt="ProImage">
          <div class="p-2">
            <h3>${list[i].proName}</h3>
            <div class="d-flex justify-content-between">
              <span>${list[i].proPrice}</span>
              <span>${list[i].proCategory}</span>
            </div>
            <p>${list[i].proDesc}</p>
            <div>
              <button onclick="deleteItem(${i})" class="btn btn-outline-danger">Delete</button>
              <button onclick="setupEdit(${i})" class="btn btn-outline-info">Update</button>
            </div>
          </div>
        </div>
      </div>
    `;
  }
  document.getElementById('displayListHTML').innerHTML = displayList;
}

var globalIndex = 0;
var oldImage = null;
function setupEdit(index) {
  globalIndex = index;

  var clickedItem = productList[index];

  productNameInput.value = clickedItem.proName;
  productPriceInput.value = clickedItem.proPrice;
  productCategoryInput.value = clickedItem.proCategory;
  productDescInput.value = clickedItem.proDesc;

  oldImage = clickedItem.proImage;

  imgPreview.src = oldImage;

  productImgInput.value = '';

  addBtn.classList.add('d-none');
  updateBtn.classList.remove('d-none');

  window.scrollTo({
    top: 0,
    behavior: 'smooth',
  });
}

function editFinal() {
  productList[globalIndex].proName = productNameInput.value;
  productList[globalIndex].proPrice = productPriceInput.value;
  productList[globalIndex].proCategory = productCategoryInput.value;
  productList[globalIndex].proDesc = productDescInput.value;

  if (productImgInput.files.length > 0) {
    var reader = new FileReader();

    reader.onload = function () {
      productList[globalIndex].proImage = reader.result;
      saveAfterEdit();
    };

    reader.readAsDataURL(productImgInput.files[0]);
  } else {
    productList[globalIndex].proImage = oldImage;
    saveAfterEdit();
  }
}

function saveAfterEdit() {
  localStorage.setItem(KEY, JSON.stringify(productList));
  renderList(productList);
  emptyInputs();

  addBtn.classList.remove('d-none');
  updateBtn.classList.add('d-none');
}

function deleteItem(index) {
  productList.splice(index, 1);

  localStorage.setItem(KEY, JSON.stringify(productList));
  renderList(productList);
  emptyInputs();
}

function searchByName() {
  var term = productSearchInput.value.toLowerCase().trim();
  var newList = [];

  for (var i = 0; i < productList.length; i++) {
    var value = productList[i].proName.toLowerCase().trim();
    var isTrue = value.includes(term);
    if (isTrue) {
      newList.push(productList[i]);
    }
  }
  renderList(newList);
}
