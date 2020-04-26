
// start a new game party 
let party = new Game();


$('#newGame').on('click', function(event) {
    event.preventDefault();
    $('#youLostBox').collapse("hide");
    party.startNewParty();
});
