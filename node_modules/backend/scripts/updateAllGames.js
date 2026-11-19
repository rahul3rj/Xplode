const { updateGamesInDB } = require('./updateHomeGames');
const { updateCommunityGamesInDB } = require('./updateCommunityGames');

async function updateAllGames() {
  try {
    console.log("🔄 Starting home games update...");
    await updateGamesInDB();
    
    console.log("🔄 Starting community games update...");
    await updateCommunityGamesInDB();
    
    console.log("🎉 All game updates completed successfully!");
  } catch (error) {
    console.error("❌ Error updating games:", error);
  }
}

// Run if called directly
if (require.main === module) {
  updateAllGames();
}

module.exports = { updateAllGames };