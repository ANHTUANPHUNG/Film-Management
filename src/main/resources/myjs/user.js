var eMenubar = document.getElementsByClassName("menu-item");
const userForm = document.getElementById('userForm');
const tBodyUser = document.getElementById("tBodyUser")
const eSearch = document.getElementById('search')
const nameInput = document.getElementById("name");
const userNameInput = document.getElementById("userName");
const passwordInput = document.getElementById("password");
const emailInput = document.getElementById("email");
const phoneInput = document.getElementById("phone");
const dobInput = document.getElementById("dob");
const posterInput = document.getElementById("post");
const userNameError = document.getElementById("userNameError");
const passwordError = document.getElementById("passwordError");
const emailError = document.getElementById("emailError");
const phoneError = document.getElementById("phoneError");
const dobError = document.getElementById("dobError");
const nameError = document.getElementById("nameError");
const posterError = document.getElementById("posterError");
const saveButton = document.getElementById("save");
const paginationUser = document.getElementById('paginationUser')

let users = [];
let userSelected = {};
let idPoster = [];
for (var i = 0; i < eMenubar.length; i++) {
    eMenubar[i].classList.remove("active");
}

window.onload = async () => {
    await getList();
}
document.getElementById("menu-user").classList.add("active");
let pageable ={
    page: 1,
    search: "",
    sortUser: "id,desc"
}
async function getList(){
    const result = await (await fetch(`/api/users?page=${pageable.page - 1 || 0}&sort=${pageable.sortUser}&search=${pageable.search || ''}`)).json()
    pageable = {
        ...pageable,
        ...result
    };
    genderPagination();
    renderTBody(result.content);
}
const genderPagination = () => {
    paginationUser.innerHTML = '';
    let str = '';
    const maxPagesToShow = 5;
    const pagesToLeft = Math.floor(maxPagesToShow / 2);
    const pagesToRight = maxPagesToShow - pagesToLeft;
    let startPage = pageable.page - pagesToLeft;
    if (startPage < 1) {
        startPage = 1;
    }
    let endPage = startPage + maxPagesToShow - 1;
    if (endPage > pageable.totalPages) {
        endPage = pageable.totalPages;
        startPage = Math.max(1, endPage - maxPagesToShow + 1); // Đảm bảo rằng số lượng trang được hiển thị không vượt quá totalPages
    }

    // Generate "Previous" button
    str += `<li class="page-item ${pageable.startPage ? 'disabled' : ''}">
              <a class="page-link" href="#" tabindex="-1" aria-disabled="true">Previous</a>
            </li>`

    // Generate page numbers
    for (let i = startPage; i <= endPage; i++) {
        str += `<li class="page-item ${(pageable.page) === i ? 'active' : ''}" id="${i}" aria-current="page">
                    <a class="page-link" href="#">${i}</a>
                </li>`
    }

    // Generate "Next" button
    str += `<li class="page-item ${pageable.endPage ? 'disabled' : ''}">
              <a class="page-link" href="#" tabindex="-1" aria-disabled="true">Next</a>
            </li>`

    paginationUser.innerHTML = str;

    const ePages = paginationUser.querySelectorAll('li');
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
function renderTBody(items) {
    let str = '';
    if (Array.isArray(items)) {

        items.forEach(e => {
            str += renderItemStr(e);
        });
    }
    tBodyUser.innerHTML = str;
}
let itemIdUser= 0;
function renderItemStr(item) {
    itemIdUser= item.id



    return `<tr>
                    <td>
                        ${item.id}
                    </td>
                    <td >
                       <span onmouseover="showTooltip(this)" data-id="${item.id}" id="userDB"> ${item.userName}</span>
                    </td>
                    <td>
                        ${item.type}
                    </td>
                    <td id="eRole_${item.id}" onclick="eRoles(${item.id})">
                        <div id="diveRole" style="border: ${item.role==="ROLE_ADMIN" ? '1px solid #e9d9d9' : ' '};background-color: ${item.role==="ROLE_ADMIN" ? '#e9d9d9' : ''};padding: 2px; border-radius: 12px;">
                            ${item.role}
                        </div>                    </td>
                     <td id="ban_${item.id}" onclick="ban(${item.id})"  >
                        <div id="divBan" style="border: ${item.lock==="LOCK" ? '1px solid #f09090' : '1px solid red '};background-color: ${item.lock==="LOCK" ? '#f09090' : 'red '};color: white ;padding: 2px; border-radius: 12px;">
                            ${item.lock}
                        </div>
                    </td>
                  
                    <td style="width: 120px;" >
                        
                        <a class="btn edit" data-id="${item.id}" onclick="onShowEdit(${item.id})" id="edit" style="padding: 0;     width: 21px;">
                            <i class="fa-regular fa-pen-to-square text-primary"></i>
                        </a>
                         
                    </td>
                </tr>`
}

async function showTooltip(element) {
    const userId = element.getAttribute("data-id");
    const tooltipContent = await fetchUserData(userId);
    const tooltipElement = document.createElement("div");
    tooltipElement.id = "yourTooltipId";

    tooltipElement.innerHTML = tooltipContent;

    // Set the position to the right of the hovered element
    const rect = element.getBoundingClientRect();
    tooltipElement.style.position = "fixed"; // Use fixed position for consistent placement
    tooltipElement.style.top = rect.top -100 + "px";
    tooltipElement.style.left = rect.right + 5 + "px"; // Add a 5px gap
    // tooltipElement.style.left = rect.left + "px";

    document.body.appendChild(tooltipElement);

    element.onmouseout = () => {
        document.body.removeChild(tooltipElement);
    };
}


async function fetchUserData(userId) {
    const res = await fetch(`api/users/${userId}`);
    const userData = await res.json();
    return `<div style="background-color: wheat; display: flex; padding: 5px 30px; border: 1px solid #697a8d; border-radius: 5px;">
                <div>
                <p>Name: ${userData.name}</p>
                <p>Email: ${userData.email}</p>
                <p>Phone: ${userData.phone}</p>
                <p>Date of Birth: ${userData.dob}</p>
                <p>Avatar:</p>  
                <div style="display: flex;justify-content: center">
                                    <img  src="${userData.avatar}" alt="User Avatar" style="width: 100px; height: 100px; ">              
                </div>
                </div>
            </div>`;
}
function getDataFromUser(form) {
    event.preventDefault()
    const data = new FormData(form);
    return Object.fromEntries(data.entries())
}
userForm.onsubmit = async (e) => {


    let hasError = false;

    if (nameInput.value.trim() === "") {
        nameError.textContent = "Tên là  bắt buộc.";
        hasError = true;
    } else {
        nameError.textContent = '';
    }
    if (emailInput.value.trim() === "") {
        emailError.textContent = "Email là  bắt buộc.";
        hasError = true;
    } else {
        emailError.textContent = '';
    }
    if (phoneInput.value.trim() === "") {
        phoneError.textContent = "Số điện thoại là  bắt buộc.";
        hasError = true;
    } else {
        phoneError.textContent = '';
    }
    if (dobInput.value.trim() === "") {
        dobError.textContent = "Ngày sinh là  bắt buộc.";
        hasError = true;
    } else {
        dobError.textContent = '';
    }
    if (userNameInput.value.trim() === "") {
        userNameError.textContent = "Tên đăng nhập là  bắt buộc.";
        hasError = true;
    } else {
        userNameError.textContent = '';
    }
    if (passwordInput.value.trim() === "") {
        passwordError.textContent = "Mật khẩu là  bắt buộc.";
        hasError = true;
    } else {
        passwordError.textContent = '';
    }
    if(document.getElementById("staticBackdropLabel").innerText === "Create User"){
        if ( posterInput.value.trim() === "") {
            posterError.textContent = "Avatar là  bắt buộc.";
            hasError = true;
        } else {
            posterError.textContent = '';
        }
    }

    if (hasError){
        e.preventDefault();
        return;
    }

    let data = getDataFromUser(userForm);


    data = {
        ...data,
        id: userSelected.id,
        avatar: { id: idPoster[0] },
        
    }
    if (userSelected.id) {
        await editUser(data);
    } else {
        await createUser(data)
    }
    // await renderTable();
}

async function renderTable() {

    const result = await (await fetch(`/api/users?page=${pageable.page - 1 || 0}&sort=${pageable.sortUser || 'id,desc'}&search=${pageable.search || ''}`)).json()
    users = result.content;
    renderTBody(users);
}
document.getElementById('create').onclick = () => {
    onShowCreate();
}
const onShowCreate = () => {
    document.getElementById('poster').innerHTML = ' <i id="uploadIcon" class="fas fa-upload" style="font-size: 95px;"></i>'
    clearForm();
    $('#staticBackdropLabel').text('Create User');

}
// create submit
async function createUser(data) {
    const response = await fetch('/api/users', {

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
            const errorEmailElement = document.getElementById("phoneError");
            if ("phone" in responseJSON) {
                errorEmailElement.style.display = "block";
                errorEmailElement.innerText = responseJSON.phone;
                errorEmailElement.style.color= "red"
            }
            const productsErrorElement = document.getElementById("dobError");
            if ("dob" in responseJSON) {
                productsErrorElement.style.display = "block";
                productsErrorElement.innerText = responseJSON.dob;
                productsErrorElement.style.color= "red"
            }
            const emailErrorElement = document.getElementById("emailError");
            if ("email" in responseJSON) {
                emailErrorElement.style.display = "block";
                emailErrorElement.innerText = responseJSON.email
                emailErrorElement.style.color= "red"
            }
            const userNameErrorElement = document.getElementById("userNameError");
            if ("userName" in responseJSON) {
                userNameErrorElement.style.display = "block";
                userNameErrorElement.innerText = responseJSON.userName;
                userNameErrorElement.style.color= "red"
            }
            const passwordErrorElement = document.getElementById("passwordError");
            if ("password" in responseJSON) {
                passwordErrorElement.style.display = "block";
                passwordErrorElement.innerText = responseJSON.password;
                passwordErrorElement.style.color= "red"
            }
            const errorPosterElement = document.getElementById("posterError");
            if ("avatar" in responseJSON) {
                errorPosterElement.style.display = "block";
                errorPosterElement.innerText = responseJSON.avatar;
                errorPosterElement.style.color= "red"
            }
        }
    }
}

const findById = async (id) => {
    const response = await fetch('/api/users/' + id);

    return await response.json();
}


const onShowEdit = async (id) => {
    clearForm();
    userSelected = await findById(id);
    const poster = document.getElementById("poster");
    const img = document.createElement('img');
    $("#userName").prop('disabled', true);
    $("#password").prop('disabled', true);
    $("#email").prop('disabled', true);
    img.src = userSelected.avatar;
    img.id = userSelected.idAvatar;
    img.style.width='150px';
    img.style.height='100px';
    if(userSelected.avatar){
        document.getElementById("uploadIcon").style.display="none";
        poster.append(img)
    }
    $('#staticBackdropLabel').text('Edit User');
    $('#staticBackdrop').modal('show');
    $('#name').val(userSelected.name);
    $('#password').val(userSelected.password);
    $('#userName').val(userSelected.userName);
    $('#email').val(userSelected.email);
    $('#phone').val(userSelected.phone);
    $('#dob').val(userSelected.dob);
}


// edit submit
async function  editUser (data){

    const response = await fetch('/api/users/'+data.id, {
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
            const errorFullNameElement = document.getElementById("nameError");
            if ("name" in responseJSON) {
                errorFullNameElement.style.display = "block";
                errorFullNameElement.innerText = responseJSON.name;
                errorFullNameElement.style.color= "red"
            }
            const errorEmailElement = document.getElementById("phoneError");
            if ("phone" in responseJSON) {
                errorEmailElement.style.display = "block";
                errorEmailElement.innerText = responseJSON.phone;
                errorEmailElement.style.color= "red"
            }
            const productsErrorElement = document.getElementById("dobError");
            if ("dob" in responseJSON) {
                productsErrorElement.style.display = "block";
                productsErrorElement.innerText = responseJSON.dob;
                productsErrorElement.style.color= "red"
            }
            const emailErrorElement = document.getElementById("emailError");
            if ("email" in responseJSON) {
                emailErrorElement.style.display = "block";
                emailErrorElement.innerText = responseJSON.email
                emailErrorElement.style.color= "red"
            }
            const userNameErrorElement = document.getElementById("userNameError");
            if ("userName" in responseJSON) {
                userNameErrorElement.style.display = "block";
                userNameErrorElement.innerText = responseJSON.userName;
                userNameErrorElement.style.color= "red"
            }
            const passwordErrorElement = document.getElementById("passwordError");
            if ("password" in responseJSON) {
                passwordErrorElement.style.display = "block";
                passwordErrorElement.innerText = responseJSON.password;
                passwordErrorElement.style.color= "red"
            }


        }
    }
}

function clearForm() {
    const areaError = $('.areaError')
    areaError.empty();

    idPoster = [];
    document.getElementById('name').value = '';
    document.getElementById('nameError').innerText = '';
    document.getElementById('posterError').innerText = '';
    document.getElementById('dobError').innerText = '';
    document.getElementById('phoneError').innerText = '';
    document.getElementById('emailError').innerText = '';
    document.getElementById('passwordError').innerText = '';
    document.getElementById('userNameError').innerText = '';
    document.getElementById('name').style.border = '1px solid #d9dee3';

    const posterEle = document.getElementById("poster")
    const posterChild = posterEle.querySelectorAll('img');
    for (let i = 0; i < posterChild.length; i++) {
        posterEle.removeChild(posterChild[i])
    }
    userForm.reset();
    userSelected = {};
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






async function previewAvatar(evt) {

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
        await previewAvatarFile(file, i);
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


async function previewAvatarFile(file) {
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


function validateNameUser(inputField) {
    const nameValue = inputField.value;
    const vietnameseWithDiacriticsAndLetterRegex = /^[A-Za-z0-9À-ỹ\s]*[A-Za-z0-9À-ỹ]+[A-Za-z0-9À-ỹ\s]*$/;
    if (!vietnameseWithDiacriticsAndLetterRegex.test(nameValue)) {
        nameError.textContent = "Họ và tên phải chứa ít nhất 6 ký tự và có thể có số.";
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
function validateUserName(inputField) {
    const userNameValue = inputField.value;
    const vietnameseWithDiacriticsAndLetterRegex = /^[A-Za-z0-9À-ỹ\s]*[A-Za-z0-9À-ỹ]+[A-Za-z0-9À-ỹ\s]*$/;
    const isLengthValid = userNameValue.length >= 6;
    if (!vietnameseWithDiacriticsAndLetterRegex.test(userNameValue) || !isLengthValid) {
        userNameError.textContent = "Tên đăng nhập phải chứa ít nhất 6 ký tự và có thể có số.";
        inputField.style.border = "1px solid red";
        userNameError.style.fontSize = "14px";
        saveButton.disabled = true;
        saveButton.style.opacity = 0.5;
    } else {
        userNameError.textContent = '';
        inputField.style.border = "1px solid #d9dee3";
        saveButton.disabled = false;
        saveButton.style.opacity = 1;
    }
}
function validatePhoneUSER(inputField) {
    const phoneValue = inputField.value;
    const isLengthValid = phoneValue.length >= 2;
    if (isLengthValid) {
        phoneError.textContent = '';
        inputField.style.border = "1px solid #d9dee3";
        saveButton.disabled = false;
        saveButton.style.opacity = 1;
    }
}
function validatePassword(inputField) {
    const passwordValue = inputField.value;
    const vietnameseWithDiacriticsAndLetterRegex = /^[A-Za-z0-9À-ỹ\s]*[A-Za-z0-9À-ỹ]+[A-Za-z0-9À-ỹ\s]*$/;
    const isLengthValid = passwordValue.length >= 6;
    if (!vietnameseWithDiacriticsAndLetterRegex.test(passwordValue) || !isLengthValid) {
        passwordError.textContent = "Tên đăng nhập phải chứa ít nhất 6 ký tự và có thể có số.";
        inputField.style.border = "1px solid red";
        passwordError.style.fontSize = "14px";
        saveButton.disabled = true;
        saveButton.style.opacity = 0.5;
    } else {
        passwordError.textContent = '';
        inputField.style.border = "1px solid #d9dee3";
        saveButton.disabled = false;
        saveButton.style.opacity = 1;
    }
}
function validateEmail(inputField) {
    const emailValue = inputField.value;
    const emailRegex = /^(?=.*[@])(?=.*(gmail\.com|yahoo\.com|email\.com|mailinator\.com))(?!.*\.{2})[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;

    if (!emailRegex.test(emailValue)) {
        emailError.textContent = "Địa chỉ email không hợp lệ.";
        inputField.style.border = "1px solid red";
        emailError.style.fontSize = "14px";
        saveButton.disabled = true;
        saveButton.style.opacity = 0.5;
    } else {
        emailError.textContent = '';
        inputField.style.border = "1px solid #d9dee3";
        saveButton.disabled = false;
        saveButton.style.opacity = 1;
    }
}
function validateDob(inputField) {
    const dobValue = inputField.value;
    const dobError = document.getElementById("dobError");
    if (calculateAge(dobValue) < 16) {
        dobError.textContent = "Bạn phải đủ 16 tuổi trở lên.";
        inputField.style.border = "1px solid red";
        dobError.style.fontSize = "14px";
        saveButton.disabled = true;
        saveButton.style.opacity = 0.5;
    } else {
        dobError.textContent = '';
        inputField.style.border = "1px solid #d9dee3";
        saveButton.disabled = false;
        saveButton.style.opacity = 1;
    }
}

// Hàm tính tuổi dựa trên ngày sinh
function calculateAge(dob) {
    const dobDate = new Date(dob);
    const currentDate = new Date();
    const age = currentDate.getFullYear() - dobDate.getFullYear();
    if (
        currentDate.getMonth() < dobDate.getMonth() ||
        (currentDate.getMonth() === dobDate.getMonth() && currentDate.getDate() < dobDate.getDate())
    ) {
        return age - 1;
    }

    return age;
}
async function ban(id){
    const userBan = await findById(id);
    if(userBan.elock === "UNLOCK"){
        const { isConfirmed } = await Swal.fire({
            title: 'Xác nhận khóa',
            text: 'Bạn có chắc chắn muốn khóa?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Khóa',
            cancelButtonText: 'Hủy',
        });
        if (!isConfirmed) {
            return; // Người dùng đã hủy xóa
        }
        const response = await fetch(`/api/users/lock/${id}`, {
            method: 'PATCH',
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
            }).then(async (result) => {
                if (result.dismiss === Swal.DismissReason.timer) {
                    await   Swal.fire({
                        text: 'Khóa thành công.',
                        icon: 'success',
                        showConfirmButton: false,
                        position: 'top-start',
                        timer: 900
                    })
                }

                await getList();

            });
        }
    } else {
        const {isConfirmed} = await Swal.fire({
            title: 'Xác nhận mở khóa',
            text: 'Bạn có chắc chắn muốn mở khóa?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Mở',
            cancelButtonText: 'Hủy',
        });
        if (!isConfirmed) {
            return; // Người dùng đã hủy xóa
        }
        const response = await fetch(`/api/users/unlock/${id}`, {
            method: 'PATCH',
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
            }).then( async (result) => {
                if (result.dismiss === Swal.DismissReason.timer) {
                await    Swal.fire({
                        text: 'Mở khóa thành công.',
                        icon: 'success',
                        showConfirmButton: false,
                        position: 'top-start',
                        timer: 900
                    })
                }
                await getList();
            });
        }
    }
}

async function eRoles(id){
    const userBan = await findById(id);
    console.log(userBan)
    if(userBan.erole === "ROLE_USER"){
        const { isConfirmed } = await Swal.fire({
            title: 'Xác nhận',
            text: 'Bạn có chắc chuyển tài khoản này thành ADMIN?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Đồng ý',
            cancelButtonText: 'Hủy',
        });
        if (!isConfirmed) {
            return; // Người dùng đã hủy xóa
        }
        const response = await fetch(`/api/users/admin/${id}`, {
            method: 'PATCH',
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
            }).then(async (result) => {
                if (result.dismiss === Swal.DismissReason.timer) {
                    await   Swal.fire({
                        text: 'Nâng thành công.',
                        icon: 'success',
                        showConfirmButton: false,
                        position: 'top-start',
                        timer: 900
                    })
                }


                await getList();

            });
        }
    } else {
        const {isConfirmed} = await Swal.fire({
            title: 'Xác nhận ',
            text: 'Bạn có hủy bỏ chức vụ cho tài khoản này?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Mở',
            cancelButtonText: 'Hủy',
        });
        if (!isConfirmed) {
            return; // Người dùng đã hủy xóa
        }
        const response = await fetch(`/api/users/user/${id}`, {
            method: 'PATCH',
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
            }).then( async (result) => {
                if (result.dismiss === Swal.DismissReason.timer) {
                    await    Swal.fire({
                        text: 'Hủy thành công.',
                        icon: 'success',
                        showConfirmButton: false,
                        position: 'top-start',
                        timer: 900
                    })
                }
                await getList();
            });
        }
    }
}







