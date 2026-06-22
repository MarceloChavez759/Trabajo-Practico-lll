/** 
 * EDU METRICS - Lógica del Lado del Cliente
 * Este script gestiona las interacciones de la interfaz, el modo de tema y animaciones de scroll.
 */

/* INICIALIZACIÓN: Se dispara cuando todo el contenido HTML ha sido procesado */
/* Este pedazo de código se ejecuta automáticamente cuando el navegador termina de cargar el HTML, activando todas las funciones interactivas del sitio. */
document.addEventListener('DOMContentLoaded', () => {
    initScrollReveal(); // Inicializa animaciones de scroll
    initThemeToggle(); // Inicializa cambio de tema
    initMobileMenu(); // Inicializa menú móvil
}); // Cierre del listener

/* FUNCIÓN DE REVELACIÓN: Detecta cuándo un elemento entra en pantalla para animarlo */
/* Este pedazo de código configura un "observador" que detecta cuando el usuario baja con el scroll y hace que los elementos aparezcan suavemente en pantalla. */
function initScrollReveal() {
    const observerOptions = { threshold: 0.15 };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, observerOptions);

    document.querySelectorAll('.scroll-reveal').forEach(el => observer.observe(el));
} // Fin de scroll reveal

/* FUNCIÓN DE TEMA: Gestiona el cambio visual entre Modo Claro y Modo Oscuro */
/* Este pedazo de código gestiona el botón de tema, permitiendo al usuario alternar entre el modo oscuro y el modo claro al hacer clic. */
function initThemeToggle() {
    const themeBtn = document.getElementById('theme-toggle');
    const icon = themeBtn.querySelector('i');

    themeBtn.addEventListener('click', () => {
        document.body.classList.toggle('light-mode');
        icon.className = document.body.classList.contains('light-mode') ? 'fas fa-sun' : 'fas fa-moon';
    });
} // Fin de tema

/* MENÚ MÓVIL: Controla la visibilidad del menú en pantallas pequeñas */
/* Este pedazo de código controla el menú hamburguesa en dispositivos móviles, mostrando u ocultando los enlaces de navegación al tocar el icono. */
function initMobileMenu() {
    const toggle = document.querySelector('.menu-toggle');
    const nav = document.querySelector('.nav-links');
    
    toggle?.addEventListener('click', () => {
        nav.style.display = nav.style.display === 'flex' ? 'none' : 'flex';
    });
}

// Lógica para el Modal de Autenticación
const modal = document.getElementById('auth-modal');
const loginBtn = document.getElementById('login-trigger');
const closeBtn = document.querySelector('.close-modal');

loginBtn.addEventListener('click', () => {
    modal.style.display = 'flex';
});

closeBtn.addEventListener('click', () => {
    modal.style.display = 'none';
});

// Cerrar si hace clic fuera del contenido
window.addEventListener('click', (e) => {
    if (e.target === modal) modal.style.display = 'none';
});

const tabBtns = document.querySelectorAll('.tab-btn');
const forms = document.querySelectorAll('.auth-form');

//cambiar entre ventanas inicio, registrarse
tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        // Quitar clase active de todos los botones
        tabBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        // Ocultar todos los formularios
        forms.forEach(f => f.style.display = 'none');
        
        // Mostrar el formulario seleccionado
        const targetForm = document.getElementById(btn.getAttribute('data-form'));
        targetForm.style.display = 'flex';
    });
});

// Función para cargar roles desde la base de datos
function cargarRoles() {
    const selectRoles = document.getElementById('select-roles');

    fetch('http://localhost/Trabajopractico3/LOGICA/obtener_roles.php')
        .then(response => response.json())
        .then(data => {
            // Limpiamos el mensaje de "Cargando..."
            selectRoles.innerHTML = '<option value="" disabled selected>Selecciona tu Rol</option>';
            
            // Llenamos con los datos de la BD
            data.forEach(rol => {
                const option = document.createElement('option');
                option.value = rol.id_rol;
                option.textContent = rol.nombre;
                selectRoles.appendChild(option);
            });
        })
        .catch(error => {
            console.error('Error al cargar roles:', error);
            selectRoles.innerHTML = '<option value="">Error al cargar</option>';
        });
}

// Llamar a la función cuando cargue el documento
document.addEventListener('DOMContentLoaded', () => {
    cargarRoles();
    // ... aquí van tus otras funciones de scroll, tema, etc.
});

// Lógica para el formulario de registro, esto envia los datos de registro de la pagina a la base de datos.
const registerForm = document.getElementById('register-form');

registerForm.addEventListener('submit', (e) => {
    e.preventDefault(); // Evita que la página se refresque

    const formData = new FormData(registerForm);

    fetch('http://localhost/Trabajopractico3/LOGICA/registrar_usuario.php', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.status === "success") {
            alert("¡Éxito! " + data.message);
            registerForm.reset(); // Limpia los campos
            document.getElementById('auth-modal').style.display = 'none'; // Cierra el modal
        } else {
            alert("Error: " + data.message);
        }
    })
    .catch(error => console.error('Error al registrar:', error));
});

