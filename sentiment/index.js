const express = require("express");
const natural = require("natural");

const app = express();
app.use(express.json()); // To parse JSON request bodies

// POST /sentiment endpoint
app.post("/sentiment", (req, res) => {
    try {
        // Extract sentence parameter from the request body
        const { sentence } = req.body;

        // Check if the sentence is provided
        if (!sentence) {
            return res.status(400).json({ error: "Sentence parameter is required." });
        }

        // Process the response using Natural Sentiment Analysis
        const analyzer = new natural.SentimentAnalyzer("English", natural.PorterStemmer, "afinn");
        const sentimentScore = analyzer.getSentiment(sentence.split(" "));

        let sentiment = "neutral";

        // Determine sentiment based on score
        if (sentimentScore < 0) {
            sentiment = "negative";
        } else if (sentimentScore > 0.33) {
            sentiment = "positive";
        }

        // Return the success response
        res.status(200).json({
            sentimentScore: sentimentScore,
            sentiment: sentiment,
        });
    } catch (error) {
        // Handle errors
        console.error("Error analyzing sentiment:", error);
        res.status(500).json({ error: "Something went wrong with sentiment analysis." });
    }
});

// Start the server
const port = 3000;
app.listen(port, () => {
    console.log(`Sentiment Analysis service running on port ${port}`);
});
