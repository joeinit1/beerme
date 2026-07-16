const beerButton = document.getElementById("beerBtn");
const loading = document.getElementById("loading");
const result = document.getElementById("result");

const breweryName = document.getElementById("breweryName");
const distance = document.getElementById("distance");
const beerName = document.getElementById("beerName");

beerButton.addEventListener("click", () => {
    beerButton.classList.add("hidden");
    document.querySelector(".tagline").classList.add("hidden");

    loading.classList.remove("hidden");

    navigator.geolocation.getCurrentPosition(
        locationSuccess,
        locationError,
        {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 60000
        }
    );
});

function locationSuccess(position) {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;

    console.log("Latitude:", latitude);
    console.log("Longitude:", longitude);

    // Temporary prototype result
    setTimeout(() => {
        loading.classList.add("hidden");

        breweryName.textContent = "Your Nearest Beer Spot";
        distance.textContent = "Location found";
        beerName.textContent = "Ask for the local favorite.";

        result.classList.remove("hidden");
    }, 1200);
}

function locationError(error) {
    loading.classList.add("hidden");
    beerButton.classList.remove("hidden");
    document.querySelector(".tagline").classList.remove("hidden");

    let message = "We couldn't get your location.";

    if (error.code === error.PERMISSION_DENIED) {
        message = "Please allow location access so we can find beer nearby.";
    } else if (error.code === error.POSITION_UNAVAILABLE) {
        message = "Your location is currently unavailable.";
    } else if (error.code === error.TIMEOUT) {
        message = "Getting your location took too long. Please try again.";
    }

    alert(message);
}
