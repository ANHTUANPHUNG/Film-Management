var eMenubar = document.getElementsByClassName("menu-item");
const billForm = document.getElementById('billForm');
const tBodyBill = document.getElementById("tBodyBill")
const eSearch = document.getElementById('search')

const emailInput = document.getElementById("email");
const customerNameInput = document.getElementById("customerName");
const customerPhoneInput = document.getElementById("customerPhone");
const customerEmailInput = document.getElementById("customerEmail");
const customerQuantityInput = document.getElementById("customerQuantity");
const usersInput = document.getElementById("users");
const productsInput = document.getElementById("products");
const combosInput = document.getElementById("combos");
const appointmentTimeInput = document.getElementById("appointmentTime");
const priceBillInput = document.getElementById("priceBill");

const customerEmailError = document.getElementById("customerEmailError");
const customerNameError = document.getElementById("customerNameError");
const customerPhoneError = document.getElementById("customerPhoneError");
const customerQuantityError = document.getElementById("customerQuantityError");
const usersError = document.getElementById("usersError");
const productsError = document.getElementById("productsError");
const combosError = document.getElementById("combosError");
const appointmentTimeError = document.getElementById("appointmentTimeError");
const priceBillError = document.getElementById("priceBillError");
const saveButton = document.getElementById("save");
const paginationBill = document.getElementById('paginationBill')

let bills = [];
let billSelected = {};
for (var i = 0; i < eMenubar.length; i++) {
    eMenubar[i].classList.remove("active");
}

