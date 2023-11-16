const comboForm = document.getElementById('packageForm');
const tBodyPackage = document.getElementById('tBodyPackage');
const paginationCombo = document.getElementById('paginationCombo')
const eSearch = document.getElementById('search')
const ePriceRange = document.getElementById('priceRange');
const ePrice = document.getElementById('price-check');
const nameInput = document.getElementById("name");
const productInput = document.getElementById("products");
const descriptionInput = document.getElementById("description");
const priceInput = document.getElementById("price");
const posterInput = document.getElementById("post");
const nameError = document.getElementById("nameError");
const descriptionError = document.getElementById("descriptionError");
const productsError = document.getElementById("productsError");
const priceError = document.getElementById("priceError");
const posterError = document.getElementById("posterError");
const saveButton = document.getElementById("save");

let combos = [];
let comboSelected = {};
let idImages = [];
let idPoster = [];


let pageable = {
    page: 1,
    sort: 'id,desc',
    search: '',
    min: 1,
    max: 50000000000000,
}
window.onload = async () => {
    await getList();
    onLoadSort();
}

async function getList() {
    const response = await fetch(`/api/combos?page=${pageable.page - 1 || 0}&sort=${pageable.sortPackage || 'id,desc'}&search=${pageable.search || ''}&min=${pageable.min || ''}&max=${pageable.max || ''}`);
    const result = await response.json();

    pageable = {
        ...pageable,
        ...result
    };
    genderPagination();
    rendertBodyPackage(result.content);
}
function rendertBodyPackage(items) {
    let str = '';
    if (Array.isArray(items)) {

        items.forEach(e => {
            str += renderItemStr(e);
        });
    }
    tBodyPackage.innerHTML = str;
}

function renderItemStr(item) {
    return `<tr>
                    <td>
                        ${item.id}
                    </td>
                    <td>
                       ${item.name}
                    </td>
                    <td>
                        ${item.description}
                    </td>
                    <td>
                        ${item.products}
                    </td>
                    <td>
                        ${formatCurrency(item.price)}
                    </td>
                    
                    <td style="width: 92px;text-align: center" >
                        <img src="${item.poster}" alt="" class="enlarge-image" style="width: 83px;height: 83px">
                    </td>
                    <td style="width: 120px;" >
                        <a class="btn detail" data-id="${item.id}" onclick="onShowDetail(${item.id})" id ="detail" style="padding-left: 5px;    width: 40px;
">
                            <i class="fas fa-info-circle text-info"></i>
                        </a>
                        <a class="btn edit" data-id="${item.id}" onclick="onShowEdit(${item.id})" id="edit" style="padding: 0;     width: 21px;
">
                            <i class="fa-regular fa-pen-to-square text-primary"></i>
                        </a>
                        <a class="btn delete" data-id="${item.id}" onclick="deleteItem(${item.id})" id="delete" style="padding-right: 5px;    width: 22px;
">
                            <i class="fa-regular fa-trash-can text-danger"></i>
                        </a> 
                    </td>
                </tr>`
}
function formatCurrency(number) {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(number);
}

