$('#loginSubmit').on('click', function(event){
    event.preventDefault;
    const login = {username: $('#username').val().trim(), password: $('#password').val()};
    $.ajax({
        url: '/login',
        method: 'POST',
        data: login
    }).then(function(response){
        if(response.success){
            window.location.replace("/kudos");
        }
    }).catch(function(err){
        console.log(err);
        M.toast({html: "Invalid Username/Password"});
    })
});

const submitNewUser = function(newUser){
    $.ajax({
        url: '/api/newUser',
        method: 'POST',
        data: newUser
    }).then(function(response){
        window.location.replace('/')
    })
}

const prepareForm = function(){
    const newUser = {
        name: $('#username').val().trim(),
        password: $('#password').val().trim()
    };
    submitNewUser(newUser);
};

$('#signup').validate({
    onkeyup:false,
    rules: {
        username: {
            required: true,
            minlength: 5,
        },
        email: {
            required: true,
            email:true
        },
        password: {
            required: true,
            minlength: 5
        },
        confirmpassword: {
            required: true,
            minlength: 5,
            equalTo: "#password"
        },//For custom messages
    },
    messages: {
        username:{
            required: "Enter a username",
            minlength: "Enter at least 5 characters",
            unique: "Username already exists"
        },
        email: {
            required: "Enter an e-mail address",
            email: "Enter a valid e-mail address"
        },
        password: {
            required: "Please enter a password",
            minlength: "Password must be at least 5 characters"
        },
        confirmpassword: {
            equalTo: 'Passwords do not match'
        },
    },
    errorElement : 'div',
    errorPlacement: function(error, element) {
        var placement = $(element).data('error');
        if (placement) {
            $(placement).append(error)
        } else {
            error.insertAfter(element);
        }
    },
    submitHandler: function(form) {
        prepareForm();
    }
});

const getNotes = function(){
    $.ajax({
        url: "/api/getNotes",
        method: 'GET'
    }).then(function(response){
        renderNotes(response);
    });
}

const renderNotes = function(data) {
    $('#content').empty();
    for (let i = 0; i < data.length; i ++){
        $('#content').append(`<div class="row">
                                <div class="col s10">
                                <div class="card blue-grey darken-1">
                                    <div class="card-content white-text">
                                    <span class="card-title center">${data[i].title}</span>
                                    <p>${data[i].message}</p>
                                    </div>
                                    <div class="container">
                                        <div class="row">
                                            <div class=" col s6 center">
                                                Sender: ${data[i].sender[0].username}
                                            </div>
                                            <div class="col s6 center">
                                                Recipient: ${data[i].recipient[0].username}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                </div>
                            </div>  
            `)
    }
}

const prepareMessage = function() {
    $.ajax({
        url: '/login',
        method: 'GET'
    }).then(function(user){
        const newNote = {
            sender: user._id,
            title: $('#title').val(),
            message: $('#message').val(),
            recipient: $('#recipients').val()
        }
        $.ajax({
            url: '/api/newNote',
            method: 'POST',
            data: newNote
        }).then(function(response){
            if (response.success === "success"){
                M.toast({html: 'Kudos given!'});
                getNotes();
            }
        })
    });
}

const filterSent = function(){
    $.ajax({
        url: '/login',
        method: 'GET'
    }).then(function(user){
        $.ajax({
            url: `/api/getNotes/${user._id}`,
            method: 'GET'
        }).then(function(response){
            const notes = response.notes
            console.log(notes);
            renderNotes(notes);
        })
    })
}

const filterReceived = function(){
    $.ajax({
        url: '/login',
        method: 'GET'
    }).then(function(user){
        $.ajax({
            url: `/api/getReceived/${user._id}`,
            method: 'GET'
        }).then(function(response){
            console.log(response);
            renderNotes(response);
        })
    })
}
$(document).ready(function(){
    $('.dropdown-trigger').dropdown();
    $('.modal').modal();
    $('select').formSelect();
    $('input#input_text').characterCounter();
    getNotes();
});

$('#kudosTrigger').on('click', function(event){
    event.preventDefault();
    $('#sender').empty();
    $('#recipients').empty();
    $.ajax({
        url: '/login',
        method: 'GET'
    }).then(function(user){
        $.ajax({
            url: '/api/getUsers',
            method: 'GET'
        }).then(function(response){
            $('#sender').append(`Sender: ${user.username}`);
            $('#sender').attr('id', user._id)
            $('#recipients').append(`<option value="" disabled selected>Recipient</option>`);
            for (let i = 0; i < response.length; i++){
                if (user._id != response[i]._id){
                    $('#recipients').append(`<option value=${response[i]._id}>${response[i].username}</option>`)
                }
            }
            $('select').formSelect();
            $('#kudosForm').modal('open');
        });
    });
});

$('#kudosSubmit').on('click', function(event){
    event.preventDefault();
    prepareMessage();
});

$('#all').on('click', function(event){
    event.preventDefault();
    $('#sent').removeClass('disabled');
    $('#received').removeClass('disabled');
    $('#all').addClass('disabled');
    getNotes();
});

$('#sent').on('click', function(event){
    event.preventDefault();
    $('#all').removeClass('disabled');
    $('#received').removeClass('disabled');
    $('#sent').addClass('disabled');
    filterSent();
});

$('#received').on('click', function(event){
    event.preventDefault();
    $('#all').removeClass('disabled');
    $('#sent').removeClass('disabled');
    $('#received').addClass('disabled');
    filterReceived();
})
