import { client } from "@gradio/client";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const hfClient = await client("yisol/IDM-VTON", {
      hf_token: process.env.HUGGINGFACE_TOKEN
    });
    
    // This is the exact Python code you found, translated into JavaScript!
    const result = await hfClient.predict("/tryon", [
      { 
        background: "https://res.cloudinary.com/demo/image/upload/v1/model-placeholder.jpg", // The human model 
        layers: [], 
        composite: null 
      },
      "https://res.cloudinary.com/demo/image/upload/v1/sample-dress.jpg", // The uploaded dress
      "Traditional ethnic wear", // garment_des
      true,  // is_checked
      false, // is_checked_crop
      30,    // denoise_steps
      42     // seed
    ]);
    
    return NextResponse.json({ imageUrl: result.data[0].url });
  } catch (error) {
    return NextResponse.json({ error: "API Error: " + error.message }, { status: 500 });
  }
}