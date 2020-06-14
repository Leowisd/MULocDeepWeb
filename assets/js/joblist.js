/* -------------------------------------------------------------------------- */
/*                                Joblist JS File                             */
/*								Author: Yifu Yao							  */
/*							Last Updated Date: 6/14/2020 					  */
/* -------------------------------------------------------------------------- */

// auto fresh
function myrefresh() {
    window.location.reload();
}
setInterval('myrefresh()', 20000); //20s refresh

$(document).ready(function () {
    $('#table').DataTable({
        "order": [[2, "desc"]]
    });
    $('.dataTables_length').addClass('bs-select');
});

/**
 * Delete selected task  
 *
 * @param {*} obj
 */
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