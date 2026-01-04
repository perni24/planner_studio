from flask import Flask, send_from_directory, jsonify, request
import json
import sys
import os
import webbrowser

# CREAZIONE DELL'APPLICAZIONE FLASK
# __name__: dice a Flask dove cercare le risorse.
# static_folder='../frontend': imposta la cartella dove Flask cerca i file statici (HTML, CSS, JS).
# static_url_path='': permette di accedere ai file statici direttamente (es. /style.css invece di /static/style.css).
if getattr(sys, 'frozen', False):
    # Se siamo nell'eseguibile, usa la cartella temporanea interna
    base_path = sys._MEIPASS
    app = Flask(__name__, static_folder=os.path.join(base_path, 'frontend'), static_url_path='')
else:
    # Se siamo in sviluppo (Python normale), usa il percorso relativo
    app = Flask(__name__, static_folder='../frontend', static_url_path='')

# DEFINIZIONE DELLA ROTTA PRINCIPALE (HOME PAGE)
# @app.route('/'): decoratore che collega l'URL radice (http://localhost:5000/) a questa funzione.
@app.route('/')
def index():
    # send_from_directory: funzione sicura per inviare file da una cartella specifica.
    # Restituisce 'index.html' dalla cartella 'frontend' configurata sopra.
    return send_from_directory(app.static_folder, 'index.html')

@app.route('/getMaterie', methods=['GET'])
def getMaterie():
    nomeFile = 'materie.json'
    try:
        # 1. Apri il file in modalità lettura ('r')
        with open(nomeFile, 'r', encoding='utf-8') as file:
            # 2. Trasforma il contenuto del file in una lista/dizionario Python
            dati = json.load(file)
        
        # 3. Restituisci i dati trasformati in formato JSON per il web
        return jsonify(dati)
    
    except FileNotFoundError:
        # Se il file non esiste ancora, restituisci una lista vuota
        with open(nomeFile, 'w', encoding='utf-8') as file:
            json.dump([], file)
        return jsonify([])
    
@app.route('/getTask', methods=['GET'])
def getTask():
    nomeFile = 'task.json'
    try:
        # 1. Apri il file in modalità lettura ('r')
        with open(nomeFile, 'r', encoding='utf-8') as file:
            # 2. Trasforma il contenuto del file in una lista/dizionario Python
            dati = json.load(file)
        
        # 3. Restituisci i dati trasformati in formato JSON per il web
        return jsonify(dati)
    
    except FileNotFoundError:
        # Se il file non esiste ancora, restituisci una lista vuota
        with open(nomeFile, 'w', encoding='utf-8') as file:
            json.dump([], file)
        return jsonify([])

@app.route('/insertMateria', methods=['POST'])
def insertMateria():
    nuovaMateria = request.get_json()
    nomeFile = 'materie.json'

    if not nuovaMateria: 
        return jsonify({"errore": "Dati non validi"}), 400
    
    try:
        with open(nomeFile, 'r', encoding='utf-8') as file:
            materie = json.load(file)
    except (FileNotFoundError, json.JSONDecodeError):
        materie = []

    # --- LOGICA PER L'ID INCREMENTALE ---
    if materie:
        nuovo_id = materie[-1]['id'] + 1
    else:
        nuovo_id = 1
    
    nuovaMateria['id'] = nuovo_id
    # ------------------------------------

    materie.append(nuovaMateria)

    with open(nomeFile, 'w', encoding='utf-8') as file:
        json.dump(materie, file, indent=4, ensure_ascii=False)

    return jsonify({"messaggio": "Materia inserita!", "id_assegnato": nuovo_id}), 201

@app.route('/insertTask', methods=['POST'])
def insertTask():
    nuovaTask = request.get_json()
    nomeFile = 'task.json'

    try:
        with open(nomeFile, 'r', encoding='utf-8') as file:
            tasks = json.load(file)
    except (FileNotFoundError, json.JSONDecodeError):
        tasks = []
    
    # --- LOGICA PER L'ID INCREMENTALE ---
    if tasks:
        nuovo_id = tasks[-1]['id'] + 1
    else:
        nuovo_id = 1
    
    nuovaTask['id'] = nuovo_id
    nuovaTask['pagine_completate'] = 0
    nuovaTask['fine_task_giornaliera'] = ""

    tasks.append(nuovaTask)

    with open(nomeFile, 'w', encoding='utf-8') as file:
        json.dump(tasks, file, indent=4, ensure_ascii=False)

    return jsonify({"messaggio": "Task inserita!", "id_assegnato": nuovo_id}), 201

