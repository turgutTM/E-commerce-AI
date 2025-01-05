import { NextResponse } from "next/server";
import connect from "../../../../db";
import Product from "../../../../models/Product";
import { cosineSimilarity } from "../../../services/recommendation";

export const GET = async (req, { params }) => {
  const { productId } = params;
  console.log("coming id", productId);
  

  try {
   
    await connect();

   
    const currentProduct = await Product.findById(productId);
    
    if (!currentProduct || !currentProduct.embedding) {
      return new NextResponse("Product or embedding not found", {
        status: 404,
      });
    }


   
    const allProducts = await Product.find({ _id: { $ne: productId } });
    const similarProducts = allProducts
    .map((product) => {
      if (product.embedding) {
        const similarity = cosineSimilarity(
          currentProduct.embedding,
          product.embedding
        );
        return { product, similarity };
      }
      return null;
    })
    .filter((item) => item !== null)
    .sort((a, b) => b.similarity - a.similarity);
  
  const shuffled = similarProducts
    .map((item) => ({ ...item, randomFactor: Math.random() }))
    .sort((a, b) => b.similarity + b.randomFactor - (a.similarity + a.randomFactor))
    .slice(0, 15);
  
  return new NextResponse(
    JSON.stringify(shuffled.map((item) => item.product)),
    { status: 200 }
  );
  

  } catch (error) {
    console.error("Error fetching recommendations:", error);
    return new NextResponse("Server error", { status: 500 });
  }
};
