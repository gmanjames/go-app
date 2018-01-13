'use strict';

const socket   = io(),
      submit   = document.getElementById('submit'),
      username = document.getElementById('username');

let user;


function handleMove(evt) {
    const point  = evt.target;
    let [x, y] = point.dataset.pos.split(','),
        image;

    x = parseInt(x);
    y = parseInt(y);

    if ((x === 1 && x === y)
    ||  (x === 1 && y === 9)
    ||  (x === 9 && y === 1)
    ||  (x === 9 && x === y))
        image = 'corner';

    else if (x > 1 && x < 9 && y > 1 && y < 9)
        image = 'middle';

    else
        image = 'side';

    socket.emit('try-move', {x: x, y: y, color: user.color, image: image});
}

document.querySelectorAll('.point').forEach(item => {
    item.addEventListener('click', handleMove);
});

submit.addEventListener('click', evt => {
    evt.preventDefault();

    socket.emit('add-user', username.value);
});

socket.on('login', dat => {
    user = dat;
    document.body.append(JSON.stringify(dat));
});

socket.on('move',  dat => {
    console.log(dat);

    if (dat.legal) {
        let posdat = dat.pos.x + ',' + dat.pos.y,
            color  = user.color === 'black' ? 'b' : 'w',
            point  = document.querySelector(".point[data-pos='" + posdat + "']");

        point.style.backgroundImage = "url('/images/i-" + dat.image + "-" + color + ".png')";

    }
});

socket.on('update-board', dat => {
    console.log(dat);

    let posdat = dat.pos.x + ',' + dat.pos.y,
        color  = dat.color === 'black' ? 'b' : 'w',
        point  = document.querySelector(".point[data-pos='" + posdat + "']");

    point.style.backgroundImage = "url('/images/i-" + dat.image + "-" + color + ".png')";
});
