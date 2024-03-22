$.ajax({
    url: 'api/index.php',
    type: 'GET',
    success: function() {
        init();
    },
    error: function(msg) {
        console.log(msg);
    }
});