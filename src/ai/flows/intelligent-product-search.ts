'use server';

/**
 * @fileOverview AI-powered product search flow that understands natural language queries.
 *
 * - intelligentProductSearch - A function to search for products using natural language.
 * - IntelligentProductSearchInput - The input type for the intelligentProductSearch function.
 * - IntelligentProductSearchOutput - The return type for the intelligentProductSearch function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const IntelligentProductSearchInputSchema = z.object({
  query: z.string().describe('The user query for product search (e.g., fastest router for gaming).'),
});
export type IntelligentProductSearchInput = z.infer<typeof IntelligentProductSearchInputSchema>;

const IntelligentProductSearchOutputSchema = z.object({
  products: z
    .array(z.string())
    .describe('A list of product names that match the user query.'),
});
export type IntelligentProductSearchOutput = z.infer<typeof IntelligentProductSearchOutputSchema>;

export async function intelligentProductSearch(input: IntelligentProductSearchInput): Promise<IntelligentProductSearchOutput> {
  return intelligentProductSearchFlow(input);
}

const productSearchPrompt = ai.definePrompt({
  name: 'productSearchPrompt',
  input: {schema: IntelligentProductSearchInputSchema},
  output: {schema: IntelligentProductSearchOutputSchema},
  prompt: `You are an AI assistant specializing in product search for an e-commerce website.

  Based on the user's query, identify the most relevant products from the catalog.
  Return a list of product names that closely match the user's intent.

  User Query: {{{query}}}

  Available Products: Computers, Routers, Switches, Networking Devices, Tech Gadgets
  Consider specifications, features, and intended use in your search.
`,
});

const intelligentProductSearchFlow = ai.defineFlow(
  {
    name: 'intelligentProductSearchFlow',
    inputSchema: IntelligentProductSearchInputSchema,
    outputSchema: IntelligentProductSearchOutputSchema,
  },
  async input => {
    const {output} = await productSearchPrompt(input);
    return output!;
  }
);
