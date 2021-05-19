
      document.addEventListener('DOMContentLoaded', function() {

        let formulario = document.querySelector('#formularioEventos');

        var calendarEl = document.getElementById('agenda');
        var calendar = new FullCalendar.Calendar(calendarEl, {
          initialView: 'dayGridMonth',
          locale:'es',
          headerToolbar: {
              left: 'prev,next today',
              center: 'title',
              right: 'dayGridMonth,timeGridWeek,listWeek'

          },
          eventSources:{
              url: baseURL+'/evento/mostrar',
              metohd: "GET",
              extraParams: {
                  _token: formulario._token,    
              }
          },

          dateClick: function(info) {
            formulario.reset();
            formulario.start.value=info.dateStr;
            formulario.end.value=info.dateStr;
            $('#btnModificar').hide();
            $('#btnEliminar').hide();
            $('#btnGuardar').show();
            $('#evento').modal('show');
          },

          eventClick: function(info){
            var evento = info.event;
            $('#btnModificar').show();
            $('#btnEliminar').show();
            $('#btnGuardar').hide();
            // console.log(evento);
            axios.post(baseURL+"/evento/editar/"+info.event.id).
            then(
                    (respuesta)=>{
                        formulario.id.value=respuesta.data.id;
                        formulario.title.value=respuesta.data.title;
                        formulario.descripcion.value=respuesta.data.descripcion;
                        formulario.start.value=respuesta.data.startF;
                        formulario.end.value=respuesta.data.endF;
                        formulario.startH.value=respuesta.data.startH;
                        formulario.endH.value=respuesta.data.endH;

                        $('#evento').modal('show');
                    }
                ).catch(
                    error=>{
                        if(error.response){
                            console.log(error.response.data);
                        }
                    }
                )
          }
        });
        
        calendar.render();

        document.getElementById('btnGuardar').addEventListener('click', function(){
            enviarDatos("/evento/agregar");
        });

        document.getElementById('btnEliminar').addEventListener('click', function(){
            enviarDatos("/evento/borrar/"+formulario.id.value);
        });

        document.getElementById('btnModificar').addEventListener('click', function(){
            enviarDatos("/evento/actualizar/"+formulario.id.value);
        });

        document.getElementById('btnCerrar').addEventListener('click', function(){
            $('#evento').modal('hide');
        });
        
        function enviarDatos(url){
            const datos = new FormData(formulario);

            nuevaURL = baseURL+url;
        
            axios.post(nuevaURL, datos).
            then(
                    (respuesta)=>{
                        calendar.refetchEvents();
                        $('#evento').modal('hide');
                    }
                ).catch(
                    error=>{
                        if(error.response){console.log(error.response.data);}
                    }
                )
        }

      });