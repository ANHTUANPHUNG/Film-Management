
const billForm = document.getElementById('billForm');
const tBody = document.getElementById('tBody');
const ePagination = document.getElementById('pagination')
const eSearch = document.getElementById('search')
const ePriceRange = document.getElementById('priceRange');
const formBody = document.getElementById('formBody');
const ePrice = document.getElementById('price-check')
let rooms = [];
let billSelected = {};
let user;
let pageable = {
    page: 1,
    sort: 'id,desc',
    search: '',
    min: 1,
    max: 50000000000000,
}
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
billForm.onsubmit = async (e) => {
    e.preventDefault();

    const idProduct = $("#products").select2('data').map(e => e.id);
    const idCombo = $('#combos').select2('data').map(e => e.id);
    let data = getDataFromForm(billForm);
    data = {
        ...data,
        user: {
            id: data.user
        },
        idProduct,
        idCombo,
        // timeBook: convertDate(data.timeBook + ""),
        id: billSelected.id,
    }
    // if(data.idProducts.length === 0){
    //     alertify.error('Please select an author!');
    //     return;
    // }
    if (billSelected.id) {
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
    const res = await fetch('/api/bills/ad');
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
    const response = await fetch('/api/bills/ad/'+data.id, {
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

    console.log(typeof data.user)
    const response = await fetch('/api/bills/ad', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });
    console.log("aaa"+response)
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
    clearForm();
    $('#staticBackdropLabel').text('Create Bill');
    renderForm(formBody, getDataInput());

}
document.getElementById('create').onclick = () => {
    onShowCreate();
}
const findById = async (id) => {
    const response = await fetch('/api/bills/ad/' + id);
    return await response.json();
}
const onShowEdit = async (id) => {
    clearForm();
    billSelected = await findById(id);
    $('#staticBackdropLabel').text('Edit Product');
    $('#staticBackdrop').modal('show');
    $('#user').val(billSelected.user);
    $('#price').val(billSelected.price);
    $('#customerName').val(billSelected.customerName);
    $('#customerPhone').val(billSelected.customerPhone);
    $('#customerQuantity').val(billSelected.customerQuantity);
    $('#appointmentTime').val(billSelected.appointmentTime);
    checkUserSelect();
    checkProductSelect();
    checkComboSelect();
    renderForm(formBody, getDataInput());

}
function checkUserSelect() {
    $('#user').val(billSelected.user);
    $('#user').trigger('change');
    console.log($('#select2').trigger('change'))
}
function checkProductSelect() {
    console.log(billSelected);
    console.log("aa"+billSelected.idProduct)
    onChangeSelect2('#products',billSelected.idProduct)
    console.log($('#select2').trigger('change'))
}
function checkComboSelect() {
    $('#combos').val(billSelected.idCombo);
    $('#combos').trigger('change');
    console.log($('#select2').trigger('change'))
}


// function getDataFromForm(form) {
//     // event.preventDefault()
//     const data = new FormData(form);
//     return Object.fromEntries(data.entries())
// }
function formatCurrency(number) {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(number);
}
function renderItemStr(item) {
    return `<tr>
                    <td>
                        ${item.id}
                    </td>
                    <td>
                        ${item.customerName}
                    </td>
                    <td>
                        ${item.customerPhone}
                    </td>
                    
                    <td>
                        ${item.customerQuantity}
                    </td>
                    <td>
                    ${item.appointmentTime}
                    </td>
                    <td>
                        ${formatCurrency(item.price)}
                    </td>
                    <td>
                    ${item.idProduct}
                    </td>
                    
                    <td>
                    ${item.idCombo}
                    </td>
                    
        <td>${item.user !== null ? item.user : ''}</td>
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
            name: 'customerName',
            value: billSelected.customerName,
            required: true,
            pattern: "^[A-Za-z ]{6,20}",
            message: "Username must have minimum is 6 characters and maximum is 20 characters",
        },

        {
            label: 'Phone',
            name: 'customerPhone',
            value: billSelected.customerPhone,
            required: true,
            // pattern: "^[A-Za-z ]{6,20}",
            message: "Username must have minimum is 6 characters and maximum is 20 characters",
        },
        {
            label: 'Quantity',
            name: 'customerQuantity',
            value: billSelected.customerQuantity,
            required: true,
            // pattern: "^[A-Za-z ]{6,20}",
            message: "Username must have minimum is 6 characters and maximum is 20 characters",
        },
        {
            label: 'Appointment Time',
            name: 'appointmentTime',
            type:"datetime-local",
            value: billSelected.appointmentTime,
            required: true,
            // pattern: "^[A-Za-z ]{6,20}",
            // message: "Username must have minimum is 6 characters and maximum is 20 characters",
        },

    ];
}
const clearForm = () => {
    onChangeSelect2('#user', null);
    onChangeSelect2('#products', null);
    onChangeSelect2('#combos', null);
}
async function getList() {
    const response = await fetch(`/api/bills/ad?page=${pageable.page - 1 || 0}&sort=${pageable.sortCustom || 'id,desc'}&search=${pageable.search || ''}&min=${pageable.min || ''}&max=${pageable.max || ''}`);
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

    const response = await fetch(`/api/bills/admin/${id}`, {
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

    billForm.reset();
    billSelected = {};
}

