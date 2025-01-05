import Product from "../../models/Product";

export function cosineSimilarity(vec1, vec2) {
  const dotProduct = vec1.reduce((sum, v, i) => sum + v * vec2[i], 0);
  const magnitude1 = Math.sqrt(vec1.reduce((sum, v) => sum + v * v, 0));
  const magnitude2 = Math.sqrt(vec2.reduce((sum, v) => sum + v * v, 0));
  return dotProduct / (magnitude1 * magnitude2);
}

export async function findSimilarProducts(productId) {
  const currentProduct = await Product.findById(productId);
  if (!currentProduct || !currentProduct.embedding) {
    throw new Error("Product or embedding not found");
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
    .sort((a, b) => b.similarity - a.similarity)
    .slice(0, 11);

  return similarProducts.map((item) => item.product);
}
