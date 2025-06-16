const bookForm = document.getElementById("bookForm");
const coverInput = document.getElementById("coverInput");
const pdfInput = document.getElementById("pdfInput");
const descriptionInput = document.getElementById("description");
const gallery = document.createElement("section");
gallery.className = "gallery glass";
document.querySelector("main").appendChild(gallery);

// Vista previa
coverInput.addEventListener("change", function () {
  const preview = document.getElementById("coverPreview");
  const file = this.files[0];

  if (file && file.type.startsWith("image/")) {
    const reader = new FileReader();
    reader.onload = () => {
      preview.innerHTML = `<img src="${reader.result}" alt="Carátula">`;
      preview.dataset.cover = reader.result; // Guardamos la imagen para el submit
    };
    reader.readAsDataURL(file);
  } else {
    preview.textContent = "Vista previa de la carátula";
  }
});

// Cargar libros existentes
window.addEventListener("load", renderBooks);

bookForm.addEventListener("submit", function (e) {
  e.preventDefault();

  const cover = document.getElementById("coverPreview").dataset.cover;
  const description = descriptionInput.value;
  const pdfFile = pdfInput.files[0];

  if (!cover || !pdfFile) {
    alert("⚠️ Falta cargar imagen o PDF");
    return;
  }

  const reader = new FileReader();
  reader.onload = function () {
    const pdfData = reader.result;

    const book = {
      id: Date.now(),
      cover,
      description,
      pdf: pdfData
    };

    const books = JSON.parse(localStorage.getItem("books")) || [];
    books.push(book);
    localStorage.setItem("books", JSON.stringify(books));

    bookForm.reset();
    document.getElementById("coverPreview").innerHTML = "Vista previa de la carátula";
    delete document.getElementById("coverPreview").dataset.cover;

    renderBooks();
    alert("📚 Libro guardado correctamente");
  };
  reader.readAsDataURL(pdfFile);
});

function renderBooks() {
  const books = JSON.parse(localStorage.getItem("books")) || [];
  gallery.innerHTML = "<h2>📖 Galería de Libros</h2><div class='book-grid'></div>";
  const grid = gallery.querySelector(".book-grid");

  if (books.length === 0) {
    grid.innerHTML = "<p>No hay libros guardados aún.</p>";
    return;
  }

  books.forEach(book => {
    const card = document.createElement("div");
    card.className = "book-card";
    card.innerHTML = `
      <img src="${book.cover}" alt="Carátula" />
      <p>${book.description}</p>
      <a href="${book.pdf}" target="_blank">📄 Ver PDF</a>
    `;
    grid.appendChild(card);
  });
}
document.getElementById('directoryForm').addEventListener('submit', function(e) {
  e.preventDefault();
  const nombre = document.getElementById('directoryName').value.trim();

  fetch('add_from_directory.php', {
    method: 'POST',
    headers: {'Content-Type': 'application/x-www-form-urlencoded'},
    body: `nombre=${encodeURIComponent(nombre)}`
  })
  .then(res => res.json())
  .then(data => {
    if (data.status === 'ok') {
      alert('📘 Libro añadido desde carpeta');
      loadBooks(); // Asegúrate de que esta función recarga la galería
    } else {
      alert('❌ ' + data.message);
    }
  })
  .catch(err => {
    console.error('Error:', err);
    alert('❌ Error al añadir el libro');
  });
});
function loadBooks() {
  fetch('libros.json')
    .then(res => res.json())
    .then(libros => {
      const gallery = document.getElementById('gallery');
      gallery.innerHTML = '<h2>📚 Galería de Libros</h2><div class="book-grid">' +
        libros.map(book => `
          <div class="book-card">
            <img src="${book.cover}" alt="Carátula">
            <p>${book.nombre}</p>
            <a href="${book.pdf}" target="_blank">Ver PDF</a>
          </div>
        `).join('') +
      '</div>';
    });
}

window.onload = loadBooks;
const uploadForm = document.getElementById('uploadForm');
const uploadMessage = document.getElementById('uploadMessage');

uploadForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const formData = new FormData(uploadForm);

  try {
    const res = await fetch('subir_libro.php', {
      method: 'POST',
      body: formData
    });

    const result = await res.json();

    if (res.ok) {
      uploadMessage.textContent = "Libro subido correctamente.";
      uploadForm.reset();
      loadBooks(); // Recarga la galería
    } else {
      uploadMessage.textContent = "Error: " + (result.error || 'Error al subir.');
    }
  } catch (error) {
    uploadMessage.textContent = "Error al conectar con el servidor.";
    console.error(error);
  }
});

