const Word = require('../models/wordModel');

const addWord = async (req, res) => {
  try {
    const { word, meaningHindi, pronunciation, example, synonyms, antonyms } = req.body;

    if (!word) {
      return res.status(400).json({ message: "Word is required." });
    }

    const existingWord = await Word.findOne({ word: word });

    if (existingWord) {
      return res.status(409).json({ message: "Word already exists." });
    }

    const wordData = { word, meaningHindi, pronunciation, example, synonyms, antonyms };
    const createdWord = await Word.create(wordData);

    res.status(201).json({
      message: 'Word added successfully',
      data: createdWord
    });
  } catch (error) {
    res.status(500).json({ message: 'Error adding word', error: error.message });
  }
};

const getAllWords = async (req, res) => {
  try {
    const words = await Word.find();
    res.status(200).json({
      message: 'Words fetched successfully',
      data: words
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching words', error: error.message });
  }
}

const searchWord = async (req, res) => {
  try {
    const targetWord = req.query.word || req.params.word || req.body.word;
    if (!targetWord) {
      return res.status(400).json({ message: "Word is required for search" });
    }

    const foundWord = await Word.findOne({ word: targetWord });

    if (!foundWord) {
      return res.status(404).json({ message: "Not found" });
    }

    res.status(200).json({ data: foundWord });
  } catch (error) {
    res.status(500).json({ message: "Error searching word", error: error.message });
  }
};

const updateWord = async (req, res) => {
  try {
    const targetWord = req.params.word;

    if (!targetWord) {
      return res.status(400).json({ message: "Word is required for update" });
    }

    const updatedWord = await Word.findOneAndUpdate(
      { word: targetWord },      // find condition
      req.body,                  // new data
      { new: true }              // return updated document
    );

    if (!updatedWord) {
      return res.status(404).json({ message: "Word not found" });
    }

    res.status(200).json({ data: updatedWord });

  } catch (error) {
    res.status(500).json({ message: "Error updating word", error: error.message });
  }
};

const deleteWord = async (req, res) => {
  try {
    const targetWord = req.params.word || req.body.word;

    if (!targetWord) {
      return res.status(400).json({ message: "Word is required for delete" });
    }

    const deletedWord = await Word.findOneAndDelete({ word: targetWord });

    if (!deletedWord) {
      return res.status(404).json({ message: "Word not found" });
    }

    res.status(200).json({ message: "Word deleted successfully", data: deletedWord });
  } catch (error) {
    res.status(500).json({ message: "Error deleting word", error: error.message });
  }
};


module.exports = {
  addWord,
  getAllWords,
  searchWord,
  updateWord,
  deleteWord
};
