const imageContainer = document.getElementById('image-container');
const goodZone = document.getElementById('good-zone');
const mediocreZone = document.getElementById('mediocre-zone');
const badZone = document.getElementById('bad-zone');

let draggedImage = null; // Variable to store the dragged image

// Function to generate a random number between min and max (inclusive)
function getRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Function to generate a random image name based on the given criteria
function generateRandomImage(prefix) {
    const randomNumber = getRandomNumber(1, 15);
    return `Randomize/${prefix} (${randomNumber}).jpg`;
}

// Generate 5 images starting with 'g', 5 starting with 'm', and 5 starting with 'b'
const images = [];
for (let i = 0; i < 5; i++) {
    images.push(generateRandomImage('g'));
    images.push(generateRandomImage('m'));
    images.push(generateRandomImage('b'));
}

// Function to create image element
function createImageElement(src) {
    const img = document.createElement('img');
    img.src = src;
    img.draggable = true; // Make the images draggable
    img.addEventListener('dragstart', dragStart);
    return img;
}


// Create and append images to the container
images.forEach(image => {
    const img = createImageElement(image);
    imageContainer.appendChild(img);
});

// Store the generated images in sessionStorage
sessionStorage.setItem('generatedImages', JSON.stringify(images));


// Event listener for drag start
function dragStart(event) {
    draggedImage = event.target;
}

// Event listeners for drop zones
goodZone.addEventListener('dragover', dragOver);
mediocreZone.addEventListener('dragover', dragOver);
badZone.addEventListener('dragover', dragOver);

goodZone.addEventListener('drop', drop);
mediocreZone.addEventListener('drop', drop);
badZone.addEventListener('drop', drop);

// Event listeners for image container
imageContainer.addEventListener('dragover', dragOverImageContainer);
imageContainer.addEventListener('drop', dropImageContainer);

function dragOver(event) {
    event.preventDefault();
}

function drop(event) {
    event.preventDefault();
    const imageUrl = draggedImage.src;
    const img = createImageElement(imageUrl);
    img.style.maxWidth = '100%'; // Ensure the image doesn't exceed the drop zone width
    img.style.maxHeight = '100%'; // Ensure the image doesn't exceed the drop zone height

    // Check if the drop target is an image within a drop zone
    if (event.target.tagName === 'IMG' && event.target.parentNode.classList.contains('dropzone')) {
        // Get the drop zone element
        const dropZone = event.target.parentNode;

        // Get the position of the mouse pointer during the drop event
        const rect = event.target.getBoundingClientRect();
        const mouseY = event.clientY - rect.top;

        // Append the dragged image before or after the target image based on mouse position
        if (mouseY < rect.height / 2) {
            dropZone.insertBefore(img, event.target);
        } else {
            dropZone.insertBefore(img, event.target.nextSibling);
        }
    } else {
        // If the drop target is not an image within a drop zone, append the dragged image to the drop zone
        event.target.appendChild(img);
    }

    // Remove the dragged image from the container
    draggedImage.remove();

    // Update and display image counts
    updateAndDisplayImageCounts();
}

function dragOverImageContainer(event) {
    event.preventDefault();
}

function dropImageContainer(event) {
    event.preventDefault();
    const imageUrl = draggedImage.src;
    const img = createImageElement(imageUrl);
    img.style.maxWidth = '100%'; // Ensure the image doesn't exceed the container width
    img.style.maxHeight = '100%'; // Ensure the image doesn't exceed the container height
    imageContainer.appendChild(img);
    draggedImage.remove(); // Remove the dragged image from the drop zone

    // Update and display image counts
    updateAndDisplayImageCounts();
}

// Function to update and display image counts
function updateAndDisplayImageCounts() {
    console.clear();
    console.log('Good zone picture count:', countImagesInZone('good'));
    console.log('Mediocre zone picture count:', countImagesInZone('mediocre'));
    console.log('Bad zone picture count:', countImagesInZone('bad'));
}

// Function to count images in a specific zone
function countImagesInZone(zone) {
    let count = 0;
    const zoneElement = document.getElementById(`${zone}-zone`);
    zoneElement.querySelectorAll('img').forEach(img => {
        const prefix = img.src.split('/')[1].split(' ')[0];
        if (prefix === zone.charAt(0)) {
            count++;
        }
    });
    return count;
}

