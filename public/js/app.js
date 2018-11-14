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

$(document).ready(function(){
    $('.modal').modal();
});

