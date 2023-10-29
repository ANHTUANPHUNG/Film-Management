const service = document.getElementById("productShow");
let productsClient = [];

async function getProducts() {
    const res = await fetch('http://localhost:8080/api/products/list');
    return await res.json();
}


async function renderCarousel() {
    const list = await getProducts();
    productsClient = list
    renderServiceCarousel(list);
}

function renderServiceCarousel(items) {
    let str = '';
    items.forEach((e, i) => {
        str += renderItemStr(e, i);
    });
    service.innerHTML = str;

    if (items.length > 1) {
        $(".service-carousel").owlCarousel({
            autoplay: true,
            smartSpeed: 1500,
            loop: true,
            dots: false,
            nav: false,
            items: 5,
            responsive: {
                0: {
                    items: 1
                },
                600: {
                    items: 3
                },
                1000: {
                    items: 5
                }
            }
        });
    }
}

function renderItemStr(item, index) {
    return `<div class="service-item position-relative">
                <img class="img-fluid" src="${item.poster}" alt="">
                <div class="service-text text-center">
                    <h4 class="text-white font-weight-medium px-3">${item.name}</h4>
                    <p class="text-white px-3 mb-3">${item.description}</p>
                    <p class="text-white px-3 mb-3"> Chỉ với ${item.price} VND</p>
                    <div class="w-100 bg-white text-center p-4">
                    </div>
                </div>
            </div>`
}

window.onload = async () => {
    await renderCarousel()
}