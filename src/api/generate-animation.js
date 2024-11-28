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

    ### Animation Requirements:
    1. Logical and natural movements with coordinated body parts (e.g., tail wagging during jumps, arms swinging while dancing).
    2. Facial animations (mouth and eyes) to convey emotions or simulate talking.
    3. Multiple keyframes to chain animations smoothly (e.g., jumps, spins, dances).
    4. Use appropriate transformations (\`translate\`, \`rotate\`, \`scale\`) and easing functions (\`ease-in-out\`, \`cubic-bezier\`).

    ### Animation Description:
    Create an animation based on this input: ${prompt}

    Return ONLY the CSS code without any explanation.
  `;

  const openai = new OpenAI({
    apiKey,
    dangerouslyAllowBrowser: true,
  });

  const response = await openai.chat.completions.create({
    model: 'gpt-4',
    messages: [
      { role: 'system', content: 'You are a CSS animation expert for SVG elements.' },
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
