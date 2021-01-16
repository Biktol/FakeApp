
/** Good, very descriptive. */
const searchBookButton = document.querySelector(".submit-form");
const bookInput = document.querySelector(".form_input");
const bookTitle = document.querySelector(".book_title");
const bookCover = document.querySelector(".book_cover");
const bookDescription = document.querySelector(".book_description");
const bookAuthor = document.querySelector(".book_author");

/** Short and descriptive function names, neat. */

//Esto es porque la mardita api de búsqueda proporciona todo menos la descripción, gg.
const getBookDescription = (bookUrl) => {
  axios({
    method: "GET",
    url: `https://openlibrary.org${bookUrl}.json`,
  })
    .then((response) => {
      //Por si fuera poco, algunas tienen la descripción como objetos y otras no.
      if (response.data.description.value) {
        bookDescription.textContent = response.data.description.value;
      } else if (response.data.description) {
        bookDescription.textContent = response.data.description;
      }
    })
    .catch(() => {
      bookDescription.textContent =
        "There isn't any description available for this book.";
    });
};

const getBookData = (event) => {
  event.preventDefault();
  searchBookButton.disabled = true;

  // Avoid long-lines.
  const bookQuery = bookInput
    .value
    .replace(/ /g, "+")
    .toLowerCase()
    .trim();

  axios({
    method: "GET",
    url: `http://openlibrary.org/search.json?q=${bookQuery}`,
  })
    .then((response) => {
      let flag = 0;

      while (
        !response.data.docs[flag].cover_i ||
        response.data.docs[flag].cover_i <= 0
      ) {
        // flag?
        flag++;
      }
      bookTitle.textContent = response.data.docs[flag].title;
      bookTitle.setAttribute(
        "href",
        `https://openlibrary.org${response.data.docs[flag].key}`
      );
      bookTitle.setAttribute("target", "_blank");
      bookTitle.setAttribute("oncontextmenu", "return true");
      bookTitle.classList.add("link");

      bookCover.classList.remove("hidden");
      bookCover.setAttribute(
        "src",
        `http://covers.openlibrary.org/b/id/${response.data.docs[flag].cover_i}-M.jpg`
      );

      bookAuthor.textContent = response.data.docs[flag].author_name;

      bookDescription.classList.remove("hidden");
      getBookDescription(response.data.docs[flag].key);

      searchBookButton.disabled = false;
    })
    .catch(() => {
      bookTitle.textContent = "Sorry, we couldn't find that book, try again.";
      bookTitle.classList.remove("link");
      bookTitle.setAttribute("href", "javascript:void(0)");
      bookTitle.setAttribute("target", "");
      bookTitle.setAttribute("oncontextmenu", "return false");

      bookAuthor.textContent = "";

      bookCover.classList.add("hidden");

      bookDescription.classList.add("hidden");

      searchBookButton.disabled = false;
    });
};

searchBookButton.addEventListener("click", getBookData);