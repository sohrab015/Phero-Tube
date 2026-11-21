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
            "cursor-pointer",
            "sm:max-w-[250px]"
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

                <label for="modal-${show.id}" class="btn mt-3 btn-block">Show Details</label>
                <input type="checkbox" id="modal-${show.id}" class="modal-toggle" />
                <div class="modal" role="dialog">
                    <div class="modal-box">
                        <h3 class="text-lg font-bold">${show.name}!</h3>
                        <div class="py-4">${show.summary || "No Summary Available"}</div>
                    </div>
                    <label class="modal-backdrop" for="modal-${show.id}">Close</label>
                </div>
                
                <button class="btn mt-3 btn-block show-details-btn">Official Web</button>

            </div>
        `;

        // Click Event

        const officialBtn = card.querySelector(".show-details-btn");

        officialBtn.addEventListener("click", function () {
            openOfficialWebsite(show);
        });

        videoContainer.appendChild(card);

    });

}

//search function

async function searchShows() {

    const searchInput = document.getElementById("search-input");

    const searchText = searchInput.value.trim();

    if (searchText === "") {
        alert("Please enter a show name!");
        return;
    }

    try {

        videoContainer.innerHTML = `
            <p class="col-span-full text-center">
                Searching...
            </p>
        `;

        const response = await fetch(
            `https://api.tvmaze.com/search/shows?q=${encodeURIComponent(searchText)}`
        );

        if (!response.ok) {
            throw new Error("Search failed");
        }

        const data = await response.json();

        // Extract show objects
        const searchResults = data.map(item => item.show);

        if (searchResults.length === 0) {
            videoContainer.innerHTML = `
                <p class="col-span-full text-center">
                    No Shows Found!
                </p>
            `;
            return;
        }

        displayShows(searchResults);



    } catch (error) {

        console.error(error);

        videoContainer.innerHTML = `
            <p class="col-span-full text-center text-red-500">
                Search Failed!
            </p>
        `;
    }
}

const searchBtn = document.getElementById("search-btn");

searchBtn.addEventListener("click", searchShows);



// 6. Run Application
fetchShows();