@app.route('/updatePagine/<int:materiaId>', methods=['POST'])  
def updatePagine(materiaId):
    nomeFile = 'task.json'
    pagineCompletate = request.get_json()

    try:
        with open(nomeFile, 'r', encoding='utf-8') as file:
            task = json.load(file)

            for t in task:
                if t['id'] == materiaId:
                    t['pagine_completate'] += int(pagineCompletate.get('pagine_completate', 0))
                    t["fine_task_giornaliera"] = pagineCompletate.get('fine_task_giornaliera','')
            
            with open(nomeFile, 'w', encoding='utf-8') as file:
                json.dump(task, file, indent=4, ensure_ascii=False)
            
        return jsonify({"messaggio": "Pagine completate aggiornate con successo"}), 200
    except (FileNotFoundError, json.JSONDecodeError):
        return jsonify({"errore": "File non trovato"}), 500

@app.route('/updateTask/<int:materiaId>', methods=['PUT'])
def updateTask(materiaId): 

    nomeFile = 'task.json'
    datiTask =  request.get_json()

    try:
        with open(nomeFile, 'r', encoding='utf-8') as file:
            task = json.load(file)
            for t in task:
                if t['id'] == materiaId:
                    t['id_materia'] = int(datiTask.get('id_materia', t['id_materia']))
                    t['titolo'] = datiTask.get('titolo', t['titolo'])
                    t['descrizione'] = datiTask.get('descrizione', t['descrizione'])
                    t['data_inizio'] = datiTask.get('data_inizio', t['data_inizio'])
                    t['data_fine'] = datiTask.get('data_fine', t['data_fine'])
                    t['pagine'] = int(datiTask.get('pagine', t['pagine']))
            
            with open(nomeFile, 'w', encoding='utf-8') as file:
                json.dump(task, file, indent=4, ensure_ascii=False)

            return jsonify({"messaggio": "Task aggiornata con successo"}), 200
    except (FileNotFoundError, json.JSONDecodeError):
        return jsonify({"errore": "File non trovato"}), 500


@app.route('/deleteMateria/<int:materiaId>', methods=['DELETE'])  
def deleteMateria(materiaId):
    nomeFile = 'materie.json'

    try:
        with open(nomeFile, 'r', encoding='utf-8') as file:
            materie = json.load(file)

        nuove_materie = []
        #eliminazione dell'elemento dalla lista
        for m in materie:
            if m['id'] != materiaId:
                nuove_materie.append(m)

        deleteAllTask(materiaId)

        # Salvataggio la lista aggiornata
        with open(nomeFile, 'w', encoding='utf-8') as file:
            json.dump(nuove_materie, file, indent=4, ensure_ascii=False)
            
        return jsonify({"messaggio": "Materia eliminata con successo"}), 200
    
    except (FileNotFoundError, json.JSONDecodeError):
        return jsonify({"errore": "File non trovato"}), 500

@app.route('/deleteTask/<int:materiaId>', methods=['DELETE'])
def deleteTask(materiaId):
    nomeFile = 'task.json'
    try:
        with open(nomeFile, 'r', encoding='utf-8') as file:
            task= json.load(file)
        
        nuove_task = []
        for t in task:
            if t['id'] != materiaId:
                nuove_task.append(t)

        with open(nomeFile, 'w', encoding='utf-8') as file:
            json.dump(nuove_task, file, indent=4, ensure_ascii=False)
            
        return jsonify({"messaggio": "Task eliminata con successo"}), 200

    except (FileNotFoundError, json.JSONDecodeError):
        return jsonify({"errore": "File non trovato"}), 500

def deleteAllTask(id_materia):
    nomeFile = 'task.json'
    try:
        with open(nomeFile, 'r', encoding='utf-8') as file:
            task= json.load(file)
        
        nuove_task = []
        for t in task:
            if t['id_materia'] != id_materia:
                nuove_task.append(t)

        with open(nomeFile, 'w', encoding='utf-8') as file:
            json.dump(nuove_task, file, indent=4, ensure_ascii=False)
            
        return jsonify({"messaggio": "Task eliminata con successo"}), 200

    except (FileNotFoundError, json.JSONDecodeError):
        return jsonify({"errore": "File non trovato"}), 500

# AVVIO DEL SERVER
# if __name__ == '__main__': assicura che il server parta solo se eseguiamo questo file direttamente.
if __name__ == '__main__':
    # debug=True: attiva il riavvio automatico se modifichi il codice e mostra errori dettagliati.
    if not os.environ.get("WERKZEUG_RUN_MAIN"):
        webbrowser.open_new('http://127.0.0.1:5000/')
    app.run(debug=True)
