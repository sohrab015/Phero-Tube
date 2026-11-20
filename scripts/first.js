function loadCategories() {

    // featch the data

    fetch("https://api.tvmaze.com/shows?page=0&utm_source=chatgpt.com")
        .then((res) => res.json())
        .then((data) => {
            displayCatagory(data)
        })
}

function displayCatagory(apiArray) {

    //get the container

    const categoryContainer = document.getElementById("catagory-container");

    //loop oparetion on array of object

    for (let i of apiArray) {

        //create element

        const categoryDiv = document.createElement("button");

        categoryDiv.innerHTML = `
        <button class="btn btn-sm hover:bg-[#FF1F3D] hover:text-white hover:border-none hover:font-bold hover:transform-gpu">
        <a href="#${i.id}">${i.id} - ${i.name}</a>
        </button>
        `
        categoryContainer.appendChild(categoryDiv);
    }

}
















//========================== featching the videos=============

function loadVideos() {
    fetch("https://api.tvmaze.com/shows?page=0&utm_source=chatgpt.com")
        .then((res) => res.json())
        .then((data) => {
            displayVideos(data);
        })

};


const displayVideos = (videos) => {

    const videoContainer = document.getElementById("video-container");

    videoContainer.innerHTML = "";

    videos.forEach((video) => {

        const videoCard = document.createElement("div");

        // Handle missing image
        const imageUrl = video.image?.original ||
            video.image?.medium ||
            "https://placehold.co/600x400?text=No+Image";

        // Handle missing website
        const website = video.network?.officialSite ||
            video.webChannel?.officialSite ||
            video.url ||
            "#";

        // Handle missing summary
        const summary = video.summary || "No description available.";

        //get the id
        const id = video.id;

        videoCard.innerHTML = `

        <div id="${id}" class="card bg-base-100 shadow-sm h-full">

            <figure>
                <img
                    src="${imageUrl}"
                    alt="${video.name}"
                    class="w-full h-52 object-cover"
                />
            </figure>

            <div class="card-body">

                <h2 class="card-title">
                    ${video.name}
                </h2>

                <p class="line-clamp-3">
                    ${summary}
                </p>

                <div class="card-actions justify-end mt-auto">

                    <a href="${website}" target="_blank" class="btn btn-primary">Official Website</a>

                </div>

            </div>

        </div>
    `;

        videoContainer.appendChild(videoCard);

    });

    console.log("Total videos:", videos.length);
};


















loadCategories();
loadVideos();