// được sử dụng để sắp xếp theo asc hoặc desc
const priceSpan = document.querySelector('.arrow');
const arrowUpClass = 'arrow-up';
priceSpan.addEventListener('click', () =>{
    if (priceSpan.classList.contains(arrowUpClass)) {
        priceSpan.innerHTML = 'Price &#9650;'; // Ngược lên
        priceSpan.classList.remove(arrowUpClass);
    } else {
        priceSpan.innerHTML = 'Price &#9660;'; // Ngược xuống
        priceSpan.classList.add(arrowUpClass);
    }
});
ePriceRange.onchange= () => {
    const priceRange = ePriceRange.value;
    const [min, max] = priceRange.split('-').map(Number);
    searchByPrice(min, max);
    getList();
};
function searchByPrice(min, max) {
    const minPrice = (min);
    const maxPrice = parseFloat(max);
    pageable.min = minPrice;
    pageable.max = maxPrice;
    getList();
}
const onLoadSort = () => {
    ePrice.onclick = () => {
        let sort = 'price,desc'
        if(pageable.sortPackage?.includes('price') &&  pageable.sortPackage?.includes('desc')){
            sort = 'price,asc';
        }
        pageable.sortPackage = sort;
        getList();
    }
}
function getDataFromPackage(form) {
    event.preventDefault()
    const data = new FormData(form);
    return Object.fromEntries(data.entries())
}
$(document).ready(function () {
    $('.js-example-basic-single').select2({
        dropdownParent: $('#staticBackdrop')
    });
    $('.js-example-basic-multiple').select2({
        dropdownParent: $('#staticBackdrop')
    })
});
// xử lí khi nhấn submit
comboForm.onsubmit = async (e) => {
    const areaError = $('.area-error');
    areaError.empty();

    let hasError = false;

    if (nameInput.value.trim() === "") {
        nameError.textContent = "Tên sản phẩm là trường bắt buộc.";
        hasError = true;
    } else {
        nameError.textContent = ''; // Xóa thông báo lỗi nếu hợp lệ
    }
    if (productInput.value.trim() === "") {
        productsError.textContent = "Sản phẩm là trường bắt buộc.";
        hasError = true;
    } else {
        productsError.textContent = ''; // Xóa thông báo lỗi nếu hợp lệ
    }

    if (descriptionInput.value.trim() === "") {
        descriptionError.textContent = "Mô tả sản phẩm là trường bắt buộc.";
        hasError = true;
    } else {
        descriptionError.textContent = ''; // Xóa thông báo lỗi nếu hợp lệ
    }

    if (priceInput.value.trim() === "") {
        priceError.textContent = "Giá sản phẩm là trường bắt buộc và phải là số.";
        hasError = true;
    } else {
        priceError.textContent = ''; // Xóa thông báo lỗi nếu hợp lệ
    }

    if(document.getElementById("staticBackdropLabel").innerText === "Create Package"){
        if ( posterInput.value.trim() === "") {
            posterError.textContent = "Poster là trường bắt buộc.";
            hasError = true;
        } else {
            posterError.textContent = ''; // Xóa thông báo lỗi nếu hợp lệ
        }
    }



    if (hasError){
        e.preventDefault();
        return;
    }

    let data = getDataFromPackage(comboForm);
    idImages=[];
    const imagesDiv = document.getElementById('images');
    const imgElements = imagesDiv.querySelectorAll('img');
    for (let img of imgElements) {
        idImages.push(img.id);
    }
    const idProducts = $("#products").select2('data').map(e => e.id);

    data = {
        ...data,
        idProducts,
        id: comboSelected.id,
        poster: { id: idPoster[0] },
        images: idImages.map(e => {
            return {
                id: e
            }
        })
    }
    if (comboSelected.id) {
        await editPackage(data);
    } else {
        await createPackage(data)
    }
    // await renderTable();
}
function onChangeSelect2(selector, value){
    const element = $(selector);
    element.val(value);
    element.change();
}

