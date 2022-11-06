fetch('load')
    .then(async function (response) {
        if (response.redirected) {
            window.location.replace(response.url);
        } else {
            let user = await response.json();
            document.querySelector('#user').innerText = user.username;

            for (let i = 0; i < user.houses.length; i++) {
                const house = user.houses[i];

                let nr_house = document.createElement('option');
                nr_house.innerText = house.name;
                document.querySelector('#nr_house').append(nr_house);

                let ns_house = document.createElement('option');
                ns_house.innerText = house.name;
                document.querySelector('#ns_house').append(ns_house);

                let nb_house = document.createElement('option');
                nb_house.innerText = house.name;
                document.querySelector('#nb_house').append(nb_house);


                let eb_house = document.createElement('option');
                eb_house.innerText = house.name;
                document.querySelector('#eb_house').append(eb_house);

                for (let j = 0; j < house.rooms.length; j++) {
                    const room = house.rooms[j];

                    let ns_room = document.createElement('option');
                    ns_room.innerText = room.name;
                    ns_room.id = house.name;
                    document.querySelector('#ns_room').append(ns_room);

                    let nb_room = document.createElement('option');
                    nb_room.innerText = room.name;
                    nb_room.id = house.name;
                    document.querySelector('#nb_room').append(nb_room);


                    let eb_room = document.createElement('option');
                    eb_room.innerText = room.name;
                    eb_room.id = house.name;
                    document.querySelector('#eb_room').append(eb_room);

                    for (let h = 0; h < room.shelfs.length; h++) {
                        const shelf = room.shelfs[h];

                        let nb_shelf = document.createElement('option');
                        nb_shelf.id = room.name;
                        nb_shelf.innerText = shelf.name;
                        document.querySelector('#nb_shelf').append(nb_shelf);


                        let eb_shelf = document.createElement('option');
                        eb_shelf.id = room.name;
                        eb_shelf.innerText = shelf.name;
                        document.querySelector('#eb_shelf').append(eb_shelf);
                    }
                }
            }

            for (let i = 0; i < user.books.length; i++) {
                const book = user.books[i];

                let details = document.createElement('details');
                details.innerHTML =
                    `<summary>${book.title}</summary>
                    <p>Writer: ${book.writer}</p>
                    <p>Title: ${book.title}</p>
                    <p>Description: ${book.description}</p>
                    <p>Type: ${book.type}</p>
                    <p>Publisher: ${book.publisher}</p>
                    <p>Year of publication: ${book.yearOfPublication}</p>
                    <p>Notes: ${book.notes}</p>
                    <p>Place: ${book.house} > ${book.room} > ${book.shelf}</p>
                    <p>Pinned: ${book.pinned}</p>
            
                    <div>
                        <button class="edit-book">Edit</button>
                        <button class="delete-book">Delete</button>
                    </div>
                    `;
                details.id = book._id;
                document.querySelector('main').append(details);
            }

            houseroomrelation('ns');
            houseroomrelation('nb');
            roomshelfrelation('nb');
        }
    })
    .then(function(){
        for (let i = 0; i < document.querySelectorAll('.delete-book').length; i++) {
            const element = document.querySelectorAll('.delete-book')[i];
            element.addEventListener('click', function(){
                fetch('deletebook', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    },
                    body: `objectID=${element.parentElement.parentElement.id}`
                })
                .then(function(response){
                    // console.log(response);
                    if (response.redirected) {
                        window.location.replace(response.url);
                    } else {
                        return response.json();
                    }
                });
            
            });
        }
        for (let i = 0; i < document.querySelectorAll('.edit-book').length; i++) {
            const element = document.querySelectorAll('.edit-book')[i];
            element.addEventListener('click', function(){
                //↓example for bad code↓

                document.querySelector('#eb_writer').value = this.parentElement.parentElement.children[1].innerText.split('Writer: ')[1];
                if (this.parentElement.parentElement.children[1].innerText.split('Writer: ')[1] == undefined) {
                    document.querySelector('#eb_writer').value = "";
                }

                document.querySelector('#eb_title').value = this.parentElement.parentElement.children[2].innerText.split('Title: ')[1];
                if (this.parentElement.parentElement.children[2].innerText.split('Title: ')[1] == undefined) {
                    document.querySelector('#eb_title').value = "";
                }

                document.querySelector('#eb_description').value = this.parentElement.parentElement.children[3].innerText.split('Description: ')[1];
                if (this.parentElement.parentElement.children[3].innerText.split('Description: ')[1] == undefined) {
                    document.querySelector('#eb_description').value = "";
                }

                document.querySelector('#eb_type').value = this.parentElement.parentElement.children[4].innerText.split('Type: ')[1];
                if (this.parentElement.parentElement.children[4].innerText.split('Type: ')[1] == undefined) {
                    document.querySelector('#eb_type').value = "";
                }

                document.querySelector('#eb_publisher').value = this.parentElement.parentElement.children[5].innerText.split('Publisher: ')[1];
                if (this.parentElement.parentElement.children[5].innerText.split('Publisher: ')[1] == undefined) {
                    document.querySelector('#eb_publisher').value = "";
                }

                document.querySelector('#eb_yearOfPublication').value = this.parentElement.parentElement.children[6].innerText.split('Year of publication: ')[1];
                if (this.parentElement.parentElement.children[6].innerText.split('Year of publication: ')[1] == "null") {
                    document.querySelector('#eb_yearOfPublication').value = "";
                }

                document.querySelector('#eb_notes').value = this.parentElement.parentElement.children[7].innerText.split('Notes: ')[1];
                if (this.parentElement.parentElement.children[7].innerText.split('Notes: ')[1] == undefined) {
                    document.querySelector('#eb_notes').value = "";
                }

                document.querySelector('#eb_house').value = this.parentElement.parentElement.children[8].innerText.split('Place: ')[1].split(' > ')[0];
                if (this.parentElement.parentElement.children[8].innerText.split('Place: ')[1].split(' > ')[0] == undefined) {
                    document.querySelector('#eb_house').value = "";
                }
                // console.log(this.parentElement.parentElement.children[8].innerText.split('Place: ')[1].split(' > ')[0]);

                document.querySelector('#eb_room').value = this.parentElement.parentElement.children[8].innerText.split('Place: ')[1].split(' > ')[1];
                if (this.parentElement.parentElement.children[8].innerText.split('Place: ')[1].split(' > ')[1] == undefined) {
                    document.querySelector('#eb_room').value = "";
                }
                // console.log(this.parentElement.parentElement.children[8].innerText.split('Place: ')[1].split(' > ')[1]);

                document.querySelector('#eb_shelf').value = this.parentElement.parentElement.children[8].innerText.split('Place: ')[1].split(' > ')[2];
                if (this.parentElement.parentElement.children[8].innerText.split('Place: ')[1].split(' > ')[2] == undefined) {
                    document.querySelector('#eb_shelf').value = "";
                }
                // console.log(this.parentElement.parentElement.children[8].innerText.split('Place: ')[1].split(' > ')[2]);

                document.querySelector('#eb_pinned').checked = this.parentElement.parentElement.children[9].innerText.split('Pinned: ')[1];
                if (this.parentElement.parentElement.children[9].innerText.split('Pinned: ')[1] == "false") {
                    document.querySelector('#eb_pinned').checked = false;
                }

                document.querySelector('#eb_objectID').value = this.parentElement.parentElement.id;
                //↑example for bad code↑

                houseroomrelation('eb');
                roomshelfrelation('eb');
        
                seeinput('eb', 'title', 'edit');

                document.querySelector('#dialog-bg').style.display = 'flex';
                document.querySelector('#edit-book').style.display = 'flex';
            });
        }
    });

