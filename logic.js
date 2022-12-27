        // MY_SERVER_BOOKS = "https://library-back-a0z7.onrender.com/books/"
        // MY_SERVER_CUSTOMERS = "https://library-back-a0z7.onrender.com/customers/"
        // MY_SERVER_LOANS = "https://library-back-a0z7.onrender.com/loans/"
        MY_SERVER_BOOKS = "http://127.0.0.1:5000/books/"
        MY_SERVER_CUSTOMERS = "http://127.0.0.1:5000/customers/"
        MY_SERVER_LOANS = "http://127.0.0.1:5000/loans/"
        let books = []
        let customers = []
        let loans = []

        const searchBookDisplay = () => {
            display_Data.innerHTML = books.data.filter(x => x.bName.toLowerCase().includes(sr.value.toLowerCase())).map(b => `<div><button onclick="delBook(${b.b_id})">DELETE</button> ${b.b_id}: Name: ${b.bName} | Auther: ${b.auther} | Published: ${b.bYear} | Book Type: ${b.bType}</div>`).join("")
        }

        const buildBooksDisplay = () => {
            display_Gui.innerHTML = `<h1>Books</h1><hr>
            <h6>Add a Book to the database</h6>
            Name : <input id="new_book_name" type="text" required><br>
            Auther : <input id="new_book_auther" type="text" required><br>
            Publishing year: <input id="new_book_year" type="number" value="1990" min="1300" max="2022" required><br>
            Book type: <input id="new_book_type" type="number" min="1" max="3" required>
            <button onclick="addBook()">Add Book</button><hr>
            <h6>Search by Name</h6>
            <input id="sr" onkeyup="searchBookDisplay()">`
            display_Data.innerHTML = books.data.filter(x => x.active == 1).map(b => `<div><button onclick="delBook(${b.b_id})">DELETE</button> ${b.b_id}: Name: ${b.bName} | Auther: ${b.auther} | Published: ${b.bYear} | Book Type: ${b.bType}</div>`).join("")
        }

        const searchCustomersDisplay = () => {
            display_Data.innerHTML = customers.data.filter(x => x.cName.toLowerCase().includes(sr.value.toLowerCase())).map(c => `<div><button onclick="delCust(${c.c_id})">DELETE</button> ${c.c_id}: Name: ${c.cName} | City: ${c.city} | Age: ${c.age}</div>`).join("")
        }

        const buildCustomersDisplay = () => {
            display_Data.innerHTML = customers.data.filter(x => x.active == 1).map(c => `<div><button onclick="delCust(${c.c_id})">DELETE</button> ${c.c_id}: Name: ${c.cName} | City: ${c.city} | Age: ${c.age}</div>`).join("")
            display_Gui.innerHTML = `<h1>Customers</h1><hr>
            <h6>Add a Customer to the database</h6>
            Name : <input id="new_customer_name" type="text" required><br>
            City : <input id="new_customer_city" type="text" required><br>
            age: <input id="new_customer_age" type="number" min="3" max="140" required>
            <button onclick="addCust()">Add Customer</button><hr>
            <h6>Search by Name</h6>
            <input id="sr" onkeyup="searchCustomersDisplay()">`
        }

        const buildCustomerSelectDisplay = () => {
            cust_select_display.innerHTML = "<select id='cust_select'>" + customers.data.map(c => `<option value='${c.c_id}'>${c.cName}</option>`).join('') + '</select>'
        }

        const buildBookSelectDisplay = () => {
            book_select_display.innerHTML = "<select id='book_select'> " + books.data.map(b => `<option value='${b.b_id}'>${b.bName}</option>`).join('') + '</select>'
        }

        const buildLoansDisplay = () => {
            display_Data.innerHTML = loans.data.filter(x => x.active == 1).map(l => `<div><button onclick="completeLoan(${l.l_id})">Return Loan</button> 
                 Customer: ${l.customer} | Book: ${l.book} | Loan Date: ${l.loanDate} | Return Date: ${l.returnDate}</div>`).join("")
            display_Gui.innerHTML = `<h1>Loans</h1><hr>
            <h6>Record a Loan to the database</h6>
            Customer : <div id="cust_select_display"></div>
            Book : <div id="book_select_display"></div>
            <button onclick="addLoan()">Add Loan</button>
            <button onclick="buildLateLoansDisplay()">Show Late Loans</button>`
            buildCustomerSelectDisplay()
            buildBookSelectDisplay()
        }

        const buildLateLoansDisplay = () => {
            let now = new Date()
            now = now.toISOString().split('T')[0]
            console.log("today:" + now)
            display_Data.innerHTML = "<h6>Late Loans</h6><hr>" + loans.data.filter(x => x.active == 1).filter(x => now > x.returnDate).map(l => `<div><button onclick="completeLoan(${l.l_id})">Completed</button> 
                 Customer: ${l.customer} | Book: ${l.book} | Loan Date: ${l.loanDate} | Return Date: ${l.returnDate}</div>`).join("")
            display_Gui.innerHTML = `<h1>Loans</h1><hr>
            <h6>Record a Loan to the database</h6>
            Customer : <div id="cust_select_display"></div>
            Book : <div id="book_select_display"></div>
            <button onclick="addLoan()">Add Loan</button>
            <button onclick="buildLoansDisplay()">Show All Loans</button>`
            buildCustomerSelectDisplay()
            buildBookSelectDisplay()
        }

        const loadData = async () => {
            books = await axios.get(MY_SERVER_BOOKS)
            customers = await axios.get(MY_SERVER_CUSTOMERS)
            loans = await axios.get(MY_SERVER_LOANS)
            buildBooksDisplay()
        }
        loadData()

        //////////////////// CRUD books /////////////////// 
        //create books
        const addBook = () => {
            if (new_book_name.value.length > 3 && new_book_auther.value.length > 3) {
                axios.post(MY_SERVER_BOOKS, {
                    "bName": new_book_name.value, "auther": new_book_auther.value,
                    "bYear": new_book_year.value, "bType": new_book_type.value
                })
                buildBooksDisplay()
            }
        }

        //put book - change active atribute to false
        const delBook = (id) => {
            axios.put(MY_SERVER_BOOKS + id,{
                "active": false
            })
        }

        //////////////////// CRUD customers /////////////////// 
        //create customer
        const addCust = () => {
            if (new_customer_name.value.length > 3 && new_customer_city.value.length > 2) {
                axios.post(MY_SERVER_CUSTOMERS, {
                    "cName": new_customer_name.value,
                    "City": new_customer_city.value, "age": new_customer_age.value
                })
                buildCustomersDisplay()
            }
        }

        //put customer - change active atribute to false
        const delCust = (id) => {
            axios.put(MY_SERVER_CUSTOMERS + id, {
                "active": false
            })
        }

        //////////////////// CRUD loans /////////////////// 
        //create loan
        const addLoan = () => {
            axios.post(MY_SERVER_LOANS, {
                "customer": cust_select.value,
                "book": book_select.value
            })
            buildLoansDisplay()
        }

        //put loan - change active atribute to false
        const completeLoan = (id) => {
            axios.put(MY_SERVER_LOANS + id, {
                "active": false
            })
        }