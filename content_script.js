// Write a message to the console
console.log('%c🧑‍💻 YT Comments Crawler: Extension loaded.', 'background-color: lightgreen;');

// Create a button element
const button = document.createElement('button');

// Add an ID attribute to the button
button.setAttribute('id', 'btn-crawl-comments');

button.innerText = '⏬';
button.title = 'Crawl comments';

// Style the button
button.style.position = 'fixed';
button.style.opacity = 0.7;
button.style.bottom = 0;
button.style.left = 0;
button.style.background = 'var(--yt-spec-brand-background-secondary)';
button.style.color = 'var(--yt-spec-icon-active-other)';
button.style.border = '1px solid var(--yt-spec-brand-background-primary)';
button.style.borderRadius = '2px';
button.style.padding = '4px 4px';
button.style.cursor = 'pointer';
button.style.fontSize = '2em';
button.style.transition = 'background 0.2s ease-in-out';
button.style.textDecoration = 'none';

document.body.appendChild(button);

// Attach a click listener to a button
document.querySelector('#btn-crawl-comments').addEventListener('click', async () => {
    // Write a warning message to the console
    console.log('%c🧑‍💻 YT Comments Crawler: Button clicked.', 'background-color: lightgreen;');

    // Get the video ID from the current URL
    const videoId = window.location.search.split('v=')[1];
    console.log(`%c🧑‍💻 YT Comments Crawler: videoId: ${videoId}`, 'background-color: lightgreen;');

    // Get the video title from the page title and remove the " - YouTube" suffix
    const videoTitle = document.title.replace(' - YouTube', '').trim().replace(/[^a-zA-Z0-9 ]/g, '').replace(/\s+/g, ' ');
    console.log(`%c🧑‍💻 YT Comments Crawler: videoTitle: ${videoTitle}`, 'background-color: lightgreen;');

    button.innerText = '⏳';
    button.title = 'Crawling...';

    // Scroll to the bottom of the page to load all comments
    let lastHeight = 0;
    while (true) {
        window.scrollTo(0, document.documentElement.scrollHeight);
        await new Promise(resolve => setTimeout(resolve, 1000));
        const newHeight = document.documentElement.scrollHeight;
        if (newHeight === lastHeight) {
            break;
        }
        lastHeight = newHeight;
    }

    // Comments extraction and saving into csv

    // Get the comment elements from the current page DOM
    const commentElements = document.querySelectorAll('#contents #content-text');

    // Get the total number of comments
    const totalComments = commentElements.length;
    // console.log(`%c🧑‍💻 YT Comments Crawler: totalComments: ${totalComments}`, 'background-color: lightgreen;');

    // Convert the comment elements to an array of comment objects
    const comments = [];
    for (const commentElement of commentElements) {
        const comment = {};
        comment.text = commentElement.textContent.trim().replace(/\n/g, ' ').replace(/"/g, '""').replace(/'/g, "''");

        const commentBody = commentElement.closest('#comment');
        const commentAuthor = commentBody.querySelector('#author-text');
        comment.author = commentAuthor.textContent.trim().replace(/"/g, '""').replace(/'/g, "''");

        const commentInfo = commentBody.querySelector('#vote-count-middle');
        comment.likes = commentInfo.textContent.trim().replace(/"/g, '""').replace(/'/g, "''");

        comments.push(comment);
    }

    // Sort the comments by likes
    comments.sort((a, b) => b.likes - a.likes);

    // Convert the comments to a CSV string
    const headers = ['Text', 'Author', 'Likes'];
    const rows = comments.map(comment => [comment.text, comment.author, comment.likes]);
    const csv = [headers, ...rows].map(row => row.map(value => `"${value}"`).join(',')).join('\n');
    // console.log(`csv: ${csv}`);

    // Create a Blob from the CSV string
    const blob = new Blob([csv], { type: 'text/csv' });

    // Create a link element to download the CSV file
    const link = document.createElement('a');
    const fileName = `${videoTitle} [${videoId}]`;
    link.download = `${fileName}.csv`;
    link.href = URL.createObjectURL(blob);

    // Click the link to download the CSV file
    link.click();
    button.innerText = `↩️`;
    button.title = `Crawl again`;
});