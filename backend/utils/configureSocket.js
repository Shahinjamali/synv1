module.exports = function configureSocket(io, { OilAnalysis }) {
  io.on("connection", (socket) => {
    console.log(`🔧 Configuring WebSocket for Oil Analysis: ${socket.id}`);

    // Listen for Oil Analysis updates
    socket.on("fetchOilAnalysis", async (equipmentId) => {
      try {
        const analysisData = await OilAnalysis.find({ equipmentId }).limit(10);
        socket.emit("oilAnalysisData", analysisData);
      } catch (error) {
        console.error("❌ Error fetching oil analysis data:", error);
        socket.emit("error", "Failed to fetch oil analysis data.");
      }
    });
  });
};
