const beerButton = document.getElementById("beerBtn");
const loading = document.getElementById("loading");
const result = document.getElementById("result");
const tagline = document.querySelector(".tagline");

const breweryName = document.getElementById("breweryName");
const distance = document.getElementById("distance");
const beerName = document.getElementById("beerName");

const differentBeerButton = document.getElementById("differentBeerBtn");
const differentPlaceButton = document.getElementById("differentPlaceBtn");
const directionsButton = document.getElementById("directionsBtn");

/*
    Starter Portland-area list.

    These coordinates are suitable for the prototype, but verify them
    before treating this as production location data.
*/
const beerSpots = [
    {
        name: "Allagash Brewing Company",
        address: "50 Industrial Way, Portland, ME 04103",
        latitude: 43.7032,
        longitude: -70.3198,
        beers: [
            "Allagash White",
            "Allagash Tripel",
            "Allagash Hazy IPA",
            "Curieux",
            "Allagash Lager",
            "North Sky",
            "Honey Saison",
            "Saison",
            "Maine Blueberry Ale",
            "Clementine Kölsch"
        ]
    },
    {
        name: "Definitive Brewing Company",
        address: "35 Industrial Way, Portland, ME 04103",
        latitude: 43.7028,
        longitude: -70.3184,
        beers: [
            "Contee Kölsch",
            "Try a hazy Maine IPA",
            "Try a double-fruited sour",
            "Try a crispy lager",
            "Try a pastry stout",
            "Ask for the new release"
        ]
    },
    {
        name: "Foundation Brewing Company",
        address: "1 Industrial Way, Suite 7, Portland, ME 04103",
        latitude: 43.7019,
        longitude: -70.3207,
        beers: [
            "Epiphany",
            "Raspberry's My Jam",
            "Fetch",
            "Vienna Lager",
            "Forest City",
            "Tailwind IPA",
            "Afterglow",
            "Riverton Flyer"
        ]
    },
    {
        name: "Austin Street Brewery",
        address: "115 Fox Street, Portland, ME 04101",
        latitude: 43.6687,
        longitude: -70.2532,
        beers: [
            "Patina",
            "Paseo",
            "Austin Street Lager",
            "Try the house IPA",
            "Try a seasonal sour",
            "Ask for the new release"
        ]
    }
];

let userLatitude = null;
let userLongitude = null;

let sortedBeerSpots = [];
let currentPlaceIndex = 0;
let currentBeerIndex = 0;

beerButton.addEventListener("click", findBeer);
differentBeerButton.addEventListener("click", showDifferentBeer);
differentPlaceButton.addEventListener("click", showDifferentPlace);
directionsButton.addEventListener("click", openDirections);

function findBeer() {
    beerButton.classList.add("hidden");
    tagline.classList.add("hidden");
    result.classList.add("hidden");
    loading.classList.remove("hidden");

    if (!navigator.geolocation) {
        showLocationError("Your browser does not support location services.");
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

    sortedBeerSpots = beerSpots
        .map((spot) => {
            return {
                ...spot,
                distanceMiles: calculateDistanceMiles(
                    userLatitude,
                    userLongitude,
                    spot.latitude,
                    spot.longitude
                )
            };
        })
        .sort((a, b) => a.distanceMiles - b.distanceMiles);

    currentPlaceIndex = 0;
    currentBeerIndex = 0;

    setTimeout(() => {
        loading.classList.add("hidden");
        showCurrentRecommendation();
        result.classList.remove("hidden");
    }, 1200);
}

function locationError(error) {
    let message = "We couldn't get your location.";

    if (error.code === error.PERMISSION_DENIED) {
        message = "Please allow location access so we can find beer nearby.";
    } else if (error.code === error.POSITION_UNAVAILABLE) {
        message = "Your location is currently unavailable.";
    } else if (error.code === error.TIMEOUT) {
        message = "Getting your location took too long. Please try again.";
    }

    showLocationError(message);
}

function showLocationError(message) {
    loading.classList.add("hidden");
    result.classList.add("hidden");
    beerButton.classList.remove("hidden");
    tagline.classList.remove("hidden");

    alert(message);
}

function showCurrentRecommendation() {
    const currentSpot = sortedBeerSpots[currentPlaceIndex];

    if (!currentSpot) {
        breweryName.textContent = "No beer spots found";
        distance.textContent = "";
        beerName.textContent = "";
        return;
    }

    breweryName.textContent = currentSpot.name;

    distance.textContent =
        `${currentSpot.distanceMiles.toFixed(1)} miles away`;

    beerName.textContent =
        currentSpot.beers[currentBeerIndex];
    
    requestAnimationFrame(fitBeerName);
}

function showDifferentBeer() {
    const currentSpot = sortedBeerSpots[currentPlaceIndex];

    if (!currentSpot) {
        return;
    }

    currentBeerIndex =
        (currentBeerIndex + 1) % currentSpot.beers.length;

    showCurrentRecommendation();
}

function showDifferentPlace() {
    if (sortedBeerSpots.length === 0) {
        return;
    }

    currentPlaceIndex =
        (currentPlaceIndex + 1) % sortedBeerSpots.length;

    currentBeerIndex = 0;

    showCurrentRecommendation();
}


function openDirections() {
    const currentSpot = sortedBeerSpots[currentPlaceIndex];

    if (!currentSpot) {
        alert("Choose a beer spot first.");
        return;
    }

    const destination = encodeURIComponent(
        `${currentSpot.name}, ${currentSpot.address}`
    );

    const mapsUrl =
        `https://www.google.com/maps/dir/?api=1&destination=${destination}`;

    window.open(mapsUrl, "_blank", "noopener");
}

/*
    Haversine formula:
    calculates straight-line distance between two GPS coordinates.
*/
function calculateDistanceMiles(lat1, lon1, lat2, lon2) {
    const earthRadiusMiles = 3958.8;

    const latitudeDifference = degreesToRadians(lat2 - lat1);
    const longitudeDifference = degreesToRadians(lon2 - lon1);

    const a =
        Math.sin(latitudeDifference / 2) ** 2 +
        Math.cos(degreesToRadians(lat1)) *
        Math.cos(degreesToRadians(lat2)) *
        Math.sin(longitudeDifference / 2) ** 2;

    const c =
        2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return earthRadiusMiles * c;
}

function degreesToRadians(degrees) {
    return degrees * (Math.PI / 180);
}
function fitBeerName() {
    // Reset to the normal CSS size before measuring
    beerName.style.fontSize = "";

    let fontSize =
        parseFloat(window.getComputedStyle(beerName).fontSize);

    const minimumFontSize = 24;

    while (
        beerName.scrollWidth > beerName.clientWidth &&
        fontSize > minimumFontSize
    ) {
        fontSize -= 1;
        beerName.style.fontSize = `${fontSize}px`;
    }
}
