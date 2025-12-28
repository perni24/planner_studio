//#region Global Variables
let modal;
let closeBtn;
let addMateriaBtn;
let addTaskBtn;
let modalTitle;
let modalBody;
let listaMaterie;
let listaTask;
let materiaSelezionata = {}
//#endregion

//#region Modal Logic
function openModal(title) {
    if (modalTitle) modalTitle.textContent = title;
    if (modal) modal.style.display = 'block';
    
    if (title.includes("Materia") && modalBody){
        modalBody.innerHTML = `
            <label for="materia-nome">Nome Materia</label>
            <input type="text" id="materia-nome" placeholder="es. Matematica" required autocomplete="off">
            <label for="materia-colore">Colore Materia</label>
            <input type="color" id="materia-colore" value="#007bff" required>
            <button id="save-materia-btn">Salva Materia</button>
        `;

        let saveBtn = document.getElementById('save-materia-btn');
        if (saveBtn) {
            saveBtn.addEventListener('click', () => {
                insertMateria();
                closeModal();
            });
        }
    } else {
        modalBody.innerHTML = `
            <label for="task-materia">Materia</label>
            <select id="task-materia" required>
                <option value="" disabled selected>Seleziona una materia</option>
            </select>

            <label for="task-nome">Titolo Task</label>
            <input type="text" id="task-nome" placeholder="es. Verifica Funzioni" required autocomplete="off">

            <label for="task-desc">Descrizione</label>
            <textarea id="task-desc" placeholder="Dettagli dello studio..."></textarea>

            <label for="task-pagine">Pagine</label>
            <input type="number" id="task-pagine" placeholder="0">


            <div class="input-group">
                <div>
                    <label for="task-inizio">Data Inizio</label>
                    <input type="date" id="task-inizio">
                </div>
                <div>
                    <label for="task-fine">Data Fine</label>
                    <input type="date" id="task-fine" required>
                </div>
            </div>

            <button id="save-task-btn">Salva Task</button>
        `;
        
        // Popola il selettore delle materie
        fetch("/getMaterie")
            .then(response => response.json())
            .then(materie => {
                const select = document.getElementById('task-materia');
                materie.forEach(m => {
                    const option = document.createElement('option');
                    option.value = m.id;
                    option.textContent = m.materia;
                    select.appendChild(option);
                });
                if (materiaSelezionata && materiaSelezionata.id) {
                    select.value = materiaSelezionata.id;
                }
            });

        let saveBtn = document.getElementById('save-task-btn');
        if (saveBtn) {
            saveBtn.addEventListener('click', () => {
                insertTask();
                closeModal();
            });
        }
    }
}

function closeModal() {
    if (modal) modal.style.display = 'none';
}
//#endregion

//#region chiamate API

function getMaterie(){
    fetch("/getMaterie")
    .then(response => response.json())
    .then(data => {
        colonnaMaterie(data)
    })
    .catch(error => console.error('Errore:', error));
}

function getTask(id, colore){
    fetch("/getTask")
    .then(response => response.json())
    .then(data => {
        materiaSelezionata = {id: id, colore: colore}
        colonnaTask(data.filter(item => item.id_materia == id))
    })
    .catch(error => console.error('Errore:', error));
}

function insertMateria() {
    let nomeMateria = document.getElementById('materia-nome').value; 
    let coloreMateria = document.getElementById('materia-colore').value;

    // Creiamo l'oggetto con i dati da inviare
    const datiDaInviare = {
        materia: nomeMateria,
        colore: coloreMateria
    };

    fetch("/insertMateria", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(datiDaInviare) 
    })
    .then(response => response.json())
    .then(data => {
        if (data.id_assegnato) {
            console.log(data.id_assegnato)
            getMaterie()
        }
    })
    .catch(error => console.error('Errore:', error));
}

function insertTask(){

    let idMateria = document.getElementById("task-materia").value
    let titolo = document.getElementById("task-nome").value
    let descrizione = document.getElementById("task-desc").value
    let dataInizio = document.getElementById("task-inizio").value
    let dataFine = document.getElementById("task-fine").value
    let pagine = document.getElementById("task-pagine").value

    const datiTask = {
        id_materia: parseInt(idMateria),
        titolo: titolo,
        descrizione: descrizione,
        data_inizio: dataInizio,
        data_fine: dataFine,
        pagine: parseInt(pagine)
    }

    console.log(datiTask)
}

//#endregion

//#region funzioni

function colonnaMaterie(materie){
    let html = ``
    materie.forEach(item => {
        html += `
            <div class="card" data-id="${item.id}" data-colore="${item.colore}" onclick="getTask(this.dataset.id, this.dataset.colore)">
                <div class="color-indicator" style="background-color: ${item.colore}"></div>
                <p>${item.materia}</p>
            </div>
        `
    });
    listaMaterie.innerHTML = html;
}

function colonnaTask(task){
    let html = ``
    task.forEach(item => {
        html += `
            <div class="card" data-id="${item.id}">
                <div class="color-indicator" style="background-color: ${materiaSelezionata.colore}"></div>
                <p>${item.titolo}</p>
                <p>${item.data_inizio == undefined ? "" : item.data_inizio + " - "}${item.data_fine}</p>
            </div>
        `
    });
    listaTask.innerHTML = html;
}



//#endregion

//#region Initialization & Events
document.addEventListener('DOMContentLoaded', () => {
    // Init DOM Elements
    modal = document.getElementById('modal');
    closeBtn = document.querySelector('.close-btn');
    addMateriaBtn = document.getElementById('add-materia-btn');
    addTaskBtn = document.getElementById('add-task-btn');
    modalTitle = document.getElementById('modal-title');
    modalBody = document.getElementById('modal-body');
    listaMaterie = document.getElementById('materie-list');
    listaTask = document.getElementById('task-list');

    // Event Listeners
    if (addMateriaBtn) {
        addMateriaBtn.addEventListener('click', () => {
            openModal('Aggiungi Materia');
        });
    }

    if (addTaskBtn) {
        addTaskBtn.addEventListener('click', () => {
            openModal('Aggiungi Task');
        });
    }

    if (closeBtn) {
        closeBtn.addEventListener('click', closeModal);
    }

    // Close modal if clicked outside of content
    window.addEventListener('click', (event) => {
        if (event.target == modal) {
            closeModal();
        }
    });

    getMaterie()
});
//#endregion