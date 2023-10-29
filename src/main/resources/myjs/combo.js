
const comboForm = document.getElementById('comboForm');
const tBody = document.getElementById('tBody');
const ePagination = document.getElementById('pagination')
const eSearch = document.getElementById('search')
const ePriceRange = document.getElementById('priceRange');
const formBody = document.getElementById('formBody');
const ePrice = document.getElementById('price-check')
let rooms = [];
let comboSelected = {};
let idImages = [];
let idPoster = [];
const avatarDefaultImage = document.createElement('img');
const avatarDefaultPoster = document.createElement('img');
let products;
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
$(document).ready(function () {
    $('.js-example-basic-single').select2({
        dropdownParent: $('#staticBackdrop')
    });
    $('.js-example-basic-multiple').select2({
        dropdownParent: $('#staticBackdrop')
    })
});
comboForm.onsubmit = async (e) => {
    const idProducts = $("#products").select2('data').map(e => e.id);
    e.preventDefault();
    let data = getDataFromForm(comboForm);
    data = {
        ...data,
        id: comboSelected.id,
        idProducts,
        poster:{id:idPoster[0]},
        images: idImages.map(e => {
            return {
                id: e
            }
        })
    }
    // if(data.idProducts.length === 0){
    //     alertify.error('Please select an author!');
    //     return;
    // }
    if (comboSelected.id) {
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
    const res = await fetch('/api/combos');
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

    showImgInForm(comboSelected.images);

    const response = await fetch('/api/combos/'+data.id, {
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
    console.log(data)
    const response = await fetch('/api/combos', {

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
    clearForm1();
    clearForm2();
    $('#staticBackdropLabel').text('Create Combo');
    renderForm(formBody, getDataInput());

}
document.getElementById('create').onclick = () => {
    onShowCreate();
}
const findById = async (id) => {
    const response = await fetch('/api/combos/' + id);
    return await response.json();
}
const onShowEdit = async (id) => {
    clearForm1();
    clearForm2();
    comboSelected = await findById(id);
    avatarDefaultPoster.src = comboSelected.poster;
    showImgInForm(comboSelected.images);
    $('#staticBackdropLabel').text('Edit Product');
    $('#staticBackdrop').modal('show');
    $('#name').val(comboSelected.title);
    $('#price').val(comboSelected.price);
    checkProductSelect();

    // $('#poster').val(comboSelected.poster);
    // $('#image').val(comboSelected.poster);
    renderForm(formBody, getDataInput());

}
function checkProductSelect() {
    console.log(comboSelected);
    console.log("aa"+comboSelected.productsID)

    $('#products').val(comboSelected.productsID);
    $('#products').trigger('change');
    console.log($('#select2').trigger('change'))
}

function showImgInForm(images) {
    const imgEle = document.getElementById("images");
    const imageOld = imgEle.querySelectorAll('img');
    for (let i = 0; i < imageOld.length; i++) {
        imgEle.removeChild(imageOld[i])
    }
    const avatarDefault = document.createElement('img');
    avatarDefault.src='';
    avatarDefault.style.display = 'none';
    avatarDefault.classList.add('avatar-previews');
    imgEle.append(avatarDefault)
    images.forEach((img) => {
        let image = document.createElement('img');
        image.src = img;
        image.classList.add('avatar-previews');
        imgEle.append(image)
    })

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
                        ${formatCurrency(item.price)}
                    </td>
                    <td>
                    ${item.products}
                    </td>
                    <td>
                        <img src="${item.poster}" alt="" class="avatar-away">
                    </td>
                     <td>
            <a class="btn edit" data-id="${item.id}" onclick="onShowEdit(${item.id})">
               <i class="fa-regular fa-pen-to-square text-primary"></i>
            </a>
            <a class="btn delete" data-id="${item.id}" onclick="deleteItem(${item.id})">
                <i class="fa-regular fa-trash-can text-danger"></i>
            </a> 
        </td>
                </tr>`
}

function getDataInput() {
    return [
        {
            label: 'Name',
            name: 'name',
            value: comboSelected.name,
            required: true,
            pattern: "^[A-Za-z ]{6,20}",
            message: "Username must have minimum is 6 characters and maximum is 20 characters",
        },

        {
            label: 'Price',
            name: 'price',
            value: comboSelected.price,
            pattern: "[1-9][0-9]{1,10}",
            message: 'Price errors',
            required: true
        },
    ];
}

async function getList() {
    const response = await fetch(`/api/combos?page=${pageable.page - 1 || 0}&sort=${pageable.sortCustom || 'id,desc'}&search=${pageable.search || ''}&min=${pageable.min || ''}&max=${pageable.max || ''}`);
    const result = await response.json();
    pageable = {
        ...pageable,
        ...result
    };
    genderPagination();

    console.log(result)
    renderTBody(result.content);
}

window.onload = async () => {
    await getList();
    onLoadSort();
    renderForm(formBody, getDataInput());

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

async function deleteItem(id) {
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

    const response = await fetch(`/api/combos/${id}`, {
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

    const imgEle = document.getElementById("images");
    const imageOld = imgEle.querySelectorAll('img');
    for (let i = 0; i < imageOld.length; i++) {
        imgEle.removeChild(imageOld[i])
    }
    avatarDefaultImage.src = '../assets/img/avatars/default_avatar.png';
    avatarDefaultImage.classList.add('avatar-previews');
    imgEle.append(avatarDefaultImage)
    comboForm.reset();
    comboSelected = {};
}

function clearForm2() {
    idPoster = [];

    const imgEle = document.getElementById("poster");
    const imageOld = imgEle.querySelectorAll('img');
    for (let i = 0; i < imageOld.length; i++) {
        imgEle.removeChild(imageOld[i])
    }
    avatarDefaultPoster.src = '../assets/img/avatars/default_avatar.png';
    avatarDefaultPoster.classList.add('avatar-previews');
    imgEle.append(avatarDefaultPoster)
    comboForm.reset();
    comboSelected = {};
}

async function previewImage(evt) {
    if(evt.target.files.length === 0){
        return;
    }
    document.getElementById("save").disabled = true;

    idImages = [];

    const imgEle = document.getElementById("images");
    const imageOld = imgEle.querySelectorAll('img');
    for (let i = 0; i < imageOld.length; i++) {
        imgEle.removeChild(imageOld[i])
    }

    // When the image is loaded, update the img element's src
    const files = evt.target.files
    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        await previewImageFile(file, i);

        if (file) {
            // Create a new FormData object and append the selected file
            const formData = new FormData();
            formData.append("images", file);
            formData.append("fileType", "image");
            try {
                // Make a POST request to upload the image
                const response = await fetch("/api/files/images", {
                    method: "POST",
                    body: formData,
                });
                if (response.ok) {
                    const result = await response.json();
                    if (result) {
                        const id = result.id;
                        idImages.push(id);
                        // document.getElementById("save").disabled = true;
                    } else {
                        console.error('Image ID not found in the response.');
                    }
                } else {
                    // Handle non-OK response (e.g., show an error message)
                    console.error('Failed to upload image:', response.statusText);
                }
            } catch (error) {
                // Handle network or other errors
                console.error('An error occurred:', error);
            }
        }
    }
    document.getElementById("save").disabled = false;

}

async function previewImageFile(file) {
    const reader = new FileReader();
    reader.onload = function () {
        const imgEle = document.getElementById("images");
        const img = document.createElement('img');
        img.src =reader.result;
        img.classList.add('avatar-previews');
        imgEle.append(img);
    };
    reader.readAsDataURL(file);

}
async function previewPoster(evt) {

    if(evt.target.files.length === 0){
        return;
    }
    idPoster = [];
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
            // Create a new FormData object and append the selected file
            const formData = new FormData();
            formData.append("poster", file);
            formData.append("fileType", "image");
            try {
                // Make a POST request to upload the image
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
                    // Handle non-OK response (e.g., show an error message)
                    console.error('Failed to upload image:', response.statusText);
                }
            } catch (error) {
                // Handle network or other errors
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
        img.src =reader.result;
        img.classList.add('avatar-previews');
        imgPost.append(img);


    };
    reader.readAsDataURL(file);

}