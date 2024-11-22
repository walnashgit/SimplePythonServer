document.addEventListener('DOMContentLoaded', function() {
    const animalCheckboxes = document.querySelectorAll('input[name="animal"]');
    const selectedImages = document.getElementById('selected-images');
    const fileInput = document.getElementById('file-input');
    const fileInfo = document.getElementById('file-info');
    const spinner = document.getElementById('spinner');

    animalCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', updateSelectedImages);
    });

    fileInput.addEventListener('change', uploadFile);

    function updateSelectedImages() {
        selectedImages.innerHTML = '';
        animalCheckboxes.forEach(checkbox => {
            if (checkbox.checked) {
                fetchImage(checkbox.value);
            }
        });
    }

    function fetchImage(animal) {
        const formData = new FormData();
        formData.append('animal', animal);

        fetch('/get_image', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            if (data.image_url) {
                const img = document.createElement('img');
                img.src = data.image_url;
                img.alt = animal;
                selectedImages.appendChild(img);
            } else {
                console.error('Failed to fetch image:', data.error);
            }
        })
        .catch(error => console.error('Error:', error));
    }

    function uploadFile() {
        const file = fileInput.files[0];
        if (file) {
            const formData = new FormData();
            formData.append('file', file);

            // Show spinner
            spinner.classList.remove('hidden');
            fileInfo.innerHTML = '';

            fetch('/upload_file', {
                method: 'POST',
                body: formData
            })
            .then(response => response.json())
            .then(data => {
                // Hide spinner
                spinner.classList.add('hidden');

                if (data.error) {
                    fileInfo.innerHTML = `<p class="error">${data.error}</p>`;
                } else {
                    fileInfo.innerHTML = `
                        <p><strong>Name:</strong> ${data.name}</p>
                        <p><strong>Type:</strong> ${data.type}</p>
                        <p><strong>Size:</strong> ${data.size}</p>
                    `;
                }
            })
            .catch(error => {
                // Hide spinner
                spinner.classList.add('hidden');

                console.error('Error:', error);
                fileInfo.innerHTML = '<p class="error">An error occurred while uploading the file.</p>';
            });
        } else {
            fileInfo.innerHTML = '';
        }
    }
});