async function renderTable() {

    const result = await (await fetch(`/api/combos?page=${pageable.page - 1 || 0}&sort=${pageable.sortPackage || 'id,desc'}&search=${pageable.search || ''}&min=${pageable.min || ''}&max=${pageable.max || ''}`)).json()
    combos = result.content;
    rendertBodyPackage(combos);
}
document.getElementById('create').onclick = () => {
    onShowCreate();
}
const onShowCreate = () => {
    document.getElementById('poster').innerHTML = ' <i id="uploadIcon" class="fas fa-upload" style="font-size: 95px;"></i>'
    clearForm();
    $('#staticBackdropLabel').text('Create Package');

}
// create submit
async function createPackage(data) {
    const response = await fetch('/api/combos', {

        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });
    if (response.ok) {
        $('#staticBackdrop').modal('hide');

        Swal.fire({
            title: 'Đang xử lý',
            text: 'Vui lòng chờ...',
            willOpen: () => {
                Swal.showLoading();
            },
            timer: 2000, // Đợi 2 giây (2000ms)
            showCancelButton: false,
            showConfirmButton: false,
            allowOutsideClick: false
        }).then(async (result) =>  {
            if (result.dismiss === Swal.DismissReason.timer) {
                // Sau khi đợi 2 giây, hiển thị thông báo thành công
                await  Swal.fire({
                    title: 'Created',
                    text: 'Tạo thành công.',
                    icon: 'success',
                    showConfirmButton: false,
                    position: 'top-start',
                    timer: 1500 // Hiển thị thông báo thành công trong 1,5 giây (1500ms)
                });
                renderTable();

            }
        });
    } else {
        const responseJSON = await response.json();
        if (responseJSON) {
            const errorFullNameElement = document.getElementById("nameError");
            if ("name" in responseJSON) {
                errorFullNameElement.style.display = "block";
                errorFullNameElement.innerText = responseJSON.name;
                errorFullNameElement.style.color= "red"
            }
            const errorEmailElement = document.getElementById("descriptionError");
            if ("description" in responseJSON) {
                errorEmailElement.style.display = "block";
                errorEmailElement.innerText = responseJSON.description;
                errorEmailElement.style.color= "red"
            }
            const productsErrorElement = document.getElementById("productsError");
            if ("idProducts" in responseJSON) {
                productsErrorElement.style.display = "block";
                productsErrorElement.innerText = responseJSON.idProducts;
                productsErrorElement.style.color= "red"
            }
            const errorAddressElement = document.getElementById("priceError");
            if ("price" in responseJSON) {
                errorAddressElement.style.display = "block";
                errorAddressElement.innerText = responseJSON.price;
                errorAddressElement.style.color= "red"
            }
            const errorPosterElement = document.getElementById("posterError");
            if ("poster" in responseJSON) {
                errorPosterElement.style.display = "block";
                errorPosterElement.innerText = responseJSON.poster;
                errorPosterElement.style.color= "red"
            }
        }
    }
}

const findById = async (id) => {
    const response = await fetch('/api/combos/' + id);
    return await response.json();
}


const onShowEdit = async (id) => {
    clearForm();
    comboSelected = await findById(id);
    const poster = document.getElementById("poster");
    const img = document.createElement('img');
    img.src = comboSelected.poster;
    img.id = comboSelected.idPoster;
    img.style.width='150px';
    img.style.height='100px';

    if(comboSelected.poster){
        document.getElementById("uploadIcon").style.display="none";
        poster.append(img)
    }
    showImgInForm(comboSelected.images, comboSelected.idImages);
    $('#staticBackdropLabel').text('Edit Package');
    $('#staticBackdrop').modal('show');
    $('#name').val(comboSelected.name);
    $('#description').val(comboSelected.description);
    $('#price').val(comboSelected.price);
    checkProductSelect();
}
function checkProductSelect() {

    $('#products').val(comboSelected.productsId);
    $('#products').trigger('change');
}

function showImgInForm(images, idImages) {
    const imgEle = document.getElementById("images");

    if (images) {
        images.forEach((img, index) => {
            const imagePreview = document.createElement("div");
            imagePreview.classList.add("image-preview");
            imagePreview.classList.add("col-3");
            imagePreview.style.marginRight = "35px";
            imagePreview.style.marginTop = "10px";
            imagePreview.id ="img+"+ index;
            const image = document.createElement('img');
            image.src = img;
            image.id=idImages[index];
            image.alt = "Selected Image";
            image.classList.add('avatar-previews');
            const deleteIcon = document.createElement("div");
            deleteIcon.classList.add("delete-icon");
            deleteIcon.innerHTML = `<i class="fas fa-times-circle" ></i>`;
            deleteIcon.addEventListener("click", (event) => {
                removeImageData(index);
                comboSelected.images.splice(index, 1);

            });

            imagePreview.appendChild(image);
            imagePreview.appendChild(deleteIcon);
            imgEle.appendChild(imagePreview);
        });
    }

}
function removeImageData(index) {
    console.log(index)
    const imgContainer = document.getElementById("images");
    const removedImage = document.getElementById("img+"+index);
    imgContainer.removeChild(removedImage);
}

