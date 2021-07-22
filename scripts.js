
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

    add(transaction) {
        Transaction.all.push(transaction)
        console.log(Transaction.all)
        App.Reload()
    },

    remove(index) {
        Transaction.all.splice(index, 1)
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
        <td class="date">${transaction.date}</td>
        <td><img src="./assets/minus.svg" alt="Remover transação"></td>
        `
        return html
    },

    updateBalance() {
        document.getElementById("entradaDisplay").innerHTML = Utils.formatCurrency(Transaction.incons())
        document.getElementById("saidaDisplay").innerHTML = Utils.formatCurrency(Transaction.expenses())
        document.getElementById("totalDisplay").innerHTML = Utils.formatCurrency(Transaction.total())
    },

    clearTransactions() {
        DOM.transactionContainer.innerHTML = ""
    }
}

const Utils = {
    formatAmount(value) {
        value = Number(value) * 100
        return value
    },
    formatDate(value) {
        const splitteDate = value.split("-")
        console.log(splitteDate)
        return `${splitteDate[2]}/${splitteDate[1]}/${splitteDate[0]}`
    },
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


const Form = {

    description: document.querySelector('input#description'),
    amount: document.querySelector('input#amount'),
    date: document.querySelector('input#date'),

    getValues() {
        return {
            description: this.description.value,
            amount: this.amount.value,
            date: this.date.value
        }
    },

    validateFildes() {
        let { description, amount, date } = this.getValues()

        if (!description.trim() || amount.trim() === "" || date.trim() === "") {
            throw new Error("Por vafor preeencha todos os campos")
        }
    },

    formatValues() {
        let { description, amount, date } = this.getValues()
        amount = Utils.formatAmount(amount)
        date = Utils.formatDate(date)
        console.log(date)

        return {
            description,
            amount,
            date
        }
    },

    saveTransaction(transaction) {
        Transaction.add(transaction)
    },

    clearFields() {
        Form.description.value = ""
        Form.amount.value = ""
        Form.date.value = ""
    },

    Submit(event) {

        event.preventDefault()

        try {

            Form.validateFildes()
            const transaction = Form.formatValues()
            Transaction.add(transaction)
            Form.clearFields()
            Modal.close()

        } catch (error) {

            alert(error.message)

        }

    }
}

const App = {
    Init() {

        Transaction.all.forEach(function (transaction) {
            DOM.addTransaction(transaction)
        })
        DOM.updateBalance()
    },
    Reload() {
        DOM.clearTransactions()
        App.Init()
    }
}

App.Init();
