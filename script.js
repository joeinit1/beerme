const beerBtn=document.getElementById("beerBtn");

const result=document.getElementById("result");

const brewery=document.getElementById("brewery");

const distance=document.getElementById("distance");

const beer=document.getElementById("beer");

const beerSuggestions={

"Bissell Brothers Brewing":[
"Substance IPA",
"Swish",
"Lux Lager"
],

"Allagash Brewing Company":[
"Allagash White",
"Curieux",
"Tripel"
],

"Foundation Brewing Company":[
"Epiphany IPA",
"Burnside",
"Afterglow"
]

};

let breweries=[];

let current=0;

beerBtn.onclick=()=>{

navigator.geolocation.getCurrentPosition(loadBreweries);

};

async function loadBreweries(position){

const lat=position.coords.latitude;

const lon=position.coords.longitude;

const query=`

[out:json];

(

node(around:15000,${lat},${lon})["craft"="brewery"];

way(around:15000,${lat},${lon})["craft"="brewery"];

);

out center;

`;

const url="https://overpass-api.de/api/interpreter";

const response=await fetch(url,{

method:"POST",

body:query

});

const data=await response.json();

breweries=data.elements;

pickRandom();

}

function pickRandom(){

if(breweries.length===0){

brewery.innerText="No breweries nearby.";

result.classList.remove("hidden");

return;

}

current=Math.floor(Math.random()*breweries.length);

showResult();

}

function showResult(){

const b=breweries[current];

const name=b.tags.name||"Unknown Brewery";

brewery.innerText=name;

distance.innerText="Nearby";

const beers=beerSuggestions[name]||

["Ask for the bartender's favorite beer!"];

beer.innerText=beers[0];

result.classList.remove("hidden");

}

document.getElementById("again").onclick=pickRandom;

document.getElementById("differentPlace").onclick=pickRandom;

document.getElementById("differentBeer").onclick=()=>{

const name=brewery.innerText;

const beers=beerSuggestions[name];

if(!beers)return;

beer.innerText=beers[Math.floor(Math.random()*beers.length)];

};
