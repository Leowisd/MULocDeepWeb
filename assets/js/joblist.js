// auto fresh
function myrefresh() {
    window.location.reload();
}
setTimeout('myrefresh()', 200000); //20s refresh

$(document).ready(function () {
    $('#table').DataTable({
        "order": [[2, "desc"]]
    });
    $('.dataTables_length').addClass('bs-select');
});

function deleteTr(obj) {
    var con;
    con = confirm("Are you sure you wanna delete this job?");
    if (con == true) {
        var deleteID = $(obj).closest('tr').find('th').text().trim();
        // console.log(deleteID);
        var url = '/jobs/delete/:' + deleteID;
        // console.log(url);
        $.post(url, null, function (data, status) {
            // console.log('Delete Start');
        });
        // $(obj).closest('tr').remove();
        alert("The job " + deleteID + " has been deleted!");
        window.location.reload();
    }
}