//#region Global Variables
let modal;
let closeBtn;
let addMateriaBtn;
let addTaskBtn;
let modalTitle;
let modalBody;
let listaMaterie;
let listaTask;
let materiaSelezionata = {};
let taskSelezionata;
let giornoCalendario = new Date();
let allTask;
let allMaterie;
let alltaskScadute = [];
let versione;
//#endregion

//#region Modal Logic
function openModal(title) {
    if (modalTitle) modalTitle.textContent = title;
    if (modal) modal.style.display = 'block';
    
    if (title.includes("Aggiungi Materia") && modalBody){
        modalBody.innerHTML = `
            <form id="add-materia-form" style="display: flex; flex-direction: column; gap: 15px;">
                <label for="materia-nome">Nome Materia</label>
                <input type="text" id="materia-nome" placeholder="es. Matematica" required autocomplete="off">
                <label for="materia-colore">Colore Materia</label>
                <input type="color" id="materia-colore" value="#007bff" required>
                <button type="submit" id="save-materia-btn">Salva Materia</button>
            </form>
        `;
        
        let form = document.getElementById('add-materia-form');
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                insertMateria();
                closeModal();
            });
        }
    } else if(title.includes("Aggiungi Task") && modalBody){
        modalBody.innerHTML = `
            <form id="add-task-form" style="display: flex; flex-direction: column; gap: 15px;">
                <label for="task-materia">Materia</label>
                <select id="task-materia" required>
                    <option value="" disabled selected>Seleziona una materia</option>
                </select>

                <label for="task-nome">Titolo Task</label>
                <input type="text" id="task-nome" placeholder="es. Verifica Funzioni" required autocomplete="off">

                <label for="task-desc">Descrizione</label>
                <textarea id="task-desc" placeholder="Dettagli dello studio..."></textarea>

                <label for="task-pagine">Pagine</label>
                <input type="number" id="task-pagine" placeholder="0" required>


                <div class="input-group">
                    <div>
                        <label for="task-inizio">Data Inizio</label>
                        <input type="date" id="task-inizio" required>
                    </div>
                    <div>
                        <label for="task-fine">Data Fine</label>
                        <input type="date" id="task-fine" required>
                    </div>
                </div>

                <button type="submit" id="save-task-btn">Salva Task</button>
            </form>
        `;
        
        const select = document.getElementById('task-materia');
        
        allMaterie.forEach(materia => {
            const option = document.createElement('option');
            option.value = materia.id
            option.textContent = materia.materia;
            select.appendChild(option);
        })
        if (materiaSelezionata && materiaSelezionata.id) {
            select.value = materiaSelezionata.id;
        }

        let form = document.getElementById('add-task-form');
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                insertTask();
                closeModal();
            });
        }
    }else if(title.includes("Riepilogo Task") && modalBody){
        let task = allTask.find(item => item.id == taskSelezionata)
        modalBody.innerHTML = `
            <label for="task-materia">Materia</label>
            <select id="task-materia" required>
                <option value="" disabled selected>Seleziona una materia</option>
            </select>

            <label for="task-nome">Titolo Task</label>
            <input type="text" id="task-nome" placeholder="es. Verifica Funzioni" required autocomplete="off" value="${task.titolo}">

            <label for="task-desc">Descrizione</label>
            <textarea id="task-desc" placeholder="Dettagli dello studio...">${task.descrizione}</textarea>

            <label for="task-pagine">Pagine</label>
            <input type="number" id="task-pagine" placeholder="0" value=${task.pagine}>


            <div class="input-group">
                <div>
                    <label for="task-inizio">Data Inizio</label>
                    <input type="date" id="task-inizio" required value=${task.data_inizio}>
                </div>
                <div>
                    <label for="task-fine">Data Fine</label>
                    <input type="date" id="task-fine" required value=${task.data_fine}>
                </div>
            </div>
            <div class="modal-footer">
                <button id="update-task-btn">Aggiorna Task</button>
                <button id="delete-task-btn" class="btn-danger">Cancella Task</button>
            </div>
        `;

        const select = document.getElementById('task-materia');

        allMaterie.forEach(materia => {
            const option = document.createElement('option');
            option.value = materia.id
            option.textContent = materia.materia;
            select.appendChild(option);
        })
        if (materiaSelezionata && materiaSelezionata.id && !taskSelezionata) {
            select.value = materiaSelezionata.id;
        }
        if(taskSelezionata){
            select.value = allTask.find(item => item.id == taskSelezionata).id_materia;
        }

        let updateBtn = document.getElementById('update-task-btn');
        let deleteBtn = document.getElementById('delete-task-btn');
        if (updateBtn) {
            updateBtn.addEventListener('click', () => {
                updateTask();
                closeModal();
            });
        }
        if (deleteBtn){
            deleteBtn.addEventListener('click', () => {
                deleteTask();
                closeModal();
            });
        }
    }
    else if(title.includes("Pagine Completate") && modalBody){
        modalBody.innerHTML = `
            <p class="modal-subtitle">${allTask.find(item => item.id == taskSelezionata).titolo}</p>
            <label for="pagine-completate">Pagine completate</label>
            <input type="number" id="pagine-completate" required autocomplete="off" value=0>
            
            <div class="checkbox-container">
                <input type="checkbox" id="check-fine-task">
                <label for="check-fine-task">Fine task giornaliera</label>
            </div>
            
            <button id="save-pagine-completate">Salva</button>
        `

        let saveBtn = document.getElementById('save-pagine-completate');
        if (saveBtn) {
            saveBtn.addEventListener('click', () => {
                updatePagineCompletate();
                closeModal();
            });
        }
    }else if(title.includes("Conferma eliminazione") && modalBody){
        modalBody.innerHTML = `
                <button id="delete-materia-btn" class="btn-danger">Si</button>
        `

        let deleteBtn = document.getElementById('delete-materia-btn');
        if(deleteBtn){
            deleteBtn.addEventListener('click', () => {
                deleteMateria()
                closeModal();
            })
        }
    }else if(title.includes("Errori task") && modalBody){
        let html = ``
        alltaskScadute.forEach(item => {
                html += `
                <div class="card" onclick="clickTask(${item.id},1)">
                    <div class="color-indicator" style="background-color: ${allMaterie.find(val => val.id == item.id_materia).colore}"></div>
                    <p>${item.titolo.charAt(0).toUpperCase() + item.titolo.slice(1)}</p>
                </div>
                `
        })
        modalBody.innerHTML = html
    }else if(title.includes("Nuova versione") && modalBody){
        modalBody.innerHTML = `
            <p>È disponibile una nuova versione di Planner Studio. Visita il repository GitHub per scaricarla.</p>
            <a href="https://github.com/perni24/planner_studio/releases/tag/${versione}">Vai a GitHub</a>
        `
    }
}

