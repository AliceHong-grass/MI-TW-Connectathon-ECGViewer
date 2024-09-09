var seconds = 10;       // 25 小格/sec = 5 大格/sec
var bigGridW = 5 * seconds + 2;
var smallGridW = 5 * bigGridW;
var milliVoltage = 6;   // 10 小格/mV = 2 大格/mV
var bigGridH = 2 * milliVoltage;
var smallGridH = 5 * bigGridH;

document.addEventListener("DOMContentLoaded", function(){
    var canvas = document.querySelectorAll("canvas");
    canvas.forEach((canva)=> initCanvas(canva.id));
}); 

function initCanvas(id) {
    var canvas = document.getElementById(id);

    var width = canvas.offsetWidth;
    canvas.width = canvas.offsetWidth ;
    var height = (width / bigGridW) * bigGridH;
    canvas.height = height;

    var bigGrid = width/bigGridW;
    var smallGrid = width/smallGridW;

    var context = canvas.getContext("2d");
    context.setTransform(1, 0, 0, -1, 0, height);
    context.clearRect(0, 0, width, height);
    context.strokeStyle = 'red';
    context.lineWidth = 0.5;

    // 繪製高的小格
    context.beginPath();
    for (var y = 0; y <= height; y += smallGrid) {
        context.moveTo(0, y);
        context.lineTo(width, y);
    }
    context.stroke();
    
    // 繪製寬的小格
    context.beginPath();
    for (var x = 0; x <= width; x += smallGrid) {
        context.moveTo(x, 0);
        context.lineTo(x, height);
    }
    context.stroke();

    context.lineWidth = 1.5;

    // 繪製高的大格
    context.beginPath();
    for (var y = 0; y <= height; y += bigGrid) {
        context.moveTo(0, y);
        context.lineTo(width, y);
    }
    context.stroke();
    
    // 繪製寬的大格
    context.beginPath();
    for (var x = 0; x <= width; x += bigGrid) {
        context.moveTo(x, 0);
        context.lineTo(x, height);
    }
    context.stroke();

    context.strokeStyle = 'black';
    context.lineWidth = 1;
    context.beginPath();
    context.moveTo(0, height/2);
    context.lineTo(smallGrid*3, height/2);
    context.moveTo(smallGrid*3, height/2);
    context.lineTo(smallGrid*3, height/2 + bigGrid*2);
    context.moveTo(smallGrid*3, height/2 + bigGrid*2);
    context.lineTo(smallGrid*7, height/2 + bigGrid*2);
    context.moveTo(smallGrid*7, height/2 + bigGrid*2);
    context.lineTo(smallGrid*7, height/2);
    context.moveTo(smallGrid*7, height/2);
    context.lineTo(smallGrid*10, height/2);
    context.stroke();

    context.save();
    context.translate(smallGrid*3, height/2 + bigGrid*3 + smallGrid*1);
    context.scale(1, -1);
    context.font = "17px Arial";
    context.fillText(canvas.getAttribute("name"), 0, 0);
    context.strokeText(canvas.getAttribute("name"), 0, 0);
    context.restore();
}

function addOption(objId,text,val){
    var obj = document.getElementById(objId);
    var objOption = new Option(text,val);
    obj.options.add(objOption);
    objOption = null;
    obj = null;
}

async function searchPat(){
    var L = document.getElementsByClassName("loading");
    var I = document.getElementsByClassName("icon");

    for(var i = 0;i<L.length;i++){ L[i].style.display="block"; }
    for(var i = 0;i<I.length;i++){ I[i].style.display="none"; }

    document.getElementById("Hint").innerHTML="";
    var inputs = document.querySelectorAll("input");
    inputs.forEach((input)=> {
        const isValid = input.checkValidity();
        if(!isValid) {
            document.getElementById("Hint").innerHTML += input.getAttribute("placeholder") + " 必填<br>";
        }
    });

    if(document.getElementById("Hint").innerHTML!=""){
        var Modal = new bootstrap.Modal(document.getElementById('hintHandle'));
        Modal.show();
        setTimeout(function(){Modal.toggle();}, 1000);
        for(var i = 0;i<L.length;i++){ L[i].style.display="none"; }
        for(var i = 0;i<I.length;i++){ I[i].style.display="block"; }
    }
    else {
        await fetch(window.location.origin + "/SearchPat", {
            method: "POST",
            body: JSON.stringify({
                serverURL:document.getElementById("serverURL").value.trim(),
                bearerToken:document.getElementById("bearerToken").value.trim(),
                idenValue:document.getElementById("patIdenValue").value.trim(),
                organization:document.getElementById("patOrganization").value.trim()
            })
        })
            .then(response => response.json())
            .then(json => {
                var options = document.querySelectorAll('#observSubject option');
                if(json.patID[0]!="Not Found！") options[0].innerHTML="Choose One！";
                else options[0].innerHTML=json.patID[0];
                for(var i=1; i<options.length;i++){
                    options[i].remove()
                }
                json.patID.forEach(element => {
                    addOption("observSubject", element, element)
                });
            })
            .finally(()=>{
                for(var i = 0;i<L.length;i++){ L[i].style.display="none"; }
                for(var i = 0;i<I.length;i++){ I[i].style.display="block"; }
            });
    }

    
}

