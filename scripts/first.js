"use strict";

// DOM Elements
const categoryContainer = document.getElementById("catagory-container");
const videoContainer = document.getElementById("video-container");

// API URL
const API_URL = "https://api.tvmaze.com/shows";

// Store all shows
let allShows = [];


// 1. Fetch API Data
async function fetchShows() {
    try {

        videoContainer.innerHTML = `
            <p class="col-span-full text-center text-lg">
                Loading Shows...
            </p>
        `;

        const response = await fetch(API_URL);

        if (!response.ok) {
            throw new Error("Failed to fetch API data");
        }

        allShows = await response.json();

        // Display Categories
        displayCategories();

        // Display All Shows
        displayShows(allShows);

    } catch (error) {

        console.error("Error:", error);

        videoContainer.innerHTML = `
            <p class="col-span-full text-center text-red-500">
                Failed to load shows. Please try again.
            </p>
        `;
    }
}


// 2. Get Unique Categories
function getCategories() {

    const categories = [
        ...new Set(
            allShows.flatMap(show => show.genres || [])
        )
    ];

    return categories;
}


// 3. Display Category Buttons
function displayCategories() {

    const categories = getCategories();

    categoryContainer.innerHTML = "";

    // All Button
    const allButton = document.createElement("button");

    allButton.innerText = "All";

    allButton.className =
        "btn btn-sm border-none bg-[#FF1F3D] text-white";

    allButton.addEventListener("click", () => {

        setActiveButton(allButton);

        displayShows(allShows);

    });

    categoryContainer.appendChild(allButton);


    // Other Category Buttons
    categories.forEach(category => {

        const button = document.createElement("button");

        button.innerText = category;

        button.className =
            "btn btn-sm border-none bg-gray-200 text-black";

        button.addEventListener("click", () => {

            setActiveButton(button);

            const filteredShows = allShows.filter(show =>
                show.genres?.includes(category)
            );

            displayShows(filteredShows);

        });

        categoryContainer.appendChild(button);

    });

}


// 4. Active Button Style
function setActiveButton(activeButton) {

    const buttons = categoryContainer.querySelectorAll("button");

    buttons.forEach(button => {

        button.className =
            "btn btn-sm border-none bg-gray-200 text-black";

    });

    activeButton.className =
        "btn btn-sm border-none bg-[#FF1F3D] text-white";

}


//function for official website

function openOfficialWebsite(show) {

    const officialUrl = show.officialSite;

    if (officialUrl) {
        window.open(officialUrl, "_blank");
    }
    else {
        alert("Official website is not available!");
    }

}


// 5. Display Shows

function displayShows(shows) {

    videoContainer.innerHTML = "";

    shows.forEach(show => {

        const card = document.createElement("div");

        card.classList.add(
            "bg-white",
            "rounded-lg",
            "shadow-md",
            "overflow-hidden",
            "cursor-pointer"
        );

        card.innerHTML = `
            <img
                class="w-full h-[250px] object-cover"
                src="${show.image?.medium || "https://placehold.co/300x400"}"
                alt="${show.name}"
            >

            <div class="p-3">

                <h2 class="font-bold text-lg mb-2">
                    ${show.name}
                </h2>

                <p class="text-sm text-gray-500 mb-2">
                    ${show.genres?.join(", ") || "No Genre"}
                </p>

                <p class="text-sm font-semibold text-yellow-600">
                    ⭐ ${show.rating?.average ?? "N/A"}
                </p>

            </div>
        `;

        // Click Event
        card.addEventListener("click", function () {
            openOfficialWebsite(show);
        });

        videoContainer.appendChild(card);

    });

}



// 6. Run Application
fetchShows();
