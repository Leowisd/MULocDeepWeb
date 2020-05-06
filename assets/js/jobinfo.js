// auto fresh
function myrefresh() {
    window.location.reload();
}
setInterval('myrefresh()', 10000); //10s refresh

// create a copy button
$('#copyBtn').click(function () {
    const input = document.createElement('input');
    document.body.appendChild(input);
    input.setAttribute('readonly', 'readonly')
    input.setAttribute('value', $('#jobIDOutput').val().trim());
    $(input).select();
    // input.setSelectionRange(0, 9999);
    if (document.execCommand('copy')) {
        document.execCommand('copy');
        // console.log('copy success');
        $('#infoModalBody').text("Copy Success!");
        $('#infoModal').modal('show');
    }
    document.body.removeChild(input);
})

// create the email submit button
$('#emailBtn').click(function(){
    let url = '/upload/email';
    let data = {
        email: $('#emailInput').val(),
        jobID: $('#jobIDOutput').val()
    }
    if (data.email.length > 0 && data.email.indexOf("@") > -1){
        $.post(url, data, function(data, status){
        });
        document.getElementById('emailInput').value = "";
        $('#infoModalBody').text("Submit Success!");
        $('#infoModal').modal('show');
    }
    else{
        $('#infoModalBody').text("Please input valid email address!");
        $('#infoModal').modal('show');
    }
    
})