import axios from "axios";
import Product from "../../models/Product";

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function generateEmbedding(productText, retries = 3) {
  for (let attempt = 0; attempt < retries; attempt++) {
    try {
      if (attempt > 0) {
        const waitTime = 1000 * Math.pow(2, attempt - 1);
        console.warn(
          
          `[generateEmbedding] attempt #${
            attempt + 1
          }, waiting ${waitTime} ms before retry...`
        );
        await delay(waitTime);
      }

      const response = await axios.post(
        "https://api.openai.com/v1/embeddings",
        {
          model: "text-embedding-ada-002",
          input: productText,
        },
        {
          headers: {
            Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
            "Content-Type": "application/json",
          },
        }
      );

      return response.data.data[0].embedding;
    } catch (error) {
      if (error.response?.status === 429 && attempt < retries - 1) {
        const retryAfter = error.response.headers["retry-after"];
        if (retryAfter) {
          console.warn(
            `[generateEmbedding] rate limit. retry-after header: ${retryAfter} s`
          );
          await delay(parseInt(retryAfter) * 1000);
        }
      } else {
        console.error("Error in generateEmbedding:", error);
        throw error;
      }
    }
  }

  throw new Error("Max retries reached in generateEmbedding");
}

export async function updateProductsWithEmbeddings() {
  const products = await Product.find();

  for (const product of products) {
    if (!product.embedding || product.embedding.length === 0) {
      const productText = `${product.name} ${product.details} ${product.category}`;
      try {
        const embedding = await generateEmbedding(productText);
        product.embedding = embedding;
        await product.save();
        console.log(`Updated embedding for product: ${product.name}`);
      } catch (err) {
        console.error(`Failed to update embedding for ${product.name}:`, err);
      }
    }
  }
}