window.onload = async () => {
    await getList();
}
document.getElementById("menu-bill").classList.add("active");
let pageable ={
    page: 1,
    search: "",
    sortUser: "id,desc"
}
async function getList(){
    const result = await (await fetch(`/api/bills?page=${pageable.page - 1 || 0}&sort=${pageable.sortUser}&search=${pageable.search || ''}`)).json()
    pageable = {
        ...pageable,
        ...result
    };
    genderPagination();
    renderTBody(result.content);
}
const genderPagination = () => {
    paginationBill.innerHTML = '';
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

    paginationBill.innerHTML = str;

    const ePages = paginationBill.querySelectorAll('li');
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
$(document).ready(function () {
    $('.js-example-basic-single').select2({
        dropdownParent: $('#staticBackdrop')
    });
    $('.js-example-basic-multiple').select2({
        dropdownParent: $('#staticBackdrop')

    })
});
$('.js-example-basic-multiple').select2({
    placeholder: "Select a number"

})
function renderTBody(items) {
    let str = '';
    if (Array.isArray(items)) {

        items.forEach(e => {
            str += renderItemStr(e);
        });
    }
    tBodyBill.innerHTML = str;
}
let itemIdUser= 0;
function renderItemStr(item) {
    itemIdUser= item.id
    var deleteButtonStyle = (item.epayment === "PAID") ? 'display: none;' : '';
    return `<tr>
                    <td>
                        ${item.id}
                    </td>
                    <td >
                       <span onmouseover="showTooltip(this)" data-id="${item.id}" id="billDB"> ${item.customerName}</span>
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
                    <td onclick="payment(${item.id})">
                        <div id="divPayment" style="border: ${item.epayment==="PAID" ? '1px solid #e9d9d9' : ' '};background-color: ${item.epayment==="PAID" ? '#f7c250' : ''};padding: 2px; border-radius: 12px;">
                        ${item.epayment}
                        </div>
                    </td>
                    <td style="width: 120px;" >
                        <a class="btn edit" data-id="${item.id}" onclick="onShowEdit(${item.id})" id="edit" style="padding: 0;     width: 21px;">
                            <i class="fa-regular fa-pen-to-square text-primary"></i>
                        </a>
                        <a  class="btn delete" id="deleteBill" data-id="${item.id}" onclick="deleteItem(${item.id})" id="delete" style="padding-right: 5px; width: 47px;${deleteButtonStyle}""
                            >
                            <i class="fa-regular fa-trash-can text-danger"></i>
                        </a>
                    </td>
                </tr>`
}
async function deleteItem(id){

        const { isConfirmed } = await Swal.fire({
            title: 'Xác nhận hủy đơn',
            text: 'Bạn có chắc chắn muốn hủy?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Đồng ý',
            cancelButtonText: 'Hủy',
        });
        if (!isConfirmed) {
            return;
        }
        const response = await fetch(`/api/bills/lock/${id}`, {
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

function formatCurrency(number) {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(number);
}
async function showTooltip(element) {
    const billId = element.getAttribute("data-id");
    const tooltipContent = await fetchUserData(billId);
    const tooltipElement = document.createElement("div");
    tooltipElement.id = "yourTooltipId";

    tooltipElement.innerHTML = tooltipContent;

    // Set the position to the right of the hovered element
    const rect = element.getBoundingClientRect();
    tooltipElement.style.position = "fixed"; // Use fixed position for consistent placement
    tooltipElement.style.top = rect.top -100 + "px";
    tooltipElement.style.left = rect.right + 5 + "px"; // Add a 5px gap
    document.body.appendChild(tooltipElement);

    element.onmouseout = () => {
        document.body.removeChild(tooltipElement);
    };
}


async function fetchUserData(billId) {
    const res = await fetch(`api/bills/${billId}`);
    const billData = await res.json();

    return `<div style="background-color: wheat; display: flex; padding: 5px 30px; border: 1px solid #697a8d; border-radius: 5px;">
                <div>
                <p>User: ${billData.userName}</p>
                <p>Email: ${billData.customerEmail}</p>
                <p>Phone: ${billData.customerPhone}</p>
                <p ><div style="white-space: pre-wrap; width: 400px">Products: ${billData.productsName}</div></p>
                <p><div style="white-space: pre-wrap; width: 400px">Combos: ${billData.combosName}</div></p>
                <p>Time Book: ${billData.timeBook}</p>
                
                </div>
            </div>`;
}
const findByIdProduct = async (id) => {
    const response = await fetch('/api/products/' + id);

    return await response.json();
}
const findByIdCombo = async (id) => {
    const response = await fetch('/api/combos/' + id);

    return await response.json();
}
// Hàm cập nhật tổng giá trị cho #priceBill
function updateTotalBill() {
    var priceProducts = parseFloat($("#priceProducts").val()) || 0;
    var priceCombos = parseFloat($("#priceCombos").val()) || 0;
    var totalBill = priceProducts + priceCombos;
    $("#priceBill").val(totalBill);
}

// Hàm cập nhật tổng giá trị khi thay đổi #products
$("#products").on("change", async () => {
    var selectedValues = $("#products").val();
    let totalProduct = 0;
    for (let i = 0; i < selectedValues.length; i++) {
        const priceInput = await findByIdProduct(selectedValues[i]);
        totalProduct += priceInput.price;
    }
    $("#priceProducts").val(totalProduct);
    updateTotalBill();
});

$("#combos").on("change", async () => {
    var selectedValues = $("#combos").val();
    let totalCombo = 0;
    for (let i = 0; i < selectedValues.length; i++) {
        const priceInput = await findByIdCombo(selectedValues[i]);
        totalCombo += priceInput.price;
    }
    $("#priceCombos").val(totalCombo);
    updateTotalBill();
});

$("#priceProducts").on("change",async ()=> {
    var selectedValues = $("#priceProducts").val();
    $("#priceBill").val(selectedValues)
    console.log(selectedValues)
});

function getDataFromUser(form) {
    event.preventDefault()
    const data = new FormData(form);
    return Object.fromEntries(data.entries())
}
billForm.onsubmit = async (e) => {
    // e.preventDefault()
    let hasError = false;

    if (customerQuantityInput.value.trim() === "") {
        customerQuantityError.textContent = "Nhập số lượng khách.";
        hasError = true;
    } else {
        customerQuantityError.textContent = ''; // Xóa thông báo lỗi nếu hợp lệ
    }
    if (productsInput.value.trim() === "" && combosInput.value.trim() === "") {
        productsError.textContent = "Chọn sản phẩm hoặc gói.";
        combosError.textContent = "Chọn sản phẩm hoặc gói.";
        hasError = true;
    } else {
        productsError.textContent = ''; // Xóa thông báo lỗi nếu hợp lệ
        combosError.textContent = ''; // Xóa thông báo lỗi nếu hợp lệ
    }

    if (appointmentTimeInput.value.trim() === "") {
        appointmentTimeError.textContent = "Chọn thời gian hẹn.";
        hasError = true;
    } else {
        appointmentTimeError.textContent = ''; // Xóa thông báo lỗi nếu hợp lệ
    }
    if (hasError){
        e.preventDefault();
        return;
    }

    let data = getDataFromUser(billForm);
    const idProducts = $("#products").select2('data').map(e => e.id);
    const idCombos = $("#combos").select2('data').map(e => e.id);
    console.log(idProducts)

    data = {
        ...data,
        user: {
            id: data.users
        },
        idCombos,
        idProducts,
        id: userSelected.id,

    }
    if (userSelected.id) {
        await editUser(data);
    } else {
        await createUser(data)
    }
    // await renderTable();
}

async function renderTable() {

    const result = await (await fetch(`/api/bills?page=${pageable.page - 1 || 0}&sort=${pageable.sortUser || 'id,desc'}&search=${pageable.search || ''}`)).json()
    users = result.content;
    renderTBody(users);
}
document.getElementById('create').onclick = () => {
    onShowCreate();
}
const onShowCreate = () => {
    clearForm();
    $('#staticBackdropLabel').text('Create Bill');

}
// create submit
async function createUser(data) {
    const response = await fetch('/api/bills', {

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
            if ("customerName" in responseJSON) {
                customerNameError.style.display = "block";
                customerNameError.innerText = responseJSON.customerName;
                customerNameError.style.color= "red"
            }
            if ("customerPhone" in responseJSON) {
                customerPhoneError.style.display = "block";
                customerPhoneError.innerText = responseJSON.customerPhone;
                customerPhoneError.style.color= "red"
            }
            if ("customerEmail" in responseJSON) {
                customerEmailError.style.display = "block";
                customerEmailError.innerText = responseJSON.customerEmail;
                customerEmailError.style.color= "red"
            }
            if ("customerQuantity" in responseJSON) {
                customerQuantityError.style.display = "block";
                customerQuantityError.innerText = responseJSON.customerQuantity;
                customerQuantityError.style.color= "red"
            }
            if ("appointmentTime" in responseJSON) {
                appointmentTimeError.style.display = "block";
                appointmentTimeError.innerText = responseJSON.appointmentTime;
                appointmentTimeError.style.color= "red"
            }
            if ("idProducts" in responseJSON) {
                productsError.style.display = "block";
                productsError.innerText = responseJSON.idProducts;
                productsError.style.color= "red"
            }
            if ("idCombos" in responseJSON) {
                combosError.style.display = "block";
                combosError.innerText = responseJSON.idCombos;
                combosError.style.color= "red"
            }

        }
    }
}

const findById = async (id) => {
    const response = await fetch('/api/bills/' + id);

    return await response.json();
}

function onChangeSelect2(selector, value){
    const element = $(selector);
    element.val(value);
    element.change();
}
const onShowEdit = async (id) => {
    clearForm();
    userSelected = await findById(id);

    $('#staticBackdropLabel').text('Edit Bill');
    $('#staticBackdrop').modal('show');
    $('#customerName').val(userSelected.customerName);
    $('#customerPhone').val(userSelected.customerPhone);
    $('#customerEmail').val(userSelected.customerEmail);
    $('#customerQuantity').val(userSelected.customerQuantity);
    $('#priceBill').val(userSelected.price);
    $('#appointmentTime').val(userSelected.appointmentTime);
    $('#combos').val(userSelected.combosId);
    $('#combos').trigger('change');
    $('#users').val(userSelected.users);
    $('#users').trigger('change');
    $('#products').val(userSelected.productsId);
    $('#products').trigger('change');
    let totalProduct = 0;
    for (let i = 0; i < userSelected.productsPrice.length; i++) {
        totalProduct += userSelected.productsPrice[i];
    }
    $("#priceProducts").val(totalProduct);
    let totalCombo = 0;
    for (let i = 0; i < userSelected.combosPrice.length; i++) {
        totalCombo += userSelected.combosPrice[i];
    }
    $("#priceCombos").val(totalCombo);
}


// edit submit
async function  editUser (data){

    const response = await fetch('/api/bills/'+data.id, {
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
                await getList();
            }
        })
    } else {
        const responseJSON = await response.json();
        if (responseJSON) {
            if ("customerName" in responseJSON) {
                customerNameError.style.display = "block";
                customerNameError.innerText = responseJSON.customerName;
                customerNameError.style.color= "red"
            }
            if ("customerPhone" in responseJSON) {
                customerPhoneError.style.display = "block";
                customerPhoneError.innerText = responseJSON.customerPhone;
                customerPhoneError.style.color= "red"
            }
            if ("customerEmail" in responseJSON) {
                customerEmailError.style.display = "block";
                customerEmailError.innerText = responseJSON.customerEmail;
                customerEmailError.style.color= "red"
            }
            if ("customerQuantity" in responseJSON) {
                customerQuantityError.style.display = "block";
                customerQuantityError.innerText = responseJSON.customerQuantity;
                customerQuantityError.style.color= "red"
            }
            if ("appointmentTime" in responseJSON) {
                appointmentTimeError.style.display = "block";
                appointmentTimeError.innerText = responseJSON.appointmentTime;
                appointmentTimeError.style.color= "red"
            }
            if ("idProducts" in responseJSON) {
                productsError.style.display = "block";
                productsError.innerText = responseJSON.idProducts;
                productsError.style.color= "red"
            }
            if ("idCombos" in responseJSON) {
                combosError.style.display = "block";
                combosError.innerText = responseJSON.idCombos;
                combosError.style.color= "red"
            }
        }
    }
}

function clearForm() {
    const areaError = $('.areaError')
    areaError.empty();
    customerNameError.innerText="";
    customerPhoneError.innerText="";
    customerEmailError.innerText="";
    customerQuantityError.innerText="";
    productsError.innerText="";
    combosError.innerText="";
    appointmentTimeError.innerText="";
    onChangeSelect2("#products",null)
    onChangeSelect2("#combos",null)
    onChangeSelect2("#users",null)

    billForm.reset();
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


function validateForm() {
    // Lấy giá trị của products và combos
    var selectedProducts = document.getElementById("products").value;
    var selectedCombos = document.getElementById("combos").value;

    // Kiểm tra nếu cả products và combos đều không có giá trị thì hiển thị lỗi
    if (selectedProducts.length === 0 && selectedCombos.length === 0) {
        document.getElementById("productsError").textContent = "Chọn sản phẩm hoặc gói.";
        document.getElementById("combosError").textContent = "Chọn sản phẩm hoặc gói.";
    } else {
        // Nếu có giá trị, tắt lỗi
        document.getElementById("productsError").textContent = '';
        document.getElementById("combosError").textContent = '';
    }
}
function validateAppointmentTime() {
    var appointmentTimeInput = document.getElementById("appointmentTime");
    var appointmentTimeError = document.getElementById("appointmentTimeError");

    var selectedTime = new Date(appointmentTimeInput.value);
    var currentDate = new Date();
    if (isNaN(selectedTime.getTime())) {
        appointmentTimeError.textContent = "Định dạng ngày không hợp lệ";
    } else {
        if (selectedTime <= currentDate || selectedTime > new Date(currentDate.getTime() + 7 * 24 * 60 * 60 * 1000)) {
            appointmentTimeError.textContent = "Thời gian phải là trong tương lai và không quá 7 ngày.";
        } else {
            appointmentTimeError.textContent = '';
        }
    }
}
function validateCustomerQuantity() {
    var customerQuantityInput = document.getElementById("customerQuantity");
    var customerQuantityError = document.getElementById("customerQuantityError");

    // Lấy giá trị từ trường Customer Quantity
    var quantity = parseInt(customerQuantityInput.value);

    // Kiểm tra nếu giá trị không phải là một số hoặc nằm ngoài phạm vi
    if (isNaN(quantity) || quantity <= 0 || quantity > 15) {
        customerQuantityError.textContent = "Số lượng khách hàng phải lớn hơn 0 và nhỏ hơn hoặc bằng 15.";
    } else {
        // Nếu thỏa mãn, tắt lỗi
        customerQuantityError.textContent = '';
    }
}

async function payment(id){
    const billPayment = await findById(id);
    console.log(billPayment)
    if(billPayment.epayment === "UNPAID"){
        const { isConfirmed } = await Swal.fire({
            title: 'Xác nhận thanh toán',
            text: 'Thanh toán?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Đồng ý',
            cancelButtonText: 'Hủy',
        });
        if (!isConfirmed) {
            return; // Người dùng đã hủy xóa
        }
        const response = await fetch(`/api/bills/paid/${id}`, {
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
                        text: 'Đã thanh toán.',
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
        const response = await fetch(`/api/bills/unpaid/${id}`, {
            method: 'PATCH',
        });
        const { isConfirmed } = await Swal.fire({
            title: 'Xác nhận chưa thanh toán',
            text: 'Hủy thanh toán ?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Đồng ý',
            cancelButtonText: 'Hủy',
        });
        if (!isConfirmed) {
            return; // Người dùng đã hủy xóa
        }
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
                        text: 'Chưa thanh toán.',
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