// edit submit
async function  editPackage (data){

    const response = await fetch('/api/combos/'+data.id, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });

    if (response.ok) {
        $('#staticBackdrop').modal('hide');

        Swal.fire({
            title: 'Đang xử lý',
            text: 'Vui lòng chờ...',
            willOpen: () => {
                Swal.showLoading();
            },
            timer: 2000, // Đợi 2 giây (2000ms)
            showCancelButton: false,
            showConfirmButton: false,
            allowOutsideClick: false
        }).then( async (result) => {
            if (result.dismiss === Swal.DismissReason.timer) {
                await Swal.fire({
                    title: 'Edited',
                    text: 'Sửa thành công.',
                    icon: 'success',
                    showConfirmButton: false,
                    position: 'top-start',
                    timer: 900

                })
                await renderTable()

            }
        })
    } else {
        const responseJSON = await response.json();
        if (responseJSON) {
            console.log(responseJSON)
            const errorFullNameElement = document.getElementById("nameError");
            if ("name" in responseJSON) {
                errorFullNameElement.style.display = "block";
                errorFullNameElement.innerText = responseJSON.name;
                errorFullNameElement.style.color= "red"
            }
            const errorEmailElement = document.getElementById("priceError");
            if ("price" in responseJSON) {
                errorEmailElement.style.display = "block";
                errorEmailElement.innerText = responseJSON.price;
                errorEmailElement.style.color= "red"
            }
            const productsErrorElement = document.getElementById("productsError");
            if ("idProducts" in responseJSON) {
                productsErrorElement.style.display = "block";
                productsErrorElement.innerText = responseJSON.idProducts;
                productsErrorElement.style.color= "red"
            }
            const errorAddressElement = document.getElementById("descriptionError");
            if ("description" in responseJSON) {
                errorAddressElement.style.display = "block";
                errorAddressElement.innerText = responseJSON.description;
                errorAddressElement.style.color= "red"
            }

        }
    }
}
async function deleteItem(itemId) {
    const { isConfirmed } = await Swal.fire({
        title: 'Xác nhận xóa',
        text: 'Bạn có chắc chắn muốn xóa sản phẩm này?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Xóa',
        cancelButtonText: 'Hủy',
    });

    if (!isConfirmed) {
        return; // Người dùng đã hủy xóa
    }

    const response = await fetch(`/api/combos/${itemId}`, {
        method: 'DELETE',
    });

    if (response.ok) {
        Swal.fire({
            title: 'Đang xử lý',
            text: 'Vui lòng chờ...',
            willOpen: () => {
                Swal.showLoading();
            },
            timer: 2000, // Đợi 2 giây (2000ms)
            showCancelButton: false,
            showConfirmButton: false,
            allowOutsideClick: false
        }).then((result) => {
            if (result.dismiss === Swal.DismissReason.timer) {
                Swal.fire({
                    title: 'Deleted',
                    text: 'Xóa thành công.',
                    icon: 'success',
                    showConfirmButton: false,
                    position: 'top-start',
                    timer: 900
                })
            }
        });
        await getList();
    } else {
        Swal.fire({
            title: 'Deleted',
            text: 'Xóa không thành công.',
            icon: 'error',
            showConfirmButton: false,
            position: 'top-start',
            timer: 900
        })
    }
}

function clearForm() {
    const areaError = $('.areaError')
    areaError.empty();
    onChangeSelect2('#products', null);

    idImages = [];
    idPoster = [];
    document.getElementById('name').value = '';
    document.getElementById('description').value = '';
    document.getElementById('products').value = '';
    document.getElementById('price').innerText = '';
    document.getElementById('priceError').innerText = '';
    document.getElementById('descriptionError').innerText = '';
    document.getElementById('nameError').innerText = '';
    document.getElementById('posterError').innerText = '';
    document.getElementById('imagesError').innerText = '';
    document.getElementById('name').style.border = '1px solid #d9dee3';
    document.getElementById('description').style.border = '1px solid #d9dee3';
    document.getElementById('price').style.border = '1px solid #d9dee3';
    const imagesEle = document.getElementById("images");
    imagesEle.innerHTML = '';
    const imageChild = imagesEle.querySelectorAll('img');
    for (let i = 0; i < imageChild.length; i++) {
        imagesEle.removeChild(imageChild[i]);
    }
    const posterEle = document.getElementById("poster")
    const posterChild = posterEle.querySelectorAll('img');
    for (let i = 0; i < posterChild.length; i++) {
        posterEle.removeChild(posterChild[i])
    }
    comboForm.reset();
    comboSelected = {};
}