async function searchObservSubject(){
    var L = document.getElementsByClassName("loading");
    var I = document.getElementsByClassName("icon");

    for(var i = 0;i<L.length;i++){ L[i].style.display="block"; }
    for(var i = 0;i<I.length;i++){ I[i].style.display="none"; }

    await fetch(window.location.origin + "/SearchObservSubject", {
        method: "POST",
        body: JSON.stringify({
            serverURL:document.getElementById("serverURL").value.trim(),
            bearerToken:document.getElementById("bearerToken").value.trim(),
            subject:document.getElementById("observSubject").value.trim()
        })
    })
        .then(response => response.json())
        .then(json => {
            var options = document.querySelectorAll('#observDateTime option');
            for(var i=0; i<options.length;i++){
                options[i].remove()
            }
            if(json.dateTime[0]!="Not Found！") {
                addOption("observDateTime", "Choose One！", "Choose One！");
                options[0].innerHTML="Choose One！";
            }
            else {
                options[0].innerHTML=json.dateTime[0];
            }
            json.dateTime.forEach(element => {
                addOption("observDateTime", element, element);
            });
        })
        .finally(()=>{
            for(var i = 0;i<L.length;i++){ L[i].style.display="none"; }
            for(var i = 0;i<I.length;i++){ I[i].style.display="block"; }
        });
}

async function searchObservDateTime(){
    var L = document.getElementsByClassName("loading");
    var I = document.getElementsByClassName("icon");

    for(var i = 0;i<L.length;i++){ L[i].style.display="block"; }
    for(var i = 0;i<I.length;i++){ I[i].style.display="none"; }

    await fetch(window.location.origin + "/SearchObservDateTime", {
        method: "POST",
        body: JSON.stringify({
            serverURL:document.getElementById("serverURL").value.trim(),
            bearerToken:document.getElementById("bearerToken").value.trim(),
            subject:document.getElementById("observSubject").value.trim(),
            dateTime:document.getElementById("observDateTime").value.trim()
        })
    })
        .then(response => response.json())
        .then(json => {
            var canvas = document.querySelectorAll("canvas");
            json.component.forEach((component)=> {
                canvas.forEach((canva)=> {
                    if(component.code.coding[0].code == canva.id){
                        initCanvas(canva.id);
                        drawCanvas(canva.id, component.valueSampledData);
                    }
                });
            }); 
        })
        .finally(()=>{
            for(var i = 0;i<L.length;i++){ L[i].style.display="none"; }
            for(var i = 0;i<I.length;i++){ I[i].style.display="block"; }
        });
}

function drawCanvas(id, sampledData) {
    var canvas = document.getElementById(id);
    var context = canvas.getContext("2d");
    context.setTransform(1, 0, 0, -1, 0, canvas.height);
    context.strokeStyle = 'black';
    context.lineWidth = 1;
    context.beginPath();
    data = sampledData.data.split(' ');
    context.moveTo((canvas.width/smallGridW)*10, canvas.height/2);
        for (let i = 0; i < data.length; i++) {
            context.lineTo(
                (canvas.width/smallGridW)*10 + i*sampledData.period*(canvas.width/10000), 
                (data[i] - sampledData.origin.value)*sampledData.factor * canvas.height/milliVoltage + canvas.height/2
            );
        }

    context.stroke();
}
