from flask import Flask, request
from flask import render_template
app = Flask(__name__)

def is_empty(value):
    if value is None:
        return True
    if isinstance(value, (str, list, tuple, set, dict)):
        return len(value) == 0
    return False

@app.route('/ecgviewer', methods = ["GET"])
def ecgviewer():
    return render_template('Viewer.html')
    
@app.route('/SearchPat', methods = ["POST"])
def SearchPat():
    import json
    requestBody = json.loads(request.data)
    api_url = requestBody['serverURL'] + '/Patient'
    if is_empty(requestBody['idenValue']) is False: 
        api_url += '?identifier=' + requestBody['idenValue']
        if is_empty(requestBody['organization']) is False: 
            api_url += '&organization=' + requestBody['organization']
    else:
        if is_empty(requestBody['organization']) is False: 
            api_url += '?organization=' + requestBody['organization']
    headers = {'Authorization': 'Bearer ' + requestBody['bearerToken']}
    import requests
    pats = requests.get(api_url, headers=headers).json()
    patID = []
    if 'entry' in pats: 
        for pat in pats['entry']:
            patID.append(pat['resource']['id'])
    else:
        patID.append("Not Found！")
    return {'patID': patID}

@app.route('/SearchObservSubject', methods = ["POST"])
def SearchObservSubject():
    import json
    requestBody = json.loads(request.data)

    api_url = ( requestBody['serverURL'] + '/Observation' + 
            '?subject=' + requestBody['subject'] +
            '&code=131328' )
    headers = {'Authorization': 'Bearer ' + requestBody['bearerToken']}
    import requests
    observs = requests.get(api_url, headers=headers).json()
    dateTime =[]
    if 'entry' in observs: 
        for observ in observs['entry']:
            dateTime.append(observ['resource']['effectiveDateTime'])
    else:
        dateTime.append("Not Found！")

    return {'dateTime': dateTime}

@app.route('/SearchObservDateTime', methods = ["POST"])
def SearchObservDateTime():
    import json
    requestBody = json.loads(request.data)

    api_url = ( requestBody['serverURL'] + '/Observation' + 
            '?subject=' + requestBody['subject'] +
            '&code=131328' + 
            '&date=' + requestBody['dateTime'])
    headers = {'Authorization': 'Bearer ' + requestBody['bearerToken']}
    import requests
    observs = requests.get(api_url, headers=headers).json()
    component =[]
    if 'entry' in observs: 
        for observ in observs['entry']:
            for comp in observ['resource']['component']:
                component.append(comp)
    return {'component': component}

app.run(port=8051, host='0.0.0.0')