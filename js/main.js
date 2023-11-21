const form = document.getElementById("novoItem")
const lista = document.getElementById("lista")
var itens;
init();

function init() {
    fetch('https://api-lista-compras.vercel.app/produto')
        .then(response => response.json())
        .then(data => {
            // faça algo com os dados retornados
            console.log(data)
            itens = data;

            itens.forEach((elemento) => {
                criaElemento(elemento)
            })
        })
        .catch(error => {
            // trate erros de requisição
            console.log(error)
        });

}



form.addEventListener("submit", (evento) => {
    evento.preventDefault()

    const nome = evento.target.elements['nome']
    const quantidade = evento.target.elements['quantidade']

    const existe = itens.find(elemento => elemento.title === nome.value)

    const itemAtual = {
        "title": nome.value,
        "quantidade": quantidade.value
    }

    itens = null;
    lista.innerHTML = '';   

    if (existe) {

        fetch("https://api-lista-compras.vercel.app/produto/" + existe.id, {
            method: "PUT",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(itemAtual)
        }).then(response => {
           
            console.log('disparo')
            itens = response.json();
            init();

        }).catch(error => console.error(error));

    } else {

        fetch('https://api-lista-compras.vercel.app/produto', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(itemAtual)
        }).then(data => {
            // faça algo com os dados retornados
            console.log(data)

            init();

        }).catch(error => {
            // trate erros de requisição
            console.log(error)
        });
    }

    localStorage.setItem("itens", JSON.stringify(itens))

    nome.value = ""
    quantidade.value = ""
})

function criaElemento(item) {
    const novoItem = document.createElement("li")
    novoItem.classList.add("item")

    const numeroItem = document.createElement("strong")
    numeroItem.innerHTML = item.quantidade
    numeroItem.dataset.id = item.id
    novoItem.appendChild(numeroItem)

    novoItem.innerHTML += item.title

    novoItem.appendChild(botaoDeleta(item.id))

    lista.appendChild(novoItem)
}

function atualizaElemento(item) {
    document.querySelector("[data-id='" + item.id + "']").innerHTML = item.quantidade
}

function botaoDeleta(id) {
    const elementoBotao = document.createElement("button")
    elementoBotao.innerText = "X"

    elementoBotao.addEventListener("click", function () {

        deletaElemento(this.parentNode, id)
    })

    return elementoBotao
}

function deletaElemento(tag, id) {
    fetch('https://api-lista-compras.vercel.app/produto/' + id, {
        method: 'DELETE',
    }).then(res => {
        console.log(res.data)
    }
    ).catch(error => {
        // trate erros de requisição
        console.log(error)
    });
    tag.remove()

    itens.splice(itens.findIndex(elemento => elemento.id === id), 1)

    localStorage.setItem("itens", JSON.stringify(itens))
}