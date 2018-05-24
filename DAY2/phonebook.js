function fullname(c) {
    return `${c.gender=='Male'?'Mr.':'Ms.'}${c.first_name} ${c.last_name}`;
}

function image_url(c) {
    return `https://vinod.co/randomdata/images/${c.gender=='Male'?'men':'women'}/${c.id}`;
}
$(function(){
    // do this when the DOM is ready!

    var cfg = {};
    cfg.url = 'https://vinod.co/randomdata/contacts/';
    cfg.method = 'GET';
    cfg.dataType = 'json';
    cfg.success = function(resp) {
        var list = $('<ul>').addClass('list-group');
        resp.forEach(function(c) {
            $(`<li class='list-group-item' data-contact-id='${c.id}'>
                <div class='row'>
                    <div class='col-sm-3'>
                        <img src=${image_url(c)} 
                            class='img img-circle' 
                            style='max-height: 60px; '/>
                    </div>
                    <div class='col-sm-9'>
                        <p><strong>${fullname(c)}</strong></p>
                        ${c.email} <br />
                        ${c.phone}
                    </div>
                </div>
            </li>`)
            .css({
                cursor: 'pointer'
            })
            .click(function(){
                loadRoute('view-details');
                $('html, body').animate({scrollTop: '0px'}, 500);
                
                var id = $(this).attr('data-contact-id');
                $.ajax({
                    url: 'https://vinod.co/randomdata/contacts/' + id,
                    success: function(resp) {
                        $("span#first_name").html(resp.first_name);
                        $("span#last_name").html(resp.last_name);
                        $("span#city").html(resp.city);
                    }
                });

            })
            .appendTo(list);
        });
        list.appendTo('#contact_list');
    };
    cfg.error = function(err) {
        console.error(err);
    };


    $.ajax(cfg);
});


// contact form validation stuff!
$(function(){
    $('#err_div').hide();

    // btnSave click handler
    $('#btnSave').click(function(){
        // validate fields
        var first_name = $('#first_name').val().trim();
        var last_name = $('#last_name').val().trim();
        var email = $('#email').val().trim();
        var phone = $('#phone').val().trim();
        var address = $('#address').val().trim();
        var city = $('#city').val().trim();
        var state = $('#state').val().trim();
        var country = $('#country').val().trim();
        var dob = $('#dob').val().trim();

        var missing_fields = [];
        if(!first_name) missing_fields.push('Firstname');
        if(!last_name) missing_fields.push('Lastname');
        if(!email) missing_fields.push('Email id');
        if(!phone) missing_fields.push('Phone number');
        
        if($('input[name=gender]:checked').length==0)
            missing_fields.push('Gender');

        $('#err_div').hide();
        
        // if invalid: display  the errors in the err_div
        if(missing_fields.length) {
            $('#err_div').html('<u>Validation errors</u> - ')
            .append('Missing fields: ')
            .append(missing_fields.join())
            .fadeIn(1000, function(){
                setTimeout(function(){
                    $('#err_div').fadeOut(1000);
                }, 2000);
            });
            return;
        }

        // if valid: send to server using POST

        var gender = $('input[name=gender]:checked').val()

        $.ajax({
            url: 'https://vinod.co/randomdata/contacts/',
            method: 'POST',
            contentType: 'json',
            data: JSON.stringify({
                first_name, last_name, gender, 
                email, phone,
                address, city, state, country
            }),
            success: function(resp){
                $('input[type=text]').val('');
                $('input[type=radio]').removeAttr('checked');
                $('input[type=text]:first').focus();
                alert('New contact saved with id ' + resp.id);
            },
            error: function(err){
            }
        });

    });
});



//  routing configuration and handler
var routeConfig = {
    'add-contact': 'phonebook_add.html',
    'view-details': 'phonebook_view.html'
};

function loadRoute(route) {
    if(route in routeConfig) {
        $.ajax({
            url: routeConfig[route],
            success: function(resp) {
                $('#main_content').html(resp);
            }
        })
    }
    else {
        alert('Invalid route given: ' + route);
    }
}

$(function(){
    // dom ready now!

    $('#btnAddContact').click(function(){
        loadRoute('add-contact');
    });
});