function closeModal() {
    if (modal) modal.style.display = 'none';
}
//#endregion

//#region chiamate API

function getVersion(){
    fetch("/getVersion")
    .then(response => response.json())
    .then(data => {
        versione = data.versione
        if (data.nuova_versione){
            openModal("Nuova versione")
            if(document.getElementById("version-display")){
                document.getElementById("version-display").textContent = versione;
            }
        }else{
            if(document.getElementById("version-display")){
                document.getElementById("version-display").textContent = versione;
            }
        }
        
    })
    .catch(error => console.error('Errore:', error));
}

function getMaterie(){
    fetch("/getMaterie")
    .then(response => response.json())
    .then(data => {
        allMaterie = data;
        colonnaMaterie(data)
    })
    .catch(error => console.error('Errore:', error));
}

function getTask(){
    fetch("/getTask")
    .then(response => response.json())
    .then(data => {
        allTask = data;
        taskGiornaliere();
        if(materiaSelezionata){
            colonnaTask(allTask.filter(item => item.id_materia == materiaSelezionata.id))
        }
        taskScadute()
    })
    .catch(error => console.error('Errore:', error));
}

function insertMateria() {
    let nomeMateria = document.getElementById('materia-nome').value; 
    let coloreMateria = document.getElementById('materia-colore').value;

    // Creiamo l'oggetto con i dati da inviare
    const datiMateria = {
        materia: nomeMateria,
        colore: coloreMateria
    };

    fetch("/insertMateria", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(datiMateria) 
    })
    .then(response => response.json())
    .then(data => {
        if (data.id_assegnato) {
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

    fetch("/insertTask", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(datiTask)

    })
    .then(response => response.json())
    .then(data => {
        getTask()
    })
    .catch(error => console.error('Errore:', error));
}

function updatePagineCompletate(){
    let pagineCompletate = document.getElementById("pagine-completate")
    let checkBox = document.getElementById("check-fine-task")

    const pagine = {
        pagine_completate : pagineCompletate.value,
        fine_task_giornaliera: checkBox.checked == true ? new Date().toISOString().split('T')[0] : ""
    }

    fetch("/updatePagine/"+taskSelezionata, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(pagine)
    })
    .then(response => response.json())
    .then(data => {
        getTask()
    })
    .catch(error => console.error('Errore:', error));
}

function updateTask(){
    
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

    fetch("/updateTask/"+taskSelezionata, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(datiTask)
    })
    .then(response => response.json())
    .then(data => {
        getTask()
    })
    .catch(error => console.error('Errore:', error));
}

function deleteTask(){

    fetch("/deleteTask/"+taskSelezionata, {
        method: "DELETE",
    })
    .then(response => response.json())
    .then(data => {
        getTask()
    })
    .catch(error => console.error('Errore:', error));

}

function deleteMateria(){

    fetch("/deleteMateria/"+materiaSelezionata.id, {
        method: "DELETE",
    })
    .then(response => response.json())
    .then(data => {
        getMaterie()
        listaTask.innerHTML = ""  
    })
    .catch(error => console.error('Errore:', error));
}

//#endregion

//#region funzioni

function clickMateria(id, colore){
    materiaSelezionata = {id: id, colore: colore}
    colonnaTask(allTask.filter(item => item.id_materia == id))
}

function clickTask(id, tipo){
    taskSelezionata = id
    if(tipo == 1){
        openModal("Riepilogo Task")
    }else if(tipo == 2 && giornoCalendario.toDateString() === new Date().toDateString()){
        openModal("Pagine Completate")
    }
}


