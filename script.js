let API_KEY = "API_KEY";

document.addEventListener("DOMContentLoaded", function () {
  const linkInput = document.getElementById("linkInput");
  const submitButton = document.getElementById("submitButton");
  const result = document.getElementById("result");

  submitButton.addEventListener("click", function () {
    const inputText = linkInput.value.trim();
    if (inputText === "") {
      result.innerHTML = "Please enter a link.";
      return;
    }
    // match
    const youtubeRegex =
      /^(https?:\/\/)?(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]+)(\S+)?$/;
    const twitterRegex =
      /^(https?:\/\/)?(www\.)?twitter\.com\/[a-zA-Z0-9_]+\/status\/[0-9]+$/;

    // if youtube vedo
    if (youtubeRegex.test(inputText)) {
      function extractVideoIdFromUrl(url) {
        let videoId = "";

        const patterns = [
          /youtube\.com\/watch\?v=([A-Za-z0-9_-]+)/,
          /youtu.be\/([A-Za-z0-9_-]+)/,
          /youtube.com\/embed\/([A-Za-z0-9_-]+)/,
          /youtube-nocookie.com\/embed\/([A-Za-z0-9_-]+)/,
        ];

        for (const pattern of patterns) {
          const match = url.match(pattern);
          if (match && match[1]) {
            videoId = match[1];
            break;
          }
        }

        return videoId;
      }

      const youtubeUrl = linkInput.value;
      const videoId = extractVideoIdFromUrl(youtubeUrl);
      //   console.log("Video ID:", videoId);

      // vedio id extraction ends

      fetch(
        `https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${videoId}&key=${API_KEY}`
      )
        .then((response) => response.json())
        .then((data) => {
          if (data.items && data.items.length > 0) {
            const videoTitle = data.items[0].snippet.title;
            const videodescription = data.items[0].snippet.description;
            const videoThumbnail = data.items[0].snippet.thumbnails.medium.url;

            // Display video thumbnail and title
            result.innerHTML = `<img src="${videoThumbnail}" alt="${videoTitle}"><br>${videoTitle}<br> <br>${videodescription}`;
          } else {
            result.innerHTML = "Unable to retrieve video information.";
          }
        })
        .catch((error) => {
          console.error("Error fetching video information:", error);
          result.innerHTML =
            "An error occurred while fetching video information.";
        });
    }
    // if twittter
    else if (twitterRegex.test(inputText)) {
      result.innerHTML = "You've pasted a Twitter tweet link.";
    } else {
      result.innerHTML = "The link type is not identified.";
    }
  });
});
