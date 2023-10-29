$("#billForm").validate({
    rules:{
        customerName:{
            minlength:2
        },
        customerQuantity:{
            number:true,
            maxlength:2
        },
        customerPhone: {
            number: true,
            minlength:10,
            maxlength: 12,
        }
    },
    message: {
        name:{
            required: "Vui lòng nhập thông tin",
            minlength: "Tên ít nhất cần có 2 ký tự"
        },
        customerQuantity:"Vui lòng nhập thông tin số lượng khách",
        timeBook: "Vui lòng nhập thời gian cuộc hẹn",
        customerPhone: {
            required: "Vui lòng nhập thông tin chính xác số điện thoại",
            minlength: "Số điện thoại cần có ít nhất 10 số",
            maxlength: "Số điện thoại không quá 12 số"
        }


    },

    submitHandler: async function(form, e) {
        e.preventDefault()


        const data = getData();
        // goi api de tao bill
        await createBill(data);

    }

});