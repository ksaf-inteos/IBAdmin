<!-- page script -->
<script>
$(function () {
  var table = $("#jobshistory").DataTable({
    "serverSide": true,
    "ajax": "{% url 'jobshistorydata' Job.Name %}",
    "language": {
      "emptyTable": "No Jobs run yet"
    },
    "order": [[ 0, 'desc' ]],
    "bAutoWidth": false,
    "columns": [
      { "width": "30px", "sClass": "vertical-align text-center" },
      { "sClass": "vertical-align", "render": function (data,type,row){ return renderdataar(data)} },
      { "sClass": "vertical-align", "render": function (data,type,row){ return renderdata(data)} },
      { "width": "50px", "sClass": "vertical-align text-center", "orderable": false, "render": function (data,type,row){ return renderbadge(data)} },
      { "sClass": "vertical-align" },
      { "sClass": "vertical-align", "render": function (data,type,row){ return bytestext(data)} },
      { "width": "50px", "sClass": "vertical-align text-center", "render": function (data,type,row){ return renderlabel(data)} },
      { "width": "96px", "orderable": false, "sClass": "vertical-align text-center", <!-- 32px for every button -->
        "render": function (data,type,row){
          var btn = '<button class="btn btn-sm btn-default" type="button" ';
          var ret = '';
          if (data[3] == 'R' || data[3] == 'C'){
{% if perms.jobs.status_jobs %}
            ret += btn + 'onclick="location.href=\'{% url 'jobsstatus_rel' %}'+data[0]+'\';"><i class="fa fa-info-circle"></i></button>\n';
{% endif %}
          } else {
            ret += btn + 'onclick="location.href=\'{% url 'jobslog_rel' %}'+data[0]+'\';"><i class="fa fa-info-circle"></i></button>\n';
          }
{% if perms.jobs.cancel_jobs %}
          if (data[3] == 'R' || data[3] == 'C'){
            ret += btn + 'data-toggle="modal" data-target="#canceljobconfirm" data-name="'+data[1]+'" data-jobid="'+data[0]+'" data-url="{% url 'jobsidcancel_rel' %}"><i class="fa fa-minus-circle"></i></button>\n';
          }
{% endif %}
          if (data[3] == 'R'){
{% if perms.jobs.stop_jobs %}
            ret += btn + 'data-toggle="modal" data-target="#stopjobconfirm" data-name="'+data[1]+'" data-jobid="'+data[0]+'" data-url="{% url 'jobsidstop_rel' %}"><i class="fa fa-pause"></i></button>\n';
{% endif %}
          } else
          if (data[3] != 'C') {
            if (data[2] == 'B'){
              if (data[3] == 'T' || data[3] == 'I'){
{% if perms.jobs.restore_jobs %}
                  ret += btn + 'onclick="location.href=\'{% url 'restorejobid_rel' %}'+data[0]+'\';"><i class="fa fa-cloud-upload"></i></button>\n';
{% endif %}
                } else {
{% if perms.jobs.restart_jobs %}
                  ret += btn + 'data-toggle="modal" data-target="#restartjobidconfirm" data-name="'+data[1]+'" data-jobid="'+data[0]+'" data-url="{% url 'jobsidrestart_rel' %}"><i class="fa fa-refresh" data-toggle="tooltip" data-original-title="Restart"></i></button>\n';
{% endif %}
                }
            }
{% if perms.jobs.delete_jobs %}
            ret += btn + 'data-toggle="modal" data-target="#deletejobidconfirm" data-name="'+data[1]+'" data-jobid="'+data[0]+'" data-url="{% url 'jobsiddelete_rel' %}"><i class="fa fa-trash"></i></button>\n';
{% endif %}
          };
          return '<div class="btn-group">' + ret + '</div>';
        },
      },
    ],
  });
  setInterval( function () {
    table.ajax.reload( null, false ); // user paging is not reset on reload
  }, 60000 );
{% include "widgets/refreshbutton.js" %}

$('#deletejobconfirmbutton').on('click', function () {
    var button = $(this);
    var text = button.text();
    button.button('loading');
    var url = button.data('url');
    var taskid = 0;
    var rpintervalId;
    function closeProgress(){
      clearInterval(rpintervalId);
      $('#deletejobconfirmprogress').on('hidden.bs.modal', function (){
        $('#taskprogress').css('width','0%').attr('aria-valuenow',0);
        $('#taskprogress').html("0%");
        $('#deletejobconfirmprogress').removeClass('modal-danger');
      });
    };
    function refreshProgress(){
      $.ajax({
        url: '{% url 'tasksprogress_rel' %}' + taskid + '/',
        type: "GET",
        dataType: "json",
        success: function(data){
          $('#taskprogress').css('width',data[1]).attr('aria-valuenow',data[0]);
          $('#taskprogress').html(data[1]);
          if (data[0] == 100){
            closeProgress();
            $('#deletejobconfirmprogress').modal('hide');
          };
          if (data[2] == 'E' || data[2] == 'C'){
            $('#deletejobconfirmprogress').addClass('modal-danger');
            $('#deletejobconfirmprogress').find('.modal-header').find('h4').html('Failed...')
            closeProgress();
          };
        },
      });
    };
    function onDataReceived(data) {
      button.button('Done...');
      var modal = button.closest('.modal')
      modal.modal('hide');
      if (data['status'] == 0) {
        location.href="{% url 'jobsdefined' %}";
      } else
      if (data['status'] == 1) {
        $('#deletejobconfirmrunning').modal('show');
      } else
      if (data['status'] == 2) {
        table.ajax.reload( null, false ); // user paging is not reset on reload
        taskid = data['taskid'];
        $('#deletejobconfirmprogress').modal('show');
        rpintervalId = setInterval(refreshProgress, 1000);
        $('#deletejobconfirmprogress').on('hide.bs.modal', function (event) {
          location.href="{% url 'jobsdefined' %}";
        });
      };
      modal.on('hidden.bs.modal', function (){
        button.text(text);
      });
    };
    $.ajax({
      url: url,
      type: "GET",
      dataType: "json",
      success: onDataReceived,
    });
  });

{% include "widgets/confirmbutton.js" with selector='#canceljobconfirmbutton, #stopjobconfirmbutton, #deletejobidconfirmbutton' %}
{% include "widgets/confirmbuttonhref.js" with selector='#runjobconfirmbutton' %}
});
{% include "widgets/confirmmodal2.js" with selector='#canceljobconfirm, #stopjobconfirm, #deletejobidconfirm' %}
{% include 'widgets/confirmmodal1.js' with selector='#runjobconfirm, #deletejobconfirm' %}
</script>
{% include "pages/refresh.js" with jobstatuswidgetRefresh=1 %}
{% include 'widgets/helpbutton.js' with helppage='jobs.info' %}