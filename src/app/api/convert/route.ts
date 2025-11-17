import { NextRequest, NextResponse } from 'next/server'
import ZAI from 'z-ai-web-dev-sdk'

export async function POST(request: NextRequest) {
  try {
    const { prompt } = await request.json()

    if (!prompt || typeof prompt !== 'string') {
      return NextResponse.json(
        { error: 'Prompt is required and must be a string' },
        { status: 400 }
      )
    }

    const zai = await ZAI.create()

    const systemPrompt = `You are a prompt engineering expert. Your task is to convert the given user prompt into a structured JSON format that LLMs can understand better. 

Follow these guidelines:
1. Extract the main intent and objectives from the prompt
2. Identify key parameters, constraints, and requirements
3. Structure the output in a clear, hierarchical JSON format
4. Include relevant metadata like task type, complexity, and domain
5. Use descriptive field names and maintain consistency
6. If the prompt is ambiguous, make reasonable assumptions and note them

The JSON structure should include:
- "task_type": The type of task (e.g., "content_creation", "data_analysis", "code_generation", etc.)
- "intent": The main goal or purpose
- "parameters": Key parameters and their values
- "constraints": Any limitations or requirements
- "context": Background information if relevant
- "expected_output": What the user expects to get back
- "complexity": "simple", "medium", or "complex"
- "domain": The domain area (e.g., "business", "technical", "creative", etc.)
- "metadata": Additional useful information

Return only valid JSON without any additional text or explanations.`

    const completion = await zai.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: systemPrompt
        },
        {
          role: 'user',
          content: `Convert this prompt to structured JSON: ${prompt}`
        }
      ],
      temperature: 0.3,
      max_tokens: 2000,
    })

    const jsonOutput = completion.choices[0]?.message?.content

    if (!jsonOutput) {
      throw new Error('No response generated')
    }

    // Validate that the output is valid JSON
    try {
      JSON.parse(jsonOutput)
    } catch (parseError) {
      // If it's not valid JSON, try to extract JSON from the response
      const jsonMatch = jsonOutput.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        const extractedJson = jsonMatch[0]
        JSON.parse(extractedJson) // Validate extracted JSON
        return NextResponse.json({ jsonOutput: extractedJson })
      } else {
        throw new Error('Generated output is not valid JSON')
      }
    }

    return NextResponse.json({ jsonOutput })

  } catch (error) {
    console.error('Error converting prompt:', error)
    
    // Return a fallback JSON structure if AI conversion fails
    const fallbackJson = JSON.stringify({
      task_type: "general",
      intent: "User request processing",
      parameters: {
        original_prompt: prompt || "No prompt provided"
      },
      constraints: [],
      context: "Generated due to conversion error",
      expected_output: "Processed user request",
      complexity: "medium",
      domain: "general",
      metadata: {
        error: "AI conversion failed, using fallback structure",
        timestamp: new Date().toISOString()
      }
    }, null, 2)

    return NextResponse.json({ 
      jsonOutput: fallbackJson,
      warning: "AI conversion failed, using fallback structure"
    })
  }
}