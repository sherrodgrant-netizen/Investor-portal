import Anthropic from "@anthropic-ai/sdk";
import { WireVerificationResult } from "@/types/ready-to-buy";

const client = new Anthropic();

export async function verifyWireTransfer(
  imageBase64: string,
  mediaType: "image/png" | "image/jpeg" | "image/webp" | "image/gif" | "application/pdf"
): Promise<WireVerificationResult> {
  const response = await client.messages.create({
    model: "claude-sonnet-4-5-20250929",
    max_tokens: 1024,
    messages: [
      {
        role: "user",
        content: [
          {
            type: "image",
            source: {
              type: "base64",
              media_type: mediaType === "application/pdf" ? "image/png" : mediaType,
              data: imageBase64,
            },
          },
          {
            type: "text",
            text: `Analyze this image and determine if it is a wire transfer confirmation. You are verifying this for a real estate transaction.

Respond ONLY with valid JSON in this exact format (no markdown, no code blocks):
{
  "isWireTransfer": true/false,
  "statusText": "Sent" | "Completed" | "Confirmed" | "Pending" | "Processing" | "Unknown",
  "amount": "$XX,XXX.XX or null if not visible",
  "date": "MM/DD/YYYY or null if not visible",
  "sender": "Name or null",
  "recipient": "Name or null",
  "confirmationNumber": "Number or null",
  "reasoning": "Brief explanation of your analysis"
}

Rules:
- isWireTransfer should be false if this is an ACH transfer, Zelle payment, Venmo, check, or any non-wire transfer
- isWireTransfer should be false if this doesn't appear to be a financial document at all
- statusText should reflect the actual status shown in the document
- Extract all visible fields, use null for anything not clearly visible
- Be strict: if you're not confident it's a wire transfer, mark isWireTransfer as false`,
          },
        ],
      },
    ],
  });

  const text = response.content[0].type === "text" ? response.content[0].text : "";

  try {
    const parsed = JSON.parse(text.trim());

    const isVerified =
      parsed.isWireTransfer === true &&
      ["Sent", "Completed", "Confirmed"].includes(parsed.statusText);

    return {
      isWireTransfer: parsed.isWireTransfer,
      status: isVerified ? "verified" : parsed.isWireTransfer ? "pending" : "invalid",
      statusText: parsed.statusText || "Unknown",
      amount: parsed.amount || undefined,
      date: parsed.date || undefined,
      sender: parsed.sender || undefined,
      recipient: parsed.recipient || undefined,
      confirmationNumber: parsed.confirmationNumber || undefined,
      reasoning: parsed.reasoning || "",
    };
  } catch {
    return {
      isWireTransfer: false,
      status: "invalid",
      statusText: "Unknown",
      reasoning: "Failed to analyze the uploaded image. Please try again with a clearer image.",
    };
  }
}
