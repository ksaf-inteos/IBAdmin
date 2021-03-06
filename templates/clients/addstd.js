<script>
{% include 'widgets/osicon.js' %}
  $(function () {
    var curos = $("#{{ form.os.id_for_label }}").val();
    var icon = set_osicon(curos);
    $('#{{ form.os.id_for_label }}icon').removeClass().addClass(icon);
  });
  $(function () {
    //Initialize Select2 Elements
    $(".select2").select2();
    $("#{{ form.os.id_for_label }}").on('change', function(event){
      var icon = set_osicon(this.value);
      $('#{{ form.os.id_for_label }}icon').removeClass().addClass(icon);
    });
  });
  $(function () {
    $('input').iCheck({
      //Initialize iCheck - boxes
      checkboxClass: 'icheckbox_square-blue',
      radioClass: 'iradio_square-blue',
    });
  });
  $("#addform").validate({
    rules: {
      {{ form.name.name }}: {
        required: true,
        remote: {
          url: "{% url 'clientsname' %}"
        },
        componentname: true,
      },
      {{ form.address.name }}: {
        required: true,
        remote: {
          url: "{% url 'addressresolution' %}"
        }
      }
    },
    messages: {
      {{ form.name.name }}: {
        remote: "Client name already exist.",
        componentname: "Client name can include simple letters, digits dash, space and underscore only.",
      },
      {{ form.address.name }}: {
        remote: "Address name not resolved. Please correct."
      }
    },
    highlight: function(element) {
      $(element).closest('.form-group').addClass('has-error');
      $(element).closest('.form-group').removeClass('has-success');
    },
    unhighlight: function(element) {
      $(element).closest('.form-group').removeClass('has-error');
      $(element).closest('.form-group').addClass('has-success');
    },
    errorElement: 'span',
    errorClass: 'help-block',
    errorPlacement: function(error, element) {
      if(element.parent('.input-group').length) {
          error.insertAfter(element.parent());
      } else {
          error.insertAfter(element);
      }
    }
  });
</script>
{% include "pages/refresh.js" %}
{% include 'widgets/helpbutton.js' with helppage='clients.addstd' %}
