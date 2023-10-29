const service = document.getElementById("comboShow");
let comboClients = [];

async function getProducts2() {
    const res = await fetch('http://localhost:8080/api/combos/list');
    return await res.json();
}


async function renderCarousel() {
    const list = await getProducts2();
    comboClients = list;
    renderServiceCarousel(list);
}

function renderServiceCarousel(items) {
    let str = '';
    items.forEach((e, i) => {
        str += renderItemStr(e, i);
    });
    service.innerHTML = str;

    items.forEach(item => {
        renderProductItem(item);
    })

    if (items.length > 1) {
        $(".pricing-carousel").owlCarousel({
            autoplay: true,
            smartSpeed: 1500,
            margin: 30,
            loop: true,
            dots: false,
            nav : false,
            responsive: {
                0:{
                    items:1
                },
                576:{
                    items:1
                },
                768:{
                    items:2
                }
            }
        });
    }
}

function renderItemStr(item, index) {
    return `  <div class="bg-white"  >
                <div class="d-flex align-items-center justify-content-between border-bottom border-primary p-4">
                    <h1 class="display-4 mb-0" style="margin: auto; color: pink" >
                         ${item.name}
                    </h1>
                </div>
                <div>
                  <h5 class="text-primary text-uppercase m-0" style="text-align: center">${item.price} VND</h5>
               </div>
                
                <div class="p-4" id="productItem${item.id}">
                
                </div>
            </div>`
}

function renderProductItem(item) {
    let strId = "productItem" + item.id;
    let showListProduct = document.getElementById(strId);
    item.products.forEach(e => {
        let ele = document.createElement("p")
        ele.innerHTML = "<i class=\"fa fa-check text-success mr-2\"></i>" + e;
        showListProduct.appendChild(ele);
    })
}

window.onload = async () => {
    await renderCarousel()
}