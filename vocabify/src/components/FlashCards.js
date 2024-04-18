"use client"
import React, { useState } from 'react';

const FlashCards = () => {
  const [flashcards, setFlashcards] = useState([]);
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [editingIndex, setEditingIndex] = useState(null);

  const handleAddFlashcard = () => {
    if (question.trim() === '' || answer.trim() === '') {
      alert('Please enter both question and answer.');
      return;
    }

    const newFlashcard = { question, answer, flipped: false };
    setFlashcards([...flashcards, newFlashcard]);
    setQuestion('');
    setAnswer('');
  };

  const handleRemoveFlashcard = (index) => {
    const updatedFlashcards = [...flashcards];
    updatedFlashcards.splice(index, 1);
    setFlashcards(updatedFlashcards);
  };

  const handleEditFlashcard = (index) => {
    const flashcardToEdit = flashcards[index];
    setQuestion(flashcardToEdit.question);
    setAnswer(flashcardToEdit.answer);
    setEditingIndex(index);
  };

  const handleUpdateFlashcard = () => {
    if (question.trim() === '' || answer.trim() === '') {
      alert('Please enter both question and answer.');
      return;
    }

    const updatedFlashcards = [...flashcards];
    updatedFlashcards[editingIndex] = { ...updatedFlashcards[editingIndex], question, answer };
    setFlashcards(updatedFlashcards);
    setQuestion('');
    setAnswer('');
    setEditingIndex(null);
  };

  const handleFlipCard = (index) => {
    setFlashcards((prevFlashcards) => {
      return prevFlashcards.map((flashcard, idx) => {
        if (idx === index) {
          // Toggle flipped and set showAnswer to true
          return { ...flashcard, flipped: !flashcard.flipped, showAnswer: true };
        }
        // Reset showAnswer for other cards
        return { ...flashcard, showAnswer: false };
      });
    });
  };
  
  

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-300 to-purple-300">
        <div className="flashcards-container">
        <h1>Flashcards</h1>
        <div className="input-container">
            <input
            type="text"
            placeholder="Enter question"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            className={`input-field ${question.trim() === '' ? 'empty-input' : ''}`}
            />
            <input
            type="text"
            placeholder="Enter answer"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            className="input-field"
            />
            {editingIndex === null ? (
            <button className="btn" onClick={handleAddFlashcard}>
                Add Flashcard
            </button>
            ) : (
            <button className="btn" onClick={handleUpdateFlashcard}>
                Update Flashcard
            </button>
            )}
        </div>
        <div className="flashcard-list">
            {flashcards.map((flashcard, index) => (
            <div key={index} className="flashcard">
                <div className={`card ${flashcard.flipped ? 'flipped' : ''}`} onClick={() => handleFlipCard(index)}>
                <div className="front">{!flashcard.showAnswer ? flashcard.question : ''}</div>
                <div className="back">{flashcard.showAnswer ? flashcard.answer : ''}</div>
                </div>
                <div className="flashcard-actions">
                <button className="action-btn edit-btn" onClick={() => handleEditFlashcard(index)}>
                    Edit
                </button>
                <button className="action-btn remove-btn" onClick={() => handleRemoveFlashcard(index)}>
                    Remove
                </button>
                </div>
            </div>
            ))}
        </div>
        <style jsx>{`
            .flashcards-container {
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
            background: linear-gradient(to bottom right, #87ceeb, #9370db); /* Blue to purple gradient */
            border-radius: 10px;
            box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
            }
            h1 {
            text-align: center;
            margin-bottom: 20px;
            color: #fff; /* White text color */
            }
            .input-container {
            display: flex;
            gap: 10px;
            margin-bottom: 20px;
            }
            .input-field {
            width: 200px;
            padding: 10px;
            border: 1px solid #ccc;
            border-radius: 5px;
            outline: none;
            transition: border-color 0.3s;
            }
            .input-field:focus {
            border-color: #007bff;
            }
            .empty-input {
            border-color: red;
            }
            .btn {
            padding: 10px 20px;
            background-color: #007bff;
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            outline: none;
            transition: background-color 0.3s;
            }
            .btn:hover {
            background-color: #0056b3;
            }
            .flashcard-list {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
            gap: 20px;
            }
            .flashcard {
            background-color: #f8f9fa;
            border-radius: 5px;
            overflow: hidden;
            }
            .card {
            height: 100px;
            background-color: #f0f0f0;
            border-radius: 5px;
            display: flex;
            justify-content: center;
            align-items: center;
            cursor: pointer;
            transition: transform 0.5s;
            color: black;
            position: relative;
            }
            .card.flipped {
            transform: rotateY(180deg);
            }
            .front,
            .back {
            padding: 10px;
            position: absolute;
            backface-visibility: hidden;
            }
            .back {
            display: none;
            transform: rotateY(180deg);
            color: black;
            }
            .flashcard-actions {
            display: flex;
            justify-content: space-around;
            padding: 5px 0;
            }
            .action-btn {
            padding: 5px 10px;
            border: none;
            border-radius: 3px;
            cursor: pointer;
            outline: none;
            transition: background-color 0.3s;
            }
            .edit-btn {
            background-color: #ffc107;
            color: black;
            }
            .remove-btn {
            background-color: #dc3545;
            color: white;
            }
            .action-btn:hover {
            opacity: 0.8;
            }
        `}</style>
        </div>
    </div>
  );
};

export default FlashCards;

