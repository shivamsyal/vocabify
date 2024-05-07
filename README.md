[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-24ddc0f5d75046c5622901739e7c5dd533143b0c8e959d652212380cedb1ea36.svg)](https://classroom.github.com/a/3e23_jye)
## Introduction
### Our Inspiration
In 2020, there were more than 4.9 million English language learners (ELLs) in U.S. public schools, comprising nearly 10% of students in the public school system. With a rise in digital content delivery formats for lectures and recitations, many ELL students are left behind due to a lack of understanding of terminology being used. We aim to create a comprehensive positive feedback system that both engages students in their lectures, while simultaneously helping them review new words they learn.

### What does Vocabify do?
Vocabify uses both inputted class video transcription data and video caption data to:
1. Aggregate class lecture data
2. Define a list of difficult to pronounce terms and their respective definitions with GPT 3.5 Turbo's API
3. Outputs them in a user friendly UI for users to interact with newly created flashcards

## Technical Architecture

![Technical Architecture](arch.png?raw=true "Technical Architecture")

## Team
* Shivam Syal: Creating and implementing all Node backend components, API endpoints and frontend integration
* Ethan Handojo: Designing and developing all frontend components
* Yash Mandavia: Fine-tuning our LLM prompting and handling GPT API requests

## Getting Started

First, check which version of Node.js you are using:

```bash
nvm version
```

If your node version is lower than the necessary version, please use:
```bash
nvm install 18.17.0
nvm use 18.17.0
```

Then, run the development server in one terminal window:
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

And finally, run the backend server in a different terminal window:
```bash
node backend/server
```

Open [http://localhost:3000](http://localhost:3000) with your browser to view Vocabify. That's it!
