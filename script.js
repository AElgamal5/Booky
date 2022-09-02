class Book {
  constructor(title, author, type, isbn) {
    this.title = title;
    this.author = author;
    this.type = type;
    this.isbn = isbn;
  }
}

class Storage {
  static getBooks() {
    if (localStorage.getItem("books") === null) {
      return [];
    } else {
      return JSON.parse(localStorage.getItem("books"));
    }
  }

  static addBook(book) {
    let books = this.getBooks();
    books.push(book);
    localStorage.setItem("books", JSON.stringify(books));
  }

  static removeBook(e) {
    if (e.classList.contains("fa-trash")) {
      let books = this.getBooks();
      let isbn = e.parentElement.previousElementSibling.innerText;
      books = books.filter((book) => book.isbn !== isbn);
      localStorage.setItem("books", JSON.stringify(books));
    }
  }
  static editBook(book, isbnValue, last) {
    //get all books
    let books = this.getBooks();
    //we have to conditions : if it last row or not
    if (last === 1) {
      books.pop();
      books.push(book);
      //console.log(books);
    } else {
      books.forEach((b) => {
        if (b.isbn === isbnValue) {
          b.title = book.title;
          b.author = book.author;
          b.type = book.type;
          b.isbn = book.isbn;
        }
      });
    }
    //update the local storage
    localStorage.setItem("books", JSON.stringify(books));
  }
}

class UI {
  //show data in the table
  static showBooks() {
    //get all data form storage
    let books = Storage.getBooks();
    //show each books
    books.forEach((book) => {
      this.addBook(new Book(book.title, book.author, book.type, book.isbn), 0);
    });
  }

  static addBook(book, edit) {
    let row = document.createElement("tr");
    row.innerHTML = `
      <td>${book.title}</td>
      <td>${book.author}</td>
      <td>${book.type}</td>
      <td>${book.isbn}</td>
      <td><i class="fa fa-trash text-danger" style="cursor: pointer"  ></i> / <i class="fa fa-edit text-primary" style="cursor: pointer"></i></td>
      `;
    if (edit === 0) {
      document.querySelector("tbody").appendChild(row);
    } else {
      return row;
    }
  }

  static deleteBook(e) {
    if (e.classList.contains("fa-trash")) {
      e.parentElement.parentElement.remove();
      //alert
      this.showAlert("Book Removed", "success");
    }
  }

  static editBook(e) {
    if (!e.classList.contains("fa-edit")) {
      return;
    }
    let thisRow = e.parentElement.parentElement;
    thisRow.className = "table-active";
    let isbnValue = e.parentElement.previousElementSibling.innerText;
    let typeValue =
      e.parentElement.previousElementSibling.previousElementSibling.innerText;
    let authorValue =
      e.parentElement.previousElementSibling.previousElementSibling
        .previousElementSibling.innerText;
    let titleValue =
      e.parentElement.previousElementSibling.previousElementSibling
        .previousElementSibling.previousElementSibling.innerText;
    let form = document.querySelector("form");
    let btn = document.querySelector("#submit");
    let title = document.querySelector("#title");
    let author = document.querySelector("#author");
    let type = document.querySelector("#type");
    let isbn = document.querySelector("#isbn");
    title.value = titleValue;
    author.value = authorValue;
    type.value = typeValue;
    isbn.value = isbnValue;
    btn.innerHTML = "Save";
    // let cancelBtn = document.createElement("button");
    // cancelBtn.className = "btn btn-danger btn-block";
    // cancelBtn.innerText = "Cancel";
    // document.querySelector("#btns-div").appendChild(cancelBtn);
    // let done;
    // cancelBtn.onclick = () => {
    //   cancelBtn.remove();
    //   this.clearFilds();
    //   //btn.innerHTML = "ADD";
    //   done = 1;
    //   this.addBook();
    // };
    form.onsubmit = (event) => {
      event.preventDefault();
      if (
        title.value === "" ||
        author.value === "" ||
        type.value === "" ||
        isbn.value === ""
      ) {
        UI.showAlert("Please fill all fields", "danger");
      } else {
        let nextRow = e.parentElement.parentElement.nextElementSibling;
        thisRow.remove();
        let newRow = this.addBook(
          new Book(title.value, author.value, type.value, isbn.value),
          1
        );
        let tbody = document.querySelector("tbody");
        let last;
        if (nextRow === null) {
          tbody.appendChild(newRow);
          last = 1;
        } else {
          tbody.insertBefore(newRow, nextRow);
          last = 0;
        }
        //update the local storage
        Storage.editBook(
          new Book(title.value, author.value, type.value, isbn.value),
          isbnValue,
          last
        );
        this.clearFilds();
      }
      btn.innerHTML = "ADD";
    };
  }

  static showAlert(msg, type) {
    let form = document.querySelector("form");
    let div = document.createElement("div");
    let container = document.querySelector(".container");
    div.innerText = msg;
    div.setAttribute("class", `alert alert-${type}`);
    container.insertBefore(div, form);
    setTimeout(() => document.querySelector(".alert").remove(), 3000);
  }

  static clearFilds() {
    document.querySelector("#title").value = "";
    document.querySelector("#author").value = "";
    document.querySelector("#type").value = "";
    document.querySelector("#isbn").value = "";
  }
}

// show books when load the page
window.onload = () => UI.showBooks();

// add new book
document.querySelector("form").onsubmit = (event) => {
  event.preventDefault();
  let title = document.querySelector("#title");
  let author = document.querySelector("#author");
  let type = document.querySelector("#type");
  let isbn = document.querySelector("#isbn");
  if (
    title.value === "" ||
    author.value === "" ||
    type.value === "" ||
    isbn.value === ""
  ) {
    UI.showAlert("Please fill all fields", "danger");
  } else {
    UI.addBook(new Book(title.value, author.value, type.value, isbn.value), 0);
    Storage.addBook(
      new Book(title.value, author.value, type.value, isbn.value)
    );
    UI.clearFilds();
    // Show success message
    UI.showAlert("Book Added", "success");
  }
};

// remove /edit  book
document.querySelector("tbody").onclick = (event) => {
  // remove from UI
  UI.deleteBook(event.target);
  //remove from storage
  Storage.removeBook(event.target);

  //edit book
  UI.editBook(event.target);
};