// --- LOGICA DE SESIÓN Y COMPORTAMIENTO DEL PANEL (VERSIÓN CORREGIDA) ---

// Envolvemos TODO dentro de DOMContentLoaded para asegurar que los botones ya existan en la pantalla
document.addEventListener('DOMContentLoaded', () => {
    
    // Captura de elementos del DOM
    const loginForm = document.getElementById('login-form');
    const loginTrigger = document.getElementById('login-trigger');
    const profileTrigger = document.getElementById('profile-trigger');
    const profileSidebar = document.getElementById('profile-sidebar');
    const closeSidebar = document.getElementById('close-sidebar');
    const mainLanding = document.querySelector('main'); 
    const dashboardView = document.getElementById('dashboard-view');
    const logoutBtn = document.getElementById('logout-btn');
    const editProfileForm = document.getElementById('edit-profile-form');
    const deleteAccountBtn = document.getElementById('delete-account-btn');

    // 1. Función para verificar el estado de la sesión
    function verificarSesion() {
        const session = localStorage.getItem('userSession');
        if (session) {
            const user = JSON.parse(session);
            
            if(loginTrigger) loginTrigger.style.display = 'none';
            if(profileTrigger) profileTrigger.style.display = 'flex';
            if(mainLanding) mainLanding.style.display = 'none';
            if(dashboardView) dashboardView.style.display = 'block';

            // Precargar datos en el formulario del perfil
            if(document.getElementById('edit-nombre')) document.getElementById('edit-nombre').value = user.nombre;
            if(document.getElementById('edit-carrera')) document.getElementById('edit-carrera').value = user.carrera || '';
            if(document.getElementById('edit-edad')) document.getElementById('edit-edad').value = user.edad || '';
        } else {
            if(loginTrigger) loginTrigger.style.display = 'block';
            if(profileTrigger) profileTrigger.style.display = 'none';
            if(mainLanding) mainLanding.style.display = 'block';
            if(dashboardView) dashboardView.style.display = 'none';
        }
    }

    // 2. Control del envío del formulario de LOGIN
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const formData = new FormData(loginForm);

            fetch('http://localhost/Trabajopractico3/LOGICA/login.php', {
                method: 'POST',
                body: formData
            })
            .then(res => res.json())
            .then(data => {
                if (data.status === "success") {
                    localStorage.setItem('userSession', JSON.stringify(data.user));
                    alert("Bienvenido al ecosistema: " + data.user.nombre);
                    const modal = document.getElementById('auth-modal');
                    if(modal) modal.style.display = 'none';
                    verificarSesion(); 
                } else {
                    alert("Error: " + data.message);
                }
            })
            .catch(err => console.error("Error en login:", err));
        });
    }

    // 3. APERTURA Y CIERRE DE LA BARRA LATERAL (Aquí estaba el fallo)
    // Usamos condicionales "if" para asegurarnos de que no rompan el código si no encuentran el elemento
    if (profileTrigger && profileSidebar) {
        profileTrigger.addEventListener('click', () => {
            profileSidebar.classList.add('active');
        });
    }

    if (closeSidebar && profileSidebar) {
        closeSidebar.addEventListener('click', () => {
            profileSidebar.classList.remove('active');
        });
    }

    // 4. Acción para CERRAR SESIÓN
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            localStorage.removeItem('userSession');
            if(profileSidebar) profileSidebar.classList.remove('active');
            verificarSesion();
        });
    }

    // 5. Enviar actualización de perfil
    if (editProfileForm) {
        editProfileForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const session = JSON.parse(localStorage.getItem('userSession'));
            const formData = new FormData(editProfileForm);
            formData.append('id_usuario', session.id_usuario);

            fetch('http://localhost/Trabajopractico3/LOGICA/actualizar_perfil.php', {
                method: 'POST',
                body: formData
            })
            .then(res => res.json())
            .then(data => {
                if (data.status === "success") {
                    alert("Datos actualizados correctamente.");
                    session.nombre = document.getElementById('edit-nombre').value;
                    session.carrera = document.getElementById('edit-carrera').value;
                    session.edad = document.getElementById('edit-edad').value;
                    localStorage.setItem('userSession', JSON.stringify(session));
                } else {
                    alert("Error: " + data.message);
                }
            });
        });
    }

    // 6. Acción para INACTIVAR LA CUENTA
    if (deleteAccountBtn) {
        deleteAccountBtn.addEventListener('click', () => {
            if (confirm("¿Estás seguro de que deseas inactivar tu cuenta?")) {
                const session = JSON.parse(localStorage.getItem('userSession'));
                
                fetch('http://localhost/Trabajopractico3/LOGICA/inactivar_cuenta.php', {
                    method: 'POST',
                    headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                    body: `id_usuario=${session.id_usuario}`
                })
                .then(res => res.json())
                .then(data => {
                    if (data.status === "success") {
                        alert("Tu cuenta ha sido dada de baja.");
                        localStorage.removeItem('userSession');
                        if(profileSidebar) profileSidebar.classList.remove('active');
                        verificarSesion();
                    }
                });
            }
        });
    }

    // Ejecutar verificación inicial de sesión
    verificarSesion();


    // ==========================================================================
    // --- MÓDULO INTERACTIVO DE MATERIAS (CONECTADO A LA TABLA INTERMEDIA) ---
    // ==========================================================================
    const manageSubjectsBtn = document.getElementById('manage-subjects-btn');
    const subjectsModal = document.getElementById('subjects-modal');
    const closeSubjectsModal = document.getElementById('close-subjects-modal');
    const addSubjectForm = document.getElementById('add-subject-form');
    const subjectsList = document.getElementById('subjects-list');
    
    // 🔍 CORRECCIÓN: Ahora coincide exactamente con el id="search-materias" de tu HTML
    const searchSubjectInput = document.getElementById('search-materias');

    let listaMateriasGlobal = []; // Guarda las materias en memoria para el buscador

    // A. Abrir y Cerrar Ventana Modal
    if (manageSubjectsBtn) {
        manageSubjectsBtn.addEventListener('click', () => {
            if(subjectsModal) subjectsModal.style.display = 'flex';
            cargarMaterias(); // Llama a la BD al abrir
        });
    }
    if (closeSubjectsModal) {
        closeSubjectsModal.addEventListener('click', () => {
            if(subjectsModal) subjectsModal.style.display = 'none';
        });
    }

    // B. Función para OBTENER las materias del alumno mediante INNER JOIN
    function cargarMaterias() {
        const session = localStorage.getItem('userSession');
        if (!session) return;
        const user = JSON.parse(session);

        fetch(`http://localhost/Trabajopractico3/LOGICA/obtener_materias.php?id_usuario=${user.id_usuario}`)
            .then(res => res.json())
            .then(data => {
                // Filtramos por si acaso la base de datos devuelve nulos o vacíos
                listaMateriasGlobal = data ? data : []; 
                
                // Forzamos el renderizado pasando los datos limpios
                renderizarMaterias(listaMateriasGlobal);
            })
            .catch(err => console.error("Error al traer materias:", err));
    }

    // C. Función para DIBUJAR los elementos (¡No duplica porque mantiene el .innerHTML = '')
    function renderizarMaterias(materias) {
        if (!subjectsList) return;
        subjectsList.innerHTML = ''; 

        if (materias.length === 0) {
            subjectsList.innerHTML = `<li style="text-align:center; color:#888; padding: 20px; list-style: none;">No estás inscrito en ninguna asignatura.</li>`;
            return;
        }

        materias.forEach(materia => {
            const li = document.createElement('li');
            li.className = 'subject-item';
            li.innerHTML = `
                <div class="subject-info">
                    <h5>${materia.nombre}</h5>
                    <span><i class="fas fa-user-tie"></i> Prof: ${materia.docente} | <i class="fas fa-tachometer-alt"></i> Dificultad: ${materia.dificultad_estimada}/5</span>
                </div>
                <button class="btn-delete-item" data-id="${materia.id_materia}" title="Dar de baja">
                    <i class="fas fa-times-circle"></i>
                </button>
            `;
            subjectsList.appendChild(li);
        });

        // Evento para desvincular la relación en la tabla intermedia 'inscripciones'
        document.querySelectorAll('.btn-delete-item').forEach(btn => {
            btn.addEventListener('click', () => {
                const idMateria = btn.getAttribute('data-id');
                inactivarMateria(idMateria);
            });
        });
    }

    // D. Registrar y asociar materia (Con control de alertas nativas)
    if (addSubjectForm) {
        addSubjectForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const session = JSON.parse(localStorage.getItem('userSession'));
            
            const formData = new FormData();
            formData.append('id_usuario', session.id_usuario);
            formData.append('nombre', document.getElementById('sub-name').value);
            formData.append('docente', document.getElementById('sub-teacher').value);
            formData.append('dificultad_estimada', document.getElementById('sub-difficulty').value);

            fetch('http://localhost/Trabajopractico3/LOGICA/agregar_materia.php', {
                method: 'POST',
                body: formData
            })
            .then(res => res.json())
            .then(data => {
                if (data.status === "success") {
                    alert(data.message); // "Materia inscrita correctamente"
                    addSubjectForm.reset();
                    cargarMaterias(); 
                } else {
                    // Aquí saltará el aviso personalizado: "Ya estás inscrito en la materia 'Matemáticas'."
                    alert("Atención: " + data.message); 
                }
            })
            .catch(err => {
                console.error("Error en la petición:", err);
                alert("Hubo un problema de conexión con el servidor.");
            });
        });
    }

    // E. Eliminar la relación en 'inscripciones' sin borrar la materia global
    function inactivarMateria(idMateria) {
        if (confirm("¿Deseas dar de baja esta materia de tu lista del semestre?")) {
            const session = JSON.parse(localStorage.getItem('userSession'));
            const formData = new FormData();
            formData.append('id_materia', idMateria);
            formData.append('id_usuario', session.id_usuario);

            fetch('http://localhost/Trabajopractico3/LOGICA/inactivar_materia.php', {
                method: 'POST',
                body: formData
            })
            .then(res => res.json())
            .then(data => {
                if (data.status === "success") {
                    cargarMaterias(); 
                } else {
                    alert("Error al desvincular la materia.");
                }
            });
        }
    }

    // F. BARRA DE BÚSQUEDA EN TIEMPO REAL (Segura y optimizada)
    if (searchSubjectInput) {
        searchSubjectInput.addEventListener('input', (e) => {
            const textoBusqueda = e.target.value.toLowerCase().trim();
            
            // Si la barra está vacía, muestra todo directamente
            if (textoBusqueda === '') {
                renderizarMaterias(listaMateriasGlobal);
                return;
            }

            const materiasFiltradas = listaMateriasGlobal.filter(materia => 
                materia.nombre && materia.nombre.toLowerCase().includes(textoBusqueda)
            );
            
            renderizarMaterias(materiasFiltradas);
        });
    }


    // ==========================================================================
    // --- G. EXPORTACIÓN A PDF (IMPRESIÓN) ---
    // ==========================================================================
    const btnPrintSubjects = document.getElementById('btn-print-subjects');

    if (btnPrintSubjects) {
        btnPrintSubjects.addEventListener('click', () => {
            // 1. Verificamos que haya datos para imprimir
            if (listaMateriasGlobal.length === 0) {
                alert("No tienes materias inscritas para exportar.");
                return;
            }

            // 2. Abrimos una pestaña temporal oculta en el navegador
            const printWindow = window.open('', '_blank', 'width=900,height=600');

            // 3. Construimos el diseño del PDF usando HTML y CSS clásico.
            // Esto asegura que al imprimir, se vea como una tabla formal en blanco y negro (o color).
            let htmlTemplate = `
            <!DOCTYPE html>
            <html lang="es">
            <head>
                <meta charset="UTF-8">
                <title>Reporte de Materias - EduMetrics</title>
                <style>
                    body { 
                        font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; 
                        padding: 40px; 
                        color: #333; 
                    }
                    h2 { 
                        text-align: center; 
                        color: #2c3e50; 
                        margin-bottom: 30px;
                        text-transform: uppercase;
                        letter-spacing: 1px;
                    }
                    table { 
                        width: 100%; 
                        border-collapse: collapse; 
                        margin-top: 10px; 
                    }
                    th, td { 
                        border: 1px solid #bdc3c7; 
                        padding: 12px 15px; 
                        text-align: left; 
                    }
                    th { 
                        background-color: #ecf0f1; 
                        color: #2c3e50; 
                        font-weight: bold; 
                    }
                    tr:nth-child(even) { 
                        background-color: #f9f9f9; 
                    }
                </style>
            </head>
            <body>
                <h2>Mis Materias del Semestre</h2>
                <table>
                    <thead>
                        <tr>
                            <th>Materia</th>
                            <th>Docente / Profesor</th>
                            <th>Dificultad</th>
                        </tr>
                    </thead>
                    <tbody>
            `;

            // 4. Recorremos nuestro array de materias y creamos una fila (<tr>) por cada una.
            // Separamos los datos en columnas (<td>).
            listaMateriasGlobal.forEach(materia => {
                htmlTemplate += `
                        <tr>
                            <td><strong>${materia.nombre}</strong></td>
                            <td>${materia.docente}</td>
                            <td>Nivel ${materia.dificultad_estimada} de 5</td>
                        </tr>
                `;
            });

            // 5. Cerramos las etiquetas HTML y añadimos el script que detona la impresión.
            htmlTemplate += `
                    </tbody>
                </table>
                <script>
                    // Cuando esta pestaña virtual termine de cargar la tabla, lanza el menú de PDF
                    window.onload = function() {
                        window.print();
                    }
                </script>
            </body>
            </html>
            `;

            // 6. Inyectamos todo este código en la nueva pestaña y la cerramos virtualmente
            // para que el navegador procese el renderizado y lance el cuadro de diálogo.
            printWindow.document.open();
            printWindow.document.write(htmlTemplate);
            printWindow.document.close();
        });
    }


});