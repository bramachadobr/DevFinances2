
let Modal = {
    open() {
        document
            .querySelector('.modal-overlay')
            .classList.add('active')
    },
    close() {
        document
            .querySelector('.modal-overlay')
            .classList.remove('active')
    },
    save() {
        document.querySelector(form)
    }
}

const Transaction = {
    all: [{
        id: 1,
        description: 'Luz',
        amount: -500022,
        data: '23/01/2021',
    },
    {
        id: 2,
        description: 'Site criação',
        amount: 500101,
        data: '23/01/2021',
    },
    {
        id: 3,
        description: 'Internet',
        amount: -200111,
        data: '23/01/2021',
    },
    {
        id: 4,
        description: 'APP',
        amount: 200333,
        data: '23/01/2021',
    }],

    add(transaction){
        Transaction.all.push(transaction)
        console.log(Transaction.all)
        App.Reload()
    },

    remove(index){
        Transaction.all.splice(index,1)
        App.Reload();
    },

    incons() {
        let income = 0
        Transaction.all.forEach(element => {
            if (element.amount >= 0) {
                income = income + element.amount
            }
        })

        return income
    },

    expenses() {

        let expanse = 0
        Transaction.all.forEach(element => {
            if (element.amount < 0) {
                expanse = expanse + element.amount
            }
        })
        return expanse
    },

    total() {
        return Transaction.incons() + Transaction.expenses()

    }
    
}

const DOM = {

    transactionContainer: document.querySelector('#data-table tbody'),

    addTransaction(transaction, index) {
        const tr = document.createElement('tr')
        tr.innerHTML = DOM.innerHtmlTransaction(transaction)
        DOM.transactionContainer.appendChild(tr)
    },

    innerHtmlTransaction(transaction) {

        const CSSclass = transaction.amount > 0 ? "entrada" : "saida"
        const amount = Utils.formatCurrency(transaction.amount)
        const html = `
        <td class="description">${transaction.description}</td>
        <td class="${CSSclass}">${amount}</td>
        <td class="date">${transaction.data}</td>
        <td><img src="./assets/minus.svg" alt="Remover transação"></td>
        `
        return html
    },

    updateBalance() {
        document.getElementById("entradaDisplay").innerHTML = Utils.formatCurrency(Transaction.incons())
        document.getElementById("saidaDisplay").innerHTML = Utils.formatCurrency(Transaction.expenses())
        document.getElementById("totalDisplay").innerHTML = Utils.formatCurrency(Transaction.total())
    },

    clearTransactions(){
        DOM.transactionContainer.innerHTML = ""
    }
}

const Utils = {
    formatCurrency(value) {
        const signal = Number(value) < 0 ? "-" : ""
        value = String(value).replace(/\D/g, "")
        value = Number(value) / 100
        value = value.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL"
        })

        return value = signal + value
    }
}

const App ={
    Init(){

        Transaction.all.forEach(function (transaction) {
            DOM.addTransaction(transaction)
        })
        DOM.updateBalance()
    },
    Reload(){
        DOM.clearTransactions()
        App.Init()
    }
}

App.Init();

 Transaction.remove(0)