const genderPagination = () => {
    paginationCombo.innerHTML = '';
    let str = '';

    // Xác định khoảng trang cần hiển thị (ví dụ: 5 trang xung quanh trang hiện tại)
    const maxPagesToShow = 5;
    const pagesToLeft = Math.floor(maxPagesToShow / 2);
    const pagesToRight = maxPagesToShow - pagesToLeft;

    // Tính toán trang đầu và trang cuối cần hiển thị
    let startPage = pageable.page - pagesToLeft;
    if (startPage < 1) {
        startPage = 1;
    }
    let endPage = startPage + maxPagesToShow - 1;
    if (endPage > pageable.totalPages) {
        endPage = pageable.totalPages;
    }
    // Generate "Previous" button
    str += `<li class="page-item ${pageable.first ? 'disabled' : ''}">
              <a class="page-link" href="#" tabindex="-1" aria-disabled="true">Previous</a>
            </li>`

    // Generate page numbers
    for (let i = startPage; i <= endPage; i++) {
        str += `<li class="page-item ${(pageable.page) === i ? 'active' : ''}" aria-current="page">
                    <a class="page-link" href="#">${i}</a>
                </li>`
    }

    // Generate "Next" button
    str += `<li class="page-item ${pageable.last ? 'disabled' : ''}">
              <a class="page-link" href="#" tabindex="-1" aria-disabled="true">Next</a>
            </li>`

    paginationCombo.innerHTML = str;

    const ePages = paginationCombo.querySelectorAll('li');
    const ePrevious = ePages[0];
    const eNext = ePages[ePages.length - 1];

    ePrevious.onclick = () => {
        if (pageable.page === 1) {
            return;
        }
        pageable.page -= 1;
        getList();
    }
    eNext.onclick = () => {
        if (pageable.page === pageable.totalPages) {
            return;
        }
        pageable.page += 1;
        getList();
    }
    for (let i = 1; i < ePages.length - 1; i++) {
        const currentPageId = ePages[i].id;

        if (currentPageId === pageable.page) {
            continue;
        }
        ePages[i].onclick = () => {
            pageable.page = parseInt(currentPageId, 10); // Convert id to integer
            getList();
        };
    }
}
const onSearch = (e) => {
    e.preventDefault()
    pageable.search = eSearch.value;
    pageable.page = 1;
    getList();
}

const searchInput = document.querySelector('#search');

searchInput.addEventListener('search', () => {
    onSearch(event)
});


async function previewImage(evt) {
    if (evt.target.files.length === 0) {
        return;
    }
    document.getElementById("imagesError").textContent = '';
    document.getElementById("save").disabled = true;
    idImages = comboSelected?.idImages || [] ;

    const files = evt.target.files;
    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (file) {
            const formData = new FormData();
            formData.append("images", file);
            formData.append("fileType", "image");
            try {
                const response = await fetch("/api/files/images", {
                    method: "POST",
                    body: formData,
                });
                if (response.ok) {
                    const result = await response.json();
                    await previewImageFile(file, i, result.id);
                    if (result) {
                        const id = result.id;
                        idImages.push(id);
                    } else {
                        console.error('Image ID not found in the response.');
                    }
                } else {
                    console.error('Failed to upload image:', response.statusText);
                }
            } catch (error) {
                console.error('An error occurred:', error);
            }
        }
    }

    document.getElementById("save").disabled = false;

}

