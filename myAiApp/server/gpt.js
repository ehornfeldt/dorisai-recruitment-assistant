const { OpenAI } = require("openai");

const openai = new OpenAI();
const fs = require('node:fs/promises');

// Generate chat completions using OpenAI API
// This function sends a prompt to OpenAI's chat completions endpoint
// and retrieves a model-generated response.

// Parameters:
// - `messages`: An array of message objects containing 'role' (either 'system', 'user', or 'assistant')
//               and 'content' (the actual message text) properties.

// - `model`: The specific language model to use (e.g., 'gpt-3.5-turbo').

// - `temperature`: A parameter controlling the randomness of the generated responses.
//                  Higher values (e.g., 0.8) make the output more random, while lower values (e.g., 0.2) make it more deterministic.

// - `max_tokens`: Limits the length of the generated completion to a specified number of tokens.

// Returns a Promise resolving to the generated completion from the OpenAI model.

async function getResponse(info, question) {
  const completion = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    max_tokens: 300,
    temperature: 0.7,
    messages: [{role: "user", content: `Your name is Doris and you are Elins personal recruitment assistant. 
      Aswer the question: "${question}" based on this: "${info}". Answer short and 
      concise and like you are a friend of Elin. If you don't know the answer, answer that you regretfully don't know but that the person 
      gladly can ask Elin personally in an potentially interview.`}] // Svara som om du känner Elin och att frågan ställs av en rekryterare"
  });

  return completion.choices[0].message.content
}

//Get info file
async function getInfo() {
  try {
    const file = await fs.readFile(process.cwd() + '/aboutMe.json', 'utf8'); //process.cwd() added to work in vercel
    const data = JSON.parse(file);
    return data.info
  } catch (err) {
    console.log(err);
  }
}

//Run ai application
const runAi = async(question) => {
  const info = await getInfo()
  const answer = await getResponse(info, question)
  return answer
}

module.exports = runAi
