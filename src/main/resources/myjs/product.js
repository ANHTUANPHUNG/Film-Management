
const productForm = document.getElementById('productForm');
const tBody = document.getElementById('tBody');
const ePagination = document.getElementById('pagination')
const eSearch = document.getElementById('search')
const ePriceRange = document.getElementById('priceRange');
const formBody = document.getElementById('formBody');
const ePrice = document.getElementById('price-check')
let rooms = [];
let productSelected = {};
let idImages = [];
let idPoster = [];
const avatarDefaultImage = document.createElement('img');
const avatarDefaultPoster = document.createElement('img');

let pageable = {
    page: 1,
    sort: 'id,desc',
    search: '',
    min: 1,
    max: 50000000000000,
}
// Lấy tham chiếu đến phần tử <span> và tham chiếu đến lớp "arrow-up"
const priceSpan = document.querySelector('.arrow');
const arrowUpClass = 'arrow-up';

priceSpan.addEventListener('click', function() {
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
    const minPrice = parseFloat(min);
    const maxPrice = parseFloat(max);
    pageable.min = minPrice;
    pageable.max = maxPrice;
    getList();

}
// $(document).ready(function () {
//     $('#authors').select2({
//         dropdownParent: $('#staticBackdrop'),
//         data: authors, // Populate the authors data here
//     });
//     const select = document.getElementsByClassName('select2-selection')[0].style;
//     select.borderRadius = '0';
//     // select.background ='black'
//
// });
productForm.onsubmit = async (e) => {
    e.preventDefault();
    let data = getDataFromForm(productForm);
    data = {
        ...data,
        id: productSelected.id,
        poster:{id:idPoster[0]},
        images: idImages.map(e => {
            return {
                id: e
            }
        })
    }
    if (productSelected.id) {
        await editRoom(data);
    } else {
        await createRoom(data)
    }
    renderTable();
    $('#staticBackdrop').modal('hide');
}

async function renderTable() {
    const pageable = await getRooms();
    rooms = pageable.content;
    renderTBody(rooms);
    addEventEditAndDelete();
}
async function getRooms() {
    const res = await fetch('/api/products');
    return await res.json();
}
const addEventEditAndDelete = () => {
    const eEdits = tBody.querySelectorAll('.edit');
    const eDeletes = tBody.querySelectorAll('.delete');
    for (let i = 0; i < eEdits.length; i++) {
        console.log(eEdits[i].id)
        eEdits[i].addEventListener('click', () => {
            onShowEdit(eEdits[i].dataset.id);
        })
    }
}

async function  editRoom (data){
    // const imgContainers = document.getElementsByClassName("image-preview col-3");
    // const images = [];
    //
    // for (let i = 0; i < imgContainers.length; i++) {
    //     const img = imgContainers[i].querySelector("img");
    //     if (img) {
    //         images.push(img.src);
    //     }
    // }
    //
    // data.images = images;
    // const poster = document.getElementById("poster")
    // const posterImg = poster.querySelectorAll("img");
    // if (posterImg) {
    //     data.poster = posterImg.src;
    // }
    // // showImgInForm(productSelected.images);

    const response = await fetch('/api/products/'+data.id, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });
    if (response.ok) {
        Swal.fire({
            title: 'Edited',
            text: 'Phòng đã được tạo thành công.',
            icon: 'success',
            confirmButtonText: 'OK'
        }).then(() => {
            location.reload(); // Tải lại trang sau khi tạo phòng
        });
    } else {
        Swal.fire({
            title: 'Error',
            text: 'Có lỗi xảy ra khi tạo phòng.',
            icon: 'error',
            confirmButtonText: 'OK'
        });
    }
}
async function createRoom(data) {
       const response = await fetch('/api/products', {

        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });
    console.log(response)
    if (response.ok) {
        Swal.fire({
            title: 'Created',
            text: 'Phòng đã được tạo thành công.',
            icon: 'success',
            confirmButtonText: 'OK'
        }).then(() => {
            getList();
        });
    } else {
        Swal.fire({
            title: 'Error',
            text: 'Có lỗi xảy ra khi tạo phòng.',
            icon: 'error',
            confirmButtonText: 'OK'
        });
    }
}
const onShowCreate = () => {
    document.getElementById('poster').innerHTML = ' <i id="uploadIcon" class="fas fa-upload" style="font-size: 95px;"></i>'
    clearForm1();
    clearForm2();
    $('#staticBackdropLabel').text('Create Service');

}
document.getElementById('create').onclick = () => {
    onShowCreate();
}
const findById = async (id) => {
    const response = await fetch('/api/products/' + id);
    return await response.json();
}
const onShowEdit = async (id) => {
    clearForm1();
    clearForm2();
    productSelected = await findById(id);
    const poster = document.getElementById("poster");
    // poster.style.marginLeft="13px";
    const img = document.createElement('img');
    img.src = productSelected.poster;
    img.style.width='150px';
    img.style.height='100px';

    if(productSelected.poster){
        document.getElementById("uploadIcon").style.display="none";
        poster.append(img)
    }
    showImgInForm(productSelected.images);
    $('#staticBackdropLabel').text('Edit Service');
    $('#staticBackdrop').modal('show');
    $('#name').val(productSelected.name);
    $('#description').val(productSelected.description);
    $('#price').val(productSelected.price);
    // document.getElementById("uploadIcon").style.display="none";
}
function showImgInForm(images) {
    const imgEle = document.getElementById("images");
    const imageOld = imgEle.querySelectorAll('img');
    // for (let i = 0; i < imageOld.length; i++) {
    //     imgEle.removeChild(imageOld[i])
    // }
    if (images) {
        images.forEach((img) => {
            const imagePreview = document.createElement("div");
            imagePreview.classList.add("image-preview");
            imagePreview.classList.add("col-3");
            imagePreview.style.marginRight = "35px";
            imagePreview.style.marginTop = "10px";
            imagePreview.id= "img-"+ img;
            const image = document.createElement('img');
            image.src = img;
            image.alt = "Selected Image";
            image.classList.add('avatar-previews');
            const deleteIcon = document.createElement("div");
            deleteIcon.classList.add("delete-icon");
            deleteIcon.innerHTML = `<i class="fas fa-times-circle" ></i>`;
            deleteIcon.addEventListener("click", (event) => {
                removeImage(img);
            });

            imagePreview.appendChild(image);
            imagePreview.appendChild(deleteIcon);
            imgEle.appendChild(imagePreview);
            // document.getElementById("image").style.display = "none";

        });
    }

}
function getDataFromForm(form) {
    // event.preventDefault()
    const data = new FormData(form);
    return Object.fromEntries(data.entries())
}
function formatCurrency(number) {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(number);
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
                        ${formatCurrency(item.price)}
                    </td>
                    <td style="width: 92px;text-align: center" >
                        <img src="${item.poster}" alt="" class="enlarge-image" style="width: 83px;height: 83px">
                    </td>
                     <td style="width: 120px;" >
                     <a class="btn detail" data-id="${item.id}" onclick="onShowDetail(${item.id})" id ="detail" style="padding-left: 5px;    width: 47px;
">
    <i class="fas fa-info-circle text-info"></i>
</a>
            <a class="btn edit" data-id="${item.id}" onclick="onShowEdit(${item.id})" id="edit" style="padding: 0;     width: 21px;
">
               <i class="fa-regular fa-pen-to-square text-primary"></i>
            </a>
            <a class="btn delete" data-id="${item.id}" onclick="deleteItem(${item.id})" id="delete" style="padding-right: 5px;    width: 47px;
">
                <i class="fa-regular fa-trash-can text-danger"></i>
            </a> 
            

        </td>
                </tr>`
}


async function getList() {
    const response = await fetch(`/api/products?page=${pageable.page - 1 || 0}&sort=${pageable.sortCustom || 'id,desc'}&search=${pageable.search || ''}&min=${pageable.min || ''}&max=${pageable.max || ''}`);
    const result = await response.json();

    pageable = {
        ...pageable,
        ...result
    };
    genderPagination();
    renderTBody(result.content);
}
window.onload = async () => {
    await getList();
    onLoadSort();
}
function renderTBody(items) {
    let str = '';
    if (Array.isArray(items)) {

        items.forEach(e => {
            str += renderItemStr(e);
        });
    }
    tBody.innerHTML = str;
}

async function deleteItem(itemId) {
    const { isConfirmed } = await Swal.fire({
        title: 'Xác nhận xóa',
        text: 'Bạn có chắc chắn muốn xóa mục này?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Xóa',
        cancelButtonText: 'Hủy',
    });

    if (!isConfirmed) {
        return; // Người dùng đã hủy xóa
    }

    const response = await fetch(`/api/products/${itemId}`, {
        method: 'DELETE',
    });

    if (response.ok) {
        Swal.fire('Xóa thành công', '', 'success');
        await getList();
    } else {
        Swal.fire('Xóa không thành công', '', 'error');
    }
}

const genderPagination = () => {
    ePagination.innerHTML = '';
    let str = '';
    //generate preview truoc
    str += `<li class="page-item ${pageable.first ? 'disabled' : ''}">
              <a class="page-link" href="#" tabindex="-1" aria-disabled="true">Previous</a>
            </li>`
    //generate 1234

    for (let i = 1; i <= pageable.totalPages; i++) {
        str += ` <li class="page-item ${(pageable.page) === i ? 'active' : ''}" aria-current="page">
      <a class="page-link" href="#">${i}</a>
    </li>`
    }
    //
    //generate next truoc
    str += `<li class="page-item ${pageable.last ? 'disabled' : ''}">
              <a class="page-link" href="#" tabindex="-1" aria-disabled="true">Next</a>
            </li>`
    //generate 1234
    ePagination.innerHTML = str;

    const ePages = ePagination.querySelectorAll('li'); // lấy hết li mà con của ePagination
    const ePrevious = ePages[0];
    const eNext = ePages[ePages.length-1]

    ePrevious.onclick = () => {
        if(pageable.page === 1){
            return;
        }
        pageable.page -= 1;
        getList();
    }
    eNext.onclick = () => {
        if(pageable.page === pageable.totalPages){
            return;
        }
        pageable.page += 1;
        getList();
    }
    for (let i = 1; i < ePages.length - 1; i++) {
        if(i === pageable.page){
            continue;
        }
        ePages[i].onclick = () => {
            pageable.page = i;
            getList();
        }
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
const onLoadSort = () => {
    ePrice.onclick = () => {
        let sort = 'price,desc'
        if(pageable.sortCustom?.includes('price') &&  pageable.sortCustom?.includes('desc')){
            sort = 'price,asc';
        }
        pageable.sortCustom = sort;
        getList();
    }
}




function clearForm1() {
    idImages = [];
    document.getElementById('name').value = ''; // Xóa giá trị của trường 'name'
    document.getElementById('description').value = ''; // Xóa giá trị của trường 'description'
    document.getElementById('price').value = '';
    document.getElementById('priceError').innerText = '';
    document.getElementById('descriptionError').innerText = '';
    document.getElementById('nameError').innerText = '';
    const imgEle = document.getElementById("images");
    imgEle.innerHTML = '';
    const imageOld = imgEle.querySelectorAll('img');
    for (let i = 0; i < imageOld.length; i++) {
        imgEle.removeChild(imageOld[i]);
    }
    avatarDefaultImage.classList.add('avatar-previews');
    productForm.reset();
    userSelected = {};
}


function clearForm2() {
    idPoster = [];

    const imgEle = document.getElementById("poster");
    const imageOld = imgEle.querySelectorAll('img');
    for (let i = 0; i < imageOld.length; i++) {
        imgEle.removeChild(imageOld[i])
    }
    avatarDefaultPoster.classList.add('avatar-previews');
    productForm.reset();
    productSelected = {};
}
const arr =[];

async function previewImage(evt) {
    if (evt.target.files.length === 0) {
        return;
    }
    document.getElementById("imagesError").textContent = '';
    document.getElementById("save").disabled = true;

    idImages = [];

    const imgEle = document.getElementById("images");
    // imgEle.innerHTML = '';
    const files = evt.target.files;
    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        await previewImageFile(file, i);

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
    // addUploadLabel();

}

async function previewImageFile(file, index) {
    const imgContainer = document.getElementById("images");

    const imagePreview = document.createElement("div");
    imagePreview.classList.add("image-preview");
    imagePreview.classList.add("col-3");
    imagePreview.style.marginRight = "35px";
    imagePreview.style.marginTop = "10px";
    imagePreview.id= "img-"+ index;
    const img = document.createElement('img');
    img.src = URL.createObjectURL(file);
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
    // document.getElementById("image").style.display = "none";
}
// function addUploadLabel() {
//     const imgContainer = document.getElementById("images");
//
//     // Tạo label và icon tải ảnh lên
//     const label = document.createElement("label");
//     label.id = "image";
//     label.htmlFor = "file";
//     label.style.display = "flex";
//     label.style.flexWrap = "wrap";
//     label.innerHTML = '<i class="fas fa-upload" style="font-size: 95px; margin: 5px"></i>';
//
//     imgContainer.appendChild(label);
// }
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
    document.getElementById("posterError").textContent='';

    document.getElementById("save").disabled = true;

    const imgPost = document.getElementById("poster");
    const imageOld1 = imgPost.querySelectorAll('img');
    for (let i = 0; i < imageOld1.length; i++) {
        imgPost.removeChild(imageOld1[i])
    }

    // When the image is loaded, update the img element's src
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
            // Nếu phần tử 'uploadIcon' tồn tại, thay đổi trạng thái hiển thị
            uploadIcon.style.display = 'none';
        }


    };

    reader.readAsDataURL(file);
}

var eMenubar = document.getElementsByClassName("menu-item");
for (var i = 0; i < eMenubar.length; i++) {
    eMenubar[i].classList.remove("active");
}
document.getElementById("menu-service").classList.add("active");

function validateName(inputField) {
    const nameValue = inputField.value;
    const nameError = document.getElementById("nameError");
    const saveButton = document.getElementById("save");

    // Sử dụng biểu thức chính quy để kiểm tra tiếng Việt có dấu và ít nhất một chữ cái
    const vietnameseWithDiacriticsAndLetterRegex = /^[A-Za-zÀ-ỹ\s]*[A-Za-zÀ-ỹ]+[A-Za-zÀ-ỹ\s]*$/;


    if (!vietnameseWithDiacriticsAndLetterRegex.test(nameValue)) {
        nameError.textContent = "Tên sản phẩm phải chứa ít nhất một chữ cái và không được có số.";
        nameError.style.fontSize = "14px"; // Điều chỉnh font size ở đây (ví dụ: 14px)
        saveButton.disabled = true;
        saveButton.style.opacity = 0.5;
    } else {
        nameError.textContent = '';
        saveButton.disabled = false;
        saveButton.style.opacity = 1;

    }
}

function validateDescription(inputField) {
    const descriptionValue = inputField.value;
    const descriptionError = document.getElementById("descriptionError");
    const saveButton = document.getElementById("save");

    // Sử dụng biểu thức chính quy để kiểm tra xem giá trị chỉ chứa ít nhất một chữ cái và không có số
    const validDescriptionRegex = /^[^\d]*[A-Za-zÀ-ỹ][^\d]*$/;

    if (!validDescriptionRegex.test(descriptionValue)) {
        descriptionError.textContent = "Mô tả sản phẩm phải chứa ít nhất một chữ cái và không được chứa số.";
        descriptionError.style.fontSize = "14px"; // Điều chỉnh font size ở đây (ví dụ: 14px)
        saveButton.disabled = true;
        saveButton.style.opacity = 0.5;
    } else {
        descriptionError.textContent = '';
        saveButton.disabled = false;
        saveButton.style.opacity = 1;
    }
}


function validatePrice(inputField) {
    const priceValue = inputField.value;
    const priceError = document.getElementById("priceError");
    const saveButton = document.getElementById("save");

    // Kiểm tra xem giá trị có phải là một số hợp lệ và nằm trong khoảng từ 10.000 đến 1.000.000 hay không
    const isValidPrice = !isNaN(priceValue) && parseFloat(priceValue) >= 10000 && parseFloat(priceValue) <= 1000000;

    if (!isValidPrice) {
        priceError.textContent = "Giá trị không hợp lệ. Vui lòng nhập số từ 10.000đ đến 1.000.000đ.";
        priceError.style.fontSize = "14px"; // Điều chỉnh font size ở đây (ví dụ: 14px)
        saveButton.disabled = true;
        saveButton.style.opacity = 0.5;

    } else {
        priceError.textContent = ''; // Xóa thông báo lỗi nếu giá trị hợp lệ
        saveButton.disabled = false;
        saveButton.style.opacity = 1;

    }
}
function validateForm() {
    const nameInput = document.getElementById("name");
    const descriptionInput = document.getElementById("description");
    const priceInput = document.getElementById("price");
    const posterInput = document.getElementById("post");
    const imagesInput = document.getElementById("file");

    const nameError = document.getElementById("nameError");
    const descriptionError = document.getElementById("descriptionError");
    const priceError = document.getElementById("priceError");
    const posterError = document.getElementById("posterError");
    const imagesError = document.getElementById("imagesError");
    let hasError = false;

    if (!nameInput.checkValidity()) {
        nameError.textContent = "Tên sản phẩm là trường bắt buộc.";
        hasError = true;
    }

    if (!descriptionInput.checkValidity()) {
        descriptionError.textContent = "Mô tả sản phẩm là trường bắt buộc.";
        hasError = true;
    }

    if (!priceInput.checkValidity()) {
        priceError.textContent = "Giá sản phẩm là trường bắt buộc và phải là số.";
        hasError = true;
    }

    if (posterInput.files.length === 0 && document.querySelectorAll("#poster img").length === 0) {
        posterError.textContent = "Vui lòng tải lên một poster.";
        hasError = true;
    }
    if (imagesInput.files.length === 0 && document.querySelectorAll("#images img").length === 0) {
        imagesError.textContent = "Vui lòng tải lên ít nhất một images.";
        hasError = true;
    }
    if (!hasError) {
        // Nếu không có lỗi, gửi form
        document.getElementById("productForm").submit();
    }


}


