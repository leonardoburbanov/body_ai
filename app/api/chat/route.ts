import { NextRequest } from "next/server";
import { google } from "@ai-sdk/google";
import { streamText, tool, convertToModelMessages, stepCountIs } from "ai";
import { z } from "zod";
import { mongodbConnection } from "@/src/infrastructure/database/mongodb-connection";
import { MongoDBRoutineRepository } from "@/src/infrastructure/repositories/mongodb-routine-repository";
import { MongoDBRecipeRepository } from "@/src/infrastructure/repositories/mongodb-recipe-repository";

/**
 * POST /api/chat
 * Chat endpoint with Gemini 3 Flash Preview and RAG tools
 */
export async function POST(request: NextRequest) {
  try {
    // Ensure database connection
    await mongodbConnection.connect();

    // Get request body
    const body = await request.json();
    console.log("Chat API - Received body:", JSON.stringify(body, null, 2));
    
    // Try to get userId from body first, then from headers as fallback
    const userIdFromBody = body.userId;
    const userIdFromHeader = request.headers.get("x-user-id");
    const userId = userIdFromBody || userIdFromHeader;
    
    const { messages } = body;

    console.log("Chat API - userId from body:", userIdFromBody);
    console.log("Chat API - userId from header:", userIdFromHeader);
    console.log("Chat API - final userId:", userId);
    console.log("Chat API - messages count:", messages?.length);

    if (!userId) {
      console.error("Chat API - Missing userId in both body and headers");
      return new Response(
        JSON.stringify({ error: "UserId is required. Please ensure you are logged in." }),
        { 
          status: 400,
          headers: { "Content-Type": "application/json" }
        }
      );
    }

    // Initialize repositories
    const routineRepository = new MongoDBRoutineRepository();
    const recipeRepository = new MongoDBRecipeRepository();

    // Define RAG tools
    const tools = {
      getRoutines: tool({
        description:
          "Get all workout routines for the current user. Use this when the user asks about their routines, workout plans, exercises, or training schedule.",
        inputSchema: z.object({}),
        execute: async () => {
          const routines = await routineRepository.findByUserId(userId);
          return {
            routines: routines.map((routine) => ({
              id: routine.id,
              name: routine.name,
              nivel: routine.nivel,
              dias_por_semana: routine.dias_por_semana,
              objetivo: routine.objetivo,
              rutina: routine.rutina,
              nutrition: routine.nutrition,
              supplements: routine.supplements,
              motivation: routine.motivation,
              createdAt: routine.createdAt,
            })),
          };
        },
      }),
      getRecipes: tool({
        description:
          "Get all meal plans and recipes for the current user. Use this when the user asks about their recipes, meal plans, nutrition, calories, protein, or food.",
        inputSchema: z.object({}),
        execute: async () => {
          const recipes = await recipeRepository.findByUserId(userId);
          return {
            recipes: recipes.map((recipe) => ({
              id: recipe.id,
              name: recipe.name,
              calorias_diarias_objetivo: recipe.calorias_diarias_objetivo,
              proteina_diaria_objetivo: recipe.proteina_diaria_objetivo,
              comidas_por_dia: recipe.comidas_por_dia,
              frutas_por_dia: recipe.frutas_por_dia,
              semana: recipe.semana,
              notes: recipe.notes,
              createdAt: recipe.createdAt,
            })),
          };
        },
      }),
    };

    // Convert UI messages to model messages with tools
    const modelMessages = await convertToModelMessages(messages, { tools });
    
    // Stream response using Gemini 3 Flash Preview
    const result = await streamText({
      model: google("gemini-3-flash-preview"),
      messages: modelMessages,
      tools,
      stopWhen: stepCountIs(5), // Allow multiple steps: tool call -> tool execution -> final response
      system: `You are a helpful fitness and nutrition assistant for Body AI. 
You help users with their workout routines and meal plans. 
When users ask about their routines or recipes, use the available tools to fetch their data from the database.
Be friendly, informative, and provide detailed answers based on the user's actual data.
Always respond in the same language the user is using.`,
    });

    return result.toUIMessageStreamResponse();
  } catch (error) {
    console.error("Chat error:", error);
    return new Response(
      error instanceof Error ? error.message : "Internal server error",
      { status: 500 }
    );
  }
}
