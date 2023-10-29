const service = document.getElementById("listShow");
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
    return `  <div class="col-lg-6 mb-5" >
                            <div class="d-flex align-items-center">
                                <img class="flex-shrink-0 img-fluid rounded" src="${item.poster}" alt="" style="width: 80px;">
                                <div class="d-flex flex-column text-start ps-4" style="width: 80%; margin: auto" >
                                    <h5 class="d-flex justify-content-between border-bottom pb-2">
                                        <span>${item.name}</span>
                                        <span class="text-primary">${item.price} VND</span>
                                    </h5>
                                    <span class="fst-italic" style="text-align: left">${item.description}</span>
                                </div>
                            </div>
                        </div>`
}

window.onload = async () => {
    await renderCarousel()
}