function colonnaMaterie(materie){
    let html = ``
    materie.forEach(item => {
        html += `
            <div class="card" data-id="${item.id}" data-colore="${item.colore}" onclick="clickMateria(this.dataset.id, this.dataset.colore)">
                <div class="color-indicator" style="background-color: ${item.colore}"></div>
                <p>${item.materia.charAt(0).toUpperCase() + item.materia.slice(1)}</p>
                <button class="delete-btn" onclick="openModal('Conferma eliminazione')">&times;</button>
            </div>
        `
    });
    listaMaterie.innerHTML = html;
}

function colonnaTask(task){
    let html = ``
    task.forEach(item => {
        let pagineRimanenti = item.pagine - item.pagine_completate;
        html += `
            <div class="card" onclick="clickTask(${item.id},1)">
                <div class="color-indicator" style="background-color: ${materiaSelezionata.colore}"></div>
                <div class="card-content">
                    <p class="task-title">${item.titolo.charAt(0).toUpperCase() + item.titolo.slice(1)}</p>
                    <div class="task-details">
                        <span>Pagine: ${item.pagine_completate}/${item.pagine} (${pagineRimanenti} rim.)</span>
                        <span class="task-date">Scadenza: ${item.data_fine.split('-').reverse().join('/')}</span>
                    </div>
                </div>
            </div>
        `
    });
    listaTask.innerHTML = html;
}

function giorniCalendario(i){

    let calendario = document.getElementById("current-day-display")

    if(i == 0){

        let giornoSettimana = giornoCalendario.toLocaleString('it-IT', { weekday: 'long' });
        let giornoMese = giornoCalendario.getDate() + " " + giornoCalendario.toLocaleString('it-IT', { month: 'long' })

        calendario.innerHTML = `
            <span id="day-name">${giornoSettimana}</span>
            <span id="day-number">${giornoMese}</span>
        `
    }else{

        giornoCalendario.setDate(giornoCalendario.getDate() + i)
        let giornoSettimana = giornoCalendario.toLocaleString('it-IT', { weekday: 'long' });
        let giornoMese = giornoCalendario.getDate() + " " + giornoCalendario.toLocaleString('it-IT', { month: 'long' })

        calendario.innerHTML = `
            <span id="day-name">${giornoSettimana}</span>
            <span id="day-number">${giornoMese}</span>
        `

    }

    taskGiornaliere()
    
}

function taskGiornaliere(){
    if (!allTask) return; // Evita errori se i dati non sono ancora caricati

    let html = ``
    // Normalizziamo il giorno del calendario a mezzanotte per il confronto
    let checkDay = new Date(giornoCalendario);
    checkDay.setHours(0, 0, 0, 0);

    let today = new Date();
    today.setHours(0, 0, 0, 0);

    allTask.forEach(item => {
        let start = new Date(item.data_inizio);
        start.setHours(0, 0, 0, 0);
        
        let end = new Date(item.data_fine);
        end.setHours(0, 0, 0, 0);

        let fineTask = new Date(item.fine_task_giornaliera);
        fineTask.setHours(0, 0, 0, 0);

        let diff

        if (checkDay >= start && checkDay <= end && checkDay >= today && checkDay.getTime() != fineTask.getTime()){
            
            diff = Math.round((end - checkDay) / (1000 * 60 * 60 * 24))+1;
            let coloreTask = allMaterie.find(m => m.id === item.id_materia).colore;
            let pagineOggi = pagineGiornaliere(item.pagine, diff, item.pagine_completate)[0];
            
            html +=`
                <div class="card" onclick="clickTask(${item.id},2)">
                    <div class="color-indicator" style="background-color: ${coloreTask}"></div>
                    <div class="card-content">
                        <p class="task-title">${item.titolo.charAt(0).toUpperCase() + item.titolo.slice(1)}</p>
                        <div class="task-details">
                            <span>${today.getTime() == checkDay.getTime() ? "Da completare oggi: ":"Pagine stimate: "} <strong>${pagineOggi} pagine</strong></span>
                        </div>
                    </div>
                </div>
            ` 
        }

    })
    document.getElementById("task-giornaliere").innerHTML = html

}

function pagineGiornaliere(pagine, giorni, pagine_completate){
    let arrPagineGiorno = []
    pagine = pagine - pagine_completate
    arrPagineGiorno.push(Math.ceil(pagine/giorni))

    return arrPagineGiorno
}

function taskScadute(){
    alltaskScadute = []
    let num = document.getElementById("num-task-scadute")
    allTask.forEach(item => {
        if(new Date().toISOString().split('T')[0] > new Date(item.data_fine).toISOString().split('T')[0]){
            alltaskScadute.push(item)
        }
    })

    num.innerHTML = alltaskScadute.length
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
    getTask()
    giorniCalendario(0)
    getVersion()

    // Invia un segnale di heartbeat al server ogni secondo
    setInterval(() => {
        fetch("/heartbeat", { method: "POST" })
        .catch(error => console.log("Server disconnesso"));
    }, 1000);
});
//#endregion