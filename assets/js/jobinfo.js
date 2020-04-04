// auto fresh
function myrefresh() {
    window.location.reload();
}
setTimeout('myrefresh()', 10000); //10s refresh

// create a copy button
$('#copyBtn').click(function () {
    const input = document.createElement('input');
    document.body.appendChild(input);
    input.setAttribute('readonly', 'readonly')
    input.setAttribute('value', $('#jobIDOutput').text().trim());
    $(input).select();
    // input.setSelectionRange(0, 9999);
    if (document.execCommand('copy')) {
        document.execCommand('copy');
        console.log('copy success');
        alert("Copy Success!");
    }
    document.body.removeChild(input);
})