document.querySelector('#ns_house').addEventListener('change', function(){houseroomrelation('ns')});
document.querySelector('#nb_house').addEventListener('change', function(){houseroomrelation('nb'); roomshelfrelation('nb')});
document.querySelector('#nb_room').addEventListener('change', function(){roomshelfrelation('nb')});

document.querySelector('#eb_house').addEventListener('change', function(){houseroomrelation('eb'); roomshelfrelation('eb')})
document.querySelector('#eb_room').addEventListener('change', function(){roomshelfrelation('eb')})

function houseroomrelation(which) {
    let db = 0;
    let first_good_room = '';

    for (let i = 0; i < document.querySelector(`#${which}_room`).children.length; i++) {
        const option = document.querySelector(`#${which}_room`).children[i];
        if (option.id == document.querySelector(`#${which}_house`).value) {
            option.style.display = 'block';
            if (first_good_room == '') {
                first_good_room = option.value;
            }
        }
        else{
            option.style.display = 'none';
            db++;
        }
    }

    if (db == document.querySelector(`#${which}_room`).children.length) {
        document.querySelector(`#${which}_room`).value = "NO ITEM";//doesnt work
        document.querySelector(`#${which}_room`).disabled = true;
        if (document.querySelector(`#${which}_add`)) {
            document.querySelector(`#${which}_add`).disabled = true;
        }
        else{
            document.querySelector(`#${which}_edit`).disabled = true;
        }
    }else{
        document.querySelector(`#${which}_room`).value = first_good_room;
        document.querySelector(`#${which}_room`).disabled = false;
        if (document.querySelector(`#${which}_add`)) {
            document.querySelector(`#${which}_add`).disabled = false;
        }
        else{
            document.querySelector(`#${which}_edit`).disabled = false;
        }
    }
}

