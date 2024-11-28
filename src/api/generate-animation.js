import OpenAI from 'openai';

export const generateAnimation = async (apiKey, prompt) => {
  const animationPrompt = `
    You are an expert in creating advanced SVG animations. Generate precise, fluid CSS animations for a squirrel character based on the following details:

    ### Character Structure:
    - **Body**: Ellipse (#body)
    - **Head**: Circle (#head)
    - **Tail**: Path (#tail)
    - **Arms**: Paths (#leftArm, #rightArm)
    - **Legs**: Paths (#leftLeg, #rightLeg)
    - **Eyes**: Circles (#leftPupil, #rightPupil)
    - **Mouth**: Path (#mouthPath)
    - **Eyebrows**: Paths (#leftEyebrow, #rightEyebrow)

    ### Animation Requirements:
    1. Logical and natural movements with coordinated body parts (e.g., tail wagging during jumps, arms swinging while dancing).
    2. Facial animations (mouth, eyes, eyebrows) to convey emotions or simulate talking.
    3. Multiple keyframes to chain animations smoothly (e.g., jumps, spins, dances).
    4. Use appropriate transformations (\`translate\`, \`rotate\`, \`scale\`) and easing functions (\`ease-in-out\`, \`cubic-bezier\`).
    5. Safe ranges for transforms:
       - **Translate**: -100px to 100px
       - **Rotate**: -180deg to 180deg
       - **Scale**: 0.8 to 1.2

    ### Examples of Animations and Their CSS:
    1. **Idle Animation**: Gentle body bobbing with a slight tail wag.
       CSS Example:
       \`\`\`css
       .idle .squirrel {
         animation: idleBody 3s ease-in-out infinite;
       }
       @keyframes idleBody {
         0%, 100% { transform: translateY(0); }
         50% { transform: translateY(-8px); }
       }
       .idle #tail {
         animation: idleTail 3s ease-in-out infinite;
       }
       @keyframes idleTail {
         0%, 100% { transform: rotate(0); }
         50% { transform: rotate(15deg); }
       }
       \`\`\`

    2. **Happy Animation**: Squirrel jumps while wagging its tail and swinging its arms.
       CSS Example:
       \`\`\`css
       .happy .squirrel {
         animation: happyBody 2s ease-in-out infinite;
       }
       @keyframes happyBody {
         0%, 100% { transform: translateY(0) scale(1); }
         50% { transform: translateY(-20px) scale(1.1); }
       }
       .happy #tail {
         animation: happyTail 0.7s ease-in-out infinite;
       }
       @keyframes happyTail {
         0%, 100% { transform: rotate(-10deg); }
         50% { transform: rotate(25deg); }
       }
       .happy #leftArm, .happy #rightArm {
         animation: happyArms 1s ease-in-out infinite alternate;
       }
       @keyframes happyArms {
         0%, 100% { transform: rotate(0); }
         50% { transform: rotate(-20deg); }
       }
       \`\`\`

    3. **Wave Animation**: Right arm waves up and down while the body tilts side to side.
       CSS Example:
       \`\`\`css
       .wave .squirrel {
         animation: waveBody 2s ease-in-out infinite;
       }
       @keyframes waveBody {
         0%, 100% { transform: rotate(0) translateX(0); }
         25% { transform: rotate(5deg) translateX(10px); }
         75% { transform: rotate(-5deg) translateX(-10px); }
       }
       .wave #rightArm {
         animation: waveArm 1s ease-in-out infinite;
       }
       @keyframes waveArm {
         0%, 100% { transform: rotate(0); }
         25% { transform: rotate(-105deg); }
         75% { transform: rotate(-30deg); }
       }
       \`\`\`

    ### Animation Description:
    Create an animation based on this input: ${prompt}

    Return ONLY the CSS code in the above format, without any explanations or additional text.
  `;

  const openai = new OpenAI({
    apiKey,
    dangerouslyAllowBrowser: true,
  });

  const response = await openai.chat.completions.create({
    model: 'gpt-4',
    messages: [
      { role: 'system', content: 'You are a CSS animation expert for SVG elements, tasked with generating detailed animations for a squirrel character. Return CSS in the format shown in examples.' },
      { role: 'user', content: animationPrompt },
    ],
    temperature: 0.7,
    max_tokens: 1000,
  });

  if (!response.choices || !response.choices.length) {
    throw new Error('No response from OpenAI');
  }

  return response.choices[0].message.content.trim();
};
