const beerButton = document.getElementById("beerBtn");
const loading = document.getElementById("loading");
const result = document.getElementById("result");

const breweryName = document.getElementById("breweryName");
const distance = document.getElementById("distance");
const beerName = document.getElementById("beerName");

const againButton = document.getElementById("againBtn");
const differentBeerButton = document.getElementById("differentBeerBtn");
const differentPlaceButton = document.getElementById("differentPlaceBtn");
const directionsButton = document.getElementById("directionsBtn");

let userLatitude = null;
let userLongitude = null;

beerButton.addEventListener("click", findLocation);

function findLocation() {
    beerButton.classList.add("hidden");
    document.querySelector(".tagline").classList.add("hidden");
    result.classList.add("hidden");

    loading.classList.remove("hidden");

    if (!navigator.geolocation) {
        locationError({
            code: 0
        });

        return;
    }

    navigator.geolocation.getCurrentPosition(
        locationSuccess,
        locationError,
        {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 60000
        }
    );
}

function locationSuccess(position) {
    userLatitude = position.coords.latitude;
    userLongitude = position.coords.longitude;

    console.log("Latitude:", userLatitude);
    console.log("Longitude:", userLongitude);

    setTimeout(() => {
        loading.classList.add("hidden");

        breweryName.textContent = "Your Location Was Found";

        distance.textContent =
            `Latitude: ${userLatitude.toFixed(4)}, ` +
            `Longitude: ${userLongitude.toFixed(4)}`;

        beerName.textContent =
            "Nearby beer lookup is the next step.";

        result.classList.remove("hidden");
    }, 1200);
}

function locationError(error) {
    loading.classList.add("hidden");
    result.classList.add("hidden");

    beerButton.classList.remove("hidden");
    document.querySelector(".tagline").classList.remove("hidden");

    let message = "We couldn't get your location.";

    if (error.code === 1) {
        message =
            "Please allow location access so we can find beer nearby.";
    } else if (error.code === 2) {
        message =
            "Your location is currently unavailable.";
    } else if (error.code === 3) {
        message =
            "Getting your location took too long. Please try again.";
    } else if (!navigator.geolocation) {
        message =
            "Your browser does not support location services.";
    }

    alert(message);
}

againButton.addEventListener("click", findLocation);

differentBeerButton.addEventListener("click", () => {
    beerName.textContent =
        "Try another local favorite.";
});

differentPlaceButton.addEventListener("click", () => {
    breweryName.textContent =
        "Finding another nearby beer spot...";

    beerName.textContent =
        "A real location lookup will be added next.";
});

directionsButton.addEventListener("click", () => {
    if (userLatitude === null || userLongitude === null) {
        alert("Your location has not been found yet.");
        return;
    }

    const mapsUrl =
        `https://www.google.com/maps/search/?api=1&query=` +
        `${userLatitude},${userLongitude}`;

    window.open(mapsUrl, "_blank");
});
