const fs = require('fs')
const Island = require('./manageDb')





async function main() {
  // Get all the metadata on the db
  const docs = await Island.find({})
  console.log(docs)
  }

main()



/*

				<div>
					<div class="thumbnail-row">
						<a target="_blank" rel="noopener noreferrer" href="pano-viewer.html?img=100_0478" onclick="countUp()"><img class="thumbnail" src="media/thumbnails/100_047	8.webp" alt="Drone Media Here"></a>
					</div>
					<div class="media-info-grid">
						<div class="author-picture">
							<img class="profile-picture" src="media/author_pictures/wrangel.svg" alt="Channel Picture Here">
						</div>
						<div>
							<p class="media-title">Törbeltälli &#183; Switzerland</p>
							<p class="media-stats">2023-02-15 &#183; 14:59</p>
							<p id="media-counter"></p>
						</div>
					</div>
				</div>

*/
