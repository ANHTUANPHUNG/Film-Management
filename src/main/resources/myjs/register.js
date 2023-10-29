const registerForm = document.getElementById('registerForm');
let userSelected = {};


const onShowCreate = () => {
    clearForm();
    $('#staticBackdropLabel').text('Create User');
    getDataInput();
}

document.getElementById('create').onclick = () => {
    onShowCreate();
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
            pattern: "[0-9]{10}",
            message: 'Phone errors',
            required: true
        },
        {
            label: 'Password',
            name: 'passWord',
            value: userSelected.passWord,
            required: true
        },
    ];
}
    registerForm.onsubmit = async (e) => {
        e.preventDefault();
        let data = getDataFromForm(registerForm);

        data = {
            ...data,


        }
        if (userSelected.id) {
            await editRoom(data);
        } else {
            await createRegister(data)
        }
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

async function createRegister(data) {

    const response = await fetch('/api/users/list', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });
    if (response.ok) {
        Swal.fire({
            title: 'Created',
            text: 'khách hàng đã được tạo thành công.',
            icon: 'success',
            confirmButtonText: 'OK'
        }).then(() => {
            getList();
        });
    } else {
        Swal.fire({
            title: 'Error',
            text: 'Có lỗi xảy ra khi tạo khách hàng.',
            icon: 'error',
            confirmButtonText: 'OK'
        });
    }

}