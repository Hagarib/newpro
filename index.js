
document.addEventListener('DOMContentLoaded', () => {
   /*********************************************************** GET DATA FROM LOCALSTORAGE*******************************************************************/
    const productData = JSON.parse(localStorage.getItem('productData')) ;
    renderProductList(productData);


    /*********************************************************** PRICE AT ACTIVE *******************************************************************/

    document.querySelectorAll('input[type="text"]').forEach(input => {
        input.addEventListener('focus', () => {
            input.parentElement.classList.add('active');
        });

        input.addEventListener('blur', () => {
            input.parentElement.classList.remove('active');
        });
    });

    document.getElementById('searchInput').addEventListener('input', searchProducts);
   
});

/*********************************************************** ADD PRODUCT BUTTON *******************************************************************/
function validateProductName() {
    const productName = document.getElementById('productName').value.trim();
    const productNameRegex = /^[A-Za-z]{4,}$/;
    if (!productName.match(productNameRegex)) {
        document.getElementById('productNameError').style.display = 'inline';
    } else {
        document.getElementById('productNameError').style.display = 'none';
    }
}


function validateKiloPrice() {
    const kiloprice = document.getElementById('kiloprice').value.trim();
    if (!kiloprice || isNaN(kiloprice)) {
        document.getElementById('kilopriceError').style.display = 'inline';
    } else {
        document.getElementById('kilopriceError').style.display = 'none';
    }
}


function validateTonPrice() {
    const tonprice = document.getElementById('tonprice').value.trim();
    if (!tonprice || isNaN(tonprice)) {
        document.getElementById('tonpriceError').style.display = 'inline';
    } else {
        document.getElementById('tonpriceError').style.display = 'none';
    }
}


function validatePriceCheck() {
    const pricecheck = document.getElementById('Pricecheck').value.trim();
    if (!pricecheck || isNaN(pricecheck)) {
        document.getElementById('PricecheckError').style.display = 'inline';
    } else {
        document.getElementById('PricecheckError').style.display = 'none';
    }
}
function validateType() {
    const type = document.getElementById('type').value;
    if (!type) {
        document.getElementById('typeError').style.display = 'inline';
    } else {
        document.getElementById('typeError').style.display = 'none';
    }
}

function validateDescription() {
    const description = document.getElementById('Description').value;
    if (!description) {
        document.getElementById('DescriptionError').style.display = 'inline';
    } else {
        document.getElementById('DescriptionError').style.display = 'none';
    }
}



document.getElementById('productName').addEventListener('input', validateProductName);
document.getElementById('kiloprice').addEventListener('input', validateKiloPrice);
document.getElementById('tonprice').addEventListener('input', validateTonPrice);
document.getElementById('Pricecheck').addEventListener('input', validatePriceCheck);


document.getElementById('addProduct').addEventListener('click', function(event) {
    event.preventDefault();

    let isValid = true;

   
    validateProductName();
    validateKiloPrice();
    validateTonPrice();
    validatePriceCheck();
    validateType();
    validateDescription();

   
    if (document.querySelectorAll('.error[style*="display: inline"]').length > 0) {
        isValid = false;
    }

    if (isValid) {
        
        const productData = JSON.parse(localStorage.getItem('productData')) || [];
        const newProduct = {
            productName: document.getElementById('productName').value.trim(),
            kiloprice: document.getElementById('kiloprice').value.trim(),
            tonprice: document.getElementById('tonprice').value.trim(),
            Pricecheck: document.getElementById('Pricecheck').value.trim(),
            type: document.getElementById('type').value,
            Description: document.getElementById('Description').value
        };

        productData.push(newProduct);
        localStorage.setItem('productData', JSON.stringify(productData));
        renderProductList(productData);
        document.getElementById('productForm').reset();
    }
});

/*********************************************************** CLEAR INPUTES *******************************************************************/
document.getElementById('clear').addEventListener('click', function() {
    document.getElementById('productForm').reset();
});



/*********************************************************** search about product *******************************************************************/