// Function to count total images with prefix 'g', 'm', and 'b'
function countTotalImages() {
    let goodCount = 0;
    let mediocreCount = 0;
    let badCount = 0;

    images.forEach(image => {
        const prefix = image.split('/')[1].split(' ')[0];
        if (prefix === 'g') {
            goodCount++;
        } else if (prefix === 'm') {
            mediocreCount++;
        } else if (prefix === 'b') {
            badCount++;
        }
    });

    console.log('Total Good Images:', goodCount);
    console.log('Total Mediocre Images:', mediocreCount);
    console.log('Total Bad Images:', badCount);
}

document.addEventListener('DOMContentLoaded', function() {
    // Parse query parameters to get the timer value and player name
    const params = new URLSearchParams(window.location.search);
    const timer = parseInt(params.get('timer'));
    const playerName = params.get('name');

    // Function to display custom modal with a button to navigate to the next page
    function displayModal(message) {
        const modal = document.createElement('div');
        modal.classList.add('modal');
        modal.setAttribute('id', 'myModal');

        const modalContent = document.createElement('div');
        modalContent.classList.add('modal-content');

        const messageElement = document.createElement('p');
        messageElement.textContent = message;

        const closeButton = document.createElement('button');
        closeButton.textContent = 'Next';
        closeButton.addEventListener('click', () => {
            // Count images in each zone and redirect to Reward.html
            countAndRedirect();
        });

        modalContent.appendChild(messageElement);
        modalContent.appendChild(closeButton);
        modal.appendChild(modalContent);

        document.body.appendChild(modal);
    }

    // Function to count images in each zone after the modal shows up and update the counts
function countAndRedirect() {
    // Count images in each zone based on the specified criteria
    const goodCount = countImagesInZoneWithPrefix('good', 'g');
    const mediocreCount = countImagesInZoneWithPrefix('mediocre', 'm');
    const badCount = countImagesInZoneWithPrefix('bad', 'b');

    // Store counts in sessionStorage
    sessionStorage.setItem('imageCounts', JSON.stringify({ goodCount, mediocreCount, badCount }));

    // Log the updated counts
    console.log('Updated Good Zone Picture Count:', goodCount);
    console.log('Updated Mediocre Zone Picture Count:', mediocreCount);
    console.log('Updated Bad Zone Picture Count:', badCount);

    // Redirect to Reward.html
    // window.location.href = 'Reward.html';
    // Pass timer value and player name to next page as query parameters
                window.location.href = "Reward.html?name=" + playerName;
                e.preventDefault();
}

// Function to count images in a specific zone with a specific prefix
function countImagesInZoneWithPrefix(zone, prefix) {
    let count = 0;
    const zoneElement = document.getElementById(`${zone}-zone`);
    zoneElement.querySelectorAll('img').forEach(img => {
        const imageSrc = img.src;
        const imageName = imageSrc.substring(imageSrc.lastIndexOf('/') + 1);
        if (imageName.startsWith(prefix)) {
            count++;
        }
    });
    return count;
}

    // Function to start the timer
    function startTimer(duration, display) {
        let timer = duration, minutes, seconds;
        const intervalId = setInterval(function () {
            minutes = parseInt(timer / 60, 10);
            seconds = parseInt(timer % 60, 10);

            minutes = minutes < 10 ? "0" + minutes : minutes;
            seconds = seconds < 10 ? "0" + seconds : seconds;

            display.textContent = minutes + ":" + seconds;

            if (--timer < 0) {
                clearInterval(intervalId);
                // Display custom modal when timer runs out
                displayModal('Time is up! Click "Next" to proceed to the next page.');
            }
        }, 1000);
    }

    // Function to initialize timer
    function initializeTimer() {
        const display = document.querySelector('#timer');
        startTimer(timer, display);
    }

    // Initialize timer
    if (!isNaN(timer)) {
        initializeTimer();
    }

    // Display player name
    if (playerName) {
        const nameDisplay = document.querySelector('#name-display');
        nameDisplay.textContent = "Name: " + playerName;
    }

    // Display total image counts on page load
    countTotalImages();
});