async function previewImageFile(file, index, id) {
    const imgContainer = document.getElementById("images");
    const imagePreview = document.createElement("div");
    imagePreview.classList.add("image-preview");
    imagePreview.classList.add("col-3");
    imagePreview.style.marginRight = "35px";
    imagePreview.style.marginTop = "10px";
    imagePreview.id= "img-"+ index;
    const img = document.createElement('img');
    img.src = URL.createObjectURL(file);
    img.id = id;

    img.alt = "Selected Image";
    img.classList.add('avatar-previews');
    const deleteIcon = document.createElement("div");
    deleteIcon.classList.add("delete-icon");
    deleteIcon.innerHTML = `<i class="fas fa-times-circle" data-index="${index}"></i>`;
    deleteIcon.addEventListener("click", (event) => {
        removeImage(index);
    });

    imagePreview.appendChild(img);
    imagePreview.appendChild(deleteIcon);
    imgContainer.appendChild(imagePreview);
}

function removeImage(index) {
    console.log(index)
    const imgContainer = document.getElementById("images");
    const removedImage = document.getElementById("img-"+index);
    imgContainer.removeChild(removedImage);
}



async function previewPoster(evt) {

    if(evt.target.files.length === 0){
        return;
    }
    idPoster = [];
    posterError.textContent='';

    saveButton.disabled = true;

    const imgPost = document.getElementById("poster");
    const imageOld1 = imgPost.querySelectorAll('img');
    for (let i = 0; i < imageOld1.length; i++) {
        imgPost.removeChild(imageOld1[i])
    }
    const files = evt.target.files
    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        await previewPosterFile(file, i);
        if (file) {
            const formData = new FormData();
            formData.append("poster", file);
            formData.append("fileType", "image");
            try {
                const response = await fetch("/api/files/posters", {
                    method: "POST",
                    body: formData,
                });
                if (response.ok) {
                    const result = await response.json();
                    if (result) {
                        const id = result.id;
                        idPoster.push(id);
                    } else {
                        console.error('Image ID not found in the response.');
                    }
                } else {
                    console.error('Failed to upload image:', response.statusText);
                }
            } catch (error) {
                console.error('An error occurred:', error);
            }
        }
    }
    saveButton.disabled = false;

}


async function previewPosterFile(file) {
    const reader = new FileReader();

    reader.onload = function () {
        const imgPost = document.getElementById("poster");
        const img = document.createElement('img');
        img.src = reader.result;
        img.classList.add('avatar-previews');
        imgPost.append(img);
        const uploadIcon = document.getElementById('uploadIcon');
        if (uploadIcon) {
            uploadIcon.style.display = 'none';
        }
    };
    reader.readAsDataURL(file);
}

var eMenubar = document.getElementsByClassName("menu-item");
for (var i = 0; i < eMenubar.length; i++) {
    eMenubar[i].classList.remove("active");
}
document.getElementById("menu-combo").classList.add("active");

function validateName(inputField) {
    const nameValue = inputField.value;
    const vietnameseWithDiacriticsAndLetterRegex = /^[A-Za-zÀ-ỹ\s]*[A-Za-zÀ-ỹ]+[A-Za-zÀ-ỹ\s]*$/;
    if (!vietnameseWithDiacriticsAndLetterRegex.test(nameValue)) {
        nameError.textContent = "Tên sản phẩm phải chứa ít nhất một chữ cái và không được có số.";
        nameInput.style.border= "1px solid red"
        nameError.style.fontSize = "14px";
        saveButton.disabled = true;
        saveButton.style.opacity = 0.5;
    } else {
        nameError.textContent = '';
        nameInput.style.border= "1px solid #d9dee3"

        saveButton.disabled = false;
        saveButton.style.opacity = 1;

    }
}

function validateDescription(inputField) {
    const descriptionValue = inputField.value;

    const validDescriptionRegex = /^[^\d]*[A-Za-zÀ-ỹ][^\d]*$/;

    if (!validDescriptionRegex.test(descriptionValue)) {
        descriptionError.textContent = "Mô tả sản phẩm phải chứa ít nhất một chữ cái và không được chứa số.";
        descriptionError.style.fontSize = "14px"; // Điều chỉnh font size ở đây (ví dụ: 14px)
        saveButton.disabled = true;
        saveButton.style.opacity = 0.5;
        descriptionInput.style.border= "1px solid red"
    } else {
        descriptionError.textContent = '';
        saveButton.disabled = false;
        saveButton.style.opacity = 1;
        descriptionInput.style.border= "1px solid #d9dee3"

    }
}


