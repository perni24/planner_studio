from flask import Flask, send_from_directory, jsonify, request
import json

# CREAZIONE DELL'APPLICAZIONE FLASK
# __name__: dice a Flask dove cercare le risorse.
# static_folder='../frontend': imposta la cartella dove Flask cerca i file statici (HTML, CSS, JS).
# static_url_path='': permette di accedere ai file statici direttamente (es. /style.css invece di /static/style.css).
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

    tasks.append(nuovaTask)

    with open(nomeFile, 'w', encoding='utf-8') as file:
        json.dump(tasks, file, indent=4, ensure_ascii=False)

    return jsonify({"messaggio": "Task inserita!", "id_assegnato": nuovo_id}), 201


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

        # Salvataggio la lista aggiornata
        with open(nomeFile, 'w', encoding='utf-8') as file:
            json.dump(nuove_materie, file, indent=4, ensure_ascii=False)
            
        return jsonify({"messaggio": "Materia eliminata con successo"}), 200
    
    except (FileNotFoundError, json.JSONDecodeError):
        return jsonify({"errore": "File non trovato"}), 500


# AVVIO DEL SERVER
# if __name__ == '__main__': assicura che il server parta solo se eseguiamo questo file direttamente.
if __name__ == '__main__':
    # debug=True: attiva il riavvio automatico se modifichi il codice e mostra errori dettagliati.
    app.run(debug=True)