function searchProducts() {
    const searchInput = document.getElementById('searchInput').value.toLowerCase();
    const productData = JSON.parse(localStorage.getItem('productData')) || [];
    const filteredProducts = productData.filter(product => {
        return product.productName.toLowerCase().includes(searchInput) ||
               product.type.toLowerCase().includes(searchInput) ||
               product.Description.toLowerCase().includes(searchInput);
    });
    renderProductList(filteredProducts);
}


/*********************************************************** LIST PRODUCT  *******************************************************************/
function renderProductList(productData) {
    const productList = document.getElementById('productList');
    productList.innerHTML = '';
    productData.forEach((product, index) => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${index + 1}</td>
            <td>${product.productName} </td>
            <td>${product.kiloprice} L.E</td>
            <td>${product.tonprice} L.E</td>
            <td>${product.Pricecheck} L.E</td>
            <td>${product.type}</td>
            <td>${product.Description}</td>
            <td class="button-cell">
                <button class="edit-button" data-index="${index}">Edit</button>
                <button class="delete-button" data-index="${index}">Delete</button>
            </td>
        `;
        productList.appendChild(tr);
    });

    document.querySelectorAll('.edit-button').forEach(button => {
        button.addEventListener('click', handleEdit);
    });

    document.querySelectorAll('.delete-button').forEach(button => {
        button.addEventListener('click', handleDelete);
    });
}

/*********************************************************** DELETE  ITEM BUTTON *******************************************************************/
function handleDelete(event) {
    const index = event.target.dataset.index;
    const productData = JSON.parse(localStorage.getItem('productData'));
    productData.splice(index, 1);
    localStorage.setItem('productData', JSON.stringify(productData));
    renderProductList(productData);
}
/*********************************************************** EDIT PRODUCT BUTTON *******************************************************************/
function handleEdit(event) {
    const index = event.target.dataset.index;
    const productData = JSON.parse(localStorage.getItem('productData')) || [];
    const product = productData[index];

    document.getElementById('productName').value = product.productName;
    document.getElementById('kiloprice').value = product.kiloprice;
    document.getElementById('tonprice').value = product.tonprice;
    document.getElementById('Pricecheck').value = product.Pricecheck;
    document.getElementById('type').value = product.type;
    document.getElementById('Description').value = product.Description;

    document.getElementById('addProduct').style.display = 'none';

    let saveButton = document.getElementById('saveChanges');
    if (!saveButton) {
        saveButton = document.createElement('button');
        saveButton.textContent = 'Save Changes';
        saveButton.id = 'saveChanges';
        saveButton.type = 'button';
        document.querySelector('.formitem:last-of-type').appendChild(saveButton);
    }

    saveButton.onclick = function() {
        let isValid = true;

        validateProductName();
        validateKiloPrice();
        validateTonPrice();
        validatePriceCheck();
        validateType();
        validateDescription();

        if (document.querySelectorAll('.error[style*="display: inline"]').length > 0) {
            isValid = false;
        }

        if (isValid) {
            productData[index] = {
                productName: document.getElementById('productName').value.trim(),
                kiloprice: document.getElementById('kiloprice').value.trim(),
                tonprice: document.getElementById('tonprice').value.trim(),
                Pricecheck: document.getElementById('Pricecheck').value.trim(),
                type: document.getElementById('type').value,
                Description: document.getElementById('Description').value
            };

            localStorage.setItem('productData', JSON.stringify(productData));
            renderProductList(productData);

            document.getElementById('productForm').reset();
            document.getElementById('addProduct').style.display = 'inline';
            saveButton.remove();
        }
    };
}



/*********************************************************** DELETE ALL ITEMS BUTTON *******************************************************************/
document.getElementById('delete').addEventListener('click', function(event) {
    document.getElementById('modal').style.display = 'block';
});

document.querySelector('.close').addEventListener('click', function(event) {
    document.getElementById('modal').style.display = 'none';
});

document.getElementById('confirm-delete').addEventListener('click', function(event) {
    localStorage.removeItem('productData'); 
    renderProductList([]);
    document.getElementById('modal').style.display = 'none';
});

window.onclick = function(event) {
    if (event.target == document.getElementById('modal')) {
        document.getElementById('modal').style.display = 'none';
    }
};