function validatePrice(inputField) {
    const priceValue = inputField.value;

    // Kiểm tra xem giá trị có phải là một số hợp lệ và nằm trong khoảng từ 10.000 đến 1.000.000 hay không
    const isValidPrice = !isNaN(priceValue) && parseFloat(priceValue) >= 10000 && parseFloat(priceValue) <= 1000000;

    if (!isValidPrice) {
        priceError.textContent = "Giá trị không hợp lệ. Vui lòng nhập số từ 10.000đ đến 1.000.000đ.";
        priceError.style.fontSize = "14px"; // Điều chỉnh font size ở đây (ví dụ: 14px)
        saveButton.disabled = true;
        saveButton.style.opacity = 0.5;
        priceInput.style.border= "1px solid red"

    } else {
        priceError.textContent = ''; // Xóa thông báo lỗi nếu giá trị hợp lệ
        saveButton.disabled = false;
        saveButton.style.opacity = 1;
        priceInput.style.border= "1px solid #d9dee3"

    }
}






const onShowDetail = async (id) => {
    let imagesListArray = [];
    // Tạo một phần tử imgFeature một lần duy nhất
    const imgFeature = document.createElement('img');
    imgFeature.src = '';
    imgFeature.classList.add('img-feature');
    document.getElementById('main').appendChild(imgFeature);

    comboSelected = await findById(id);
    if (comboSelected.images.length === 0) {
        document.getElementById('notification').innerText= "không có ảnh"
    } else {
        document.getElementById('notification').innerText= ""
        comboSelected.images.forEach((img, index) => {
            const imagesListShow = document.getElementById('list-image');
            const imagePreview = document.createElement("div");
            imagePreview.classList.add("image-preview");
            imagePreview.classList.add("col-3");
            imagePreview.style.width = "99px";
            imagePreview.style.height = "99px";
            imagePreview.style.marginRight = "5px";
            imagePreview.style.display = "flex";
            imagePreview.style.justifyContent = "center";
            imagePreview.style.alignItems = "center";

            const image = document.createElement('img');
            image.style.height = "94%";
            image.style.width = "94%";
            image.src = img;
            image.id = index;
            image.alt = "Selected Image";
            image.classList.add('image-previews');
            imagePreview.appendChild(image)
            imagesListShow.appendChild(imagePreview);
            if (index === 0) {
                imgFeature.src = img;
                imagePreview.classList.add('active');

            }
            document.querySelectorAll('#list-image div').forEach(item => {
                item.classList.remove('active');
            });
            image.addEventListener('click', () => {

                imgFeature.src = image.getAttribute('src');
                imagePreview.classList.add('active');

            });
            // document.getElementById('active').style.backgroundColor='red';

            imgFeature.style.width = "550px";
            imgFeature.style.height = "414px";
            imgFeature.style.border="1px solid deeppink"
        });
    }
    $('#showImagesList').modal('show');

    let currentIndex = 0;
    let intervalId; // Biến để lưu ID của interval

    const imagePreviews = document.querySelectorAll('#list-image .image-preview ');
    const imageCount = imagePreviews.length;
    intervalId =  setInterval(() => {
        imagePreviews[currentIndex].classList.remove('active');
        imagePreviews[currentIndex].style.backgroundColor= "white"

        console.log((currentIndex + 1) % imageCount)
        currentIndex = (currentIndex + 1) % imageCount;
        imagePreviews[currentIndex].classList.add('active');
        imagePreviews[currentIndex].style.backgroundColor= "purple"
        imgFeature.src = comboSelected.images[currentIndex];

    }, 3000);
    document.getElementById("iconNone").addEventListener('click',()=>{
        if (intervalId) {
            clearInterval(intervalId);
        }
        $('#showImagesList').modal('hide')
        const imagePreviews = document.querySelectorAll('.image-preview');
        imagePreviews.forEach(imagePreview => {
            imagePreview.remove();
        });
        const imageFeatures = document.querySelectorAll('.img-feature');
        imageFeatures.forEach(imageFeature => {
            imageFeature.remove();
        });
    })

}








