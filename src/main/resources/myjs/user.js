const userForm = document.getElementById('userForm');
const tBody = document.getElementById('tBody');
const ePagination = document.getElementById('pagination')
const eSearch = document.getElementById('search')
const eHeaderPublishDate = document.getElementById('header-publish-date')
const formBody = document.getElementById('formBody');
const avatarDefault = document.createElement('img');

let rooms = [];
let userSelected = {};
let pageable = {
    page: 1,
    sort: 'id,desc',

}

userForm.onsubmit = async (e) => {
    e.preventDefault();
    let data = getDataFromForm(userForm);

    data = {
        ...data,
        avatar: {id: idImages[0]}

    }
    if (userSelected.id) {
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
    const res = await fetch('/api/users');
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

const password1 = document.getElementById('password');
const confirmPassword = document.getElementById('confirmPassword');
const oldPassword = document.getElementById('oldPassword');

async function editRoom(data) {
    if (password1.value !== confirmPassword.value) {
        Swal.fire({
            title: 'Error',
            text: 'Mật khẩu xác nhận không khớp.',
            icon: 'error',
            confirmButtonText: 'OK'
        });
        return;
    }
    if (oldPassword.value !== userSelected.passWord) {
        console.log(oldPassword.value)
        console.log(data.passWord)

        Swal.fire({
            title: 'Error',
            text: 'Mật khẩu cũ không khớp.',
            icon: 'error',
            confirmButtonText: 'OK'
        });
        return;
    }


    const response = await fetch('/api/users/' + data.id, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });

    if (response.ok) {
        Swal.fire({
            title: 'Edited',
            text: 'Phòng đã được chỉnh sửa thành công.',
            icon: 'success',
            confirmButtonText: 'OK'
        }).then(() => {
            location.reload(); // Tải lại trang sau khi chỉnh sửa phòng
        });
    } else {
        Swal.fire({
            title: 'Error',
            text: 'Có lỗi xảy ra khi chỉnh sửa phòng.',
            icon: 'error',
            confirmButtonText: 'OK'
        });
    }
}

async function createRoom(data) {
    // console.log("cuatoi"+data)
    // if (data.fire().status.ok) {
    //     Swal.fire({
    //         title: 'Created',
    //         text: 'Phòng đã được tạo thành công.',
    //         icon: 'success',
    //         confirmButtonText: 'OK'
    //     }).then(() => {
    //         getList();
    //     });
    // }
    const response = await fetch('/api/users', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });
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
let isEditing = false;

const onShowCreate = () => {

    clearForm();
    if (!isEditing) {
        $('#oldPassword').hide();
        $('#confirmPassword').hide();
        $('#oldPasswordLabel').hide();
        $('#confirmPasswordLabel').hide();
    }
    $('#staticBackdropLabel').text('Create User');
    renderForm(formBody, getDataInput());
}

document.getElementById('create').onclick = () => {
    onShowCreate();
}

const findById = async (id) => {
    const response = await fetch('/api/users/' + id);
    const user = await response.json();
    console.log('Data from API:', user);

    if (user.passWord) {
        userSelected.passWord = user.passWord;
    }

    return user;
}
const onShowEdit = async (id) => {
    clearForm();
    userSelected = await findById(id);
    avatarDefault.src = userSelected.avatar;
    $('#staticBackdropLabel').text('Edit User');
    $('#staticBackdrop').modal('show');
    $('#name').val(userSelected.name);
    $('#email').val(userSelected.email);
    $('#phone').val(userSelected.phone);
    $('#dob').val(userSelected.dob);
    $('#statusCustomer').val(userSelected.statusCustomer);
    $('#passWord').val(userSelected.passWord);

    console.log('isEditing', isEditing)
    if (!isEditing) {
        $('#oldPassword').show();
        $('#confirmPassword').show();
        $('#oldPasswordLabel').show();
        $('#confirmPasswordLabel').show();
    }

    renderForm(formBody, getDataInput());
}




function getDataFromForm(form) {
    const data = new FormData(form);
    const password = document.getElementById('password').value;

    data.append('passWord', password);
    if (userSelected.id) {
        data.append('id', userSelected.id);
    }
    return Object.fromEntries(data.entries());
}
function renderItemStr(item) {
    let lockSelected = item.lock === 'LOCK' ? 'selected' : '';
    let unlockSelected = item.lock === 'UNLOCK' ? 'selected' : '';

    return `<tr>
        <td>
            ${item.id}
        </td>
        <td>
            ${item.name}
        </td>
        <td>
            ${item.email}
        </td>
        <td>
            ${item.phone}
        </td>
        <td>
            ${item.dob}
        </td>
        <td >
           <img class="avatar-away" src="${item.avatar}" alt=""> 
        </td>
        <td>
            ${item.statusCustomer}
        </td>
        <td>
            <select id="lock-${item.id}" class="satus btn btn-danger" onchange="onChangeSelect(${item.id}, this.value)">
                <option value="LOCK" ${lockSelected} class="LOCK">Lock</option>
                <option value="UNLOCK" ${unlockSelected} class="UNLOCK">Unlock</option>
            </select>
        </td>
        <td>
            <a class="btn edit" data-id="${item.id}" onclick="onShowEdit(${item.id})">
                <i class="fa-regular fa-pen-to-square text-primary"></i>
            </a>
            <a class="btn delete" data-id="${item.id}" onclick="deleteItem(${item.id})">
                <i class="fa-regular fa-trash-can text-danger"></i>
            </a> 
        </td>
    </tr>`;
}
function onChangeSelect(id, selectedValue) {
    const confirmation = window.confirm(`Bạn có chắc chắn muốn thay đổi trạng thái thành '${selectedValue}' không?`);

    if (confirmation) {
        fetch(`/api/users/${id}/${selectedValue}`, {
            method: 'GET',
        })
            .then(response => {
                if (response.ok) {
                    console.log('Lock status changed successfully');
                } else {
                    console.error('Error changing lock status');
                }
            })
            .catch(error => {
                console.error('An error occurred:', error);
            });
    } else {
        console.log('Cancelled');
    }
}
function getDataInput() {
    return [
        {
            label: 'Name',
            name: 'name',
            value: userSelected.name,
            required: true,
            pattern: "^[A-Za-z ]{6,20}",
            message: "Username must have minimum is 6 characters and maximum is 20 characters",
        },
        {
            label: 'Email',
            name: 'email',
            value: userSelected.email,
            // pattern: "^[A-Za-z ]{6,120}",
            message: "Description must have minimum is 6 characters and maximum is 20 characters",
            required: true
        },
        {
            label: 'Phone',
            name: 'phone',
            value: userSelected.phone,
            // pattern: "[1-9][0-9]{1,10}",
            // message: 'Price errors',
            // pattern: "[0-9]{10}",
            message: 'Phone errors',
            required: true
        },
        {
            label: 'Date of birth',
            name: 'dob',
            value: userSelected.dob,
            type: 'date',
            required: true
        },
        {
            label: "Type",
            name: "statusCustomer",
            value: userSelected.statusCustomer,
            type: "select",
            require: true,
            message: "Type invalid",
            options: [{value: "SILVER", name:"Silver"},{value: "GOLD", name:"Gold"},{value: "PREMIUM", name:"Premium"}],
        },
    ];
}

async function getList() {
    const response = await fetch(`/api/users?page=${pageable.page - 1 || 0}&sort=${pageable.sortCustom || 'id,desc'}&search=${pageable.search || ''}`);
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

    const response = await fetch(`/api/users/${itemId}`, {
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
    eHeaderPublishDate.onclick = () => {
        let sort = 'dob,desc'
        if(pageable.sortCustom?.includes('dob') &&  pageable.sortCustom?.includes('desc')){
            sort = 'dob,asc';
        }
        pageable.sortCustom = sort;
        getList();
    }
}
function clearForm() {
    idImages = [];

    const imgEle = document.getElementById("images");
    const imageOld = imgEle.querySelectorAll('img');
    for (let i = 0; i < imageOld.length; i++) {
        imgEle.removeChild(imageOld[i])
    }
    avatarDefault.src = '../assets/img/avatars/default_avatar.png';
    avatarDefault.classList.add('avatar-preview');
    imgEle.append(avatarDefault)
    userForm.reset();
    userSelected = {};
}



let idImages = [];

async function previewImage(evt) {
    if(evt.target.files.length === 0){
        return;
    }
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
            formData.append("avatar", file);
            formData.append("fileType", "image");
            try {
                // Make a POST request to upload the image
                const response = await fetch("/api/files", {
                    method: "POST",
                    body: formData,
                });
                if (response.ok) {
                    const result = await response.json();
                    if (result) {
                        const id = result.id;
                        idImages.push(id);
                        document.getElementById("saveChange").disabled = false;
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

async function previewImageFile(file) {
    const reader = new FileReader();
    reader.onload = function () {
        const imgEle = document.getElementById("images");
        const img = document.createElement('img');
        img.src =reader.result;
        img.classList.add('avatar-preview');
        imgEle.append(img);


    };
    reader.readAsDataURL(file);

}
