
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

const StorageTransactions={
    get(){

        return JSON.parse(localStorage.getItem("@devFinances:transactions")) || []

    },

    set(transactions){

        localStorage.setItem("@devFinances:transactions", JSON.stringify(transactions))
    }
}

const Transaction = {
    all: StorageTransactions.get(),

    add(transaction) {
        this.all.push(transaction)
        console.log(this.all)
        App.reload()
    },

    remove(index) {
        this.all.splice(index, 1)
        App.reload();
    },

    incons() {
        let income = 0
        this.all.forEach(element => {
            if (element.amount >= 0) {
                income = income + element.amount
            }
        })

        return income
    },

    expenses() {

        let expanse = 0
        this.all.forEach(element => {
            if (element.amount < 0) {
                expanse = expanse + element.amount
            }
        })
        return expanse
    },

    total() {
        return this.incons() + this.expenses()

    }

}

const DOM = {

    transactionContainer: document.querySelector('#data-table tbody'),

    addTransaction(transaction, index) {
        const tr = document.createElement('tr')
        tr.innerHTML = DOM.innerHtmlTransaction(transaction, index)
        DOM.transactionContainer.appendChild(tr)
    },

    innerHtmlTransaction(transaction, index) {

        const CSSclass = transaction.amount > 0 ? "entrada" : "saida"
        const amount = Utils.formatCurrency(transaction.amount)
        const html = `
        <td class="description">${transaction.description}</td>
        <td class="${CSSclass}">${amount}</td>
        <td class="date">${transaction.date}</td>
        <td>
            <img onclick="Transaction.remove(${index})" src="./assets/minus.svg" 
            alt="Remover transação">
        </td>
        `
        return html
    },

    updateBalance() {
        document.getElementById("entradaDisplay").innerHTML = Utils.formatCurrency(Transaction.incons())
        document.getElementById("saidaDisplay").innerHTML = Utils.formatCurrency(Transaction.expenses())
        document.getElementById("totalDisplay").innerHTML = Utils.formatCurrency(Transaction.total())
    },

    clearTransactions() {
        this.transactionContainer.innerHTML = ""
    }
}

const Utils = {
    formatAmount(value) {
        value = Number(value) * 100
        //return Number(value.replace(/\,\./g, "")) * 100;
        return value
    },
    formatDate(value) {

        const [year, month, day] = value.split("-")
        return `${day}/${month}/${year}`
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

        return {
            description,
            amount,
            date
        }
    },

    saveTransaction(transaction) {
        console.log(transaction)
        Transaction.add(transaction)
        
    },

    clearFields() {
        this.description.value = ""
        this.amount.value = ""
        this.date.value = ""
    },

    submit(event) {

        event.preventDefault()

        try {

            this.validateFildes()
            const transaction = this.formatValues()
            this.saveTransaction(transaction)
            this.clearFields()
            Modal.close()

        } catch (error) {

            alert(error.message)

        }
    }
}

const App = {
    init() {

        Transaction.all.forEach(function (transaction,index) {
            DOM.addTransaction(transaction, index)
        })
        DOM.updateBalance()

        StorageTransactions.set(transaction.all)

    },
    reload() {
        DOM.clearTransactions()
        this.init()
    }
}

App.init();