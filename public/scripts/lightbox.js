var fullres_images = [
    'images/imagefull01.jpg',
    'images/imagefull02.jpg',
    'images/imagefull03.jpg',
    'images/imagefull04.png',
    'images/imagefull05.jpg',
    'images/imagefull06.png',
    'images/imagefull07.jpg',
    'images/imagefull08.jpg',
    'images/imagefull09.jpg'
];
var selected_fullres = 0;

function Init() {
    document.body.addEventListener('click', HandleClick, false);
    document.body.addEventListener('keydown', HandleKeyDown, false);
}

function HandleClick(event) {
    var fullimage;
    var lightbox;
    if (event.target.id.length > 5 && event.target.id.substring(0, 5) === 'image') {
        selected_fullres = parseInt(event.target.id.substring(5, 7), 10) - 1;
        fullimage = document.getElementById('fullimage');
        fullimage.src = fullres_images[selected_fullres];
        lightbox = document.getElementById('lightbox');
        lightbox.style.display = 'block';
    }
    else if (event.target.id === 'close') {
        lightbox = document.getElementById('lightbox');
        lightbox.style.display = 'none';
    }
}

function HandleKeyDown(event) {
    var fullimage;
    var lightbox = document.getElementById('lightbox');
    if (lightbox.style.display === 'block') {
        if (event.keyCode === 37) { // left arrow key
            selected_fullres = (selected_fullres + fullres_images.length - 1) % fullres_images.length;
            fullimage = document.getElementById('fullimage');
            fullimage.src = fullres_images[selected_fullres];
        }
        else if (event.keyCode === 39) { // right arrow key
            selected_fullres = (selected_fullres + fullres_images.length + 1) % fullres_images.length;
            fullimage = document.getElementById('fullimage');
            fullimage.src = fullres_images[selected_fullres];
        }
        else if (event.keyCode === 27) { // esc key
            lightbox = document.getElementById('lightbox');
            lightbox.style.display = 'none';
        }
    }
}