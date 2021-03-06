<!-- page script -->
<script>
$(function () {
  var table = $("#vcenterlist").DataTable({
    "serverSide": true,
    "ajax": "{% url 'vmsvcenterdefineddata' %}",
    "language": {
      "emptyTable": "No vCenter defined"
    },
    "bAutoWidth": false,
    "columns": [
      { "sClass": "vertical-align" },
      { "sClass": "vertical-align" },
      { "sClass": "vertical-align" },
      { "sClass": "vertical-align text-center", "render": function (data,type,row){ return renderdepartmentlabel(data)} },
      { "width": "96px", "orderable": false, "sClass": "vertical-align text-center", // 32px for every button
        "render": function ( data, type, row ) {
          var btn = '<button class="btn btn-sm btn-default" type="button" ';
          var ret = btn + 'onclick="location.href=\'{% url 'vmsvcenterinfo_rel' %}'+data[0]+'/\';"><i class="fa fa-info-circle" data-toggle="tooltip" data-original-title="Information"></i></button>\n';
{% if perms.virtual.change_vcenter %}
          ret += btn + 'onclick="location.href=\'{% url 'vmsvcenteredit_rel' %}'+data[0]+'/\';"><i class="fa fa-wrench" data-toggle="tooltip" data-original-title="Edit"></i></button>\n';
{% endif %}
{% if perms.virtual.delete_vcenter %}
          ret += btn + 'data-toggle="modal" data-target="#deletevcenterconfirm" data-name="'+data[0]+'" data-url="{% url 'vcenterdelete_rel' %}"><i class="fa fa-trash" data-toggle="tooltip" data-original-title="Delete"></i></button>\n';
{% endif %}
          return '<div class="btn-group">' + ret + '</div>';
        },
      },
    ],
  });
  var tableclient = $("#clientslist").DataTable({
    "serverSide": true,
    "ajax": "{% url 'vmsvcenterclientdefineddata' %}",
    "language": {
      "emptyTable": "No VMware Proxy clients defined"
    },
    "bAutoWidth": false,
    "columns": [
      { "sClass": "vertical-align" },
      { "sClass": "vertical-align" },
      { "sClass": "vertical-align" },
      { "sClass": "vertical-align text-center", "render": function (data,type,row){ return renderdepartmentlabel(data)} },
      { "width": "64px", "sClass": "vertical-align text-center", "render": function (data,type,row){ return renderstatus(data)} }, // Status
      { "width": "128px", "orderable": false, "sClass": "vertical-align text-center", // 32px for every button
        "render": function ( data, type, row ) {
          var btn = '<button class="btn btn-sm btn-default" type="button" ';
          var ret = '';
{% if perms.clients.view_clients %}
          ret += btn + 'onclick="location.href=\'{% url 'clientsinfo_rel' %}'+data[0]+'/\';"><i class="fa fa-info-circle" data-toggle="tooltip" data-original-title="Information"></i></button>\n';
{% endif %}
{% if perms.clients.restore_clients %}
          ret += btn + 'onclick="location.href=\'{% url 'restoreclient_rel' %}'+data[0]+'/\';"><i class="fa fa-cloud-upload" data-toggle="tooltip" data-original-title="Restore"></i></button>\n';
{% endif %}
{% if perms.clients.change_clients %}
          ret += btn + 'onclick="location.href=\'{% url 'clientsedit_rel' %}'+data[0]+'/?b={% url 'vmsvcenterdefined' %}\';"><i class="fa fa-wrench" data-toggle="tooltip" data-original-title="Edit"></i></button>\n';
{% endif %}
{% if perms.clients.delete_clients %}
          if (data[1] != 'Yes'){
            ret += btn + 'data-toggle="modal" data-target="#deleteclientconfirm" data-name="'+data[0]+'" data-url="{% url 'clientsdelete_rel' %}"><i class="fa fa-trash" data-toggle="tooltip" data-original-title="Delete"></i></button>\n';
          }
{% endif %}
          return '<div class="btn-group">' + ret + '</div>';
        },
      },
    ],
  });
  $('#deletevcenterconfirmbutton').on('click', function () {
      var button = $(this);
      var text = button.text();
      button.button('loading');
      var url = button.data('url');
      {% include 'widgets/onErrorReceivedbutton.js' %}
      function onDataReceived(data) {
        button.button('Done...');
        var modal = button.closest('.modal')
        modal.modal('hide');
        table.ajax.reload( null, false ); // user paging is not reset on reload
        tableclient.ajax.reload( null, false ); // user paging is not reset on reload
        modal.on('hidden.bs.modal', function (){
          button.text(text);
        });
      };
      $.ajax({
        url: url,
        type: "GET",
        dataType: "json",
        success: onDataReceived,
        error: onErrorReceived,
      });
  });

{% include "widgets/refreshbutton.js" with id='vcenterlistrefresh' %}
{% include "widgets/refreshbutton.js" with id='clientslistrefresh' table='tableclient' %}

  $('#deleteclientconfirmbutton').on('click', function () {
    var button = $(this);
    var text = button.text();
    button.button('loading');
    var url = button.data('url');
    var taskid = 0;
    var rpintervalId;
    function closeProgress(){
      clearInterval(rpintervalId);
      $('#deleteclientconfirmprogress').on('hidden.bs.modal', function (){
        $('#taskprogress').css('width','0%').attr('aria-valuenow',0);
        $('#taskprogress').html("0%");
        $('#deleteclientconfirmprogress').removeClass('modal-danger');
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
            $('#deleteclientconfirmprogress').modal('hide');
          };
          if (data[2] == 'E' || data[2] == 'C'){
            $('#deleteclientconfirmprogress').addClass('modal-danger');
            $('#deleteclientconfirmprogress').find('.modal-header').find('h4').html('Failed...')
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
        tableclient.ajax.reload( null, false ); // user paging is not reset on reload
      } else
      if (data['status'] == 1) {
        $('#deleteclientconfirmrunning').modal('show');
      } else
      if (data['status'] == 3) {
        $('#deleteclientconfirmalias').modal('show');
      } else
      if (data['status'] == 4) {
        $('#deleteclientconfirmcluster').modal('show');
      } else
      if (data['status'] == 2) {
        tableclient.ajax.reload( null, false ); // user paging is not reset on reload
        taskid = data['taskid'];
        $('#deleteclientconfirmprogress').modal('show');
        rpintervalId = setInterval(refreshProgress, 1000);
        $('#deleteclientconfirmprogress').on('hide.bs.modal', function (event) {
          closeProgress();
        });
      };
      modal.on('hidden.bs.modal', function (){
        button.text(text);
      });
    };
    {% include 'widgets/onErrorReceivedbutton.js' %}
    $.ajax({
      url: url,
      type: "GET",
      dataType: "json",
      success: onDataReceived,
      error: onErrorReceived,
    });
  });
});
{% include 'widgets/confirmmodal1.js' with selector='#deleteclientconfirm' %}
{% include 'widgets/confirmmodal1.js' with selector='#deletevcenterconfirm' %}
{% include "widgets/renderlinks.js" %}
</script>
{% include "pages/refresh.js" %}
{% include 'widgets/helpbutton.js' with helppage='vmhosts.vcenter' %}