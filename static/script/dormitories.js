async function fetchDormitoryData(numericId) {
    try {
        const response = await fetch(`/fetch-select-data/dormitories/${numericId}`);
        if (!response.ok) {
            throw new Error('Failed to fetch data');
        }
        return await response.json();
    } catch (error) {
        console.error(error);
    }
}

async function updateDormitoryDescription(numericId) {
    const dormitoryData = await fetchDormitoryData(numericId);

    const dormitory_id = `dormitory_${numericId}`;

    const dormitoryDescription = document.getElementById(dormitory_id);
    if (dormitoryData) {
        dormitoryDescription.querySelector('.address').textContent = dormitoryData.address;
        dormitoryDescription.querySelector('.phone').textContent = dormitoryData.phone_number;
        dormitoryDescription.querySelector('.residents').textContent = dormitoryData.type_residents;

        if (dormitoryData.price_id) {
            const priceResponse = await fetch(`/fetch-select-data/price/${dormitoryData.price_id}`);
            if (priceResponse.ok) {
                const priceData = await priceResponse.json();
                if (priceData && priceData.price_amount) {
                    dormitoryDescription.querySelector('.price').textContent = priceData.price_amount;
                }
            }
        }
    }
}

document.addEventListener("DOMContentLoaded", function () {
    var contentBoxes = document.querySelectorAll(".content__box");

    contentBoxes.forEach(function (box, index) {
        box.addEventListener("click", function () {
            var dormitoryId = `dormitory_${index + 1}`;
            var dormitoryContent = document.getElementById(dormitoryId);
            if (dormitoryContent) {
                dormitoryContent.style.display = (dormitoryContent.style.display === "none") ? "block" : "none";
                updateDormitoryDescription(index + 1);
            }
        });
    });

    var closers = document.querySelectorAll(".content-describtion__box-closer");

    closers.forEach(function (closer) {
        closer.addEventListener("click", function (event) {
            event.stopPropagation();
            var dormitoryIdToClose = closer.id.replace("closer_", "");
            var dormitoryContentToClose = document.getElementById("dormitory_" + dormitoryIdToClose);
            if (dormitoryContentToClose) {
                dormitoryContentToClose.style.display = "none";
            }
        });
    });
});