function roomshelfrelation(which) {
    let db = 0;
    let first_good_shelf = '';

    for (let i = 0; i < document.querySelector(`#${which}_shelf`).children.length; i++) {
        const option = document.querySelector(`#${which}_shelf`).children[i];
        if (option.id == document.querySelector(`#${which}_room`).value) {
            option.style.display = 'block';
            if (first_good_shelf == '') {
                first_good_shelf = option.value;
            }
        }
        else{
            option.style.display = 'none';
            db++;
        }
    }

    if (db == document.querySelector(`#${which}_shelf`).children.length) {
        document.querySelector(`#${which}_shelf`).value = "NO ITEM";//doesnt work
        document.querySelector(`#${which}_shelf`).disabled = true;
        // document.querySelector(`#${which}_add`).disabled = true;  
        if (document.querySelector(`#${which}_add`)) {
            document.querySelector(`#${which}_add`).disabled = true;
        }
        else{
            document.querySelector(`#${which}_edit`).disabled = true;
        }
        
    }else{
        document.querySelector(`#${which}_shelf`).value = first_good_shelf;
        document.querySelector(`#${which}_shelf`).disabled = false;
        // document.querySelector(`#${which}_add`).disabled = false;
        if (document.querySelector(`#${which}_add`)) {
            document.querySelector(`#${which}_add`).disabled = false;
        }
        else{
            document.querySelector(`#${which}_edit`).disabled = false;
        }
    }
}

function seeinput(n_e_x, yz, add_or_edit) {
    if (!document.querySelector(`#${n_e_x}_${yz}`).value) {
        document.querySelector(`#${n_e_x}_${add_or_edit}`).disabled = true;
    }
    else{
        document.querySelector(`#${n_e_x}_${add_or_edit}`).disabled = false;
    }
}

// quick actions buttons
document.querySelector('#new-house-button').addEventListener('click', function () {
    seeinput('nh', 'name', 'add');
    document.querySelector('#dialog-bg').style.display = 'flex';
    document.querySelector('#new-house').style.display = 'flex';
});

document.querySelector('#new-room-button').addEventListener('click', function () {
    seeinput('nr', 'name', 'add');
    document.querySelector('#dialog-bg').style.display = 'flex';
    document.querySelector('#new-room').style.display = 'flex';
});

document.querySelector('#new-shelf-button').addEventListener('click', function () {
    seeinput('ns', 'name', 'add');
    document.querySelector('#dialog-bg').style.display = 'flex';
    document.querySelector('#new-shelf').style.display = 'flex';
});

document.querySelector('#new-book-button').addEventListener('click', function () {
    seeinput('nb', 'title', 'add');
    document.querySelector('#dialog-bg').style.display = 'flex';
    document.querySelector('#new-book').style.display = 'flex';
});


document.querySelector('#nh_name').addEventListener('input', function(){
    seeinput('nh', 'name', 'add');
});

document.querySelector('#nr_name').addEventListener('input', function(){
    seeinput('nr', 'name', 'add');
});

document.querySelector('#ns_name').addEventListener('input', function(){
    seeinput('ns', 'name', 'add');
});

document.querySelector('#nb_title').addEventListener('input', function(){
    seeinput('nb', 'title', 'add');
});


document.querySelector('#eb_title').addEventListener('input', function () {
    seeinput('eb', 'title', 'edit');
})